import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import Sidebar from "./components/Sidebar.component";
import NavBar from "./components/Navbar.component";
import { useDispatch } from "react-redux";
import { auth } from "./services/firebase";
import { login, logout, setUser } from "./store/authSlice";
import { SnackbarProvider } from "notistack";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(() => {
    const sidebarState = localStorage.getItem("sidebarOpen");
    return sidebarState ? JSON.parse(sidebarState) : false;
  });
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData && userData.acc_type && userData.name) {
      dispatch(setUser({ payload: userData }));
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(login({ payload: userData }));
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const toggleSidebar = () => {
    localStorage.setItem("sidebarOpen",JSON.stringify(!isSidebarOpen));
    setSidebarOpen(!isSidebarOpen);
  };

  const isLoginPage =  window.location.pathname === "/";
  return (
    <SnackbarProvider maxSnack={3}>
      {!isLoginPage && (
        <>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <NavBar toggleSidebar={toggleSidebar} />
        </>
      )}
      
      <RouterProvider router={router} />
    </SnackbarProvider>
  );
}

export default App;
