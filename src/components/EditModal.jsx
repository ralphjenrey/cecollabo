import PropTypes from 'prop-types'; // Import PropTypes
import { Modal, Button } from 'react-bootstrap';

const EditModal = ({ show, handleClose, children, header, footer }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {footer}
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Define prop types for validation
EditModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

export default EditModal;