'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Undo2, Redo2, FileText, Layers } from 'lucide-react';

export default function UndoRedoEditorPage() {
  const [content, setContent] = useState('Welcome to the Advanced Text Editor!\n\nThis editor demonstrates the power of stack data structures for implementing unlimited undo/redo functionality.\n\nTry editing this text and then use the undo/redo buttons to see the algorithm in action.');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleContentChange = (newContent) => {
    setContent(newContent);
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(content);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex >= 0) {
      setContent(history[historyIndex]);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setContent(history[historyIndex + 1]);
    }
  };

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Edit3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Undo/Redo Editor</h1>
                <p className="text-xs text-gray-500">Stack-Based Command Pattern</p>
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
          {/* Controls & Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Editor Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className="w-full"
                  variant={canUndo ? "default" : "secondary"}
                >
                  <Undo2 className="h-4 w-4 mr-2" />
                  Undo
                </Button>
                <Button 
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className="w-full"
                  variant={canRedo ? "default" : "secondary"}
                >
                  <Redo2 className="h-4 w-4 mr-2" />
                  Redo
                </Button>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-800 mb-2">History Stack</h4>
                  <div className="text-sm text-gray-600">
                    <p>Total Operations: {history.length}</p>
                    <p>Current Position: {historyIndex + 1}</p>
                    <p>Can Undo: {canUndo ? 'Yes' : 'No'}</p>
                    <p>Can Redo: {canRedo ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Algorithm Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 flex items-center">
                    <Layers className="h-4 w-4 mr-2" />
                    Stack Structure
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    LIFO operations for O(1) undo/redo
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Command Pattern</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Encapsulate operations for reversibility
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">Applications</h4>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Text editors (VSCode, Word)</li>
                    <li>• Image editing (Photoshop)</li>
                    <li>• CAD software</li>
                    <li>• Game development</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Advanced Text Editor
                </CardTitle>
                <p className="text-gray-600">
                  Professional-grade editor with unlimited undo/redo using stack data structures
                </p>
              </CardHeader>
              <CardContent>
                {/* Editor Toolbar */}
                <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <Button
                    size="sm"
                    onClick={handleUndo}
                    disabled={!canUndo}
                    variant={canUndo ? "default" : "ghost"}
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRedo}
                    disabled={!canRedo}
                    variant={canRedo ? "default" : "ghost"}
                  >
                    <Redo2 className="h-4 w-4" />
                  </Button>
                  <div className="flex-1"></div>
                  <span className="text-sm text-gray-500">
                    {content.length} characters
                  </span>
                </div>

                {/* Text Editor */}
                <textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm leading-relaxed"
                  placeholder="Start typing to create your document..."
                />

                {/* Operation History Visualization */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Operation History</h3>
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                    {history.map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                          index <= historyIndex 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {index + 1}
                      </motion.div>
                    ))}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                      historyIndex === history.length - 1 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      ●
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Each circle represents a state in the undo/redo stack. Current position is highlighted.
                  </p>
                </div>

                {/* Technical Implementation */}
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-2">Stack Implementation</h4>
                    <div className="space-y-1 text-sm text-indigo-700">
                      <p>• <strong>Undo Stack:</strong> Stores previous states</p>
                      <p>• <strong>Redo Stack:</strong> Stores future states</p>
                      <p>• <strong>Current Index:</strong> Tracks position</p>
                      <p>• <strong>Push/Pop:</strong> O(1) operations</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Performance Benefits</h4>
                    <div className="space-y-1 text-sm text-orange-700">
                      <p>• <strong>Time Complexity:</strong> O(1) undo/redo</p>
                      <p>• <strong>Space Efficiency:</strong> Only store deltas</p>
                      <p>• <strong>Memory Management:</strong> Configurable limits</p>
                      <p>• <strong>Real-time:</strong> Instant response</p>
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
