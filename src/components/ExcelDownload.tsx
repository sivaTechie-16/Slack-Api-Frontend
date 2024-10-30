import { useState } from "react";
import axios, { AxiosError } from "axios";
import "./ExcelDownload.css";

const ReportDownloader = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const handleDownload = async () => {

    try {
      const response = await axios.post(
        "http://localhost:3000/api/report",
        {
          month: selectedMonth,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "lunch_count_report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      if ((error as AxiosError).response && (error as AxiosError).response?.status === 404) {
        alert(`No data available for the selected month ${selectedMonth}.`);
      } else {
        alert("Failed to download the report. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1 className="heading">Download Lunch Count Report</h1>
      <label htmlFor="month" className="dropDown-label">
        Select Month:
      </label>
      <select
        id="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(Number(e.target.value))}
      >
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
      <button className="btn-report" onClick={handleDownload}>
        Download Report
      </button>
    </div>
  );
};

export default ReportDownloader;
