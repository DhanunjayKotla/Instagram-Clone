// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "instagram-e280e.firebaseapp.com",
    projectId: "instagram-e280e",
    storageBucket: "instagram-e280e.appspot.com",
    messagingSenderId: "599393422551",
    appId: "1:599393422551:web:1691fc69a4b78748183492",
    measurementId: "G-TYSLQ02QJZ"
};

module.exports = firebaseConfig;

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
