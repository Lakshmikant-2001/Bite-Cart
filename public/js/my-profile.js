import { firebaseConfig } from "./firebase-modules.js"
firebase.initializeApp(firebaseConfig);
const uploadImageBtn=document.querySelector('#upload-image')
uploadImageBtn.addEventListener('click',uploadImage)
function uploadImage(){
    let uploadPhoto=document.querySelector("#user-photo-up").files[0]
    firebase.storage().ref('Images').child(uploadPhoto.name).put(uploadPhoto).then(res => {
        console.log("success")
    }).catch(e=>{
   console.log(e)
    })

}
uploadImageBtn.addEventListener('click',uploadImage)


