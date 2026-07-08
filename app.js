// Futuristic Algorithm Visualizer - Main Application Controller

// Audio Feedback System using Web Audio API
class AudioSynth {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Plays a pitch tone mapped from the value of a sorting element
  playNodeTone(value, maxVal) {
    if (this.muted) return;
    this.init();
    
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Map value (e.g., 10 to 100) to frequency range (e.g., 120Hz to 880Hz)
    const minFreq = 150;
    const maxFreq = 900;
    const percent = value / maxVal;
    const frequency = minFreq + percent * (maxFreq - minFreq);

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = 'sine'; // Pure electronic sound
    osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    
    // Smooth volume ramp down to avoid clicks
    gainNode.gain.setValueAtTime(0.04, this.audioCtx.currentTime); // Soft volume
    gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  setMuted(isMuted) {
    this.muted = isMuted;
  }
}

// Instantiate Global Sound Controller
const soundSynth = new AudioSynth();

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Tab Elements
  const tabPathfinding = document.getElementById('tab-pathfinding');
  const tabSorting = document.getElementById('tab-sorting');
  const controlsPathfinding = document.getElementById('controls-pathfinding');
  const controlsSorting = document.getElementById('controls-sorting');
  const viewPathfinding = document.getElementById('view-pathfinding');
  const viewSorting = document.getElementById('view-sorting');

  // Active Tab State
  let activeTab = 'pathfinding';

  // Tab Navigation Handling
  function switchTab(tabName) {
    activeTab = tabName;

    if (tabName === 'pathfinding') {
      tabPathfinding.classList.add('active');
      tabSorting.classList.remove('active');
      
      controlsPathfinding.classList.add('active');
      controlsSorting.classList.remove('active');
      
      viewPathfinding.classList.add('active');
      viewSorting.classList.remove('active');
      
      // Initialize/resize grid if necessary
      if (typeof initGrid === 'function') {
        initGrid();
      }
    } else {
      tabPathfinding.classList.remove('active');
      tabSorting.classList.add('active');
      
      controlsPathfinding.classList.remove('active');
      controlsSorting.classList.add('active');
      
      viewPathfinding.classList.remove('active');
      viewSorting.classList.add('active');
      
      // Initialize sorting array if necessary
      if (typeof initSorting === 'function') {
        initSorting();
      }
    }
  }

  tabPathfinding.addEventListener('click', () => switchTab('pathfinding'));
  tabSorting.addEventListener('click', () => switchTab('sorting'));

  // Initialize Sound settings checkbox
  const soundCheckbox = document.getElementById('sound-sorting');
  if (soundCheckbox) {
    soundSynth.setMuted(!soundCheckbox.checked);
    soundCheckbox.addEventListener('change', (e) => {
      soundSynth.setMuted(!e.target.checked);
      // Unlock AudioContext on click/interaction
      soundSynth.init();
    });
  }

  // Initialize components on load
  setTimeout(() => {
    switchTab('pathfinding');
  }, 100);
});
