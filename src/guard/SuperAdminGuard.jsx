import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar.component";
import NavBar from "../components/Navbar.component";
import { useEffect, useState } from "react";
import { fetchAuthState } from "../store/authSlice";
import Loading from "../components/Loading.component";

const SuperAdminProtect = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        await dispatch(fetchAuthState()).unwrap();
      } catch (error) {
        console.error('Auth fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuth();
  }, [dispatch]);

if (loading) {
  return <Loading />;
}
// Conditional rendering based on authentication state
if (!isAuthenticated && !loading) {
    console.log("User is not authenticated");
    return <Navigate to="/superadmin/signin" />;
}

const toggleSidebar = () => {
    console.log("toggle sidebar");
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
