import { addLoadingAnimation, removeLoadingAnimation } from "./common.js";
import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);
const database = firebase.database()



const urlParams = new URLSearchParams(location.search);
let url = {};

for (const [key, value] of urlParams) {
    url[key] = value;
}

getResData()

function getResData() {
    database.ref(`Food-Seller/${url.res}`).once('value').then(snapshot => {
        let resData = snapshot.val();
        addResDet(resData)
    }, {
        onlyOnce: true
    }).catch(err => {
        console.log(err);
    })
}

function addResDet(resData) {
    const resDetails = resData.Res_det;
    const foodDetails = resData.Foods;
    const foodItems = Object.keys(foodDetails)

    const resDetDiv = document.querySelector("#res-det");
    const resNameTag = resDetDiv.querySelector("#res-name");
    const resLocationTag = resDetDiv.querySelector("#res-location");
    const resPincodeTag = resDetDiv.querySelector("#res-pincode");
    resNameTag.textContent = resDetails.Res_name + ",";
    resLocationTag.textContent = resDetails.Res_location + ",";
    resPincodeTag.textContent = resDetails.Res_pin;

    createCartItem(foodDetails, foodItems)
}

let modFoodDet = {}

function createCartItem(foodDetails, foodItems) {
    foodItems.forEach(key => {
        const newKey = key.replace(/\s/g, "")
        modFoodDet[newKey] = foodDetails[key];
    });
    const cartItemsWrapper = document.querySelector("#cart-items-wrapper");

    const foodQtyPair = JSON.parse(url.cart)
    const foods = Object.keys(foodQtyPair);
    let foodNo = 0;
    let totalPrice = 0
    foods.forEach(food => {
        foodNo ++;
        const foodKey = food;
        const qty = foodQtyPair[foodKey];
        const name = modFoodDet[foodKey].Food_name;
        const url = modFoodDet[foodKey].Food_photo_url;
        const price = modFoodDet[foodKey].Food_price;
        const amount = price * qty;
        totalPrice+=amount;
        cartItemsWrapper.innerHTML += `
        <div class="ind-cart-items" id="${foodKey}">
            <img src="./assets/food-img-1.jpg" alt="" class="item-img">
            <div>
                <p class="item-no">${foodNo}</p>
                <p class="item-name">${name}</p>
                <p>Qty: <input type="number" value="${qty}" readonly></p>
                <p class="item-price">price:${price}$</p>
            </div>
            <p class="item-amount">${amount}$</p>
        </div>`
        const foodImgTag = document.querySelector(`#${foodKey} > .item-img`);
        foodImgTag.setAttribute('src', url);
    })
    updateBill(totalPrice)
}

function updateBill(totalPrice){
    const placeOrderDiv = document.querySelector("#place-order-div");
    const totalPriceTag = placeOrderDiv.querySelector("#total-price");
    const discountInput = placeOrderDiv.querySelector("#discount > input");
    const finalPriceTag = placeOrderDiv.querySelector("#final-price");
    totalPriceTag.textContent+=totalPrice+"$";
    let finalPrice  = totalPrice - (totalPrice * (discountInput.value / 100));
    finalPriceTag.textContent+=finalPrice+"$"
    
}