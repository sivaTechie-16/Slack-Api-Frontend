import { BrowserRouter, Route, Routes } from "react-router-dom";
import LunchCountTable from "./components/LunchCountTable";
import ReportDownloader from "./components/ExcelDownload";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LunchCountTable />}></Route>
          <Route path="/report" element={<ReportDownloader />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
