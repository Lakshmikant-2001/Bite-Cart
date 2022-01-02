import { addLoadingAnimation, removeLoadingAnimation } from "./common.js";
import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);
const database = firebase.database()

const urlParams = new URLSearchParams(location.search);
const url = [];
for (const [key, value] of urlParams) {
    url.push(value)
}

window.addEventListener('load', () => {
    addLoadingAnimation()
})

function resDatabase() {
    database.ref('Food-Seller').once('value').then(snapshot => {
        let resData = snapshot.val()
        const restaurants = Object.keys(resData)
        checkMatchingRes(resData, restaurants)
    }, {
        onlyOnce: true
    }).catch(err => {
        console.log(err);
        removeLoadingAnimation()
    })
}

let matchedRes = {};
let matchedResKey;

function checkMatchingRes(resData, restaurants) {
    restaurants.forEach((key) => {
        let pin = resData[key].Res_det.Res_pin;
        let name = resData[key].Res_det.Res_name;
        let id = name.replace(/\s/g, '');
        if ((pin == url[1]) && (id == url[0])) {
            matchedRes = resData[key]
            matchedResKey = key
        }
    })
    if (matchedRes == null) {
    console.log("no matching res");
        removeLoadingAnimation()
    }
    else {
        createResCard(matchedRes)
    }
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
    createFoodCard(foodData, foodItems)
}
const foodsCardWrapper = document.querySelector("#food-cards-wrapper");


function createFoodCard(foodData, foodItems) {
    removeLoadingAnimation()
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
                    <button class="dec-input"> - </button>
                    <input type="number" placeholder="Add +" min="1" max="10" readonly>
                    <button class="inc-input"> + </button>
                </div>
            </div>
        </div>`
        const foodTypeTag = foodsCardWrapper.querySelector(`#${foodId} > .food-type-logo`)
        foodTypeTag.setAttribute('src', foodTypeImg)
        const foodImgTag = foodsCardWrapper.querySelector(`#${foodId} > .food-image`)
        foodImgTag.setAttribute('src', foodPhotoUrl)
    })
    addItemListeners()
}

resDatabase()

function addItemListeners() {
    const incOperator = document.querySelectorAll('.inc-input');
    const decOperator = document.querySelectorAll('.dec-input');

    incOperator.forEach((inc) => {
        inc.addEventListener("click", (e) => {
            const triggeredParent = e.target.parentNode.parentNode.parentNode;
            incrementInput(triggeredParent)
            addItem(triggeredParent)
        })
    })

    decOperator.forEach(dec => {
        dec.addEventListener("click", (e) => {
            const triggeredParent = e.target.parentNode.parentNode.parentNode;
            decrementInput(triggeredParent)
            addItem(triggeredParent)
        })
    })
}

function incrementInput(triggeredParent) {
    const input = triggeredParent.querySelector("input");
    const val = Number(input.value);
    if ((val >= 0) && (val < 10)) {
        input.value = val + 1;
    }
}

function decrementInput(triggeredParent) {
    const input = triggeredParent.querySelector("input");
    const val = Number(input.value);
    if (val > 0) {
        input.value = val - 1;
    }
}

function addItem(foodCard) {
    const input = foodCard.querySelector("input");
    const price = foodCard.querySelector(".food-price").textContent
    console.log(price)
    const addedFood = foodCard.getAttribute('id');
    const val = Number(input.value);
    addToCart(addedFood, val, price)
}

let cartItems = {};
let foodQtyPair = {};

function addToCart(food, qty, price) {
    foodQtyPair[food] = qty;
    cartItems[food] = qty + price;
    const qtyPricePair = Object.values(cartItems)
    let totalPrice = 0;
    let totalItems = 0;
    qtyPricePair.forEach(pair => {
        const split = pair.split("$");
        totalItems += Number(split[0]);
        totalPrice += split[0] * split[1];
    })
    createProceedToBuy(foodQtyPair, totalItems, totalPrice)
}

function createProceedToBuy(foodQtyPair, totalItems, totalPrice) {
    const prcdToBuyBtn = document.querySelector('#proceed-to-buy');
    prcdToBuyBtn.style.display = "flex";
    const itemQtyTag = prcdToBuyBtn.querySelector('#items > span')
    console.log(itemQtyTag)
    const priceTag = prcdToBuyBtn.querySelector('#price > span')
    itemQtyTag.textContent = totalItems;
    priceTag.textContent = totalPrice;
    foodQtyPair=(JSON.stringify(foodQtyPair))
    if(totalItems == 0){
        prcdToBuyBtn.style.display="none"
    }
    prcdToBuyBtn.addEventListener('click',()=>{
        window.location = `./cart.html?res=${matchedResKey}&cart=${foodQtyPair}&items=${totalItems}&price=${totalPrice}`;
    })
}