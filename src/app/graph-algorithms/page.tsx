'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
  visited?: boolean;
  distance?: number;
  previous?: string | null;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  highlighted?: boolean;
}

const SAMPLE_GRAPH: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [
    { id: 'A', x: 100, y: 100, label: 'A', distance: 0, previous: null },
    { id: 'B', x: 300, y: 80, label: 'B', distance: Infinity, previous: null },
    { id: 'C', x: 200, y: 200, label: 'C', distance: Infinity, previous: null },
    { id: 'D', x: 400, y: 180, label: 'D', distance: Infinity, previous: null },
    { id: 'E', x: 350, y: 300, label: 'E', distance: Infinity, previous: null },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'B', weight: 1 },
    { from: 'C', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: 6 },
    { from: 'D', to: 'E', weight: 2 },
  ]
};

export default function GraphAlgorithmsPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithm] = useState<'dijkstra' | 'dfs' | 'bfs'>('dijkstra');
  
  const dijkstraSteps = [
    {
      description: "Start from node A with distance 0. All other nodes have infinite distance.",
      nodes: SAMPLE_GRAPH.nodes.map(n => ({ ...n, visited: n.id === 'A' ? true : false })),
      edges: SAMPLE_GRAPH.edges,
      current: 'A'
    },
    {
      description: "Update distances to neighbors of A: B=4, C=2",
      nodes: SAMPLE_GRAPH.nodes.map(n => ({
        ...n,
        distance: n.id === 'A' ? 0 : n.id === 'B' ? 4 : n.id === 'C' ? 2 : Infinity,
        visited: n.id === 'A'
      })),
      edges: SAMPLE_GRAPH.edges.map(e => ({
        ...e,
        highlighted: (e.from === 'A' && (e.to === 'B' || e.to === 'C'))
      })),
      current: 'C'
    },
    {
      description: "Visit C (smallest unvisited distance). Update B=3 via C",
      nodes: SAMPLE_GRAPH.nodes.map(n => ({
        ...n,
        distance: n.id === 'A' ? 0 : n.id === 'B' ? 3 : n.id === 'C' ? 2 : n.id === 'D' ? 7 : n.id === 'E' ? 8 : Infinity,
        visited: n.id === 'A' || n.id === 'C',
        previous: n.id === 'B' ? 'C' : n.id === 'C' ? 'A' : n.id === 'D' ? 'C' : n.id === 'E' ? 'C' : null
      })),
      edges: SAMPLE_GRAPH.edges.map(e => ({
        ...e,
        highlighted: (e.from === 'C' && (e.to === 'B' || e.to === 'D' || e.to === 'E'))
      })),
      current: 'B'
    }
  ];

  const handleReset = () => {
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < dijkstraSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = dijkstraSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Graph Algorithms Visualization
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore pathfinding and graph traversal algorithms with interactive visualizations.
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Algorithm</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="algorithm"
                  value="dijkstra"
                  checked={algorithm === 'dijkstra'}
                  onChange={() => {}} // Static for demo
                  className="text-purple-600"
                />
                <div>
                  <span className="font-medium">Dijkstra&apos;s Algorithm</span>
                  <p className="text-sm text-gray-600">Find shortest paths from source</p>
                  <p className="text-xs text-purple-600 font-mono">O((V + E) log V)</p>
                </div>
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Current Step</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {dijkstraSteps.length}
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-purple-800">
                  {currentStepData.description}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Controls</h3>
            <div className="flex space-x-2">
              <Button 
                onClick={handlePrev} 
                disabled={currentStep === 0}
                size="sm"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button onClick={handleReset} size="sm" variant="outline">
                Reset
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={currentStep === dijkstraSteps.length - 1}
                size="sm"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Graph Visualization */}
        <Card className="p-6 mb-8">
          <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
            <svg width="500" height="400" className="mx-auto">
              {/* Edges */}
              {currentStepData.edges.map((edge, index) => {
                const fromNode = currentStepData.nodes.find(n => n.id === edge.from);
                const toNode = currentStepData.nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                
                return (
                  <g key={index}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={edge.highlighted ? "#8b5cf6" : "#d1d5db"}
                      strokeWidth={edge.highlighted ? 3 : 2}
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 10}
                      textAnchor="middle"
                      className="text-sm font-medium fill-gray-600"
                    >
                      {edge.weight}
                    </text>
                  </g>
                );
              })}
              
              {/* Arrow marker */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#d1d5db"
                  />
                </marker>
              </defs>
              
              {/* Nodes */}
              {currentStepData.nodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill={
                      node.id === currentStepData.current ? "#8b5cf6" :
                      node.visited ? "#10b981" : "#f3f4f6"
                    }
                    stroke={node.visited ? "#059669" : "#d1d5db"}
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="text-lg font-bold"
                    fill={node.visited ? "white" : "#374151"}
                  >
                    {node.label}
                  </text>
                  {node.distance !== Infinity && (
                    <text
                      x={node.x}
                      y={node.y - 35}
                      textAnchor="middle"
                      className="text-sm font-medium fill-purple-600"
                    >
                      d: {node.distance}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </Card>

        {/* Legend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Current Node</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              <span className="text-sm">Visited Node</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-gray-400"></div>
              <span className="text-sm">Unvisited Node</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-1 bg-purple-500"></div>
              <span className="text-sm">Active Edge</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
