const iconsList = [
  "camera",
  "camera",
  "balance-scale",
  "balance-scale",
  "bed",
  "bed",
  "ambulance",
  "ambulance",
  "handshake",
  "handshake",
  "snowflake",
  "snowflake",
  "bell",
  "bell",
  "handshake",
  "handshake",
  "camera",
  "camera",
  "balance-scale",
  "balance-scale",
  "bed",
  "bed",
  "ambulance",
  "ambulance",
  "handshake",
  "handshake",
  "snowflake",
  "snowflake",
  "bell",
  "bell",
  "handshake",
  "handshake",
  "camera",
  "camera",
  "balance-scale",
  "balance-scale",
  "bed",
  "bed",
  "ambulance",
  "ambulance",
  "handshake",
  "handshake",
  "snowflake",
  "snowflake",
  "bell",
  "bell",
  "handshake",
  "handshake",
  "camera",
  "camera",
  "balance-scale",
  "balance-scale",
  "bed",
  "bed",
  "ambulance",
  "ambulance",
  "handshake",
  "handshake",
  "snowflake",
  "snowflake",
  "bell",
  "bell",
  "handshake",
  "handshake",
];
//// elements
const addBtn = document.querySelector("#add");
const nameInputField = document.querySelector("#newUser");
const usersList = document.querySelector("#list");
const time = document.querySelector(".time");
const cover = document.querySelector(".cover");
const buttonQuit = document.querySelector("#quit");
const buttonNext = document.querySelector("#next");
const bginfo = document.querySelector(".bg-info");
const secondsDOM = document.querySelector(".sec");
const minutesDOM = document.querySelector(".min");
const pauseGame = document.querySelector(".pause");
const retryGame = document.querySelector(".retry");
const level = document.querySelector(".level");
const screens = document.querySelectorAll(".screen");
const modal = document.querySelector("#myModal");
const reload = document.querySelector(".col-3");
const confetti = document.querySelector(".container-confetti");
const intialState = {
  play: false,
  seconds: 0,
  minutes: 0,
  stopwatchInterval: null,
  currentuser: null,
  openedCards: [],
  currentLevel: 1,
};
let state = { ...intialState };
//// CONFIGURATION
levelOne = [4, 4]; // 4 x 4 grid
levelTwo = [5, 6]; // 5 x 6 grid
levelThree = [6, 6]; // 6 x 6 grid
const gameConfig = {
  levels: [levelOne, levelTwo, levelThree],
  memorySize: 2, // number of cards to match
};

const sounds = {
  winner: "/assets/sounds/winner.mp3",
  solved: "/assets/sounds/solved.mp3",
  wrong: "/assets/sounds/wrong.mp3",
  moved: "/assets/sounds/moved.wav",
  game: "/assets/sounds/game.wav",
};
const gameSound = new Sound(sounds.game, true);
const moveSound = new Sound(sounds.moved);
const wrongSound = new Sound(sounds.wrong);
const solvedSound = new Sound(sounds.solved);
const winnerSound = new Sound(sounds.winner);

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
  const kind = element.getAttribute('kind')
  return kind
}

function isAllSame(cards) {
  if (cards.length === 0) return false;
  const firstCard = cards[0];
  for (let i = 1; i < cards.length; i++) {
    if (getKind(firstCard) !== getKind(cards[i])) return false;
  }
  return true;
}

function Sound(src, loop = false) {
  this.sound = document.createElement("audio");
  loop && (this.sound.loop = true);
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play().catch();
  };
  this.stop = function () {
    this.sound.pause();
  };
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
  solvedSound.play();
  state.openedCards.forEach((e) => {
    e.classList.remove("yellow");
    e.classList.add("solved");
  });
  clearOpenedCards();
}

function clearOpenedCards() {
  state.openedCards = [];
}

function paintGameBoard(level) {
  const [rowSize, colSize] = gameConfig.levels[level];
  const size = rowSize * colSize;
  const icons = iconsList.slice(0, size);
  shuffle(icons);
  const gameBoard = document.querySelector(".game-board");
  gameBoard.textContent = "";
  let row = document.createElement("div");
  row.classList.add("row"); // create row
  for (let c = 0; c < size; c++) {
    let kind = icons[c];

    let card = document.createElement("div"); // create card
    card.classList.add("col", "covered");
    card.setAttribute("kind", kind);

    let icon = document.createElement("i"); // create icon
    icon.classList.add("fas", `fa-${kind}`);
    icon.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    card.appendChild(icon);

    card.addEventListener("click", onCardClick, false);

    row.appendChild(card);
  }
  gameBoard.appendChild(row);
}

function onCardClick(e) {
  const cardElement = e.target;
  // click validation
  if (cardElement.classList.contains("open")) return;
  state.openedCards.push(cardElement);
  displayCard(cardElement);
  matchOrUnmatchAtMemorySize(cardElement);
  congruatulation();
  unpause();
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
let DB;

// Creating the database
function initializeDB() {
  return new Promise((resolve, reject) => {
    let gameDB = indexedDB.open("GameDatabase", 1);

    gameDB.onupgradeneeded = (e) => {
      let db = e.target.result;
      if (!db.objectStoreNames.contains("MatchingGame")) {
        let objectStore = db.createObjectStore("MatchingGame", {
          keyPath: "user",
        });

        objectStore.createIndex("user", "user", { unique: true });
        objectStore.createIndex("level", "level", { unique: false });
        objectStore.createIndex("cummulativeTime", "cummulativeTime", {
          unique: false,
        });

        console.log("Database created!");
      } else {
        console.log("Database already exists.");
      }
    };

    gameDB.onsuccess = (e) => {
      console.log("Success");
      DB = gameDB.result;
      resolve();
    };

    gameDB.onerror = (e) => {
      console.log("There was an error");
      reject();
    };
  });
}

// Adding users to the database
function addUserToDatabase(name) {
  const newUser = {
    user: name,
    level: 1,
    cummulativeTime: 0,
  };

  let transaction = DB.transaction("MatchingGame", "readwrite");
  transaction.onerror = (e) => alert(`Error ${e.target.error}`);
  let objectStore = transaction.objectStore("MatchingGame");

  let request = objectStore.add(newUser);

  request.oncomplete = () => {
    console.log("New user added");
  };
  request.onerror = () => {
    console.log("There was an error");
  };
}

// Removing a user from the database
function removeUser(name) {
  let transaction = DB.transaction("MatchingGame", "readwrite");
  let objectStore = transaction.objectStore("MatchingGame");

  objectStore.delete(name);
}

// Listing all the users
function getUsers() {
  return new Promise((resolve, reject) => {
    let transaction = DB.transaction("MatchingGame", "readonly");
    let objectStore = transaction.objectStore("MatchingGame");
    let request = objectStore.openCursor();
    let result = [];

    request.onsuccess = (e) => {
      let cursor = e.target.result;
      if (cursor) {
        result.push(cursor.key);
        cursor.continue();
      } else {
        resolve(result);
      }
    };

    request.onerror = () => {
      console.log("There was an error");
    };
  });
}

// Showing the level a user is on
function getLevel(user) {
  return new Promise((resolve, reject) => {
    let transaction = DB.transaction(["MatchingGame"], "readonly");
    let objectStore = transaction.objectStore("MatchingGame");
    let request = objectStore.get(user);

    request.onsuccess = (e) => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject();
      console.log("There was an error");
    };
  });
}

// show the time it took a user to finish the game
function getTime(user) {
  let transaction = DB.transaction("MatchingGame", "readonly");
  let objectStore = transaction.objectStore("MatchingGame");
  let request = objectStore.openCursor();

  request.onsuccess = (e) => {
    let cursor = e.target.result;
    if (cursor) {
      if (cursor.key != user) {
        cursor.continue();
      } else {
        return cursor.value.cummulativeTime;
      }
    }
  };

  request.onerror = () => {
    console.log("There was an error");
  };
}

function setLevel(user, level) {
  let transaction = DB.transaction("MatchingGame", "readwrite");
  let objectStore = transaction.objectStore("MatchingGame");

  let request = objectStore.get(user);

  request.onsuccess = (e) => {
    let data = e.target.result;
    data.level = level;
    let requestUpdate = objectStore.put(data);
    requestUpdate.onerror = () => {
      console.log("couldn't set level");
    };
  };
}

// Updating the database with new levels and time
function updateProgress(user, level, cummulativeTime) {
  let updated = {
    user: user,
    level: level,
    cummulativeTime: cummulativeTime,
  };

  let transaction = DB.transaction("MatchingGame", "readwrite");
  let objectStore = transaction.objectStore("MatchingGame");

  let request = objectStore.openCursor();

  request.onsuccess = (e) => {
    let cursor = e.target.result;
    if (cursor) {
      if (cursor.key === user) {
        const upd = objectStore.put(updated);
        upd.onsuccess = function (e) {
          console.log("Update Success");
        };
        upd.onerror = function (e) {
          console.log("Update Failed");
        };
      }
      cursor.continue();
    }
  };
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
  wrongSound.play();
  disable();
  state.openedCards.forEach((e) => {
    e.classList.add("unmatched");
    e.classList.remove("yellow");
  });
  setTimeout(() => {
    state.openedCards.forEach((e) => {
      e.classList.remove("unmatched", "open");
      e.classList.add("covered");
    });
    enable();
    clearOpenedCards();
  }, 1000);
}

// startTimer
function startTimer() {
  resetStopwatch();
  state.stopwatchInterval = setInterval(() => {
    setMinuteAndSecond(state.minutes, state.seconds);
    updateTime();
  }, 1000);
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
  moveSound.play();
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
  if (
    document.querySelectorAll(".solved").length ===
    document.querySelectorAll(".col").length
  ) {
    winnerSound.play();
    pauseSound();
    resetStopwatch();
    updateProgress(
      state.currentuser,
      state.currentLevel + 1,
      Number(time.innerText)
    );
    document.querySelector(".modal p").innerHTML = `
      <h1 class="congra">Congruatulations!</h1><br/>You have sucessfully solved the puzzle.<br/>
      <span class="time">Time:</span> ${state.minutes} min : ${state.seconds} sec
    `;
    showModal();
    showElement(confetti);
    pause();
  }
}

;(function start() {
  // shuffle(level1)
  addImg(level1)
  startTimer()
  addEventListenerToButtons()
  console.log('start game')
})()

function showGameBoard() {
  displayScreen('.screen2')
}

function displayScreen(screen) {
  document.querySelector(screen).style.display = 'block'
}

function removeAllScreens() {
  screens.forEach(screen => {
    hideElement(screen)
  })
}

function play(user) {
  currentUser = user;
  getLevel(currentUser).then((response)=>{
    level = response.level;
    removeAllScreens();
    showGameBoard();
    clearInterval(interval);
    startTimer();
    updateGameBar(level);
    paintGameBoard(level-1);
  });

}
function check() {
  if (isAllSame(state.openedCards)) {
    match();
  } else {
    unmatch();
  }
}

function matchOrUnmatchAtMemorySize() {
  if (state.openedCards.length === gameConfig.memorySize) {
    check();
  }
}

function showHome() {
  displayScreen('.screen1')
}
function disable() {
  cover.classList.add('disable')
}
function hideModal() {
  hideElement(modal)
}

function showModal() {
  showElement(modal);
}

function hideElement(element) {
  element.style.display = "none";
}

function showElement(element) {
  element.style.display = "block";
}

function resetMinuteAndSecond() {
  state.minutes = 0;
  state.seconds = 0;
}

function updateTime() {
  state.seconds++;
  if (state.seconds === 60) {
    state.minutes++;
    state.seconds = 0;
  }
}

function resetStopwatch() {
  clearInterval(state.stopwatchInterval);
}

function pause(e) {
  resetStopwatch();
  gameSound.stop();
  state.isPaused = true;
  pauseGame.textContent = "Paused";
}

function unpause() {
  if (state.isPaused) pauseGame.textContent = "Pause";
  startTimer();
  gameSound.play();
}


function next() {
  getLevel(currentUser).then((response)=>{
    level = response.level + 1;
    numLevels = gameConfig.levels
    if (level - 1 < numLevels.length) {
      updateProgress(currentUser, level, Number(time.innerText))
      let boardSize = 2 + 2*level
      removeAllScreens();
      showGameBoard();
      updateGameBar(level)
      paintGameBoard(level - 1)
      clearInterval(interval)
      startTimer()
      hideModal()
    } else {
      removeAllScreens()
      showHome()
    }
  })
  
}
function unmatch() {
  const [cardOne, cardTwo] = openedCards
  cardOne.classList.add('unmatched')
  cardTwo.classList.add('unmatched')
  disable()
console.log(openedCards)
  setTimeout(() => {
    cardOne.classList.remove('unmatched', 'open')
    cardTwo.classList.remove('unmatched', 'open')
    cardOne.classList.add('covered')
    cardTwo.classList.add('covered')
    openedCards = new Array()
    enable()
  }, 1000)
}
function openedCard(e) {
  if (
    e.target.getAttribute('disabled') ||
    e.target.classList.contains('open')
  ) {
    return
  }
  openedCards.push(e.target)
  if (openedCards.length === 2) {
    check(e.target)
  }
}
function quit() {
  hideModal()
  removeAllScreens()
  showHome()
  clearInterval(interval)
}
function addEventForModalButtons() {
  buttonNext.addEventListener('click', () => {
    next()
  })
  buttonQuit.addEventListener('click', () => {
    quit();
  })
}