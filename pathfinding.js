// Futuristic Algorithm Visualizer - Pathfinding Logic

// Grid Configuration
const ROWS = 20;
const COLS = 45;
let START_ROW = 10;
let START_COL = 8;
let TARGET_ROW = 10;
let TARGET_COL = 36;

let grid = [];
let isDrawing = false;
let isMovingStart = false;
let isMovingTarget = false;
let isErasing = false;
let isRunning = false;

// Speed mapping (milliseconds delay per step)
const speedMap = {
  slow: 50,
  medium: 15,
  fast: 5,
  instant: 0
};

// Node Definition
class Node {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.isStart = row === START_ROW && col === START_COL;
    this.isTarget = row === TARGET_ROW && col === TARGET_COL;
    this.isWall = false;
    this.isVisited = false;
    this.distance = Infinity;
    this.gScore = Infinity; // For A*
    this.fScore = Infinity; // For A*
    this.previousNode = null;
  }
}

// Initialise the grid and DOM elements
function initGrid() {
  if (isRunning) return;
  
  const container = document.getElementById('grid-container');
  container.innerHTML = '';
  grid = [];

  // Set grid template columns dynamically
  container.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      const node = new Node(r, c);
      row.push(node);

      // Create cell element
      const cell = document.createElement('div');
      cell.id = `cell-${r}-${c}`;
      cell.classList.add('grid-cell');
      if (node.isStart) cell.classList.add('cell-start');
      if (node.isTarget) cell.classList.add('cell-target');

      // Mouse Event Listeners for drawing walls and moving nodes
      cell.addEventListener('mousedown', (e) => handleMouseDown(r, c, e));
      cell.addEventListener('mouseenter', () => handleMouseEnter(r, c));
      cell.addEventListener('mouseup', () => handleMouseUp());

      container.appendChild(cell);
    }
    grid.push(row);
  }
}

// Mouse Event Handlers
function handleMouseDown(row, col, e) {
  if (isRunning) return;
  e.preventDefault();
  isDrawing = true;

  const node = grid[row][col];
  if (node.isStart) {
    isMovingStart = true;
  } else if (node.isTarget) {
    isMovingTarget = true;
  } else {
    // If it's a wall, click to erase it. If empty, click to draw a wall.
    isErasing = node.isWall;
    toggleWall(row, col);
  }
}

function handleMouseEnter(row, col) {
  if (!isDrawing || isRunning) return;

  const node = grid[row][col];
  const cell = document.getElementById(`cell-${row}-${col}`);

  if (isMovingStart) {
    if (node.isTarget || node.isWall) return; // Prevent overlapping target or wall
    
    // Clear old start
    const oldStartCell = document.getElementById(`cell-${START_ROW}-${START_COL}`);
    oldStartCell.classList.remove('cell-start');
    grid[START_ROW][START_COL].isStart = false;

    // Set new start
    START_ROW = row;
    START_COL = col;
    node.isStart = true;
    cell.classList.add('cell-start');
  } else if (isMovingTarget) {
    if (node.isStart || node.isWall) return; // Prevent overlapping start or wall
    
    // Clear old target
    const oldTargetCell = document.getElementById(`cell-${TARGET_ROW}-${TARGET_COL}`);
    oldTargetCell.classList.remove('cell-target');
    grid[TARGET_ROW][TARGET_COL].isTarget = false;

    // Set new target
    TARGET_ROW = row;
    TARGET_COL = col;
    node.isTarget = true;
    cell.classList.add('cell-target');
  } else {
    // Drawing or erasing walls
    if (node.isStart || node.isTarget) return;
    
    if (isErasing) {
      if (node.isWall) {
        node.isWall = false;
        cell.classList.remove('cell-wall');
      }
    } else {
      if (!node.isWall) {
        node.isWall = true;
        cell.classList.add('cell-wall');
      }
    }
  }
}

function handleMouseUp() {
  isDrawing = false;
  isMovingStart = false;
  isMovingTarget = false;
  isErasing = false;
}

function toggleWall(row, col) {
  const node = grid[row][col];
  if (node.isStart || node.isTarget) return;

  node.isWall = !node.isWall;
  const cell = document.getElementById(`cell-${row}-${col}`);
  cell.classList.toggle('cell-wall');
}

// Global MouseUp listener to stop drawing if released outside grid
window.addEventListener('mouseup', () => {
  handleMouseUp();
});

// Clear Board (removes visited states and paths, leaves walls)
function clearVisuals() {
  if (isRunning) return;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = grid[r][c];
      node.isVisited = false;
      node.distance = Infinity;
      node.gScore = Infinity;
      node.fScore = Infinity;
      node.previousNode = null;

      const cell = document.getElementById(`cell-${r}-${c}`);
      cell.classList.remove('cell-visited', 'cell-visited-instant', 'cell-shortest-path', 'cell-shortest-path-instant');
    }
  }
}

// Clear Board entirely (including walls)
function clearBoard() {
  if (isRunning) return;
  
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = grid[r][c];
      node.isWall = false;
      node.isVisited = false;
      node.distance = Infinity;
      node.gScore = Infinity;
      node.fScore = Infinity;
      node.previousNode = null;

      const cell = document.getElementById(`cell-${r}-${c}`);
      cell.className = 'grid-cell';
      if (node.isStart) cell.classList.add('cell-start');
      if (node.isTarget) cell.classList.add('cell-target');
    }
  }
}

// Clear Walls only
function clearWalls() {
  if (isRunning) return;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = grid[r][c];
      if (node.isWall) {
        node.isWall = false;
        const cell = document.getElementById(`cell-${r}-${c}`);
        cell.classList.remove('cell-wall');
      }
    }
  }
}

// Generate Maze (Randomized Obstacles)
function generateRandomMaze() {
  if (isRunning) return;
  clearBoard();

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = grid[r][c];
      if (node.isStart || node.isTarget) continue;

      // 30% wall density
      if (Math.random() < 0.3) {
        node.isWall = true;
        const cell = document.getElementById(`cell-${r}-${c}`);
        cell.classList.add('cell-wall');
      }
    }
  }
}

// GET NEIGHBORS (Up, Down, Left, Right)
function getNeighbors(node) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < COLS - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isWall);
}

// ==========================================
// PATHFINDING ALGORITHMS
// ==========================================

// Dijkstra
function runDijkstra() {
  const visitedNodesInOrder = [];
  const startNode = grid[START_ROW][START_COL];
  startNode.distance = 0;

  const unvisitedNodes = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      unvisitedNodes.push(grid[r][c]);
    }
  }

  while (unvisitedNodes.length > 0) {
    // Sort by shortest distance
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift();

    // If we reach a wall, skip
    if (closestNode.isWall) continue;
    // If closest distance is infinity, we are trapped
    if (closestNode.distance === Infinity) break;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Stop if target reached
    if (closestNode.row === TARGET_ROW && closestNode.col === TARGET_COL) {
      break;
    }

    const neighbors = getNeighbors(closestNode);
    for (const neighbor of neighbors) {
      const tentativeDistance = closestNode.distance + 1;
      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.previousNode = closestNode;
      }
    }
  }
  return visitedNodesInOrder;
}

// A* Search
function runAStar() {
  const visitedNodesInOrder = [];
  const startNode = grid[START_ROW][START_COL];
  const targetNode = grid[TARGET_ROW][TARGET_COL];

  startNode.gScore = 0;
  startNode.fScore = manhattanDistance(startNode, targetNode);

  const openSet = [startNode];

  while (openSet.length > 0) {
    // Sort openSet by fScore
    openSet.sort((a, b) => a.fScore - b.fScore);
    const current = openSet.shift();

    if (current.isWall) continue;
    
    current.isVisited = true;
    visitedNodesInOrder.push(current);

    if (current.row === TARGET_ROW && current.col === TARGET_COL) {
      break;
    }

    const neighbors = getNeighbors(current);
    for (const neighbor of neighbors) {
      const tentativeGScore = current.gScore + 1;
      if (tentativeGScore < neighbor.gScore) {
        neighbor.previousNode = current;
        neighbor.gScore = tentativeGScore;
        neighbor.fScore = neighbor.gScore + manhattanDistance(neighbor, targetNode);
        
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  return visitedNodesInOrder;
}

function manhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

// BFS (Breadth-First Search)
function runBFS() {
  const visitedNodesInOrder = [];
  const startNode = grid[START_ROW][START_COL];
  startNode.isVisited = true;
  
  const queue = [startNode];

  while (queue.length > 0) {
    const current = queue.shift();
    visitedNodesInOrder.push(current);

    if (current.row === TARGET_ROW && current.col === TARGET_COL) {
      break;
    }

    const neighbors = getNeighbors(current);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.previousNode = current;
        queue.push(neighbor);
      }
    }
  }
  return visitedNodesInOrder;
}

// DFS (Depth-First Search)
function runDFS() {
  const visitedNodesInOrder = [];
  const startNode = grid[START_ROW][START_COL];
  const stack = [startNode];

  while (stack.length > 0) {
    const current = stack.pop();

    if (current.isVisited) continue;
    
    current.isVisited = true;
    visitedNodesInOrder.push(current);

    if (current.row === TARGET_ROW && current.col === TARGET_COL) {
      break;
    }

    const neighbors = getNeighbors(current);
    // Reverse neighbors to explore top/left first
    neighbors.reverse();
    
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        neighbor.previousNode = current;
        stack.push(neighbor);
      }
    }
  }
  return visitedNodesInOrder;
}

// Retrieve shortest path nodes in sequence
function getShortestPath() {
  const shortestPath = [];
  let current = grid[TARGET_ROW][TARGET_COL];
  while (current !== null) {
    shortestPath.unshift(current);
    current = current.previousNode;
  }
  return shortestPath;
}

// ==========================================
// ANIMATION COORDINATION
// ==========================================

function animatePathfinding(visitedNodes, shortestPath, speedDelay) {
  let i = 0;

  function animateStep() {
    if (i < visitedNodes.length) {
      const node = visitedNodes[i];
      if (!node.isStart && !node.isTarget) {
        const cell = document.getElementById(`cell-${node.row}-${node.col}`);
        if (speedDelay === 0) {
          cell.classList.add('cell-visited-instant');
        } else {
          cell.classList.add('cell-visited');
        }
      }
      i++;
      if (speedDelay === 0) {
        animateStep(); // Loop instantly
      } else {
        setTimeout(animateStep, speedDelay);
      }
    } else {
      animateShortestPath(shortestPath, speedDelay);
    }
  }

  animateStep();
}

function animateShortestPath(shortestPath, speedDelay) {
  let i = 0;

  function animateStep() {
    if (i < shortestPath.length) {
      const node = shortestPath[i];
      if (!node.isStart && !node.isTarget) {
        const cell = document.getElementById(`cell-${node.row}-${node.col}`);
        if (speedDelay === 0) {
          cell.classList.add('cell-shortest-path-instant');
        } else {
          cell.classList.add('cell-shortest-path');
        }
      }
      i++;
      if (speedDelay === 0) {
        animateStep();
      } else {
        setTimeout(animateStep, speedDelay * 3); // Slightly slower path draw
      }
    } else {
      // Completed!
      setControlsDisabled(false);
      isRunning = false;
    }
  }

  animateStep();
}

// Helper to disable UI controls during animation
function setControlsDisabled(disabled) {
  document.getElementById('algo-pathfinding').disabled = disabled;
  document.getElementById('speed-pathfinding').disabled = disabled;
  document.getElementById('btn-visualize-pathfinding').disabled = disabled;
  document.getElementById('btn-maze-pathfinding').disabled = disabled;
  document.getElementById('btn-clear-walls').disabled = disabled;
  document.getElementById('btn-clear-board').disabled = disabled;
  document.getElementById('tab-sorting').disabled = disabled;
}

// Main visualization trigger
function startPathfinding() {
  if (isRunning) return;
  
  clearVisuals();
  isRunning = true;
  setControlsDisabled(true);

  const algorithm = document.getElementById('algo-pathfinding').value;
  const speed = document.getElementById('speed-pathfinding').value;
  const speedDelay = speedMap[speed];

  let visitedNodes = [];

  switch (algorithm) {
    case 'dijkstra':
      visitedNodes = runDijkstra();
      break;
    case 'astar':
      visitedNodes = runAStar();
      break;
    case 'bfs':
      visitedNodes = runBFS();
      break;
    case 'dfs':
      visitedNodes = runDFS();
      break;
  }

  const shortestPath = getShortestPath();

  // If no path is found, shortestPath will contain only start (since target was not reached)
  const targetReached = visitedNodes.some(node => node.row === TARGET_ROW && node.col === TARGET_COL);

  animatePathfinding(visitedNodes, targetReached ? shortestPath : [], speedDelay);
}

// Event Listeners for Pathfinding controls
document.addEventListener('DOMContentLoaded', () => {
  initGrid();

  document.getElementById('btn-visualize-pathfinding').addEventListener('click', startPathfinding);
  document.getElementById('btn-maze-pathfinding').addEventListener('click', generateRandomMaze);
  document.getElementById('btn-clear-walls').addEventListener('click', clearWalls);
  document.getElementById('btn-clear-board').addEventListener('click', clearBoard);
});
