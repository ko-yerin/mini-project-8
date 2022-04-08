console.log('슬라이드js')
let imageIndex = 0;
let position = 0;
const IMAGE_WIDTH = 600;
const nextBtn = document.querySelector('.btn1')
const preBtn = document.querySelector('.btn2')
const imgWrap = document.querySelector('#slide')

function prev(){
    if(imageIndex > 0){
        nextBtn.removeAttribute("disabled")
        position += IMAGE_WIDTH;
        imgWrap.style.transform = `translateX(${position}px)`;
        imageIndex = imageIndex -1;
    }
    if(imageIndex == 0){
        preBtn.setAttribute('disabled','true')
    }
}
function next(){
    if(imageIndex < 3){
        preBtn.removeAttribute("disabled")
        position -= IMAGE_WIDTH;
        imgWrap.style.transform = `translateX(${position}px)`;
        imageIndex = imageIndex +1;
    }
    if(imageIndex == 3){
        nextBtn.setAttribute('disabled','true')
    }
}

function init(){
    preBtn.setAttribute('disabled','true')
    preBtn.addEventListener("click",prev)
    nextBtn.addEventListener("click",next)
}

init();