import { ref, update, get } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { enqueueSnackbar } from 'notistack';
import { getFirebaseErrorMessage } from '../utils/firebase.exceptions';
import { database, storage } from '../services/firebase';


const updateEmail = async (userId, newEmail) => {
  const response = await fetch('https://fcm-cecollabo.onrender.com/change-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, newEmail })
  });
  
  if (!response.ok) {
    throw new Error('Failed to update email');
  }
  return response.json();
};

export const AdminHandleUpdate = async (editAdmin, handleModalClose) => {
  try {
    if (editAdmin) {
      // Replace undefined properties with empty strings
      Object.keys(editAdmin).forEach((key) => {
        if (!editAdmin[key]) {
          editAdmin[key] = "";
        }
      });

      if (editAdmin.picture && editAdmin.picture instanceof File) {
        const userStorageRef = storageRef(
          storage,
          `Users/${editAdmin.id}/profile.jpg`
        );
        const metadata = {
          contentType: "image/jpeg",
        };
        await uploadBytes(userStorageRef, editAdmin.picture, metadata);
        const downloadURL = await getDownloadURL(userStorageRef);
        editAdmin.picture = downloadURL;
      } else {
        delete editAdmin.picture;
      }

      // If email changed, update through API first
      const existingUserRef = ref(database, `Users/${editAdmin.id}`);
      const snapshot = await get(existingUserRef);
      const existingUser = snapshot.val();

      if (existingUser && existingUser.email !== editAdmin.email) {
        await updateEmail(editAdmin.id, editAdmin.email);
      }

      const updatedAdmin = {
        // Changed variable name
        ...editAdmin,
        updatedAt: new Date().toISOString(),
      };
      
      await update(ref(database, `Users/${editAdmin.id}`), updatedAdmin);
      enqueueSnackbar("Admin account updated successfully", {
        // Changed message
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      handleModalClose();
      return updatedAdmin;
    }
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error) => {
  if (Object.prototype.hasOwnProperty.call(error, "code")) {
    const errorMessage = getFirebaseErrorMessage(error.code);
    console.error("Error:", errorMessage);
    enqueueSnackbar(errorMessage, {
      variant: "error",
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
  } else {
    console.error("An error occurred. Please try again." + error);
    enqueueSnackbar("An error occurred. Please try again.", {
      variant: "error",
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
  }
};

export const fetchUsers = async () => {
  const userRef = ref(database, "Users");
  const snapshot = await get(userRef);
  const userData = snapshot.val();

  if (userData) {
    const admin = Object.entries(userData).map(([key, value]) => {
      return { id: key, ...value };
    }).filter((user) => user.role === "admin");
    return admin;
  }
}