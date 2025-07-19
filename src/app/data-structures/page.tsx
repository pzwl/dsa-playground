'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const sampleArray = [10, 25, 3, 78, 45, 12, 89, 34];
const sampleStack = [5, 10, 15, 20];
const sampleQueue = [1, 2, 3, 4, 5];

export default function DataStructuresPage() {
  const [selectedStructure, setSelectedStructure] = useState<'array' | 'stack' | 'queue' | 'linkedlist'>('array');
  const [arrayData, setArrayData] = useState<number[]>(sampleArray);
  const [stackData, setStackData] = useState<number[]>(sampleStack);
  const [queueData, setQueueData] = useState<number[]>(sampleQueue);
  const [inputValue, setInputValue] = useState<string>('');
  const [arraySize, setArraySize] = useState(8);

  const generateRandomArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 90) + 10
    );
    setArrayData(newArray);
  }, [arraySize]);

  const handleArrayOperation = (operation: 'push' | 'pop' | 'insert' | 'delete', index?: number) => {
    const value = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    
    switch (operation) {
      case 'push':
        setArrayData(prev => [...prev, value]);
        break;
      case 'pop':
        setArrayData(prev => prev.slice(0, -1));
        break;
      case 'insert':
        if (index !== undefined) {
          setArrayData(prev => {
            const newArray = [...prev];
            newArray.splice(index, 0, value);
            return newArray;
          });
        }
        break;
      case 'delete':
        if (index !== undefined) {
          setArrayData(prev => prev.filter((_, i) => i !== index));
        }
        break;
    }
    setInputValue('');
  };

  const handleStackOperation = (operation: 'push' | 'pop') => {
    const value = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    
    switch (operation) {
      case 'push':
        setStackData(prev => [...prev, value]);
        break;
      case 'pop':
        setStackData(prev => prev.slice(0, -1));
        break;
    }
    setInputValue('');
  };

  const handleQueueOperation = (operation: 'enqueue' | 'dequeue') => {
    const value = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    
    switch (operation) {
      case 'enqueue':
        setQueueData(prev => [...prev, value]);
        break;
      case 'dequeue':
        setQueueData(prev => prev.slice(1));
        break;
    }
    setInputValue('');
  };

  const renderArray = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={() => handleArrayOperation('push')}>Push</Button>
        <Button onClick={() => handleArrayOperation('pop')} variant="outline">Pop</Button>
        <Button onClick={generateRandomArray} variant="outline">Random</Button>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Array Size: {arraySize}
        </label>
        <Slider
          value={arraySize}
          onChange={(e) => setArraySize(Number(e.target.value))}
          min={3}
          max={15}
          step={1}
        />
      </div>

      <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 rounded-lg">
        {arrayData.map((value, index) => (
          <div key={index} className="relative">
            <div className="bg-blue-500 text-white p-3 rounded text-center font-bold">
              {value}
            </div>
            <div className="text-center text-sm text-gray-500 mt-1">
              [{index}]
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleArrayOperation('delete', index)}
              className="absolute -top-2 -right-2 w-6 h-6 p-0 text-red-500"
            >
              ×
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Array Properties</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Length: {arrayData.length}</li>
          <li>• Access: O(1) by index</li>
          <li>• Search: O(n) linear scan</li>
          <li>• Insert/Delete: O(n) average</li>
        </ul>
      </div>
    </div>
  );

  const renderStack = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <Button onClick={() => handleStackOperation('push')} className="bg-green-600 hover:bg-green-700">
          Push
        </Button>
        <Button onClick={() => handleStackOperation('pop')} variant="outline">
          Pop
        </Button>
      </div>

      <div className="flex flex-col-reverse items-center space-y-reverse space-y-2 p-4 bg-gray-50 rounded-lg min-h-64">
        {stackData.map((value, index) => (
          <div key={index} className="relative">
            <div className="bg-green-500 text-white p-3 rounded text-center font-bold w-20">
              {value}
            </div>
            {index === stackData.length - 1 && (
              <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
                <span className="text-green-600 font-semibold">← TOP</span>
              </div>
            )}
          </div>
        ))}
        {stackData.length === 0 && (
          <div className="text-gray-500 italic">Empty Stack</div>
        )}
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Stack Properties (LIFO)</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Size: {stackData.length}</li>
          <li>• Top: {stackData.length > 0 ? stackData[stackData.length - 1] : 'None'}</li>
          <li>• Push: O(1)</li>
          <li>• Pop: O(1)</li>
        </ul>
      </div>
    </div>
  );

  const renderQueue = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Button onClick={() => handleQueueOperation('enqueue')} className="bg-purple-600 hover:bg-purple-700">
          Enqueue
        </Button>
        <Button onClick={() => handleQueueOperation('dequeue')} variant="outline">
          Dequeue
        </Button>
      </div>

      <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg min-h-32">
        <div className="text-purple-600 font-semibold">FRONT →</div>
        {queueData.map((value, index) => (
          <div key={index} className="bg-purple-500 text-white p-3 rounded text-center font-bold">
            {value}
          </div>
        ))}
        <div className="text-purple-600 font-semibold">← REAR</div>
        {queueData.length === 0 && (
          <div className="text-gray-500 italic mx-auto">Empty Queue</div>
        )}
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-2">Queue Properties (FIFO)</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Size: {queueData.length}</li>
          <li>• Front: {queueData.length > 0 ? queueData[0] : 'None'}</li>
          <li>• Rear: {queueData.length > 0 ? queueData[queueData.length - 1] : 'None'}</li>
          <li>• Enqueue/Dequeue: O(1)</li>
        </ul>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedStructure) {
      case 'array':
        return renderArray();
      case 'stack':
        return renderStack();
      case 'queue':
        return renderQueue();
      default:
        return renderArray();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Data Structures Playground
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore fundamental data structures with interactive visualizations and operations.
          </p>
        </div>

        {/* Data Structure Selector */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Select Data Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: 'array', name: 'Array', color: 'blue' },
              { id: 'stack', name: 'Stack', color: 'green' },
              { id: 'queue', name: 'Queue', color: 'purple' },
              { id: 'linkedlist', name: 'Linked List', color: 'red' }
            ].map((structure) => (
              <button
                key={structure.id}
                onClick={() => setSelectedStructure(structure.id as 'array' | 'stack' | 'queue' | 'linkedlist')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedStructure === structure.id
                    ? `border-${structure.color}-500 bg-${structure.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`font-semibold ${
                  selectedStructure === structure.id 
                    ? `text-${structure.color}-700`
                    : 'text-gray-700'
                }`}>
                  {structure.name}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Main Content */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 capitalize">{selectedStructure} Operations</h2>
          {renderContent()}
        </Card>
      </div>
    </div>
  );
}
