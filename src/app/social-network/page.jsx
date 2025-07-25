'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Network, UserPlus, Target } from 'lucide-react';

export default function SocialNetworkPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const sampleUsers = [
    { id: 1, name: 'Alice', connections: 15, influence: 85 },
    { id: 2, name: 'Bob', connections: 12, influence: 72 },
    { id: 3, name: 'Charlie', connections: 8, influence: 65 },
    { id: 4, name: 'Diana', connections: 20, influence: 92 },
    { id: 5, name: 'Eve', connections: 6, influence: 58 }
  ];

  const handleAnalyzeNetwork = (user) => {
    setSelectedUser(user);
    setAnalysis({
      mutualFriends: Math.floor(Math.random() * 5) + 1,
      shortestPath: Math.floor(Math.random() * 3) + 2,
      suggestions: sampleUsers.filter(u => u.id !== user.id).slice(0, 3)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Social Network Analysis</h1>
                <p className="text-xs text-gray-500">Graph Algorithms & Community Detection</p>
              </div>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Algorithm Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Graph Algorithms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">BFS Algorithm</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Shortest path between users
                  </p>
                  <p className="text-xs text-blue-600 mt-2">O(V + E)</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800">DFS Algorithm</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Community detection
                  </p>
                  <p className="text-xs text-purple-600 mt-2">O(V + E)</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">Applications</h4>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Friend suggestions</li>
                    <li>• Community detection</li>
                    <li>• Influence analysis</li>
                    <li>• Connection paths</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Social Network Analysis Engine</CardTitle>
                <p className="text-gray-600">
                  Graph algorithms for friend suggestions and community detection
                </p>
              </CardHeader>
              <CardContent>
                {/* User Network */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Network Users</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sampleUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 bg-white rounded-lg border-2 cursor-pointer transition-all ${
                          selectedUser?.id === user.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => handleAnalyzeNetwork(user)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.connections} connections</p>
                            <div className="flex items-center mt-1">
                              <div className={`w-2 h-2 rounded-full mr-1 ${
                                user.influence > 80 ? 'bg-green-500' : 
                                user.influence > 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <span className="text-xs text-gray-500">Influence: {user.influence}%</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Analysis Results */}
                {analysis && selectedUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      Analysis Results for {selectedUser.name}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Network className="h-5 w-5 text-blue-600 mr-2" />
                          <h4 className="font-semibold text-blue-800">Network Path</h4>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{analysis.shortestPath}</p>
                        <p className="text-sm text-blue-700">degrees of separation</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <UserPlus className="h-5 w-5 text-green-600 mr-2" />
                          <h4 className="font-semibold text-green-800">Mutual Friends</h4>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{analysis.mutualFriends}</p>
                        <p className="text-sm text-green-700">common connections</p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Target className="h-5 w-5 text-purple-600 mr-2" />
                          <h4 className="font-semibold text-purple-800">Influence Score</h4>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">{selectedUser.influence}%</p>
                        <p className="text-sm text-purple-700">network influence</p>
                      </div>
                    </div>

                    <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-3">Friend Suggestions</h4>
                      <div className="flex space-x-4">
                        {analysis.suggestions.map((suggestion) => (
                          <div key={suggestion.id} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {suggestion.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{suggestion.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Algorithm Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-3">Graph Representation</h3>
                    <div className="space-y-2 text-sm text-indigo-800">
                      <p>• <strong>Adjacency Lists:</strong> Efficient storage for sparse graphs</p>
                      <p>• <strong>User Nodes:</strong> Store profile and connection data</p>
                      <p>• <strong>Edge Weights:</strong> Relationship strength scoring</p>
                      <p>• <strong>Dynamic Updates:</strong> Real-time connection changes</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3">Real-World Impact</h3>
                    <div className="space-y-2 text-sm text-orange-800">
                      <p>• <strong>Facebook:</strong> Friend recommendations</p>
                      <p>• <strong>LinkedIn:</strong> Professional connections</p>
                      <p>• <strong>Twitter:</strong> Follow suggestions</p>
                      <p>• <strong>Instagram:</strong> Discover people feature</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
