import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

firebase.initializeApp({
    apiKey: "AIzaSyCUbKNxSycF3qkedVgPl9CRPRv3jGt_66Q",
    authDomain: "tic-tac-toe-6ae9b.firebaseapp.com",
    projectId: "tic-tac-toe-6ae9b",
    storageBucket: "tic-tac-toe-6ae9b.appspot.com",
    messagingSenderId: "936609038718",
    appId: "1:936609038718:web:a113918f46f2e628ddf32f"
});


export const auth = firebase.auth();
export const db = firebase.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
  auth.signInWithPopup(googleProvider).then((res) => {
    console.log(res.user)
  }).catch((error) => {
    console.log(error.message)
  })
}

export const logOut = () => {
  auth.signOut().then(()=> {
    console.log('logged out')
  }).catch((error) => {
    console.log(error.message)
  })
}