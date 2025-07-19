import { AlgorithmResult, AlgorithmStep } from '@/types';

export function linearSearch(array: number[], target: number): AlgorithmResult {
  const steps: AlgorithmStep[] = [];
  const arr = [...array];
  let operationCount = 0;
  let found = false;
  let foundIndex = -1;

  steps.push({
    description: `Starting Linear Search for target value: ${target}`,
    state: [...arr],
    highlighting: []
  });

  for (let i = 0; i < arr.length; i++) {
    operationCount++;
    
    steps.push({
      description: `Checking element at index ${i}: ${arr[i]}`,
      state: [...arr],
      highlighting: [i],
      comparison: true,
      currentIndex: i
    });

    if (arr[i] === target) {
      found = true;
      foundIndex = i;
      
      steps.push({
        description: `✅ Found target ${target} at index ${i}!`,
        state: [...arr],
        highlighting: [i],
        completed: true
      });
      break;
    } else {
      steps.push({
        description: `❌ ${arr[i]} ≠ ${target}. Continue searching...`,
        state: [...arr],
        highlighting: [i]
      });
    }
  }

  if (!found) {
    steps.push({
      description: `❌ Target ${target} not found in the array.`,
      state: [...arr],
      highlighting: []
    });
  }

  return {
    steps,
    finalState: { array: arr, found, index: foundIndex },
    complexity: {
      time: "O(n)",
      space: "O(1)"
    },
    operationCount
  };
}

export function binarySearch(array: number[], target: number): AlgorithmResult {
  const steps: AlgorithmStep[] = [];
  const arr = [...array].sort((a, b) => a - b); // Binary search requires sorted array
  let operationCount = 0;
  let left = 0;
  let right = arr.length - 1;
  let found = false;
  let foundIndex = -1;

  steps.push({
    description: `Starting Binary Search for target value: ${target}`,
    state: [...arr],
    highlighting: []
  });

  steps.push({
    description: `Array sorted for binary search: [${arr.join(', ')}]`,
    state: [...arr],
    highlighting: Array.from({ length: arr.length }, (_, i) => i)
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    operationCount++;

    steps.push({
      description: `Searching in range [${left}, ${right}]. Mid index: ${mid}, value: ${arr[mid]}`,
      state: [...arr],
      highlighting: [left, mid, right],
      currentIndex: mid
    });

    if (arr[mid] === target) {
      found = true;
      foundIndex = mid;
      
      steps.push({
        description: `✅ Found target ${target} at index ${mid}!`,
        state: [...arr],
        highlighting: [mid],
        completed: true
      });
      break;
    } else if (arr[mid] < target) {
      steps.push({
        description: `${arr[mid]} < ${target}. Search right half.`,
        state: [...arr],
        highlighting: [mid]
      });
      left = mid + 1;
    } else {
      steps.push({
        description: `${arr[mid]} > ${target}. Search left half.`,
        state: [...arr],
        highlighting: [mid]
      });
      right = mid - 1;
    }
  }

  if (!found) {
    steps.push({
      description: `❌ Target ${target} not found in the array.`,
      state: [...arr],
      highlighting: []
    });
  }

  return {
    steps,
    finalState: { array: arr, found, index: foundIndex },
    complexity: {
      time: "O(log n)",
      space: "O(1)"
    },
    operationCount
  };
}

export const searchAlgorithms = {
  linearSearch,
  binarySearch
};
