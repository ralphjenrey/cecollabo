import { useReducer, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Button as MuiButton } from "@mui/material";
import { auth } from "../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { enqueueSnackbar } from "notistack";
import { initialState, loadingReducer } from "../store/loadingReducer";
import CustomInput from "../components/CustomInput.component";
import { resetPassword } from "../api/accountmanagement";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loadingStates, dispatch] = useReducer(loadingReducer, initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", payload: { id: "forgotPassword" } });
    await resetPassword(email);

    dispatch({ type: "UNSET_LOADING", payload: { id: "forgotPassword" } });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <CustomInput
        controlId="forgotPasswordEmail"
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email"
      />
      <MuiButton
        className="forgotpassbtn"
        type="submit"
        disabled={loadingStates.forgotPassword}
      >
       Reset Password
      </MuiButton>
    </Form>
  );
};

export default ForgotPasswordPage;
