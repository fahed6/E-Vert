// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth,GoogleAuthProvider  } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAc2opBsV25AIsZC0fYBMzpdUS-bDtLX3k",
  authDomain: "e-vert-35a96.firebaseapp.com",
  projectId: "e-vert-35a96",
  storageBucket: "e-vert-35a96.firebasestorage.app",
  messagingSenderId: "326658264049",
  appId: "1:326658264049:web:3604d053b090727bfb5250",
  measurementId: "G-3CF55PCYY5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth: Auth = getAuth(app);
const googleProvider = new GoogleAuthProvider()


export { auth,googleProvider };