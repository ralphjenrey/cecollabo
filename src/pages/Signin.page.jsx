import { Container, Row, Col, Card, Image, Form, Button } from "react-bootstrap";
import "../styles/signin.css";

const SigninPage = () => {
    return (
        <Container fluid className="signincontainer">
            <Row className="gap-5">
                <Col lg={7}>
                    <Card className="signincard">
                        <Image className="signinbannerimage mb-3" src="https://images.pexels.com/photos/2675061/pexels-photo-2675061.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="signinbanner" />
                        <h2>Your one stop</h2>
                        <h1>Announcements</h1>
                    </Card>
                </Col>
                <Col className="signinformcol">
                        <h1>LOGO</h1>
                        <br></br>
                        <h4 className="mb-5">Sign in to your account</h4>
                        <br />
                        <Form>
                        <Form.Group controlId="formBasicEmail" className="mb-3">
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" className="mb-5">
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>

                            <Button className="w-100 mb-4" type="submit">
                                LOG IN
                            </Button>

                            <Button className="forgotpassbtn">Forgot password</Button>
                        </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default SigninPage;