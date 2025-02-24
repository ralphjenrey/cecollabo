import PropTypes from "prop-types"; // Import PropTypes
import "../styles/sidebar.css";
import { Container, Image, Nav } from "react-bootstrap";
import {
  FaBullhorn,
  FaChalkboardTeacher,
  FaRobot,
  FaTachometerAlt,
  FaUserGraduate,
} from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { auth, database } from "../services/firebase";
import { get, ref } from "firebase/database";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const navItems = [
  {
    eventKey: "link-1",
    href: "/dashboard",
    icon: FaTachometerAlt,
    label: "Dashboard",
  },
  {
    eventKey: "link-2",
    href: "/announcements",
    icon: FaBullhorn,
    label: "Announcements",
  },
  {
    eventKey: "link-3",
    href: "/instructors",
    icon: FaChalkboardTeacher,
    label: "Instructors",
  },
  {
    eventKey: "link-4",
    href: "/students",
    icon: FaUserGraduate,
    label: "Students",
  },
  { eventKey: "link-5", href: "/chatbot", icon: FaRobot, label: "Chatbot" },
  // { eventKey: "link-6", href: "/settings", icon: FaCog, label: "Settings" },
];

const superAdminNavItems = [
  {
    eventKey: "link-1",
    href: "/superadmin/dashboard",
    icon: FaTachometerAlt,
    label: "Dashboard",
  },
  {
    eventKey: "link-2",
    href: "/superadmin/add-admin",
    icon: FaUserGraduate,
    label: "Add Admin",
  },
  {
    eventKey: "link-3",
    href: "/superadmin/manage-admin",
    icon: FaPeopleGroup,
    label: "Manage Admin",
  },
];

const fetchUser = async () => {
  const uid = auth.currentUser?.uid;
  const user = localStorage.getItem("user");
  if (!user || !uid) {
    return null;
  }
  if (!uid) {
    return localStorage.getItem("user");
  }
  const userRef = ref(database, `Users/${uid}`);
  return await get(userRef);
};

const Sidebar = ({ isSidebarOpen, isSuperAdmin = false, toggleSidebar }) => {
  const itemsToRender = isSuperAdmin ? superAdminNavItems : navItems;
  const navigate = useNavigate();

  let user = fetchUser();
  if (typeof user === "string") {
    user = JSON.parse(user);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".toggleicon")) {
        return;
      }
      const isSidebarElement = event.target.closest(
        ".sidebar, .sidebar-toggle",
        ".toggleicon"
      );
      if (!isSidebarElement && isSidebarOpen) {
        console.log("Clicked outside");
        toggleSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, toggleSidebar]);

  return (
    <Container className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebarheader text-center my-5">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/cecollabo-b85cd.appspot.com/o/image__3_-removebg-preview.png?alt=media&token=5f72a1c7-43e3-4875-9a7a-17709778db82"
          width={100}
          height={95}
          className="signinlogo mb-4"
        />
        <h2 className="mb-2">CECollabo</h2>
        <h4>{user?.email || user?.name}</h4>
      </div>
      <Nav className="sidebarnav" variant="pills" defaultActiveKey="/dashboard">
        {itemsToRender.map((item) => (
          <Nav.Item key={item.eventKey}>
            <Nav.Link
              className="sidebarnavlink"
              eventKey={item.eventKey}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="navicon" /> {item.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </Container>
  );
};

// Add prop validation
Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  isSuperAdmin: PropTypes.bool,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
