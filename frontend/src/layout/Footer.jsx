// region imports
import React from "react";
// endregion

const Footer = () => {
  return (
    <footer className="bg-light text-center text-muted py-3 mt-auto border-top">
      &copy; {new Date().getFullYear()} Employee Management. All rights reserved.
    </footer>
  );
};

// region exports
export default Footer;
// endregion
