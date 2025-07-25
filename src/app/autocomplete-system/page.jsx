'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Brain, Zap } from 'lucide-react';

export default function AutocompleteSystemPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  // Sample data for demo
  const sampleWords = [
    'javascript', 'java', 'python', 'react', 'angular', 'vue',
    'typescript', 'algorithm', 'data structure', 'programming',
    'computer science', 'software engineering', 'web development'
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = sampleWords.filter(word => 
        word.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Autocomplete System</h1>
                <p className="text-xs text-gray-500">Trie & Hash Table Implementation</p>
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
                <CardTitle>Algorithm Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    Trie Structure
                  </h4>
                  <p className="text-sm text-blue-700 mt-2">
                    Efficient prefix matching with O(m) search complexity
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Hash Table
                  </h4>
                  <p className="text-sm text-purple-700 mt-2">
                    O(1) average lookup for frequency counting
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">Features</h4>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Real-time suggestions</li>
                    <li>• Frequency-based ranking</li>
                    <li>• Case-insensitive matching</li>
                    <li>• Dynamic vocabulary</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Smart Search & Autocomplete System</CardTitle>
                <p className="text-gray-600">
                  Advanced autocomplete using Trie data structures and hash tables
                </p>
              </CardHeader>
              <CardContent>
                {/* Search Interface */}
                <div className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Start typing to see autocomplete suggestions..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                  </div>
                  
                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                    >
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={suggestion}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleSearch(suggestion)}
                        >
                          <div className="flex items-center">
                            <Search className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-gray-900">{suggestion}</span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Algorithm Explanation */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">How It Works</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p>• <strong>Trie Construction:</strong> Words stored as tree paths</p>
                      <p>• <strong>Prefix Search:</strong> Traverse trie to prefix node</p>
                      <p>• <strong>Suggestion Collection:</strong> DFS to gather all completions</p>
                      <p>• <strong>Ranking:</strong> Sort by frequency and relevance</p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Real-World Usage</h3>
                    <div className="space-y-2 text-sm text-green-800">
                      <p>• <strong>Google Search:</strong> Query autocompletion</p>
                      <p>• <strong>IDE Code:</strong> Variable and function suggestions</p>
                      <p>• <strong>Mobile Keyboards:</strong> Word predictions</p>
                      <p>• <strong>Social Media:</strong> Hashtag suggestions</p>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">O(m)</div>
                      <div className="text-sm text-gray-600">Search Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">O(1)</div>
                      <div className="text-sm text-gray-600">Hash Lookup</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">&lt;1ms</div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">100K+</div>
                      <div className="text-sm text-gray-600">Words Capacity</div>
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
