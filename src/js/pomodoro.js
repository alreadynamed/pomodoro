const pomodoroNumber = getElement('.number');
const timerField = getElement('.timer');
const startButton = getElement('.start');
const stopButton = getElement('.stop');
let timerNumber = 1;

function getElement(el) {
  return document.querySelector(el);
}

function createTimer() {
  const minutes = 25;
  const seconds = 0;

  pomodoroNumber.innerHTML = `pomodoro #${timerNumber}`;
  disableStopButton(minutes, seconds);
  correctTimeDisplay(minutes, seconds);
  startTimer(minutes, seconds);
}

function changeButtonValue(text) {
  startButton.innerHTML = text;

  switch (startButton.innerHTML) {
    case 'start':
      startTimer(25, 0);
      return true;
    case 'break':
      breakTimer(5, 0);
      break;
    case 'long break':
      longBreak(10, 0);
      break;
  }
}

function correctTimeDisplay(minutes, seconds) {
  const correctMinutes = minutes < 10 ? '0' + minutes : minutes;
  const correctSeconds = seconds < 10 ? '0' + seconds : seconds;

  timerField.innerHTML = `${correctMinutes}:${correctSeconds}`;
}

function countdown(minutes, seconds) {
  const step = setInterval(() => {
    seconds -= 1;

    if (seconds < 0) {
      seconds = 59;
      minutes -= 1;
    }

    if (minutes === 0 && seconds === 0) {
      clearInterval(step);
      endTimerSound();
      // timer end
      changeButtonValue('break');
      pomodoroNumber.innerHTML = `pomodoro #${timerNumber}`;
      timerNumber++;

      if (timerNumber > 4) {
        longBreak(10, 0);
        pomodoroNumber.innerHTML = 'long break';
        timerNumber = 1;
      }
    }

    correctTimeDisplay(minutes, seconds);
    disableStopButton(minutes, seconds);
  }, 1000);

  pauseTimer(step);
  stopTime(25, 0, step);
}

function disableStopButton(minutesValue, secondsValue) {
  if (
    (minutesValue === 25 && secondsValue === 0) ||
    (minutesValue === 0 && secondsValue === 0) ||
    (minutesValue === 5 && secondsValue === 0) ||
    (minutesValue === 0 && secondsValue === 0) ||
    (minutesValue === 10 && secondsValue === 0)
  ) {
    stopButton.disabled = true;
  } else {
    stopButton.disabled = false;
  }
}

function startTimer(minutes, seconds) {
  let timerStarted = false;

  startButton.addEventListener('click', () => {
    if (timerStarted === false) {
      if (startButton.innerHTML === 'start') {
        countdown(minutes, seconds);
        pomodoroNumber.innerHTML = `pomodoro #${timerNumber}`;
        // timer started
      }
    }

    timerStarted = true;
  });
}

function pauseTimer(step) {
  let timerPaused = false;
  startButton.innerHTML = 'pause';

  startButton.addEventListener('click', () => {
    if (timerPaused === false) {
      if (startButton.innerHTML === 'pause') {
        clearInterval(step);
        // timer stopped
        resumeTimer();
      }
    }

    timerPaused = true;
  });
}

function resumeTimer() {
  let timerResumed = false;
  startButton.innerHTML = 'resume';

  startButton.addEventListener('click', () => {
    if (timerResumed === false) {
      if (startButton.innerHTML === 'resume') {
        const firstIndexOfMinute = timerField.innerHTML[0];
        const secondIndexOfMinute = timerField.innerHTML[1];
        const firstIndexOfSecond = timerField.innerHTML[3];
        const secondIndexOfSecond = timerField.innerHTML[4];
        const pausedMinutes = parseInt(
          firstIndexOfMinute + secondIndexOfMinute,
        );
        const pausedSeconds = parseInt(
          firstIndexOfSecond + secondIndexOfSecond,
        );

        countdown(pausedMinutes, pausedSeconds);
        // timer resumed
      }
    }

    timerResumed = true;
  });
}

function stopTime(minutesValue, secondsValue, step) {
  let timeStopped = false;

  stopButton.addEventListener('click', () => {
    if (timeStopped === false && minutesValue === 25 && secondsValue === 0) {
      clearInterval(step);
      correctTimeDisplay(minutesValue, secondsValue);
      disableStopButton(minutesValue, secondsValue);
      changeButtonValue('start');
      // timer stopped
    }

    if (timeStopped === false && minutesValue === 5 && secondsValue == 0) {
      clearInterval(step);
      correctTimeDisplay(minutesValue, secondsValue);
      disableStopButton(minutesValue, secondsValue);
      changeButtonValue('break');
      // break stopped
    }

    if (timeStopped === false && minutesValue === 10 && secondsValue === 0) {
      clearInterval(step);
      correctTimeDisplay(minutesValue, secondsValue);
      disableStopButton(minutesValue, secondsValue);
      changeButtonValue('long break');
      // long break stopped
    }

    timeStopped = true;
  });
}

function countdownOfBreak(breakMinutes, breakSeconds) {
  const breakStep = setInterval(() => {
    breakSeconds -= 1;

    if (breakSeconds < 0) {
      breakSeconds = 59;
      breakMinutes -= 1;
    }

    if (breakMinutes === 0 && breakSeconds === 0) {
      clearInterval(breakStep);
      endTimerSound();
      // break end
      changeButtonValue('start');
    }

    correctTimeDisplay(breakMinutes, breakSeconds);
    disableStopButton(breakMinutes, breakSeconds);
  }, 1000);

  // pause break
  breakPause(breakStep);
  // stop break
  stopTime(5, 0, breakStep);
  // stop long break
  stopTime(10, 0, breakStep);
}

function endTimerSound() {
  const timerEndSoundEffect = document.createElement('audio');
  timerEndSoundEffect.src = './src/audio/timer-end.mp3';
  timerEndSoundEffect.volume = 0.2;
  timerEndSoundEffect.play();
}

function breakTimer(breakMinutes, breakSeconds) {
  let timeBreak = false;
  startButton.innerHTML = 'break';

  startButton.addEventListener('click', () => {
    if (startButton.innerHTML === 'break') {
      if (timeBreak === false) {
        stopButton.disabled = false;
        countdownOfBreak(breakMinutes, breakSeconds);
        pomodoroNumber.innerHTML = 'short break';
        // break started
      }
    }

    timeBreak = true;
  });
}

function longBreak(breakMinutes, breakSeconds) {
  let longBreak = false;
  startButton.innerHTML = 'long break';

  startButton.addEventListener('click', () => {
    if (startButton.innerHTML === 'long break') {
      if (longBreak === false) {
        stopButton.disabled = false;
        countdownOfBreak(breakMinutes, breakSeconds);
        // long break started
      }
    }

    longBreak = true;
  });
}

function breakPause(breakStep) {
  let breakPaused = false;
  startButton.innerHTML = 'pause';

  startButton.addEventListener('click', () => {
    if (startButton.innerHTML === 'pause') {
      if (breakPaused === false) {
        clearInterval(breakStep);
        // break stopped
        resumeBreak();
      }
    }

    breakPaused = true;
  });
}

function resumeBreak() {
  let breakResumed = false;
  startButton.innerHTML = 'resume';

  startButton.addEventListener('click', () => {
    if (startButton.innerHTML === 'resume') {
      if (breakResumed === false) {
        const firstIndexOfBreakMinute = timerField.innerHTML[0];
        const secondIndexOfBreakMinute = timerField.innerHTML[1];
        const firstIndexOfBreakSecond = timerField.innerHTML[3];
        const secondIndexOfBreakSecond = timerField.innerHTML[4];
        const pausedBreakMinutes = parseInt(
          firstIndexOfBreakMinute + secondIndexOfBreakMinute,
        );
        const pausedBreakSeconds = parseInt(
          firstIndexOfBreakSecond + secondIndexOfBreakSecond,
        );

        countdownOfBreak(pausedBreakMinutes, pausedBreakSeconds);
        // break resumed
      }
    }

    breakResumed = true;
  });
}

createTimer();
