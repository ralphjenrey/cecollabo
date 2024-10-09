import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

const CustomButton = ({ onClick, className, children, type }) => {
  return (
    <Button className={className} onClick={onClick} type={type}>
      {children}
    </Button>
  );
};

CustomButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};

export default CustomButton;
