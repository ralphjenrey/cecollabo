import { useState } from "react";
import { Form, FloatingLabel } from "react-bootstrap"; // Import FloatingLabel
import PropTypes from "prop-types"; // Import PropTypes

const CustomInput = ({
  label,
  className,
  type,
  placeholder,
  value,
  onChange,
  children,
  style,
  name
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form.Group className="mb-3" style={{ ...style, position: "relative" }}>
      {type === "file" ? (
        <div className="input-group custom-file-button">
          <label className="input-group-text" htmlFor={label}>
            Choose image
          </label>
          <input
            type="file"
            className="form-control"
            id={label}
            onChange={onChange}
            name={name}
          />
        </div>
      ) : (
        <FloatingLabel controlId="floatingInput" label={placeholder}>
          <Form.Control
            type={type === "password" && showPassword ? "text" : type}
            className={className}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
          />
        </FloatingLabel>
      )}
      {type === "password" && (
        <i
          className={`fas ${
            showPassword ? "fa-eye-slash" : "fa-eye"
          } password-toggle-icon`}
          onClick={togglePasswordVisibility}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        ></i>
      )}
      {children} {/* Render any additional HTML elements or components */}
    </Form.Group>
  );
};

// Define propTypes outside the component function
CustomInput.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onFileChange: PropTypes.func, // Define the onFileChange prop type
  children: PropTypes.node, // Define the children prop type
  style: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
};

export default CustomInput;
