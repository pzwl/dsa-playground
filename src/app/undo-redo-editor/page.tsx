'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Undo2, 
  Redo2, 
  Type, 
  FileText, 
  Settings, 
  Play, 
  RotateCcw, 
  Trash2,
  Database,
  Clock,
  Layers
} from 'lucide-react';

// Command interface for undo/redo operations
interface Command {
  id: string;
  type: 'insert' | 'delete' | 'replace';
  position: number;
  oldText: string;
  newText: string;
  timestamp: number;
  description: string;
}

// Editor state interface
interface EditorState {
  text: string;
  cursorPosition: number;
  selectionStart?: number;
  selectionEnd?: number;
}

// History step for visualization
interface HistoryStep {
  description: string;
  undoStackSize: number;
  redoStackSize: number;
  currentText: string;
  operation: 'execute' | 'undo' | 'redo' | 'clear';
  command?: Command;
  highlightStart?: number;
  highlightEnd?: number;
}

export default function UndoRedoEditorPage() {
  // Editor state
  const [editorState, setEditorState] = useState<EditorState>({
    text: 'Hello, World! Welcome to the Undo/Redo Editor demonstration.\n\nTry typing, deleting, or making changes to see how the stack-based undo/redo system works in real-time!',
    cursorPosition: 0
  });

  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState<Command[]>([]);
  const [redoStack, setRedoStack] = useState<Command[]>([]);
  
  // Visualization state
  const [isAnimating, setIsAnimating] = useState(false);
  const [historySteps, setHistorySteps] = useState<HistoryStep[]>([]);
  const [showVisualization, setShowVisualization] = useState(true);
  const [autoExecute, setAutoExecute] = useState(false);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Generate unique ID for commands
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);

  // Create command from text change
  const createCommand = useCallback((
    type: 'insert' | 'delete' | 'replace',
    position: number,
    oldText: string,
    newText: string,
    description: string
  ): Command => {
    return {
      id: generateId(),
      type,
      position,
      oldText,
      newText,
      timestamp: Date.now(),
      description
    };
  }, [generateId]);

  // Execute command and add to undo stack
  const executeCommand = useCallback((command: Command, skipHistory: boolean = false) => {
    setEditorState(prev => {
      const newText = prev.text.slice(0, command.position) + 
                     command.newText + 
                     prev.text.slice(command.position + command.oldText.length);
      
      return {
        ...prev,
        text: newText,
        cursorPosition: command.position + command.newText.length
      };
    });

    setUndoStack(prev => [...prev, command]);
    setRedoStack([]); // Clear redo stack when new command is executed
    
    if (!skipHistory) {
      const newStep: HistoryStep = {
        description: `Execute: ${command.description}`,
        undoStackSize: undoStack.length + 1,
        redoStackSize: 0,
        currentText: editorState.text.slice(0, command.position) + 
                    command.newText + 
                    editorState.text.slice(command.position + command.oldText.length),
        operation: 'execute',
        command,
        highlightStart: command.position,
        highlightEnd: command.position + command.newText.length
      };
      
      setHistorySteps(prev => [...prev, newStep]);
    }
  }, [undoStack.length, editorState.text]);

  // Undo last command
  const undoCommand = useCallback((skipHistory: boolean = false) => {
    if (undoStack.length === 0) return;

    const command = undoStack[undoStack.length - 1];
    
    setEditorState(prev => {
      const newText = prev.text.slice(0, command.position) + 
                     command.oldText + 
                     prev.text.slice(command.position + command.newText.length);
      
      return {
        ...prev,
        text: newText,
        cursorPosition: command.position + command.oldText.length
      };
    });

    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, command]);
    
    if (!skipHistory) {
      const newStep: HistoryStep = {
        description: `Undo: ${command.description}`,
        undoStackSize: undoStack.length - 1,
        redoStackSize: redoStack.length + 1,
        currentText: editorState.text.slice(0, command.position) + 
                    command.oldText + 
                    editorState.text.slice(command.position + command.newText.length),
        operation: 'undo',
        command,
        highlightStart: command.position,
        highlightEnd: command.position + command.oldText.length
      };
      
      setHistorySteps(prev => [...prev, newStep]);
    }
  }, [undoStack, redoStack.length, editorState.text]);

  // Redo last undone command
  const redoCommand = useCallback((skipHistory: boolean = false) => {
    if (redoStack.length === 0) return;

    const command = redoStack[redoStack.length - 1];
    
    setEditorState(prev => {
      const newText = prev.text.slice(0, command.position) + 
                     command.newText + 
                     prev.text.slice(command.position + command.oldText.length);
      
      return {
        ...prev,
        text: newText,
        cursorPosition: command.position + command.newText.length
      };
    });

    setUndoStack(prev => [...prev, command]);
    setRedoStack(prev => prev.slice(0, -1));
    
    if (!skipHistory) {
      const newStep: HistoryStep = {
        description: `Redo: ${command.description}`,
        undoStackSize: undoStack.length + 1,
        redoStackSize: redoStack.length - 1,
        currentText: editorState.text.slice(0, command.position) + 
                    command.newText + 
                    editorState.text.slice(command.position + command.oldText.length),
        operation: 'redo',
        command,
        highlightStart: command.position,
        highlightEnd: command.position + command.newText.length
      };
      
      setHistorySteps(prev => [...prev, newStep]);
    }
  }, [redoStack, undoStack.length, editorState.text]);

  // Handle text changes in textarea
  const handleTextChange = useCallback((newText: string) => {
    const oldText = editorState.text;
    const cursorPos = textareaRef.current?.selectionStart || 0;
    
    // Simple diff algorithm to detect changes
    let changeStart = 0;
    let changeEndOld = oldText.length;
    let changeEndNew = newText.length;
    
    // Find start of change
    while (changeStart < oldText.length && changeStart < newText.length && 
           oldText[changeStart] === newText[changeStart]) {
      changeStart++;
    }
    
    // Find end of change
    while (changeEndOld > changeStart && changeEndNew > changeStart && 
           oldText[changeEndOld - 1] === newText[changeEndNew - 1]) {
      changeEndOld--;
      changeEndNew--;
    }
    
    const deletedText = oldText.slice(changeStart, changeEndOld);
    const insertedText = newText.slice(changeStart, changeEndNew);
    
    // Create appropriate command
    let command: Command;
    if (deletedText && insertedText) {
      command = createCommand(
        'replace',
        changeStart,
        deletedText,
        insertedText,
        `Replace &quot;${deletedText}&quot; with &quot;${insertedText}&quot;`
      );
    } else if (insertedText) {
      command = createCommand(
        'insert',
        changeStart,
        '',
        insertedText,
        `Insert "${insertedText}"`
      );
    } else if (deletedText) {
      command = createCommand(
        'delete',
        changeStart,
        deletedText,
        '',
        `Delete "${deletedText}"`
      );
    } else {
      return; // No change
    }
    
    if (autoExecute) {
      executeCommand(command);
    } else {
      // Just update the editor state without adding to history
      setEditorState(prev => ({
        ...prev,
        text: newText,
        cursorPosition: cursorPos
      }));
    }
  }, [editorState.text, createCommand, executeCommand, autoExecute]);

  // Run demo sequence
  const runDemo = useCallback(() => {
    setIsAnimating(true);
    let stepIndex = 0;
    
    // Demo operations
    const demoOperations = [
      () => {
        const command = createCommand('insert', editorState.text.length, '', '\n\nThis is a demo insertion!', 'Insert demo text');
        executeCommand(command);
      },
      () => {
        const command = createCommand('replace', 0, 'Hello', 'Hi there', 'Replace greeting');
        executeCommand(command);
      },
      () => {
        const deletePos = editorState.text.indexOf('demonstration');
        if (deletePos !== -1) {
          const command = createCommand('delete', deletePos, 'demonstration', '', 'Delete word "demonstration"');
          executeCommand(command);
        }
      },
      () => {
        const command = createCommand('insert', 0, '', '🎉 ', 'Insert emoji at start');
        executeCommand(command);
      }
    ];
    
    const runNextStep = () => {
      if (stepIndex < demoOperations.length) {
        demoOperations[stepIndex]();
        stepIndex++;
        
        setTimeout(runNextStep, 1000);
      } else {
        setIsAnimating(false);
      }
    };
    
    runNextStep();
  }, [createCommand, executeCommand, editorState.text]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
    setHistorySteps(prev => [...prev, {
      description: 'Clear: All history cleared',
      undoStackSize: 0,
      redoStackSize: 0,
      currentText: editorState.text,
      operation: 'clear'
    }]);
  }, [editorState.text]);

  // Reset editor
  const resetEditor = useCallback(() => {
    setEditorState({
      text: 'Hello, World! Welcome to the Undo/Redo Editor demonstration.\n\nTry typing, deleting, or making changes to see how the stack-based undo/redo system works in real-time!',
      cursorPosition: 0
    });
    setUndoStack([]);
    setRedoStack([]);
    setHistorySteps([]);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undoCommand();
        } else if (e.key === 'z' && e.shiftKey || e.key === 'y') {
          e.preventDefault();
          redoCommand();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undoCommand, redoCommand]);

  // Stack visualization component
  const StackVisualization = ({ title, stack, isRedo = false }: { 
    title: string; 
    stack: Command[]; 
    isRedo?: boolean;
  }) => (
    <div className="bg-white rounded-lg p-4 border">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <Database className="h-4 w-4" />
        {title} ({stack.length})
      </h4>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {stack.length === 0 ? (
          <div className="text-gray-400 text-sm italic text-center py-4">
            Stack is empty
          </div>
        ) : (
          stack.slice().reverse().map((command, index) => (
            <div
              key={command.id}
              className={`p-2 rounded border-l-4 text-xs transition-all ${
                index === 0 
                  ? isRedo 
                    ? 'bg-green-50 border-green-400 text-green-800' 
                    : 'bg-blue-50 border-blue-400 text-blue-800'
                  : 'bg-gray-50 border-gray-300 text-gray-600'
              }`}
            >
              <div className="font-medium">{command.description}</div>
              <div className="text-gray-500 mt-1">
                {command.type} at pos {command.position}
              </div>
              {index === 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  ← {isRedo ? 'Next to redo' : 'Last command (top of stack)'}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Type className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Undo/Redo Text Editor</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience how text editors, IDEs, and design software implement undo/redo functionality using stack data structures.
            Every change is stored as a command that can be reversed or re-applied.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            {/* Main Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Editor Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => undoCommand()}
                    disabled={undoStack.length === 0 || isAnimating}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Undo2 className="h-4 w-4" />
                    Undo ({undoStack.length})
                  </Button>
                  <Button
                    onClick={() => redoCommand()}
                    disabled={redoStack.length === 0 || isAnimating}
                    variant="outline"
                    className="flex items-center gap-2 text-sm"
                  >
                    <Redo2 className="h-4 w-4" />
                    Redo ({redoStack.length})
                  </Button>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <div className="space-y-2">
                    <Button
                      onClick={runDemo}
                      disabled={isAnimating}
                      className="w-full flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Run Demo
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={clearHistory}
                        disabled={isAnimating}
                        variant="outline"
                        className="flex items-center gap-2 text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear History
                      </Button>
                      <Button
                        onClick={resetEditor}
                        disabled={isAnimating}
                        variant="outline"
                        className="flex items-center gap-2 text-sm"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Auto-execute commands</label>
                  <input
                    type="checkbox"
                    checked={autoExecute}
                    onChange={(e) => setAutoExecute(e.target.checked)}
                    className="rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show visualization</label>
                  <input
                    type="checkbox"
                    checked={showVisualization}
                    onChange={(e) => setShowVisualization(e.target.checked)}
                    className="rounded"
                  />
                </div>
                
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Tip:</strong> Use Ctrl+Z (Undo) and Ctrl+Y (Redo) keyboard shortcuts!
                </div>
              </CardContent>
            </Card>

            {/* Algorithm Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded">
                    <strong className="text-blue-800">Stack Data Structure:</strong>
                    <p className="text-blue-700 mt-1">Commands are stored in a Last-In-First-Out (LIFO) structure - perfect for undo operations!</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded">
                    <strong className="text-green-800">Command Pattern:</strong>
                    <p className="text-green-700 mt-1">Each edit is encapsulated as a reversible command object.</p>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded">
                    <strong className="text-purple-800">Real-World Usage:</strong>
                    <p className="text-purple-700 mt-1">Used in VS Code, Photoshop, Word, Google Docs, and every modern editor!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Editor */}
          <div className="xl:col-span-2 space-y-6">
            {/* Text Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Text Editor
                  <span className="text-sm font-normal text-gray-600">
                    ({editorState.text.length} chars)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    ref={textareaRef}
                    value={editorState.text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    placeholder="Start typing to see the undo/redo system in action..."
                  />
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Cursor position: {editorState.cursorPosition}</span>
                    <span>
                      Undo available: {undoStack.length} | Redo available: {redoStack.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stack Visualization */}
            {showVisualization && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StackVisualization 
                  title="Undo Stack" 
                  stack={undoStack}
                />
                <StackVisualization 
                  title="Redo Stack" 
                  stack={redoStack}
                  isRedo={true}
                />
              </div>
            )}

            {/* Operation History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Operation History
                  <Button
                    onClick={() => setHistorySteps([])}
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                  >
                    Clear History
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {historySteps.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                      No operations yet. Start typing or run the demo to see the history!
                    </div>
                  ) : (
                    historySteps.map((step, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 transition-all ${
                          step.operation === 'execute' ? 'bg-blue-50 border-blue-400' :
                          step.operation === 'undo' ? 'bg-orange-50 border-orange-400' :
                          step.operation === 'redo' ? 'bg-green-50 border-green-400' :
                          'bg-gray-50 border-gray-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{step.description}</span>
                          <span className="text-xs text-gray-500">
                            #{index + 1}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                          <span>Undo: {step.undoStackSize}</span>
                          <span>Redo: {step.redoStackSize}</span>
                          {step.command && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {step.command.type} @ {step.command.position}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Info */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-indigo-600 mb-2">🎯 Learning Objectives</div>
                <ul className="text-gray-600 space-y-1">
                  <li>• Stack data structure (LIFO)</li>
                  <li>• Command design pattern</li>
                  <li>• State management in editors</li>
                  <li>• Reversible operations</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-green-600 mb-2">🔧 Real-World Applications</div>
                <ul className="text-gray-600 space-y-1">
                  <li>• Text editors (VS Code, Vim)</li>
                  <li>• Design software (Photoshop)</li>
                  <li>• Document editors (Google Docs)</li>
                  <li>• IDEs and code editors</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-purple-600 mb-2">⚡ Key Concepts</div>
                <ul className="text-gray-600 space-y-1">
                  <li>• LIFO (Last In, First Out)</li>
                  <li>• Command encapsulation</li>
                  <li>• State restoration</li>
                  <li>• Memory management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
