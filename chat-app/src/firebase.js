import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyC0LBI3ltTmvdzZjYqw0AklDBwmldtiU2c",
  authDomain: "chat-app-bc4a3.firebaseapp.com",
  databaseURL: "https://chat-app-bc4a3.firebaseio.com",
  projectId: "chat-app-bc4a3",
  storageBucket: "chat-app-bc4a3.appspot.com",
  messagingSenderId: "1022182786846",
  appId: "1:1022182786846:web:f31256b1fbf9ac05cb2b0f",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
