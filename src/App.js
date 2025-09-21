import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import AddCar from "./pages/addcar/AddCar";
function App() {
  return (
    <div className="App">
      <Sidebar />
      <div className="container">
        <Routes>
          <Route path="/add-car" element={<AddCar />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
