// Futuristic Algorithm Visualizer - Array Sorting Logic

let array = [];
let sortingActive = false;
let comparisonsCount = 0;
let swapsCount = 0;

// Default config
let arraySize = 40;
let speedDelay = 30; // ms

// Sleep helper function to throttle sorting steps
const sleep = () => new Promise(resolve => setTimeout(resolve, speedDelay));

// Initialise random array and render bars
function initSorting() {
  if (sortingActive) return;

  const container = document.getElementById('sorting-container');
  container.innerHTML = '';
  array = [];
  comparisonsCount = 0;
  swapsCount = 0;
  updateStats();

  const sizeSlider = document.getElementById('size-sorting');
  arraySize = parseInt(sizeSlider.value);
  document.getElementById('size-value').innerText = arraySize;

  const maxVal = 100;

  for (let i = 0; i < arraySize; i++) {
    // Random height percentage between 10% and 95%
    const val = Math.floor(Math.random() * 85) + 10;
    array.push(val);

    const bar = document.createElement('div');
    bar.id = `bar-${i}`;
    bar.classList.add('sort-bar');
    bar.style.height = `${val}%`;
    container.appendChild(bar);
  }
}

// Update comparisons and swaps stats on the UI
function updateStats() {
  document.getElementById('stat-comparisons').innerText = comparisonsCount;
  document.getElementById('stat-swaps').innerText = swapsCount;
}

// Visual and audio helper for active comparisons
async function compare(idx1, idx2) {
  if (!sortingActive) return;
  
  comparisonsCount++;
  updateStats();

  const bar1 = document.getElementById(`bar-${idx1}`);
  const bar2 = document.getElementById(`bar-${idx2}`);

  if (bar1) bar1.classList.add('bar-compare');
  if (bar2) bar2.classList.add('bar-compare');

  // Play audio frequency mapped from array value
  if (typeof soundSynth !== 'undefined') {
    soundSynth.playNodeTone(array[idx1], 100);
  }

  await sleep();

  if (bar1) bar1.classList.remove('bar-compare');
  if (bar2) bar2.classList.remove('bar-compare');
}

// Visual, logic, and audio helper for swaps
async function swap(idx1, idx2) {
  if (!sortingActive) return;

  swapsCount++;
  updateStats();

  const bar1 = document.getElementById(`bar-${idx1}`);
  const bar2 = document.getElementById(`bar-${idx2}`);

  // Swap value in logic array
  const temp = array[idx1];
  array[idx1] = array[idx2];
  array[idx2] = temp;

  // Swap visual heights
  if (bar1) {
    bar1.style.height = `${array[idx1]}%`;
    bar1.classList.add('bar-active');
  }
  if (bar2) {
    bar2.style.height = `${array[idx2]}%`;
    bar2.classList.add('bar-active');
  }

  if (typeof soundSynth !== 'undefined') {
    soundSynth.playNodeTone(array[idx1], 100);
  }

  await sleep();

  if (bar1) bar1.classList.remove('bar-active');
  if (bar2) bar2.classList.remove('bar-active');
}

// Visual and logic helper for direct write (e.g. Merge Sort)
async function write(idx, value) {
  if (!sortingActive) return;

  swapsCount++;
  updateStats();

  array[idx] = value;
  
  const bar = document.getElementById(`bar-${idx}`);
  if (bar) {
    bar.style.height = `${value}%`;
    bar.classList.add('bar-active');
  }

  if (typeof soundSynth !== 'undefined') {
    soundSynth.playNodeTone(value, 100);
  }

  await sleep();

  if (bar) bar.classList.remove('bar-active');
}

// Highlight a bar as fully sorted
function highlightSorted(idx) {
  const bar = document.getElementById(`bar-${idx}`);
  if (bar) {
    bar.classList.add('bar-sorted');
  }
}

// Clear all visual highlighting classes from the bars
function clearBarHighlights() {
  for (let i = 0; i < array.length; i++) {
    const bar = document.getElementById(`bar-${i}`);
    if (bar) {
      bar.className = 'sort-bar';
    }
  }
}

// ==========================================
// SORTING ALGORITHMS (ASYNC INTERPRETED)
// ==========================================

// Bubble Sort
async function runBubbleSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (!sortingActive) return;
      await compare(j, j + 1);
      if (array[j] > array[j + 1]) {
        await swap(j, j + 1);
      }
    }
    highlightSorted(n - 1 - i);
  }
  highlightSorted(0);
}

// Selection Sort
async function runSelectionSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (!sortingActive) return;
      await compare(j, minIdx);
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      await swap(i, minIdx);
    }
    highlightSorted(i);
  }
  highlightSorted(n - 1);
}

// Quick Sort Helper
async function runQuickSort(low = 0, high = array.length - 1) {
  if (low < high) {
    const pi = await partition(low, high);
    if (!sortingActive) return;
    await runQuickSort(low, pi - 1);
    await runQuickSort(pi + 1, high);
  } else if (low >= 0 && low < array.length) {
    highlightSorted(low);
  }
}

async function partition(low, high) {
  const pivot = array[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (!sortingActive) return;
    await compare(j, high);
    if (array[j] < pivot) {
      i++;
      await swap(i, j);
    }
  }
  await swap(i + 1, high);
  highlightSorted(i + 1);
  return i + 1;
}

// Merge Sort Helper
async function runMergeSort(l = 0, r = array.length - 1) {
  if (l < r) {
    const m = Math.floor((l + r) / 2);
    await runMergeSort(l, m);
    await runMergeSort(m + 1, r);
    await merge(l, m, r);
  }
}

async function merge(l, m, r) {
  const leftSize = m - l + 1;
  const rightSize = r - m;

  const L = [];
  const R = [];

  for (let i = 0; i < leftSize; i++) L.push(array[l + i]);
  for (let j = 0; j < rightSize; j++) R.push(array[m + 1 + j]);

  let i = 0, j = 0, k = l;
  while (i < leftSize && j < rightSize) {
    if (!sortingActive) return;
    await compare(k, m + 1 + j);
    if (L[i] <= R[j]) {
      await write(k, L[i]);
      i++;
    } else {
      await write(k, R[j]);
      j++;
    }
    k++;
  }

  while (i < leftSize) {
    if (!sortingActive) return;
    await write(k, L[i]);
    i++;
    k++;
  }

  while (j < rightSize) {
    if (!sortingActive) return;
    await write(k, R[j]);
    j++;
    k++;
  }

  // Visual highlight after merging segment
  for (let x = l; x <= r; x++) {
    highlightSorted(x);
  }
}

// Final sweep animation to celebrate sort completion
async function completeSortSweep() {
  clearBarHighlights();
  const n = array.length;
  for (let i = 0; i < n; i++) {
    const bar = document.getElementById(`bar-${i}`);
    if (bar) {
      bar.classList.add('bar-sorted');
    }
    if (typeof soundSynth !== 'undefined') {
      soundSynth.playNodeTone(array[i], 100);
    }
    // Very fast sweep (10ms)
    await new Promise(r => setTimeout(r, 10));
  }
}

// Helper to disable UI controls during animation
function setSortingControlsDisabled(disabled) {
  document.getElementById('algo-sorting').disabled = disabled;
  document.getElementById('size-sorting').disabled = disabled;
  document.getElementById('btn-visualize-sorting').disabled = disabled;
  document.getElementById('btn-generate-sorting').disabled = disabled;
  document.getElementById('tab-pathfinding').disabled = disabled;
}

// Main sorting trigger
async function startSorting() {
  if (sortingActive) return;

  sortingActive = true;
  setSortingControlsDisabled(true);
  clearBarHighlights();

  const algo = document.getElementById('algo-sorting').value;

  if (algo === 'bubble') {
    await runBubbleSort();
  } else if (algo === 'selection') {
    await runSelectionSort();
  } else if (algo === 'quick') {
    await runQuickSort();
    // Ensure all sorted elements get sorted visual highlights
    for (let idx = 0; idx < array.length; idx++) highlightSorted(idx);
  } else if (algo === 'merge') {
    await runMergeSort();
  }

  if (sortingActive) {
    // If it wasn't cancelled halfway through
    await completeSortSweep();
  }

  sortingActive = false;
  setSortingControlsDisabled(false);
}

// Event Listeners for Sorting UI Controls
document.addEventListener('DOMContentLoaded', () => {
  initSorting();

  // Array size slider change
  const sizeSlider = document.getElementById('size-sorting');
  sizeSlider.addEventListener('input', () => {
    document.getElementById('size-value').innerText = sizeSlider.value;
    initSorting();
  });

  // Speed slider change (maps speed range 1-100 to delays)
  const speedSlider = document.getElementById('speed-sorting');
  const speedValText = document.getElementById('speed-value');

  function updateSpeedVal() {
    const val = parseInt(speedSlider.value);
    // Map slider value (1-100) to delay (200ms - 1ms)
    speedDelay = Math.floor(200 - (val / 100) * 199);
    
    if (val < 25) speedValText.innerText = "Slow";
    else if (val < 75) speedValText.innerText = "Medium";
    else if (val < 95) speedValText.innerText = "Fast";
    else speedValText.innerText = "Hyper";
  }

  speedSlider.addEventListener('input', updateSpeedVal);
  updateSpeedVal(); // Initialize default mapping

  // Action Buttons
  document.getElementById('btn-visualize-sorting').addEventListener('click', startSorting);
  document.getElementById('btn-generate-sorting').addEventListener('click', initSorting);
});
