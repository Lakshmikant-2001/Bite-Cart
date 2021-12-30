import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);

const database = firebase.database()
const auth = firebase.auth()

const resCardContainer = document.querySelector("#res-cards-container");

window.addEventListener('load', () => {
    addLoadingAnimation()
})

auth.onAuthStateChanged(user => {
    if (user) {
        getUserPincode(user)
    }
    else {
        window.location = "./index.html"
    }
});

function getUserPincode(user) {
    database.ref('users/' + user.uid + '/user-details/').on('value', snapshot => {
        const data = snapshot.val();
        const pincode = data.pincode
        getFoodSellers(pincode)
    })
}

function getFoodSellers(pincode) {
    database.ref('Food-Seller').once('value').then(snapshot => {
        let resData = snapshot.val()
        const restaurants = Object.keys(resData)
        checkMatchingRes(resData, restaurants, pincode)
    }, {
        onlyOnce: true
    })
}

function checkMatchingRes(resData, restaurants, pincode) {
    let availableRes = [];
    restaurants.forEach((key) => {
        let pin = resData[key].Res_det.Res_pin;
        if (pin == pincode) {
            availableRes.push(key)
        }
    })
    createResCard(resData, availableRes)
}

function createResCard(resData, availableRes) {
    removeLoadingAnimation()
    availableRes.forEach(key => {
        let resName = resData[key].Res_det.Res_name;
        let resId = resName.replace(/\s/g, '')
        let resType = resData[key].Res_det.Res_type;
        let resLocation = resData[key].Res_det.Res_location;
        let resPincode = resData[key].Res_det.Res_pin;
        let resBadge = resData[key].Res_det.Res_badge;
        let resImage = resData[key].Res_det.Res_url;
        resCardContainer.innerHTML += `
        <div class="res-card" id="${resId}" data-pincode = "${resPincode}">
                <img class="res-img" src="" alt="">
                <div class="rating-des-wrapper">
                    <div class="res-des">
                        <h3>${resName}</h3>
                        <p>${resLocation} </p>
                    </div>
                    <div class="rating-div">
                        <p class="res-rating">4.1</p>
                        <i class="fas fa-star"></i>
                    </div>
                </div>`
        const resImageTag = document.querySelector(`#${resId} > .res-img`)
        resImageTag.setAttribute('src', resImage)
    })
    const allResCard = resCardContainer.querySelectorAll(".res-card");
    addEvent(allResCard)
}

const bodyContent = document.querySelectorAll("body *")
const aside = document.querySelector("aside")
const loadingIcon = document.querySelector("aside > img")


function addLoadingAnimation() {
    bodyContent.forEach(element => {
        element.style.display = "none"
    })
    aside.style.display = "unset"
    loadingIcon.style.display = "unset"
    loadingIcon.style.animation = " rotate 3s infinite linear";
}

function removeLoadingAnimation() {
    bodyContent.forEach(element => {
        element.style.display = ""
    })
    aside.style.display = "none"
    loadingIcon.style.display = "none"
    loadingIcon.style.animation = "unset"
}

function addEvent(allResCard) {
    allResCard.forEach(card => {
        console.log(card.id)
        const cardPincode = card.getAttribute("data-pincode")
        card.addEventListener('click', () => {
            window.location = `./restaurant-foods.html?res=${card.id}&pin=${cardPincode}`
        })
    })
}
