import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

const CustomButton = ({ onClick, className, children, type, isLoading = false }) => {
  return (
    <Button
      className={className}
      onClick={onClick}
      type={type}
      style={{ position: 'relative' }}
    >
      {children}
      {isLoading && (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          style={{ position: 'absolute', right: '20px', top: '34%' }}
        ></span>
      )}
    </Button>
  );
};

CustomButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default CustomButton;
