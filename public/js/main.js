import {firebaseConfig} from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);

let provider = new firebase.auth.GoogleAuthProvider();
const googleSignIn = document.getElementById('google-sign-in')

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    writeInDb(user)
  }
});

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
      window.location = "./landing-page.html"
    }
  });
}

googleSignIn.addEventListener('click', googleLogin);

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

recaptchaVerifier.render().then(widgetId => {
  console.log(widgetId);
  window.recaptchaWidgetId = widgetId;
  console.log(window.recaptchaVerifier);
})