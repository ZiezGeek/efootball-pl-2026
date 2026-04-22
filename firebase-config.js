// =============================================
//  FIREBASE CONFIGURATION
//  Replace these values with your Firebase project settings
//  Go to: Firebase Console > Project Settings > Your Apps
// =============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCroN8RZxsOK-AZUOlqNLVvjsaq7xJneLw",
    authDomain: "efootball-be51c.firebaseapp.com",
    databaseURL: "https://efootball-be51c-default-rtdb.firebaseio.com",
    projectId: "efootball-be51c",
    storageBucket: "efootball-be51c.firebasestorage.app",
    messagingSenderId: "283290021571",
    appId: "1:283290021571:web:f7c17f4cf967b1658cfc76"
  };
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
