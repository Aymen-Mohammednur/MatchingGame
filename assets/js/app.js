const addBtn = document.querySelector("#add");
addBtn.addEventListener('click',addUser);
// genrate list as the user inputs
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

document.addEventListener('DOMContentLoaded', () => {
    let request = indexedDB.open('MatchingGame', 1);

    request.onupgradeneeded = e => {
        let db = e.target.result;
        var objectStore;
        if (!db.objectStoreNames.contains('MatchingGame')) {
            objectStore = db.createObjectStore('GameDatabase', {keyPath: "user"});

            objectStore.createIndex('user', 'user', {unique: true});
            objectStore.createIndex('level', 'level', {unique: false});
            objectStore.createIndex('cummulativeTime', 'cummulativeTime', {unique: false});

            console.log("Database created!");
        }
        else {
            console.log("Database already exists.")
        }      
    }

    request.onsuccess = e => {
        DB = request.result;
        console.log("Success")
    }

    request.onerror = e => {
        console.log('There was an error');
    }


    function addUser(name) {

        let transaction = db.transaction('GameDatabase', 'readwrite');
        let objectStore = transaction.objectStore('MatchingGame');

        let request = objectStore.add(name);

        request.oncomplete = () => {
            console.log("New user added");
        }
        request.onerror = () => {
            console.log("There was an error")
        }

    }

    function removeUser(name) {

        let transaction = DB.transaction('MatchingGame', 'readwrite');
        let objectStore = transaction.objectStore('MatchingGame');

        objectStore.delete('name');

    }

    function getUsers() {

        let transaction = DB.transaction('MatchingGame', 'readwrite');
        let objectStore = transaction.objectStore('MatchingGame');

    }

    function getLevel() {

        let transaction = DB.transaction('MatchingGame', 'readwrite');
        let objectStore = transaction.objectStore('MatchingGame');

    }

    function getTimer() {

        let transaction = DB.transaction('MatchingGame', 'readwrite');
        let objectStore = transaction.objectStore('MatchingGame');

    }

    function updateProgress() {

        let transaction = DB.transaction('MatchingGame', 'readwrite');
        let objectStore = transaction.objectStore('MatchingGame');

    }
});

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