import { useEffect, useState } from "react";
import { Card, Form, Image } from "react-bootstrap";
import backgroundImage from "../assets/superadmin.jpg";
import "../styles/superadminsignin.css";
import CustomInput from "../components/CustomInput.component";
import CustomButton from "../components/CustomButton";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { database, superAdminAuth } from "../services/firebase";

import { getFirebaseErrorMessage } from "../utils/firebase.exceptions";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SuperAdminSignInPage = () => {
  const [email, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const  navigate  = useNavigate();

  useEffect(() => {
  if (isAuthenticated) {
    if (role === "superadmin") {
    navigate("/superadmin/dashboard");
    } else {
      navigate("/dashboard");
    }
  }
}, [isAuthenticated, role]);

  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Query users by email and get first child
      const usersRef = ref(database, "Users");
      const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
      const snapshot = await get(emailQuery);
  
      if (!snapshot.exists()) {
        setError("Invalid email or password");
        return;
      }
  
      // Get the first child directly
      const userId = Object.keys(snapshot.val())[0];
      const userData = snapshot.child(userId).val();
  
      if (userData.role !== "superadmin") {
        setError("Access denied. Super admin privileges required.");
        return;
      }
  
      // Sign in with Firebase Auth
      await signInWithEmailAndPassword(superAdminAuth, email, password);
    } catch (error) {
      if (Object.prototype.hasOwnProperty.call(error, "code")) {
        const errorMessage = getFirebaseErrorMessage(error.code);
        console.error("Firebase error:", errorMessage);
        setError(errorMessage);
      } else {
        console.error("An error occurred. Please try again.", error);
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div
      className="superadmincontainer"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center", // Optional: to center the image
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Ensure the container takes the full height of the viewport
      }}
    >
      <Card className="superadmincard">
        <Card.Header className="superadminheader text-center">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNfN2wUtMrKxoqZmmYbmj1yWoWwBrEIcJoeA&s"
            width={100}
            height={100}
          />
        </Card.Header>
        <Card.Body>
          <br></br>
          <Card.Title className="superadmintitle">
            <h3>Super Admin Sign In</h3>
          </Card.Title>
          <br></br>
          <Form onSubmit={handleSubmit}>
            <CustomInput
              placeholder={"Username"}
              type="text"
              value={email}
              onChange={handleUsernameChange}
            />
            <CustomInput
              placeholder={"Password"}
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {error && <p className="text-danger">{error}</p>}
            <CustomButton
              type="submit"
              onClick={handleSubmit}
              className="w-100 mb-4 py-3"
            >
              LOG IN
            </CustomButton>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SuperAdminSignInPage;
