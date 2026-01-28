// region imports
import React, { useState } from "react";
import { VALID_DEPARTMENTS } from "../../validations/employeeValidation";
// endregion

// region EmployeeFilters component
const EmployeeFilters = ({ onFilter = () => {} }) => {
  // region state
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  // endregion

  // region handleApply
  const handleApply = () => {
    onFilter?.({ search: search?.trim?.() ?? "", department: department ?? "" });
  };
  // endregion

  // region handleClear
  const handleClear = () => {
    setSearch("");
    setDepartment("");
    onFilter?.({ search: "", department: "" });
  };
  // endregion

  return (
    <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
      {/* Search input */}
      <input
        type="text"
        className="form-control"
        placeholder="Search by name..."
        value={search ?? ""}
        onChange={(e) => setSearch(e?.target?.value ?? "")}
      />

      {/* Department dropdown */}
      <select
        className="form-select"
        value={department ?? ""}
        onChange={(e) => setDepartment(e?.target?.value ?? "")}
      >
        <option value="">All Departments</option>
        {VALID_DEPARTMENTS?.map?.((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {/* Apply filters */}
      <button className="btn btn-primary" onClick={handleApply}>
        Filter
      </button>

      {/* Clear filters */}
      <button className="btn btn-outline-secondary" onClick={handleClear}>
        Clear
      </button>
    </div>
  );
};
// endregion

// region exports
export default EmployeeFilters;
// endregion