import { useLocation } from "react-router-dom";

const FilterData = () => {
  const location = useLocation();
  const filteredData = location.state?.filteredData || [];

  const countYesResponsesPerUser = () => {
    const counts: { [key: string]: number } = {};
    filteredData.forEach((item: { response: string; userName: string ; }) => {
      if (item.response.toLowerCase() === "yes") {
        counts[item.userName] = (counts[item.userName] || 0) + 1;
      }
    });
    return counts;
  };

  const yesResponseCounts = countYesResponsesPerUser();

  return (
    <div>
      <h2>Filtered Data</h2>
      <table cellPadding="10">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Yes Responses Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(yesResponseCounts).map(([userName, count]) => (
            <tr key={userName}>
              <td>{userName}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FilterData;
