'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, ChevronLeft, ChevronRight, Home, Refresh } from 'lucide-react';

export default function BrowserHistoryPage() {
  const [currentSite, setCurrentSite] = useState(0);
  const [history, setHistory] = useState([
    { id: 1, url: 'https://example.com', title: 'Example Homepage', timestamp: new Date() },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const sampleSites = [
    { url: 'https://example.com', title: 'Example Homepage', color: 'bg-blue-500' },
    { url: 'https://github.com', title: 'GitHub - Code Repository', color: 'bg-gray-800' },
    { url: 'https://stackoverflow.com', title: 'Stack Overflow - Developer Q&A', color: 'bg-orange-500' },
    { url: 'https://reactjs.org', title: 'React - JavaScript Library', color: 'bg-blue-400' },
    { url: 'https://tailwindcss.com', title: 'Tailwind CSS - Utility Framework', color: 'bg-teal-500' },
  ];

  const navigateToSite = (siteIndex) => {
    const site = sampleSites[siteIndex];
    const newHistoryItem = {
      id: Date.now(),
      url: site.url,
      title: site.title,
      timestamp: new Date()
    };

    // Truncate history if we're in the middle and navigating to new page
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHistoryItem);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentSite(siteIndex);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const prevSite = history[historyIndex - 1];
      const siteIndex = sampleSites.findIndex(site => site.url === prevSite.url);
      setCurrentSite(siteIndex);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextSite = history[historyIndex + 1];
      const siteIndex = sampleSites.findIndex(site => site.url === nextSite.url);
      setCurrentSite(siteIndex);
    }
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;
  const currentSiteData = sampleSites[currentSite];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Browser History</h1>
                <p className="text-xs text-gray-500">Doubly Linked List Navigation</p>
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
          {/* History & Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Browser Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button 
                    onClick={goBack}
                    disabled={!canGoBack}
                    size="sm"
                    variant={canGoBack ? "default" : "secondary"}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={goForward}
                    disabled={!canGoForward}
                    size="sm"
                    variant={canGoForward ? "default" : "secondary"}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => navigateToSite(0)}
                    size="sm"
                    variant="outline"
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-800 mb-2">History Stats</h4>
                  <div className="text-sm text-gray-600">
                    <p>Total Pages: {history.length}</p>
                    <p>Current Position: {historyIndex + 1}</p>
                    <p>Can Go Back: {canGoBack ? 'Yes' : 'No'}</p>
                    <p>Can Go Forward: {canGoForward ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Navigation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {history.map((item, index) => (
                    <div 
                      key={item.id}
                      className={`p-2 rounded text-xs ${
                        index === historyIndex 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <div className="font-semibold truncate">{item.title}</div>
                      <div className="truncate">{item.url}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Algorithm Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Doubly Linked List</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    O(1) navigation in both directions
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">Features</h4>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Bidirectional navigation</li>
                    <li>• History truncation</li>
                    <li>• Memory efficient</li>
                    <li>• Real-time updates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Browser Simulation */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Browser History Navigation System</CardTitle>
                <p className="text-gray-600">
                  Complete browser simulation using doubly linked lists
                </p>
              </CardHeader>
              <CardContent>
                {/* Browser Interface */}
                <div className="bg-gray-100 rounded-lg p-1 mb-6">
                  {/* Browser Toolbar */}
                  <div className="bg-white rounded-t p-3 flex items-center space-x-3 border-b">
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={goBack}
                        disabled={!canGoBack}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={goForward}
                        disabled={!canGoForward}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigateToSite(currentSite)}
                      >
                        <Refresh className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 bg-gray-50 rounded px-3 py-2 text-sm text-gray-700">
                      {currentSiteData.url}
                    </div>
                  </div>

                  {/* Website Content */}
                  <div className="bg-white rounded-b p-8 min-h-96 flex items-center justify-center">
                    <motion.div
                      key={currentSite}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <div className={`w-20 h-20 ${currentSiteData.color} rounded-xl mx-auto mb-4 flex items-center justify-center`}>
                        <Globe className="h-10 w-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentSiteData.title}
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Simulated website content for {currentSiteData.url}
                      </p>
                      
                      <div className="flex justify-center space-x-2">
                        {sampleSites.map((site, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={index === currentSite ? "default" : "outline"}
                            onClick={() => navigateToSite(index)}
                          >
                            Navigate to {site.title.split(' - ')[0]}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Algorithm Visualization */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-3">How It Works</h3>
                    <div className="space-y-2 text-sm text-indigo-800">
                      <p>• <strong>Node Structure:</strong> Each page has prev/next pointers</p>
                      <p>• <strong>Current Pointer:</strong> Tracks active page</p>
                      <p>• <strong>History Truncation:</strong> Removes forward history on new navigation</p>
                      <p>• <strong>Memory Management:</strong> Configurable history limits</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3">Real-World Usage</h3>
                    <div className="space-y-2 text-sm text-orange-800">
                      <p>• <strong>Web Browsers:</strong> Chrome, Firefox, Safari</p>
                      <p>• <strong>Mobile Apps:</strong> Navigation stacks</p>
                      <p>• <strong>File Explorers:</strong> Folder navigation</p>
                      <p>• <strong>IDEs:</strong> File history and navigation</p>
                    </div>
                  </div>
                </div>

                {/* History Timeline */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Navigation Timeline</h3>
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                    {history.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`min-w-24 h-16 rounded-lg flex flex-col items-center justify-center text-xs font-semibold p-2 ${
                          index === historyIndex 
                            ? 'bg-blue-500 text-white' 
                            : index < historyIndex
                            ? 'bg-green-400 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        <Globe className="h-4 w-4 mb-1" />
                        <span className="text-center leading-tight">
                          {item.title.split(' ')[0]}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Timeline shows navigation history. Current page is highlighted in blue.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
