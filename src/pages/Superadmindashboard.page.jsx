import { Card, Col, Row } from "react-bootstrap";
import "../App.css";
import "../styles/dashboard.css";
import { FaPeopleArrows } from "react-icons/fa";
import { Outlet } from "react-router-dom";

const SuperAdminDashboardPage = () => {


  return <div className="generalcontainer">
    <Row>
        <Col lg={2}>
        <Card className="card" id="cardstudent">
        <Card.Body className="dashboardcard">
            <div>
            <Card.Title className="cardtitle">320</Card.Title>
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
