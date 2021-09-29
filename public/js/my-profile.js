const auth = firebase.auth()
const storage = firebase.storage()
const uploadImageBtn = document.querySelector('#upload-image-btn')
const userPhoto = document.querySelector('#user-photo')

auth.onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid
        uploadImageBtn.addEventListener('click', () => {
            uploadImage(userId);
        });
    }
    else {
        window.location = "./index.html"
    }
});

function uploadImage(userId) {
    let uploadPhoto = document.querySelector("#user-photo-up").files[0];
    const uploadPhotoStorage = storage.ref('user/profilePicture/' + userId)
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