import { ref, set, update, get } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { enqueueSnackbar } from 'notistack';
import { YEARS } from '../constants/year';
import { COURSE_OPTIONS } from '../constants/course';
import { getFirebaseErrorMessage } from '../utils/firebase.exceptions';
import { database, storage, superAdminAuth } from '../services/firebase';

export const StudentHandleSubmit = async (e, newStudent) => {
  const emptyFields = [];
  const defaultYearLevel = YEARS[0];
  const defaultDepartment = Object.keys(COURSE_OPTIONS)[0];
  newStudent.yearLevel =
    newStudent.yearLevel === "" || newStudent.yearLevel === undefined
      ? defaultYearLevel
      : newStudent.yearLevel;
  newStudent.department =
    newStudent.department === "" || newStudent.department === undefined
      ? defaultDepartment
      : newStudent.department;
  console.log(newStudent, defaultDepartment, defaultYearLevel);

  // Check each field and add its name to the array if it is empty
  if (!newStudent.firstName) emptyFields.push("First Name");
  if (!newStudent.lastName) emptyFields.push("Last Name");
  if (!newStudent.yearLevel) emptyFields.push("Year Level");
  if (!newStudent.email) emptyFields.push("Email");
  if (!newStudent.password) emptyFields.push("Password");
  if (!newStudent.department) emptyFields.push("Department");

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
      newStudent.email,
      newStudent.password
    );
    const user = userCredential.user;

    const userStorageRef = storageRef(
      storage,
      `Users/${user.uid}/profile.jpg`
    );
    const metadata = {
      contentType: "image/jpeg",
    };

    await uploadBytes(userStorageRef, newStudent.picture, metadata);

    const downloadURL = await getDownloadURL(userStorageRef);

    const newStudentData = {
      id: user.uid,
      ...newStudent,
      picture: downloadURL,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      acc_type: "student",
    };

    await set(ref(database, `Users/${user.uid}`), newStudentData);
    await superAdminAuth.signOut();
    enqueueSnackbar("Student account created successfully", {
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });

    return newStudentData;
    
  } catch (error) {
    handleError(error);
  }
};

export const StudenHandleUpdate = async (editStudent, handleModalClose) => {
  try {
    if (editStudent) {
      // Replace undefined properties with empty strings
      Object.keys(editStudent).forEach((key) => {
        if (!editStudent[key]) {
          editStudent[key] = "";
        }
      });

      if (editStudent.picture && editStudent.picture instanceof File) {
        const userStorageRef = storageRef(
          storage,
          `Users/${editStudent.id}/profile.jpg`
        );
        const metadata = {
          contentType: "image/jpeg",
        };
        await uploadBytes(userStorageRef, editStudent.picture, metadata);
        const downloadURL = await getDownloadURL(userStorageRef);
        editStudent.picture = downloadURL;
      }else {
        delete editStudent.picture;
      }

      const updatedStudent = {
        ...editStudent,
        updatedAt: new Date().toISOString(),
      };
      await update(ref(database, `Users/${editStudent.id}`), updatedStudent);
      enqueueSnackbar("Student account updated successfully", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      handleModalClose();
      return updatedStudent;
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
    const students = Object.values(userData).filter(
      (user) => user.acc_type === "student"
    );
    return students;
  }
};