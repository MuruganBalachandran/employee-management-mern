// region imports
import React, { useState } from "react";
import { useSelector } from "react-redux";
import EmployeeFilters from "../../components/employees/EmployeeFilters";
import EmployeeList from "../../components/employees/EmployeeList";
// endregion

// region component
const Home = () => {
  const [filters, setFilters] = useState({ search: "", department: "" });
  const { count = 0 } = useSelector((state) => state?.employees ?? {});

  const handleFilter = (newFilters = {}) => {
    setFilters(newFilters ?? {});
  };

  return (
    <div className="container mt-4">
      {/* Show filters only if employees exist */}
      {count > 0 && <EmployeeFilters onFilter={handleFilter} />}

      <EmployeeList filters={filters} />
    </div>
  );
};
// endregion

// region exports
export default Home;
// endregion
