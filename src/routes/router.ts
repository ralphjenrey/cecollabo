import { createBrowserRouter } from "react-router-dom";
import SigninPage from "../pages/Signin.page";
import Sidebar from "../components/Sidebar.component";
import NavBar from "../components/Navbar.component";

const router = createBrowserRouter(
    [
    {
        path: "/",
        Component: SigninPage,
    },

    ]
);

export default router;