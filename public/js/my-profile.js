const auth = firebase.auth()
const storage = firebase.storage()
const uploadImageBtn = document.querySelector('#upload-image-btn')
const userPhoto = document.querySelector('#user-photo')

auth.onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid
        const uploadPhotoStorage = storage.ref('user/profilePicture/' + userId)
        getUploadedUrl(uploadPhotoStorage)
        uploadImageBtn.addEventListener('click', () => {
            uploadImage(uploadPhotoStorage);
        });
    }
    else {
        window.location = "./index.html"
    }
});

function uploadImage(uploadPhotoStorage) {
    let uploadPhoto = document.querySelector("#user-photo-input").files[0];
    uploadPhotoStorage.put(uploadPhoto).then(res => {
        getUploadedUrl(uploadPhotoStorage)
    }).catch(e => {
        console.log(e)
    })
}

function getUploadedUrl(uploadPhotoStorage) {
    uploadPhotoStorage.getDownloadURL().then((url) => {
        const imageUrl = url;
        updateImage(imageUrl)
    }).catch(e => {
        console.log(e)
    })
}

function updateImage(url) {
    userPhoto.setAttribute('src', url)
}