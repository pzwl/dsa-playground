'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation, Play, RotateCcw, Settings, Zap, Timer, Target, Eye, Square, MousePointer } from 'lucide-react';

// Grid cell types
enum CellType {
  EMPTY = 'empty',
  WALL = 'wall',
  START = 'start',
  END = 'end',
  VISITED = 'visited',
  PATH = 'path',
  CURRENT = 'current',
  FRONTIER = 'frontier'
}

// Algorithm types
type AlgorithmType = 'dijkstra' | 'astar' | 'bfs' | 'dfs';

// Grid cell interface
interface GridCell {
  row: number;
  col: number;
  type: CellType;
  distance: number;
  heuristic: number;
  fScore: number;
  previous: GridCell | null;
  visited: boolean;
}

// Algorithm step interface
interface AlgorithmStep {
  description: string;
  currentCell: { row: number; col: number } | null;
  visitedCells: { row: number; col: number }[];
  frontierCells: { row: number; col: number }[];
  pathCells: { row: number; col: number }[];
  distances: Map<string, number>;
}

// Algorithm results interface
interface AlgorithmResult {
  steps: AlgorithmStep[];
  finalPath: { row: number; col: number }[];
  pathLength: number;
  cellsExplored: number;
  success: boolean;
  executionTime: number; // in milliseconds
  memoryUsage: number; // approximate memory usage
  efficiency: number; // path length / cells explored ratio
}

// Performance metrics interface
interface PerformanceMetrics {
  algorithmTime: number;
  animationTime: number;
  totalSteps: number;
  stepsPerSecond: number;
  gridSize: number;
  pathOptimality: number; // how close to theoretical minimum
}

const GRID_ROWS = 25;
const GRID_COLS = 50;
const CELL_SIZE = 20;

export default function GPSNavigationPage() {
  const [mounted, setMounted] = useState(false);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [startPos, setStartPos] = useState<{ row: number; col: number }>({ row: 12, col: 5 });
  const [endPos, setEndPos] = useState<{ row: number; col: number }>({ row: 12, col: 45 });
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('dijkstra');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [speed, setSpeed] = useState(50); // Animation speed (1-100)
  const [drawMode, setDrawMode] = useState<'wall' | 'start' | 'end'>('wall');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [currentWallState, setCurrentWallState] = useState<CellType | null>(null);
  const [showDetails, setShowDetails] = useState(true);
  const animationRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isRunningRef = useRef(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const algorithmStartTime = useRef<number>(0);
  const animationStartTime = useRef<number>(0);

  // Reconstruct path from end to start
  const reconstructPath = useCallback((endCell: GridCell): { row: number; col: number }[] => {
    const path: { row: number; col: number }[] = [];
    let current: GridCell | null = endCell;

    while (current !== null) {
      path.unshift({ row: current.row, col: current.col });
      current = current.previous;
    }

    return path;
  }, []);

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid: GridCell[][] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: GridCell[] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        let cellType = CellType.EMPTY;
        
        // Set start and end positions
        if (row === startPos.row && col === startPos.col) {
          cellType = CellType.START;
        } else if (row === endPos.row && col === endPos.col) {
          cellType = CellType.END;
        }

        currentRow.push({
          row,
          col,
          type: cellType,
          distance: Infinity,
          heuristic: 0,
          fScore: Infinity,
          previous: null,
          visited: false
        });
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
  }, [startPos, endPos]);

  // Initialize grid on component mount
  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset grid to initial state
  const resetGrid = useCallback(() => {
    // Stop any running animation first
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = undefined;
    }
    setIsRunning(false);
    isRunningRef.current = false;
    
    setGrid(prevGrid => {
      return prevGrid.map(row =>
        row.map(cell => ({
          ...cell,
          type: cell.type === CellType.WALL ? CellType.WALL :
                cell.row === startPos.row && cell.col === startPos.col ? CellType.START :
                cell.row === endPos.row && cell.col === endPos.col ? CellType.END :
                CellType.EMPTY,
          distance: Infinity,
          heuristic: 0,
          fScore: Infinity,
          previous: null,
          visited: false
        }))
      );
    });
    setSteps([]);
    setCurrentStep(0);
    setResult(null);
  }, [startPos, endPos]);

  // Clear walls only
  const clearWalls = useCallback(() => {
    // Stop any running animation first
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = undefined;
    }
    setIsRunning(false);
    isRunningRef.current = false;
    
    setGrid(prevGrid => {
      return prevGrid.map(row =>
        row.map(cell => ({
          ...cell,
          type: cell.type === CellType.WALL ? CellType.EMPTY : cell.type
        }))
      );
    });
  }, []);

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number) => {
    if (isRunning) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => [...r]);
      const cell = newGrid[row][col];

      switch (drawMode) {
        case 'start':
          if (cell.type !== CellType.END) {
            // Clear old start
            newGrid.forEach(r => r.forEach(c => {
              if (c.type === CellType.START) c.type = CellType.EMPTY;
            }));
            cell.type = CellType.START;
            setStartPos({ row, col });
          }
          break;
        case 'end':
          if (cell.type !== CellType.START) {
            // Clear old end
            newGrid.forEach(r => r.forEach(c => {
              if (c.type === CellType.END) c.type = CellType.EMPTY;
            }));
            cell.type = CellType.END;
            setEndPos({ row, col });
          }
          break;
        case 'wall':
          if (cell.type === CellType.EMPTY) {
            cell.type = CellType.WALL;
          } else if (cell.type === CellType.WALL) {
            cell.type = CellType.EMPTY;
          }
          break;
      }
      
      return newGrid;
    });
  }, [drawMode, isRunning]);

  // Handle mouse events for drawing
  const handleMouseDown = useCallback((row: number, col: number) => {
    setIsMouseDown(true);
    
    if (drawMode === 'wall') {
      // Determine what state we'll apply based on the clicked cell
      const cell = grid[row][col];
      const newState = cell.type === CellType.WALL ? CellType.EMPTY : CellType.WALL;
      setCurrentWallState(newState);
      
      // Apply the new state to the clicked cell
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(r => [...r]);
        newGrid[row][col] = { ...newGrid[row][col], type: newState };
        return newGrid;
      });
    } else {
      handleCellClick(row, col);
    }
  }, [handleCellClick, drawMode, grid]);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (isMouseDown && drawMode === 'wall' && currentWallState !== null) {
      // Apply the current wall state (don't toggle)
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(r => [...r]);
        const cell = newGrid[row][col];
        
        // Only update if it's not start/end position and different from current state
        if (cell.type !== CellType.START && cell.type !== CellType.END && cell.type !== currentWallState) {
          newGrid[row][col] = { ...newGrid[row][col], type: currentWallState };
        }
        return newGrid;
      });
    }
  }, [isMouseDown, drawMode, currentWallState]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    setCurrentWallState(null);
  }, []);

  // Heuristic function for A*
  const calculateHeuristic = useCallback((cell: GridCell, end: { row: number; col: number }): number => {
    // Manhattan distance
    return Math.abs(cell.row - end.row) + Math.abs(cell.col - end.col);
  }, []);

  // Get neighbors of a cell
  const getNeighbors = useCallback((grid: GridCell[][], cell: GridCell): GridCell[] => {
    const neighbors: GridCell[] = [];
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
    ];

    for (const [dr, dc] of directions) {
      const newRow = cell.row + dr;
      const newCol = cell.col + dc;

      if (
        newRow >= 0 && newRow < GRID_ROWS &&
        newCol >= 0 && newCol < GRID_COLS &&
        grid[newRow][newCol].type !== CellType.WALL
      ) {
        neighbors.push(grid[newRow][newCol]);
      }
    }

    return neighbors;
  }, []);

  // Dijkstra's Algorithm
  const dijkstraAlgorithm = useCallback((grid: GridCell[][]): AlgorithmResult => {
    const startTime = performance.now();
    const steps: AlgorithmStep[] = [];
    const visitedCells: { row: number; col: number }[] = [];
    const unvisited: GridCell[] = [];
    const distances = new Map<string, number>();

    // Initialize
    grid.forEach(row => {
      row.forEach(cell => {
        cell.distance = cell.type === CellType.START ? 0 : Infinity;
        cell.previous = null;
        cell.visited = false;
        unvisited.push(cell);
        distances.set(`${cell.row}-${cell.col}`, cell.distance);
      });
    });

    steps.push({
      description: `Starting Dijkstra's algorithm from (${startPos.row}, ${startPos.col})`,
      currentCell: startPos,
      visitedCells: [],
      frontierCells: [startPos],
      pathCells: [],
      distances: new Map(distances)
    });

    let cellsExplored = 0;

    while (unvisited.length > 0) {
      // Find unvisited cell with minimum distance
      const current = unvisited.reduce((min, cell) => 
        cell.distance < min.distance ? cell : min
      );

      if (current.distance === Infinity) break;

      // Remove from unvisited
      const index = unvisited.indexOf(current);
      unvisited.splice(index, 1);
      
      current.visited = true;
      visitedCells.push({ row: current.row, col: current.col });
      cellsExplored++;

      // Check if we reached the end
      if (current.row === endPos.row && current.col === endPos.col) {
        const path = reconstructPath(current);
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        steps.push({
          description: `Found shortest path! Distance: ${current.distance}`,
          currentCell: { row: current.row, col: current.col },
          visitedCells: [...visitedCells],
          frontierCells: [],
          pathCells: path,
          distances: new Map(distances)
        });

        // Calculate efficiency
        const efficiency = cellsExplored > 0 ? path.length / cellsExplored : 0;

        return {
          steps,
          finalPath: path,
          pathLength: current.distance,
          cellsExplored,
          success: true,
          executionTime,
          memoryUsage: steps.length * 100 + unvisited.length * 50, // Approximate bytes
          efficiency
        };
      }

      // Update neighbors
      const neighbors = getNeighbors(grid, current);
      const frontierCells: { row: number; col: number }[] = [];

      for (const neighbor of neighbors) {
        const newDistance = current.distance + 1; // Each step costs 1

        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previous = current;
          distances.set(`${neighbor.row}-${neighbor.col}`, newDistance);
          
          if (!neighbor.visited) {
            frontierCells.push({ row: neighbor.row, col: neighbor.col });
          }
        }
      }

      steps.push({
        description: `Exploring (${current.row}, ${current.col}). Distance: ${current.distance}. Updated ${frontierCells.length} neighbors.`,
        currentCell: { row: current.row, col: current.col },
        visitedCells: [...visitedCells],
        frontierCells,
        pathCells: [],
        distances: new Map(distances)
      });
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    return {
      steps,
      finalPath: [],
      pathLength: -1,
      cellsExplored,
      success: false,
      executionTime,
      memoryUsage: steps.length * 100 + unvisited.length * 50,
      efficiency: 0
    };
  }, [startPos, endPos, getNeighbors, reconstructPath]);

  // A* Algorithm
  const astarAlgorithm = useCallback((grid: GridCell[][]): AlgorithmResult => {
    const startTime = performance.now();
    const steps: AlgorithmStep[] = [];
    const openSet: GridCell[] = [];
    const closedSet: Set<GridCell> = new Set();
    const visitedCells: { row: number; col: number }[] = [];
    const distances = new Map<string, number>();

    // Initialize
    const startCell = grid[startPos.row][startPos.col];
    startCell.distance = 0; // g score
    startCell.heuristic = calculateHeuristic(startCell, endPos);
    startCell.fScore = startCell.distance + startCell.heuristic;
    
    openSet.push(startCell);
    distances.set(`${startCell.row}-${startCell.col}`, 0);

    steps.push({
      description: `Starting A* algorithm. Using Manhattan distance heuristic.`,
      currentCell: startPos,
      visitedCells: [],
      frontierCells: [startPos],
      pathCells: [],
      distances: new Map(distances)
    });

    let cellsExplored = 0;

    while (openSet.length > 0) {
      // Find node with lowest fScore
      const current = openSet.reduce((min, cell) => 
        cell.fScore < min.fScore ? cell : min
      );

      // Remove current from openSet
      const index = openSet.indexOf(current);
      openSet.splice(index, 1);
      closedSet.add(current);
      
      visitedCells.push({ row: current.row, col: current.col });
      cellsExplored++;

      // Check if we reached the goal
      if (current.row === endPos.row && current.col === endPos.col) {
        const path = reconstructPath(current);
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        const efficiency = cellsExplored > 0 ? path.length / cellsExplored : 0;
        
        steps.push({
          description: `A* found optimal path! Total cost: ${current.distance}`,
          currentCell: { row: current.row, col: current.col },
          visitedCells: [...visitedCells],
          frontierCells: [],
          pathCells: path,
          distances: new Map(distances)
        });

        return {
          steps,
          finalPath: path,
          pathLength: current.distance,
          cellsExplored,
          success: true,
          executionTime,
          memoryUsage: steps.length * 100 + openSet.length * 60,
          efficiency
        };
      }

      // Explore neighbors
      const neighbors = getNeighbors(grid, current);
      const frontierCells: { row: number; col: number }[] = [];

      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor)) continue;

        const tentativeGScore = current.distance + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
          frontierCells.push({ row: neighbor.row, col: neighbor.col });
        } else if (tentativeGScore >= neighbor.distance) {
          continue; // This path is worse
        }

        // This path is better
        neighbor.previous = current;
        neighbor.distance = tentativeGScore;
        neighbor.heuristic = calculateHeuristic(neighbor, endPos);
        neighbor.fScore = neighbor.distance + neighbor.heuristic;
        distances.set(`${neighbor.row}-${neighbor.col}`, neighbor.distance);
      }

      steps.push({
        description: `A* exploring (${current.row}, ${current.col}). f=${current.fScore.toFixed(1)} (g=${current.distance} + h=${current.heuristic.toFixed(1)})`,
        currentCell: { row: current.row, col: current.col },
        visitedCells: [...visitedCells],
        frontierCells,
        pathCells: [],
        distances: new Map(distances)
      });
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    return {
      steps,
      finalPath: [],
      pathLength: -1,
      cellsExplored,
      success: false,
      executionTime,
      memoryUsage: steps.length * 100 + openSet.length * 60,
      efficiency: 0
    };
  }, [startPos, endPos, getNeighbors, calculateHeuristic, reconstructPath]);

  // BFS Algorithm
  const bfsAlgorithm = useCallback((grid: GridCell[][]): AlgorithmResult => {
    const startTime = performance.now();
    const steps: AlgorithmStep[] = [];
    const queue: GridCell[] = [];
    const visited: Set<GridCell> = new Set();
    const visitedCells: { row: number; col: number }[] = [];
    const distances = new Map<string, number>();

    // Initialize
    const startCell = grid[startPos.row][startPos.col];
    startCell.distance = 0;
    queue.push(startCell);
    visited.add(startCell);
    distances.set(`${startCell.row}-${startCell.col}`, 0);

    steps.push({
      description: `Starting BFS (Breadth-First Search). Guarantees shortest path in unweighted grids.`,
      currentCell: startPos,
      visitedCells: [],
      frontierCells: [startPos],
      pathCells: [],
      distances: new Map(distances)
    });

    let cellsExplored = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      visitedCells.push({ row: current.row, col: current.col });
      cellsExplored++;

      // Check if we reached the goal
      if (current.row === endPos.row && current.col === endPos.col) {
        const path = reconstructPath(current);
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        const efficiency = cellsExplored > 0 ? path.length / cellsExplored : 0;
        
        steps.push({
          description: `BFS found shortest path! Path length: ${current.distance}`,
          currentCell: { row: current.row, col: current.col },
          visitedCells: [...visitedCells],
          frontierCells: [],
          pathCells: path,
          distances: new Map(distances)
        });

        return {
          steps,
          finalPath: path,
          pathLength: current.distance,
          cellsExplored,
          success: true,
          executionTime,
          memoryUsage: steps.length * 100 + queue.length * 40,
          efficiency
        };
      }

      // Explore neighbors
      const neighbors = getNeighbors(grid, current);
      const frontierCells: { row: number; col: number }[] = [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          neighbor.distance = current.distance + 1;
          neighbor.previous = current;
          queue.push(neighbor);
          frontierCells.push({ row: neighbor.row, col: neighbor.col });
          distances.set(`${neighbor.row}-${neighbor.col}`, neighbor.distance);
        }
      }

      steps.push({
        description: `BFS exploring (${current.row}, ${current.col}). Distance: ${current.distance}. Added ${frontierCells.length} to queue.`,
        currentCell: { row: current.row, col: current.col },
        visitedCells: [...visitedCells],
        frontierCells,
        pathCells: [],
        distances: new Map(distances)
      });
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    return {
      steps,
      finalPath: [],
      pathLength: -1,
      cellsExplored,
      success: false,
      executionTime,
      memoryUsage: steps.length * 100 + queue.length * 40,
      efficiency: 0
    };
  }, [startPos, endPos, getNeighbors, reconstructPath]);

  // DFS Algorithm
  const dfsAlgorithm = useCallback((grid: GridCell[][]): AlgorithmResult => {
    const startTime = performance.now();
    const steps: AlgorithmStep[] = [];
    const stack: GridCell[] = [];
    const visited: Set<GridCell> = new Set();
    const visitedCells: { row: number; col: number }[] = [];
    const distances = new Map<string, number>();

    // Initialize
    const startCell = grid[startPos.row][startPos.col];
    startCell.distance = 0;
    stack.push(startCell);
    distances.set(`${startCell.row}-${startCell.col}`, 0);

    steps.push({
      description: `Starting DFS (Depth-First Search). Explores as far as possible before backtracking.`,
      currentCell: startPos,
      visitedCells: [],
      frontierCells: [startPos],
      pathCells: [],
      distances: new Map(distances)
    });

    let cellsExplored = 0;

    while (stack.length > 0) {
      const current = stack.pop()!;
      
      if (visited.has(current)) continue;
      
      visited.add(current);
      visitedCells.push({ row: current.row, col: current.col });
      cellsExplored++;

      // Check if we reached the goal
      if (current.row === endPos.row && current.col === endPos.col) {
        const path = reconstructPath(current);
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        const efficiency = cellsExplored > 0 ? path.length / cellsExplored : 0;
        
        steps.push({
          description: `DFS found a path! Path length: ${current.distance}`,
          currentCell: { row: current.row, col: current.col },
          visitedCells: [...visitedCells],
          frontierCells: [],
          pathCells: path,
          distances: new Map(distances)
        });

        return {
          steps,
          finalPath: path,
          pathLength: current.distance,
          cellsExplored,
          success: true,
          executionTime,
          memoryUsage: steps.length * 100 + stack.length * 30,
          efficiency
        };
      }

      // Explore neighbors (in reverse order to maintain left-to-right preference)
      const neighbors = getNeighbors(grid, current).reverse();
      const frontierCells: { row: number; col: number }[] = [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          neighbor.distance = current.distance + 1;
          neighbor.previous = current;
          stack.push(neighbor);
          frontierCells.push({ row: neighbor.row, col: neighbor.col });
          distances.set(`${neighbor.row}-${neighbor.col}`, neighbor.distance);
        }
      }

      steps.push({
        description: `DFS exploring (${current.row}, ${current.col}). Distance: ${current.distance}. Added ${frontierCells.length} to stack.`,
        currentCell: { row: current.row, col: current.col },
        visitedCells: [...visitedCells],
        frontierCells,
        pathCells: [],
        distances: new Map(distances)
      });
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    return {
      steps,
      finalPath: [],
      pathLength: -1,
      cellsExplored,
      success: false,
      executionTime,
      memoryUsage: steps.length * 100 + stack.length * 30,
      efficiency: 0
    };
  }, [startPos, endPos, getNeighbors, reconstructPath]);

  // Animate through the algorithm steps
  const animateSteps = useCallback((algorithmSteps: AlgorithmStep[]) => {
    console.log("Starting animation with", algorithmSteps.length, "steps");
    animationStartTime.current = performance.now();
    let stepIndex = 0;

    const animate = () => {
      // Check if we should continue animation - use ref for current state
      if (stepIndex < algorithmSteps.length && isRunningRef.current) {
        console.log("Animating step", stepIndex + 1, "of", algorithmSteps.length);
        const step = algorithmSteps[stepIndex];
        setCurrentStep(stepIndex);

        // Update grid visualization
        setGrid(prevGrid => {
          const newGrid = prevGrid.map(row => [...row]);
          
          // Clear previous step visualizations (except walls, start, end)
          newGrid.forEach(row => {
            row.forEach(cell => {
              if (![CellType.WALL, CellType.START, CellType.END].includes(cell.type)) {
                cell.type = CellType.EMPTY;
              }
            });
          });

          // Apply current step visualization
          step.visitedCells.forEach(({ row, col }) => {
            if (newGrid[row][col].type === CellType.EMPTY) {
              newGrid[row][col].type = CellType.VISITED;
            }
          });

          step.frontierCells.forEach(({ row, col }) => {
            if (newGrid[row][col].type === CellType.EMPTY) {
              newGrid[row][col].type = CellType.FRONTIER;
            }
          });

          if (step.currentCell) {
            const { row, col } = step.currentCell;
            if (newGrid[row][col].type !== CellType.START && newGrid[row][col].type !== CellType.END) {
              newGrid[row][col].type = CellType.CURRENT;
            }
          }

          // Show final path if available
          step.pathCells.forEach(({ row, col }) => {
            if (newGrid[row][col].type !== CellType.START && newGrid[row][col].type !== CellType.END) {
              newGrid[row][col].type = CellType.PATH;
            }
          });

          return newGrid;
        });

        stepIndex++;
        
        // Calculate delay based on speed (1-100 -> 200ms-10ms)
        const delay = 210 - (speed * 2);
        
        // Continue animation
        animationRef.current = setTimeout(animate, delay);
      } else {
        // Animation completed or stopped
        console.log(stepIndex >= algorithmSteps.length ? "Animation completed" : "Animation stopped by user");
        
        if (stepIndex >= algorithmSteps.length && result) {
          // Calculate final performance metrics
          const animationEndTime = performance.now();
          const animationTime = animationEndTime - animationStartTime.current;
          const theoreticalMin = Math.abs(startPos.row - endPos.row) + Math.abs(startPos.col - endPos.col);
          
          const metrics: PerformanceMetrics = {
            algorithmTime: result.executionTime,
            animationTime,
            totalSteps: algorithmSteps.length,
            stepsPerSecond: algorithmSteps.length / (animationTime / 1000),
            gridSize: GRID_ROWS * GRID_COLS,
            pathOptimality: result.success ? (theoreticalMin / result.pathLength) * 100 : 0
          };
          
          setPerformanceMetrics(metrics);
        }
        
        setIsRunning(false);
        isRunningRef.current = false;
        animationRef.current = undefined;
      }
    };

    // Start the animation
    animate();
  }, [speed, result, startPos, endPos]);

  // Run the selected algorithm
  const runAlgorithm = useCallback(() => {
    if (isRunning) return;

    console.log("Starting algorithm:", algorithm);
    algorithmStartTime.current = performance.now();

    // Stop any existing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = undefined;
    }

    // Reset grid first
    resetGrid();
    
    // Set running state
    setIsRunning(true);
    isRunningRef.current = true;
    
    // Clear previous performance metrics
    setPerformanceMetrics(null);

    // Use setTimeout to ensure grid reset completes
    setTimeout(() => {
      // Get current grid state
      setGrid(currentGrid => {
        console.log("Running algorithm on grid:", currentGrid.length, "x", currentGrid[0]?.length);
        
        let algorithmResult: AlgorithmResult;

        switch (algorithm) {
          case 'dijkstra':
            algorithmResult = dijkstraAlgorithm(currentGrid);
            break;
          case 'astar':
            algorithmResult = astarAlgorithm(currentGrid);
            break;
          case 'bfs':
            algorithmResult = bfsAlgorithm(currentGrid);
            break;
          case 'dfs':
            algorithmResult = dfsAlgorithm(currentGrid);
            break;
          default:
            algorithmResult = dijkstraAlgorithm(currentGrid);
        }

        console.log("Algorithm completed. Steps:", algorithmResult.steps.length, "Success:", algorithmResult.success);

        setSteps(algorithmResult.steps);
        setResult(algorithmResult);
        
        // Start animation immediately
        if (algorithmResult.steps.length > 0) {
          animateSteps(algorithmResult.steps);
        } else {
          setIsRunning(false);
          isRunningRef.current = false;
        }

        return currentGrid; // Return unchanged grid
      });
    }, 100);
  }, [algorithm, isRunning, dijkstraAlgorithm, astarAlgorithm, bfsAlgorithm, dfsAlgorithm, resetGrid, animateSteps]);

  // Stop animation
  const stopAlgorithm = useCallback(() => {
    console.log("Stop button pressed");
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = undefined;
    }
    setIsRunning(false);
    isRunningRef.current = false;
  }, []);

  // Get cell color based on type
  const getCellColor = useCallback((cell: GridCell): string => {
    switch (cell.type) {
      case CellType.START:
        return '#10b981'; // Green
      case CellType.END:
        return '#ef4444'; // Red
      case CellType.WALL:
        return '#1f2937'; // Dark gray
      case CellType.VISITED:
        return '#fbbf24'; // Yellow
      case CellType.CURRENT:
        return '#3b82f6'; // Blue
      case CellType.FRONTIER:
        return '#8b5cf6'; // Purple
      case CellType.PATH:
        return '#06b6d4'; // Cyan
      default:
        return '#ffffff'; // White
    }
  }, []);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const currentStepData = steps[currentStep];
  const algorithmNames = {
    dijkstra: "Dijkstra's Algorithm",
    astar: "A* (A-Star)",
    bfs: "Breadth-First Search",
    dfs: "Depth-First Search"
  };

  const algorithmDescriptions = {
    dijkstra: "Finds shortest path by exploring cells in order of distance from start. Guarantees optimal path.",
    astar: "Uses heuristic (Manhattan distance) to guide search toward goal. Faster than Dijkstra while maintaining optimality.",
    bfs: "Explores all cells at distance n before moving to distance n+1. Guarantees shortest path in unweighted grids.",
    dfs: "Explores as far as possible before backtracking. Does not guarantee shortest path but uses less memory."
  };

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Navigation className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Pathfinding Algorithm Visualizer</h1>
            </div>
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Navigation className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Pathfinding Algorithm Visualizer</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Interactive grid-based pathfinding visualization. Click and drag to create walls, select start/end points, 
            then watch different algorithms find the optimal path step by step.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="xl:col-span-1 space-y-6">
            {/* Algorithm Selection */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Algorithm</h3>
              </div>
              
              <div className="space-y-3">
                {(Object.keys(algorithmNames) as AlgorithmType[]).map((algo) => (
                  <button
                    key={algo}
                    onClick={() => setAlgorithm(algo)}
                    disabled={isRunning}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      algorithm === algo
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-800'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-medium">{algorithmNames[algo]}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {algorithmDescriptions[algo]}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Drawing Tools */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MousePointer className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Drawing Mode</h3>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setDrawMode('wall')}
                  disabled={isRunning}
                  className={`w-full p-2 rounded-lg text-left transition-all flex items-center gap-2 ${
                    drawMode === 'wall'
                      ? 'bg-gray-100 border-2 border-gray-500 text-gray-800'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Square className="h-4 w-4" />
                  Draw Walls
                </button>
                
                <button
                  onClick={() => setDrawMode('start')}
                  disabled={isRunning}
                  className={`w-full p-2 rounded-lg text-left transition-all flex items-center gap-2 ${
                    drawMode === 'start'
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Target className="h-4 w-4" />
                  Place Start
                </button>
                
                <button
                  onClick={() => setDrawMode('end')}
                  disabled={isRunning}
                  className={`w-full p-2 rounded-lg text-left transition-all flex items-center gap-2 ${
                    drawMode === 'end'
                      ? 'bg-red-100 border-2 border-red-500 text-red-800'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Eye className="h-4 w-4" />
                  Place End
                </button>
              </div>
            </Card>

            {/* Controls */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Controls</h3>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={runAlgorithm}
                  disabled={isRunning}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Visualization
                </Button>

                <Button
                  onClick={stopAlgorithm}
                  disabled={!isRunning}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Stop
                </Button>

                <Button
                  onClick={resetGrid}
                  disabled={isRunning}
                  variant="outline"
                  className="w-full"
                >
                  Reset Grid
                </Button>

                <Button
                  onClick={clearWalls}
                  disabled={isRunning}
                  variant="outline"
                  className="w-full"
                >
                  Clear Walls
                </Button>
              </div>

              {/* Speed Control */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animation Speed: {speed}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  disabled={isRunning}
                  className="w-full"
                />
              </div>
            </Card>

            {/* Statistics */}
            {result && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Timer className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold">Algorithm Results</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={result.success ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {result.success ? 'Path Found' : 'No Path'}
                    </span>
                  </div>
                  {result.success && (
                    <>
                      <div className="flex justify-between">
                        <span>Path Length:</span>
                        <span className="font-medium">{result.pathLength} steps</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cells Explored:</span>
                        <span className="font-medium">{result.cellsExplored}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efficiency:</span>
                        <span className="font-medium">{(result.efficiency * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Algorithm Time:</span>
                        <span className="font-medium">{result.executionTime.toFixed(2)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory Usage:</span>
                        <span className="font-medium">{(result.memoryUsage / 1024).toFixed(1)}KB</span>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}

            {/* Nerdy Performance Stats */}
            {performanceMetrics && (
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-800">🤓 Performance Metrics</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Animation FPS:</span>
                    <span className="font-mono font-medium text-purple-900">
                      {performanceMetrics.stepsPerSecond.toFixed(1)} steps/sec
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Total Animation Time:</span>
                    <span className="font-mono font-medium text-purple-900">
                      {performanceMetrics.animationTime.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Grid Coverage:</span>
                    <span className="font-mono font-medium text-purple-900">
                      {((result?.cellsExplored || 0) / performanceMetrics.gridSize * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Path Optimality:</span>
                    <span className="font-mono font-medium text-purple-900">
                      {performanceMetrics.pathOptimality.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Algorithm/Animation:</span>
                    <span className="font-mono font-medium text-purple-900">
                      {(performanceMetrics.algorithmTime / performanceMetrics.animationTime).toFixed(3)}x
                    </span>
                  </div>
                  <div className="border-t border-purple-200 pt-2 mt-2">
                    <div className="text-xs text-purple-600">
                      💡 Lower exploration % = more efficient • Higher optimality % = better path
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Main Grid */}
          <div className="xl:col-span-3">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Grid Visualization</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>End</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-800 rounded"></div>
                    <span>Wall</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span>Visited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-400 rounded"></div>
                    <span>Path</span>
                  </div>
                </div>
              </div>
              
              {/* Grid */}
              <div 
                className="border border-gray-300 inline-block bg-white select-none"
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
                    gap: '1px',
                  }}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                          width: `${CELL_SIZE}px`,
                          height: `${CELL_SIZE}px`,
                          backgroundColor: getCellColor(cell),
                          border: '1px solid #e5e7eb',
                        }}
                        className="cursor-pointer hover:opacity-80 transition-all duration-100"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleMouseDown(rowIndex, colIndex);
                        }}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    ))
                  )}
                </div>
              </div>
              
              {/* Debug Info */}
              <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
                <div>Current Draw Mode: <strong>{drawMode}</strong></div>
                <div>Mouse Down: <strong>{isMouseDown ? 'Yes' : 'No'}</strong></div>
                <div>Current Wall State: <strong>{currentWallState || 'None'}</strong></div>
                <div>Is Running: <strong>{isRunning ? 'Yes' : 'No'}</strong></div>
              </div>
              
              {/* Step Description */}
              {currentStepData && showDetails && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-800">
                      Step {currentStep + 1} of {steps.length}
                    </h4>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-blue-700">{currentStepData.description}</p>
                </div>
              )}
              
              {!showDetails && steps.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Show step details
                  </button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
