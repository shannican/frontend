import { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import API from "../api";
import "./EmployeesPage.css";
import EditEmployeeModal from "../components/EditEmployeeModal";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);

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

  const handleEdit = (employee) => {
    setEditEmployee(employee);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await API.delete(`/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="employees-content">
        <div className="header">
          <h2 id="employees-header">Employees</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Department</th>
                <th>Date of Joining</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {employees.length > 0 ? (
                employees.map((employee, index) => (
                  <tr key={employee._id}>
                    <td>{index + 1}</td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.position}</td>
                    <td>{employee.department}</td>
                    <td>{employee.joiningDate}</td>
                    <td
                      className="action-cell"
                      onMouseEnter={() => setOpenMenu(index)}
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                      <button className="menu-btn">
                        <FaEllipsisV />
                      </button>
                      {openMenu === index && (
                        <div className="menu-dropdown">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEdit(employee)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDelete(employee._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editEmployee && (
        <EditEmployeeModal
          employee={editEmployee}
          closeModal={() => setEditEmployee(null)}
          onUpdate={fetchEmployees}
        />
      )}
    </div>
  );
};

export default Employees;
