import { useState, useEffect } from "react";
import PropTypes from "prop-types";  
import API from "../api";
import "./MarkAttendance.css";

const MarkAttendance = ({ onClose, refreshAttendance }) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get("/employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/attendance/mark", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Attendance marked successfully!");
      setFormData({
        employeeId: "",
        date: new Date().toISOString().split("T")[0],
        status: "Present",
      });
      refreshAttendance();
      onClose();
    } catch (error) {
      console.error("Error marking attendance", error);
      alert("Error marking attendance");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="mark-header">
          <h3>Mark Attendance</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Employee</label>
            <select
              value={formData.employeeId}
              onChange={(e) =>
                setFormData({ ...formData, employeeId: e.target.value })
              }
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} - {emp.department}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

MarkAttendance.propTypes = {
  onClose: PropTypes.func.isRequired,
  refreshAttendance: PropTypes.func.isRequired,
};

export default MarkAttendance;
