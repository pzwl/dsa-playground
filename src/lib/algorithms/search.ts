import { AlgorithmResult } from '../../types';

export function linearSearch(arr: number[], target: number): AlgorithmResult {
  const steps = [];
  const originalArray = [...arr];
  
  for (let i = 0; i < arr.length; i++) {
    steps.push({
      description: `Checking element at index ${i}: ${arr[i]}`,
      state: {
        array: [...arr],
        target,
        currentIndex: i,
        found: false
      },
      highlighting: [i],
      currentIndex: i,
      comparison: true
    });
    
    if (arr[i] === target) {
      steps.push({
        description: `Found target ${target} at index ${i}!`,
        state: {
          array: [...arr],
          target,
          currentIndex: i,
          found: true
        },
        highlighting: [i],
        currentIndex: i,
        completed: true
      });
      
      return {
        steps,
        finalState: {
          array: originalArray,
          target,
          found: true,
          index: i
        },
        complexity: {
          time: "O(n)",
          space: "O(1)"
        },
        operationCount: i + 1
      };
    }
  }
  
  steps.push({
    description: `Target ${target} not found in the array`,
    state: {
      array: [...arr],
      target,
      currentIndex: -1,
      found: false
    },
    highlighting: [],
    completed: true
  });
  
  return {
    steps,
    finalState: {
      array: originalArray,
      target,
      found: false,
      index: -1
    },
    complexity: {
      time: "O(n)",
      space: "O(1)"
    },
    operationCount: arr.length
  };
}

export function binarySearch(arr: number[], target: number): AlgorithmResult {
  const steps = [];
  
  // First, we need to sort the array for binary search
  const sortedArray = [...arr].sort((a, b) => a - b);
  
  steps.push({
    description: 'Binary search requires a sorted array. Array has been sorted.',
    state: {
      array: [...sortedArray],
      target,
      left: 0,
      right: sortedArray.length - 1,
      mid: -1,
      found: false
    },
    highlighting: [],
    comparison: false
  });
  
  let left = 0;
  let right = sortedArray.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    steps.push({
      description: `Checking middle element at index ${mid}: ${sortedArray[mid]}`,
      state: {
        array: [...sortedArray],
        target,
        left,
        right,
        mid,
        found: false
      },
      highlighting: [mid],
      currentIndex: mid,
      comparison: true
    });
    
    if (sortedArray[mid] === target) {
      steps.push({
        description: `Found target ${target} at index ${mid}!`,
        state: {
          array: [...sortedArray],
          target,
          left,
          right,
          mid,
          found: true
        },
        highlighting: [mid],
        currentIndex: mid,
        completed: true
      });
      
      return {
        steps,
        finalState: {
          array: sortedArray,
          target,
          found: true,
          index: mid
        },
        complexity: {
          time: "O(log n)",
          space: "O(1)"
        },
        operationCount: steps.length
      };
    }
    
    if (sortedArray[mid] < target) {
      steps.push({
        description: `${sortedArray[mid]} < ${target}, search right half`,
        state: {
          array: [...sortedArray],
          target,
          left: mid + 1,
          right,
          mid: -1,
          found: false
        },
        highlighting: Array.from({ length: right - (mid + 1) + 1 }, (_, i) => mid + 1 + i)
      });
      left = mid + 1;
    } else {
      steps.push({
        description: `${sortedArray[mid]} > ${target}, search left half`,
        state: {
          array: [...sortedArray],
          target,
          left,
          right: mid - 1,
          mid: -1,
          found: false
        },
        highlighting: Array.from({ length: (mid - 1) - left + 1 }, (_, i) => left + i)
      });
      right = mid - 1;
    }
  }
  
  steps.push({
    description: `Target ${target} not found in the array`,
    state: {
      array: [...sortedArray],
      target,
      left,
      right,
      mid: -1,
      found: false
    },
    highlighting: [],
    completed: true
  });
  
  return {
    steps,
    finalState: {
      array: sortedArray,
      target,
      found: false,
      index: -1
    },
    complexity: {
      time: "O(log n)",
      space: "O(1)"
    },
    operationCount: steps.length
  };
}
