// region imports
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Input from "../../components/UI/Input";
import { showToast } from "../../features/toast/toastSlice";
import {
  validateEmployee,
  nameValidation,
  emailValidation,
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
    name: "vignesh",
    email: "vignesh@spanemployee.com",
    department: "",
    phone: "9999999999",
    address: {
      line1: "sssss",
      line2: "",
      city: "ccccc",
      state: "cccc",
      zip: "666666",
    },
    //    name: "vignesh",
    // email: "vignesh@spanemployee.com",
    // department: "",
    // phone: "9999999999",
    // address: {
    //   line1: "sssss",
    //   line2: "",
    //   city: "ccccc",
    //   state: "cccc",
    //   zip: "666666",
    // },
  });
  const [errors, setErrors] = useState({});
  // endregion

  // region sync form when editing
  useEffect(() => {
    if (initialData?._id) {
      setForm({
        name: initialData?.name ?? "",
        email: initialData?.email ?? "",
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
    // validate address fields
    if (field?.startsWith?.("address.")) {
      const key = field?.split?.(".")?.[1] ?? "";
      const updatedAddress = { ...(form?.address ?? {}), [key]: value };
      const addressErrors = addressValidation?.(updatedAddress) ?? {};

      // set values
      setForm((prev) => ({ ...prev, address: updatedAddress }));
      // set errors
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (addressErrors?.[key])
          newErrors[`address.${key}`] = addressErrors[key];
        else delete newErrors[`address.${key}`];
        return newErrors;
      });
    } else {
      let fieldError = "";
      // fro other fields
      switch (field) {
        case "name":
          fieldError = nameValidation?.(value) ?? "";
          break;
        case "email":
          fieldError = emailValidation?.(value, "employee") ?? "";
          break;
        case "department":
          fieldError = departmentValidation?.(value) ?? "";
          break;
        case "phone":
          fieldError = phoneValidation?.(value) ?? "";
          break;
      }

      setForm((prev) => ({ ...prev, [field]: value }));

      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (fieldError) newErrors[field] = fieldError;
        else delete newErrors[field];
        return newErrors;
      });
    }
  };
  // endregion

  // region handleSubmit
  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const validationErrors = validateEmployee?.(form ?? {}) ?? {};

    if (Object.keys(validationErrors ?? {}).length > 0) {
      setErrors(validationErrors);
      dispatch?.(
        showToast({ message: "Please fix the errors", type: "error" }),
      );
      return;
    }

    onSubmit?.(form ?? {}, setErrors);
  };
  // endregion

  return (
    <form onSubmit={handleSubmit} className='card p-4 shadow-sm'>
      {/* Name input */}
      <Input
        label='Name'
        name='name'
        value={form?.name ?? ""}
        onChange={(e) => handleChange("name", e?.target?.value)}
        error={errors?.name}
        placeholder='Enter employee name'
      />

      {/* Email input */}
      <Input
        label='Email'
        name='email'
        type='email'
        value={form?.email ?? ""}
        onChange={(e) => handleChange("email", e?.target?.value)}
        error={errors?.email}
        placeholder='Enter employee email'
        disabled={isEdit}
      />

      {/* Department select */}
      <Input
        label='Department'
        name='department'
        value={form?.department ?? ""}
        onChange={(e) => handleChange("department", e?.target?.value)}
        error={errors?.department}
        select
        options={[
          { value: "", label: "Select Department" },
          ...VALID_DEPARTMENTS?.map?.((dept) => ({ value: dept, label: dept })),
        ]}
      />

      {/* Phone input */}
      <Input
        label='Phone'
        name='phone'
        value={form?.phone ?? ""}
        onChange={(e) => handleChange("phone", e?.target?.value)}
        error={errors?.phone}
        placeholder='Enter phone number'
      />

      {/* Address Line 1 */}
      <Input
        label='Address Line 1'
        name='address.line1'
        value={form?.address?.line1 ?? ""}
        onChange={(e) => handleChange("address.line1", e?.target?.value)}
        error={errors?.["address.line1"]}
        placeholder='Street address'
      />

      {/* Address Line 2 */}
      <Input
        label='Address Line 2'
        name='address.line2'
        value={form?.address?.line2 ?? ""}
        onChange={(e) => handleChange("address.line2", e?.target?.value)}
        error={errors?.["address.line2"]}
        placeholder='Apartment, suite, etc.'
      />

      {/* City */}
      <Input
        label='City'
        name='address.city'
        value={form?.address?.city ?? ""}
        onChange={(e) => handleChange("address.city", e?.target?.value)}
        error={errors?.["address.city"]}
        placeholder='City'
      />

      {/* State */}
      <Input
        label='State'
        name='address.state'
        value={form?.address?.state ?? ""}
        onChange={(e) => handleChange("address.state", e?.target?.value)}
        error={errors?.["address.state"]}
        placeholder='State'
      />

      {/* ZIP Code */}
      <Input
        label='ZIP Code'
        name='address.zip'
        value={form?.address?.zip ?? ""}
        onChange={(e) => handleChange("address.zip", e?.target?.value)}
        error={errors?.["address.zip"]}
        placeholder='ZIP / Postal code'
      />

      {/* Submit button */}
      <button type='submit' className='btn btn-primary mt-3'>
        {isEdit ? "Update Employee" : "Create Employee"}
      </button>
    </form>
  );
};
// endregion

// region exports
export default EmployeeForm;
// endregion
