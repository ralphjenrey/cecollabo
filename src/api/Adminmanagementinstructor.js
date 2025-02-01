import { ref, set, update, get } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { enqueueSnackbar } from 'notistack';
import { COURSE_OPTIONS } from '../constants/course';
import { getFirebaseErrorMessage } from '../utils/firebase.exceptions';
import { auth, database, storage, superAdminAuth } from '../services/firebase';

export const InstructorHandleSubmit = async (e, newInstructor) => {
  const emptyFields = [];
  const userId = auth.currentUser.uid;
  const userRef = ref(database, `Users/${userId}`);
  const userSnapshot = await get(userRef); // Get the snapshot
  const department = userSnapshot.val()?.department; // Access the department directly
  newInstructor.department = department;
  // const defaultDepartment = Object.keys(COURSE_OPTIONS)[0];
  // newInstructor.department =
  // newInstructor.department === "" || newInstructor.department === undefined
  //     ? defaultDepartment
  //     : newInstructor.department;

  // Check each field and add its name to the array if it is empty
  if (!newInstructor.firstName) emptyFields.push("First Name");
  if (!newInstructor.lastName) emptyFields.push("Last Name");
  if (!newInstructor.email) emptyFields.push("Email");
  if (!newInstructor.password) emptyFields.push("Password");
  if (!newInstructor.department) emptyFields.push("Department");

  // If there are empty fields, display an error message
  if (emptyFields.length > 0) {
    enqueueSnackbar(
      `Please fill the following fields: ${emptyFields.join(", ")}`,
      {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      }
    );
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      superAdminAuth,
      newInstructor.email,
      newInstructor.password
    );
    const user = userCredential.user;

    const userStorageRef = storageRef(
      storage,
      `Users/${user.uid}/profile.jpg`
    );
    const metadata = {
      contentType: "image/jpeg",
    };

    await uploadBytes(userStorageRef, newInstructor.picture, metadata);

    const downloadURL = await getDownloadURL(userStorageRef);

    const newInstructorData = {
      id: user.uid,
      ...newInstructor,
      picture: downloadURL,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: "instructor",
    };

    await set(ref(database, `Users/${user.uid}`), newInstructorData);
    await superAdminAuth.signOut();
    enqueueSnackbar("Instructor account created successfully", {
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });

    return newInstructorData;
    
  } catch (error) {
    handleError(error);
  }
};

export const InstructorHandleUpdate = async (editInstructor, handleModalClose) => {
  try {
    if (editInstructor) {
      // Replace undefined properties with empty strings
      Object.keys(editInstructor).forEach((key) => {
        if (!editInstructor[key]) {
            editInstructor[key] = "";
        }
      });

      if (editInstructor.picture && editInstructor.picture instanceof File) {
        const userStorageRef = storageRef(
          storage,
          `Users/${editInstructor.id}/profile.jpg`
        );
        const metadata = {
          contentType: "image/jpeg",
        };
        await uploadBytes(userStorageRef, editInstructor.picture, metadata);
        const downloadURL = await getDownloadURL(userStorageRef);
        editInstructor.picture = downloadURL;
      }else {
        delete editInstructor.picture;
      }

      const updatedInstructor = {
        ...editInstructor,
        updatedAt: new Date().toISOString(),
      };
      await update(ref(database, `Users/${editInstructor.id}`), updatedInstructor);
      enqueueSnackbar("Instructor account updated successfully", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      handleModalClose();
      return updatedInstructor;
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
  const user = auth.currentUser;
  if (!user) {
    return null;
  } 
  const currentUserRef = ref(database, `Users/${user.uid}`);
  const currentUserSnapshot = await get(currentUserRef);
  const currentUserData = currentUserSnapshot.val();
  const department = currentUserData.department;
  
  const userRef = ref(database, "Users");
  const snapshot = await get(userRef);
  const userData = snapshot.val();
  //Filter students by department
  if (userData) {
    const students = Object.values(userData).filter(
      (u) => u.role === "instructor" && u.department === department
    );
    return students;
  }
};