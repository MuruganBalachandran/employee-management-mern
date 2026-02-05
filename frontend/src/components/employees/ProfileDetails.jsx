// region imports
import React from "react";
// endregion

// region helper
const formatDate = (date = "") => {
  if (!date) return "-";
  const d = new Date(date);
  return isNaN(d) ? "-" : d.toLocaleString();
};
// endregion

// region component
const ProfileDetails = ({
  user = {},        // user object with profile details
  showMeta = false, // flag to show meta info like IDs and timestamps
}) => {
  if (!user?._id) {
    return (
      <div className="p-4 text-center text-muted">
        No data found.
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">

        {/* Basic Info Section */}
        <h5 className="card-title mb-3">Profile Details</h5>
        <div className="row mb-2">
          <div className="col-sm-3 fw-bold">Name</div>
          <div className="col-sm-9">{user?.Name || "-"}</div>
        </div>
        <div className="row mb-2">
          <div className="col-sm-3 fw-bold">Email</div>
          <div className="col-sm-9">{user?.Email || "-"}</div>
        </div>
        <div className="row mb-2">
          <div className="col-sm-3 fw-bold">Phone</div>
          <div className="col-sm-9">{user?.Phone || "-"}</div>
        </div>

        <hr />

        {/* Address Section */}
        <h6 className="text-secondary mb-2">Address</h6>
        {["Line1", "Line2", "City", "State", "ZipCode"].map((key) => (
          <div className="row mb-2" key={key}>
            <div className="col-sm-3 fw-bold">
              {key.replace(/([A-Z])/g, " $1")}
            </div>
            <div className="col-sm-9">{user?.Address?.[key] || "-"}</div>
          </div>
        ))}

        {/* Meta Info Section */}
        {showMeta && (
          <>
            <hr />
            <h6 className="text-secondary mb-2">Meta Information</h6>
            <div className="row mb-2">
              <div className="col-sm-3 fw-bold">User ID</div>
              <div className="col-sm-9">{user?._id}</div>
            </div>
            <div className="row mb-2">
              <div className="col-sm-3 fw-bold">Created</div>
              <div className="col-sm-9">{formatDate(user?.Created_At)}</div>
            </div>
            <div className="row mb-2">
              <div className="col-sm-3 fw-bold">Updated</div>
              <div className="col-sm-9">{formatDate(user?.Updated_At)}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
// endregion

// region exports
export default ProfileDetails;
// endregion
