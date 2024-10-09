import { Card, Col, Row } from "react-bootstrap";
import "../App.css";
import "../styles/dashboard.css";
import { FaPeopleArrows } from "react-icons/fa";
import { get, ref } from "firebase/database";
import { database } from "../services/firebase";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const [studentsCount, setStudentsCount] = useState(0);
    const [instructorsCount, setInstructorsCount] = useState(0);

    const fetchUsers = async () => {
        const userRef = ref(database, "Users");
        const snapshot = await get(userRef);
        const userData = snapshot.val();

        if (userData) {
            const students = Object.values(userData).filter((user) => user.acc_type === "student");
            const instructors = Object.values(userData).filter((user) => user.acc_type === "instructor");

            setStudentsCount(students.length);
            setInstructorsCount(instructors.length);
        }

    };

    useEffect(() => {
        fetchUsers();
    }, []);
  return <div className="generalcontainer">
    <Row>
        <Col lg={2}>
        <Card className="card" id="cardstudent">
        <Card.Body className="dashboardcard">
            <div>
            <Card.Title className="cardtitle">{studentsCount}</Card.Title>
            <Card.Text className="cardtext">
                Student
            </Card.Text>
            </div>
           
            <Card.Text><FaPeopleArrows className="dashboardcardicon"></FaPeopleArrows></Card.Text>
        </Card.Body>
    </Card>
        </Col >
        <Col lg={2}>
        <Card className="card" id="cardinstructor">
        <Card.Body className="dashboardcard">
        <div>
            <Card.Title className="cardtitle">320</Card.Title>
            <Card.Text className="cardtext">
                Instructor
            </Card.Text>
            </div>
            <Card.Text><FaPeopleArrows className="dashboardcardicon"></FaPeopleArrows></Card.Text>
        </Card.Body>
    </Card>
        </Col>
        
    </Row>
   
  </div>;
};

export default Dashboard;
