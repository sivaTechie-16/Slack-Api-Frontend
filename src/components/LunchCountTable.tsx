import { useEffect, useState } from "react";
import axios from "axios";
import "./TableStyle.css";
import { Users } from "../Types/User";
 import { useNavigate } from "react-router-dom";

const LunchCountTable = () => {
  const [lunchCounts, setLunchCounts] = useState<Users[]>([]);
  const [filteredData, setFilteredData] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [filterApplied, setFilterApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
   const navigate = useNavigate();


  useEffect(() => {
    const fetchLunchCountData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/count");
        const sortedData = response.data.sort(
          (a: Users, b: Users) => a.id - b.id
        );
        setLunchCounts(sortedData);
        setFilteredData(sortedData);
        setLoading(false);
      } catch (err) {
        setError("Error fetching lunch count data");
        setLoading(false);
        console.log("Error fetching data", err);
      }
    };

    fetchLunchCountData();
  }, []);

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      setFilteredData(lunchCounts);
      setFilterApplied(false);
      return;
    }
    const from = new Date(fromDate).setHours(0, 0, 0, 0);
    const to = new Date(toDate).setHours(23, 59, 59, 999);
    const isSameDay = fromDate === toDate;
    const filtered = lunchCounts.filter((item) => {
      const itemDate = new Date(item.timestamp).getTime();
      if (isSameDay) {
        const startOfDay = new Date(fromDate).setHours(0, 0, 0, 0);
        const endOfDay = new Date(fromDate).setHours(23, 59, 59, 999);
        return itemDate >= startOfDay && itemDate <= endOfDay;
      }
      return itemDate >= from && itemDate <= to;
    });
    setFilteredData(filtered);
    setFilterApplied(true);
    setCurrentPage(1);
  };

  const handleMessage = async () => {
    try {
      await axios.post("http://localhost:3000/api/send");
      alert("Message sent successfully");
    } catch (err) {
      console.log("Error fetching data", err);
    }
  };

  const handleTotalAmount = () => {
    const userData: {
      [key: string]: { yesCount: number; totalAmount: number };
    } = {};

    filteredData.forEach((item) => {
      if (!userData[item.userName]) {
        userData[item.userName] = { yesCount: 0, totalAmount: 0 };
      }
      if (item.response.toLowerCase() === "yes") {
        userData[item.userName].yesCount += 1;
        userData[item.userName].totalAmount += item.amount;
      }
    });

    return userData;
  };

  const handleReset = () => {
    setFilteredData(lunchCounts);
    setFilterApplied(false);
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h2 className="heading">Lunch Count Data</h2>
      <button className="btn" onClick={handleMessage}>
        Send message
      </button>
      <button
              style={{marginTop:'5px'}}
              className="btn"
              onClick={()=>{navigate("/report")}}
            >
              Report
            </button>
      <div className="filter-container">
        <label htmlFor="fromDate">From Date: </label>
        <input
          type="date"
          id="fromDate"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <label htmlFor="toDate" style={{ marginLeft: "10px" }}>
          To Date:{" "}
        </label>
        <input
          type="date"
          id="toDate"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button className="btn" onClick={handleFilter}>
          Apply Filter
        </button>

     

        {filterApplied && (
          <>
        
            <button
              className="btn"
              onClick={handleReset}
              style={{ marginLeft: "10px" }}
            >
              Back
            </button>
          </>
        )}
      </div>

      {filterApplied ? (
        <div>
          <p className="response-count">
            Total "Yes" Responses:{" "}
            {
              filteredData.filter(
                (item) => item.response.toLowerCase() === "yes"
              ).length
            }
          </p>
          <table className="table-container" cellPadding="10">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Yes Responses</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(handleTotalAmount()).map(
                ([userName, { yesCount, totalAmount }]) => (
                  <tr key={userName}>
                    <td>{userName}</td>
                    <td>{yesCount}</td>
                    <td>{totalAmount}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div >
          <table className="table-container" cellPadding="10">
            <thead>
              <tr>
                <th>S.No</th>
                <th>User Name</th>
                <th>Response</th>
                <th>Amount</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((lunchCount, index) => (
                <tr key={index}>
                  <td>{lunchCount.id}</td>
                  <td>{lunchCount.userName}</td>
                  <td>{lunchCount.response}</td>
                  <td>{lunchCount.amount}</td>
                  <td>{new Date(lunchCount.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        {[...Array(Math.ceil(filteredData.length / itemsPerPage))].map(
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={index + 1 === currentPage ? "active-page" : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default LunchCountTable;
