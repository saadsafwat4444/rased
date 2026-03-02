// Import the functions you need from the SDKs you need
import { initializeApp,getApps, getApp  } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdSo5SbCITmHCzRQsW49H30O4L7cI8lw0",
  authDomain: "task-19427.firebaseapp.com",
  projectId: "task-19427",
  storageBucket: "task-19427.firebasestorage.app",
  messagingSenderId: "850524372101",
  appId: "1:850524372101:web:d320bcbd5047209aa5bdec",
  measurementId: "G-6JB75M2GET"
};

// Initialize Firebase

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();// const analytics = getAnalytics(app);

const auth = getAuth(app);
export const db = getFirestore(app);
  

 const storage = getStorage(app);
export { auth,storage };