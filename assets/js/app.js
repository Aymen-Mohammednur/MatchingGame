const addBtn = document.querySelector("#add");
addBtn.addEventListener('click',addUser);
// genrate list as the user inputs
var openedCards = new Array();
function addUser(){
    var txt = document.getElementById('newUser');
    //var txtValue = txt.value;
    if(txt.value===""){
        txt.style.borderColor = "red";
    return;
    }
    var ulNode = document.getElementById('list');
    var liNode = document.createElement("li");
    liNode.className = "list-group-item"
    var txtNode = document.createTextNode(txt.value);

    liNode.appendChild(txtNode);
    ulNode.appendChild(liNode);
    txt.value = "";
}
function addImg(inpArray){
    var cards=[];
    const matches = document.querySelectorAll("card");
    matches.forEach(function(m){cards.push(m);});


    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
    cards = shuffle(cards);
    var l = cards.length/2;
    for (var i = 0; i < l; i++){
        var c1 = cards.shift();
        var c2 = cards.shift();
        c1.innerHTML = `<img src = ${inpArray[i].value}></img>`;
        c1.parentNode.kind = inpArray[i].kind;

        c2.innerHTML = `<img src = ${inpArray[i].value}></img>`;
        c2.parentNode.kind = inpArray[i].kind;

    }
 //    for document.querySelector(".deck").childNodes
    // for (var obj of inpArray){
    //  var v = obj.value;
    //  var k = obj.kind;
    //  var cardPair = document.querySelectorAll(`.${k}`);
    //  cardPair.forEach(function(card){card.innerHTML = `<img src = ${v}></img>`;});
    // }
}

//shuffle array
function shuffle(arr) {
    var currentIndex = array.length, temp, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temp = array[currentIndex];
      arr[currentIndex] = array[randomIndex];
      arr[randomIndex] = temp;
    }
  
    return arr;
}

//Uncomment the code below to see how it working.

// function demo(){
// 	class dict{
// 		constructor(v,k){
// 			this.value = v;
// 			this.kind = k;
// 		}
// 	}
// 	var ob1 = new dict("assets/img/sun.png", "red");
// 	var ob2 = new dict("assets/img/sun2.png", "blue");
// 	var obArray = [ob1, ob2];
// 	addImg(obArray);
// }
// demo();


// IndexDB
let DB;

// Creating the database
window.onload = () => {
        let gameDB = indexedDB.open('GameDatabase', 1);
          
        gameDB.onupgradeneeded = e => {
            let db =  e.target.result;
            if (!db.objectStoreNames.contains("MatchingGame")) {
                let objectStore = db.createObjectStore("MatchingGame", {keyPath: "user"});
    
                objectStore.createIndex('user', 'user', {unique: true});
                objectStore.createIndex('level', 'level', {unique: false});
                objectStore.createIndex('cummulativeTime', 'cummulativeTime', {unique: false});
    
                console.log("Database created!");
            }
            else {
                console.log("Database already exists.")
            }      
        }
    
        gameDB.onsuccess = e => {
            console.log("Success");
            DB = gameDB.result;
        }
    
        gameDB.onerror = e => {
            console.log('There was an error');
        }
};

// Adding users to the database
function addUser(name) {
    const newUser = {
        user: name
    }

    let transaction = DB.transaction("MatchingGame", "readwrite");
    transaction.onerror = e => alert(`Error ${e.target.error}`);
    let objectStore = transaction.objectStore("MatchingGame");

    let request = objectStore.add(newUser);

    request.oncomplete = () => {
        console.log("New user added");
    }
    request.onerror = () => {
        console.log("There was an error")
    }

}

// Removing a user from the database
function removeUser(name) {

    let transaction = DB.transaction('MatchingGame', 'readwrite');
    let objectStore = transaction.objectStore('MatchingGame');

    objectStore.delete(name);

}

// Listing all the users
function getUsers() {

    let transaction = DB.transaction('MatchingGame', 'readonly');
    let objectStore = transaction.objectStore('MatchingGame');
    let request = objectStore.openCursor();

    request.onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
            console.log(cursor.key);
            cursor.continue();
        }
    }

    request.onerror = () => {
        console.log("There was an error");
    }

}

// Showing the level a user is on
function getLevel(user) {

    let transaction = DB.transaction('MatchingGame', 'readonly');
    let objectStore = transaction.objectStore('MatchingGame');
    let request = objectStore.openCursor();

    request.onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
            if (cursor.key != user) {
                cursor.continue();
            }
            else {
                console.log(cursor.value.level);
            }
        }
    }

    request.onerror = () => {
        console.log("There was an error");
    }

}

// Shpwing the time it took a user to finish the game
function getTime(user) {

    let transaction = DB.transaction('MatchingGame', 'readonly');
    let objectStore = transaction.objectStore('MatchingGame');
    let request = objectStore.openCursor();

    request.onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
            if (cursor.key != user) {
                cursor.continue();
            }
            else {
                console.log(cursor.value.cummulativeTime);
            }
        }
    }

    request.onerror = () => {
        console.log("There was an error");
    }

}

// Updating the database with new levels and time
function updateProgress(user, level, cummulativeTime) {
    let updated = {
        user: user,
        level: level,
        cummulativeTime: cummulativeTime
    }

    let transaction = DB.transaction('MatchingGame', 'readwrite');
    let objectStore = transaction.objectStore('MatchingGame');

    let request = objectStore.openCursor();

    request.onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
            if (cursor.key == user) {
                var upd = objectStore.put(updated);
                upd.onsuccess = function (e) {
                    console.log("Update Success");
                }
                upd.onerror = function (e) {
                    console.log("Update Failed");
                }
            }
            cursor.continue();
        }
    }

}

// unMatch
function unMatch() {
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();

    setInterval( () => {
        openedCards[0].classList.remove("unmatched", "show", "open");
        openedCards[0].classList.remove("unmatched", "show", "open");
    },1000);

    var card1 = openedCards.pop();
    var card2 = openedCards.pop();
    openedCards = Array();
    enable();
}

// startTimer
var interval; // globalVariable
var time; // document.getElementById("Our Class")

function startTimer() {
    var sec = 0, min = 0;
    interval = setInterval( () => {
        let timeSec = sec;
        let timeMin = min;
        time.innerText = timeMin + " : " + timeSec;
        sec++;
        if (sec == 60) {
            min++;
            sec = 0;
        }
    }, 1000)
}

function openedCard(e){
    if (openedCards.length == 2){
        check();
    }else{
        openedCards.push(e);
    }
    
}
function enable(){
    var unmatched = document.querySelectorAll('.unmatched');
    unmatched.forEach(() => {
        if (document.querySelector('.disabled')){
            document.querySelector('.disabled').classList.remove("disabled");
        }else{
            continue;
        }
    });
}
const reload = document.querySelector('.col-3');
reload.addEventListener('click',quit);
function quit(){
    location.reload;
    window.location.href("index.html");
}