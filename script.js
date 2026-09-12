/* =========================================
   TYPEFLOW - TYPING SPEED TEST
   Veda Technology - Task 20
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const passageElement =
  document.getElementById("passage");

const typingInput =
  document.getElementById("typingInput");

const timerElement =
  document.getElementById("timer");

const wpmElement =
  document.getElementById("wpm");

const accuracyElement =
  document.getElementById("accuracy");

const errorsElement =
  document.getElementById("errors");

const progressBar =
  document.getElementById("progressBar");

const progressText =
  document.getElementById("progressText");

const characterCount =
  document.getElementById("characterCount");

const statusElement =
  document.getElementById("status");

const startBtn =
  document.getElementById("startBtn");

const restartBtn =
  document.getElementById("restartBtn");

const newPassageBtn =
  document.getElementById("newPassageBtn");

const resultCard =
  document.getElementById("resultCard");

const finalWpm =
  document.getElementById("finalWpm");

const finalAccuracy =
  document.getElementById("finalAccuracy");

const finalTime =
  document.getElementById("finalTime");

const finalErrors =
  document.getElementById("finalErrors");

const tryAgainBtn =
  document.getElementById("tryAgainBtn");


/* =========================================
   PASSAGES
========================================= */

const passages = [

  "Technology continues to change the way people learn, work, communicate, and solve problems. Building useful digital products requires creativity, patience, and a willingness to keep learning.",

  "Good software is designed around real user needs. A simple interface, clear feedback, and reliable functionality can make a digital experience easier and more enjoyable for everyone.",

  "Artificial intelligence is becoming an important part of modern technology. Developers use intelligent systems to analyze information, automate repetitive tasks, and create new ways for people to interact with software.",

  "Learning to code is a continuous process. Every project provides an opportunity to practice problem solving, understand mistakes, improve logical thinking, and develop better solutions.",

  "The best digital products combine thoughtful design with reliable functionality. When technology is easy to understand and simple to use, users can focus on achieving their goals instead of learning complicated systems."

];


/* =========================================
   STATE
========================================= */

let currentPassage = "";

let timerInterval = null;

let startTime = null;

let elapsedSeconds = 0;

let testStarted = false;

let testCompleted = false;


/* =========================================
   RANDOM PASSAGE
========================================= */

function getRandomPassage() {

  const randomIndex =
    Math.floor(Math.random() * passages.length);

  return passages[randomIndex];
}


/* =========================================
   DISPLAY PASSAGE
========================================= */

function loadPassage() {

  currentPassage = getRandomPassage();

  passageElement.innerHTML = "";

  currentPassage
    .split("")
    .forEach((character, index) => {

      const span =
        document.createElement("span");

      span.className = "char";

      span.dataset.index = index;

      /*
        Preserve spaces visually.
      */

      span.textContent =
        character === " "
          ? "\u00A0"
          : character;

      passageElement.appendChild(span);

    });

  /*
    Highlight first character.
  */

  updateCurrentCharacter(0);

  characterCount.textContent =
    `0 / ${currentPassage.length} characters`;

}


/* =========================================
   CURRENT CHARACTER
========================================= */

function updateCurrentCharacter(index) {

  const characters =
    passageElement.querySelectorAll(".char");

  characters.forEach(char => {
    char.classList.remove("current");
  });

  if (
    index >= 0 &&
    index < characters.length
  ) {

    characters[index]
      .classList.add("current");

  }

}


/* =========================================
   START TEST
========================================= */

function startTest() {

  if (testStarted) {
    return;
  }

  testStarted = true;

  testCompleted = false;

  startTime = Date.now();

  typingInput.disabled = false;

  typingInput.focus();

  statusElement.textContent = "Typing...";

  statusElement.classList.add("active");

  startTimer();

}


/* =========================================
   TIMER
========================================= */

function startTimer() {

  clearInterval(timerInterval);

  timerInterval =
    setInterval(() => {

      elapsedSeconds =
        Math.floor(
          (Date.now() - startTime) / 1000
        );

      timerElement.textContent =
        formatTime(elapsedSeconds);

      calculateStats();

    }, 250);

}


/* =========================================
   STOP TIMER
========================================= */

function stopTimer() {

  clearInterval(timerInterval);

  timerInterval = null;

}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(totalSeconds) {

  const minutes =
    Math.floor(totalSeconds / 60);

  const seconds =
    totalSeconds % 60;

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  );

}


/* =========================================
   INPUT EVENT
========================================= */

typingInput.addEventListener(
  "input",
  handleTyping
);


function handleTyping() {

  /*
    Timer starts with first keystroke.
  */

  if (
    !testStarted &&
    typingInput.value.length > 0
  ) {

    startTest();

  }


  if (testCompleted) {
    return;
  }


  const typedText =
    typingInput.value;


  /*
    Compare every typed character
    with the target passage.
  */

  const characters =
    passageElement.querySelectorAll(".char");


  characters.forEach((char, index) => {

    char.classList.remove(
      "correct",
      "wrong"
    );


    if (index < typedText.length) {

      if (
        typedText[index] ===
        currentPassage[index]
      ) {

        char.classList.add("correct");

      } else {

        char.classList.add("wrong");

      }

    }

  });


  /*
    Highlight the next character.
  */

  updateCurrentCharacter(
    typedText.length
  );


  calculateStats();


  /*
    Finish when complete.
  */

  if (
    typedText.length >=
    currentPassage.length
  ) {

    finishTest();

  }

}


/* =========================================
   CALCULATE STATS
========================================= */

function calculateStats() {

  const typedText =
    typingInput.value;


  const typedLength =
    typedText.length;


  /*
    Correct character count.
  */

  let correctCharacters = 0;

  let errors = 0;


  for (
    let i = 0;
    i < typedLength;
    i++
  ) {

    if (
      typedText[i] ===
      currentPassage[i]
    ) {

      correctCharacters++;

    } else {

      errors++;

    }

  }


  /*
    Accuracy.
  */

  let accuracy = 100;

  if (typedLength > 0) {

    accuracy =
      Math.round(
        (correctCharacters / typedLength) * 100
      );

  }


  /*
    WPM formula:

    WPM =
    correct characters / 5
    divided by minutes
  */

  let wpm = 0;


  if (elapsedSeconds > 0) {

    const minutes =
      elapsedSeconds / 60;

    wpm =
      Math.round(
        (correctCharacters / 5) /
        minutes
      );

  }


  /*
    Update UI.
  */

  wpmElement.textContent =
    Number.isFinite(wpm)
      ? wpm
      : 0;


  accuracyElement.textContent =
    `${accuracy}%`;


  errorsElement.textContent =
    errors;


  /*
    Progress.
  */

  const progress =
    Math.min(
      100,
      Math.round(
        (typedLength /
          currentPassage.length) *
        100
      )
    );


  progressBar.style.width =
    `${progress}%`;


  progressText.textContent =
    `${progress}%`;


  characterCount.textContent =
    `${typedLength} / ${currentPassage.length} characters`;


  return {
    wpm,
    accuracy,
    errors,
    correctCharacters
  };

}


/* =========================================
   FINISH TEST
========================================= */

function finishTest() {

  if (testCompleted) {
    return;
  }

  testCompleted = true;

  stopTimer();

  typingInput.disabled = true;

  statusElement.textContent =
    "Completed";

  statusElement.classList.remove("active");

  statusElement.classList.add("complete");


  const stats =
    calculateStats();


  /*
    Final results.
  */

  finalWpm.textContent =
    stats.wpm;


  finalAccuracy.textContent =
    `${stats.accuracy}%`;


  finalTime.textContent =
    formatTime(elapsedSeconds);


  finalErrors.textContent =
    stats.errors;


  /*
    Remove current character.
  */

  updateCurrentCharacter(-1);


  /*
    Show result card.
  */

  resultCard.classList.remove("hidden");


  /*
    Smooth scroll to result.
  */

  setTimeout(() => {

    resultCard.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }, 100);

}


/* =========================================
   RESET TEST
========================================= */

function resetTest(useNewPassage = false) {

  stopTimer();

  testStarted = false;

  testCompleted = false;

  startTime = null;

  elapsedSeconds = 0;


  /*
    Reset timer.
  */

  timerElement.textContent =
    "00:00";


  wpmElement.textContent =
    "0";


  accuracyElement.textContent =
    "100%";


  errorsElement.textContent =
    "0";


  progressBar.style.width =
    "0%";


  progressText.textContent =
    "0%";


  resultCard.classList.add("hidden");


  /*
    Reset status.
  */

  statusElement.textContent =
    "Ready";

  statusElement.classList.remove(
    "active",
    "complete"
  );


  /*
    Reset input.
  */

  typingInput.value = "";

  typingInput.disabled = true;


  /*
    Load another passage
    when requested.
  */

  if (useNewPassage) {

    loadPassage();

  } else {

    /*
      Keep the current passage.
    */

    updatePassageVisuals();

  }


  characterCount.textContent =
    `0 / ${currentPassage.length} characters`;

}


/* =========================================
   RESET VISUAL CHARACTERS
========================================= */

function updatePassageVisuals() {

  const characters =
    passageElement.querySelectorAll(".char");

  characters.forEach(char => {

    char.classList.remove(
      "correct",
      "wrong",
      "current"
    );

  });

  updateCurrentCharacter(0);

}


/* =========================================
   START BUTTON
========================================= */

startBtn.addEventListener(
  "click",
  () => {

    if (testCompleted) {

      resetTest(false);

    }

    startTest();

  }
);


/* =========================================
   RESTART BUTTON
========================================= */

restartBtn.addEventListener(
  "click",
  () => {

    resetTest(false);

    typingInput.focus();

  }
);


/* =========================================
   NEW PASSAGE
========================================= */

newPassageBtn.addEventListener(
  "click",
  () => {

    resetTest(true);

  }
);


/* =========================================
   TRY AGAIN
========================================= */

tryAgainBtn.addEventListener(
  "click",
  () => {

    resetTest(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);


/* =========================================
   KEYBOARD SHORTCUT
========================================= */

document.addEventListener(
  "keydown",
  event => {

    /*
      Ctrl + Enter
      restarts the test.
    */

    if (
      event.ctrlKey &&
      event.key === "Enter"
    ) {

      resetTest(false);

      typingInput.focus();

    }

  }
);


/* =========================================
   INITIALIZE APPLICATION
========================================= */

loadPassage();

resetTest(false);
