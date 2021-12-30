import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);

const database = firebase.database()

const urlParams = new URLSearchParams(location.search);
const url = [];
for (const [key, value] of urlParams) {
    url.push(value)
}


function resDatabase() {
    database.ref('Food-Seller').once('value').then(snapshot => {
        let resData = snapshot.val()
        const restaurants = Object.keys(resData)
        checkMatchingRes(resData, restaurants)
    }, {
        onlyOnce: true
    })
}

function checkMatchingRes(resData, restaurants) {
    let matchedRes = {};
    restaurants.forEach((key) => {
        let pin = resData[key].Res_det.Res_pin;
        let name = resData[key].Res_det.Res_name;
        if ((pin == url[1]) && (name == url[0])) {
            matchedRes = resData[key]
        }
    })
    createResCard(matchedRes)
}

function createResCard(matchedRes) {
    let resData = matchedRes.Res_det;
    const header = document.querySelector("#restaurant-header-wrapper")
    const resName = header.querySelector(".res-name")
    const resLocation = header.querySelector(".res-location")
    const resType = header.querySelector(".res-type")
    resName.textContent = resData.Res_name
    resLocation.textContent = resData.Res_location
    resType.textContent = resData.Res_type
    let foodData = matchedRes.Foods;
    let foodItems = Object.keys(foodData);
    createCard(foodData, foodItems)
}

function createCard(foodData, foodItems) {
    const foodsCardWrapper = document.querySelector("#food-cards-wrapper");
    foodItems.forEach((key) => {
        let foodTypeImg;
        if (foodData[key].Food_type == "veg") {
            foodTypeImg = "./assets/veg-icon.png";
        }
        else {
            foodTypeImg = "./assets/non-veg-icon.png";
        }
        let foodName = foodData[key].Food_name;
        let foodId = foodName.replace(/\s/g, '');
        let foodPrice = foodData[key].Food_price;
        let foodPhotoUrl = foodData[key].Food_photo_url;

        foodsCardWrapper.innerHTML += `
        <div class="food-card" id= ${foodId}>
            <img src="" alt="" class="food-type-logo" >
            <img src="" alt="" class="food-image">
            <div class="card-footer">
                <div>
                    <h4 class="food-name">${foodName}</h4>
                    <p class="food-price">$${foodPrice}</p>
                </div>
                <div class="add-btn">
                    <p>Add +</p>
                </div>
            </div>
        </div>`
        const foodTypeTag = foodsCardWrapper.querySelector(`#${foodId} > .food-type-logo`)
        foodTypeTag.setAttribute('src', foodTypeImg)
        const foodImgTag = foodsCardWrapper.querySelector(`#${foodId} > .food-image`)
        foodImgTag.setAttribute('src', foodPhotoUrl)
    })
}

resDatabase()