import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const storage = firebase.storage()

const resName = document.querySelector('#res-name') 
const resType = document.querySelector('#res-type') 
const resLocation = document.querySelector('#res-location') 
const resPincode = document.querySelector('#res-pincode') 
const resImage = document.querySelector('#res-img') 
const foodName = document.querySelector('#food-name') 
const foodType = document.querySelector('#food-type') 
const foodPrice = document.querySelector('#food-price') 
const foodTotalQty = document.querySelector('#food-total-quantity') 
const foodImage = document.querySelector('#food-img') 

const addFoodBtn = document.querySelector('#add-food-btn') 
const addResBtn = document.querySelector('#add-res-btn') 

auth.onAuthStateChanged((user) => {
    if (user) {

    }
    else {
        window.location = "./index.html"
    }
});