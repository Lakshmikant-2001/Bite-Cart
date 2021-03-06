import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);

const database = firebase.database()
const auth = firebase.auth()
const storage = firebase.storage()

//Query Selectors -  all Form Fields
const bodyContent = document.querySelectorAll("body *")
const aside = document.querySelector("#loading-aside")
const loadingIcon = aside.querySelector("img")
const resName = document.querySelector('#res-name')
const resType = document.querySelector('#res-type')
const resLocation = document.querySelector('#res-location')
const resPincode = document.querySelector('#res-pincode')
const resBadge = document.querySelector("#res-badge")
const resImgFile = document.querySelector('#res-img-file')
const resImg = document.querySelector('#res-img')
const resInputs = document.querySelectorAll('#res-form input')
const foodInputs = document.querySelectorAll('.add-food-form input')
const addResBtn = document.querySelector('#add-res-btn')
const editResBtn = document.querySelector('#edit-res-btn')
const foodName = document.querySelector('#food-name')
const vegType = document.querySelector('#veg');
const foodFileName = document.querySelector('#food-file-name')
const resFileName = document.querySelector('#res-file-name')
const foodPrice = document.querySelector('#food-price')
const foodTotalQty = document.querySelector('#food-total-quantity')
const foodImage = document.querySelector('#food-img')
const addFoodBtn = document.querySelector('#add-food-btn')
const formErrorElement = document.querySelector('#form-error-message')
const signOutBtn = document.querySelector('#sign-out-btn');
const fillResNtyTag = document.querySelector("#fill-res-ntfy-btn")
let foodType;

foodImage.addEventListener('change', () => {
    foodFileName.textContent = foodImage.files[0].name
})

window.addEventListener('load', () => {
    addLoadingAnimation()
})

//Check user
auth.onAuthStateChanged((user) => {
    if (user) {
        removeLoadingAnimation()
        const dbRef = `Food-Seller/${user.uid}`
        const storageRef = `Restaurant/${user.uid}`
        getResData(dbRef, storageRef)
        getFoodData(dbRef)
        editResBtn.addEventListener('click', () => {
            changeToEditState()
        })
        addResBtn.addEventListener("click", () => {
            verifyValidation(resInputs, storageRef, dbRef, uploadResImg)
        })
        addFoodBtn.addEventListener("click", callResNotifyMsgs)
        signOutBtn.addEventListener('click', () => {
            firebase.auth().signOut().then(() => {
                window.location = "./index.html"
            }).catch((error) => {
                console.log(error);
            });
        })
    }

    else {
        window.location = "./index.html"
    }
});

function verifyValidation(inputs, storageRef, dbRef, func) {
    let result = validateForm(inputs)
    if (result == false) {
        formErrorElement.style.display = "unset";
        notifyMsgs(formErrorElement)
    }
    else {
        addLoadingAnimation()
        func(storageRef, dbRef)
    }
}

function clearFoodFormInputs() {
    foodInputs.forEach((input) => {
        input.value = "";
    });
    foodFileName.textContent = "";
}

function validateForm(inputs) {
    let flag = true;
    inputs.forEach(input => {
        let checkValid = input.checkValidity()
        if (!checkValid) {
            flag = false;
        }
    })
    return flag;
}

function changeToEditState() {
    resFileName.style.display = "unset";
    editResBtn.style.display = "none";
    addResBtn.style.display = "unset";
    resImgFile.removeAttribute('disabled');
    resImg.classList.add('img');
    console.log(resImgFile.classList);
    const resInput = document.querySelector('#res-form input');
    resInput.focus()
    resInputs.forEach(input => {
        input.style.pointerEvents = "unset"
        input.style.borderBottom = "2px dotted #ffffff"
    })
    resImgFile.addEventListener('change', () => {
        resFileName.style.display = "unset"
        resFileName.textContent = resImgFile.files[0].name
    })
}

function removeEditState() {
    resFileName.style.display = "none"
    editResBtn.style.display = "unset";
    addResBtn.style.display = "none";
    resImgFile.setAttribute('disabled', true)
    resInputs.forEach(input => {
        input.style.pointerEvents = "none"
        input.style.borderBottom = "none"
    })
}
function uploadResImg(storageRef, dbRef) {
    let uploadResImage = storage.ref(`${storageRef}/Res-imgs`)
        .child(resName.value).put(resImgFile.files[0])
    uploadResImage.on('state_changed', snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setTimeout(() => {
            loadingPerCheck(progress)
        }, 1000)
        removeEditState()
    }, err => {
        console.log(err);
    }, () => {
        uploadResImage.snapshot.ref.getDownloadURL().then(url => {
            addResDet(dbRef, url)
        })
    })
}
function addResDet(dbRef, url) {
    database.ref(`${dbRef}/Res_det`).set({
        Res_name: resName.value,
        Res_location: resLocation.value,
        Res_pin: resPincode.value,
        Res_badge: resBadge.value,
        Res_type: resType.value,
        Res_url: url
    })
}

function getResData(dbRef, storageRef) {
    database.ref(`${dbRef}/Res_det`).on('value', snapshot => {
        const data = snapshot.val()
        if (data == null) {
            fillResPop()
        }
        else {
            updateResCard(data);
            addFoodBtn.removeEventListener("click", callResNotifyMsgs)
            addFoodBtn.addEventListener("click", () => {
                resetFoodDiv()
                verifyValidation(foodInputs, storageRef, dbRef, uploadFoodImg)
            });
        }
    })
}


function updateResCard(data) {
    resName.value = data.Res_name;
    resPincode.value = data.Res_pin;
    resType.value = data.Res_type;
    resBadge.value = data.Res_badge;
    resLocation.value = data.Res_location;
    resImg.setAttribute('src', data.Res_url)
}


//Upload Food Image in storage
function uploadFoodImg(storageRef, dbRef) {
    let uploadFoodImage = storage.ref(`${storageRef}/Food-imgs`)
        .child(foodName.value).put(foodImage.files[0])
    uploadFoodImage.on('state_changed', snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setTimeout(() => {
            loadingPerCheck(progress);
        }, 1000)
    }, err => {
        console.log(err);
    }, () => {
        uploadFoodImage.snapshot.ref.getDownloadURL().then(url => {
            addFoodDet(dbRef, url)
        })
    })
}

//Add Food Details in DB
function addFoodDet(dbRef, url) {
    if (vegType.checked) {
        foodType = "veg";
    }
    else {
        foodType = "non-veg";
    }
    console.log(foodName.value)
    database.ref(`${dbRef}/Foods/${foodName.value}`).set({
        Food_name: foodName.value,
        Food_type: foodType,
        Food_price: foodPrice.value,
        Food_total_qty: foodTotalQty.value,
        Food_photo_url: url
    });
}

// Get Food Item Data
function getFoodData(dbRef) {
    database.ref(dbRef).on('value', snapshot => {
        const data = snapshot.val().Foods
        let foodItems = Object.keys(data);
        createCard(data, foodItems);
        clearFoodFormInputs()
    })
}

//Create Food Cards
function createCard(foodData, foodItems) {
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
        console.log(foodName)
        let foodId = foodName.replace(/\s/g, '');
        console.log(foodId)
        let foodPrice = foodData[key].Food_price;
        let foodTotalQty = foodData[key].Food_total_qty;
        let foodPhotoUrl = foodData[key].Food_photo_url;

        foodCardSection.innerHTML += `
        <div class="food-card" id= ${foodId}>
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
        const foodTypeTag = foodCardSection.querySelector(`#${foodId} > .food-type-logo`)
        foodTypeTag.setAttribute('src', foodTypeImg)
        const foodImgTag = foodCardSection.querySelector(`#${foodId} > .food-image`)
        foodImgTag.setAttribute('src', foodPhotoUrl)
    })
}

//Reset Food Cardsd
function resetFoodDiv() {
    const foodCardSection = document.querySelector('#food-cards-container')
    foodCardSection.innerHTML = ''
}

//Loading animation during storage upload
function loadingPerCheck(progress) {
    if (progress == 100) {
        removeLoadingAnimation()
    }
}

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

function notifyMsgs(element) {
    element.style.display = "unset";
    setTimeout(() => {
        element.style.display = "none";
    }, 2000)
}

function callResNotifyMsgs(){
    notifyMsgs(fillResNtyTag)
}

function fillResPop() {
    changeToEditState()
}