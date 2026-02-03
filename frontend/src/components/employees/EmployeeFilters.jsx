// region imports
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEmployeeFilters } from "../../features/employees/employeeSelectors";
import { setFilters } from "../../features/employees/employeeSlice";
import { VALID_DEPARTMENTS } from "../../validations/employeeValidation";
// endregion

// region EmployeeFilters component
const EmployeeFilters = ({ onFilter = () => {} }) => {
  // region redux state
  const dispatch = useDispatch();
  const filters = useSelector(selectEmployeeFilters);
  // endregion

  // region keep latest onFilter without triggering effect
  const onFilterRef = useRef(onFilter);
  useEffect(() => {
    onFilterRef.current = onFilter;
  }, [onFilter]);
  // endregion

  // region handle filter changes
  const handleSearchChange = (value) => {
    dispatch(setFilters({ search: value }));
    onFilterRef.current?.({ ...filters, search: value });
  };

  const handleDepartmentChange = (value) => {
    dispatch(setFilters({ department: value }));
    onFilterRef.current?.({ ...filters, department: value });
  };
  // endregion

  return (
    <div className='d-flex gap-2 align-items-center mb-3 flex-wrap'>
      <input
        type='text'
        className='form-control'
        placeholder='Search by name...'
        value={filters?.search ?? ""}
        onChange={(e) => handleSearchChange(e?.target?.value ?? "")}
      />

      <select
        className='form-select'
        value={filters?.department ?? ""}
        onChange={(e) => handleDepartmentChange(e?.target?.value ?? "")}
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
