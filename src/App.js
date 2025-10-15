import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import AddCar from "./pages/addcar/AddCar";
import CarsFilter from "./pages/carsfilter/CarsFilter";
import MonthlyDetail from "./pages/monthlydetails/MonthlyDetail";
import Maintenance from "./pages/maintenance/Maintenance";
function App() {
  return (
    <div className="App">
      <Sidebar />
      <div className="container">
        <Routes>
          <Route path="/add-car" element={<AddCar />} />
          <Route path="/cars-filter" element={<CarsFilter />} />
          <Route path="/monthly-detail" element={<MonthlyDetail />} />
          <Route path="/maintenance" element={<Maintenance />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
