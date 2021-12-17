import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);

const database = firebase.database()
const auth = firebase.auth()
const storage = firebase.storage()

//Query Selectors -  all Form Fields
// const resName = document.querySelector('#res-name')
// const resType = document.querySelector('#res-type') 
// const resLocation = document.querySelector('#res-location') 
// const resPincode = document.querySelector('#res-pincode') 
// const resImage = document.querySelector('#res-img') 
// const addResBtn = document.querySelector('#add-res-btn') 
const foodName = document.querySelector('#food-name')
const vegType = document.querySelector('#veg');
const nonvegType = document.querySelector('#non-veg');
let foodType;
if (vegType.checked) {
    foodType = vegType;
}
else {
    foodType = nonvegType;
}
const foodPrice = document.querySelector('#food-price')
const foodTotalQty = document.querySelector('#food-total-quantity')
const foodImage = document.querySelector('#food-img')
const addFoodBtn = document.querySelector('#add-food-btn')

//Check user
auth.onAuthStateChanged((user) => {
    if (user) {
        const dbRef = `Food-Seller/${user.uid}`
        const storageRef = `Restaurant/${user.uid}`
        getFoodData(dbRef, storageRef)
        addFoodBtn.addEventListener("click", () => {
            resetFoodDiv()
            uploadFoodImg(storageRef,dbRef)
        })
    }
    else {
        window.location = "./index.html"
    }
});

//Add Food Details in DB
function addFoodDet(dbRef,url) {
    database.ref(`${dbRef}/Foods/${foodName.value}`).set({
        Food_name: foodName.value,
        Food_type: foodType.value,
        Food_price: foodPrice.value,
        Food_total_qty: foodTotalQty.value,
        Food_photo_url:url
    })
}

//Upload Food Image in storage
function uploadFoodImg(storageRef,dbRef) {
    let uploadFoodImage = storage.ref(`${storageRef}/Food-imgs`)
        .child(foodName.value).put(foodImage.files[0])
        uploadFoodImage.on('state_changed',snapshot => {
            
        },err => {
            console.log(err);
        },() => {
            uploadFoodImage.snapshot.ref.getDownloadURL().then(url => {
                addFoodDet(dbRef,url)
            })
        })
}

//Reset Food Cardsd
function resetFoodDiv(){
    const foodCardSection = document.querySelector('#food-cards-container')
    foodCardSection.innerHTML = ''
}

// Get Food Item Data
function getFoodData(dbRef, storageRef) {
    database.ref(dbRef).on('value', snapshot => {
        const data = snapshot.val().Foods
        let foodItems = Object.keys(data);
        createCard(data, foodItems, storageRef)
    })
}

//Create Food Cards
function createCard(foodData, foodItems, storageRef) {
    const foodCardSection = document.querySelector('#food-cards-container')

    foodItems.forEach((key) => {
        let foodTypeImg;
        if (foodData[key].Food_type == "veg") {
            foodTypeImg = "./assets/veg-icon.png";
        }
        else {
            foodTypeImg = "./assets/non-veg-icon.png";
        }
        let foodName = foodData[key].Food_name;
        let foodPrice = foodData[key].Food_price;
        let foodTotalQty = foodData[key].Food_total_qty;
        let foodPhotoUrl = foodData[key].Food_photo_url;

        foodCardSection.innerHTML += `
        <div class="food-card" id= ${foodName}>
            <img src="" alt="" class="food-type-logo" >
            <img src="" alt="" class="food-image">
            <div class="card-footer">
                <div>
                    <h4 class="food-name">${foodName}</h4>
                    <p class="food-price">$${foodPrice}</p>
                </div>
                <div class="add-btn">
                    <p>Oty:${foodTotalQty}</p>
                </div>
            </div>
        </div>`
        const foodTypeTag = document.querySelector(`#${foodName} > .food-type-logo`)
        foodTypeTag.setAttribute('src', foodTypeImg)
        const foodImgTag = document.querySelector(`#${foodName} > .food-image`)
        foodImgTag.setAttribute('src',foodPhotoUrl)
    })
}

