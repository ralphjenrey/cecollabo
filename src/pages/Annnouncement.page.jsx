import {
  AddOutlined,
  DeleteOutline,
  Edit,
  SearchOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Dropdown,
  DropdownButton,
  FormControl,
  InputGroup,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  ref,
  get,
} from "firebase/database";
import { database } from "../services/firebase";
import ReusableTable from "../components/Table.component";
const AnnouncementPage = () => {
  const [selectedAudience, setSelectedAudience] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    setLoading(true);

    // List of audiences we are interested in
    const targetAudiences = [
      "Bachelor of Elementary Education",
      "Bachelor of Secondary Education",
      "BS Business Administration",
      "BS Computer Science",
      "BS Hospitality Management",
      "BS Information Technology",
      "BS Psychology",
      "BS Tourism Management",
      "Everyone",
    ];

    const announcementsRef = ref(database, "Rooms");
    const snapshot = await get(announcementsRef);
    const announcementsData = snapshot.val();

    if (announcementsData) {
      const announcementsList = [];

      Object.keys(announcementsData).forEach((audience) => {
        if (targetAudiences.includes(audience)) {
          Object.keys(announcementsData[audience].messages || {}).forEach(
            (key) => {
              const message = announcementsData[audience].messages[key];
              if (message.type === "text") {
                announcementsList.push({
                  id: key,
                  ...message,
                  audience,
                  image: null,
                });
              }
            }
          );
        }
      });

      announcementsList.forEach((announcement) => {
        Object.keys(
          announcementsData[announcement.audience].messages || {}
        ).forEach((key) => {
          const message =
            announcementsData[announcement.audience].messages[key];
          if (
            message.type === "image" &&
            message.reference === announcement.id
          ) {
            announcement.image = message.image;
          }
        });
      });

      setAnnouncements(announcementsList);
      setFilteredAnnouncements(announcementsList);
    } else {
      setAnnouncements([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log("Fetching announcements...");
    // Fetch announcements
    fetchAnnouncements();
  }, []);

  const handleAudienceChange = (audience) => {
    const filterAnnouncements = announcements.filter((announcement) => {
      if (audience === "All") {
        return true;
      }

      return announcement.audience === audience;
    });
    setSelectedAudience(audience);
    setFilteredAnnouncements(filterAnnouncements);
  };

  const tableActions = [
    { 
      label: "Edit",
      variant: "warning",
      handler: () => {},
    },
    { 
      label: "Delete",
      variant: "danger",
      handler: () => {},
    },
  ];
  
  const tableHeaders = [
    { key: "title", value: "Title" },
    { key: "text", value: "Text" },
    { key: "createdAt", value: "Created At" },
    { key: "audience", value: "Audience" },
    { key: "image", value: "Image" },
  ];
  
  
  const excludeSortingHeaders = [{ key: "image", value: "Picture" }];

  return (
    <Container fluid className="p-4">
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
            <h5>Announcement</h5>
            <Button
              className="d-flex justify-content-center align-items-center"
              variant="primary"
              onClick={() => {}}
            >
              <AddOutlined className="me-3" />
              Add New
            </Button>
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
                <Dropdown.Item eventKey="Bachelor of Elementary Education">
                  Bachelor of Elementary Education
                </Dropdown.Item>
                <Dropdown.Item eventKey="Bachelor of Secondary Education">
                  Bachelor of Secondary Education
                </Dropdown.Item>
                <Dropdown.Item eventKey="BS Business Administration">
                  BS Business Administration
                </Dropdown.Item>
                <Dropdown.Item eventKey="BS Computer Science">
                  BS Computer Science
                </Dropdown.Item>
                <Dropdown.Item eventKey="BS Hospitality Management">
                  BS Hospitality Management
                </Dropdown.Item>
                <Dropdown.Item eventKey="BS Information Technology">
                  BS Information Technology
                </Dropdown.Item>
                <Dropdown.Item eventKey="BS Psychology">
                  BS Psychology
                </Dropdown.Item>
                <Dropdown.Item eventKey="BS Tourism Management">
                  BS Tourism Management
                </Dropdown.Item>
                <Dropdown.Item eventKey="Everyone">Everyone</Dropdown.Item>
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
                data={filteredAnnouncements.map((announcement) => ({
                  id: announcement.id,
                  title: announcement.title,
                  text: announcement.text,
                  createdAt: announcement.createdAt,
                  audience: announcement.audience,
                  image: <img src={announcement.image} width={50} height={50} alt="announcement" />,
                }))}
                actions={tableActions}
                excludeSortingHeaders={excludeSortingHeaders}
              />
          
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AnnouncementPage;
