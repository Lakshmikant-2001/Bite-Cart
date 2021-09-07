
const hamBtn =  document.querySelector('.ham-div');
const closeBtn = document.querySelector('.close-btn');
const  sideNav = document.querySelector('.side-navbar');
const main = document.querySelector('main');

closeBtn.onclick = () =>{
    sideNav.style.display="none";
    hamBtn.style.display="unset";
    main.style.marginLeft="90px";
}

hamBtn.onclick = () =>{
    sideNav.style.display="unset";
    hamBtn.style.display="none"
    main.style.marginLeft="300px";
}