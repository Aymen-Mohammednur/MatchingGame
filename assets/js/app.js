var level1 = [
  {value: '<i class="fas fa-camera">', kind: 'camera'},
  {value: '<i class="fas fa-balance-scale-left">', kind: 'scale'},
  {value: '<i class="fas fa-bed"></i>', kind: 'bed'},
  {value: '<i class="fas fa-ambulance">', kind: 'ambulance'},
  {value: '<i class="fas fa-ambulance">', kind: 'ambulance'},
  {value: '<i class="fas fa-balance-scale-left">', kind: 'scale'},
  {value: '<i class="fas fa-bed"></i>', kind: 'bed'},
  {value: '<i class="fas fa-camera">', kind: 'camera'},
  {value: '<i class="fas fa-handshake-o">', kind: 'handshake'},
  {value: '<i class="fas fa-shower">', kind: 'shower'},
  {value: '<i class="fas fa-snowflake-o">', kind: 'snowflake'},
  {value: '<i class="fas fa-bell">', kind: 'bell'},
  {value: '<i class="fas fa-handshake-o">', kind: 'handshake'},
  {value: '<i class="fas fa-shower">', kind: 'shower'},
  {value: '<i class="fas fa-snowflake-o">', kind: 'snowflake'},
  {value: '<i class="fas fa-bell">', kind: 'bell'},
]

const addBtn = document.querySelector('#add')
var interval // globalVariable
var time = document.querySelector('.time')
var cover = document.querySelector('.cover')

// addBtn.addEventListener('click',addUser);
// genrate list as the user inputs
var openedCards = new Array()

function addUser() {
  var txt = document.getElementById('newUser')
  //var txtValue = txt.value;
  if (txt.value === '') {
    txt.style.borderColor = 'red'
    return
  }
  var ulNode = document.getElementById('list')
  var liNode = document.createElement('li')
  liNode.className = 'list-group-item'
  var txtNode = document.createTextNode(txt.value)

  liNode.appendChild(txtNode)
  ulNode.appendChild(liNode)
  txt.value = ''
}
function getKind(element) {
  console.log(element)
  const kind = element.getAttribute('kind')
  console.log(kind)
  return kind
}
//checks for duplicates. Accepts NodeList or normal list of Node Elements and compares kinds to find duplicates.
function check() {
  if (getKind(openedCards[0]) === getKind(openedCards[1])) {
    match()
  } else {
    unmatch()
  }
}

function disable() {
  cover.classList.add('disable')
}

function match() {
  openedCards.forEach(e => {
    e.classList.add('solved')
    e.classList.remove('covered')
    e.setAttribute('disabled', true)
  })
  openedCards.pop()
  openedCards.pop()
}

//Add populate cards
function addImg(inpArray) {
  const cards = document.querySelectorAll('.col')

  for (var i = 0; i < inpArray.length; i++) {
    cards[i].innerHTML = inpArray[i].value
    cards[i].setAttribute('kind', inpArray[i].kind)
  }
}

//shuffle array
function shuffle(arr) {
  var currentIndex = arr.length,
    temp,
    randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temp = arr[currentIndex]
    arr[currentIndex] = arr[randomIndex]
    arr[randomIndex] = temp
  }

  return arr
}

// IndexDB
let DB

// Creating the database
function initializeDB() {
  return new Promise((resolve, reject)=>{
    let gameDB = indexedDB.open('GameDatabase', 1)

    gameDB.onupgradeneeded = e => {
      let db = e.target.result
      if (!db.objectStoreNames.contains('MatchingGame')) {
        let objectStore = db.createObjectStore('MatchingGame', {keyPath: 'user'})
  
        objectStore.createIndex('user', 'user', {unique: true})
        objectStore.createIndex('level', 'level', {unique: false})
        objectStore.createIndex('cummulativeTime', 'cummulativeTime', {
          unique: false,
        })
  
        console.log('Database created!')
      } else {
        console.log('Database already exists.')
      }
    }
  
    gameDB.onsuccess = e => {
      console.log('Success')
      DB = gameDB.result
      resolve();
    }
  
    gameDB.onerror = e => {
      console.log('There was an error')
      reject();
    }
  })
  
}

// Adding users to the database
function addUser(name) {
  const newUser = {
    user: name,
  }

  let transaction = DB.transaction('MatchingGame', 'readwrite')
  transaction.onerror = e => alert(`Error ${e.target.error}`)
  let objectStore = transaction.objectStore('MatchingGame')

  let request = objectStore.add(newUser)

  request.oncomplete = () => {
    console.log('New user added')
  }
  request.onerror = () => {
    console.log('There was an error')
  }
}

// Removing a user from the database
function removeUser(name) {
  let transaction = DB.transaction('MatchingGame', 'readwrite')
  let objectStore = transaction.objectStore('MatchingGame')

  objectStore.delete(name)
}

// Listing all the users
function getUsers() {
  return new Promise((resolve, reject)=>{
    let transaction = DB.transaction('MatchingGame', 'readonly')
    let objectStore = transaction.objectStore('MatchingGame')
    let request = objectStore.openCursor()
    let result = [];

    request.onsuccess = e => {
      let cursor = e.target.result
      if (cursor) {
        result.push(cursor.key);
        cursor.continue();
      }else{
        resolve(result);
      }
    }

    request.onerror = () => {
      console.log('There was an error')
  }
  })
  
}

// Showing the level a user is on
function getLevel(user) {
  return new Promise((resolve, reject)=>{
    let transaction = DB.transaction(['MatchingGame'], 'readonly')
    let objectStore = transaction.objectStore('MatchingGame')
    let request = objectStore.get(user);

    request.onsuccess = e => {
      resolve(request.result);
    }

    request.onerror = () => {
      reject();
      console.log('There was an error')
  }
  })
  
}

// Shpwing the time it took a user to finish the game
function getTime(user) {
  let transaction = DB.transaction('MatchingGame', 'readonly')
  let objectStore = transaction.objectStore('MatchingGame')
  let request = objectStore.openCursor()

  request.onsuccess = e => {
    let cursor = e.target.result
    if (cursor) {
      if (cursor.key != user) {
        cursor.continue()
      } else {
        return cursor.value.cummulativeTime
      }
    }
  }

  request.onerror = () => {
    console.log('There was an error')
  }
}

function setLevel(user, level) {
  let transaction = DB.transaction('MatchingGame', 'readwrite')
  let objectStore = transaction.objectStore('MatchingGame')

  let request = objectStore.openCursor()

  request.onsuccess = e => {
    let cursor = e.target.result
    if (cursor) {
      if (cursor.key != user) {
        cursor.continue()
      } else {
        cursor.value.level = level
      }
    }
  }
}

// Updating the database with new levels and time
function updateProgress(user, level, cummulativeTime) {
  let updated = {
    user: user,
    level: level,
    cummulativeTime: cummulativeTime,
  }

  let transaction = DB.transaction('MatchingGame', 'readwrite')
  let objectStore = transaction.objectStore('MatchingGame')

  let request = objectStore.openCursor()

  request.onsuccess = e => {
    let cursor = e.target.result
    if (cursor) {
      if (cursor.key === user) {
        var upd = objectStore.put(updated)
        upd.onsuccess = function (e) {
          console.log('Update Success')
        }
        upd.onerror = function (e) {
          console.log('Update Failed')
        }
      }
      cursor.continue()
    }
  }
}

function next(currentUser) {
  if (getLevel(currentUser) != 3) {
    updateProgress(
      currentUser,
      setLevel(currentUser, getLevel(currentUser) + 1),
      time.innerText,
    )
    window.open(`level${getLevel(currentUser) - 1}.html`)
  }
}

// unMatch
function unmatch() {
  const [cardOne, cardTwo] = openedCards
  cardOne.classList.add('unmatched')
  cardTwo.classList.add('unmatched')
  disable()

  setTimeout(() => {
    console.log(openedCards)
    cardOne.classList.remove('unmatched', 'show', 'open')
    cardTwo.classList.remove('unmatched', 'show', 'open')
    cardOne.classList.add('covered')
    cardTwo.classList.add('covered')
    openedCards = new Array()
    enable()
  }, 1000)
}

// startTimer
function startTimer() {
  var sec = 0,
    min = 0
  interval = setInterval(() => {
    let timeSec = sec
    let timeMin = min
    time.textContent = timeMin + ' : ' + timeSec
    sec++
    if (sec === 60) {
      min++
      sec = 0
    }
  }, 1000)
}

function openedCard(e) {
  if (e.target.getAttribute('disabled')) {
    return
  }
  openedCards.push(e.target)
  if (openedCards.length === 2) {
    check(e.target)
  }
}
function enable() {
  cover.classList.remove('disable')
}
const reload = document.querySelector('.col-3')
reload.addEventListener('click', quit)
function quit() {
  location.reload
  window.location.href('index.html')
}

function displayCard(e) {
  e.target.classList.add('show')
  e.target.classList.add('open')
  e.target.classList.remove('covered')
}

function addEventListenerToButtons() {
  document.querySelectorAll('.col').forEach(e => {
    e.addEventListener('click', openedCard, false)
    e.addEventListener('click', congruatulation, false)
    e.addEventListener('click', displayCard, false)
  })
}

function congruatulation() {
  if (document.querySelectorAll('.solved').length === level1.length) {
    interval = undefined
    console.log('All are solved')
    document.querySelector('#myModal').style.display = 'block'
  }
  // TODO: end time, save score
}

;(function start() {
  // shuffle(level1)
  addImg(level1)
  startTimer()
  addEventListenerToButtons()
  console.log('start game')
})()

window.on
