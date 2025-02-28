import { useState } from "react";
import PropTypes from "prop-types";
import "./EditEmployeeModal.css";
import API from "../api";

const positions = [
  "Software Engineer",
  "Product Manager",
  "HR Manager",
  "UI/UX Designer",
  "Project Manager",
  "Sales Executive",
];

const EditEmployeeModal = ({ employee, closeModal, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    position: employee.position,
    department: employee.department,
    joiningDate: employee.joiningDate || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/employees/${employee._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onUpdate();
      closeModal();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <div className="modal-overlayy">
      <div className="modal-contentt">
        <div className="modal-headerr">
          <h2>Edit Employee Details</h2>
          <button className="close-btn" onClick={closeModal}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="edit-form">
        <div className="formss">
        <div className="form-groupp">
            <label>Full Name*</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-groupp">
            <label>Email Address*</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-groupp">
            <label>Phone Number*</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-groupp">
            <label>Department*</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} required />
          </div>
          <div className="form-groupp">
            <label>Position*</label>
            <select name="position" value={formData.position} onChange={handleChange} required>
              <option value="">Select Position</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
          <div className="form-groupp">
            <label>Date of Joining*</label>
            <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
          </div>
        </div>
          <button type="submit" className="submit-btnn" disabled={!formData.name || !formData.email || !formData.phone || !formData.position || !formData.department || !formData.joiningDate}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

EditEmployeeModal.propTypes = {
  employee: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditEmployeeModal;
