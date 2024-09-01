import PropTypes from "prop-types"; // Import PropTypes
import "../styles/sidebar.css";
import { Container, Nav } from "react-bootstrap";
import {
  FaBullhorn,
  FaChalkboardTeacher,
  FaCog,
  FaRobot,
  FaTachometerAlt,
  FaUserGraduate,
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen }) => {
  // Add prop validation
  Sidebar.propTypes = {
    isSidebarOpen: PropTypes.bool.isRequired,
  };
  return (
    <Container className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebarheader text-center my-5">
        <h3>Logo</h3>
        <h1>Image</h1>
      </div>
      <Nav className="sidebarnav" variant="pills" defaultActiveKey="/dashboard">
        <Nav.Item>
          <Nav.Link className="sidebarnavlink" eventKey="link-1" href="">
            <FaTachometerAlt className="navicon" /> Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="sidebarnavlink" eventKey="link-2" href="">
            <FaBullhorn className="navicon" /> Announcements
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            className="sidebarnavlink"
            eventKey="link-3"
            href="instructors"
          >
            <FaChalkboardTeacher className="navicon" /> Instructors
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            className="sidebarnavlink"
            eventKey="link-4"
            href="students"
          >
            <FaUserGraduate className="navicon" /> Students
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="sidebarnavlink" eventKey="link-5" href="chatbot">
            <FaRobot className="navicon" /> Chatbot
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            className="sidebarnavlink"
            eventKey="link-6"
            href="settings"
          >
            <FaCog className="navicon" /> Settings
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
};

export default Sidebar;
