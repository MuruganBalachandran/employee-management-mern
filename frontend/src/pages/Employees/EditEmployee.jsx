// region imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEmployee, editEmployee } from "../../features/employees/employeeSlice";
import EmployeeForm from "../../components/employees/EmployeeForm";
import { showToast } from "../../features/toast/toastSlice";
import BackButton from "../../components/ui/BackButton";
// endregion

// region EditEmployee component
const EditEmployee = () => {
  // region hooks
  const { id = "" } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentEmployee = null, loading = false, error = null } =
    useSelector((state) => state?.employees ?? {});

  const [employeeData, setEmployeeData] = useState(null);
  // endregion

  // region fetchEmployee
  useEffect(() => {
    /* Fetch employee details by ID */
    dispatch(getEmployee(id ?? ""))
      ?.unwrap()
      ?.then((emp) => setEmployeeData(emp ?? null))
      ?.catch((err) =>
        dispatch(
          showToast({
            message: err?.message ?? "Failed to load employee",
            type: "error",
          })
        )
      );
  }, [dispatch, id]);
  // endregion

  // region handleUpdate
  const handleUpdate = async (updatedData = {}) => {
    /* Update employee details */
    try {
      await dispatch(editEmployee({ id, data: updatedData ?? {} }))?.unwrap();

      dispatch(
        showToast({
          message: "Employee updated successfully",
          type: "success",
        })
      );

      navigate("/");
    } catch (err) {
      dispatch(
        showToast({
          message: err?.message ?? "Failed to update employee",
          type: "error",
        })
      );
    }
  };
  // endregion

  if (loading || !employeeData) return <div>Loading employee...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      {/* back button */}
      <BackButton />
      <h3>Edit Employee</h3>
      {/* form to edit employee */}
      <EmployeeForm initialData={employeeData} onSubmit={handleUpdate} />
    </div>
  );
};
// endregion

// region exports
export default EditEmployee;
// endregion
