import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Form,
  Button,
} from "react-bootstrap";
import "../styles/signin.css";
import { auth, database } from "../services/firebase";
import { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput.component";
import CustomButton from "../components/CustomButton";
import { getFirebaseErrorMessage } from "../utils/firebase.exceptions";
import { enqueueSnackbar } from "notistack";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useSelector } from "react-redux";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import ForgotPasswordPage from "./ForgotPasswordPage";
import { useNavigate } from "react-router-dom";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && role === "admin") {
      navigate("/dashboard");
    }
    else if (isAuthenticated && role === "superadmin") {
      navigate("/superadmin/dashboard");
    }
  }, [isAuthenticated]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!email || !password) {
      enqueueSnackbar("Please enter your email and password", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      setLoading(false);
      return;
    }
    if (!email.includes("@")) {
      enqueueSnackbar("Please enter a valid email address", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters long", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      setLoading(false);
      return;
    }
    try {
      // Reference to the Users node in the database
      const usersRef = ref(database, "Users");
      const userQuery = query(usersRef, orderByChild("email"), equalTo(email)); // Query to find user by email
      const snapshot = await get(userQuery);

      if (snapshot.exists()) {
        const user = snapshot.val(); // Get the user data
        const userId = Object.keys(user)[0]; // Get the user ID (assuming email is unique)
        const role = user[userId].role; // Get the user's role
        if (role === "admin") {
          // Attempt to sign in with email and password
          await signInWithEmailAndPassword(auth, email, password);
          console.log("User signed in successfully");
        } else {
          enqueueSnackbar("You are not authorized to access this page", {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "center" },
          });
          return;
        }
      } else {
        enqueueSnackbar("Invalid email or password", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
        return;
      }
    } catch (error) {
      if (Object.prototype.hasOwnProperty.call(error, "code")) {
        const errorMessage = getFirebaseErrorMessage(error.code);
        console.error("Error signing in:", errorMessage);
        enqueueSnackbar(errorMessage, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      } else {
        console.error("An error occurred. Please try again.");
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Container fluid className="signincontainer">
      <Row className="signininner gap-5">
        <Col lg={7}>
          <Card className="signincard">
            <h2>Your one stop</h2>
            <h1 className="fw-2">Announcements</h1>
          </Card>
        </Col>
        <Col className="signinformcol">
          <div className="text-center">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/cecollabo-b85cd.appspot.com/o/image__3_-removebg-preview.png?alt=media&token=5f72a1c7-43e3-4875-9a7a-17709778db82"
              width={200}
              className="signinlogo"
            />
          </div>
          <br></br>
          <h4 className="mt-5">{showForgotPassword ? "Reset your password" : "Sign in to your account"}</h4>
          <br />
          {showForgotPassword ? (
            <>
              <ForgotPasswordPage />
              <Button
                className="forgotpassbtn mt-2"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Sign In
              </Button>
            </>
          ) : (
            <>
              <Form onSubmit={handleSubmit}>
                <CustomInput
                  type="email"
                  placeholder={"Email"}
                  value={email}
                  onChange={handleEmailChange}
                />
                <CustomInput
                  placeholder={"Password"}
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <CustomButton
                  type="submit"
                  onClick={handleSubmit}
                  className="w-100 mb-4 py-3"
                  isLoading={loading}
                >
                  LOG IN
                </CustomButton>
              </Form>
              <Button
                className="forgotpassbtn"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SigninPage;
