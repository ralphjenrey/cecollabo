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
import { Col, Container, Form, Row } from "react-bootstrap";
import { enqueueSnackbar } from "notistack";
import { SUPER_ADMIN_COURSE_OPTIONS } from "../constants/course";
import EditModal from "../components/EditModal";
import "../styles/adminmanagementstudent.css";
import ReusableTable from "../components/Table.component";
import { AdminHandleUpdate, fetchUsers } from "../api/Adminmanagementadmin";

const AdminManagementAdmin = () => {

    const [editAdmin, setEditAdmin] = useState({
        id: "",
        name: "",
        email: "",
        department: "",
    });
    const [admins, setAdmins] = useState([]); // Updated state
    const [showModal, setShowModal] = useState(false);
    const [searchField, setSearchField] = useState("name");
    const [filteredAdmin, setFilteredAdmin] = useState(admins); // Updated state
    const [searchTerm, setSearchTerm] = useState("");

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
                setEditAdmin((prev) => ({ ...prev, picture: file })); // Updated state
            }
        }
    };

    const handleEditAdminChange = (e) => { // Updated function name
        const { name, value, type, files } = e.target;
        if (type === "file") {
            handleFileUpload(files[0], e, "edit");
        } else {
            setEditAdmin((prev) => ({ ...prev, [name]: value })); // Updated state
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleUpdate = async () => {
        if (!editAdmin.name || !editAdmin.email || !editAdmin.department) {
            enqueueSnackbar("Please fill all fields", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "center" },
            });
            return;
        }
        const updatedAdmin = await AdminHandleUpdate( // Updated function call
            editAdmin,
            handleModalClose
        );
        setAdmins(
            admins.map((a) => // Updated variable name
                a.id === updatedAdmin.id ? updatedAdmin : a
            )
        );
    };

    const handleModalShow = (Admin) => { // Updated parameter name
        const defaultDepartment = Object.keys(SUPER_ADMIN_COURSE_OPTIONS)[0];
        Admin.department = Admin.department ?? defaultDepartment;
        setEditAdmin({
            id: Admin.id,
            name: Admin.name,
            // picture: Admin.picture,
            email: Admin.email,
            department: Admin.department,
        });
        setShowModal(true);
    };

    const handleSearch = debounce((value) => {
        setSearchTerm(value);
    }, 300);

    const fetchUser = async () => {
        const Admins = await fetchUsers(); // Updated variable name
        setAdmins(Admins); // Updated state
    };

    const tableHeaders = [
        { key: "name", value: "Name" },
        { key: "email", value: "Email" },
        { key: "department", value: "Department" },
    ]

    // const excludeSortingHeaders = [{ key: "picture", value: "Picture" }];

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

        setFilteredAdmin( // Updated state
            admins.filter(
                (a) =>
                    a[searchField] &&
                    a[searchField].toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

    }, [searchTerm, admins]);

    const uniqueOptions = Array.from(
        new Set(admins.map((admin) => admin[searchField])) // Updated variable name
    );

    return (
        <Container className="mt-3">
            <EditModal
                show={showModal}
                handleClose={handleModalClose}
                header="Edit Admin" // Updated header
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
                                controlId="EditName" // Updated controlId
                                label="Name"
                                type="text"
                                placeholder="Admin name" // Updated placeholder
                                style={{ maxWidth: "400px" }}
                                value={editAdmin.name} // Updated state
                                onChange={handleEditAdminChange} // Updated function
                                name="name"
                            />
                        </Col>
                    </Row>
            
                    <Row>
                        {/* <Col lg={6}>
                            <CustomInput
                                controlId="EditAdminPicture" // Updated controlId
                                label="Change Picture"
                                type="file"
                                placeholder="Change Picture"
                                style={{ maxWidth: "400px" }}
                                value={editAdmin.picture} // Updated state
                                onChange={handleEditAdminChange} // Updated function
                                name="picture"
                            />
                        </Col> */}
                        {/* <Col lg={6}>
                            <Form.Select
                                value={editAdmin.department} // Updated state
                                onChange={handleEditAdminChange} // Updated function
                                className="py-3 mb-3"
                                aria-label="Default select example"
                                style={{ maxWidth: "400px" }}
                                name="department"
                            >
                                {Object.entries(SUPER_ADMIN_COURSE_OPTIONS).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col> */}
                    </Row>
                    <CustomInput
                        controlId="EditAdminEmail" // Updated controlId
                        label="Email"
                        type="email"
                        placeholder="Admin email" // Updated placeholder
                        value={editAdmin.email} // Updated state
                        style={{ maxWidth: "400px" }}
                        onChange={handleEditAdminChange} // Updated function
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
                                <MenuItem value="name">Name</MenuItem>
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
                    data={filteredAdmin.map((admin) => ({ // Updated variable name
                        id: admin.id,
                        name: admin.name,
                        email: admin.email,
                        department: admin.department,
                    }))}
                    actions={tableActions}
                    excludeSortingHeaders={[]}
                />
            </div>
        </Container>
    );
};

export default AdminManagementAdmin; // Updated export