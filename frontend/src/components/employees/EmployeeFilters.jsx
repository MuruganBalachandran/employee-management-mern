// region imports
import React, { useState, useEffect, useRef } from "react";
import { VALID_DEPARTMENTS } from "../../validations/employeeValidation";
// endregion

// region EmployeeFilters component
const EmployeeFilters = ({ onFilter = () => {} }) => {
  // region state
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  // endregion

  // region keep latest onFilter without triggering effect
  const onFilterRef = useRef(onFilter);
  useEffect(() => {
    onFilterRef.current = onFilter;
  }, [onFilter]);
  // endregion

  // region debounced live filtering (ONLY when values change)
const firstRun = useRef(true);

useEffect(() => {
  if (firstRun.current) {
    firstRun.current = false;
    return;
  }

  const timer = setTimeout(() => {
    onFilterRef.current({ search, department });
  }, 1000);

  return () => clearTimeout(timer);
}, [search, department]);

  // endregion

  return (
    <div className='d-flex gap-2 align-items-center mb-3 flex-wrap'>
      <input
        type='text'
        className='form-control'
        placeholder='Search by name...'
        value={search ?? ""}
        onChange={(e) => setSearch(e?.target?.value ?? "")}
      />

      <select
        className='form-select'
        value={department ?? ""}
        onChange={(e) => setDepartment(e?.target?.value ?? "")}
      >
        <option value=''>All Departments</option>
        {VALID_DEPARTMENTS?.map?.((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    </div>
  );
};
// endregion

// region exports
export default EmployeeFilters;
// endregion
