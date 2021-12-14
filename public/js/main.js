import { firebaseConfig } from "./firebase-modules.js"

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
let provider = new firebase.auth.GoogleAuthProvider();

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
recaptchaVerifier.render().then(widgetId => {
  window.recaptchaWidgetId = widgetId;
})

// Event listeners for google sign-in and getCode button
const googleSignInBtn = document.getElementById('google-sign-in-btn');
const getCodeBtn = document.getElementById('get-code-btn');

getCodeBtn.addEventListener('click', getPhoneNumber);
googleSignInBtn.addEventListener('click', googleSignIn);

//google sign-in 
function googleSignIn() {
  const body = document.querySelector('body');
  body.style.filter = "blur(30px)";
  googleSignInBtn.removeEventListener('click', googleSignIn);
  auth.signInWithPopup(provider).then(res => {
    body.style.filter = "none";
  }).catch(e => {
    body.style.filter = "none";
    googleSignInBtn.addEventListener('click', googleSignIn);
  })
}

//mobile-phone sign-in
function getPhoneNumber() {
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

// Auth state change
auth.onAuthStateChanged(user => {
  if (user) {
    console.log(user);
    console.log("user")
    checkInDb(user)
  }
  else {
    console.log("NoUser")
  }
});

//Check user in DB
function checkInDb(user) {
  firebase.database().ref('users/' + user.uid + '/user-details/').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data == null) {
      userFormGenerate(user)
    }
    else {
      const userType = data.userType;
      pageFind(userType)
    }
  })
}

//user Form
function userFormGenerate(user) {
  const formDiv = document.querySelector('.form-cnt');
  const formWrapper = document.querySelector('.form-wrapper')
  formDiv.remove();
  formWrapper.innerHTML = `
  <div class="user-form-div">
    <div id="user-acc-type-div" name='buyer'>
      <h2 id="acc-type-buyer">Buyer</h2>
      <h2 id="acc-type-seller">Seller</h2>
    </div>
    <div id="buyer-form">
      <input type='text' placeholder='Enter your name' id='u-name'/>
      <input type='number' placeholder='Enter your mobile no' id='u-mob-no'/>
      <input type='text' placeholder='Door no' id='u-door-no' /> 
      <input type='text' placeholder='Street name' id='u-street-name' />
      <input type='text' placeholder='Area' id='u-area' /> 
      <input type='number' placeholder='Pincode' id='u-pincode' /> 
    </div>
    <div id="seller-form">
      <input type='text' placeholder='Enter your name'/>
      <input type='number' placeholder='Enter your mobile no'/>
  </div>
  <button id='user-det-btn' class="btn">Submit</button>
  </div>`;
  const userTypeBuyerBtn = document.querySelector('#acc-type-buyer')
  const userTypeSellerBtn = document.querySelector('#acc-type-seller')
  const buyerForm = document.querySelector("#buyer-form")
  const sellerForm = document.querySelector("#seller-form")
  const userDetBtn = document.querySelector('#user-det-btn');
  const accType = document.querySelector("#user-acc-type-div");

  userTypeSellerBtn.addEventListener('click', () => {
    buyerForm.style.display = "none"
    sellerForm.style.display = "flex"
    userTypeBuyerBtn.style.backgroundColor = "#fff"
    userTypeBuyerBtn.style.color = "#6d6a6a"
    userTypeSellerBtn.style.backgroundColor = "#fa5953"
    userTypeSellerBtn.style.color = "#fff"
    accType.removeAttribute('name')
    accType.setAttribute('name', 'seller')
  })
  userTypeBuyerBtn.addEventListener('click', () => {
    sellerForm.style.display = "none"
    buyerForm.style.display = "flex"
    userTypeSellerBtn.style.backgroundColor = "#fff"
    userTypeSellerBtn.style.color = "#6d6a6a"
    userTypeBuyerBtn.style.backgroundColor = "#fa5953"
    userTypeBuyerBtn.style.color = "#fff"
    accType.setAttribute('name', 'buyer')
  })

  userDetBtn.addEventListener('click', () => {
    writeInDb(user, accType)
  })
}
//store User Details
function writeInDb(user, accType) {
  const userType = accType.getAttribute('name')
  const imageUrl = user.photoURL
  const userName = document.querySelector('#u-name').value
  const userMobileNo = document.querySelector('#u-mob-no').value
  const userDoorNo = document.querySelector('#u-door-no').value
  const userStreetName = document.querySelector('#u-street-name').value
  const userArea = document.querySelector('#u-area').value
  const userPincode = document.querySelector('#u-pincode').value
  firebase.database().ref('users/' + user.uid + '/user-details/').set({
    username: userName,
    userType: userType,
    userMobileNo: userMobileNo,
    profile_picture: imageUrl,
    doorNo: userDoorNo,
    streetName: userStreetName,
    area: userArea,
    pincode: userPincode
  }, (error) => {
    if (error) {
      console.log(error)
    }
    else {
      pageFind(userType)
    }
  });
}

//Redirect into respective user pages
function pageFind(userType){
  if (userType == "buyer") {
    window.location = "./landing-page.html"
  }
  else {
    window.location = "./food-seller.html"
  }
}