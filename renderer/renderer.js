(() => {
  const WORK_MINUTES = 25;
  const BREAK_MINUTES = 5;

  const MODES = {
    work: { minutes: WORK_MINUTES, label: '专注' },
    break: { minutes: BREAK_MINUTES, label: '休息' },
  };

  const circle = document.getElementById('ringProgress');
  const timerText = document.getElementById('timerText');
  const timerLabel = document.querySelector('.timer-label');
  const timerRing = document.querySelector('.timer-ring');
  const btnStart = document.getElementById('btnStart');
  const btnPause = document.getElementById('btnPause');
  const btnReset = document.getElementById('btnReset');
  const btnClose = document.getElementById('btnClose');
  const tabs = document.querySelectorAll('.tab');
  const root = document.documentElement;

  const r = 96;
  const circumference = 2 * Math.PI * r;
  circle.style.strokeDasharray = circumference;

  let currentMode = 'work';
  let totalSeconds = MODES.work.minutes * 60;
  let remainingSeconds = totalSeconds;
  let intervalId = null;
  let isRunning = false;

  function setTheme(mode) {
    if (mode === 'work') {
      root.style.setProperty('--grad-start', '#34d399');
      root.style.setProperty('--grad-end', '#06b6d4');
      root.style.setProperty('--current-glow', 'rgba(52, 211, 153, 0.3)');
    } else {
      root.style.setProperty('--grad-start', '#60a5fa');
      root.style.setProperty('--grad-end', '#a78bfa');
      root.style.setProperty('--current-glow', 'rgba(96, 165, 250, 0.3)');
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateDisplay() {
    timerText.textContent = formatTime(remainingSeconds);
    const progress = 1 - remainingSeconds / totalSeconds;
    circle.style.strokeDashoffset = circumference * (1 - progress);
  }

  function updateLabel(text, animated) {
    if (animated) {
      timerLabel.style.opacity = '0';
      timerLabel.style.transform = 'translateY(3px)';
      setTimeout(() => {
        timerLabel.textContent = text;
        timerLabel.style.opacity = '1';
        timerLabel.style.transform = 'translateY(0)';
      }, 150);
    } else {
      timerLabel.textContent = text;
    }
  }

  function setMode(mode) {
    currentMode = mode;
    totalSeconds = MODES[mode].minutes * 60;
    remainingSeconds = totalSeconds;
    setTheme(mode);
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.mode === mode));
    updateDisplay();
    updateLabel('准备开始', true);
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    timerRing.classList.add('running');
    btnStart.classList.add('hidden');
    btnPause.classList.remove('hidden');
    updateLabel(`${MODES[currentMode].label}中...`, true);

    intervalId = setInterval(() => {
      remainingSeconds--;
      updateDisplay();

      if (remainingSeconds <= 0) {
        clearInterval(intervalId);
        isRunning = false;
        timerRing.classList.remove('running');

        const nextMode = currentMode === 'work' ? 'break' : 'work';
        const finishedLabel = MODES[currentMode].label;
        const nextLabel = MODES[nextMode].label;

        window.pomodoroAPI.notify('番茄钟', `${finishedLabel}结束！开始${nextLabel}。`);

        btnStart.classList.remove('hidden');
        btnPause.classList.add('hidden');
        setMode(nextMode);
      }
    }, 1000);
  }

  function pause() {
    clearInterval(intervalId);
    isRunning = false;
    timerRing.classList.remove('running');
    btnStart.classList.remove('hidden');
    btnPause.classList.add('hidden');
    updateLabel('已暂停', true);
  }

  function reset() {
    clearInterval(intervalId);
    isRunning = false;
    timerRing.classList.remove('running');
    btnStart.classList.remove('hidden');
    btnPause.classList.add('hidden');
    remainingSeconds = totalSeconds;
    updateDisplay();
    updateLabel('准备开始', true);
  }

  // Event listeners
  btnStart.addEventListener('click', start);
  btnPause.addEventListener('click', pause);
  btnReset.addEventListener('click', reset);

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (isRunning) {
        clearInterval(intervalId);
        isRunning = false;
        timerRing.classList.remove('running');
        btnStart.classList.remove('hidden');
        btnPause.classList.add('hidden');
      }
      setMode(tab.dataset.mode);
    });
  });

  btnClose.addEventListener('click', () => {
    window.close();
  });

  // Init
  updateDisplay();
})();
