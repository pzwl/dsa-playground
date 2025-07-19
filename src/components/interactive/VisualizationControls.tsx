'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { VisualizationControlsProps } from '../../types';
import { cn } from '@/lib/utils';

export function VisualizationControls({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange
}: VisualizationControlsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col space-y-4">
        {/* Primary Controls */}
        <div className="flex items-center justify-center space-x-2">
          <Button
            onClick={onStepBackward}
            disabled={currentStep <= 0}
            size="icon"
            variant="outline"
            className="h-10 w-10"
            title="Step Backward"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={isPlaying ? onPause : onPlay}
            disabled={currentStep >= totalSteps - 1 && !isPlaying}
            size="lg"
            className={cn(
              "h-12 w-12 rounded-full",
              isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            )}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white ml-0.5" />
            )}
          </Button>
          
          <Button
            onClick={onStepForward}
            disabled={currentStep >= totalSteps - 1}
            size="icon"
            variant="outline"
            className="h-10 w-10"
            title="Step Forward"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onReset}
            size="icon"
            variant="outline"
            className="h-10 w-10 ml-2"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Speed: {speed}x
            </span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
}
