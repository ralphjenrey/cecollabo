// FileTree.jsx
import { Add, ArrowDropDown, ArrowRight, Delete, DeleteForeverOutlined, Description } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import "../styles/chatbot.css"
import PropTypes from 'prop-types';

const FileTree = ({ data, level = 0, onDataChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description || '');

  const nameInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.style.width = `${nameInputRef.current.scrollWidth}px`;
    }
  }, [isEditingName, name]);

  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.style.width = `${descriptionInputRef.current.scrollWidth}px`;
    }
  }, [isEditingDescription, description]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameInputRef.current) {
      nameInputRef.current.style.width = `${nameInputRef.current.scrollWidth}px`;
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (descriptionInputRef.current) {
      descriptionInputRef.current.style.width = `${descriptionInputRef.current.scrollWidth}px`;
    }
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (onDataChange) {
      onDataChange(data, { ...data, name });
    }
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    if (onDataChange) {
      onDataChange(data, { ...data, description });
    }
  };

  const handleAddChild = () => {
    const newChild = { name: 'New Entry', description: '' };
    const updatedData = {
      ...data,
      children: data.children ? [...data.children, newChild] : [newChild]
    };
    if (onDataChange) {
      onDataChange(data, updatedData);
    }
    setExpanded(true); // Expand the node to show the new child
  };

  const handleAddDescription = () => {
    setIsEditingDescription(true);
  };

  const handleDeleteEntry = () => {
    if (onDataChange) {
      onDataChange(data, null);
    }
  };

  const handleDeleteDescription = () => {
    setDescription('');
    if (onDataChange) {
      onDataChange(data, { ...data, description: '' });
    }
  };

  const handleKeyDown = (e, blurHandler) => {
    if (e.key === 'Enter') {
      blurHandler();
    }
  };

  return (
    <div style={{ marginLeft: level * 20 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div onClick={handleToggle} style={{ cursor: 'pointer' }}>
          {data.children ? (expanded ? <ArrowDropDown/> : <ArrowRight />) : '📄'}
        </div>
        {isEditingName ? (
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyDown={(e) => handleKeyDown(e, handleNameBlur)}
            autoFocus
            ref={nameInputRef}
            style={{ marginLeft: 5 }}
          />
        ) : (
          <div onClick={handleNameClick} style={{ cursor: 'pointer', marginLeft: 5 }}>
            {name}
          </div>
        )}
        -
        {isEditingDescription ? (
          <input
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionBlur}
            onKeyDown={(e) => handleKeyDown(e, handleDescriptionBlur)}
            autoFocus
            ref={descriptionInputRef}
            style={{ marginLeft: 10 }}
          />
        ) : (
          <div onClick={handleDescriptionClick} style={{ cursor: 'pointer', marginLeft: 10 }}>
            {description}
          </div>
        )}
        <Tooltip title="Add Child" arrow>
        <Button className="chatbot-buttons" onClick={handleAddChild}>
          <Add />
        </Button>
        </Tooltip>
        <Tooltip title="Add Description">
        <Button className="chatbot-buttons" onClick={handleAddDescription}>
          <Description />
        </Button>
        </Tooltip>
        <Tooltip title="Delete Entry">
        <Button className="chatbot-buttons" onClick={handleDeleteEntry}>
          <Delete />
        </Button>
        </Tooltip>
        <Tooltip title="Delete Description">
        <Button className="chatbot-buttons" onClick={handleDeleteDescription}>
          <DeleteForeverOutlined />
        </Button>
        </Tooltip>
      </div>
      {expanded && data.children && (
        <div>
          {data.children.map((child, index) => (
            <FileTree key={index} data={child} level={level + 1} onDataChange={onDataChange} />
          ))}
        </div>
      )}
    </div>
  );
};

FileTree.propTypes = {
  data: PropTypes.object.isRequired,
  level: PropTypes.number,
  onDataChange: PropTypes.func
};

export default FileTree;