import { Container, Image, Navbar } from "react-bootstrap";
import "../styles/navbar.css";
import { FaBars } from "react-icons/fa";
import PropTypes from "prop-types"; // Import PropTypes
import { auth } from "../services/firebase";

const NavBar = ({ toggleSidebar }) => {
  NavBar.propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
  };
  const handleLogout = () => {
    auth.signOut();
    window.location.href = "/";
  };

  const user = auth.currentUser;
  const email = user ? user.email : "";

  return (
    <Navbar className="navbar">
      <Container className="navbarcontainer">
        <Navbar.Brand className="navbartext" href="">
          <Image
            src="https://i.ibb.co/mNNvyhS/image.png"
            width={50}
            height={45}
            className="signinlogo mb-2"
          />
        </Navbar.Brand>
        <Navbar.Brand className="welcometext navbartext" href="">
          {email}
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="navbartext">
            <FaBars size={30}  onClick={toggleSidebar} className="navicon" />
          </Navbar.Text>
          <Navbar.Text className="navbartext" onClick={handleLogout}>
            Sign out
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
