import { useEffect, useState } from "react";
import axios from "axios";
import './TableStyle.css';

interface Users {
  id:number;
  userName: string;
  response: string;
  timestamp: string;
}

const LunchCountTable = () => {
  const [lunchCounts, setLunchCounts] = useState<Users[]>([]);
  const [filteredData, setFilteredData] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [filterApplied, setFilterApplied] = useState(false); 

  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage] = useState(10); // Set items per page (you can adjust this)

  useEffect(() => {
    const fetchLunchCountData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/count");
        setLunchCounts(response.data);
        setFilteredData(response.data);
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
    const from = new Date(fromDate).getTime();
    const to = new Date(toDate).getTime();
    const filtered = lunchCounts.filter((item) => {
      const itemDate = new Date(item.timestamp).getTime();
      return itemDate >= from && itemDate <= to;
    });
    setFilteredData(filtered);
    setFilterApplied(true);
    setCurrentPage(1); // Reset page on filter
  };

  const handleMessage = async () => {
    try {
      await axios.post("http://localhost:3000/api/send");
      alert('Message sent successfully');
    } catch (err) {
      console.log("Error fetching data", err);
    }
  };

  const countYesResponsesPerUser = () => {
    const counts: { [key: string]: number } = {};
    filteredData.forEach((item) => {
      if (item.response.toLowerCase() === "yes") {
        counts[item.userName] = (counts[item.userName] || 0) + 1;
      }
    });
    return counts;
  };

  const handleReset = () => {
    setFilteredData(lunchCounts);
    setFilterApplied(false);
    setFromDate("");
    setToDate("");
    setCurrentPage(1); // Reset page on reset
  };

  // Pagination Logic
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
    <div>
      <h2 className="heading">Lunch Count Data</h2>

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

        <button className="btn" onClick={handleFilter}>Apply Filter</button>
        <button className="btn" onClick={handleMessage}>Send message</button>

        {filterApplied && (
          <button className="back-btn" onClick={handleReset} style={{ marginLeft: "10px" }}>
            Back
          </button>
        )}
      </div>

      {filterApplied ? (
        <div>
          <p>Total "Yes" Responses: {filteredData.filter((item) => item.response.toLowerCase() === "yes").length}</p>
          <table cellPadding="10">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Yes Responses</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(countYesResponsesPerUser()).map(([userName, count]) => (
                <tr key={userName}>
                  <td>{userName}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <p>Total "Yes" Responses: {filteredData.filter((item) => item.response.toLowerCase() === "yes").length}</p>
          <table cellPadding="10">
            <thead>
              <tr>
              <th>S.No</th>
                <th>User Name</th>
                <th>Response</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((lunchCount, index) => (
                <tr key={index}>
                  <td>{lunchCount.id}</td>
                  <td>{lunchCount.userName}</td>
                  <td>{lunchCount.response}</td>
                  <td>{new Date(lunchCount.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Component */}
      <div className="pagination">
        {[...Array(Math.ceil(filteredData.length / itemsPerPage))].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={index + 1 === currentPage ? 'active-page' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LunchCountTable;
