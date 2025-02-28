import { useState } from "react";
import PropTypes from "prop-types";
import "./AddCandidatesModel.css";
import API from "../api";

const AddCandidateForm = ({ closeModal, fetchCandidates }) => {
  const [candidate, setCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    resume: null,
  });
  const [isChecked, setIsChecked] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handleFileChange = (e) => {
    setCandidate({ ...candidate, resume: e.target.files[0] });
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(candidate).forEach((key) => {
        formData.append(key, candidate[key]);
      });

      await API.post("/candidates", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchCandidates();
      closeModal();
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  return (
    <div className="modal-overlays">
      <div className="modal-contents">
        <div className="modal-headers">
          <h2>Add New Candidate</h2>
          <button className="close-btn" onClick={closeModal}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-groups">
            <input type="text" name="name" placeholder="Full Name*" value={candidate.name} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email Address*" value={candidate.email} onChange={handleInputChange} required />
          </div>
          <div className="form-groups">
            <input type="text" name="phone" placeholder="Phone Number*" value={candidate.phone} onChange={handleInputChange} required />
            <input type="text" name="position" placeholder="Position*" value={candidate.position} onChange={handleInputChange} required />
          </div>
          <div className="form-groups">
            <input id="experience-inputs" type="number" name="experience" placeholder="Experience*" value={candidate.experience} onChange={handleInputChange} required />
            <label className="file-uploads">
              <span>Resume*</span>
              <input type="file" name="resume" onChange={handleFileChange} required />
            </label>
          </div>
          <div className="checkbox-containerr">
            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
            <span>I hereby declare that the above information is true to the best of my knowledge and belief</span>
          </div>
          <button type="submit" className="submit-btns" disabled={!isChecked}>Save</button>
        </form>
      </div>
    </div>
  );
};

AddCandidateForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  fetchCandidates: PropTypes.func.isRequired,
};

export default AddCandidateForm;
