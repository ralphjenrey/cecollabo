import { sendPasswordResetEmail } from 'firebase/auth';
import { enqueueSnackbar } from 'notistack';
import { getFirebaseErrorMessage } from '../utils/firebase.exceptions';
import { auth } from '../services/firebase';

export const resetPassword = async (email) => {
    
    if (!email) {
        enqueueSnackbar("Please enter your email address", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
          return;
      }
  
      if (email && !email.includes("@")) {
          enqueueSnackbar("Please enter a valid email address", {
              variant: "error",
              anchorOrigin: { vertical: "top", horizontal: "center" },
          });
              return;
          }
  
    try {
        if (email) {
            await sendPasswordResetEmail(auth, email);
            enqueueSnackbar("Password reset email sent successfully", {
                variant: "success",
                anchorOrigin: { vertical: "top", horizontal: "center" },
            });
        }
    } catch (error) {
        const errorMessage = getFirebaseErrorMessage(error.code);
        enqueueSnackbar(errorMessage, {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "center" },
        });
        console.error("Error sending password reset email: ", error);
    }
};