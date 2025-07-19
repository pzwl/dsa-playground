'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrayVisualization } from '../../components/visualizations/ArrayVisualization';
import { VisualizationControls } from '../../components/interactive/VisualizationControls';
import { sortingAlgorithms } from '../../lib/algorithms/sorting';
import { generateRandomArray, getSpeedDelay } from '../../lib/utils';
import { AlgorithmResult, AlgorithmStep } from '../../types';
import { Shuffle, BarChart3, Code2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SortingAlgorithmsPage() {
  const [array, setArray] = useState<number[]>([]);
  const [originalArray, setOriginalArray] = useState<number[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'bubbleSort' | 'quickSort' | 'mergeSort'>('bubbleSort');
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [arraySize, setArraySize] = useState(10);
  const [algorithmResult, setAlgorithmResult] = useState<AlgorithmResult | null>(null);

  const generateNewArray = useCallback(() => {
    const newArray = generateRandomArray(arraySize, 5, 50);
    setArray(newArray);
    setOriginalArray([...newArray]);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setAlgorithmResult(null);
  }, [arraySize]);

  const runAlgorithm = useCallback(() => {
    if (originalArray.length === 0) return;
    
    const result = sortingAlgorithms[selectedAlgorithm]([...originalArray]);
    setSteps(result.steps);
    setAlgorithmResult(result);
    setCurrentStep(0);
    setArray([...originalArray]);
    setIsPlaying(false);
  }, [selectedAlgorithm, originalArray]);

  const handlePlay = useCallback(() => {
    if (steps.length === 0) {
      runAlgorithm();
      return;
    }
    setIsPlaying(true);
  }, [steps, runAlgorithm]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleReset = useCallback(() => {
    setArray([...originalArray]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [originalArray]);

  const handleStepForward = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  const handleStepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, getSpeedDelay(speed));
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  // Update array based on current step
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      setArray(steps[currentStep].state);
    }
  }, [currentStep, steps]);

  // Initialize with random array
  useEffect(() => {
    generateNewArray();
  }, [generateNewArray]);

  const currentStepData = steps[currentStep];
  const algorithms = [
    {
      id: 'bubbleSort',
      name: 'Bubble Sort',
      description: 'Simple comparison-based algorithm that repeatedly steps through the list.',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)'
    },
    {
      id: 'quickSort',
      name: 'Quick Sort',
      description: 'Efficient divide-and-conquer algorithm that picks a pivot element.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)'
    },
    {
      id: 'mergeSort',
      name: 'Merge Sort',
      description: 'Stable divide-and-conquer algorithm that divides array into halves.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-3xl">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <span>Sorting Algorithms Visualizer</span>
            </CardTitle>
            <CardDescription>
              Explore how different sorting algorithms work through interactive visualizations.
              Compare their performance and understand their step-by-step execution.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <motion.div
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Algorithm Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code2 className="h-5 w-5" />
                <span>Algorithm</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {algorithms.map((algo) => (
                <Button
                  key={algo.id}
                  variant={selectedAlgorithm === algo.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedAlgorithm(algo.id as 'bubbleSort' | 'quickSort' | 'mergeSort');
                    setSteps([]);
                    setCurrentStep(0);
                    setIsPlaying(false);
                  }}
                  className="w-full justify-start text-left h-auto p-4"
                >
                  <div className="space-y-1">
                    <div className="font-semibold">{algo.name}</div>
                    <div className="text-sm text-muted-foreground">{algo.timeComplexity}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Array Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shuffle className="h-5 w-5" />
                <span>Array Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Array Size: {arraySize}</label>
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <Button onClick={generateNewArray} className="w-full">
                <Shuffle className="h-4 w-4 mr-2" />
                Generate New Array
              </Button>
            </CardContent>
          </Card>

          {/* Visualization Controls */}
          <VisualizationControls
            isPlaying={isPlaying}
            currentStep={currentStep}
            totalSteps={steps.length}
            speed={speed}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onSpeedChange={setSpeed}
          />

          {/* Algorithm Info */}
          {algorithmResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Time Complexity:</span>
                    <span className="font-mono">{algorithmResult.complexity.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Space Complexity:</span>
                    <span className="font-mono">{algorithmResult.complexity.space}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operations:</span>
                    <span className="font-mono">{algorithmResult.operationCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Main Visualization Area */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Array Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Array Visualization</CardTitle>
              {currentStepData && (
                <CardDescription>{currentStepData.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <ArrayVisualization
                array={array}
                currentStep={currentStep}
                highlightIndices={currentStepData?.highlighting || []}
                comparisonIndices={currentStepData?.comparison ? currentStepData.highlighting || [] : []}
                swapIndices={currentStepData?.swapIndices}
                isPlaying={isPlaying}
                speed={speed}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
