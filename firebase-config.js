// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBnwcSW5Ya1DES-V3OdYNRkLfN2ntZUoZI",
    authDomain: "portfolio-839a8.firebaseapp.com",
    databaseURL: "https://portfolio-839a8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "portfolio-839a8",
    storageBucket: "portfolio-839a8.firebasestorage.app",
    messagingSenderId: "557595959115",
    appId: "1:557595959115:web:1d0a4d716bbd1a3c5992ce",
    measurementId: "G-7FZ8450YCZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = firebase.database();

// Export for use in other files
window.database = database;
