/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import './TableStyle.css'

interface Users {
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
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Lunch Count Data</h2>

      <div>
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

        <button onClick={handleFilter}>Apply Filter</button>
        {filterApplied && (
          <button onClick={handleReset} style={{ marginLeft: "10px" }}>
            Back
          </button>
        )}
      </div>

      {filterApplied ? (
        <div>
          <p>Total "Yes" Responses :{filteredData.filter((item) => item.response.toLowerCase() === "yes").length}</p>
          <table cellPadding="10">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Yes Responses Count</th>
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
                <th>User Name</th>
                <th>Response</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((lunchCount, index) => (
                <tr key={index}>
                  <td>{lunchCount.userName}</td>
                  <td>{lunchCount.response}</td>
                  <td>{new Date(lunchCount.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LunchCountTable;
