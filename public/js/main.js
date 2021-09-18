import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);

let provider = new firebase.auth.GoogleAuthProvider();
const googleSignIn = document.getElementById('google-sign-in');

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    writeInDb(user)
  }
});

function googleLogin() {
  const body = document.querySelector('body');
  body.style.filter = "blur(30px)";
  googleSignIn.removeEventListener('click',googleLogin);
  firebase.auth().signInWithPopup(provider).then(res => {
    console.log(res.user);
  }).catch(e => {
    body.style.filter = "none";
    googleSignIn.addEventListener('click', googleLogin);

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
      window.location = "./landing-page.html"
    }
  });
}

googleSignIn.addEventListener('click', googleLogin);

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

recaptchaVerifier.render().then(widgetId => {
  window.recaptchaWidgetId = widgetId;
})