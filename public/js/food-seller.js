import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);

const database = firebase.database()
const auth = firebase.auth()
const storage = firebase.storage()

//Query Selectors -  all Form Fields
const resName = document.querySelector('#res-name')
const resType = document.querySelector('#res-type')
const resLocation = document.querySelector('#res-location')
const resPincode = document.querySelector('#res-pincode')
const resBadge = document.querySelector("#res-badge")
const resImgFile = document.querySelector('#res-img-file')
const resImg = document.querySelector('#res-img')
const resInputs = document.querySelectorAll('#res-form input')
const addResBtn = document.querySelector('#add-res-btn')
const editResBtn = document.querySelector('#edit-res-btn')
const foodName = document.querySelector('#food-name')
const vegType = document.querySelector('#veg');
const nonvegType = document.querySelector('#non-veg');
const foodFileName = document.querySelector('#food-file-name')
const resFileName = document.querySelector('#res-file-name')

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

foodImage.addEventListener('change', () => {
    foodFileName.textContent = foodImage.files[0].name
})
//Check user
auth.onAuthStateChanged((user) => {
    if (user) {
        const dbRef = `Food-Seller/${user.uid}`
        const storageRef = `Restaurant/${user.uid}`
        getResData(dbRef)
        getFoodData(dbRef)
        editResBtn.addEventListener('click', () => {
            changeToEditState()
        })
        addResBtn.addEventListener("click", () => {
            uploadResImg(storageRef, dbRef)
        })
        addFoodBtn.addEventListener("click", () => {
            resetFoodDiv()
            uploadFoodImg(storageRef, dbRef)
        })
    }
    else {
        window.location = "./index.html"
    }
});

function changeToEditState() {
    resFileName.style.display = "unset";
    editResBtn.style.display = "none";
    addResBtn.style.display = "unset";
    resInputs.forEach(input => {
        input.style.pointerEvents = "unset"
        input.style.borderBottom = "2px dotted #ffffff"
    })
    resImgFile.addEventListener('change', () => {
        resFileName.style.display = "unset"
        resFileName.textContent = resImgFile.files[0].name
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
        resFileName.style.display = "none"
        editResBtn.style.display = "unset";
        addResBtn.style.display = "none";
        resInputs.forEach(input => {
            input.style.pointerEvents = "none"
            input.style.borderBottom = "none"
        })
        // resImgFile.removeEventListener('click',() => {
        //     const resFileName = document.querySelector('#res-file-name')
        //     resFileName.style.display = "none"
        // })
    }, err => {
        console.log(err);
    }, () => {
        uploadResImage.snapshot.ref.getDownloadURL().then(url => {
            addResDet(dbRef, url)
        })
    })
}

function addResDet(dbref, url) {
    database.ref(`${dbref}/Res-det`).set({
        Res_name: resName.value,
        Res_location: resLocation.value,
        Res_pin: resPincode.value,
        Res_badge: resBadge.value,
        Res_type: resType.value,
        Res_url: url
    })
}

function getResData(dbRef) {
    database.ref(`${dbRef}/Res-det`).on('value', snapshot => {
        const data = snapshot.val()
        console.log(data)
        updateResCard(data)
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

//Add Food Details in DB
function addFoodDet(dbRef, url) {
    database.ref(`${dbRef}/Foods/${foodName.value}`).set({
        Food_name: foodName.value,
        Food_type: foodType.value,
        Food_price: foodPrice.value,
        Food_total_qty: foodTotalQty.value,
        Food_photo_url: url
    })
}

//Upload Food Image in storage
function uploadFoodImg(storageRef, dbRef) {
    let uploadFoodImage = storage.ref(`${storageRef}/Food-imgs`)
        .child(foodName.value).put(foodImage.files[0])
    uploadFoodImage.on('state_changed', snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setTimeout(() => {
            loadingPerCheck(progress)
        }, 1000)
    }, err => {
        console.log(err);
    }, () => {
        uploadFoodImage.snapshot.ref.getDownloadURL().then(url => {
            addFoodDet(dbRef, url)
        })
    })
}

//Loading animation during storage upload
function loadingPerCheck(progress) {
    const main = document.querySelector('main')
    const coverPhoto = document.querySelector('#res-cover-photo')
    const loadingIcon = document.querySelector('aside > img')
    if (progress < 100) {
        main.style.display = "none"
        coverPhoto.style.display = "none"
        loadingIcon.style.display = "unset"
        loadingIcon.style.animation = " rotate 3s infinite linear";
    }
    else {
        main.style.display = "unset"
        coverPhoto.style.display = "unset"
        loadingIcon.style.display = "none"
        loadingIcon.style.animation = "unset"
    }
}
//Reset Food Cardsd
function resetFoodDiv() {
    const foodCardSection = document.querySelector('#food-cards-container')
    foodCardSection.innerHTML = ''
}

// Get Food Item Data
function getFoodData(dbRef) {
    database.ref(dbRef).on('value', snapshot => {
        const data = snapshot.val().Foods
        let foodItems = Object.keys(data);
        createCard(data, foodItems)
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
        foodImgTag.setAttribute('src', foodPhotoUrl)
    })
}

