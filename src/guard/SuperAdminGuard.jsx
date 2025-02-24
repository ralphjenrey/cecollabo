import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar.component";
import NavBar from "../components/Navbar.component";
import { useState } from "react";

const SuperAdminProtect = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

// Conditional rendering based on authentication state
if (!isAuthenticated) {
    console.log("User is not authenticated");
    return <Navigate to="/superadmin/signin" />;
}

const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
};

  return (
    <>
      <Sidebar isSidebarOpen={isSidebarOpen} isSuperAdmin={true} toggleSidebar={toggleSidebar} />
      <NavBar toggleSidebar={toggleSidebar} isSuperAdmin={true} />

      {children}
    </>
  );
};

SuperAdminProtect.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SuperAdminProtect;
