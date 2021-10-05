import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);

const database = firebase.database()
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
        const dbref = `Food-Seller/${user.uid}`
        const storageRef = `Restaurant/${user.uid}`
        // addResBtn.addEventListener("change",()=>{
        //     addRestaurantDet(dbref)
        //     uploadResImg(storageRef)
        // })
        addFoodBtn.addEventListener("click",()=>{
            addFoodDet(dbref)
            uploadFoodImg(storageRef)
        })
    }
    else {
        window.location = "./index.html"
    }
});

// function addRestaurantDet(dbref){
//     database.ref(`${dbref}/Res_Det`).set({
//         Res_name: resName.value,
//         Res_type: resType.value,
//         Res_location:resLocation.value,
//         Res_pincode:resPincode.value
//     })
// }

function addFoodDet(dbref){
    database.ref(`${dbref}/Foods/${foodName.value}`).set({
        Food_name: foodName.value,
        Food_type: foodType.value,
        Food_price:foodPrice.value,
        Food_total_qty:foodTotalQty.value
    })

}

// function uploadResImg(storageRef) {
    // storage.ref(`${storageRef}/Res-img`).put(resImage.files[0]).then(res => {
//     }).catch(e => {
//         console.log(e)
//     })
// }

function uploadFoodImg(storageRef) {
    storage.ref(`${storageRef}/Food-imgs`)
    .child(foodName.value).put(foodImage.files[0]).then(res => {
    }).catch(e => {
        console.log(e)
    })
}
