// region imports
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsExclamationCircle } from "react-icons/bs";

import {
  getEmployees,
  removeEmployee,
  setPage,
  selectEmployees,
  selectEmployeeCount,
  selectEmployeeLoading,
  selectEmployeeError,
  selectCurrentPage,
  selectEmployeeFilters,
  showToast,
} from "../../features";

import { Loader, Pagination } from "../../components";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";

// endregion

// region EmployeeList component
const EmployeeList = ({ onTotalUpdate = () => {} }) => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // endregion

  // region redux state
  const employees = useSelector(selectEmployees);
  const count = useSelector(selectEmployeeCount);
  const loading = useSelector(selectEmployeeLoading);
  const error = useSelector(selectEmployeeError);
  const page = useSelector(selectCurrentPage);
  const filters = useSelector(selectEmployeeFilters);
  // endregion

  const limit = 5;
  const totalPages = Math.ceil((count || 0) / limit);

  // region fetch employees on page/filters change
  useEffect(() => {
    dispatch(
      getEmployees({
        page,
        limit,
        search: filters?.search || "",
        department: filters?.department || "",
      }),
    )
      .unwrap()
      .then((res) => onTotalUpdate(res?.count || 0))
      .catch(() => onTotalUpdate(0));
  }, [dispatch, page, filters]);
  // endregion

  // region handlePageChange
  const handlePageChange = (newPage = 1) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(setPage(newPage));
  };
  // endregion

  // region delete
  const handleDelete = async (id = "") => {
    // acknowledge for dleete an employee
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      // remove employee
      await dispatch(removeEmployee(id)).unwrap();
      dispatch(
        showToast({
          message: "Employee deleted successfully",
          type: "success",
        }),
      );

      // Refresh current page
      dispatch(
        getEmployees({
          skip: (page - 1) * limit,
          limit,
          search: filters?.search || "",
          department: filters?.department || "",
        }),
      );
    } catch (err) {
      dispatch(
        showToast({
          message: err?.message || "Failed to delete employee",
          type: "error",
        }),
      );
    }
  };
  // endregion

  // region handleEdit
  const handleEdit = (emp = {}) => {
    navigate(`/employees/edit/${emp?._id || ""}`);
  };
  // endregion

  // region conditional UI states
  if (loading) {
    return <Loader fullScreen text='Loading employees...' />;
  }
  if (error) {
    return <div className='alert alert-danger'>{error}</div>;
  }
  if (!employees?.length)
    return (
      <div className='d-flex flex-column align-items-center justify-content-center text-center mt-5'>
        <BsExclamationCircle size={50} className='text-muted mb-3' />
        <h4 className='text-muted'>No employees found</h4>
        <p className='text-muted'></p>
      </div>
    );
  // endregion

  return (
    // region container
    <div className='container mt-4'>
      {/* Heading with total employees */}
      <h3 className='mb-3'>Employee List (Total: {count || 0})</h3>

      {/* Responsive table wrapper */}
      <div className='table-responsive'>
        <table className='table table-hover table-bordered align-middle'>
          {/* Table headers */}
          <thead className='table-light'>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Address</th>
              <th className='text-center'>Actions</th>
            </tr>
          </thead>

          {/* Table data rows */}
          <tbody>
            {employees?.map((emp = {}) => (
              <tr key={emp?._id || Math.random()}>
                <td>{emp?.Name || "-"}</td>
                <td>{emp?.Email || "-"}</td>
                <td>{emp?.Department || "-"}</td>
                <td>{emp?.Phone || "-"}</td>
                <td>
                  {/* Address formatting */}
                  {[emp?.Address?.Line1, emp?.Address?.Line2]
                    .filter(Boolean)
                    .join(", ")}
                  {emp?.Address?.City ? `, ${emp.Address.City}` : ""}
                  {emp?.Address?.State ? `, ${emp.Address.State}` : ""}
                  {emp?.Address?.ZipCode ? ` - ${emp.Address.ZipCode}` : ""}
                </td>

                {/* Action icons */}
                {/* Action icons as button-like containers */}
                <td className='text-center'>
                  <div className='d-flex justify-content-center gap-2 flex-nowrap'>
                    {/* View */}
                    <div
                      className='d-flex align-items-center justify-content-center border rounded p-1'
                      style={{ width: 28, height: 28, cursor: "pointer" }}
                      title='View'
                      onClick={() => navigate(`/employees/view/${emp?._id}`)}
                    >
                      <FaEye size={14} className='text-info' />
                    </div>

                    {/* Edit */}
                    <div
                      className='d-flex align-items-center justify-content-center border rounded p-1'
                      style={{ width: 28, height: 28, cursor: "pointer" }}
                      title='Edit'
                      onClick={() => handleEdit(emp)}
                    >
                      <FaPen size={14} className='text-primary' />
                    </div>

                    {/* Delete */}
                    <div
                      className='d-flex align-items-center justify-content-center border rounded p-1'
                      style={{ width: 28, height: 28, cursor: "pointer" }}
                      title='Delete'
                      onClick={() => handleDelete(emp?._id)}
                    >
                      <FaTrash size={14} className='text-danger' />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={page || 1} // default to page 1
        totalPages={totalPages || 1} // default to 1 page
        onPageChange={handlePageChange}
      />
    </div>
    // endregion
  );
};

// region exports
export default EmployeeList;
// endregion
