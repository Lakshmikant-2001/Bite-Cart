//import { initializeApp } from "https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js";
const firebaseConfig = {
    apiKey: "AIzaSyCM3FAnHapR-Xb4rHppVQ-JbUD9pK0KwEo",
    authDomain: "bite-cart.firebaseapp.com",
    databaseURL: "https://bite-cart-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bite-cart",
    storageBucket: "bite-cart.appspot.com",
    messagingSenderId: "28386127835",
    appId: "1:28386127835:web:1fb2a606b584b0e9d381fe"
  };
  
  
  //const app = initializeApp(firebaseConfig);
  firebase.initializeApp(firebaseConfig);
  
  document.getElementById('login').addEventListener('click', GoogleLogin)
  
  let provider = new firebase.auth.GoogleAuthProvider()
  
  function GoogleLogin() {
    console.log('Login Btn Call')
    firebase.auth().signInWithPopup(provider).then(res => {
      console.log(res.user) 
    }).catch(e => {
      console.log(e)
    })
  }