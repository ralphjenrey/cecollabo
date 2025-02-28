import { Container, Button } from "react-bootstrap";
import "../styles/download.css";
import googlePlayLogo from "/googleplay.svg";

const Download = () => {
  return (
    <div className="download-container">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/cecollabo-b85cd.appspot.com/o/image__3_-removebg-preview.png?alt=media&token=5f72a1c7-43e3-4875-9a7a-17709778db82"
        alt="Logo"
        className="signinlogo"
        width={200}
      />

      <Container className="text-center">
        <h1 className="mb-4">Download CECollabo</h1>
        <p className="mb-5">
          Experience seamless communication with Cecollabo. Download now to
          connect with your academic community.
        </p>

        <div className="download-section mb-5 gap-2">
          <Button
            variant="light"
            className="download-button mr-2"
            href="https://firebasestorage.googleapis.com/v0/b/cecollabo-b85cd.appspot.com/o/Cecollabo.apk?alt=media&token=388ab9ac-f5c7-4d39-931f-bfd7d1528885"
            download
          >
            <i className="fas fa-download me-2"></i>
            Download Apk Now
          </Button>
          <img
            src={googlePlayLogo}
            alt="Google Play"
            className="playstore"
            onClick={() =>
              (window.location.href =
                "https://play.google.com/store/apps/details?id=com.kushirawa.cecollabo")
            }
          />

       
        </div>
        <div className="mt-3 text-light">
            <small>Version 0.1.0</small>
          </div>
      </Container>
    </div>
  );
};

export default Download;
