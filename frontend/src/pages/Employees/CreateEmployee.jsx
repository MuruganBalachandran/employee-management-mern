// region imports
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EmployeeForm, Loader } from "../../components/";
import { addEmployee, selectEmployeeLoading, showToast } from "../../features";
// endregion

// region CreateEmployee component
const CreateEmployee = () => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectEmployeeLoading);
  // endregion

  // region handleSubmit
  const handleSubmit = async (data = {}, setErrors = () => {}) => {
    /* Create employee and handle backend validation errors */
    try {
      await dispatch(addEmployee(data || {})).unwrap();
      navigate("/employees");
    } catch (err) {
      const fieldErrors = err?.fieldErrors || {};
      setErrors(fieldErrors);
      // show error
      dispatch(
        showToast({
          message:
            Object.keys(fieldErrors).length > 0
              ? "Please fix the highlighted errors"
              : err?.message || "Failed to create employee",
          type: "error",
        }),
      );
    }
  };
  // endregion

  return (
    <div className='container mt-4'>
      {/* Loader */}
      {loading && <Loader fullScreen text='Creating employee...' />}

      {/* Page heading */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h3 className='mb-0'>Create Employee</h3>
      </div>

      {/* Form card */}
      <EmployeeForm onSubmit={handleSubmit} />
    </div>
  );
};
// endregion

// region exports
export default CreateEmployee;
// endregion
