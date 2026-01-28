// region imports
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import EmployeeFilters from "../../components/employees/EmployeeFilters";
import EmployeeList from "../../components/employees/EmployeeList";
import { getEmployees } from "../../features/employees/employeeSlice";
// endregion

const Home = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({ search: "", department: "" });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Fetch only total count without filters
    dispatch(getEmployees({ skip: 0, limit: 0, ignoreFilters: true }))
      .unwrap()
      .then((res) => setShowFilters((res?.count ?? 0) > 0))
      .catch(() => setShowFilters(false));
  }, [dispatch]);

  const handleFilter = (newFilters = {}) => {
    setFilters(newFilters ?? {});
  };

  return (
    <div className="container mt-4">
      {showFilters && <EmployeeFilters onFilter={handleFilter} />}
      <EmployeeList filters={filters} />
    </div>
  );
};

export default Home;
