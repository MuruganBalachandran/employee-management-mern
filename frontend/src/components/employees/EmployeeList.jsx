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
import { BsExclamationCircle } from "react-icons/bs";
// endregion

// region EmployeeList component
const EmployeeList = ({ filters = {}, onTotalUpdate = () => {} }) => {
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
    dispatch(
      getEmployees({
        skip: (page - 1) * limit,
        limit,
        ...(filters ?? {}),
      }),
    )
      .unwrap()
      .then((res) => onTotalUpdate?.(res?.count ?? 0))
      .catch(() => onTotalUpdate?.(0));
  }, [dispatch, page, filters]);
  // endregion

  // region reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);
  // endregion

  // region handlePageChange
  const handlePageChange = (newPage = 1) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };
  // endregion
  // region delete
  const handleDelete = async (id = "") => {
    if (!window?.confirm?.("Are you sure you want to delete this employee?"))
      return;

    try {
      await dispatch(removeEmployee(id)).unwrap();
      dispatch(
        showToast({
          message: "Employee deleted successfully",
          type: "success",
        }),
      );

      // Fetch employees again
      // const res = await dispatch(
      //   getEmployees({
      //     skip: (page - 1) * limit,
      //     limit,
      //     ...(filters ?? {}),
      //   }),
      // ).unwrap();

      // Calculate total pages after deletion
      const newTotalPages = Math.ceil((res?.count ?? 0) / limit);

      // If current page is now out of range, go back one page
      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
      }

      // Update total for parent
      onTotalUpdate?.(res?.count ?? 0);
    } catch (err) {
      dispatch(
        showToast({
          message: err?.message ?? "Failed to delete employee",
          type: "error",
        }),
      );
      onTotalUpdate?.(0);
    }
  };
  // endregion

  // region handleEdit
  const handleEdit = (emp = {}) => {
    navigate?.(`/employees/edit/${emp?._id ?? ""}`);
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

  // region render
  return (
    <div className='container mt-4'>
      <h3>Employee List (Total: {count ?? 0})</h3>

      <table className='table table-bordered table-striped mt-3'>
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
                  <button
                    className='btn btn-sm btn-outline-info'
                    onClick={() => navigate(`/employees/view/${emp?._id}`)}
                  >
                    View
                  </button>
                  <button
                    className='btn btn-sm btn-outline-primary'
                    onClick={() => handleEdit(emp)}
                  >
                    Edit
                  </button>
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
