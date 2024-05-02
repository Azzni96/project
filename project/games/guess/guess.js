// setting Game Name
let guessName = "Guess the game"
document.title= guessName
document.querySelector('h1').innerHTML = guessName
document.querySelector('footer').innerHTML = `${guessName} Game created by Nihad`

// setting Game options
let numbersOfTries = 6;
let numbersOfLetters = 6;
let currentTry = 1;

function generateInput(){
    const inputsContainer = document.querySelector(".inputs")

    for (let i = 1; i <= numbersOfTries; i++){
        const tryDiv = document.createElement("div")
        tryDiv.classList.add(`try-${i}`)
        tryDiv.innerHTML = `<span> Try ${i}</span>`

        inputsContainer.appendChild(tryDiv)
    }
}

window.onload = function (){
    generateInput()
}