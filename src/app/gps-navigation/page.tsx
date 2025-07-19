'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation, MapPin, Zap, Route, Clock } from 'lucide-react';

interface GraphNode {
  id: string;
  name: string;
  x: number;
  y: number;
  distance: number;
  previous: string | null;
  visited: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  name: string;
}

const CITIES_MAP = {
  nodes: [
    { id: 'A', name: 'New York', x: 150, y: 100, distance: Infinity, previous: null, visited: false },
    { id: 'B', name: 'Boston', x: 200, y: 80, distance: Infinity, previous: null, visited: false },
    { id: 'C', name: 'Philadelphia', x: 120, y: 140, distance: Infinity, previous: null, visited: false },
    { id: 'D', name: 'Washington DC', x: 100, y: 180, distance: Infinity, previous: null, visited: false },
    { id: 'E', name: 'Atlanta', x: 150, y: 250, distance: Infinity, previous: null, visited: false },
    { id: 'F', name: 'Chicago', x: 50, y: 120, distance: Infinity, previous: null, visited: false },
    { id: 'G', name: 'Miami', x: 200, y: 320, distance: Infinity, previous: null, visited: false },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 215, name: 'I-95 N' },
    { from: 'A', to: 'C', weight: 95, name: 'I-95 S' },
    { from: 'A', to: 'F', weight: 790, name: 'I-80 W' },
    { from: 'B', to: 'A', weight: 215, name: 'I-95 S' },
    { from: 'C', to: 'A', weight: 95, name: 'I-95 N' },
    { from: 'C', to: 'D', weight: 140, name: 'I-95 S' },
    { from: 'C', to: 'F', weight: 760, name: 'I-76 W' },
    { from: 'D', to: 'C', weight: 140, name: 'I-95 N' },
    { from: 'D', to: 'E', weight: 640, name: 'I-85 S' },
    { from: 'E', to: 'D', weight: 640, name: 'I-85 N' },
    { from: 'E', to: 'G', weight: 650, name: 'I-75 S' },
    { from: 'F', to: 'A', weight: 790, name: 'I-80 E' },
    { from: 'F', to: 'C', weight: 760, name: 'I-76 E' },
    { from: 'G', to: 'E', weight: 650, name: 'I-75 N' },
  ]
};

export default function GPSNavigationPage() {
  const [nodes, setNodes] = useState<GraphNode[]>(CITIES_MAP.nodes);
  const [edges] = useState<GraphEdge[]>(CITIES_MAP.edges);
  const [startCity, setStartCity] = useState<string>('A');
  const [endCity, setEndCity] = useState<string>('G');
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Array<{
    description: string;
    currentNode: string;
    distances: Record<string, number>;
    visited: string[];
    path: string[];
  }>>([]);
  const [finalPath, setFinalPath] = useState<string[]>([]);
  const [totalDistance, setTotalDistance] = useState<number>(0);

  const resetGraph = useCallback(() => {
    setNodes(CITIES_MAP.nodes.map(node => ({
      ...node,
      distance: node.id === startCity ? 0 : Infinity,
      previous: null,
      visited: false
    })));
    setSteps([]);
    setCurrentStep(0);
    setFinalPath([]);
    setTotalDistance(0);
    setIsCalculating(false);
  }, [startCity]);

  const dijkstraStep = useCallback(() => {
    const nodesCopy = [...nodes];
    const visited = new Set<string>();
    const allSteps: Array<{
      description: string;
      currentNode: string;
      distances: Record<string, number>;
      visited: string[];
      path: string[];
    }> = [];

    // Initialize start node
    const startNode = nodesCopy.find(n => n.id === startCity)!;
    startNode.distance = 0;

    allSteps.push({
      description: `Starting from ${startNode.name}. Set distance to 0.`,
      currentNode: startCity,
      distances: Object.fromEntries(nodesCopy.map(n => [n.id, n.distance])),
      visited: [],
      path: []
    });

    while (visited.size < nodesCopy.length) {
      // Find unvisited node with minimum distance
      const unvisitedNodes = nodesCopy.filter(n => !visited.has(n.id));
      if (unvisitedNodes.length === 0) break;

      const currentNode = unvisitedNodes.reduce((min, node) => 
        node.distance < min.distance ? node : min
      );

      if (currentNode.distance === Infinity) break;

      visited.add(currentNode.id);
      currentNode.visited = true;

      // Update distances to neighbors
      const neighbors = edges.filter(e => e.from === currentNode.id);
      const updatedNeighbors: string[] = [];

      for (const edge of neighbors) {
        const neighbor = nodesCopy.find(n => n.id === edge.to)!;
        const newDistance = currentNode.distance + edge.weight;

        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previous = currentNode.id;
          updatedNeighbors.push(neighbor.name);
        }
      }

      const pathToHere = getPath(nodesCopy, startCity, currentNode.id);
      
      allSteps.push({
        description: `Visiting ${currentNode.name} (distance: ${currentNode.distance}). Updated: ${updatedNeighbors.join(', ') || 'none'}.`,
        currentNode: currentNode.id,
        distances: Object.fromEntries(nodesCopy.map(n => [n.id, n.distance])),
        visited: Array.from(visited),
        path: pathToHere
      });

      if (currentNode.id === endCity) {
        const finalPathResult = getPath(nodesCopy, startCity, endCity);
        const totalDist = nodesCopy.find(n => n.id === endCity)?.distance || 0;
        
        allSteps.push({
          description: `Reached destination ${currentNode.name}! Shortest path found.`,
          currentNode: endCity,
          distances: Object.fromEntries(nodesCopy.map(n => [n.id, n.distance])),
          visited: Array.from(visited),
          path: finalPathResult
        });

        setFinalPath(finalPathResult);
        setTotalDistance(totalDist);
        break;
      }
    }

    setSteps(allSteps);
    setNodes(nodesCopy);
  }, [nodes, edges, startCity, endCity]);

  const getPath = (nodesList: GraphNode[], start: string, end: string): string[] => {
    const path: string[] = [];
    let current: string | null = end;

    while (current !== null) {
      path.unshift(current);
      const node = nodesList.find(n => n.id === current);
      current = node?.previous || null;
      if (current === start) {
        path.unshift(start);
        break;
      }
    }

    return path;
  };

  const runDijkstra = () => {
    setIsCalculating(true);
    resetGraph();
    setTimeout(() => {
      dijkstraStep();
      setIsCalculating(false);
    }, 500);
  };

  const currentStepData = steps[currentStep] || null;
  const currentNodes = nodes.map(node => ({
    ...node,
    distance: currentStepData?.distances[node.id] ?? (node.id === startCity ? 0 : Infinity),
    visited: currentStepData?.visited.includes(node.id) ?? false
  }));

  useEffect(() => {
    resetGraph();
  }, [resetGraph]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            GPS Navigation System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience how GPS apps like Google Maps find the shortest route between cities using Dijkstra&apos;s algorithm.
            Watch the algorithm explore the map step by step to find the optimal path.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Route Controls */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Navigation className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Route Planning</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">From:</label>
                <select
                  value={startCity}
                  onChange={(e) => setStartCity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CITIES_MAP.nodes.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">To:</label>
                <select
                  value={endCity}
                  onChange={(e) => setEndCity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CITIES_MAP.nodes.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>
              <Button 
                onClick={runDijkstra} 
                disabled={isCalculating || startCity === endCity}
                className="w-full"
              >
                {isCalculating ? 'Calculating...' : 'Find Shortest Route'}
              </Button>
            </div>
          </Card>

          {/* Algorithm Info */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold">Algorithm</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div><strong>Algorithm:</strong> Dijkstra&apos;s Shortest Path</div>
              <div><strong>Time Complexity:</strong> O(V² + E)</div>
              <div><strong>Space Complexity:</strong> O(V)</div>
              <div><strong>Guarantee:</strong> Always finds optimal solution</div>
              <div><strong>Used in:</strong> Google Maps, Waze, GPS devices</div>
            </div>
          </Card>

          {/* Route Info */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Route className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold">Route Details</h3>
            </div>
            {finalPath.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Distance:</span>
                  <span className="text-sm font-bold text-green-600">{totalDistance} miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cities:</span>
                  <span className="text-sm font-semibold">{finalPath.length}</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-700 mb-1">Route:</div>
                  <div className="text-xs text-gray-600">
                    {finalPath.map(cityId => 
                      CITIES_MAP.nodes.find(n => n.id === cityId)?.name
                    ).join(' → ')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Click &quot;Find Shortest Route&quot; to see route details
              </div>
            )}
          </Card>

          {/* Step Controls */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-purple-500 mr-2" />
              <h3 className="text-lg font-semibold">Step Through</h3>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  size="sm"
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep >= steps.length - 1}
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Map Visualization */}
        <Card className="p-6 mb-8">
          <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border">
            <svg width="100%" height="100%" viewBox="0 0 300 400" className="w-full h-full">
              {/* Roads (Edges) */}
              {edges.map((edge, index) => {
                const fromNode = CITIES_MAP.nodes.find(n => n.id === edge.from);
                const toNode = CITIES_MAP.nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                
                const isOnPath = finalPath.includes(edge.from) && finalPath.includes(edge.to) &&
                  Math.abs(finalPath.indexOf(edge.from) - finalPath.indexOf(edge.to)) === 1;
                
                return (
                  <g key={index}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={isOnPath ? '#10b981' : '#d1d5db'}
                      strokeWidth={isOnPath ? 4 : 2}
                      strokeDasharray={isOnPath ? '0' : '5,5'}
                    />
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 8}
                      textAnchor="middle"
                      className="text-xs fill-gray-600 font-medium"
                    >
                      {edge.weight}mi
                    </text>
                  </g>
                );
              })}
              
              {/* Cities (Nodes) */}
              {currentNodes.map((node) => {
                const isStart = node.id === startCity;
                const isEnd = node.id === endCity;
                const isCurrent = currentStepData?.currentNode === node.id;
                const isOnFinalPath = finalPath.includes(node.id);
                
                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="20"
                      fill={
                        isStart ? '#3b82f6' :
                        isEnd ? '#ef4444' :
                        isCurrent ? '#f59e0b' :
                        node.visited ? '#10b981' : 
                        isOnFinalPath ? '#8b5cf6' : '#f3f4f6'
                      }
                      stroke={
                        isStart || isEnd ? '#1e40af' :
                        isCurrent ? '#d97706' :
                        node.visited ? '#059669' : '#d1d5db'
                      }
                      strokeWidth="3"
                    />
                    
                    {/* City name */}
                    <text
                      x={node.x}
                      y={node.y + 35}
                      textAnchor="middle"
                      className="text-sm font-bold fill-gray-800"
                    >
                      {node.name}
                    </text>
                    
                    {/* Distance label */}
                    {node.distance !== Infinity && (
                      <text
                        x={node.x}
                        y={node.y - 25}
                        textAnchor="middle"
                        className="text-xs font-bold fill-blue-600"
                      >
                        {node.distance}
                      </text>
                    )}

                    {/* Icons */}
                    {isStart && <MapPin className="h-4 w-4" x={node.x - 8} y={node.y - 8} />}
                  </g>
                );
              })}
            </svg>
          </div>
        </Card>

        {/* Current Step Description */}
        {currentStepData && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Algorithm Step</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 font-medium">{currentStepData.description}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
