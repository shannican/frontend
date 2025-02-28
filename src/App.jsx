import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Candidates from "./pages/Candidates";
import Employees from "./pages/EmployeesPage.jsx";
import AddCandidateForm from "./components/AddCandidatesModel.jsx";
import Attendance from "./pages/Attendance.jsx";
import LeavePage from "./pages/Leave.jsx";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/candidates" 
          element={
            <Candidates>
              <AddCandidateForm onCandidateAdded={() => setRefresh(!refresh)} />
            </Candidates>
          } 
        />
        
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<LeavePage />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
