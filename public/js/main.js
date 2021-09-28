import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let provider = new firebase.auth.GoogleAuthProvider();
const googleSignIn = document.getElementById('google-sign-in');
const getCodeBtn = document.getElementById('get-code-btn');

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

recaptchaVerifier.render().then(widgetId => {
  window.recaptchaWidgetId = widgetId;
})

function displayEnterCodeDiv() {
  const formDiv = document.querySelector('.form-cnt');
  const verifyCodeDiv = document.querySelector('#verify-code-div');
  const phoneNumber = `+91${document.querySelector('#phone-no').value}`;
  const captchaVerifier = window.recaptchaVerifier;
  verifyCodeDiv.style.visibility = "unset";
  formDiv.style.display = "none";
  getCode(phoneNumber, captchaVerifier)
}

function getCode(phoneNumber, captchaVerifier) {
  const signInWithPhoneBtn = document.getElementById('sign-in-with-phone-btn');
  auth.signInWithPhoneNumber(phoneNumber, captchaVerifier)
    .then(confirmationResult => {
      const sentCodeId = confirmationResult.verificationId;
      signInWithPhoneBtn.addEventListener('click', () => signInWithPhone(sentCodeId));
    })
}

function signInWithPhone(sentCodeId) {
  const codeInput = document.getElementById('code-input').value;
  console.log(codeInput);
  const credential = firebase.auth.PhoneAuthProvider.credential(sentCodeId, codeInput);
  auth.signInWithCredential(credential)
    .then(() => {
      console.log(auth.currentUser);
    })
    .catch(error => {
      console.error(error);
    })
}

auth.onAuthStateChanged((user) => {
  if (user) {
    userFormGenerate(user);
  }
});

function googleLogin() {
  const body = document.querySelector('body');
  body.style.filter = "blur(30px)";
  googleSignIn.removeEventListener('click', googleLogin);
  auth.signInWithPopup(provider).then(res => {
    console.log(res.user);
    body.style.filter = "none";
  }).catch(e => {
    body.style.filter = "none";
    googleSignIn.addEventListener('click', googleLogin);
  })
}


function userFormGenerate(user) {
  const formDiv = document.querySelector('.form-cnt');
  const formWrapper = document.querySelector('.form-wrapper')
  formDiv.remove();
  formWrapper.innerHTML = `
    <input type='text' placeholder='Enter your name' id='u_name' />
    <input type='text' placeholder='Door no' id='u_door_no' /> 
    <input type='text' placeholder='Street name' id='u_street_name' />
    <input type='text' placeholder='Area' id='u_area' /> 
    <input type='text' placeholder='Pincode' id='u_pincode' /> 
    <button id='user-det-btn'>Submit</button>`;
  const userDetBtn = document.querySelector('#user-det-btn');
  userDetBtn.addEventListener('click', ()=>{
    writeInDb(user)
  })
}

function writeInDb(user) {
  const name = user.displayName
  const imageUrl = user.photoURL
  const userName = document.querySelector('#u_name')
  const userDoorNo = document.querySelector('#u-door-no')
  const userStreetName = document.querySelector('#u-street-name')
  const userArea = document.querySelector('#u-area')
  const userPincode = document.querySelector('#u-pincode')
  firebase.database().ref('users/' + user.uid).set({
    username: name,
    profile_picture: imageUrl
  }, (error) => {
    if (error) { }
    else {
      window.location = "./landing-page.html"
    }
  });
}

getCodeBtn.addEventListener('click', displayEnterCodeDiv);
googleSignIn.addEventListener('click', googleLogin);