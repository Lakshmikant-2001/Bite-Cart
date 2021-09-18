import {firebaseConfig} from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);

const hamBtn =  document.querySelector('.ham-expand-div');
const closeBtn = document.querySelector('.ham-contract-div');
const  sideNav = document.querySelector('.side-navbar');
const main = document.querySelector('.main');
const signOutBtn = document.querySelector('#sign-out-btn');

closeBtn.onclick = () =>{
    sideNav.style.transform="translateX(-100%)";
    hamBtn.style.transform="scale(1)";
    main.style.transform="translateX(-200px)";
    hamBtn.style.transition="transform .75s ease-in-out"
}

hamBtn.onclick = () =>{
    sideNav.style.transform="translateX(0)";
    hamBtn.style.transform="scale(0)";
    main.style.transform="translateX(0)";
    hamBtn.style.transition="transform .1s ease-in-out";
}

signOutBtn.addEventListener('click',()=>{
    firebase.auth().signOut().then(function() {
        window.location="./index.html"
      }, function(error) {
        console.error(error);
      });
})