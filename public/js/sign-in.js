
const firebaseConfig = {
  apiKey: "AIzaSyCM3FAnHapR-Xb4rHppVQ-JbUD9pK0KwEo",
  authDomain: "bite-cart.firebaseapp.com",
  databaseURL: "https://bite-cart-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bite-cart",
  storageBucket: "bite-cart.appspot.com",
  messagingSenderId: "28386127835",
  appId: "1:28386127835:web:1fb2a606b584b0e9d381fe"
};

firebase.initializeApp(firebaseConfig);

document.getElementById('google-sign-in').addEventListener('click', GoogleLogin)

let provider = new firebase.auth.GoogleAuthProvider()

function GoogleLogin() {
  firebase.auth().signInWithPopup(provider).then(res => {
    console.log(res.user) 
    window.location.href="./index.html";
  }).catch(e => {
    console.log(e)
  })
}

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

recaptchaVerifier.render().then(widgetId => {
  console.log(widgetId);
  window.recaptchaWidgetId = widgetId;
  console.log(window.recaptchaVerifier);
})