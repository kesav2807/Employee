import Employee from '../models/Employee.js';

const getAllEmployees = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const requestedSortField = req.query.sortField || '';
    const requestedSortOrder = req.query.sortOrder || '';
    
    const filterName = req.query.filterName || '';
    const filterAge = req.query.filterAge || '';
    const filterSkills = req.query.filterSkills || '';
    const filterAddress = req.query.filterAddress || '';
    const filterDesignation = req.query.filterDesignation || '';
    
    page = Math.max(1, page);
    limit = Math.max(1, Math.min(100, limit));
    
    const MAX_FILTER_LENGTH = 100;
    
    if (search.length > MAX_FILTER_LENGTH) {
      return res.status(400).json({ message: 'Search query too long' });
    }
    
    if (filterName.length > MAX_FILTER_LENGTH || 
        filterSkills.length > MAX_FILTER_LENGTH || 
        filterAddress.length > MAX_FILTER_LENGTH || 
        filterDesignation.length > MAX_FILTER_LENGTH) {
      return res.status(400).json({ message: 'Filter values too long' });
    }
    
    if (filterAge) {
      const ageValue = Number(filterAge);
      if (!Number.isInteger(ageValue) || ageValue < 0 || filterAge.trim() !== String(ageValue)) {
        return res.status(400).json({ message: 'Invalid age filter value' });
      }
    }
    
    const allowedSortFields = new Set(['name', 'age', 'skills', 'address', 'designation', 'createdAt']);
    
    let sortObject;
    if (requestedSortField && allowedSortFields.has(requestedSortField)) {
      const sortOrder = requestedSortOrder === 'desc' ? -1 : 1;
      sortObject = {};
      sortObject[requestedSortField] = sortOrder;
    } else {
      sortObject = { createdAt: -1 };
    }
    
    let query = {};
    
    if (search && search.length <= MAX_FILTER_LENGTH) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (filterName) {
      query.name = { $regex: filterName, $options: 'i' };
    }
    if (filterAge) {
      query.age = Number(filterAge);
    }
    if (filterSkills) {
      query.skills = { $regex: filterSkills, $options: 'i' };
    }
    if (filterAddress) {
      query.address = { $regex: filterAddress, $options: 'i' };
    }
    if (filterDesignation) {
      query.designation = { $regex: filterDesignation, $options: 'i' };
    }

    const employees = await Employee.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sortObject)
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

    const profileImage = req.file ? `/uploads/${req.file.filename}` : '';

    const employee = new Employee({
      name,
      age,
      skills,
      address,
      designation,
      profileImage
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
    
    const updateData = { name, age, skills, address, designation };
    
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
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
