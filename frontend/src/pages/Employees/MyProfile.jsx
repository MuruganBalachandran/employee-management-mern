// region imports
import React from "react";
import { useSelector } from "react-redux";
// endregion

// region component
const MyProfile = () => {
  const user = useSelector((state) => state?.auth?.user ?? {});

  if (!user?._id) {
    return <div className='p-4'>No user data found.</div>;
  }

  return (
    <div className='container mt-4'>
      <div className='card shadow-sm'>
        <div className='card-body'>
          <h4 className='card-title mb-4'>My Profile</h4>

          <div className='row mb-2'>
            <div className='col-sm-3 fw-bold'>Name:</div>
            <div className='col-sm-9'>{user?.name ?? "-"}</div>
          </div>

          <div className='row mb-2'>
            <div className='col-sm-3 fw-bold'>Email:</div>
            <div className='col-sm-9'>{user?.email ?? "-"}</div>
          </div>

          <div className='row mb-2'>
            <div className='col-sm-3 fw-bold'>Role:</div>
            <div className='col-sm-9 text-capitalize'>{user?.role ?? "-"}</div>
          </div>

          <div className='row mb-2'>
            <div className='col-sm-3 fw-bold'>User ID:</div>
            <div className='col-sm-9'>{user?._id ?? "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
// endregion

export default MyProfile;
