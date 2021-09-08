
const hamBtn =  document.querySelector('.ham-expand-div');
const closeBtn = document.querySelector('.ham-contract-div');
const  sideNav = document.querySelector('.side-navbar');
const main = document.querySelector('.main');

closeBtn.onclick = () =>{
    sideNav.style.transform="translateY(-100%)";
    hamBtn.style.transform="scale(1)";
    main.style.transform="translateX(-200px)";
    main.style.transition="transform .75s ease-in-out";
    hamBtn.style.transition="transform .75s ease-in-out"
}

hamBtn.onclick = () =>{
    sideNav.style.transform="translateY(0)";
    hamBtn.style.transform="scale(0)";
    main.style.transform="translateX(0)";
    hamBtn.style.transition="transform .2s ease-in-out";
}