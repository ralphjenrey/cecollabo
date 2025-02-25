import { SearchOutlined } from "@mui/icons-material";
import { useEffect, useReducer, useState } from "react";
import {
  Accordion,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { ref, get, update, push, remove } from "firebase/database";
import { auth, database, storage } from "../services/firebase";
import ReusableTable from "../components/Table.component";
import { COURSE_OPTIONS } from "../constants/course";
import CustomCard from "../components/CustomCard";
import CustomInput from "../components/CustomInput.component";
import { Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { DatePicker } from "@mui/x-date-pickers";
import EditModal from "../components/EditModal";
import dayjs from "dayjs";
import { sendMessages } from "../api/SendNotifAnnouncement";
import { initialState, loadingReducer } from "../store/loadingReducer";

const AnnouncementPage = () => {
  const [selectedAudience, setSelectedAudience] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [announcement, setAnnouncement] = useState({
    title: "",
    text: "",
    department: "EVERYONE",
    show: true,
    image: null,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  });
  const [editAnnouncement, setEditAnnouncement] = useState({});
  const [departments, setDepartments] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingStates, dispatch] = useReducer(loadingReducer, initialState);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const user = auth.currentUser;
    const userID = user.uid;
    const userRef = ref(database, `Users/${userID}`);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();

    if (!userData) {
      setLoading(false);
      return;
    }

    const currentDepartment = userData.department;
    const departments = ["EVERYONE"];

    if (currentDepartment) {
      departments.push(currentDepartment);
    }

    setDepartments(departments);

    for (const department of departments) {
      const announcementsRef = ref(
        database,
        "Rooms/" + department + "/messages"
      );
      const announcementsSnapshot = await get(announcementsRef);
      const departmentAnnouncements = announcementsSnapshot.val();

      if (!departmentAnnouncements) {
        continue;
      }

      const departmentAnnouncementsArray = Object.entries(
        departmentAnnouncements
      ).map(([key, value]) => ({
        id: key,
        ...value,
      }));

      setAnnouncements((prevState) => {
        const existingIds = new Set(
          prevState.map((announcement) => announcement.id)
        );
        const newAnnouncements = departmentAnnouncementsArray.filter(
          (announcement) => !existingIds.has(announcement.id)
        );
        return [...prevState, ...newAnnouncements];
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("Fetching announcements...");
    // Fetch announcements
    fetchAnnouncements();
  }, []);

  const handleSubmitAnnouncement = async (e) => {
    e.preventDefault();



    if (!validateAnnouncement(announcement)) {
      return;
    }

    const { image, ...announcementData } = announcement;
    const department = announcementData.department;
    // Check if department is provided
    if (!department) {
      console.error("Department is required");
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: { id: "submitAnnouncement" } });
      const roomRef = ref(database, `Rooms/${department}`);

      update(roomRef, {
        id: department,
        role: "admin",
        type: "group",
        name: COURSE_OPTIONS[department],
      });

      // Generate a Firebase key for the announcement
      const announcementRef = push(
        ref(database, `Rooms/${department}/messages`)
      );

      const firebaseKey = announcementRef.key;

      // Upload the image to Firebase Storage
      const announcementStorageRef = storageRef(
        storage,
        `Announcements/${department}/${firebaseKey}`
      );
      const metadata = {
        contentType: "image/jpeg",
      };

      await uploadBytes(announcementStorageRef, image, metadata);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(announcementStorageRef);

      // Include the download URL in the announcement data
      announcementData.imageURL = downloadURL;
      announcementData.createdAt = Date.now();
      announcementData.type = "custom";
      // Add announcement to the database
      await update(announcementRef, announcementData);

      // Notify user of success
      enqueueSnackbar("Announcement added successfully", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      dispatch({
        type: "UNSET_LOADING",
        payload: { id: "submitAnnouncement" },
      });

      await sendMessages(
        department,
        announcementData.title,
        announcementData.text
      );
      console.log("Announcement added successfully");
      console.log("Announcement data: ", announcementData);
      setAnnouncements((prevState) => [
        ...prevState,
        { id: firebaseKey, ...announcementData },
      ]);
    } catch (error) {
      // Notify user of error
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      console.error("Error adding announcement: ", error);
    } finally {
      dispatch({
        type: "UNSET_LOADING",
        payload: { id: "submitAnnouncement" },
      });
    }
  };

  const validateAnnouncement = (announcement) => {
    console.log("Announcement data: ", announcement);
    if (!announcement) {
      enqueueSnackbar("Announcement data is missing", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return false;
    }

    if (!announcement.title || !announcement.text) {
      enqueueSnackbar("Please fill in the title and description fields", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return false;
    }

    if (!announcement.startDate && !announcement.endDate) {
      enqueueSnackbar("Please fill in the start and end dates", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return false;
    }

    if (announcement.startDate >= announcement.endDate) {
      enqueueSnackbar("Start date must be before end date", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return false;
    }


    if (announcement.startDate < new Date().toLocaleDateString()) {
      enqueueSnackbar("Start date must be in the future", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return false;
    }

    if (announcement.startDate >= announcement.endDate) {
      enqueueSnackbar("End date must be after start date", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return false;
    }
  

    return true;
  };

  const handleAnnouncementChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      const file = e.target.files[0];
      setAnnouncement((prevState) => ({
        ...prevState,
        image: file,
      }));
    } else {
      setAnnouncement((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleEditAnnouncementChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      const file = e.target.files[0];
      setEditAnnouncement((prevState) => ({
        ...prevState,
        image: file,
      }));
    } else {
      setEditAnnouncement((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAudienceChange = (department) => {
    const filterAnnouncements = announcements.filter((announcement) => {
      if (department === "All") {
        return true;
      }

      return announcement.department === department;
    });
    setSelectedAudience(department);
    setFilteredAnnouncements(filterAnnouncements);
  };

  const handleDeleteAnnouncement = async (row) => {
    try {
      // alert user to confirm deletion
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this announcement?"
      );
      if (confirmDelete) {
        const { id, department } = row;
        const departmentKey = Object.keys(COURSE_OPTIONS).find(
          (key) => COURSE_OPTIONS[key] === department
        );
        console.log(`Rooms/${departmentKey}/${id}`);
        const announcementRef = ref(
          database,
          `Rooms/${departmentKey}/messages/${id}`
        );
        await remove(announcementRef);
        setAnnouncements((prevState) =>
          prevState.filter((announcement) => announcement.id !== id)
        );

        enqueueSnackbar("Announcement deleted successfully", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      console.error("Error deleting announcement: ", error);
    }
  };

  const handleEditAnnouncement = async (e) => {
        //Convert date to ISO string
        editAnnouncement.startDate = new Date(editAnnouncement.startDate).toLocaleDateString();
        editAnnouncement.endDate = new Date(editAnnouncement.endDate).toLocaleDateString();

    if (!validateAnnouncement(editAnnouncement)) {
      return;
    }
    try {
      e.preventDefault();
      dispatch({ type: "SET_LOADING", payload: { id: "editAnnouncement" } });

      const { id, image, ...announcementData } = editAnnouncement;
      const departmentKey = Object.keys(COURSE_OPTIONS).find(
        (key) => COURSE_OPTIONS[key] === announcementData.department
      );
      announcementData.startDate = new Date(
        announcementData.startDate
      ).toISOString();
      announcementData.endDate = new Date(
        announcementData.endDate
      ).toISOString();
      announcementData.department = departmentKey;
      const announcementRef = ref(
        database,
        `Rooms/${departmentKey}/messages/${id}`
      );

      // Check if a new image is provided
      if (image) {
        const announcementStorageRef = storageRef(
          storage,
          `Announcements/${departmentKey}/${id}`
        );
        const metadata = {
          contentType: "image/jpeg",
        };

        // Upload the new image
        await uploadBytes(announcementStorageRef, image, metadata);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(announcementStorageRef);
        announcementData.imageURL = downloadURL;
      } else {
        // remove the imageURL property if no new image is provided
        delete announcementData.imageURL;
      }

      // Update the announcement in the database
      await update(announcementRef, announcementData);
      enqueueSnackbar("Announcement updated successfully", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      setAnnouncements((prevState) =>
        prevState.map((item) =>
          item.id === id ? { ...item, ...announcementData } : item
        )
      );
      setShowModal(false);
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      console.error("Error updating announcement: ", error);
    } finally {
      dispatch({ type: "UNSET_LOADING", payload: { id: "editAnnouncement" } });
    }
  };

  const tableActions = [
    {
      label: "Edit",
      variant: "warning",
      handler: (row) => {
        setEditAnnouncement({
          id: row.id,
          title: row.title,
          text: row.text,
          department: row.department,
          startDate: row.startDate,
          endDate: row.endDate,
          imageURL: row.imageURL,
          show: row.show,
        });
        setShowModal(true);
      },
    },
    {
      label: "Delete",
      variant: "danger",
      handler: (row) => {
        handleDeleteAnnouncement(row);
      },
    },
  ];

  const tableHeaders = [
    { key: "title", value: "Title" },
    { key: "text", value: "Text" },
    { key: "startDate", value: "Start Date" },
    { key: "endDate", value: "End Date" },
    { key: "department", value: "Department" },
    { key: "imageURL", value: "Image" },
    { key: "show", value: "Status" },
  ];

  const excludeSortingHeaders = [{ key: "imageURL", value: "Image" }];

  useEffect(() => {
  
      setFilteredAnnouncements(
        announcements.filter((announcement) =>
          announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      console.log("filteredAnnouncements", filteredAnnouncements);
  }, [searchQuery]);

  return (
    <Container fluid className="p-4">
      <Accordion
        className="mb-3"
        defaultActiveKey="1"
        style={{ width: "100%" }}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>Add New Announcement</Accordion.Header>
          <Accordion.Body>
            <CustomCard
              style={{ width: "100%" }}
              header={<h3>Add New Announcement</h3>}
            >
              <Form onSubmit={handleSubmitAnnouncement}>
                <Row>
                  <Col lg={6}>
                    <CustomInput
                      controlId="AnnouncementTitle"
                      label="Title"
                      type="text"
                      placeholder="Announcement Title"
                      style={{ maxWidth: "400px" }}
                      value={announcement.title}
                      onChange={handleAnnouncementChange}
                      name="title"
                    />
                  </Col>

                  <Col lg={6}>
                    <CustomInput
                      controlId="AnnouncementText"
                      label="Description"
                      type="text"
                      placeholder="Announcement description"
                      style={{ maxWidth: "400px" }}
                      value={announcement.text}
                      onChange={handleAnnouncementChange}
                      name="text"
                    />
                  </Col>

                  <Col lg={6}>
                    <Form.Select
                      value={announcement.department}
                      onChange={handleAnnouncementChange}
                      className="py-3 mb-3"
                      aria-label="Announcement Department"
                      style={{ maxWidth: "400px" }}
                      name="department"
                    >
                      {departments.map((department) => (
                        <option key={department} value={department}>
                          {COURSE_OPTIONS[department]}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col lg={6}>
                    <CustomInput
                      controlId="AnnouncementImage"
                      label="Image"
                      type="file"
                      style={{ maxWidth: "400px" }}
                      onChange={handleAnnouncementChange}
                      name="image"
                    />
                  </Col>

                  <Form.Group as={Col} lg={4} className="mb-3">
                    <Form.Label htmlFor="startDate" className="d-block">
                      Start Date
                    </Form.Label>
                    <DatePicker
                      name="startDate"
                      onChange={(newValue) =>
                        handleAnnouncementChange({
                          target: {
                            name: "startDate",
                            value: newValue.toISOString(),
                          },
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} lg={4} className="mb-3">
                    <Form.Label htmlFor="endDate" className="d-block">
                      End Date
                    </Form.Label>
                    <DatePicker
                      name="endDate"
                      onChange={(newValue) =>
                        handleAnnouncementChange({
                          target: {
                            name: "endDate",
                            value: newValue.toISOString(),
                          },
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} lg={4} className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="show"
                      label="Show"
                      name="show"
                      defaultChecked={true}
                      onChange={(e) =>
                        handleAnnouncementChange({
                          target: {
                            name: "show",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                  </Form.Group>
                </Row>

                <Button
                  loading={loadingStates.submitAnnouncement}
                  loadingPosition="end"
                  type="submit"
                  variant="contained"
                  color="success"
                >
                  Add Announcement
                </Button>
              </Form>
            </CustomCard>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
            <h5>Announcement</h5>
          </div>
          <div className="mt-3">
            <InputGroup className="mb-3">
              <DropdownButton
                as={InputGroup.Prepend}
                variant="outline-secondary"
                title={selectedAudience}
                id="input-group-dropdown-1"
                onSelect={handleAudienceChange}
              >
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                {departments.map((department) => (
                  <Dropdown.Item key={department} eventKey={department}>
                    {COURSE_OPTIONS[department]}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              <InputGroup.Text>
                <SearchOutlined />
              </InputGroup.Text>
              <FormControl
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </div>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <ReusableTable
                headers={tableHeaders}
                data={announcements
                  .filter(announcement => 
                    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    (selectedAudience === "All" || announcement.department === selectedAudience)
                  )
                  .map((announcement) => ({
                    id: announcement.id,
                    title: announcement.title,
                    text: announcement.text,
                    startDate: new Date(announcement.startDate).toLocaleDateString(),
                    endDate: new Date(announcement.endDate).toLocaleDateString(),
                    department: COURSE_OPTIONS[announcement.department],
                    imageURL: (
                      <img
                        src={announcement.imageURL}
                        width={50}
                        height={50}
                        alt="announcement"
                      />
                    ),
                    show: announcement.show,
                  }))}
                actions={tableActions}
                excludeSortingHeaders={excludeSortingHeaders}
              />
            </div>
          )}
        </Card.Body>
      </Card>

      <EditModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        header="Edit Announcement"
        footer={
          <Button
            loading={loadingStates.editAnnouncement}
            loadingPosition="end"
            type="submit"
            variant="contained"
            color="success"
            onClick={handleEditAnnouncement}
          >
            Save changes
          </Button>
        }
      >
        <Form>
          <Row>
            <Col lg={10}>
              <CustomInput
                controlId="AnnouncementEditTitle"
                label="Title"
                type="text"
                placeholder="Title"
                style={{ maxWidth: "400px" }}
                value={editAnnouncement.title}
                onChange={handleEditAnnouncementChange}
                name="title"
              />
            </Col>

            <Form.Group as={Col} lg={2} className="mb-3 align-content-center">
              <Form.Check
                type="checkbox"
                id="show"
                label="Show"
                name="show"
                checked={editAnnouncement.show}
                onChange={(e) =>
                  handleEditAnnouncementChange({
                    target: {
                      name: "show",
                      value: e.target.checked,
                    },
                  })
                }
              />
            </Form.Group>

            <Col lg={12} className="mb-3">
              <Form.Group controlId="AnnouncementEditText">
                <Form.Label>Your Message</Form.Label>
                <Form.Control
                  as="textarea"
                  value={editAnnouncement.text}
                  onChange={handleEditAnnouncementChange}
                  name="text"
                  rows={3}
                  placeholder="Type your message here..."
                />
              </Form.Group>
            </Col>

            {/* <Col lg={6}>
              <Form.Select
                onChange={handleEditAnnouncementChange}
                className="py-3 mb-3"
                aria-label="Announcement Department"
                style={{ maxWidth: "400px" }}
                name="department"
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {COURSE_OPTIONS[department]}
                  </option>
                ))}
              </Form.Select>
            </Col> */}

            <Col lg={12}>
              <CustomInput
                controlId="AnnouncementEditImage"
                label="Image2"
                type="file"
                value={editAnnouncement.imageURL}
                style={{ maxWidth: "400px" }}
                onChange={handleEditAnnouncementChange}
                name="image"
              />
            </Col>

            <Col lg={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="startDate">Start Date</Form.Label>
                <DatePicker
                  name="startDate"
                  value={dayjs(editAnnouncement.startDate)}
                  onChange={(newValue) =>
                    handleEditAnnouncementChange({
                      target: {
                        name: "startDate",
                        value: newValue.toISOString(),
                      },
                    })
                  }
                />
              </Form.Group>
            </Col>

            <Col lg={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="endDate">End Date</Form.Label>
                <DatePicker
                  name="endDate"
                  value={dayjs(editAnnouncement.endDate)}
                  onChange={(newValue) =>
                    handleEditAnnouncementChange({
                      target: {
                        name: "endDate",
                        value: newValue.toISOString(),
                      },
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </EditModal>
    </Container>
  );
};

export default AnnouncementPage;
