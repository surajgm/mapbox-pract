import { BrowserRouter, Routes, Route } from "react-router-dom";
import Map from "./Map";
import MapWithFilter from "./MapWithFilter";
import SecMap from "./SecMap";
import ToggleLayer from "./ToggleLayer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/secMap" element={<SecMap />} />
        <Route path="/mapWithFilter" element={<MapWithFilter />} />
        <Route path="/toggleLayer" element={<ToggleLayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
