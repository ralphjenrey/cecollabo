import { ref, set, update, get, remove } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { enqueueSnackbar } from "notistack";
import { YEARS } from "../constants/year";
import { COURSE_OPTIONS } from "../constants/course";
import { getFirebaseErrorMessage } from "../utils/firebase.exceptions";
import { auth, database, storage, superAdminAuth } from "../services/firebase";

export const StudentHandleSubmit = async (e, newStudent) => {
  const emptyFields = [];
  const userId = auth.currentUser.uid;
  const userRef = ref(database, `Users/${userId}`);
  const department = (await get(userRef)).child("department").val();
  newStudent.department = department;
  const defaultYearLevel = YEARS[0];
  // const defaultDepartment = Object.keys(COURSE_OPTIONS)[0];
  newStudent.yearLevel =
    newStudent.yearLevel === "" || newStudent.yearLevel === undefined
      ? defaultYearLevel
      : newStudent.yearLevel;
  // newStudent.department =
  //   newStudent.department === "" || newStudent.department === undefined
  //     ? defaultDepartment
  //     : newStudent.department;
  // console.log(newStudent, defaultDepartment, defaultYearLevel);

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

    const userStorageRef = storageRef(storage, `Users/${user.uid}/profile.jpg`);
    const metadata = {
      contentType: "image/jpeg",
    };

    await uploadBytes(userStorageRef, newStudent.picture, metadata);

    const downloadURL = await getDownloadURL(userStorageRef);
    const { firstName, lastName } = newStudent;

    //remove any double spaces
    const newFirstName = firstName.trim().replace(/\s+/g, " ");
    const newLastName = lastName.trim().replace(/\s+/g, " ");

    newStudent.firstName = newFirstName;
    newStudent.lastName = newLastName;

    const newStudentData = {
      id: user.uid,
      ...newStudent,
      picture: downloadURL,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: "student",
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
      } else {
        delete editStudent.picture;
      }

      const user = auth.currentUser;
      const currentEmail = user.email;
      const { firstName, lastName, email } = editStudent;
      //remove any double spaces
      const newFirstName = firstName.trim().replace(/\s+/g, " ");
      const newLastName = lastName.trim().replace(/\s+/g, " ");
      
      editStudent.firstName = newFirstName;
      editStudent.lastName = newLastName;


    //   if (currentEmail !== email && editStudent.id) {
    //     const snapshot = await get(ref(database, `Users/${editStudent.id}`));
    //     const userData = snapshot.val();
    //     if (userData) {
    //         const newUser = await createUserWithEmailAndPassword(auth, email, "123456");
    //         userData.email = email; // Update the email in the userData object
    //         await set(ref(database, `Users/${newUser.user.uid}`), userData);
    //         await remove(ref(database, `Users/${editStudent.id}`)); // Delete the old data
    //         enqueueSnackbar("Student account updated successfully", {
    //             variant: "success",
    //             anchorOrigin: { vertical: "top", horizontal: "center" },
    //         });
    //         handleModalClose();
    //         return updatedStudent;
    //     } else {
    //         console.error("User data is undefined or null");
    //     }
    // }

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
      (user) => user.role === "student" && user.department === department
    );
    return students;
  }
};
