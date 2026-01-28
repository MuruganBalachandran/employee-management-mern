// region imports
import React, { useState } from "react";
import EmployeeFilters from "../../components/employees/EmployeeFilters";
import EmployeeList from "../../components/employees/EmployeeList";
// endregion

// region Home component
const Home = () => {
  // region state
  const [filters, setFilters] = useState({ search: "", department: "" });
  // endregion

  // region handleFilter
  const handleFilter = (newFilters = {}) => {
    /* Update employee filter state from child component */
    setFilters(newFilters ?? {});
  };
  // endregion

  return (
    <div className="container mt-4">
      <EmployeeFilters onFilter={handleFilter} />
      <EmployeeList filters={filters ?? {}} />
    </div>
  );
};
// endregion

// region exports
export default Home;
// endregion
