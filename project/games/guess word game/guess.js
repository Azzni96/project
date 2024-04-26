// Setting Game Name
let gameName = "Guess The word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created by Nihad web school`;

// Setting Game Options
let numbersOfTries = 6;
let numbersOfLetters = 6;
let currentTry = 1;

function generateInput(){
    const inputsContainer = document.querySelector(".inputs");
    for (let i =1; i <= numbersOfTries; i++){
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`)
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if (i !== 1) tryDiv.classList.add("disabled-inputs");

        for (let j = 1; j <= numbersOfLetters;j++){
            const input = document.createElement("input")
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1")
            tryDiv.appendChild(input)
        }
        inputsContainer.appendChild(tryDiv);
    }
    inputsContainer.children[0].children[1].focus();
}

window.onload = function (){
    generateInput();
}