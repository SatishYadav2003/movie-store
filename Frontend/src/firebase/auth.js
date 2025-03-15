import { signInWithPopup, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { auth, provider } from "./firebaseConfig.js";


setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // console.log("Session persistence set to sessionStorage.");
  })
  .catch((error) => {
    // console.error("Error setting persistence:", error);
  });


export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return null;
  }
};


export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out.");
  } catch (error) {
    console.error("Sign-Out Error:", error);
  }
};
