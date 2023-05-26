import firebase from "firebase/compat/app";
import "firebase/compat/database";

const config = {
  //API KEYS
  apiKey: "AIzaSyD2XMwQgWcGPnSsnBPW7vrIuYvP1mKN74g",
  authDomain: "alfian-09040620045.firebaseapp.com",
  projectId: "alfian-09040620045",
  storageBucket: "alfian-09040620045.appspot.com",
  messagingSenderId: "600050779841",
  appId: "1:600050779841:web:a4506adc7094a4039eb640",
};

const db = firebase.initializeApp(config);
export default db;
