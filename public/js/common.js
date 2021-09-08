
const hamBtn =  document.querySelector('.ham-expand-div');
const closeBtn = document.querySelector('.ham-contract-div');
const  sideNav = document.querySelector('.side-navbar');
const main = document.querySelector('.main');

closeBtn.onclick = () =>{
    sideNav.style.transform="translateX(-100%)";
    hamBtn.style.transform="scale(1)";
    main.style.transform="translateX(-200px)";
    hamBtn.style.transition="transform .75s ease-in-out"
}

hamBtn.onclick = () =>{
    sideNav.style.transform="translateX(0)";
    hamBtn.style.transform="scale(0)";
    main.style.transform="translateX(0)";
    hamBtn.style.transition="transform .1s ease-in-out";
}