import {
  Autocomplete,
  Button,
  debounce,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"; // Add Table import
import { useEffect, useReducer, useState } from "react";
import CustomInput from "../components/CustomInput.component";
import { Accordion, Col, Container, Form, Row } from "react-bootstrap";
import CustomCard from "../components/CustomCard";
import { enqueueSnackbar } from "notistack";
import { COURSE_OPTIONS } from "../constants/course";
import EditModal from "../components/EditModal";
import "../styles/adminmanagementstudent.css";
import { YEARS } from "../constants/year";
import {
  fetchUsers,
  StudenHandleUpdate,
  StudentHandleSubmit,
} from "../api/Adminmanagementstudent";
import ReusableTable from "../components/Table.component";
import { initialState, loadingReducer } from "../store/loadingReducer";

const AdminManagementStudent = () => {
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    yearLevel: "",
    picture: null,
    email: "",
    password: "",
    department: "",
    show: true,
  });
  const [editStudent, setEditStudent] = useState({
    id: "",
    firstName: "",
    lastName: "",
    middleName: "",
    yearLevel: "",
    picture: null,
    email: "",
    department: "",
    show: true,
  });
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchField, setSearchField] = useState("firstName");
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKey, setActiveKey] = useState("0"); // Add at top with other state
  const [loadingStates, dispatch] = useReducer(loadingReducer, initialState);

  const handleNewStudentChange = (e) => {
    const { name, value, type, files } = e.target;
    console.log(name, value, type, files);
    if (type === "file") {
      handleFileUpload(files[0], e, "new");
    } else {
      setNewStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = (file, e, submissionType) => {
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png"];
      if (!validImageTypes.includes(file.type)) {
        enqueueSnackbar("Please upload a valid image file (JPEG, PNG)", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
        e.target.value = null;
        return;
      }

      if (submissionType === "edit") {
        setEditStudent((prev) => ({ ...prev, picture: file }));
      }
      if (submissionType === "new") {
        setNewStudent((prev) => ({ ...prev, picture: file }));
      }
    }
  };

  const handleEditStudentChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      handleFileUpload(files[0], e, "edit");
    } else {
      setEditStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", payload: { id: "submitStudent" } });
    const result = await StudentHandleSubmit(e, newStudent);

    if (result) {
      dispatch({ type: "UNSET_LOADING", payload: { id: "submitStudent" } });
      setActiveKey(null); // Close accordion on success
    }

    dispatch({ type: "UNSET_LOADING", payload: { id: "submitStudent" } });
    setStudents((prev) => [...prev, result]);
    setNewStudent({
      firstName: "",
      lastName: "",
      middleName: "",
      yearLevel: "",
      picture: "",
      email: "",
      password: "",

      // department: "",
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleUpdate = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: { id: "updateStudent" } });
      console.log("Updating student:", editStudent);
      const updatedStudent = await StudenHandleUpdate(
        editStudent,
        handleModalClose
      );

      setStudents(
        students.map((student) => {
          if (student.id === updatedStudent.id) {
            return {
              ...student,
              ...updatedStudent,
              image:
                updatedStudent.image !== null
                  ? updatedStudent.image
                  : student.image,
            };
          }
          return student;
        })
      );
    } catch (error) {
      dispatch({ type: "UNSET_LOADING", payload: { id: "updateStudent" } });
      console.error("Error updating student:", error);
    } finally {
      dispatch({ type: "UNSET_LOADING", payload: { id: "updateStudent" } });
    }
  };

  const handleModalShow = (student) => {
    const defaultYearLevel = YEARS[0];
    const defaultDepartment = Object.keys(COURSE_OPTIONS)[0];
    student.yearLevel = student.yearLevel ?? defaultYearLevel;
    student.department = student.department ?? defaultDepartment;
    setEditStudent({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      middleName: student.middleName,
      yearLevel: student.yearLevel,
      picture: student.picture,
      email: student.email,
      department: student.department,
      show: student.show,
    });
    setShowModal(true);
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const fetchUser = async () => {
    console.log("fetching students");

    const students = await fetchUsers();
    setStudents(students);
  };

  const tableHeaders = [
    { key: "firstName", value: "First Name" },
    { key: "lastName", value: "Last Name" },
    { key: "middleName", value: "Middle Name" },
    { key: "yearLevel", value: "Year Level" },
    { key: "picture", value: "Picture" },
    { key: "email", value: "Email" },
    { key: "department", value: "Department" },
    { key: "show", value: "Status" },
  ];

  const excludeSortingHeaders = [{ key: "picture", value: "Picture" }];

  const tableActions = [
    {
      label: "Edit",
      variant: "warning",
      handler: handleModalShow,
    },
  ];

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    setFilteredStudents(
      students
        .filter((student) => student !== undefined) // Filter out undefined values
        .filter(
          (student) =>
            student[searchField] &&
            student[searchField]
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm, students]);

  const uniqueOptions = Array.from(
    new Set(
      students.map((student) =>
        student && student[searchField] ? student[searchField] : ""
      )
    )
  );

  return (
    <Container className="mt-3">
      <Accordion
        defaultActiveKey="1"
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)}
        style={{ width: "100%" }}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>Add New Student</Accordion.Header>
          <Accordion.Body>
            <CustomCard
              style={{ width: "100%" }}
              header={<h3>Add New Student</h3>}
            >
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col lg={6}>
                    <CustomInput
                      controlId="StudentFirstName"
                      label="First Name"
                      type="text"
                      placeholder="Student first name"
                      style={{ maxWidth: "400px" }}
                      value={newStudent.firstName}
                      onChange={handleNewStudentChange}
                      name="firstName"
                    />
                  </Col>
                  <Col lg={6}>
                    <CustomInput
                      controlId="StudentLastName"
                      label="Last Name"
                      type="text"
                      placeholder="Student last name"
                      style={{ maxWidth: "400px" }}
                      value={newStudent.lastName}
                      onChange={handleNewStudentChange}
                      name="lastName"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <CustomInput
                      controlId="StudentMiddleName"
                      label="Middle Name"
                      type="text"
                      placeholder="Student middle name"
                      style={{ maxWidth: "400px" }}
                      value={newStudent.middleName}
                      onChange={handleNewStudentChange}
                      name="middleName"
                    />
                  </Col>
                  <Col lg={6}>
                    <Form.Select
                      value={newStudent.yearLevel}
                      onChange={handleNewStudentChange}
                      className="py-3 mb-3"
                      aria-label="Year Level"
                      style={{ maxWidth: "400px" }}
                      name="yearLevel"
                    >
                      {YEARS.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <CustomInput
                      controlId="StudentPicture"
                      label="Student Picture"
                      type="file"
                      placeholder="Choose New Picture"
                      style={{ maxWidth: "400px" }}
                      value={newStudent.picture}
                      onChange={handleNewStudentChange}
                      name="picture"
                    />
                  </Col>

                  {/* <Col lg={6}>
                    <Form.Select
                      value={newStudent.department}
                      onChange={handleNewStudentChange}
                      className="py-3 mb-3"
                      aria-label="Student Department"
                      style={{ maxWidth: "400px" }}
                      name="department"
                    >
                      {Object.entries(COURSE_OPTIONS).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </Form.Select>
                  </Col> */}
                </Row>
                <CustomInput
                  controlId="studentEmail"
                  label="Email"
                  type="email"
                  placeholder="Student email"
                  value={newStudent.email}
                  style={{ maxWidth: "400px" }}
                  onChange={handleNewStudentChange}
                  name={"email"}
                />
                <CustomInput
                  controlId="studentPassword"
                  label="Password"
                  type="password"
                  placeholder="Student password"
                  style={{ maxWidth: "400px" }}
                  value={newStudent.password}
                  onChange={handleNewStudentChange}
                  name={"password"}
                />
                <Button
                  loading={loadingStates.submitStudent}
                  loadingPosition="end"
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: "gray", color: "white" }}
                >
                  Add Student
                </Button>
              </Form>
            </CustomCard>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <EditModal
        show={showModal}
        handleClose={handleModalClose}
        header="Edit Student"
        footer={
          <Button
            loading={loadingStates.updateStudent}
            loadingPosition="end"
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "gray", color: "white" }}
            onClick={handleUpdate}
          >
            Save changes
          </Button>
        }
      >
        <Form>
          <Row>
            <Col lg={6}>
              <CustomInput
                controlId="EditStudentFirstName"
                label="First Name"
                type="text"
                placeholder="Student first name"
                style={{ maxWidth: "400px" }}
                value={editStudent.firstName}
                onChange={handleEditStudentChange}
                name="firstName"
              />
            </Col>
            <Col lg={6}>
              <CustomInput
                controlId="StudentLastName"
                label="Last Name"
                type="text"
                placeholder="Student last name"
                style={{ maxWidth: "400px" }}
                value={editStudent.lastName}
                onChange={handleEditStudentChange}
                name="lastName"
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <CustomInput
                controlId="StudentMiddleName"
                label="Middle Name"
                type="text"
                placeholder="Middle name"
                style={{ maxWidth: "400px" }}
                value={editStudent.middleName}
                onChange={handleEditStudentChange}
                name="middleName"
              />
            </Col>
            <Col lg={6}>
              <Form.Select
                value={editStudent.yearLevel}
                onChange={handleEditStudentChange}
                className="py-3 mb-3"
                aria-label="Year Level"
                style={{ maxWidth: "400px" }}
                name="yearLevel"
              >
                {YEARS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <CustomInput
                controlId="StudentPicture"
                label="Change Picture"
                type="file"
                placeholder="Change Picture"
                style={{ maxWidth: "400px" }}
                value={editStudent.picture}
                onChange={handleEditStudentChange}
                name="picture"
              />
            </Col>
            <Form.Group as={Col} lg={6} className="mb-3 align-content-center">
              <Form.Check
                controlId="show"
                type="checkbox"
                id="show"
                label="Show"
                name="show"
                checked={editStudent.show}
                onChange={(e) =>
                  handleEditStudentChange({
                    target: {
                      name: "show",
                      value: e.target.checked,
                    },
                  })
                }
              />
            </Form.Group>
            {/* <Col lg={6}>
              <Form.Select
                value={editStudent.department}
                onChange={handleEditStudentChange}
                className="py-3 mb-3"
                aria-label="Default select example"
                style={{ maxWidth: "400px" }}
                name="department"
              >
                {Object.entries(COURSE_OPTIONS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Form.Select>
            </Col> */}
          </Row>
          {/* <CustomInput
            controlId="studentEmail"
            label="Email"
            type="email"
            placeholder="Student email"
            value={editStudent.email}
            style={{ maxWidth: "400px" }}
            onChange={handleEditStudentChange}
            name={"email"}
          /> */}
        </Form>
      </EditModal>
      <br></br>
      <div>
        <Row>
          <Col lg={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="search-field-label">Search By</InputLabel>
              <Select
                labelId="search-field-label"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                label="Search By"
              >
                <MenuItem value="firstName">First Name</MenuItem>
                <MenuItem value="lastName">Last Name</MenuItem>
                <MenuItem value="middleName">Middle Name</MenuItem>
                <MenuItem value="yearLevel">Year Level</MenuItem>
                <MenuItem value="department">Department</MenuItem>
              </Select>
            </FormControl>
          </Col>
          <Col lg={9}>
            <Autocomplete
              freeSolo
              options={uniqueOptions}
              onInputChange={(event, value) => handleSearch(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Col>
        </Row>

        <ReusableTable
          headers={tableHeaders}
          data={filteredStudents.map((student) => ({
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            middleName: student.middleName,
            yearLevel: student.yearLevel,
            picture: (
              <img
                onError={(e) =>
                  (e.target.src =
                    import.meta.env.VITE_PLACEHOLDER_IMAGE)
                }
                src={student.picture ?? import.meta.env.VITE_PLACEHOLDER_IMAGE}
                width={50}
                height={50}
                alt="Student"
              />
            ),
            email: student.email,
            department: student.department,
            show: student.show,
          }))}
          actions={tableActions}
          excludeSortingHeaders={excludeSortingHeaders}
        />
      </div>
    </Container>
  );
};

export default AdminManagementStudent;
