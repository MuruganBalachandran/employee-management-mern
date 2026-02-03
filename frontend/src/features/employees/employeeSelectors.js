// region imports
import { createSelector } from "reselect";
// endregion

// region base selector
const selectEmployeeState = (state) => state.employees;
// endregion

// region memoized selectors
/**
 * Select normalized employees by ID map
 * Memoized to prevent unnecessary re-renders
 */
export const selectEmployeeById = createSelector(
    [selectEmployeeState],
    (employees) => employees?.byId ?? {}
);

/**
 * Select all employee IDs in order
 * Memoized to prevent unnecessary re-renders
 */
export const selectEmployeeIds = createSelector(
    [selectEmployeeState],
    (employees) => employees?.allIds ?? []
);

/**
 * Select all employees as array
 * Derives from normalized state for convenience
 * Memoized to prevent unnecessary re-renders
 */
export const selectEmployees = createSelector(
    [selectEmployeeById, selectEmployeeIds],
    (byId, ids) => ids.map((id) => byId[id]).filter(Boolean)
);

/**
 * Select current single employee
 * Memoized to prevent unnecessary re-renders
 */
export const selectCurrentEmployee = createSelector(
    [selectEmployeeState],
    (employees) => employees?.currentEmployee ?? null
);

/**
 * Select total count of employees
 * Useful for pagination
 */
export const selectEmployeeCount = createSelector(
    [selectEmployeeState],
    (employees) => employees?.pagination?.total ?? 0
);

/**
 * Select loading state
 * Memoized to prevent unnecessary re-renders
 */
export const selectEmployeeLoading = createSelector(
    [selectEmployeeState],
    (employees) => employees?.loading ?? false
);

/**
 * Select current employee loading state
 * Memoized to prevent unnecessary re-renders
 */
export const selectCurrentEmployeeLoading = createSelector(
    [selectEmployeeState],
    (employees) => employees?.currentEmployeeLoading ?? false
);

/**
 * Select error state
 * Memoized to prevent unnecessary re-renders
 */
export const selectEmployeeError = createSelector(
    [selectEmployeeState],
    (employees) => employees?.error ?? null
);

/**
 * Select pagination info
 * Memoized to prevent unnecessary re-renders
 */
export const selectPaginationInfo = createSelector(
    [selectEmployeeState],
    (employees) => employees?.pagination ?? {}
);

/**
 * Select current page number
 * Memoized to prevent unnecessary re-renders
 */
export const selectCurrentPage = createSelector(
    [selectPaginationInfo],
    (pagination) => pagination?.currentPage ?? 1
);

/**
 * Select current filters
 * Memoized to prevent unnecessary re-renders
 */
export const selectEmployeeFilters = createSelector(
    [selectEmployeeState],
    (employees) => employees?.filters ?? {}
);

/**
 * Select specific employee by ID from normalized state
 * Memoized selector factory for finding specific employee
 * Usage: selectEmployeeFromNormalizedState(state, employeeId)
 */
export const selectEmployeeFromNormalizedState = createSelector(
    [selectEmployeeById, (_, employeeId) => employeeId],
    (byId, employeeId) => byId[employeeId] ?? null
);

/**
 * Select whether employee list is empty
 * Useful for showing empty states
 */
export const selectIsEmployeeListEmpty = createSelector(
    [selectEmployeeIds, selectEmployeeLoading],
    (ids, loading) => !loading && ids?.length === 0
);

// endregion
