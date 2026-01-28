// region imports
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getEmployees } from "../../features/employees/employeeSlice";
import Loader from "../../components/UI/Loader";
import BackButton from "../../components/ui/BackButton";
// endregion

// region helper
const formatAddress = (address) => {
  if (!address) return "-";
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.zip,
  ].filter(Boolean);
  return parts.join(", ");
};

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return isNaN(d) ? "-" : d.toLocaleString();
};
// endregion

// region EmployeeView
const EmployeeView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { employees, loading } = useSelector((state) => state?.employees ?? {});
  const [employee, setEmployee] = useState(null);

  // fetch employee details from Redux store
  useEffect(() => {
    if (!employees?.length) {
      dispatch(getEmployees({ skip: 0, limit: 100 })); // fetch all if not present
    } else {
      setEmployee(employees.find((e) => e?._id === id) ?? null);
    }
  }, [employees, id, dispatch]);

  if (loading || !employee) return <Loader fullScreen text="Loading employee..." />;

  return (
    <>
      <BackButton />
      <div className="card p-4 shadow-sm">
        <h3>Employee Details</h3>

        {/* Basic info */}
        <div className="mt-3">
          <p><strong>Name:</strong> {employee?.name ?? "-"}</p>
          <p><strong>Email:</strong> {employee?.email ?? "-"}</p>
          <p><strong>Department:</strong> {employee?.department ?? "-"}</p>
          <p><strong>Phone:</strong> {employee?.phone ?? "-"}</p>

          {/* Address */}
          <p>
            <strong>Address (Brief):</strong>{" "}
            {employee?.address ? `${employee.address.city}, ${employee.address.state}` : "-"}
            <br />
            <small className="text-muted">{formatAddress(employee?.address)}</small>
          </p>

          {/* Other details */}
          {/* <p><strong>Created By:</strong> {employee?.createdBy ?? "-"}</p> */}
          <p><strong>Deleted:</strong> {employee?.isDeleted ? "Yes" : "No"}</p>
          <p><strong>Created At:</strong> {formatDate(employee?.createdAt)}</p>
          <p><strong>Updated At:</strong> {formatDate(employee?.updatedAt)}</p>
        </div>
      </div>
    </>
  );
};
// endregion

// region exports
export default EmployeeView;
// endregion
