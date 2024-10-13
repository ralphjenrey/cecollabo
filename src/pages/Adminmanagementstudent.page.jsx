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
import { useEffect, useState } from "react";
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
  });
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchField, setSearchField] = useState("firstName");
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [searchTerm, setSearchTerm] = useState("");

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
    const result = await StudentHandleSubmit(e, newStudent);

    setStudents((prev) => [...prev, result]);
    setNewStudent({
      firstName: "",
      lastName: "",
      middleName: "",
      yearLevel: "",
      picture: "",
      email: "",
      password: "",
      department: "",
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleUpdate = async () => {
    const updatedStudent = await StudenHandleUpdate(
      editStudent,
      handleModalClose
    );
    setStudents(
      students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
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
      students.filter((student) =>
        student[searchField].toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, students]);

  const uniqueOptions = Array.from(
    new Set(students.map((student) => student[searchField]))
  );

  return (
    <Container className="mt-3">
      <Accordion defaultActiveKey="0" style={{ width: "100%" }}>
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
                  <Col lg={6}>
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
                  </Col>
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
            <Col lg={6}>
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
            </Col>
          </Row>
          <CustomInput
            controlId="studentEmail"
            label="Email"
            type="email"
            placeholder="Student email"
            value={editStudent.email}
            style={{ maxWidth: "400px" }}
            onChange={handleEditStudentChange}
            name={"email"}
          />
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
          data={filteredStudents
            .map((student) => ({
              id: student.id,
              firstName: student.firstName,
              lastName: student.lastName,
              middleName: student.middleName,
              yearLevel: student.yearLevel,
              picture: <img src={student.picture} width={50} height={50} alt="Student" />,
              email: student.email,
              department: student.department,
            }))
          }
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
            {sortedStudents.map((student) => (
              <tr key={student.id}>
                <td style={{ paddingLeft: "32px" }}>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.middleName}</td>
                <td>{student.yearLevel}</td>
                <td>
                  <img
                    src={student.picture}
                    alt="Student"
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>{student.email}</td>
                <td>{student.department}</td>
                <td>
                  <Edit
                    color="success"
                    fontSize="large"
                    className="cpoint mx-2"
                    onClick={() => handleModalShow(student)}
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

export default AdminManagementStudent;
