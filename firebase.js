import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARXbU2ufU4CsGFkmdxia6VA16uG5mD0RA",
  authDomain: "hspantryapp-6b9eb.firebaseapp.com",
  projectId: "hspantryapp-6b9eb",
  storageBucket: "hspantryapp-6b9eb.appspot.com",
  messagingSenderId: "918994835100",
  appId: "1:918994835100:web:c8db60325f690fe2f03f59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {app,firestore}