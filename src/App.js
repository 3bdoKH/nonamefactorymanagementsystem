import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import AddCar from "./pages/addcar/AddCar";
import CarsFilter from "./pages/carsfilter/CarsFilter";
function App() {
  return (
    <div className="App">
      <Sidebar />
      <div className="container">
        <Routes>
          <Route path="/add-car" element={<AddCar />} />
          <Route path="/cars-filter" element={<CarsFilter />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
