import { Form, Row, Col } from "react-bootstrap";
import CustomCard from "../components/CustomCard"; // Adjust the path as necessary
import CustomInput from "../components/CustomInput.component";
import { useState } from "react";
import { Button } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { database, superAdminAuth } from "../services/firebase";
import { getFirebaseErrorMessage } from "../utils/firebase.exceptions";
import { enqueueSnackbar } from "notistack";
import { ref, set } from "firebase/database";
import { COURSE_OPTIONS } from "../constants/course";

const SuperadminAddAdminPage = () => {
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminDepartment, setAdminDepartment] = useState("");

  const handleAdminNameChange = (e) => {
    setAdminName(e.target.value);
  };

  const handleAdminEmailChange = (e) => {
    setAdminEmail(e.target.value);
  };

  const handleAdminPasswordChange = (e) => {
    setAdminPassword(e.target.value);
  };

  const handleAdminDepartmentChange = (e) => {
    setAdminDepartment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        superAdminAuth,
        adminEmail,
        adminPassword
      );
      const user = userCredential.user;
      await set(ref(database, `Users/${user.uid}`), {
        name: adminName,
        email: adminEmail,
        department: adminDepartment,
        acc_type: "admin",
      });
      await superAdminAuth.signOut();
      setAdminEmail("");
      setAdminPassword("");
      setAdminName("");
      setAdminDepartment("");
      enqueueSnackbar("Admin account created successfully", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    } catch (error) {
      if (Object.prototype.hasOwnProperty.call(error, "code")) {
        console.log("Error code:", error.code);
        const errorMessage = getFirebaseErrorMessage(error.code);
        console.error("Error signing in:", errorMessage);
        enqueueSnackbar(errorMessage, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      } else {
        console.error("An error occurred. Please try again." + error);
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      }
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CustomCard
        style={{ width: "90%" }}
        header={<h3>Add New Admin</h3>}
        footer={<p>Footer content here</p>}
      >
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={6}>
              <CustomInput
                controlId="adminName"
                label="Name"
                type="text"
                placeholder="Enter admin name"
                className="py-3"
                style={{ maxWidth: "400px" }}
                value={adminName}
                onChange={handleAdminNameChange}
              />
            </Col>

            <Col lg={6}>
              <Form.Select
                value={adminDepartment}
                onChange={handleAdminDepartmentChange}
                className="py-3 mb-3"
                aria-label="Default select example"
                style={{ maxWidth: "400px" }}
              >
                <option>Select Department/Organization</option>
                {Object.keys(COURSE_OPTIONS).map((key) => (
                  <option key={key} value={key}>
                    {COURSE_OPTIONS[key]}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <CustomInput
            controlId="adminEmail"
            label="Email"
            type="email"
            placeholder="Enter admin email"
            value={adminEmail}
            className="py-3"
            style={{ maxWidth: "400px" }}
            onChange={handleAdminEmailChange}
          />
          <CustomInput
            controlId="adminPassword"
            label="Password"
            type="password"
            placeholder="Enter admin password"
            className="py-3"
            style={{ maxWidth: "400px" }}
            value={adminPassword}
            onChange={handleAdminPasswordChange}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "gray", color: "white" }}
          >
            Add Admin
          </Button>{" "}
        </Form>
      </CustomCard>
    </div>
  );
};

export default SuperadminAddAdminPage;
