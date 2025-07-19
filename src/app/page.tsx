'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Search, 
  Network, 
  Database, 
  Play,
  Brain
} from 'lucide-react';
import { ALGORITHM_COLORS } from '../lib/utils';

export default function HomePage() {
  const realWorldApplications = [
    {
      id: 'autocomplete',
      name: 'Smart Search & Autocomplete',
      description: 'Experience how Trie and Hash Tables power real-time search suggestions, just like Google or IDE autocomplete.',
      icon: Search,
      href: '/autocomplete-system',
      color: 'from-blue-500 to-cyan-500',
      algorithms: ['Trie Data Structure', 'Hash Tables', 'Prefix Matching'],
      realWorld: 'Google Search, IDE Autocomplete, Spell Checkers',
      featured: true
    },
    {
      id: 'navigation',
      name: 'GPS Navigation System',
      description: 'See how GPS apps like Google Maps find the shortest route using graph algorithms.',
      icon: Network,
      href: '/gps-navigation',
      color: 'from-green-500 to-emerald-500',
      algorithms: ['Dijkstra Algorithm', 'A* Search', 'Graph Traversal'],
      realWorld: 'Google Maps, Waze, Uber Routing',
      featured: true
    },
    {
      id: 'social-network',
      name: 'Social Network Analysis',
      description: 'Discover how social media platforms suggest friends and analyze connections.',
      icon: Brain,
      href: '/social-network',
      color: 'from-purple-500 to-pink-500',
      algorithms: ['BFS/DFS', 'Graph Analysis', 'Community Detection'],
      realWorld: 'Facebook Friend Suggestions, LinkedIn Connections',
      featured: false
    },
    {
      id: 'spell-checker',
      name: 'Spell Checker & Text Correction',
      description: 'Build a spell checker like the one in Microsoft Word using edit distance algorithms.',
      icon: BarChart3,
      href: '/spell-checker',
      color: 'from-red-500 to-orange-500',
      algorithms: ['Levenshtein Distance', 'Dynamic Programming', 'String Matching'],
      realWorld: 'Microsoft Word, Grammarly, Google Docs',
      featured: false
    },
    {
      id: 'undo-redo',
      name: 'Undo/Redo System',
      description: 'Create a mini text editor with undo/redo functionality using stacks, like in every software.',
      icon: Database,
      href: '/undo-redo-editor',
      color: 'from-indigo-500 to-blue-500',
      algorithms: ['Stack Data Structure', 'Command Pattern', 'State Management'],
      realWorld: 'Text Editors, Photoshop, Code Editors',
      featured: false
    },
    {
      id: 'browser-history',
      name: 'Browser History Navigation',
      description: 'Simulate browser back/forward buttons and understand how browsers manage navigation history.',
      icon: Play,
      href: '/browser-history',
      color: 'from-yellow-500 to-orange-500',
      algorithms: ['Linked Lists', 'Stack Operations', 'History Management'],
      realWorld: 'Chrome, Firefox, Safari Navigation',
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <Brain className="h-10 w-10 text-white" />
              </motion.div>
            </div>
          </div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            DSA in the{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Real World
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Discover how algorithms power the applications you use every day.
            From Google Search to GPS navigation, explore interactive demos that show 
            data structures and algorithms solving real problems.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button size="lg" className="text-lg px-8 py-3">
              <Link href="/autocomplete-system" className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Try Autocomplete Demo
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Algorithm Categories */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Real-World Algorithm Applications
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience how algorithms power the applications you use every day. Each demo showcases practical implementations with interactive examples.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realWorldApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative"
              >
                {app.featured && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-semibold">
                      Featured
                    </div>
                  </div>
                )}
                
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${app.color} flex items-center justify-center mb-4`}>
                      <app.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{app.name}</CardTitle>
                    <CardDescription className="text-base">
                      {app.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {app.algorithms.map((algo: string) => (
                        <span
                          key={algo}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-700 dark:text-gray-300"
                        >
                          {algo}
                        </span>
                      ))}
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="text-xs font-medium text-green-800 dark:text-green-400 mb-1">
                        Real-world Usage:
                      </div>
                      <div className="text-xs text-green-700 dark:text-green-300">
                        {app.realWorld}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Interactive Demo
                      </span>
                      <Link href={app.href}>
                        <Button size="sm">
                          Try It Live
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
