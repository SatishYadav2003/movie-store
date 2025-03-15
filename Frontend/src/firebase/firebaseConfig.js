import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyD_ixYg4_E4MpDWNtcWGiwynVN_bCNTOMU",
  authDomain: "moviestore-e85e3.firebaseapp.com",
  projectId: "moviestore-e85e3",
  storageBucket: "moviestore-e85e3.appspot.com",
  messagingSenderId: "139477744589",
  appId: "1:139477744589:web:b7ea4af020b870a0a62284",
  measurementId: "G-G34LNS7R10"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
