'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SearchVisualization } from '../../components/visualizations/SearchVisualization';
import { VisualizationControls } from '../../components/interactive/VisualizationControls';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { linearSearch, binarySearch } from '../../lib/algorithms/search';
import { generateRandomArray } from '../../lib/utils';
import { AlgorithmResult } from '../../types';

type SearchAlgorithm = 'linear' | 'binary';

const algorithms = {
  linear: {
    name: 'Linear Search',
    description: 'Searches through array elements one by one',
    complexity: 'O(n)'
  },
  binary: {
    name: 'Binary Search',
    description: 'Divides search space in half each iteration (requires sorted array)',
    complexity: 'O(log n)'
  }
};

export default function SearchAlgorithmsPage() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(5);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SearchAlgorithm>('linear');
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [arraySize, setArraySize] = useState(10);

  const generateNewArray = useCallback(() => {
    const newArray = generateRandomArray(arraySize, 1, 50);
    setArray(newArray);
    setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    setResult(null);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [arraySize]);

  useEffect(() => {
    generateNewArray();
  }, [generateNewArray]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && result && currentStep < result.steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= (result?.steps.length || 0) - 1) {
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, result, speed]);

  const runAlgorithm = () => {
    let algorithmResult: AlgorithmResult;
    
    switch (selectedAlgorithm) {
      case 'linear':
        algorithmResult = linearSearch(array, target);
        break;
      case 'binary':
        algorithmResult = binarySearch(array, target);
        break;
      default:
        return;
    }
    
    setResult(algorithmResult);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    if (!result) runAlgorithm();
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (result && currentStep < result.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getCurrentVisualizationData = () => {
    if (!result || !result.steps[currentStep]) {
      return {
        array: selectedAlgorithm === 'binary' ? [...array].sort((a, b) => a - b) : array,
        highlightIndices: [],
        foundIndex: -1
      };
    }

    const step = result.steps[currentStep];
    const visualArray = selectedAlgorithm === 'binary' ? 
      (step.state.array as number[]) : array;
    
    return {
      array: visualArray,
      highlightIndices: step.highlighting || [],
      foundIndex: step.completed && step.state.found ? 
        (step.state.currentIndex as number) : -1
    };
  };

  const visualData = getCurrentVisualizationData();
  const currentAlgorithm = algorithms[selectedAlgorithm];
  const currentStepData = result?.steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Search Algorithms Visualization
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore different search algorithms and see how they find elements in arrays.
            Watch the step-by-step execution and compare their efficiency.
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Algorithm Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Algorithm</h3>
            <div className="space-y-3">
              {Object.entries(algorithms).map(([key, algo]) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="algorithm"
                    value={key}
                    checked={selectedAlgorithm === key}
                    onChange={(e) => setSelectedAlgorithm(e.target.value as SearchAlgorithm)}
                    className="text-blue-600"
                  />
                  <div>
                    <span className="font-medium">{algo.name}</span>
                    <p className="text-sm text-gray-600">{algo.description}</p>
                    <p className="text-xs text-blue-600 font-mono">{algo.complexity}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Array Controls */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Array Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Array Size: {arraySize}
                </label>
                <Slider
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  min={5}
                  max={20}
                  step={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Search Target: {target}
                </label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={1}
                  max={50}
                />
              </div>
              <Button onClick={generateNewArray} className="w-full">
                Generate New Array
              </Button>
            </div>
          </Card>

          {/* Algorithm Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">{currentAlgorithm.name}</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">{currentAlgorithm.description}</p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-800">Time Complexity</div>
                <div className="text-lg font-mono text-blue-900">{currentAlgorithm.complexity}</div>
              </div>
              {result && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-green-800">Operations</div>
                  <div className="text-lg font-mono text-green-900">{result.operationCount}</div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Visualization */}
        <Card className="p-6 mb-8">
          <SearchVisualization
            array={visualData.array}
            target={target}
            currentStep={currentStep}
            highlightIndices={visualData.highlightIndices}
            foundIndex={visualData.foundIndex}
            isPlaying={isPlaying}
            speed={speed}
          />
        </Card>

        {/* Visualization Controls */}
        {result && (
          <Card className="p-6 mb-8">
            <VisualizationControls
              isPlaying={isPlaying}
              currentStep={currentStep}
              totalSteps={result.steps.length}
              speed={speed}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onSpeedChange={setSpeed}
            />
          </Card>
        )}

        {/* Step Description */}
        {currentStepData && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Current Step</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 font-medium">{currentStepData.description}</p>
              <div className="mt-2 text-sm text-gray-600">
                Step {currentStep + 1} of {result?.steps.length}
              </div>
            </div>
          </Card>
        )}

        {/* Run Algorithm Button */}
        {!result && (
          <div className="text-center">
            <Button onClick={runAlgorithm} size="lg" className="px-8">
              Run {currentAlgorithm.name}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
