import { ref, update, get } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { enqueueSnackbar } from 'notistack';
import { getFirebaseErrorMessage } from '../utils/firebase.exceptions';
import { database, storage } from '../services/firebase';

export const AdminHandleUpdate = async (editAdmin, handleModalClose) => { // Changed function name
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

      const updatedAdmin = { // Changed variable name
        ...editAdmin,
        updatedAt: new Date().toISOString(),
      };
      await update(ref(database, `Users/${editAdmin.id}`), updatedAdmin);
      enqueueSnackbar("Admin account updated successfully", { // Changed message
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