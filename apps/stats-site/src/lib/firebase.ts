import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Don't panic. This is meant to be public.
const app = initializeApp({
    apiKey: "AIzaSyCLGLqNJssv733zsOL5w97iYdznR9VtEGQ",
    authDomain: "war-brokers-projects.firebaseapp.com",
    projectId: "war-brokers-projects",
    storageBucket: "war-brokers-projects.appspot.com",
    messagingSenderId: "166385863117",
    appId: "1:166385863117:web:d4ac8c641c6c0ea8f35c84",
    measurementId: "G-0BX7BXYVB6",
})

export const firestore = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage()
