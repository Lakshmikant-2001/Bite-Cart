import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);

const database = firebase.database()
const auth = firebase.auth()

const resCardContainer = document.querySelector("#res-cards-container");


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
    database.ref('Food-Seller').on('value', snapshot => {
        let resData = snapshot.val()
        const restaurants = Object.keys(resData)
        checkMatchingRes(resData, restaurants, pincode)
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
    console.log(resData)
    availableRes.forEach(key => {
        let resName = resData[key].Res_det.Res_name;
        let resType = resData[key].Res_det.Res_type;
        let resLocation = resData[key].Res_det.Res_location;
        let resPincode = resData[key].Res_det.Res_pin;
        let resBadge = resData[key].Res_det.Res_badge;
        let resImage = resData[key].Res_det.Res_url;

        console.log(resName)
        console.log(resCardContainer)
        resCardContainer.innerHTML += `
        <div class="res-card" id="${resName}">
                <img class="res-img" src="" alt="">
                <div class="rating-des-wrapper">
                    <div class="res-des">
                        <h3>${resName}</h3>
                        <p>${resLocation}</p>
                    </div>
                    <div class="rating-div">
                        <p class="res-rating">4.1</p>
                        <i class="fas fa-star"></i>
                    </div>
                </div>`
        const resImageTag = document.querySelector(`#${resName} > .res-img`)
        console.log(resImageTag)
        resImageTag.setAttribute('src', resImage)
    })
}
