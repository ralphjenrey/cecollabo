import PropTypes from "prop-types"; // Import PropTypes
import "../styles/sidebar.css";
import { Container, Image, Nav } from "react-bootstrap";
import {
  FaBullhorn,
  FaChalkboardTeacher,
  FaCog,
  FaRobot,
  FaTachometerAlt,
  FaUserGraduate,
} from "react-icons/fa";

const navItems = [
  { eventKey: "link-1", href: "/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
  { eventKey: "link-2", href: "/announcements", icon: FaBullhorn, label: "Announcements" },
  { eventKey: "link-3", href: "instructors", icon: FaChalkboardTeacher, label: "Instructors" },
  { eventKey: "link-4", href: "students", icon: FaUserGraduate, label: "Students"},
  { eventKey: "link-5", href: "chatbot", icon: FaRobot, label: "Chatbot" },
  { eventKey: "link-6", href: "settings", icon: FaCog, label: "Settings" },
];

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <Container className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebarheader text-center my-5">
        <Image
          src="https://i.ibb.co/mNNvyhS/image.png"
          width={100}
          height={95}
          className="signinlogo mb-2"
        />
        <h2>CECollabo</h2>
      </div>
      <Nav className="sidebarnav" variant="pills" defaultActiveKey="/dashboard">
        {navItems.map((item) => (
          <Nav.Item key={item.eventKey}>
            <Nav.Link className="sidebarnavlink" eventKey={item.eventKey} href={item.href}>
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
};

export default Sidebar;