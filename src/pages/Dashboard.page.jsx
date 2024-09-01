import { Card, Col, Row } from "react-bootstrap";
import "../App.css";
import "../styles/dashboard.css";
import { FaPeopleArrows } from "react-icons/fa";
const Dashboard = () => {
  return <div className="generalcontainer">
    <Row>
        <Col>
        <Card className="card" id="cardstudent">
        <Card.Body className="dashboardcard">
            <div>
            <Card.Title className="cardtitle">320</Card.Title>
            <Card.Text className="cardtext">
                Student
            </Card.Text>
            </div>
           
            <Card.Text><FaPeopleArrows className="dashboardcardicon"></FaPeopleArrows></Card.Text>
        </Card.Body>
    </Card>
        </Col>
        <Col>
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
