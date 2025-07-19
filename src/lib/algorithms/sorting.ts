import { AlgorithmResult, AlgorithmStep } from '../../types';

export function bubbleSort(array: number[]): AlgorithmResult {
  const steps: AlgorithmStep[] = [];
  const arr = [...array];
  const n = arr.length;
  let operationCount = 0;

  steps.push({
    description: "Starting Bubble Sort algorithm",
    state: [...arr],
    highlighting: []
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      operationCount++;
      
      // Compare adjacent elements
      steps.push({
        description: `Comparing elements at indices ${j} and ${j + 1} (${arr[j]} and ${arr[j + 1]})`,
        state: [...arr],
        highlighting: [j, j + 1],
        comparison: true,
        currentIndex: j
      });

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        operationCount++;

        steps.push({
          description: `Swapping ${arr[j + 1]} and ${arr[j]} (elements at indices ${j} and ${j + 1})`,
          state: [...arr],
          highlighting: [j, j + 1],
          swapIndices: [j, j + 1]
        });
      }
    }

    // Mark the last element as sorted
    steps.push({
      description: `Pass ${i + 1} completed. Element at index ${n - i - 1} is now in its correct position`,
      state: [...arr],
      highlighting: [n - i - 1],
      completed: true
    });

    if (!swapped) {
      steps.push({
        description: "No swaps occurred in this pass. Array is now sorted!",
        state: [...arr],
        highlighting: Array.from({ length: n }, (_, idx) => idx),
        completed: true
      });
      break;
    }
  }

  steps.push({
    description: "Bubble Sort completed! All elements are now sorted.",
    state: [...arr],
    highlighting: Array.from({ length: n }, (_, idx) => idx),
    completed: true
  });

  return {
    steps,
    finalState: arr,
    complexity: {
      time: "O(n²)",
      space: "O(1)"
    },
    operationCount
  };
}

export function quickSort(array: number[]): AlgorithmResult {
  const steps: AlgorithmStep[] = [];
  const arr = [...array];
  let operationCount = 0;

  function quickSortHelper(low: number, high: number): void {
    if (low < high) {
      const pivotIndex = partition(low, high);
      quickSortHelper(low, pivotIndex - 1);
      quickSortHelper(pivotIndex + 1, high);
    }
  }

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      description: `Partitioning array from index ${low} to ${high}. Pivot element: ${pivot} (at index ${high})`,
      state: [...arr],
      highlighting: [high],
      currentIndex: high
    });

    for (let j = low; j < high; j++) {
      operationCount++;
      
      steps.push({
        description: `Comparing element ${arr[j]} (at index ${j}) with pivot ${pivot}`,
        state: [...arr],
        highlighting: [j, high],
        comparison: true
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          operationCount++;

          steps.push({
            description: `${arr[j]} is less than pivot. Swapping elements at indices ${i} and ${j}`,
            state: [...arr],
            highlighting: [i, j],
            swapIndices: [i, j]
          });
        }
      }
    }

    // Place pivot in correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    operationCount++;

    steps.push({
      description: `Placing pivot ${pivot} in its correct position at index ${i + 1}`,
      state: [...arr],
      highlighting: [i + 1],
      completed: true
    });

    return i + 1;
  }

  steps.push({
    description: "Starting Quick Sort algorithm",
    state: [...arr],
    highlighting: []
  });

  quickSortHelper(0, arr.length - 1);

  steps.push({
    description: "Quick Sort completed! All elements are now sorted.",
    state: [...arr],
    highlighting: Array.from({ length: arr.length }, (_, idx) => idx),
    completed: true
  });

  return {
    steps,
    finalState: arr,
    complexity: {
      time: "O(n log n) average, O(n²) worst",
      space: "O(log n)"
    },
    operationCount
  };
}

export function mergeSort(array: number[]): AlgorithmResult {
  const steps: AlgorithmStep[] = [];
  const arr = [...array];
  let operationCount = 0;

  function mergeSortHelper(left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        description: `Dividing array from index ${left} to ${right}. Mid point: ${mid}`,
        state: [...arr],
        highlighting: [left, mid, right]
      });

      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }
  }

  function merge(left: number, mid: number, right: number): void {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    steps.push({
      description: `Merging subarrays: [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`,
      state: [...arr],
      highlighting: Array.from({ length: right - left + 1 }, (_, i) => left + i)
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      operationCount++;
      
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        steps.push({
          description: `Placing ${leftArr[i]} from left subarray at position ${k}`,
          state: [...arr],
          highlighting: [k],
          currentIndex: k
        });
        i++;
      } else {
        arr[k] = rightArr[j];
        steps.push({
          description: `Placing ${rightArr[j]} from right subarray at position ${k}`,
          state: [...arr],
          highlighting: [k],
          currentIndex: k
        });
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        description: `Placing remaining element ${leftArr[i]} from left subarray at position ${k}`,
        state: [...arr],
        highlighting: [k],
        currentIndex: k
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        description: `Placing remaining element ${rightArr[j]} from right subarray at position ${k}`,
        state: [...arr],
        highlighting: [k],
        currentIndex: k
      });
      j++;
      k++;
    }

    steps.push({
      description: `Merged subarray from index ${left} to ${right}: [${arr.slice(left, right + 1).join(', ')}]`,
      state: [...arr],
      highlighting: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      completed: true
    });
  }

  steps.push({
    description: "Starting Merge Sort algorithm",
    state: [...arr],
    highlighting: []
  });

  mergeSortHelper(0, arr.length - 1);

  steps.push({
    description: "Merge Sort completed! All elements are now sorted.",
    state: [...arr],
    highlighting: Array.from({ length: arr.length }, (_, idx) => idx),
    completed: true
  });

  return {
    steps,
    finalState: arr,
    complexity: {
      time: "O(n log n)",
      space: "O(n)"
    },
    operationCount
  };
}

export const sortingAlgorithms = {
  bubbleSort,
  quickSort,
  mergeSort
};
