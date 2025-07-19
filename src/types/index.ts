export interface AlgorithmStep {
  description: string;
  state: number[];
  highlighting?: number[];
  comparison?: boolean;
  swapIndices?: [number, number];
  currentIndex?: number;
  completed?: boolean;
}

export interface AlgorithmResult {
  steps: AlgorithmStep[];
  finalState: number[];
  complexity: {
    time: string;
    space: string;
  };
  operationCount: number;
}

export interface SearchResult {
  array: number[];
  found: boolean;
  index: number;
}

export interface SortingVisualizationProps {
  array: number[];
  currentStep?: number;
  highlightIndices?: number[];
  comparisonIndices?: number[];
  swapIndices?: [number, number];
  isPlaying?: boolean;
  speed?: number;
}

export interface SearchVisualizationProps {
  array: number[];
  target: number;
  currentStep?: number;
  highlightIndices?: number[];
  foundIndex?: number;
  isPlaying?: boolean;
  speed?: number;
}

export interface AlgorithmCategory {
  id: string;
  name: string;
  description: string;
  algorithms: Algorithm[];
  icon: string;
  color: string;
}

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  category: string;
}

export interface VisualizationControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
}
