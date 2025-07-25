'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Network, 
  Database, 
  Play,
  Brain,
  ArrowRight,
  Code,
  Zap,
  BookOpen,
  Users
} from 'lucide-react';

export default function HomePage() {
  const realWorldApplications = [
    {
      id: 'autocomplete',
      name: 'Smart Search & Autocomplete',
      description: 'Experience how Trie and Hash Tables power real-time search suggestions, just like Google or IDE autocomplete.',
      icon,
      href: '/autocomplete-system',
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      algorithms: ['Trie Data Structure', 'Hash Tables', 'Prefix Matching'],
      realWorld: 'Google Search, IDE Autocomplete, Spell Checkers',
      featured,
      emoji: 'ðŸ”',
      difficulty: 'Intermediate'
    },
    {
      id: 'navigation',
      name: 'GPS Navigation System',
      description: 'See how GPS apps like Google Maps find the shortest route using graph algorithms.',
      icon,
      href: '/gps-navigation',
      color: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      algorithms: ['Dijkstra Algorithm', 'A* Search', 'Graph Traversal'],
      realWorld: 'Google Maps, Waze, Uber Routing',
      featured,
      emoji: 'ðŸ—ºï¸',
      difficulty: 'Advanced'
    },
    {
      id: 'social-network',
      name: 'Social Network Analysis',
      description: 'Discover how social media platforms suggest friends and analyze connections.',
      icon,
      href: '/social-network',
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      algorithms: ['BFS/DFS', 'Graph Analysis', 'Community Detection'],
      realWorld: 'Facebook Friend Suggestions, LinkedIn Connections',
      featured,
      emoji: 'ðŸ‘¥',
      difficulty: 'Intermediate'
    },
    {
      id: 'undo-redo',
      name: 'Undo/Redo System',
      description: 'Create a mini text editor with undo/redo functionality using stacks, like in every software.',
      icon,
      href: '/undo-redo-editor',
      color: 'from-indigo-500 to-blue-500',
      bgGradient: 'from-indigo-50 to-blue-50',
      algorithms: ['Stack Data Structure', 'Command Pattern', 'State Management'],
      realWorld: 'Text Editors, Photoshop, Code Editors',
      featured,
      emoji: 'â†©ï¸',
      difficulty: 'Beginner'
    },
    {
      id: 'browser-history',
      name: 'Browser History Navigation',
      description: 'Simulate browser back/forward buttons and understand how browsers manage navigation history.',
      icon,
      href: '/browser-history',
      color: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      algorithms: ['Linked Lists', 'Stack Operations', 'History Management'],
      realWorld: 'Chrome, Firefox, Safari Navigation',
      featured,
      emoji: 'ðŸŒ',
      difficulty: 'Beginner'
    }
  ];

  const stats = [
    { icon, label: 'Interactive Projects', value: '5+' },
    { icon, label: 'Algorithms Covered', value: '15+' },
    { icon, label: 'Learning Hours', value: '10+' },
    { icon, label: 'Real-World Apps', value: '25+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
              >
                <Brain className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DSA Playground</h1>
                <p className="text-xs text-gray-500">Interactive Learning Platform</p>
              </div>
            </div>
            <div className="hidden md items-center space-x-6">
              <Link href="/docs">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Interactive Algorithm Learning
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                DSA in the
              </span>
              <br />
              <span className="text-gray-900">Real World</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-10 leading-relaxed">
              Discover how algorithms power the applications you use every day. From Google 
              Search to GPS navigation, explore interactive demos that show data structures and 
              algorithms solving real problems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/docs">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
                  <Play className="h-5 w-5 mr-2" />
                  Start Learning
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => {
                  document.getElementById('projects-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                <Code className="h-5 w-5 mr-2" />
                View Projects
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm mb-3">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects-section" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real-World Algorithm Applications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience how algorithms power the applications you use every day. Each demo showcases 
              practical implementations with interactive examples.
            </p>
          </motion.div>

          {/* Featured Projects */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Featured Projects</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {realWorldApplications.filter(app => app.featured).map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link href={app.href}>
                    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
                      {/* Background gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${app.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                      
                      <CardContent className="relative p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="text-4xl">{app.emoji}</div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">{app.name}</h3>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                app.difficulty === 'Beginner' ? 'bg-green-100 text-green-800'  app.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800'  'bg-red-100 text-red-800'
                              }`}>
                                {app.difficulty}
                              </span>
                            </div>
                          </div>
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            whileHover={{ x }}
                          >
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                              <ArrowRight className="h-4 w-4 text-gray-700" />
                            </div>
                          </motion.div>
                        </div>
                        
                        <p className="text-gray-700 mb-6 leading-relaxed text-lg">{app.description}</p>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Algorithms</h4>
                            <div className="flex flex-wrap gap-2">
                              {app.algorithms.map((algorithm) => (
                                <span key={algorithm} className="px-3 py-1 bg-white/60 text-gray-700 rounded-full text-sm font-medium">
                                  {algorithm}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Real-World Usage</h4>
                            <p className="text-gray-600 text-sm">{app.realWorld}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                          Explore Project
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* All Projects */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">More Projects</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {realWorldApplications.filter(app => !app.featured).map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <Link href={app.href}>
                    <Card className="group relative overflow-hidden border-0 bg-white shadow-md hover:shadow-lg transition-all duration-300 h-full">
                      <div className={`absolute inset-0 bg-gradient-to-br ${app.bgGradient} opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                      
                      <CardContent className="relative p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="text-2xl">{app.emoji}</div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{app.name}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              app.difficulty === 'Beginner' ? 'bg-green-100 text-green-800'  app.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800'  'bg-red-100 text-red-800'
                            }`}>
                              {app.difficulty}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{app.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex flex-wrap gap-1">
                              {app.algorithms.slice(0, 2).map((algorithm) => (
                                <span key={algorithm} className="px-2 py-1 bg-white/60 text-gray-700 rounded text-xs">
                                  {algorithm}
                                </span>
                              ))}
                              {app.algorithms.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                                  +{app.algorithms.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                          Try it out
                          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">DSA Playground</span>
            </div>
            <p className="text-gray-400 mb-6">Interactive learning platform for data structures and algorithms</p>
            <div className="flex justify-center space-x-6 text-gray-400">
              <span>Made by Prajjwal â¤ï¸</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

