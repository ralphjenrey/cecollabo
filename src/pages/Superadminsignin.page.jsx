import { useState } from "react";
import { Card, Form, Image } from "react-bootstrap";
import backgroundImage from "../assets/superadmin.jpg";
import "../styles/superadminsignin.css";
import CustomInput from "../components/CustomInput.component";
import CustomButton from "../components/CustomButton";
import { get, ref } from "firebase/database";
import { database } from "../services/firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import {getFirebaseErrorMessage} from "../utils/firebase.exceptions";
import { useNavigate } from "react-router-dom";

const SuperAdminSignInPage = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = ref(database, `Users/${username}`);
      const user = await get(userRef);
      if (user.exists()) {
        const signInResult = user.child('password').val() === password;
        if (signInResult) {
          const userData = {
            acc_type: user.child('acc_type').val(),
            name: user.key,
          };
          localStorage.setItem('user', JSON.stringify(userData));
          dispatch(setUser({ role: userData.acc_type, name: userData.name }));
          // Redirect to the dashboard
          navigate("/superadmin/dashboard");
        } else {
          console.error("Error: Incorrect password.");
          // Optionally, set an error state to display an error message to the user
          // setError("Incorrect password.");
        }
      } else {
        console.error("Error: User does not exist.");
        // Optionally, set an error state to display an error message to the user
        // setError("User does not exist.");
      }
    } catch (error) {
      if (Object.prototype.hasOwnProperty.call(error, "code")) {
        const errorMessage = getFirebaseErrorMessage(error.code);
        console.error("Firebase error:", errorMessage);
        // Optionally, set an error state to display an error message to the user
        // setError(errorMessage);
      } else {
        console.error("An error occurred. Please try again.");
        // Optionally, set an error state to display an error message to the user
        // setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div
      className="superadmincontainer"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center', // Optional: to center the image
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh' // Ensure the container takes the full height of the viewport
      }}
    >
      <Card className="superadmincard">
        <Card.Header className="superadminheader text-center">
            <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNfN2wUtMrKxoqZmmYbmj1yWoWwBrEIcJoeA&s" width={100} height={100} />
        </Card.Header>
        <Card.Body>
            <br></br>
          <Card.Title className="superadmintitle"><h3>Super Admin Sign In</h3></Card.Title>
          <br></br>
          <Form onSubmit={handleSubmit}>
            <CustomInput
              className={"py-3"}
              placeholder={"Username"}
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
            <CustomInput
              className={"py-3"}
              placeholder={"Password"}
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <CustomButton type="submit" onClick={handleSubmit} className="w-100 mb-4 py-3">
              LOG IN
            </CustomButton>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SuperAdminSignInPage;