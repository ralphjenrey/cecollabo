import { createBrowserRouter } from "react-router-dom";
import SigninPage from "../pages/Signin.page";

const router = createBrowserRouter(
    [
    {
        path: "/",
        Component: SigninPage
    },

    ]
);

export default router;