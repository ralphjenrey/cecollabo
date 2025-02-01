import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.FIREBASE_DATABASE_URL,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_APP_ID
};

console.log(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const superAdminApp = initializeApp(firebaseConfig, "superAdmin");
const superAdminAuth = getAuth(superAdminApp);
const database = getDatabase(app);
const storage = getStorage(app);


export { auth, database, storage, superAdminAuth };


