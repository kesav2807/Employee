import { useState, useEffect } from 'react';
import { getAllEmployees, deleteEmployee } from '../services/employeeService';
import AddEmployee from './AddEmployee';
import UpdateEmployee from './UpdateEmployee';

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getAllEmployees(currentPage, 10, search);
      setEmployees(data.employees);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, search]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
        alert('Employee deleted successfully');
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const handleUpdate = (employee) => {
    setSelectedEmployee(employee);
    setShowUpdateModal(true);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Employee Management System</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button 
            className="btn-add-emp" 
            onClick={() => setShowAddModal(true)}
          >
            Add Emp
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <table className="employee-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Skills</th>
                <th>Address</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp, index) => (
                  <tr key={emp._id}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>{emp.name}</td>
                    <td>{emp.age}</td>
                    <td>{emp.skills}</td>
                    <td>{emp.address}</td>
                    <td>{emp.designation}</td>
                    <td>
                      <button 
                        className="btn-update" 
                        onClick={() => handleUpdate(emp)}
                      >
                        Update
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(emp._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <span>Showing {employees.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to {(currentPage - 1) * 10 + employees.length} of {employees.length} entries</span>
            <div className="pagination-controls">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
              >
                Previous
              </button>
              <span className="page-number">{currentPage}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, Math.min(prev + 1, totalPages)))}
                disabled={currentPage >= totalPages || totalPages <= 1}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {showAddModal && (
        <AddEmployee 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchEmployees();
          }}
        />
      )}

      {showUpdateModal && (
        <UpdateEmployee 
          employee={selectedEmployee}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedEmployee(null);
          }}
          onSuccess={() => {
            setShowUpdateModal(false);
            setSelectedEmployee(null);
            fetchEmployees();
          }}
        />
      )}
    </div>
  );
}
