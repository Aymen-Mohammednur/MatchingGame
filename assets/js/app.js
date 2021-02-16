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

function removeAllScreens() {
  screens.forEach((screen) => {
    hideElement(screen);
  });
}

function displayScreen(screen) {
  document.querySelector(screen).style.display = "block";
}

function showGameBoard() {
  displayScreen(".screen2");
}

function showHome() {
  displayScreen(".screen1");
}

function getKind(element) {
  return element.getAttribute("kind");
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

function disable() {
  cover.classList.add("disable");
}

function enable() {
  cover.classList.remove("disable");
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

//checks for duplicates. Accepts NodeList or normal list of Node Elements and compares kinds to find duplicates.
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

function displayCard(element) {
  moveSound.play();
  element.classList.add("open", "yellow");
  element.classList.remove("covered");
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
  let currentIndex = arr.length,
    temp,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temp = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temp;
  }

  return arr;
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

function showModal() {
  showElement(modal);
}

function hideModal() {
  hideElement(modal);
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

function startTimer() {
  resetStopwatch();
  state.stopwatchInterval = setInterval(() => {
    setMinuteAndSecond(state.minutes, state.seconds);
    updateTime();
  }, 1000);
}

function resetStopwatch() {
  clearInterval(state.stopwatchInterval);
}

function updateTime() {
  state.seconds++;
  if (state.seconds === 60) {
    state.minutes++;
    state.seconds = 0;
  }
}

function quit() {
  hideModal();
  hideElement(confetti);
  removeAllScreens();
  showHome();
  setMinuteAndSecond();
  gameSound.stop();
  resetStopwatch();
  resetState();
}

function resetState() {
  state = { ...intialState };
}

function setMinuteAndSecond(min = 0, sec = 0) {
  minutesDOM.textContent = min;
  secondsDOM.textContent = sec;
}

function addEventForModalButtons() {
  buttonNext.addEventListener("click", () => {
    next();
  });
  buttonQuit.addEventListener("click", () => {
    quit();
  });
}

function addUser() {
  addUserToDatabase(nameInputField.value);
  nameInputField.value = "";
  fetchUsers();
}

function addEventListenerToAddButton() {
  addBtn.addEventListener("click", addUser, false);
}

function retry() {
  removeAllScreens();
  showGameBoard();
  setMinuteAndSecond();
  resetStopwatch();
  resetMinuteAndSecond();
  clearOpenedCards();
  startTimer();
  let l = state.currentLevel;
  paintGameBoard(l - 1);
  showAllCards();
  gameSound.play();
}

function updateGameBar(level) {
  bginfo.firstElementChild.textContent = `Level: ${level}`;
  pauseGame.addEventListener("click", pause);
  retryGame.addEventListener("click", retry);
  bginfo.lastElementChild.addEventListener("click", quit);
}

function fetchUsers() {
  const users = getUsers();
  usersList.textContent = "";
  users.then((response) => {
    response.forEach((username) => {
      let li = document.createElement("li");
      let nameSpan = document.createElement("span");
      nameSpan.textContent = username;
      li.addEventListener("click", () => play(username));
      let deleteSpan = document.createElement("span");
      deleteSpan.innerHTML = "&#9747;";
      deleteSpan.classList.add("delete-name");
      deleteSpan.addEventListener(
        "click",
        (e) => {
          e.stopPropagation();
          deleteUser(username);
        },
        false
      );

      li.appendChild(nameSpan);
      li.appendChild(deleteSpan);
      usersList.appendChild(li);
    });
  });
}

function deleteUser(username) {
  removeUser(username);
  fetchUsers();
}

function next() {
  hideModal();
  gameSound.stop();
  getLevel(state.currentuser).then((response) => {
    let level = response.level;
    state.currentLevel = level;
    numLevels = gameConfig.levels;
    if (level - 1 < numLevels.length) {
      resetAndStartGameboard(level);
    } else {
      quit();
    }
  });
}

function showAllCards() {
  disable();
  document.querySelectorAll(".col").forEach((card) => {
    card.classList.remove("covered");
    card.classList.add("blue");
  });
  setTimeout(() => {
    document.querySelectorAll(".col").forEach((card) => {
      card.classList.add("covered");
      card.classList.remove("blue");
    });
    enable();
  }, 2000);
}

function resetAndStartGameboard(level) {
  removeAllScreens();
  showGameBoard();
  clearInterval(state.stopwatchInterval);
  clearOpenedCards();
  startTimer();
  updateGameBar(level);
  paintGameBoard(level - 1);
  gameSound.play();
  showAllCards();
  hideElement(confetti);
}

function play(user) {
  state.currentuser = user;
  getLevel(state.currentuser).then((response) => {
    let level = response.level;
    state.level = level;
    resetAndStartGameboard(level);
  });
}

(function start() {
  initializeDB().then(() => {
    fetchUsers();
  });
  removeAllScreens();
  showHome();
  addEventForModalButtons();
  addEventListenerToAddButton();
})();
