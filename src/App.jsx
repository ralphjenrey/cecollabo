import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { useDispatch } from "react-redux";
import { auth, superAdminAuth, database } from "./services/firebase";
import { login, logout } from "./store/authSlice";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Loading from "./components/Loading.component";
import { ref, get } from "firebase/database";

function App() {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // console.log("User is signed in");
          // Get additional user data from database
          const userRef = ref(database, `Users/${user.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = {
              uid: user.uid,
              email: user.email,
              ...snapshot.val()
            };
            dispatch(login(userData));
          } else {
            console.error("User data not found in database");
            dispatch(logout());
          }
        } else {
          // console.log("User is signed out");
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

   // SuperAdmin auth effect
   useEffect(() => {
    const unsubscribeSuperAdmin = superAdminAuth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const userRef = ref(database, `Users/${user.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists() && snapshot.val().role === 'superadmin') {
            const userData = {
              uid: user.uid,
              email: user.email,
              ...snapshot.val(),
            };
            dispatch(login(userData));
          }
        }
      } catch (error) {
        console.error("Error fetching superadmin data:", error);
      }
    });

    return () => unsubscribeSuperAdmin();
  }, [dispatch]);


  if (isLoading) {
    return <Loading />;
  }

  return (
    <SnackbarProvider maxSnack={3}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </SnackbarProvider>
  );
}

export default App;