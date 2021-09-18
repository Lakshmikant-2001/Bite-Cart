
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
const googleSignIn = document.getElementById('google-sign-in')
checkStatus()
googleSignIn.addEventListener('click', googleLogin)
let provider = new firebase.auth.GoogleAuthProvider()

function checkStatus() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      writeInDb(user)
    } else {
    }
  });
}

function googleLogin() {
  firebase.auth().signInWithPopup(provider).then(res => {
    console.log(res.user)
  }).catch(e => {
    console.log(e)
  })
}

function writeInDb(user) {
  const name = user.displayName
  const imageUrl = user.photoURL

  firebase.database().ref('users/' + user.uid).set({
    username: name,
    profile_picture: imageUrl
  }, (error) => {
    if (error) {
    } else {
      window.location = "./index.html"
    }
  });
}
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

recaptchaVerifier.render().then(widgetId => {
  console.log(widgetId);
  window.recaptchaWidgetId = widgetId;
  console.log(window.recaptchaVerifier);
})