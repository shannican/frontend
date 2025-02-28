import { useEffect, useState, useRef } from "react";
import { FaEllipsisV } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import API from "../api";
import AddCandidateModal from "../components/AddCandidatesModel";
import { downloadResume } from "../api/candidateService";
import "./Candidates.css";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null); 

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const { data } = await API.get("/candidates", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCandidates(data.candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      await API.put(`/candidates/${candidateId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Update status in UI
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate._id === candidateId ? { ...candidate, status: newStatus } : candidate
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="candidates-content">
        <div className="header">
          <h2 id="candidate-header">Candidates</h2>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            Add Candidate
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Candidate Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Status</th>
                <th>Experience</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {candidates.length > 0 ? (
                candidates.map((candidate, index) => (
                  <tr key={candidate._id}>
                    <td>{index + 1}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phone}</td>
                    <td>{candidate.position}</td>

                    <td>
                      <select
                        className="status-filter"
                        value={candidate.status}
                        onChange={(e) => handleStatusChange(candidate._id, e.target.value)}
                      >
                        <option value="pending">New</option>
                        <option value="approved">Selected</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    <td>{candidate.experience} Years</td>

                    <td className="action-cell">
                      <button
                        className="menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === index ? null : index);
                        }}
                      >
                        <FaEllipsisV />
                      </button>
                      {openMenu === index && (
                        <div
                          ref={menuRef}
                          className="menu-dropdown"
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          {candidate.resume ? (
                            <button
                              className="edit-btn"
                              onClick={() => downloadResume(candidate._id)}
                            >
                              Download Resume
                            </button>
                          ) : (
                            <span className="no-resume">No Resume</span>
                          )}
                          <button className="delete-btn">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No candidates found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddCandidateModal
          closeModal={() => setShowModal(false)}
          fetchCandidates={fetchCandidates}
        />
      )}
    </div>
  );
};

export default Candidates;
