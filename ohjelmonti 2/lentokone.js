'use strict';
document.addEventListener('DOMContentLoaded', function() {
    let Play = "Play";
    document.querySelector(".get_play button").innerHTML = Play;

    document.getElementById('play').addEventListener('click', function() {
        window.location.href = 'play.html';
    });

});

document.addEventListener('DOMContentLoaded', function() {
    let start = "start game";
    document.querySelector(".get_start button").innerHTML = start;

    document.getElementById('Starting').addEventListener('click', function() {
        window.location.href = 'play_rules.html';
    });
});

async function airport(){
    try {
        const airport = await fetch('http://127.0.0.1:3000/airport');
        const jsonairport = await airport.json();
        AirportBox(jsonairport);
    } catch (error){
        console.log(error.message)
    } finally {
        console.log('DONE')
    }
}
function AirportBox(jsonairport){
    let HtmlBox = '<select>';
    for (let i = 0; i < jsonairport.length; i++){
        let airport = jsonairport[i];
        HtmlBox = HtmlBox + '<option>' + airport + '</option>'
    }
    HtmlBox = HtmlBox + '</select>';
    document.getElementById('airport').innerHTML = HtmlBox;
}
function CountryBox(jsoncountry){
    let HtmlList = '<ul>';
    for(let i = 0; i < jsoncountry.length; i++){
        let name = jsoncountry[i];
        HtmlList = HtmlList + '<li>' + name + '</li>'
    }
    HtmlList = HtmlList + '</ul>'
    document.getElementById('name').innerHTML = HtmlList
}
function QuestionBox(jsonquestion){
    let HtmlList = '<ul>';
    for(let i = 0; i < jsonquestion.length; i++){
        let name = jsonquestion[i];
        HtmlList = HtmlList + '<li>' + name + '</li>'
    }
    HtmlList = HtmlList + '</ul>'
    document.getElementById('Q').innerHTML = HtmlList
}

function ChoicesBox(jsonchoices){
    let HtmlList = '<ul>';
    for(let i = 0; i < jsonchoices.length; i++){
        let name = jsonchoices[i];
        HtmlList = HtmlList + '<li>' + name + '</li>'
    }
    HtmlList = HtmlList + '</ul>'
    document.getElementById('A').innerHTML = HtmlList
}


document.addEventListener('DOMContentLoaded', function(){
async function haeNappi(){
  console.log('hae nappi toimii');

  let HtmlBox = document.getElementById('airport');
  let maat = HtmlBox.options[HtmlBox.selectedIndex].text;

  try {

    const country = await fetch('http://127.0.0.1:3000/country/' + maat);
    const question = await fetch('http://127.0.0.1:3000/question/' + maat );
    const choices = await fetch('http://127.0.0.1:3000/choices/' + maat );
    const jsonchoices = await choices.json()
    const jsoncountry = await country.json();
    const jsonquestion = await question.json();
    updateMap()
    ChoicesBox(jsonchoices)
    CountryBox(jsoncountry);
    QuestionBox(jsonquestion)

  } catch (error) {
    console.log(error.message);
  } finally {
    console.log('asynchronous load complete');
  }
}

airport();
document.querySelector('#hae').addEventListener('click', haeNappi);})
document.addEventListener('DOMContentLoaded', function(){
function Namelist(names){
    let html = '';
    for (let i = 0; i < names.length; i++){
        let Name = names[i]
        html = html + '<li>' + Name + '</li>'
    }
    document.getElementById('login_name').innerHTML = html
}
function singin_account(name){
    let Html = ''
    Html = Html + '<li>' + name + '</li>';
    document.getElementById('login_name').innerHTML = Html
}
function Iso_country(jsoniso_country){
    let Html = ''
    Html = Html + '<li>' + jsoniso_country + '</li>'
    document.getElementById('iso_country').innerHTML = Html
}

function Budget(jsonbudget){
    let Html = '<ul>'
    Html = Html + '<li>' + jsonbudget + '</li>'
    Html = Html + '</ul>'
    document.getElementById('budget').innerHTML = Html
}
function Consumed(jsonconsumed){
    let Html = '<ul>'
    Html = Html + '<li>' + jsonconsumed + '</li>'
    Html = Html + '</ul>'
    document.getElementById('consumed').innerHTML = Html
}
function Location(jsonlocation){
    let Html = '<ul>'
    Html = Html + '<li>' + jsonlocation + '</li>'
    Html = Html + '</ul>'
    document.getElementById('location').innerHTML = Html
}

async function login_button(){
    console.log('hae nappi toimi');
    let signin = document.getElementById('signin');
    let name = signin.value.trim()
    if (name !== ""){
        try{
            let old_account = await fetch('http://127.0.0.1:3000/login_names/' + name)
            if (old_account.status === 200) {
                let names = await old_account.json()
                if (names.length === 0) {
                    let new_account = await fetch('http://127.0.0.1:3000/createaccount/' + name)
                    let names = await new_account.json()
                    singin_account(names)
                } else {
                    Namelist(names)
                }
            } else {
                console.log('Error fetching data');
            }
        }catch (error){
            console.log(error.message)
        } finally {
            console.log('asynchronous load complete')
        } if (name){
            try {
                let json_budget = await fetch(`http://127.0.0.1:3000/get_budget/${name}`)
                let json_consumed = await fetch(`http://127.0.0.1:3000/get_consumed/${name}`)
                let json_location = await fetch(`http://127.0.0.1:3000/get_location/${name}`)
                let json_iso_country = await fetch(`http://127.0.0.1:3000/get_iso_country/${name}`)

                let iso_country = await json_iso_country.json()
                let location = await json_location.json()
                let consumed = await json_consumed.json()
                let budget = await json_budget.json()

                Iso_country(iso_country)
                Location(location)
                Budget(budget)
                Consumed(consumed)
            } catch (error){
                console.log(error.message);
            } finally {
                 console.log('asynchronous load complete');
            }
        }else {
            console.log('Player name is empty. Please enter a valid name.');
        }
    }
}
login_button()
document.querySelector('#Player_name').addEventListener('click', login_button)
})
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submitAnswer').addEventListener('click', checkCorrectAnswer);
    document.getElementById('submitBudget').addEventListener('click', function() {
        const html = document.getElementById('login_name');
        if (!html || html.selectedIndex === -1) {
            alert('No player selected.');
            return;
        }

        const playerName = html.getElementsByTagName("li");
        console.log("current player name ", playerName);// Get the text of the selected option
        updateBudget(playerName); // Pass the player name and amount to updateBudget
    });
});

async function checkCorrectAnswer() {
    const userInput = document.getElementById('C').value;
    const htmlBox = document.getElementById('airport');
    const currentQuestion = htmlBox.options[htmlBox.selectedIndex].text;

    try {
        const response = await fetch(`http://127.0.0.1:3000/True_choice/${currentQuestion}`);
        const correctAnswer = await response.json(); // Assuming the correct answer is in the response body directly

           const html = document.getElementById('login_name');
        if (!html || html.selectedIndex === -1) {
            alert('No player selected.');
            return;
        }

        const currentPlayerName = html.getElementsByTagName("li")[0].innerText;

        if (userInput == correctAnswer) {
            console.log(userInput)
            updateBudget(currentPlayerName); // Call updateBudget to adjust the user's budget
            alert('Correct answer!');
        } else {
            alert('Wrong answer. Try again!');
        }
    } catch (error) {
        console.error('Error fetching the correct answer:', error);
        alert('There was an error checking the answer. Please try again.');
    }
}

async function updateBudget(playerName) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/update_add_money_budget/${playerName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Budget update response:', data);
        alert('Budget updated successfully!');
    } catch (error) {
        console.error('Error updating budget:', error);
        alert('There was an error updating the budget. Please try again.');
    }
}



/*
function updateMap() {
    var select = document.getElementById('countrySelect');
    var selectedOption = select.options[select.selectedIndex].value;
    var mapIframe = document.getElementById('map');

    switch (selectedOption) {}
        case 'paris':
            mapIframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.4927092229856!2d2.2922926156749324!3d48.85883707928765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0xf07571621577277!2sEiffel%20Tower!5e0!3m2!1sen!2sfr!4v1590245174000";
            break;
        case 'berlin':
            mapIframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.422634645798!2d13.388859915708776!3d52.51703617981167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851b5b89bb905%3A0x4223c517012173e!2sBerlin%2C%20Germany!5e0!3m2!1sen!2sde!4v1590245211869";
            break;
        case 'madrid':
            mapIframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.9200191295765!2d-3.703790384602602!3d40.41677527936419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4228804b06443f%3A0xdcae7e8a8140303!2sMadrid%2C%20Spain!5e0!3m2!1sen!2sus!4v1590245239001";
            break;
    }
}

*/

// Alustetaan kartta
var map = L.map('map').setView([51.1657, 10.4515], 4); // تركيز الخريطة على أوروبا

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var markersLayer = new L.LayerGroup().addTo(map);

// فرضية عن وظيفة getQuestion التي تسترجع السؤال لكل دولة
/*function getQuestion(countryCode) {
    var questions = {
        'FI': 'ما هو العدد التقريبي للبحيرات في فنلندا؟',
        'SE': 'ما هو الحيوان الوطني للسويد؟',
        'IT': 'ما هي المدينة الأكثر زيارة في إيطاليا؟',
        'AT': 'ما هو الطبق الوطني للنمسا؟',
        // ... إضافة المزيد من الأسئلة لكل دولة
    };
    return questions[countryCode] || 'لا يوجد سؤال متاح';
}*/
// Funktio kartan päivittämiseen valituilla sijainneilla
function updateMap() {
    // Tyhjennetään olemassa olevat merkit
    markersLayer.clearLayers();

    locations.forEach(function(location) {
        var country = location[0];
        var latitude = location[1];
        var longitude = location[2];

        // var question = getQuestion(country);
         var marker = L.marker([latitude, longitude]).addTo(markersLayer);

        //marker.bindPopup(question);

        // عند النقر على الماركر، تركز الخريطة على هذا الماركر وتفتح النافذة المنبثقة
        marker.on('click', function () {
            map.setView([latitude, longitude], 6); // يمكنك تعديل مستوى التكبير حسب الحاجة
           //marker.openPopup();
        });
        if(country === sessionStorage.getItem('choiceBox'))
            map.setView([latitude, longitude], 6)
    });
}
// Kutsutaan funktiota alustamaan kartta valituilla koordinaateilla
updateMap();
