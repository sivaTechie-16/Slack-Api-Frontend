// import { BrowserRouter, Route, Routes } from "react-router-dom"
import LunchCountTable from "./components/LunchCountTable"
// import FilterData from "./components/FilterData"

function App() {

  return (
    <>
    {/* <BrowserRouter>
    <Routes>
      <Route path="/" element={<LunchCountTable/>}></Route>
      <Route path="/filterdata" element={<FilterData/>}></Route>
    </Routes>
    </BrowserRouter> */}
    <LunchCountTable/>
    </>
  )
}

export default App
