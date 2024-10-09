import { createBrowserRouter } from "react-router-dom";
import SigninPage from "../pages/Signin.page";
import Sidebar from "../components/Sidebar.component";
import Dashboard from "../pages/Dashboard.page";
import AnnouncementPage from "../pages/Annnouncement.page";
import SuperAdminSignInPage from "../pages/Superadminsignin.page";
import SuperAdminDashboardPage from "../pages/Superadmindashboard.page";
import SuperadminAddAdminPage from "../pages/Superadminaddadmin.page";
import { useSelector } from "react-redux";
import AdminManagementStudent from "../pages/Adminmanagementstudent.page";
// Fragment
  

const router = createBrowserRouter(
    [
    {
        path: "/",
        Component: SigninPage,
    },
    {
        path: "/dashboard",
        Component: Dashboard,
    },
    {
        path: "/announcements",
        Component: AnnouncementPage,
    },
    {
        path: "/superadmin/signin",
        Component: SuperAdminSignInPage,
    },
    {
        path: "/superadmin/dashboard",
        Component: SuperAdminDashboardPage
    },
    {
        path: "/superadmin/add-admin",
        Component: SuperadminAddAdminPage,
    },
    {
        path: "/students",
        Component: AdminManagementStudent,
    }

    ]
);

export default router;