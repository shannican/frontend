import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";
import "./MarkAttendance.css";

const ViewAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data } = await API.get(`/attendance/view?date=${dateFilter}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAttendance(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, [dateFilter]); 

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="attendance-content">
        <div className="header">
          <h2>View Attendance</h2>
          <div className="date-filter">
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td>{record.employeeName}</td>
                  <td>{record.department}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
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

export default ViewAttendance;
