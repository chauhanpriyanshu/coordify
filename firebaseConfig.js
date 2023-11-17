// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJLEE4sJ4hYjHcfX0lZ5ua4NarRt0r6Vw",
  authDomain: "coordify-80f98.firebaseapp.com",
  databaseURL: "https://coordify-80f98-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "coordify-80f98",
  storageBucket: "coordify-80f98.appspot.com",
  messagingSenderId: "476123341398",
  appId: "1:476123341398:web:58f09c098f549707d591f7",
  measurementId: "G-0K4X74BN92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database }