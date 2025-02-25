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
import ReusableTable from "../components/Table.component";
import {
  fetchUsers,
  InstructorHandleSubmit,
  InstructorHandleUpdate,
} from "../api/Adminmanagementinstructor";
import { initialState, loadingReducer } from "../store/loadingReducer";

const AdminManagementInstructor = () => {
  const [newInstructor, setNewInstructor] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    picture: null,
    email: "",
    password: "",
    department: "",
  });
  const [editInstructor, setEditInstructor] = useState({
    id: "",
    firstName: "",
    lastName: "",
    middleName: "",
    picture: null,
    email: "",
    department: "",
  });
  const [instructors, setInstructors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchField, setSearchField] = useState("firstName");
  const [filteredInstructor, setFilteredInstructor] = useState(instructors);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStates, dispatch] = useReducer(loadingReducer, initialState);

  const handleNewInstructorChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      handleFileUpload(files[0], e, "new");
    } else {
      setNewInstructor((prev) => ({ ...prev, [name]: value }));
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
        setEditInstructor((prev) => ({ ...prev, picture: file }));
      }
      if (submissionType === "new") {
        setNewInstructor((prev) => ({ ...prev, picture: file }));
      }
    }
  };

  const handleEditInstructorChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      handleFileUpload(files[0], e, "edit");
    } else {
      setEditInstructor((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", payload: { id: "submitInstructor" } });
    try {
        const result = await InstructorHandleSubmit(e, newInstructor);
        if (!result) return;
        setInstructors((prev) => [...prev, result]);
        setNewInstructor({
            firstName: "",
            lastName: "",
            middleName: "",
            picture: "",
            email: "",
            password: "",
            // department: "",
        });
    } catch (error) {
        console.error("Error submitting instructor:", error);
    } finally {
        dispatch({ type: "UNSET_LOADING", payload: { id: "submitInstructor" } });
    }
};

  const handleModalClose = () => {
    setShowModal(false);
  };


const handleUpdate = async (instructorId) => {
    dispatch({ type: "SET_LOADING", payload: { id: "editInstructor" } });
    try {
        const updatedInstructor = await InstructorHandleUpdate(
            editInstructor,
            handleModalClose
        );

        setInstructors((prevInstructors) =>
            prevInstructors.map((i) => {
                if (i.id === updatedInstructor.id) {
                    // Retain the last picture if updatedInstructor.picture is null
                    return {
                        ...i,
                        picture: updatedInstructor.picture !== undefined ? updatedInstructor.picture : i.picture,
                        // Include other properties from updatedInstructor as needed
                        ...updatedInstructor,
                    };
                }
                return i;
            })
        );
    } catch (error) {
        console.error("Error updating instructor:", error);
    } finally {
        dispatch({ type: "UNSET_LOADING", payload: { id: "editInstructor" } });
    }
};

  const handleModalShow = (Instructor) => {
    const defaultDepartment = Object.keys(COURSE_OPTIONS)[0];
    Instructor.department = Instructor.department ?? defaultDepartment;
    setEditInstructor({
      id: Instructor.id,
      firstName: Instructor.firstName,
      lastName: Instructor.lastName,
      middleName: Instructor.middleName,
      picture: Instructor.picture,
      email: Instructor.email,
      department: Instructor.department,
    });
    setShowModal(true);
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const fetchUser = async () => {
    console.log("fetching Instructors");

    const Instructors = await fetchUsers();
    setInstructors(Instructors);
  };

  const tableHeaders = [
    { key: "firstName", value: "First Name" },
    { key: "lastName", value: "Last Name" },
    { key: "middleName", value: "Middle Name" },
    { key: "picture", value: "Picture" },
    { key: "email", value: "Email" },
    { key: "department", value: "Department" },
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
    const validInstructors = instructors.filter(
      (instructor) => instructor !== undefined
    );

    setFilteredInstructor(
      validInstructors.filter(
        (i) =>
          i[searchField] &&
          i[searchField].toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, instructors]);
  const uniqueOptions = Array.from(
    new Set(instructors.map((instructor) => instructor[searchField]))
  );

  return (
    <Container className="mt-3">
      <Accordion defaultActiveKey="1" style={{ width: "100%" }}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Add New Instructor</Accordion.Header>
          <Accordion.Body>
            <CustomCard
              style={{ width: "100%" }}
              header={<h3>Add New Instructor</h3>}
            >
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col lg={6}>
                    <CustomInput
                      controlId="InstructorFirstName"
                      label="First Name"
                      type="text"
                      placeholder="Instructor first name"
                      style={{ maxWidth: "400px" }}
                      value={newInstructor.firstName}
                      onChange={handleNewInstructorChange}
                      name="firstName"
                    />
                  </Col>
                  <Col lg={6}>
                    <CustomInput
                      controlId="InstructorLastName"
                      label="Last Name"
                      type="text"
                      placeholder="Instructor last name"
                      style={{ maxWidth: "400px" }}
                      value={newInstructor.lastName}
                      onChange={handleNewInstructorChange}
                      name="lastName"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <CustomInput
                      controlId="InstructorMiddleName"
                      label="Middle Name"
                      type="text"
                      placeholder="Instructor middle name"
                      style={{ maxWidth: "400px" }}
                      value={newInstructor.middleName}
                      onChange={handleNewInstructorChange}
                      name="middleName"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <CustomInput
                      controlId="InstructorPicture"
                      label="Instructor Picture"
                      type="file"
                      placeholder="Choose New Picture"
                      style={{ maxWidth: "400px" }}
                      value={newInstructor.picture}
                      onChange={handleNewInstructorChange}
                      name="picture"
                    />
                  </Col>
                  {/* <Col lg={6}>
                    <Form.Select
                      value={newInstructor.department}
                      onChange={handleNewInstructorChange}
                      className="py-3 mb-3"
                      aria-label="Instructor Department"
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
                  controlId="InstructorEmail"
                  label="Email"
                  type="email"
                  placeholder="Instructor email"
                  value={newInstructor.email}
                  style={{ maxWidth: "400px" }}
                  onChange={handleNewInstructorChange}
                  name={"email"}
                />
                <CustomInput
                  controlId="InstructorPassword"
                  label="Password"
                  type="password"
                  placeholder="Instructor password"
                  style={{ maxWidth: "400px" }}
                  value={newInstructor.password}
                  onChange={handleNewInstructorChange}
                  name={"password"}
                />
                <Button
                  loading={loadingStates.submitInstructor}
                  loadingPosition="end"
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: "gray", color: "white" }}
                >
                  Add Instructor
                </Button>
              </Form>
            </CustomCard>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <EditModal
        show={showModal}
        handleClose={handleModalClose}
        header="Edit Instructor"
        footer={
          <Button
            loading={loadingStates.editInstructor}
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
                controlId="EditInstructorFirstName"
                label="First Name"
                type="text"
                placeholder="Instructor first name"
                style={{ maxWidth: "400px" }}
                value={editInstructor.firstName}
                onChange={handleEditInstructorChange}
                name="firstName"
              />
            </Col>
            <Col lg={6}>
              <CustomInput
                controlId="InstructorLastName"
                label="Last Name"
                type="text"
                placeholder="Instructor last name"
                style={{ maxWidth: "400px" }}
                value={editInstructor.lastName}
                onChange={handleEditInstructorChange}
                name="lastName"
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <CustomInput
                controlId="InstructorMiddleName"
                label="Middle Name"
                type="text"
                placeholder="Middle name"
                style={{ maxWidth: "400px" }}
                value={editInstructor.middleName}
                onChange={handleEditInstructorChange}
                name="middleName"
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <CustomInput
                controlId="InstructorPicture"
                label="Change Picture"
                type="file"
                placeholder="Change Picture"
                style={{ maxWidth: "400px" }}
                value={editInstructor.picture}
                onChange={handleEditInstructorChange}
                name="picture"
              />
            </Col>
            {/* <Col lg={6}>
              <Form.Select
                value={editInstructor.department}
                onChange={handleEditInstructorChange}
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
            controlId="InstructorEmail"
            label="Email"
            type="email"
            placeholder="Instructor email"
            value={editInstructor.email}
            style={{ maxWidth: "400px" }}
            onChange={handleEditInstructorChange}
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
          data={filteredInstructor.map((instructor) => ({
            id: instructor.id,
            firstName: instructor.firstName,
            lastName: instructor.lastName,
            middleName: instructor.middleName,
            picture: (
              <img
                src={instructor.picture}
                width={50}
                height={50}
                alt="Instructor"
              />
            ),
            email: instructor.email,
            department: instructor.department,
          }))}
          actions={tableActions}
          excludeSortingHeaders={excludeSortingHeaders}
        />
        {/* <Table responsive>
            <thead>
              <tr>
                <th
                  style={{ paddingLeft: "32px" }}
                  onClick={() => handleSort("firstName")}
                >
                  First Name {renderSortIcon("firstName")}
                </th>
                <th onClick={() => handleSort("lastName")}>
                  Last Name {renderSortIcon("lastName")}
                </th>
                <th onClick={() => handleSort("middleName")}>
                  Middle Name {renderSortIcon("middleName")}
                </th>
                <th onClick={() => handleSort("yearLevel")}>
                  Year Level {renderSortIcon("yearLevel")}
                </th>
                <th>Picture</th>
                <th onClick={() => handleSort("email")}>
                  Email {renderSortIcon("email")}
                </th>
                <th onClick={() => handleSort("department")}>
                  Department {renderSortIcon("department")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedInstructors.map((Instructor) => (
                <tr key={Instructor.id}>
                  <td style={{ paddingLeft: "32px" }}>{Instructor.firstName}</td>
                  <td>{Instructor.lastName}</td>
                  <td>{Instructor.middleName}</td>
                  <td>{Instructor.yearLevel}</td>
                  <td>
                    <img
                      src={Instructor.picture}
                      alt="Instructor"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>{Instructor.email}</td>
                  <td>{Instructor.department}</td>
                  <td>
                    <Edit
                      color="success"
                      fontSize="large"
                      className="cpoint mx-2"
                      onClick={() => handleModalShow(Instructor)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table> */}
      </div>
    </Container>
  );
};

export default AdminManagementInstructor;
