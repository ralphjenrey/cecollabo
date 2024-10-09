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
import { auth } from "../services/firebase";
import { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput.component";
import CustomButton from "../components/CustomButton";
import {getFirebaseErrorMessage } from "../utils/firebase.exceptions";
import { enqueueSnackbar } from "notistack";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useSelector } from "react-redux";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the dashboard
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      enqueueSnackbar("Please enter your email and password", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "center" } });
      return;
    }
    if (!email.includes("@")) {
      enqueueSnackbar("Please enter a valid email address", { variant: "error" , anchorOrigin: { vertical: "top", horizontal: "center" } });
      return;
    }
    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters long", { variant: "error" , anchorOrigin: { vertical: "top", horizontal: "center" } });
      return
    }
    try {
      // Attempt to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (Object.prototype.hasOwnProperty.call(error, "code")) {
        const errorMessage = getFirebaseErrorMessage(error.code);
        console.error("Error signing in:", errorMessage);
        enqueueSnackbar(errorMessage, { variant: "error", anchorOrigin: { vertical: "top", horizontal: "center" } });
      } else {
        console.error("An error occurred. Please try again.");
        enqueueSnackbar("An error occurred. Please try again.", { variant: "error" , anchorOrigin: { vertical: "top", horizontal: "center" } });
      }
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
              src="https://i.ibb.co/mNNvyhS/image.png"
              width={100}
              height={95}
              className="signinlogo"
            />
          </div>
          <br></br>
            <h4 className="mt-5">Sign in to your account</h4>
          <br />
          <Form onSubmit={handleSubmit}>
            <CustomInput type="email" placeholder={"Email"} value={email} onChange={handleEmailChange} />
        
            <CustomInput
              placeholder={"Password"}
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />

            <CustomButton type="submit" onClick={handleSubmit} className="w-100 mb-4 py-3">
              LOG IN
            </CustomButton>

            <Button className="forgotpassbtn">Forgot password</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SigninPage;
