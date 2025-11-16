import { useState, useEffect } from 'react';
import { updateEmployee } from '../services/employeeService';

export default function UpdateEmployee({ employee, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    skills: '',
    address: '',
    designation: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        age: employee.age.toString(),
        skills: employee.skills,
        address: employee.address,
        designation: employee.designation
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.skills || !formData.address || !formData.designation) {
      alert('All fields are required');
      return;
    }

    try {
      await updateEmployee(employee._id, {
        ...formData,
        age: parseInt(formData.age)
      });
      alert('Employee updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Update Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="100"
              required
            />
          </div>
          <div className="form-group">
            <label>Skills:</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Designation:</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-submit">Update Employee</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
