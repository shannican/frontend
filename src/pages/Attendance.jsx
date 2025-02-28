import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";
import "./AttendancePage.css";

const Attendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get("/employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }); 
      
      setEmployees(data?.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data } = await API.get("/attendance", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });      
      setAttendanceList(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const handleStatusChange = async (employeeId, status , date) => {
    try {
      console.log("Marking attendance for employee:", employeeId, status, date);
      
      await API.post("/attendance/mark", 
        { employeeId, status , date },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
      );
      setSelectedEmployee(null);
      fetchAttendance();
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      await API.delete(`/attendance/${employeeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchAttendance();
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    console.log("Submitting attendance with data:", formData);

    try {
      if (!formData.employeeId || !formData.status) {
        console.error("Missing form data fields");
        return;
      }

      const response = await API.post("/attendance/mark", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      console.log("Attendance marked successfully:", response.data);
      setShowModal(false);
      fetchAttendance();
      setFormData({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="attendance-content">
        <div className="header">
          <h2 id="attendance-header">Todays Attendance</h2>
          <button 
            className="mark-attendance-btn"
            onClick={() => setShowModal(true)}
          >
            Mark Attendance
          </button>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Mark Attendance</h3>
              <form onSubmit={handleSubmitAttendance}>
                <div className="form-group">
                  <label>Select Employee:</label>
                  <select 
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees && employees.length > 0 && employees.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date:</label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status:</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    required
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <div className="modal-buttons">
                  <button type="submit" className="submit-btn">Submit</button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {attendanceList.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.employeeName}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td className="status-cell">
                    <div className="status-wrapper">
                      <button 
                        className={`status-button ${employee.status.toLowerCase()}`}
                        onClick={() => setSelectedEmployee(employee._id)}
                      >
                        {employee.status}
                      </button>
                      {selectedEmployee === employee._id && (
                        <div className="status-options">
                          <button 
                            className="present-option"
                            onClick={() => handleStatusChange(employee.employeeId, "Present",employee.date)}
                          >
                            Mark Present
                          </button>
                          <button 
                            className="absent-option"
                            onClick={() => handleStatusChange(employee.employeeId, "Absent",employee.date)}  
                          >
                            Mark Absent
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{employee.date?.split('T')[0]}</td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(employee._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;

