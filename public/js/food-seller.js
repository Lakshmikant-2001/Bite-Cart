import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);

const database = firebase.database()
const auth = firebase.auth()
const storage = firebase.storage()

// const resName = document.querySelector('#res-name')
// const resType = document.querySelector('#res-type') 
// const resLocation = document.querySelector('#res-location') 
// const resPincode = document.querySelector('#res-pincode') 
// const resImage = document.querySelector('#res-img') 
// const addResBtn = document.querySelector('#add-res-btn') 
const foodName = document.querySelector('#food-name') 
const foodType = document.querySelector('#food-type') 
const foodPrice = document.querySelector('#food-price') 
const foodTotalQty = document.querySelector('#food-total-quantity') 
const foodImage = document.querySelector('#food-img') 
const addFoodBtn = document.querySelector('#add-food-btn') 

auth.onAuthStateChanged((user) => {
    if (user) {
        const dbref = `Food-Seller/${user.uid}`
        const storageRef = `Restaurant/${user.uid}`
        addFoodBtn.addEventListener("click",()=>{
            addFoodDet(dbref)
            uploadFoodImg(storageRef)
            createCard()
        })
    }
    else {
        window.location = "./index.html"
    }
});

function addFoodDet(dbref){
    database.ref(`${dbref}/Foods/${foodName.value}`).set({
        Food_name: foodName.value,
        Food_type: foodType.value,
        Food_price:foodPrice.value,
        Food_total_qty:foodTotalQty.value
    })

}

function uploadFoodImg(storageRef) {
    storage.ref(`${storageRef}/Food-imgs`)
    .child(foodName.value).put(foodImage.files[0]).then(res => {
    }).catch(e => {
        console.log(e)
    })
}

function createCard(){
    const foodCardSection = document.querySelector('#food-cards-container')
    foodCardSection.innerHTML += `
    <div class="food-card">
        <img src="" alt="" class="food-type-logo" >
        <img src="" alt="" class="food-image">
        <div class="card-footer">
            <div>
                <h4 class="food-name"></h4>
                <p class="food-price">$</p>
             </div>
            <div class="add-btn">
                <p>Oty:</p>
            </div>
        </div>
    </div>`

    const name = document.querySelector('.food-name')
    const type = document.querySelector('.food-type-logo')
    const price = document.querySelector('.food-price')
    const quantity = document.querySelector('.add-btn')
    const image = document.querySelector('.food-image')

    if(foodType.value == "veg"){
        type.setAttribute('src', `./assets/veg-icon.png`)
    }
    else{
        type.setAttribute('src', `./assets/non-veg-icon.png`)
    }
    name.textContent = foodName.value
    price.textContent = foodPrice.value + " $"
    quantity.textContent = "Qty: " + foodTotalQty.value 
    const url = URL.createObjectURL(foodImage.files[0]);
    image.setAttribute('src', url)
}
