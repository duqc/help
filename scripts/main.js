function explosionmain() {
    playsound('assets/explosion1.mp3')
    
}   


async function playsound(sound){
    var audio = new Audio(sound);
    audio.play();
}

let okbutton = document.getElementById("Ok button")
okbutton.addEventListener("click", explosionmain)


const text = document.querySelector('.text')
text.innerHTML = text.textContent.replace(/\S/g, "<span>$&</span>")

const element = document.querySelectorAll('.text span');
for (let i = 0; i < element.length; i++) {
    element[i].style.animationDelay = -i * 0.33 + 's';
} 