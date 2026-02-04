// region imports
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
  ROLE,
} from '../../utils/index.js';

import {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmailDomain,
} from '../../validations/index.js';

import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  findUserByEmail,
} from '../../queries/index.js';

import { validateObjectId } from '../../validations/helpers/typeValidations.js';
// endregion

// region list employees
const listEmployees = async (req = {}, res = {}) => {
  try {
    // Support both skip/limit (frontend style) and page/limit (traditional style)
    const limit = Math.min(100, Number(req?.query?.limit) || 5);

    let skip = 0;
    if (req?.query?.skip !== undefined) {
      // Frontend sends skip directly
      skip = Math.max(0, Number(req?.query?.skip) || 0);
    } else {
      // Traditional page parameter
      const page = Math.max(1, Number(req?.query?.page) || 1);
      skip = (page - 1) * limit;
    }

    const search = req?.query?.search || '';
    const department = req?.query?.department || '';

    const result = await getAllEmployees(limit, skip, search, department);

    const currentPage = Math.floor(skip / limit) + 1;
    const totalPages = Math.ceil(result.total / limit);

    return sendResponse(
      res,
      STATUS_CODE.OK,
      RESPONSE_STATUS.SUCCESS,
      'Employees fetched successfully',
      {
        employees: result.employees,
        total: result.total,
        skip,
        limit,
        currentPage,
        totalPages,
      }
    );
  } catch (err) {
    console.error('Error listing employees:', err);
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      RESPONSE_STATUS.FAILURE,
      'Error fetching employees'
    );
  }
};
// endregion

// region get employee details
const getEmployee = async (req = {}, res = {}) => {
  try {
    const { id = '' } = req.params || {};

    const idError = validateObjectId(id);
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        RESPONSE_STATUS.FAILURE,
        idError
      );
    }

    const employee = await getEmployeeById(id);

    if (!employee) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        RESPONSE_STATUS.FAILURE,
        'Employee not found'
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.OK,
      RESPONSE_STATUS.SUCCESS,
      'Employee details fetched',
      employee
    );
  } catch (err) {
    console.error('Error getting employee:', err);
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      RESPONSE_STATUS.FAILURE,
      'Error fetching employee'
    );
  }
};
// endregion

// region create employee (admin)
const createNewEmployee = async (req = {}, res = {}) => {
  try {
    const validation = validateCreateEmployee(req.body || {});
    if (!validation.isValid) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        RESPONSE_STATUS.FAILURE,
        validation.error
      );
    }

    // Extract fields in camelCase from API payload with defaults
    const { email = '' } = req.body || {};

    // Domain Check
    const domainError = validateEmailDomain(email, ROLE.EMPLOYEE);
    if (domainError) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        RESPONSE_STATUS.FAILURE,
        domainError
      );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return sendResponse(
        res,
        STATUS_CODE.CONFLICT,
        RESPONSE_STATUS.FAILURE,
        'Email already registered'
      );
    }

    // Extract all fields in camelCase and map to PascalCase for database
    const { name = '', password = '', age = 0, department = '', phone = '', address = {} } = req.body || {};
    
    // Map address from camelCase (API) to PascalCase (DB)
    const mappedAddress = address && typeof address === 'object' ? {
      Line1: address.line1 || address.Line1 || '',
      Line2: address.line2 || address.Line2 || '',
      City: address.city || address.City || '',
      State: address.state || address.State || '',
      ZipCode: address.zipCode || address.ZipCode || '',
    } : {};
    
    const employee = await createEmployee({
      Name: name,
      Email: email,
      Password: password,
      Age: age,
      Department: department,
      Phone: phone,
      Address: mappedAddress,
    });

    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      RESPONSE_STATUS.SUCCESS,
      'Employee created successfully',
      employee
    );
  } catch (err) {
    console.error('Error creating employee:', err);
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      RESPONSE_STATUS.FAILURE,
      'Error creating employee'
    );
  }
};
// endregion

// region update employee (admin)
const updateEmployeeDetails = async (req = {}, res = {}) => {
  try {
    const { id = '' } = req.params || {};

    const idError = validateObjectId(id);
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        RESPONSE_STATUS.FAILURE,
        idError
      );
    }

    const employee = await getEmployeeById(id);

    if (!employee) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        RESPONSE_STATUS.FAILURE,
        'Employee not found'
      );
    }

    const validation = validateUpdateEmployee(req.body || {});
    if (!validation.isValid) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        RESPONSE_STATUS.FAILURE,
        validation.error
      );
    }

    // Extract fields in camelCase from API payload and map to PascalCase for database
    const { name, age, department, phone, address } = req.body || {};
    const updateData = {};
    if (name !== undefined) updateData.Name = name;
    if (age !== undefined) updateData.Age = age;
    if (department !== undefined) updateData.Department = department;
    if (phone !== undefined) updateData.Phone = phone;
    if (address !== undefined && typeof address === 'object') {
      updateData.Address = {
        Line1: address.line1 || address.Line1 || '',
        Line2: address.line2 || address.Line2 || '',
        City: address.city || address.City || '',
        State: address.state || address.State || '',
        ZipCode: address.zipCode || address.ZipCode || '',
      };
    }

    const updated = await updateEmployee(employee, updateData);

    return sendResponse(
      res,
      STATUS_CODE.OK,
      RESPONSE_STATUS.SUCCESS,
      'Employee updated successfully',
      updated || employee
    );
  } catch (err) {
    console.error('Error updating employee:', err);
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      RESPONSE_STATUS.FAILURE,
      'Error updating employee'
    );
  }
};
// endregion

// region delete employee (admin)
const removeEmployee = async (req = {}, res = {}) => {
  try {
    const { id = '' } = req.params || {};

    const idError = validateObjectId(id);
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        RESPONSE_STATUS.FAILURE,
        idError
      );
    }

    const employee = await getEmployeeById(id);

    if (!employee) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        RESPONSE_STATUS.FAILURE,
        'Employee not found'
      );
    }

    await deleteEmployee(employee);

    return sendResponse(
      res,
      STATUS_CODE.OK,
      RESPONSE_STATUS.SUCCESS,
      'Employee deleted successfully'
    );
  } catch (err) {
    console.error('Error deleting employee:', err);
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      RESPONSE_STATUS.FAILURE,
      'Error deleting employee'
    );
  }
};
// endregion

export {
  listEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployeeDetails,
  removeEmployee,
};
