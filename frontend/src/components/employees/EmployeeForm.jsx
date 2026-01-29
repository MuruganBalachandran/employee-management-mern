// region imports
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Input from "../../components/UI/Input";
import { showToast } from "../../features/toast/toastSlice";
import {
  validateEmployee,
  nameValidation,
  emailValidation,
  passwordValidation,
  departmentValidation,
  phoneValidation,
  addressValidation,
  VALID_DEPARTMENTS,
} from "../../validations/employeeValidation";
// endregion

// region EmployeeForm component
const EmployeeForm = ({ initialData = {}, onSubmit = () => {} }) => {
  const dispatch = useDispatch();
  const isEdit = !!initialData?._id;

  // region form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
    },
  });
  const [errors, setErrors] = useState({});
  // endregion

  // region sync form when editing
  useEffect(() => {
    if (initialData?._id) {
      setForm({
        name: initialData?.name ?? "",
        email: initialData?.userRef?.email ?? "",
        password: "",
        department: initialData?.department ?? "",
        phone: initialData?.phone ?? "",
        address: {
          line1: initialData?.address?.line1 ?? "",
          line2: initialData?.address?.line2 ?? "",
          city: initialData?.address?.city ?? "",
          state: initialData?.address?.state ?? "",
          zip: initialData?.address?.zip ?? "",
        },
      });
    }
  }, [initialData]);
  // endregion

  // region handleChange
  const handleChange = (field = "", value = "") => {
    if (field?.startsWith?.("address.")) {
      const key = field.split(".")[1];
      const updatedAddress = { ...form.address, [key]: value };
      const addressErrors = addressValidation(updatedAddress);

      setForm((prev) => ({ ...prev, address: updatedAddress }));
      setErrors((prev) => {
        const next = { ...prev };
        if (addressErrors?.[key]) next[`address.${key}`] = addressErrors[key];
        else delete next[`address.${key}`];
        return next;
      });
    } else {
      let fieldError = "";

      switch (field) {
        case "name":
          fieldError = nameValidation(value);
          break;
        case "email":
          fieldError = emailValidation(value, "employee", isEdit);
          break;
        case "password":
          fieldError = passwordValidation(value, isEdit);
          break;
        case "department":
          fieldError = departmentValidation(value);
          break;
        case "phone":
          fieldError = phoneValidation(value);
          break;
      }

      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldError) next[field] = fieldError;
        else delete next[field];
        return next;
      });
    }
  };
  // endregion

  // region handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...form };
    if (isEdit) {
      delete payload.email;
      delete payload.password;
    }

    const validationErrors = validateEmployee(payload, isEdit);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      dispatch(showToast({ message: "Please fix the errors", type: "error" }));
      return;
    }

    onSubmit(payload, setErrors);
  };
  // endregion

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <Input label="Name" placeholder="Enter employee name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} error={errors.name} />

      <Input label="Email" type="email" placeholder="Enter employee email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} error={errors.email} disabled={isEdit} />

      {!isEdit && (
        <Input label="Password" type="password" placeholder="Set login password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} error={errors.password} />
      )}

      <Input
        label="Department"
        select
        options={[
          { value: "", label: "Select Department" },
          ...VALID_DEPARTMENTS.map((d) => ({ value: d, label: d })),
        ]}
        value={form.department}
        onChange={(e) => handleChange("department", e.target.value)}
        error={errors.department}
      />

      <Input label="Phone" placeholder="Enter 10-digit phone number" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} error={errors.phone} />

      <Input label="Address Line 1" placeholder="Street address" value={form.address.line1} onChange={(e) => handleChange("address.line1", e.target.value)} error={errors["address.line1"]} />

      <Input label="Address Line 2" placeholder="Apartment, suite, etc." value={form.address.line2} onChange={(e) => handleChange("address.line2", e.target.value)} />

      <Input label="City" placeholder="City" value={form.address.city} onChange={(e) => handleChange("address.city", e.target.value)} error={errors["address.city"]} />

      <Input label="State" placeholder="State" value={form.address.state} onChange={(e) => handleChange("address.state", e.target.value)} error={errors["address.state"]} />

      <Input label="ZIP" placeholder="ZIP / Postal code" value={form.address.zip} onChange={(e) => handleChange("address.zip", e.target.value)} error={errors["address.zip"]} />

      <button type="submit" className="btn btn-primary mt-3">
        {isEdit ? "Update Employee" : "Create Employee"}
      </button>
    </form>
  );
};
// endregion

// region exports
export default EmployeeForm;
// endregion
