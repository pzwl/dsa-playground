'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SortingVisualizationProps } from '../../types';
import { cn } from '@/lib/utils';

export function ArrayVisualization({
  array,
  highlightIndices = [],
  comparisonIndices = [],
  swapIndices
}: SortingVisualizationProps) {
  const maxValue = Math.max(...array);
  const minValue = Math.min(...array);
  const range = maxValue - minValue || 1;

  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * 200 + 40; // Min height of 40px
  };

  const getBarColor = (index: number) => {
    if (swapIndices && (swapIndices[0] === index || swapIndices[1] === index)) {
      return 'bg-red-500';
    }
    if (comparisonIndices.includes(index)) {
      return 'bg-yellow-500';
    }
    if (highlightIndices.includes(index)) {
      return 'bg-green-500';
    }
    return 'bg-blue-500';
  };

  const getBarScale = (index: number) => {
    return highlightIndices.includes(index) ? 1.05 : 1;
  };

  return (
    <div className="w-full h-80 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex items-end justify-center space-x-1 overflow-x-auto">
      {array.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p>No data to visualize</p>
        </div>
      ) : (
        array.map((value, index) => (
          <motion.div
            key={`${index}-${value}`}
            className={cn(
              "relative flex flex-col items-center min-w-[30px] transition-colors duration-300",
              getBarColor(index)
            )}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: getBarHeight(value),
              opacity: 1,
              scale: getBarScale(index)
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            whileHover={{
              scale: 1.1,
              zIndex: 10,
              transition: { duration: 0.2 }
            }}
          >
            {/* Bar */}
            <div className="w-full rounded-t-md shadow-lg relative group">
              {/* Value label on hover */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-2 py-1 rounded shadow-lg">
                  {value}
                </div>
              </div>
            </div>
            
            {/* Index label */}
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
              {index}
            </div>
            
            {/* Value label (always visible on smaller arrays) */}
            {array.length <= 20 && (
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold drop-shadow-lg">
                {value}
              </div>
            )}
            
            {/* Animation indicators */}
            {highlightIndices.includes(index) && (
              <motion.div
                className="absolute -top-2 -left-2 -right-2 -bottom-2 border-2 border-green-400 rounded-md pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            {comparisonIndices.includes(index) && (
              <motion.div
                className="absolute -top-1 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              </motion.div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
}
