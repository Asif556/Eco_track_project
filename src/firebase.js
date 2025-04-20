import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Add this import

const firebaseConfig = {
  apiKey: "AIzaSyDqLxNOBxThSYyn-w-t1upBZRLehHhdleI",
  authDomain: "eco-track-b3e91.firebaseapp.com",
  databaseURL: "https://eco-track-b3e91-default-rtdb.firebaseio.com/", // Add this line
  projectId: "eco-track-b3e91",
  storageBucket: "eco-track-b3e91.appspot.com", // Fixed this line
  messagingSenderId: "6356021429",
  appId: "1:6356021429:web:26090638c9ad70ecdd8efc",
  measurementId: "G-05FYE6R73J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app); // Initialize Realtime Database

export { app, analytics, auth, database }; // Export database