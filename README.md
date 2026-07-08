# Futuristic Algorithm Visualizer

A web-based application designed to visualize pathfinding and sorting algorithms in real time. The project includes interactive grid setup for pathfinding and real-time synthesized audio feedback for sorting.

## Demo

![Pathfinding & Sorting Demo](assets/demo.gif)

## Features

### Pathfinding Grid
*   **Algorithms:** Dijkstra, A* Search (Manhattan distance), Breadth-First Search (BFS), and Depth-First Search (DFS).
*   **Interactivity:** Drag-and-drop start/target nodes, draw/erase custom walls on the grid, and generate randomized obstacle mazes.
*   **Speed Control:** Adjustable animation delays (Slow, Normal, Fast, and Instant).

### Array Sorting
*   **Algorithms:** Quick Sort, Merge Sort, Bubble Sort, and Selection Sort.
*   **Audio Synthesis:** Web Audio API oscillator nodes emit tones mapped to the values of array elements being sorted.
*   **Live Metrics:** Real-time counters tracking comparisons and swaps/writes.
*   **Controls:** Adjustable array size (10 to 120 elements) and speed.

## Technologies Used

*   **HTML5 & CSS3:** Semantic markup, CSS grid/flexbox layouts, responsive design, custom styling variables, and keyframe animations.
*   **JavaScript (ES6):** Asynchronous visual updates using `async/await` loop throttling, interactive grid mouse tracking, and Web Audio API control.

## Local Setup

Since the application uses vanilla web technologies with zero dependencies, you can run it locally without compilation:

1. Clone the repository:
   ```bash
   git clone https://github.com/Caiobinha1/futuristic-algorithm-visualizer.git
   ```
2. Open the `index.html` file in any modern web browser:
   ```bash
   cd futuristic-algorithm-visualizer
   # Windows:
   Start-Process index.html
   ```
