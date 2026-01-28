// region imports
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployees,
  removeEmployee,
} from "../../features/employees/employeeSlice";
import Loader from "../../components/UI/Loader";
import { showToast } from "../../features/toast/toastSlice";
import { useNavigate } from "react-router-dom";
import Pagination from "../ui/Pagination";
// endregion

// region EmployeeList component
const EmployeeList = ({ filters = {} }) => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // endregion

  // region local state
  const [page, setPage] = useState(1);
  const limit = 5;
  // endregion

  // region redux state
  const {
    employees = [],
    count = 0,
    loading = false,
    error = null,
  } = useSelector((state) => state?.employees ?? {});
  // endregion

  const totalPages = Math.ceil((count ?? 0) / limit);

  // region fetch employees on page/filters change
  useEffect(() => {
    /**
     * Fetch employee list with pagination and filters
     * Safe spread of filters with fallback
     */
    dispatch(
      getEmployees?.({
        skip: (page - 1) * limit,
        limit,
        ...(filters ?? {}),
      }),
    );
  }, [dispatch, page, filters]);
  // endregion

  // region reset page when filters change
  useEffect(() => {
    /**
     * Whenever filters update, reset pagination to page 1
     */
    setPage(1);
  }, [filters]);
  // endregion

  // region handlePageChange
  const handlePageChange = (newPage = 1) => {
    /**
     * Prevent navigation to invalid pages
     */
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };
  // endregion

  // region handleDelete
  const handleDelete = async (id = "") => {
    /**
     * Delete employee after confirmation
     * Re-fetch list after deletion
     */
    if (!window?.confirm?.("Are you sure you want to delete this employee?"))
      return;

    try {
      await dispatch(removeEmployee?.(id))?.unwrap?.();

      dispatch(
        showToast?.({
          message: "Employee deleted successfully",
          type: "success",
        }),
      );

      dispatch(
        getEmployees?.({
          skip: (page - 1) * limit,
          limit,
          ...(filters ?? {}),
        }),
      );
    } catch (err) {
      dispatch(
        showToast?.({
          message: err?.message ?? "Failed to delete employee",
          type: "error",
        }),
      );
    }
  };
  // endregion

  // region handleEdit
  const handleEdit = (emp = {}) => {
    /**
     * Navigate to edit page with employee ID
     */
    navigate?.(`/employees/edit/${emp?._id ?? ""}`);
  };
  // endregion

  // region conditional UI states
  if (loading) return <Loader fullScreen text='Loading employees...' />;
  if (error) return <div className='alert alert-danger'>{error}</div>;
  if (!employees?.length) return <div>No employees found</div>;
  // endregion

  // region render
  return (
    <div className='container mt-4'>
      {/* table title */}
      <h3>Employee List (Total: {count ?? 0})</h3>

      <table className='table table-bordered table-striped mt-3'>
        {/* table header */}
        <thead className='thead-dark'>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Address</th>
            <th className='text-center'>Actions</th>
          </tr>
        </thead>
        {/* table data */}
        <tbody>
          {employees?.map?.((emp = {}) => (
            <tr key={emp?._id ?? Math.random()}>
              <td>{emp?.name ?? "-"}</td>
              <td>{emp?.email ?? "-"}</td>
              <td>{emp?.department ?? "-"}</td>
              <td>{emp?.phone ?? "-"}</td>
              <td>
                {emp?.address?.line1 ?? ""}
                {emp?.address?.line2 ? `, ${emp.address.line2}` : ""},{" "}
                {emp?.address?.city ?? ""}, {emp?.address?.state ?? ""} -{" "}
                {emp?.address?.zip ?? ""}
              </td>
              <td className='text-center'>
                <div className='d-inline-flex gap-2'>
                  {/* View button */}
                  <button
                    className='btn btn-sm btn-outline-info'
                    onClick={() => navigate(`/employees/view/${emp?._id}`)}
                  >
                    View
                  </button>

                  {/* Edit button */}
                  <button
                    className='btn btn-sm btn-outline-primary'
                    onClick={() => handleEdit(emp)}
                  >
                    Edit
                  </button>

                  {/* Delete button */}
                  <button
                    className='btn btn-sm btn-outline-danger'
                    onClick={() => handleDelete(emp?._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* pagination */}
      <Pagination
        page={page ?? 1}
        totalPages={totalPages ?? 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
  // endregion
};
// endregion

// region exports
export default EmployeeList;
// endregion
