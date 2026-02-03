import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../../components/employees/EmployeeForm";
import { showToast } from "../../features/toast/toastSlice";
import { updateMyProfile } from "../../features/auth/authSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

const handleSubmit = async (data, setErrors) => {
  try {
    const cleanData = {
      name: data.name,
      phone: data.phone,
      address: data.address,
    };

    await dispatch(updateMyProfile(cleanData)).unwrap();

    dispatch(showToast({ message: "Profile updated", type: "success" }));
    navigate("/me");
  } catch (err) {
    setErrors(err?.fieldErrors ?? {});
    dispatch(showToast({ message: err?.message || "Update failed", type: "error" }));
  }
};

  return (
    <div className="container mt-4">
      <h3>Edit Profile</h3>

      <EmployeeForm
        initialData={user}
        onSubmit={handleSubmit}
        hideCredentials
      />
    </div>
  );
};

export default EditProfile;
