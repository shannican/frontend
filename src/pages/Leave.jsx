import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Leave.css";
import "./Calender.css";
import AddLeaveModal from "../components/addLeaveModel";

const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [leaveCounts, setLeaveCounts] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    fetchLeaves();
    fetchLeaveCounts();
  }, []);

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get("/leaves", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLeaves(data.leaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const fetchLeaveCounts = async () => {
    try {
      const { data } = await API.get("/leaves/count", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const countsMap = {};
      data.forEach((item) => {
        countsMap[item._id] = item.count;
      });
      setLeaveCounts(countsMap);
    } catch (error) {
      console.error("Error fetching leave counts:", error);
    }
  };

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      await API.put(
        `/leaves/${leaveId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchLeaves();
      fetchLeaveCounts();
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  const highlightDates = leaves
    .filter((leave) => leave.status === "Approved")
    .map((leave) => new Date(leave.date));

  const tileContent = ({ date }) => {
    const dateStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    const count = leaveCounts[dateStr];
    return count ? (
      <div className="tile-content">
        <span className="leave-count">{count}</span>
      </div>
    ) : null;
  };

  const renderLeaveRow = (leave, index) => (
    <tr key={leave._id}>
      <td>{index + 1}</td> {/* ✅ Serial number ab sahi show hoga */}
      <td>{leave.name}</td>
      <td>{leave.date}</td>
      <td>{leave.reason}</td>
      <td>
        <select
          value={leave.status}
          onChange={(e) => handleStatusChange(leave._id, e.target.value)}
          className={`status-select ${leave.status.toLowerCase()}`}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </td>
      <td>
        <button className="view-docs">View</button>
      </td>
    </tr>
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="leave-content">
        <div className="leave-header">
          <h2 id="leave-text">Leaves</h2>
          <select className="status-filter" id="search">
            <option value="">Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button className="add-leave-btn" onClick={() => setIsModalOpen(true)}>
            Add Leave
          </button>
        </div>

        <div className="leave-body">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Name</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Docs</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length > 0 ? (
                leaves.map((leave, index) => renderLeaveRow(leave, index)) // ✅ Index pass kar diya
              ) : (
                <tr>
                  <td className="td-text" colSpan="6">
                    No leave records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="leave-calendar">
          <div className="text">
            <h3>Leave Calendar</h3>
          </div>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={({ date }) =>
              highlightDates.some((d) => d.toDateString() === date.toDateString())
                ? "highlight-leave"
                : null
            }
            tileContent={tileContent}
          />
          <div className="approved-leaves">
            <h4 id="approved-text">Approved Leaves</h4>
            {leaves
              .filter((leave) => leave.status === "Approved")
              .map((leave) => (
                <div className="approved-leave-item" key={leave._id}>
                  <span>
                    {leave.name} - {leave.date}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
      {isModalOpen && <AddLeaveModal closeModal={() => setIsModalOpen(false)} fetchLeaves={fetchLeaves} />}
    </div>
  );
};

export default LeavePage;
