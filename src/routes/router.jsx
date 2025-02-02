import { createBrowserRouter } from "react-router-dom";
import SigninPage from "../pages/Signin.page";
import Dashboard from "../pages/Dashboard.page";
import AnnouncementPage from "../pages/Annnouncement.page";
import SuperAdminSignInPage from "../pages/Superadminsignin.page";
import SuperAdminDashboardPage from "../pages/Superadmindashboard.page";
import SuperadminAddAdminPage from "../pages/Superadminaddadmin.page";
import AdminManagementStudent from "../pages/Adminmanagementstudent.page";
import AdminManagementInstructor from "../pages/Adminmanagementinstructor.page";
import AppLayout from "../layout/AppLayout";
import ChatbotManager from "../pages/ChabotManager";
import SuperAdminProtect from "../guard/SuperAdminGuard";
import AdminManagementAdmin from "../pages/Superadminmanagement.page";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import TermsAndPrivacy from "../pages/termsandprivacy";
const router = createBrowserRouter([
  {
    path: "/",
    element: <SigninPage />,
  },
  {
    path: "/privacy",
    element: <TermsAndPrivacy />,
  },
  { 
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/dashboard",
    element: (
      <AppLayout>
        <Dashboard />
      </AppLayout>
    ),
  },
  {
    path: "/announcements",
    element: (
      <AppLayout>
        <AnnouncementPage />
      </AppLayout>
    ),
  },
  {
    path: "/superadmin/signin",
    element: <SuperAdminSignInPage />,
  },
  {
    path: "/superadmin/dashboard",
    element: (
        <SuperAdminProtect>
          <SuperAdminDashboardPage />
        </SuperAdminProtect>
    ),
  },
  {
    path: "/superadmin/add-admin",
    element: (
        <SuperAdminProtect>
          <SuperadminAddAdminPage />
        </SuperAdminProtect>
    ),
  },
  {
    path: "/superadmin/manage-admin",
    element: (
        <SuperAdminProtect>
          <AdminManagementAdmin />
        </SuperAdminProtect>
    ),
  },
  {
    path: "/students",
    element: (
      <AppLayout>
        <AdminManagementStudent />
      </AppLayout>
    ),
  },
  {
    path: "/instructors",
    element: (
      <AppLayout>
        <AdminManagementInstructor />
      </AppLayout>
    ),
  },
  {
    path: "/chatbot",
    element: (
      <AppLayout>
        <ChatbotManager />
      </AppLayout>
    ),
  },
]);

export default router;
