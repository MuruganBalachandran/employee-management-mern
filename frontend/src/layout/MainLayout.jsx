// region imports
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
// endregion

const MainLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container py-4">{children}</main>
      <Footer />
    </div>
  );
};

// region exports
export default MainLayout;
// endregion
