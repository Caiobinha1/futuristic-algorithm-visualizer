# 🌌 Neural Visualizer | Interactive Algorithm Playground

An interactive, high-fidelity real-time algorithm visualizer designed to bring pathfinding and sorting algorithms to life. Built with a stunning **cyberpunk/synthwave glassmorphic aesthetic**, it features glowing particle animations, responsive interactive grids, and real-time synthesized audio feedback using the Web Audio API.

👉 **[Live Demo](https://caiobinha1.github.io/futuristic-algorithm-visualizer/)** *(Link will be active once published to GitHub Pages)*

---

## 🎨 Visuals & Design System

The visualizer utilizes a dark-mode-first aesthetic with a curated color system:
*   **Neon Teal (`#00f2fe`)**: Start Node, sorting swaps, active tabs.
*   **Hot Pink (`#ff007f`)**: Target Node, sorting comparisons, active grids.
*   **Solar Orange (`#ff9e00`)**: Shortest Path, fully sorted array states.
*   **Deep Velvet Space (`#08070d`)**: Primary glassmorphic panels and dark backgrounds.

---

## ⚡ Features

### 1. 🏁 Grid Pathfinding Visualizer
*   **Interactive Node Placement**: Drag and drop the **Start Node (Teal)** and **Target Node (Pink)** to configure the paths.
*   **Dynamic Obstacles**: Click and drag on empty cells to draw **Walls** that algorithms must navigate around.
*   **Algorithms Supported**:
    *   **Dijkstra's Algorithm**: The gold standard. Guarantees the shortest path.
    *   **A\* Search**: A heuristic-guided search (uses Manhattan distance) that solves significantly faster.
    *   **Breadth-First Search (BFS)**: Explores equally in all directions. Guarantees the shortest path.
    *   **Depth-First Search (DFS)**: Goes deep into branches first. Does not guarantee the shortest path (very cool to watch).
*   **Maze Generator**: Instantly generate random obstacles with a single click.
*   **Speed Control**: Adjust animation speeds from *Slow* to *Normal*, *Fast*, or *Instant* (zero latency).

### 2. 🎵 Synthesized Audio Sorting Visualizer
*   **Musical Sorting**: Generates electronic synthesizer sine tones mapped directly to the height of the bars being shifted. The sound pitch ramps up as elements are organized.
*   **Real-time Statistics**: Shows live counters for the number of **Comparisons** and **Swaps/Writes** performed during execution.
*   **Algorithms Supported**:
    *   **Quick Sort**: O(n log n) average. Uses an in-place pivot partition.
    *   **Merge Sort**: O(n log n) stable. Recursively splits and writes segments.
    *   **Bubble Sort**: O(n²) simple comparison swaps.
    *   **Selection Sort**: O(n²) minimum element scans.
*   **Adjustable Array Size**: Scale the array from 10 to 120 elements in real-time.
*   **Audio Toggle**: Sound can be muted or unmuted dynamically.

---

## 🛠️ Technology Stack

*   **Core**: HTML5 Semantic Markup
*   **Styles**: Modern CSS3 (CSS Variables, Grid, Flexbox, Keyframe Animations, Backdrop Blur Filters)
*   **Scripting**: Vanilla ES6 JavaScript (Asynchronous queues, `async/await` loop throttling, DOM interaction)
*   **Audio**: Web Audio API (OscillatorNode sound synthesis)
*   **Deployment**: GitHub Pages (Static hosting)

---

## 🚀 How to Run Locally

Since this project has **zero external dependencies** and is built entirely in vanilla JS, you do not need to install `npm` or run a local server.

1. Clone this repository:
   ```bash
   git clone https://github.com/Caiobinha1/futuristic-algorithm-visualizer.git
   ```
2. Navigate into the folder:
   ```bash
   cd futuristic-algorithm-visualizer
   ```
3. Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari):
   ```bash
   # On Windows (PowerShell)
   Start-Process index.html
   ```

---

## 📸 Interactive Showcase

*   **Pathfinding Grid**: Click and drag to create paths. Relocate endpoints. Watch the search wave expand from the start node until it locks onto the target.
*   **Sorting Array**: Select your algorithm, click "Start Sorting", and listen to the audio gradient play notes in a harmonic sweep as the array transitions from disorder to order.

*Designed with ❤️ for Caiobinha1.*
