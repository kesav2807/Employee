import Employee from '../models/Employee.js';

const getAllEmployees = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    page = Math.max(1, page);
    limit = Math.max(1, Math.min(100, limit));
    
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { skills: { $regex: search, $options: 'i' } },
            { designation: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const employees = await Employee.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await Employee.countDocuments(query);

    res.status(200).json({
      employees,
      totalPages: Math.ceil(count / limit) || 1,
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, age, skills, address, designation } = req.body;

    if (!name || !age || !skills || !address || !designation) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const employee = new Employee({
      name,
      age,
      skills,
      address,
      designation
    });

    const savedEmployee = await employee.save();
    res.status(201).json({ message: 'Employee created successfully', employee: savedEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee', error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { name, age, skills, address, designation } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, age, skills, address, designation },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
};

export {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
