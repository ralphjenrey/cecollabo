import { Container, Button } from 'react-bootstrap';
import '../styles/download.css';

const Download = () => {
  return (
    <div className="download-container">
      <img src="https://firebasestorage.googleapis.com/v0/b/cecollabo-b85cd.appspot.com/o/image__3_-removebg-preview.png?alt=media&token=5f72a1c7-43e3-4875-9a7a-17709778db82" alt="Logo" className="signinlogo" width={200} />
      
      <Container className="text-center">
        <h1 className="mb-4">Download CECollabo</h1>
        <p className="mb-5">
          Experience seamless communication with Cecollabo. 
          Download now to connect with your academic community.
        </p>

        <div className="download-section mb-5">
          <Button 
            variant="light" 
            size="lg"
            className="download-button"
            href="https://firebasestorage.googleapis.com/v0/b/cecollabo-b85cd.appspot.com/o/Cecollabo.apk?alt=media&token=9189ba64-3b58-4545-a829-14021c587e12"
            download
          >
            <i className="fas fa-download me-2"></i>
            Download Apk Now
          </Button>
          
          <div className="mt-3 text-light">
            <small>Version 0.1.0</small>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Download;