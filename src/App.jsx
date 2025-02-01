import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { useDispatch } from "react-redux";
import { auth } from "./services/firebase";
import { login, logout, setUser } from "./store/authSlice";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Loading from "./components/Loading.component";

function App() {
  const [isLoading, setLoading] = useState(true); // Add loading state

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true); // Set loading to true when component mounts
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData?.token) {
      // Check if token is not null
      dispatch(setUser({ payload: userData }));

      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("User is signed in");
          dispatch(login({ payload: userData }));
        } else {
          console.log("User is signed out");
          dispatch(logout());
        }
        setLoading(false); // Set loading to false after auth state is determined
      });

      return () => unsubscribe();
    } else {
      setLoading(false); // Set loading to false if userData is invalid
    }
  }, [dispatch]);

  if (isLoading) {
    return <Loading />; // Display loading indicator
  }

  return (
    <SnackbarProvider maxSnack={3}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router}></RouterProvider>
      </LocalizationProvider>
    </SnackbarProvider>
  );
}

export default App;
