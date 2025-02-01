import { Container, Image, Navbar } from "react-bootstrap";
import "../styles/navbar.css";
import { FaBars } from "react-icons/fa";
import PropTypes from "prop-types"; // Import PropTypes
import { auth } from "../services/firebase";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const NavBar = ({ toggleSidebar, isSuperAdmin = false }) => {
  NavBar.propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
    isSuperAdmin: PropTypes.bool,
  };
  const dispatch = useDispatch();
  const handleLogout = () => {
    if (isSuperAdmin){
      dispatch(logout());
    }
    else {
      auth.signOut();
      window.location.href = "/";
    }
  };

  const user = auth.currentUser;
  const email = user ? user.email : "";

  return (
    <Navbar className="navbar">
      <Container className="navbarcontainer">
        <Navbar.Brand className="navbartext" href="">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cecollabo-b85cd.appspot.com/o/image__3_-removebg-preview.png?alt=media&token=5f72a1c7-43e3-4875-9a7a-17709778db82"
            width={80}
            height={80}
            className="signinlogo mb-2"
          />
        </Navbar.Brand>
        <Navbar.Brand className="welcometext navbartext" href="">
          {email}
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="navbartext">
            <FaBars size={30}  onClick={toggleSidebar} className="navicon toggleicon" />
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
