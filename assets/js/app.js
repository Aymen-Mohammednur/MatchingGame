function addImg(inpArray){
	for (var obj of inpArray){
		var v = obj.value;
		var k = obj.kind;
		var cardPair = document.querySelectorAll(`.${k}`);
		cardPair.forEach(function(card){card.innerHTML = `<img src = ${v}></img>`;});
	}
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
            objectStore = db.createObjectStore('MatchingGame', {keyPath: "user"});

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

        let transaction = DB.transaction('MatchingGame', 'readwrite');
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