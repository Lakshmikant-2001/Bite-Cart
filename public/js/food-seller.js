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
        addResBtn.addEventListener("click",()=>{
            addRestaurantDet(user.uid)
            uploadResImg(user.uid)

        })
        addFoodBtn.addEventListener("click",()=>{
            addFoodDet(user.uid)
            uploadFoodImg(user.uid)
        })
    }
    else {
        window.location = "./index.html"
    }
});

function addRestaurantDet(uid){
    firebase.database().ref('Food-Seller/' + uid +'-'+ resName.value +'/Res-details/').set({
        Res_name: resName.value,
        Res_type: resType.value,
        Res_location:resLocation.value,
        Res_pincode:resPincode.value
    })

}
function addFoodDet(uid){
    firebase.database().ref('Food-Seller/' + uid +'-'+ resName.value +'/Foods/'+foodName.value).set({
        Food_name: foodName.value,
        Food_type: foodType.value,
        Food_price:foodPrice.value,
        Food_total_qty:foodTotalQty.value
    })

}

function uploadResImg(id) {
    storage.ref("Restaurant/"+id).child("ResImage").put(resImage.files[0]).then(res => {
    }).catch(e => {
        console.log(e)
    })
}
function uploadFoodImg(id) {
    storage.ref("Restaurant/"+id+"/Foods/").child(foodName.value).put(foodImage.files[0]).then(res => {
    }).catch(e => {
        console.log(e)
    })
}