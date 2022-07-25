// Import the functions you need from the SDKs you need
import { hexToRgb } from "@mui/material";
import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
  } from "firebase/auth";

import {getDatabase, onValue, ref , set, get, child} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVY1ZI1T8-26rkV1nxuS0aWYfVUzK2i60",
  authDomain: "eurocoin-a52c3.firebaseapp.com",
  databaseURL: "https://eurocoin-a52c3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eurocoin-a52c3",
  storageBucket: "eurocoin-a52c3.appspot.com",
  messagingSenderId: "783899372522",
  appId: "1:783899372522:web:47d8898f6901768f8ea093"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    // const user = res.user;
    // const q = query(collection(db, "users"), where("uid", "==", user.uid));
    // const docs = await getDocs(q);
    // if (docs.docs.length === 0) {
    //   await addDoc(collection(db, "users"), {
    //     uid: user.uid,
    //     name: user.displayName,
    //     authProvider: "google",
    //     email: user.email,
    //   });
    // }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const signInWithFacebook = async () => {
  try {
    const res = await signInWithPopup(auth, facebookProvider);
    // const user = res.user;
    // const q = query(collection(db, "users"), where("uid", "==", user.uid));
    // const docs = await getDocs(q);
    // if (docs.docs.length === 0) {
    //   await addDoc(collection(db, "users"), {
    //     uid: user.uid,
    //     name: user.displayName,
    //     authProvider: "google",
    //     email: user.email,
    //   });
    // }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    // const user = res.user;
    // await addDoc(collection(db, "users"), {
    //   uid: user.uid,
    //   name,
    //   authProvider: "local",
    //   email,
    // });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  console.info("User Logout -> True")
  signOut(auth);
};

const getStates = async () => {
  console.info("GET States")
  const dbRef = ref(db);

  return get(child(dbRef,"States/"))
  .then((snapshot) => snapshot.val());
}

const getCoinByStates = async (state) => {
  console.info("GET Coin By States -> " + state)
  const dbRef = ref(db);

  return get(child(dbRef,"States/" + state + "/coin"))
  .then((snapshot) => snapshot.val());
}

const getInfoCoinByStates = async (state) => {
  console.info("GET Info of Coin By States -> " + state)
  const dbRef = ref(db);

  return get(child(dbRef,"States/" + state))
  .then((snapshot) => snapshot.val());
}

export {
  auth,
  getStates,
  getCoinByStates,
  getInfoCoinByStates,
  signInWithGoogle,
  signInWithFacebook,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};