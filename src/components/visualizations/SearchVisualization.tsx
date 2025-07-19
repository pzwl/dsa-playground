'use client';

import React, { useState, useEffect } from 'react';
import { SearchVisualizationProps } from '../../types';

export function SearchVisualization({
  array,
  target,
  currentStep = 0,
  highlightIndices = [],
  foundIndex = -1,
  isPlaying = false,
  speed = 500
}: SearchVisualizationProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), speed / 2);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isPlaying, speed]);

  const getBarColor = (index: number): string => {
    if (foundIndex !== -1 && index === foundIndex) {
      return 'bg-green-500'; // Found element
    }
    if (highlightIndices.includes(index)) {
      return 'bg-blue-500'; // Currently checking
    }
    return 'bg-gray-300'; // Default
  };

  const getBarHeight = (value: number): string => {
    const maxValue = Math.max(...array);
    const height = (value / maxValue) * 300;
    return `${height}px`;
  };

  return (
    <div className="w-full h-96 flex items-end justify-center space-x-2 p-4 bg-gray-50 rounded-lg">
      {array.map((value, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={`
              w-8 transition-all duration-300 rounded-t-lg relative
              ${getBarColor(index)}
              ${animating && highlightIndices.includes(index) ? 'scale-110' : ''}
              ${foundIndex === index ? 'ring-4 ring-green-300' : ''}
            `}
            style={{ height: getBarHeight(value) }}
          >
            {/* Value label on top */}
            <span
              className={`
                absolute -top-8 left-1/2 transform -translate-x-1/2 
                text-sm font-bold text-center
                ${foundIndex === index ? 'text-green-600' : ''}
                ${highlightIndices.includes(index) ? 'text-blue-600' : 'text-gray-600'}
              `}
            >
              {value}
            </span>
            
            {/* Target indicator */}
            {value === target && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Target
                </div>
              </div>
            )}
          </div>
          
          {/* Index label */}
          <span className="text-xs text-gray-500 mt-2">
            {index}
          </span>
        </div>
      ))}
      
      {/* Search target display */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md">
        <div className="text-sm text-gray-600">Searching for:</div>
        <div className="text-2xl font-bold text-blue-600">{target}</div>
        {foundIndex !== -1 && (
          <div className="text-sm text-green-600 mt-1">
            Found at index {foundIndex}
          </div>
        )}
      </div>
    </div>
  );
}
