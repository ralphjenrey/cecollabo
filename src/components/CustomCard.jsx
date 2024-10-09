import PropTypes from "prop-types";
import { Card } from "react-bootstrap";

const CustomCard = ({ header, children, footer, style }) => {
  return (
    <Card className="p-4" style={style}>
      {header && <Card.Header>{header}</Card.Header>}
      <Card.Body>{children}</Card.Body>
      {footer && <Card.Footer>{footer}</Card.Footer>}
    </Card>
  );
};

CustomCard.propTypes = {
  header: PropTypes.node,
  body: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  style: PropTypes.object,
};

export default CustomCard;
