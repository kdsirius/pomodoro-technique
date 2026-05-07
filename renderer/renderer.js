(() => {
  const WORK_MINUTES = 25;
  const BREAK_MINUTES = 5;

  const MODES = {
    work: { minutes: WORK_MINUTES, label: '工作' },
    break: { minutes: BREAK_MINUTES, label: '休息' },
  };

  const circle = document.getElementById('ringProgress');
  const timerText = document.getElementById('timerText');
  const btnStart = document.getElementById('btnStart');
  const btnPause = document.getElementById('btnPause');
  const btnReset = document.getElementById('btnReset');
  const btnClose = document.getElementById('btnClose');
  const tabs = document.querySelectorAll('.tab');
  const root = document.documentElement;

  const circumference = 2 * Math.PI * 90; // ≈ 565.49
  circle.style.strokeDasharray = circumference;

  let currentMode = 'work';
  let totalSeconds = MODES.work.minutes * 60;
  let remainingSeconds = totalSeconds;
  let intervalId = null;
  let isRunning = false;

  function setColor(mode) {
    const color = mode === 'work' ? 'var(--work-color)' : 'var(--break-color)';
    root.style.setProperty('--current-color', color);
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

  function setMode(mode) {
    currentMode = mode;
    totalSeconds = MODES[mode].minutes * 60;
    remainingSeconds = totalSeconds;
    setColor(mode);
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.mode === mode));
    updateDisplay();
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    btnStart.classList.add('hidden');
    btnPause.classList.remove('hidden');

    intervalId = setInterval(() => {
      remainingSeconds--;
      updateDisplay();

      if (remainingSeconds <= 0) {
        clearInterval(intervalId);
        isRunning = false;

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
    btnStart.classList.remove('hidden');
    btnPause.classList.add('hidden');
  }

  function reset() {
    clearInterval(intervalId);
    isRunning = false;
    btnStart.classList.remove('hidden');
    btnPause.classList.add('hidden');
    remainingSeconds = totalSeconds;
    updateDisplay();
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
