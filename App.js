import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />         {/* Home page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard page */}
      </Routes>
    </Router>
  );
}

export default App;
