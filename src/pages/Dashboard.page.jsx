import { Card, Col, Row } from "react-bootstrap";
import "../App.css";
import "../styles/dashboard.css";
import { FaPeopleArrows } from "react-icons/fa";
import { get, ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { database } from "../services/firebase";
import { useEffect, useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { Gauge } from "@mui/x-charts";

const Dashboard = () => {
  const [studentsCount, setStudentsCount] = useState(0);
  const [instructorsCount, setInstructorsCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [announcementsCount, setAnnouncementsCount] = useState(0);

  const fetchUsers = async () => {
    const userRef = ref(database, "Users");
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    if (userData) {
      const students = Object.values(userData).filter(
        (user) => user.role === "student"
      );
      const instructors = Object.values(userData).filter(
        (user) => user.role === "instructor"
      );

      setStudentsCount(students.length);
      setInstructorsCount(instructors.length);
    }
  };

  const trackOnlineUsers = () => {
    const usersRef = ref(database, "Users");

    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const onlineCount = Object.values(users).filter(user => user.status && user.status.isOnline).length;
        setOnlineUsers(onlineCount);
      } else {
        setOnlineUsers(0);
      }
    });
  };
  
  const fetchAdminRooms = async () => {
    const roomsQuery = query(ref(database, "Rooms"), orderByChild("role"), equalTo("admin"));
    const snapshot = await get(roomsQuery);
    const roomsData = snapshot.val();
  
    if (roomsData) {
      let totalMessages = 0;
      Object.values(roomsData).forEach(room => {
        if (room.messages) {
          totalMessages += Object.values(room.messages).filter(message => message.show === true).length;
        }
      });
      setAnnouncementsCount(totalMessages);
    } else {
      setAnnouncementsCount(0);
    }
  };

  useEffect(() => {
    fetchUsers();
    trackOnlineUsers();
    fetchAdminRooms();
  }, []);

  const xLabels = ['Users Count'];

  return (
    <div className="generalcontainer">
      <Row>
        <Col lg={2}>
          <Card className="card" id="cardstudent">
            <Card.Body className="dashboardcard">
              <div>
                <Card.Title className="cardtitle">{studentsCount}</Card.Title>
                <Card.Text className="cardtext">Student</Card.Text>
              </div>
              <Card.Text>
                <FaPeopleArrows className="dashboardcardicon"></FaPeopleArrows>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2}>
          <Card className="card" id="cardinstructor">
            <Card.Body className="dashboardcard">
              <div>
                <Card.Title className="cardtitle">
                  {instructorsCount}
                </Card.Title>
                <Card.Text className="cardtext">Instructor</Card.Text>
              </div>
              <Card.Text>
                <FaPeopleArrows className="dashboardcardicon"></FaPeopleArrows>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2}>
          <Card className="card" id="cardonlineusers">
            <Card.Body className="dashboardcard">
              <div>
                <Card.Title className="cardtitle">{onlineUsers}</Card.Title>
                <Card.Text className="cardtext">Online Users</Card.Text>
              </div>
              <Card.Text>
                <FaPeopleArrows className="dashboardcardicon"></FaPeopleArrows>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col lg={6}>
          <BarChart
            width={800}
            height={500}
            series={[
              { data: [studentsCount], label: 'Students', id: 'studentsId', color: '#3f51b5' },
              { data: [instructorsCount], label: 'Instructors', id: 'instructorsId', color: '#f50057' },
              { data: [onlineUsers], label: 'Online Users', id: 'onlineUsersId', color: '#4caf50' },
            ]}
            xAxis={[{ data: xLabels, scaleType: 'band' }]}
          />
        </Col>

        <Col lg={6} className="d-flex flex-column align-items-center">
            <h2>Active Announcements</h2>
          <Gauge width={200} height={200} value={announcementsCount} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;