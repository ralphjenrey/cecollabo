import { createBrowserRouter } from "react-router-dom";
import SigninPage from "../pages/Signin.page";
import Sidebar from "../components/Sidebar.component";
import NavBar from "../components/Navbar.component";
import Dashboard from "../pages/Dashboard.page";

const router = createBrowserRouter(
    [
    {
        path: "/",
        Component: SigninPage,
    },
    {
        path: "/dashboard",
        Component: Dashboard,
    }

    ]
);

export default router;