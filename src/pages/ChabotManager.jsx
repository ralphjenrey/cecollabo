// ChatbotManager.jsx
import { useState, useEffect } from "react";
import FileTree from "../components/FileTree";
import "../styles/chatbot.css";
import { auth, database } from "../services/firebase";
import { onValue, ref, set } from "firebase/database";

const initialFileData = {
  name: "Hello! How can I help you?",
};

const ChatbotManager = () => {
  const [fileData, setFileData] = useState(initialFileData);

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const userRef = ref(database, `Users/${userId}`);

    // Fetch the user data to get the department
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.department) {
        const department = userData.department;
        const fileDataRef = ref(database, `Chatbot/${department}`);
        
        // Fetch the file data for the department
        onValue(fileDataRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setFileData(data);
          }
        });
      }
    });
  }, []);

  const handleDataChange = async (node, updatedNode) => {
    const updateNode = (data) => {
      if (data === node) {
        return updatedNode;
      }
      if (data.children) {
        const updatedChildren = data.children
          .map(updateNode)
          .filter((child) => child !== null); // Filter out deleted nodes
        return { ...data, children: updatedChildren };
      }
      return data;
    };

    const newFileData = updateNode(fileData);
    setFileData(newFileData);

    // Update Firebase
    const userId = auth.currentUser.uid;
    const userRef = ref(database, `Users/${userId}`);

    // Fetch the user data to get the department
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.department) {
        const department = userData.department;
        const fileDataRef = ref(database, "Chatbot/" + department);
        set(fileDataRef, newFileData);
      }
    });
  };

  return (
    <div className="chatbot-container">
      <h1>Chatbot Manager</h1>
      <div className="file-tree-container">
        <FileTree data={fileData} onDataChange={handleDataChange} />
      </div>
    </div>
  );
};

export default ChatbotManager;
