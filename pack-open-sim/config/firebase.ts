import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbgpAmnT1LhOMY8S48zfvCOmwefrj7hg0",
  authDomain: "pack-opener-simulator.firebaseapp.com",
  projectId: "pack-opener-simulator",
  storageBucket: "pack-opener-simulator.firebasestorage.app",
  messagingSenderId: "1031883564878",
  appId: "1:1031883564878:web:3b04cce5bb5531153fe01f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
