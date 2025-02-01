import { Card, Col, Row } from "react-bootstrap";
import "../App.css";
import "../styles/dashboard.css";
import { FaPeopleArrows } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";

const SuperAdminDashboardPage = () => {
  const [adminCount, setAdminCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = ref(database, "Users");
      const userQuery = query(userRef, orderByChild("role"), equalTo("admin"));
      const userSnapshot = await get(userQuery);
      const userData = userSnapshot.val();
      setAdminCount(Object.keys(userData).length);
    };
  
      fetchUserData();
  }, []);

  return <div className="generalcontainer">
    <Row>
        <Col lg={2}>
        <Card className="card" id="cardstudent">
        <Card.Body className="dashboardcard">
            <div>
            <Card.Title className="cardtitle">{adminCount}</Card.Title>
            <Card.Text className="cardtext">
                Admin
            </Card.Text>
            </div>
           
            <Card.Text><FaPeopleArrows className="dashboardcardicon"></FaPeopleArrows></Card.Text>
        </Card.Body>
    </Card>
    </Col >
    </Row>
   
   <Outlet />
  </div>;
};

export default SuperAdminDashboardPage;
