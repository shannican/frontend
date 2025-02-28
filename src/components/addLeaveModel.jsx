import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import API from "../api";
import "./addLeaveModel.css";

const AddLeaveModal = ({ closeModal, fetchLeaves }) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    date: "",
    reason: "",
    documents: "",
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
      await API.post("/leaves", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchLeaves();
      closeModal();
    } catch (error) {
      console.error("Error creating leave:", error);
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="leave-header-text">
          <h2>Add New Leave</h2>
        </div>
        <form onSubmit={handleSubmit}>
         <div className="leave-form">
         <select
            required
            value={formData.employeeId}
            onChange={(e) =>
              setFormData({ ...formData, employeeId: e.target.value })
            }
          >
            <option value="">Select Employee</option>
            {employees &&
              employees.length > 0 &&
              employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
          </select>

          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <textarea
            placeholder="Reason for leave"
            required
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Documents URL (optional)"
            value={formData.documents}
            onChange={(e) =>
              setFormData({ ...formData, documents: e.target.value })
            }
          />
         </div>

          <div className="modal-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddLeaveModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  fetchLeaves: PropTypes.func.isRequired,
};

export default AddLeaveModal;
