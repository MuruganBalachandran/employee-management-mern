// region imports
import { createSelector } from "reselect";
// endregion

// region base selector
const selectSuperAdminState = (state) => state.superAdmin;
// endregion

// region memoized selectors
export const selectSuperAdminLoading = createSelector(
  [selectSuperAdminState],
  (state) => state?.loading || false
);

export const selectSuperAdminError = createSelector(
  [selectSuperAdminState],
  (state) => state?.error || null
);
// endregion
