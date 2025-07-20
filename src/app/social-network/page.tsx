'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Play, RotateCcw, Settings, Zap, Timer, Target, Network } from 'lucide-react';

// Node types for social network
interface NetworkNode {
  id: string;
  name: string;
  x: number;
  y: number;
  connections: string[];
  color: string;
  size: number;
  visited: boolean;
  community?: number;
  centrality?: number;
}

// Edge interface
interface NetworkEdge {
  from: string;
  to: string;
  weight: number;
  highlighted: boolean;
}

// Algorithm step interface
interface AlgorithmStep {
  description: string;
  currentNode: string | null;
  visitedNodes: string[];
  highlightedEdges: { from: string; to: string }[];
  communities?: { [key: number]: string[] };
  recommendations?: { user: string; suggested: string[]; score: number }[];
}

// Algorithm results interface
interface AlgorithmResult {
  steps: AlgorithmStep[];
  success: boolean;
  executionTime: number;
  communities?: { [key: number]: string[] };
  centralityScores?: { [key: string]: number };
  recommendations?: { user: string; suggested: string[]; score: number }[];
  networkMetrics?: {
    totalNodes: number;
    totalEdges: number;
    averageDegree: number;
    clustering: number;
    diameter: number;
  };
}

// Algorithm types
type AlgorithmType = 'bfs' | 'dfs' | 'community' | 'recommendations';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const NODE_RADIUS = 20;

// Sample social network data
const SAMPLE_USERS = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
  'Kate', 'Liam', 'Maya', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Ruby', 'Sam', 'Tina'
];

export default function SocialNetworkAnalysisPage() {
  const [mounted, setMounted] = useState(false);
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bfs');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [speed, setSpeed] = useState(50);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [networkType, setNetworkType] = useState<'random' | 'clustered' | 'scalefree'>('random');
  
  const animationRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isRunningRef = useRef(false);

  // Generate random network
  const generateNetwork = useCallback((type: 'random' | 'clustered' | 'scalefree' = 'random') => {
    const nodeCount = 15;
    const newNodes: NetworkNode[] = [];
    const newEdges: NetworkEdge[] = [];

    // Create nodes positioned in a circle for better visualization
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * 2 * Math.PI;
      const radius = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.35;
      const centerX = CANVAS_WIDTH / 2;
      const centerY = CANVAS_HEIGHT / 2;
      
      newNodes.push({
        id: `user_${i}`,
        name: SAMPLE_USERS[i] || `User${i}`,
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 100,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 100,
        connections: [],
        color: '#3b82f6',
        size: NODE_RADIUS,
        visited: false,
      });
    }

    // Generate connections based on network type
    switch (type) {
      case 'random':
        // Random connections - create multiple components for community detection
        const componentSize = Math.floor(nodeCount / 3); // 3 components
        
        // Create 3 separate components with internal connections
        for (let component = 0; component < 3; component++) {
          const start = component * componentSize;
          const end = Math.min((component + 1) * componentSize, nodeCount);
          
          // Dense connections within each component
          for (let i = start; i < end; i++) {
            for (let j = i + 1; j < end; j++) {
              if (Math.random() < 0.6) { // Higher probability for within-component connections
                newNodes[i].connections.push(newNodes[j].id);
                newNodes[j].connections.push(newNodes[i].id);
                newEdges.push({
                  from: newNodes[i].id,
                  to: newNodes[j].id,
                  weight: Math.random(),
                  highlighted: false
                });
              }
            }
          }
        }
        
        // Add a few random inter-component connections (sparse)
        for (let i = 0; i < nodeCount; i++) {
          for (let j = i + componentSize; j < nodeCount; j++) {
            if (Math.floor(i / componentSize) !== Math.floor(j / componentSize) && Math.random() < 0.05) {
              newNodes[i].connections.push(newNodes[j].id);
              newNodes[j].connections.push(newNodes[i].id);
              newEdges.push({
                from: newNodes[i].id,
                to: newNodes[j].id,
                weight: Math.random(),
                highlighted: false
              });
            }
          }
        }
        break;
        
      case 'clustered':
        // Create 3 distinct clusters with minimal inter-cluster connections
        const clusterSize = Math.floor(nodeCount / 3);
        for (let cluster = 0; cluster < 3; cluster++) {
          const start = cluster * clusterSize;
          const end = Math.min((cluster + 1) * clusterSize, nodeCount);
          
          // Very high connectivity within cluster
          for (let i = start; i < end; i++) {
            for (let j = i + 1; j < end; j++) {
              if (Math.random() < 0.8) { // Higher probability for tight clusters
                newNodes[i].connections.push(newNodes[j].id);
                newNodes[j].connections.push(newNodes[i].id);
                newEdges.push({
                  from: newNodes[i].id,
                  to: newNodes[j].id,
                  weight: Math.random(),
                  highlighted: false
                });
              }
            }
          }
        }
        
        // Very sparse connections between clusters (sometimes none)
        for (let cluster = 0; cluster < 2; cluster++) {
          if (Math.random() < 0.4) { // Only 40% chance of inter-cluster connection
            const start1 = cluster * clusterSize;
            const end1 = (cluster + 1) * clusterSize;
            const start2 = (cluster + 1) * clusterSize;
            const end2 = Math.min((cluster + 2) * clusterSize, nodeCount);
            
            const bridgeNode1 = start1 + Math.floor(Math.random() * (end1 - start1));
            const bridgeNode2 = start2 + Math.floor(Math.random() * (end2 - start2));
            
            if (bridgeNode2 < nodeCount) {
              newNodes[bridgeNode1].connections.push(newNodes[bridgeNode2].id);
              newNodes[bridgeNode2].connections.push(newNodes[bridgeNode1].id);
              newEdges.push({
                from: newNodes[bridgeNode1].id,
                to: newNodes[bridgeNode2].id,
                weight: Math.random(),
                highlighted: false
              });
            }
          }
        }
        break;
        
      case 'scalefree':
        // Create scale-free network with multiple components
        // First create a main component with preferential attachment
        const mainComponentSize = Math.floor(nodeCount * 0.7); // 70% in main component
        
        // Main component with preferential attachment
        for (let i = 1; i < mainComponentSize; i++) {
          const connections = Math.max(1, Math.floor(Math.random() * 3) + 1);
          for (let c = 0; c < connections; c++) {
            let targetIndex = 0;
            if (i > 1) {
              const totalConnections = newNodes.slice(0, i).reduce((sum, node) => sum + node.connections.length, 0);
              if (totalConnections > 0) {
                let random = Math.random() * totalConnections;
                for (let j = 0; j < i; j++) {
                  random -= newNodes[j].connections.length;
                  if (random <= 0) {
                    targetIndex = j;
                    break;
                  }
                }
              }
            }
            
            if (!newNodes[i].connections.includes(newNodes[targetIndex].id)) {
              newNodes[i].connections.push(newNodes[targetIndex].id);
              newNodes[targetIndex].connections.push(newNodes[i].id);
              newEdges.push({
                from: newNodes[i].id,
                to: newNodes[targetIndex].id,
                weight: Math.random(),
                highlighted: false
              });
            }
          }
        }
        
        // Create smaller isolated components with remaining nodes
        for (let i = mainComponentSize; i < nodeCount - 1; i += 2) {
          if (i + 1 < nodeCount) {
            // Create small 2-3 node components
            newNodes[i].connections.push(newNodes[i + 1].id);
            newNodes[i + 1].connections.push(newNodes[i].id);
            newEdges.push({
              from: newNodes[i].id,
              to: newNodes[i + 1].id,
              weight: Math.random(),
              highlighted: false
            });
            
            // Sometimes add a third node to make a triangle
            if (i + 2 < nodeCount && Math.random() < 0.5) {
              newNodes[i].connections.push(newNodes[i + 2].id);
              newNodes[i + 2].connections.push(newNodes[i].id);
              newNodes[i + 1].connections.push(newNodes[i + 2].id);
              newNodes[i + 2].connections.push(newNodes[i + 1].id);
              newEdges.push(
                {
                  from: newNodes[i].id,
                  to: newNodes[i + 2].id,
                  weight: Math.random(),
                  highlighted: false
                },
                {
                  from: newNodes[i + 1].id,
                  to: newNodes[i + 2].id,
                  weight: Math.random(),
                  highlighted: false
                }
              );
              i++; // Skip the third node in next iteration
            }
          }
        }
        break;
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setSteps([]);
    setCurrentStep(0);
    setResult(null);
    setSelectedNode(null);
  }, []);

  // Initialize network on component mount
  useEffect(() => {
    generateNetwork(networkType);
  }, [generateNetwork, networkType]);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // BFS Algorithm for social network traversal
  const bfsAlgorithm = useCallback((startNodeId: string): AlgorithmResult => {
    const startTime = performance.now();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<string>();
    const queue: string[] = [startNodeId];
    const visitedNodes: string[] = [];

    steps.push({
      description: `Starting BFS from ${nodes.find(n => n.id === startNodeId)?.name || startNodeId}`,
      currentNode: startNodeId,
      visitedNodes: [],
      highlightedEdges: []
    });

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      
      visited.add(currentId);
      visitedNodes.push(currentId);
      
      const currentNode = nodes.find(n => n.id === currentId);
      if (!currentNode) continue;

      const highlightedEdges: { from: string; to: string }[] = [];
      
      // Add unvisited neighbors to queue
      for (const connectionId of currentNode.connections) {
        if (!visited.has(connectionId)) {
          queue.push(connectionId);
          highlightedEdges.push({ from: currentId, to: connectionId });
        }
      }

      steps.push({
        description: `Visiting ${currentNode.name}. Found ${currentNode.connections.length} connections. Added ${highlightedEdges.length} new nodes to explore.`,
        currentNode: currentId,
        visitedNodes: [...visitedNodes],
        highlightedEdges
      });
    }

    const endTime = performance.now();
    
    return {
      steps,
      success: true,
      executionTime: endTime - startTime,
      networkMetrics: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        averageDegree: edges.length * 2 / nodes.length,
        clustering: 0, // Simplified
        diameter: visitedNodes.length
      }
    };
  }, [nodes, edges]);

  // DFS Algorithm for social network traversal
  const dfsAlgorithm = useCallback((startNodeId: string): AlgorithmResult => {
    const startTime = performance.now();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<string>();
    const visitedNodes: string[] = [];

    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      
      visited.add(nodeId);
      visitedNodes.push(nodeId);
      
      const currentNode = nodes.find(n => n.id === nodeId);
      if (!currentNode) return;

      steps.push({
        description: `Exploring ${currentNode.name} deeply. Connected to ${currentNode.connections.length} users.`,
        currentNode: nodeId,
        visitedNodes: [...visitedNodes],
        highlightedEdges: currentNode.connections.map(connId => ({ from: nodeId, to: connId }))
      });

      // Visit each connection depth-first
      for (const connectionId of currentNode.connections) {
        if (!visited.has(connectionId)) {
          dfs(connectionId);
        }
      }
    };

    steps.push({
      description: `Starting DFS from ${nodes.find(n => n.id === startNodeId)?.name || startNodeId}`,
      currentNode: startNodeId,
      visitedNodes: [],
      highlightedEdges: []
    });

    dfs(startNodeId);
    
    const endTime = performance.now();
    
    return {
      steps,
      success: true,
      executionTime: endTime - startTime,
      networkMetrics: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        averageDegree: edges.length * 2 / nodes.length,
        clustering: 0,
        diameter: visitedNodes.length
      }
    };
  }, [nodes, edges]);

  // Community Detection Algorithm (simplified)
  const communityDetection = useCallback((): AlgorithmResult => {
    const startTime = performance.now();
    const steps: AlgorithmStep[] = [];
    const communities: { [key: number]: string[] } = {};
    let communityId = 0;
    const visited = new Set<string>();

    steps.push({
      description: "Starting community detection using connected components analysis to find separate groups",
      currentNode: null,
      visitedNodes: [],
      highlightedEdges: []
    });

    // Simple community detection using connected components
    for (const node of nodes) {
      if (visited.has(node.id)) continue;
      
      // BFS to find connected component
      const queue = [node.id];
      const community: string[] = [];
      
      while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (visited.has(currentId)) continue;
        
        visited.add(currentId);
        community.push(currentId);
        
        const currentNode = nodes.find(n => n.id === currentId);
        if (currentNode) {
          for (const connId of currentNode.connections) {
            if (!visited.has(connId)) {
              queue.push(connId);
            }
          }
        }
      }
      
      if (community.length > 0) {
        communities[communityId] = community;
        communityId++;
        
        steps.push({
          description: `Found community/component ${communityId} with ${community.length} members: ${community.map(id => nodes.find(n => n.id === id)?.name).join(', ')}. These users form a separate connected group.`,
          currentNode: null,
          visitedNodes: community,
          highlightedEdges: [],
          communities: { ...communities }
        });
      }
    }

    const endTime = performance.now();
    
    return {
      steps,
      success: true,
      executionTime: endTime - startTime,
      communities,
      networkMetrics: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        averageDegree: edges.length * 2 / nodes.length,
        clustering: 0,
        diameter: 0
      }
    };
  }, [nodes, edges]);

  // Friend Recommendation Algorithm
  const friendRecommendations = useCallback((userId: string): AlgorithmResult => {
    const startTime = performance.now();
    const steps: AlgorithmStep[] = [];
    const recommendations: { user: string; suggested: string[]; score: number }[] = [];

    const user = nodes.find(n => n.id === userId);
    if (!user) {
      return {
        steps: [],
        success: false,
        executionTime: 0
      };
    }

    const userFriends = new Set(user.connections);
    const friendNames = user.connections.map(id => nodes.find(n => n.id === id)?.name).filter(Boolean);

    steps.push({
      description: `🔍 Starting friend recommendations for ${user.name} who has ${user.connections.length} friends: ${friendNames.join(', ')}`,
      currentNode: userId,
      visitedNodes: [userId],
      highlightedEdges: user.connections.map(id => ({ from: userId, to: id }))
    });

    // Friends of friends algorithm with detailed tracking
    const friendsOfFriends = new Map<string, number>();
    const mutualFriendsDetails = new Map<string, string[]>(); // Track which mutual friends led to recommendation

    // Step 2: Analyze each friend's connections
    for (const friendId of user.connections) {
      const friend = nodes.find(n => n.id === friendId);
      if (!friend) continue;

      const friendsFriendsNames = friend.connections
        .filter(id => id !== userId && !userFriends.has(id))
        .map(id => nodes.find(n => n.id === id)?.name)
        .filter(Boolean);

      steps.push({
        description: `📋 Examining ${friend.name}'s connections. They have ${friend.connections.length} friends. Potential recommendations from ${friend.name}: ${friendsFriendsNames.join(', ') || 'None'}`,
        currentNode: friendId,
        visitedNodes: [userId, friendId],
        highlightedEdges: [
          { from: userId, to: friendId },
          ...friend.connections.map(id => ({ from: friendId, to: id }))
        ]
      });

      // Check each of this friend's connections
      for (const fofId of friend.connections) {
        if (fofId !== userId && !userFriends.has(fofId)) {
          const currentCount = friendsOfFriends.get(fofId) || 0;
          friendsOfFriends.set(fofId, currentCount + 1);
          
          // Track mutual friends
          if (!mutualFriendsDetails.has(fofId)) {
            mutualFriendsDetails.set(fofId, []);
          }
          mutualFriendsDetails.get(fofId)!.push(friend.name);

          const fofNode = nodes.find(n => n.id === fofId);
          const mutualCount = currentCount + 1;
          
          steps.push({
            description: `✨ Found potential friend: ${fofNode?.name}! Mutual connection through ${friend.name}. Total mutual friends so far: ${mutualCount}`,
            currentNode: fofId,
            visitedNodes: [userId, friendId, fofId],
            highlightedEdges: [
              { from: userId, to: friendId },
              { from: friendId, to: fofId }
            ]
          });
        }
      }
    }

    // Step 3: Rank and explain recommendations
    const sortedRecommendations = Array.from(friendsOfFriends.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (sortedRecommendations.length === 0) {
      steps.push({
        description: `❌ No friend recommendations found. ${user.name}'s friends don't have any mutual connections with non-friends.`,
        currentNode: userId,
        visitedNodes: [userId],
        highlightedEdges: []
      });
    } else {
      steps.push({
        description: `🎯 Ranking recommendations by mutual friend count:`,
        currentNode: userId,
        visitedNodes: [userId],
        highlightedEdges: []
      });

      // Detailed explanation for each recommendation
      sortedRecommendations.forEach(([recommendedId, mutualCount], index) => {
        const recommendedUser = nodes.find(n => n.id === recommendedId);
        const mutualFriends = mutualFriendsDetails.get(recommendedId) || [];
        
        steps.push({
          description: `${index + 1}. 💡 Recommend ${recommendedUser?.name} (Score: ${mutualCount}) - Mutual friends: ${mutualFriends.join(', ')}. This means ${mutualFriends.join(' and ')} ${mutualFriends.length === 1 ? 'is' : 'are'} friends with both ${user.name} and ${recommendedUser?.name}!`,
          currentNode: recommendedId,
          visitedNodes: [userId, recommendedId],
          highlightedEdges: [
            { from: userId, to: recommendedId },
            ...mutualFriends.map(mutualName => {
              const mutualId = nodes.find(n => n.name === mutualName)?.id;
              return mutualId ? [
                { from: userId, to: mutualId },
                { from: mutualId, to: recommendedId }
              ] : [];
            }).flat()
          ]
        });
      });
    }

    const suggestedIds = sortedRecommendations.map(([id]) => id);
    const score = sortedRecommendations.reduce((sum, [, count]) => sum + count, 0);

    recommendations.push({
      user: userId,
      suggested: suggestedIds,
      score
    });

    steps.push({
      description: `🎉 Friend recommendation complete! Generated ${sortedRecommendations.length} suggestions with total score of ${score}. Algorithm works like Facebook's "People You May Know" - the more mutual friends, the higher the recommendation!`,
      currentNode: userId,
      visitedNodes: [userId, ...suggestedIds],
      highlightedEdges: suggestedIds.map(id => ({ from: userId, to: id })),
      recommendations
    });

    const endTime = performance.now();
    
    return {
      steps,
      success: true,
      executionTime: endTime - startTime,
      recommendations,
      networkMetrics: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        averageDegree: edges.length * 2 / nodes.length,
        clustering: 0,
        diameter: 0
      }
    };
  }, [nodes, edges]);

  // Animate through algorithm steps
  const animateSteps = useCallback((algorithmSteps: AlgorithmStep[]) => {
    let stepIndex = 0;

    const animate = () => {
      if (stepIndex < algorithmSteps.length && isRunningRef.current) {
        const step = algorithmSteps[stepIndex];
        setCurrentStep(stepIndex);

        // Update node visualization
        setNodes(prevNodes => {
          return prevNodes.map(node => ({
            ...node,
            visited: step.visitedNodes.includes(node.id),
            color: step.currentNode === node.id ? '#ef4444' : 
                   step.visitedNodes.includes(node.id) ? '#10b981' : '#3b82f6',
            community: step.communities ? 
              Object.keys(step.communities).find(key => 
                step.communities![parseInt(key)].includes(node.id)
              ) ? parseInt(Object.keys(step.communities).find(key => 
                step.communities![parseInt(key)].includes(node.id)
              )!) : undefined : undefined
          }));
        });

        // Update edge visualization
        setEdges(prevEdges => {
          return prevEdges.map(edge => ({
            ...edge,
            highlighted: step.highlightedEdges.some(he => 
              (he.from === edge.from && he.to === edge.to) ||
              (he.from === edge.to && he.to === edge.from)
            )
          }));
        });

        stepIndex++;
        
        // Slower animation for recommendations algorithm to make it more readable
        let delay;
        if (algorithm === 'recommendations') {
          delay = Math.max(1500, 2200 - (speed * 15)); // Much slower for recommendations (1.5-2.2 seconds)
        } else {
          delay = 210 - (speed * 2); // Normal speed for other algorithms
        }
        
        animationRef.current = setTimeout(animate, delay);
      } else {
        setIsRunning(false);
        isRunningRef.current = false;
        animationRef.current = undefined;
      }
    };

    animate();
  }, [speed, algorithm]);

  // Run selected algorithm
  const runAlgorithm = useCallback(() => {
    if (isRunning) return;

    let algorithmResult: AlgorithmResult;
    
    switch (algorithm) {
      case 'bfs':
        if (!selectedNode) {
          alert('Please select a starting node first');
          return;
        }
        algorithmResult = bfsAlgorithm(selectedNode);
        break;
      case 'dfs':
        if (!selectedNode) {
          alert('Please select a starting node first');
          return;
        }
        algorithmResult = dfsAlgorithm(selectedNode);
        break;
      case 'community':
        algorithmResult = communityDetection();
        break;
      case 'recommendations':
        if (!selectedNode) {
          alert('Please select a user for recommendations');
          return;
        }
        algorithmResult = friendRecommendations(selectedNode);
        break;
      default:
        return;
    }

    setSteps(algorithmResult.steps);
    setResult(algorithmResult);
    setIsRunning(true);
    isRunningRef.current = true;

    if (algorithmResult.steps.length > 0) {
      animateSteps(algorithmResult.steps);
    } else {
      setIsRunning(false);
      isRunningRef.current = false;
    }
  }, [algorithm, selectedNode, bfsAlgorithm, dfsAlgorithm, communityDetection, friendRecommendations, animateSteps, isRunning]);

  // Stop animation
  const stopAlgorithm = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = undefined;
    }
    setIsRunning(false);
    isRunningRef.current = false;
  }, []);

  // Reset visualization
  const resetVisualization = useCallback(() => {
    stopAlgorithm();
    setNodes(prevNodes => prevNodes.map(node => ({
      ...node,
      visited: false,
      color: '#3b82f6',
      community: undefined
    })));
    setEdges(prevEdges => prevEdges.map(edge => ({
      ...edge,
      highlighted: false
    })));
    setSteps([]);
    setCurrentStep(0);
    setResult(null);
  }, [stopAlgorithm]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const algorithmNames = {
    bfs: "BFS Network Traversal",
    dfs: "DFS Network Traversal", 
    community: "Community Detection",
    recommendations: "Friend Recommendations"
  };

  const algorithmDescriptions = {
    bfs: "Explores social network level by level, finding shortest connection paths between users.",
    dfs: "Explores social network deeply, following connection chains as far as possible before backtracking.",
    community: "Detects separate groups/communities in the network using connected components analysis.",
    recommendations: "Suggests new friends based on mutual connections, like Facebook's 'People You May Know'."
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Social Network Analysis</h1>
            </div>
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Social Network Analysis</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how social media platforms suggest friends and analyze connections. 
            Explore network traversal, community detection, and recommendation algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="xl:col-span-1 space-y-6">
            {/* Algorithm Selection */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Algorithm</h3>
              </div>
              
              <div className="space-y-3">
                {(Object.keys(algorithmNames) as AlgorithmType[]).map((algo) => (
                  <button
                    key={algo}
                    onClick={() => setAlgorithm(algo)}
                    disabled={isRunning}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      algorithm === algo
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-800'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-medium">{algorithmNames[algo]}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {algorithmDescriptions[algo]}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Network Configuration */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Network className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Network Type</h3>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setNetworkType('random')}
                  disabled={isRunning}
                  className={`w-full p-2 rounded-lg text-left transition-all ${
                    networkType === 'random'
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium">Random Network</div>
                  <div className="text-xs text-gray-600">Multiple components for community detection</div>
                </button>
                
                <button
                  onClick={() => setNetworkType('clustered')}
                  disabled={isRunning}
                  className={`w-full p-2 rounded-lg text-left transition-all ${
                    networkType === 'clustered'
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium">Clustered Network</div>
                  <div className="text-xs text-gray-600">Distinct communities with sparse bridges</div>
                </button>
                
                <button
                  onClick={() => setNetworkType('scalefree')}
                  disabled={isRunning}
                  className={`w-full p-2 rounded-lg text-left transition-all ${
                    networkType === 'scalefree'
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium">Scale-Free Network</div>
                  <div className="text-xs text-gray-600">Hub-based main component + small groups</div>
                </button>
              </div>
            </Card>

            {/* Controls */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Controls</h3>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={runAlgorithm}
                  disabled={isRunning}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Analysis
                </Button>

                <Button
                  onClick={stopAlgorithm}
                  disabled={!isRunning}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Stop
                </Button>

                <Button
                  onClick={resetVisualization}
                  disabled={isRunning}
                  variant="outline"
                  className="w-full"
                >
                  Reset
                </Button>

                <Button
                  onClick={() => generateNetwork(networkType)}
                  disabled={isRunning}
                  variant="outline"
                  className="w-full"
                >
                  Generate New Network
                </Button>
              </div>

              {/* Speed Control */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animation Speed: {speed}%
                  {algorithm === 'recommendations' && (
                    <span className="text-xs text-purple-600 ml-2">
                      (Recommendations run slower for readability)
                    </span>
                  )}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  disabled={isRunning}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
                {algorithm === 'recommendations' && (
                  <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-700">
                      💡 <strong>Tip:</strong> For Friend Recommendations, each step shows detailed analysis. 
                      Use slower speeds (10-30%) to read each explanation comfortably.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Selected Node */}
            {selectedNode && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold">Selected User</h3>
                </div>
                
                <div className="text-sm">
                  <div className="font-medium">
                    {nodes.find(n => n.id === selectedNode)?.name}
                  </div>
                  <div className="text-gray-600 mt-1">
                    {nodes.find(n => n.id === selectedNode)?.connections.length} connections
                  </div>
                </div>
              </Card>
            )}

            {/* Results */}
            {result && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Timer className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold">Analysis Results</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={result.success ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {result.success ? 'Complete' : 'Failed'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Execution Time:</span>
                    <span className="font-medium">{result.executionTime.toFixed(2)}ms</span>
                  </div>
                  {result.networkMetrics && (
                    <>
                      <div className="flex justify-between">
                        <span>Network Size:</span>
                        <span className="font-medium">{result.networkMetrics.totalNodes} users</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Connections:</span>
                        <span className="font-medium">{result.networkMetrics.totalEdges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Degree:</span>
                        <span className="font-medium">{result.networkMetrics.averageDegree.toFixed(1)}</span>
                      </div>
                    </>
                  )}
                  
                  {result.communities && Object.keys(result.communities).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="font-medium mb-2">Communities Found:</div>
                      {Object.entries(result.communities).map(([id, members]) => (
                        <div key={id} className="text-xs text-gray-600 mb-1">
                          Group {parseInt(id) + 1}: {members.length} members
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {result.recommendations && result.recommendations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="font-medium mb-2">🎯 Friend Suggestions:</div>
                      <div className="bg-purple-50 p-3 rounded-lg mb-2">
                        <div className="text-xs text-purple-700 font-medium mb-2">
                          📊 Recommendation Breakdown:
                        </div>
                        {result.recommendations[0].suggested.slice(0, 5).map((userId, index) => {
                          const user = nodes.find(n => n.id === userId);
                          const selectedUser = nodes.find(n => n.id === selectedNode);
                          
                          // Calculate mutual friends for this recommendation
                          const selectedUserFriends = new Set(selectedUser?.connections || []);
                          const mutualFriends = (user?.connections || [])
                            .filter(friendId => selectedUserFriends.has(friendId))
                            .map(friendId => nodes.find(n => n.id === friendId)?.name)
                            .filter(Boolean);

                          const mutualCount = mutualFriends.length;
                          
                          return user ? (
                            <div key={userId} className="text-xs bg-white p-2 rounded border-l-2 border-purple-400 mb-1">
                              <div className="font-medium text-purple-800">
                                #{index + 1} {user.name} (Score: {mutualCount})
                              </div>
                              <div className="text-purple-600 mt-1">
                                � Mutual friends: {mutualFriends.length > 0 ? mutualFriends.join(', ') : 'None found'}
                              </div>
                              <div className="text-purple-500 text-xs mt-1">
                                💡 Why recommended: {mutualCount > 1 
                                  ? `${mutualCount} mutual connections indicate strong social overlap` 
                                  : mutualCount === 1 
                                  ? `1 mutual friend suggests potential connection`
                                  : 'Part of extended social network'}
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        🧠 <strong>Algorithm Insight:</strong> Higher scores = more mutual friends = stronger recommendation (like Facebook&apos;s &ldquo;People You May Know&rdquo;)
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Main Visualization */}
          <div className="xl:col-span-3">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Social Network Graph</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span>User</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>Visited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                    <span>Highlighted</span>
                  </div>
                </div>
              </div>
              
              {/* Network Visualization */}
              <div className="border border-gray-300 rounded-lg bg-white p-4">
                <svg 
                  width={CANVAS_WIDTH} 
                  height={CANVAS_HEIGHT}
                  className="border border-gray-200 rounded"
                >
                  {/* Render edges */}
                  {edges.map((edge, index) => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    
                    return (
                      <line
                        key={`edge-${index}`}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={edge.highlighted ? '#fbbf24' : '#6b7280'}
                        strokeWidth={edge.highlighted ? 4 : 2}
                        opacity={edge.highlighted ? 1 : 0.8}
                      />
                    );
                  })}
                  
                  {/* Render nodes */}
                  {nodes.map((node) => (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size}
                        fill={node.color}
                        stroke="#ffffff"
                        strokeWidth={selectedNode === node.id ? 3 : 2}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedNode(node.id)}
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        className="text-xs fill-white font-medium pointer-events-none"
                      >
                        {node.name.slice(0, 6)}
                      </text>
                      {node.community !== undefined && (
                        <text
                          x={node.x}
                          y={node.y - node.size - 5}
                          textAnchor="middle"
                          className="text-xs fill-purple-600 font-medium pointer-events-none"
                        >
                          C{node.community + 1}
                        </text>
                      )}
                    </g>
                  ))}
                </svg>
              </div>
              
              {/* Instructions */}
              {!selectedNode && !isRunning && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Tip:</strong> Click on any user node to select them, then choose an algorithm to start the analysis.
                  </p>
                </div>
              )}
              
              {/* Step Description */}
              {currentStepData && showDetails && (
                <div className={`mt-4 p-4 rounded-lg ${
                  algorithm === 'recommendations' 
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-400' 
                    : 'bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${
                        algorithm === 'recommendations' ? 'text-purple-800' : 'text-blue-800'
                      }`}>
                        Step {currentStep + 1} of {steps.length}
                      </h4>
                      {algorithm === 'recommendations' && (
                        <span className="px-2 py-1 text-xs bg-purple-200 text-purple-700 rounded-full">
                          Friend Analysis
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Enhanced formatting for friend recommendations */}
                  {algorithm === 'recommendations' ? (
                    <div className="space-y-2">
                      <div className={`p-3 rounded-lg ${
                        currentStepData.description.includes('🔍') ? 'bg-blue-100 border-l-4 border-blue-400' :
                        currentStepData.description.includes('📋') ? 'bg-green-100 border-l-4 border-green-400' :
                        currentStepData.description.includes('✨') ? 'bg-yellow-100 border-l-4 border-yellow-400' :
                        currentStepData.description.includes('🎯') ? 'bg-orange-100 border-l-4 border-orange-400' :
                        currentStepData.description.includes('💡') ? 'bg-purple-100 border-l-4 border-purple-400' :
                        currentStepData.description.includes('🎉') ? 'bg-pink-100 border-l-4 border-pink-400' :
                        'bg-white'
                      }`}>
                        <p className={`font-medium leading-relaxed ${
                          algorithm === 'recommendations' ? 'text-gray-800 text-sm' : 'text-blue-700'
                        }`}>
                          {currentStepData.description}
                        </p>
                      </div>
                      
                      {/* Progress indicator for recommendations */}
                      <div className="flex items-center justify-between text-xs text-purple-600 mt-2">
                        <div className="flex items-center gap-1">
                          <span>Progress:</span>
                          <div className="w-32 h-2 bg-purple-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 transition-all duration-300"
                              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="font-medium">
                          {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-blue-700 leading-relaxed">{currentStepData.description}</p>
                  )}
                </div>
              )}
              
              {!showDetails && steps.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Show step details
                  </button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
