import { Container, Navbar } from "react-bootstrap";
import "../styles/navbar.css";
import { FaBars } from "react-icons/fa";
import PropTypes from "prop-types"; // Import PropTypes

const NavBar = ({ toggleSidebar }) => {
  NavBar.propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
  };
  return (
    <Navbar className="navbar">
      <Container className="navbarcontainer">
        <Navbar.Brand className="navbartext" href="">
          Logo
        </Navbar.Brand>
        <Navbar.Brand className="welcometext navbartext" href="">
          Welcome admin234!
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="navbartext">
            <FaBars onClick={toggleSidebar} className="navicon" />
          </Navbar.Text>
          <Navbar.Text className="navbartext">Sign out</Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
