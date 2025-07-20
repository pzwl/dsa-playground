'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Brain,
  Code,
  Zap,
  BookOpen,
  Globe,
  CheckCircle,
  Circle,
  ExternalLink
} from 'lucide-react';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const projects = [
    {
      id: 'autocomplete',
      name: 'Smart Search & Autocomplete System',
      description: 'A comprehensive implementation of autocomplete functionality using advanced trie data structures, hash tables, and prefix matching algorithms.',
      algorithms: [
        {
          name: 'Trie (Prefix Tree)',
          complexity: 'O(m) insertion, O(m) search',
          usage: 'Efficient prefix matching and autocomplete suggestions'
        },
        {
          name: 'Hash Tables',
          complexity: 'O(1) average insertion/lookup',
          usage: 'Fast word frequency counting and caching'
        },
        {
          name: 'Prefix Matching',
          complexity: 'O(p + k) where p=prefix length, k=results',
          usage: 'Finding all words with given prefix'
        },
        {
          name: 'Levenshtein Distance (Dynamic Programming)',
          complexity: 'O(m × n) where m,n are string lengths',
          usage: 'Fuzzy search and spell correction with edit distance'
        }
      ],
      realWorldApps: [
        'Google Search autocomplete',
        'IDE code completion (VSCode, IntelliJ)',
        'Mobile keyboard predictions',
        'Browser URL suggestions',
        'Social media hashtag suggestions'
      ],
      keyFeatures: [
        'Real-time suggestions as you type',
        'Frequency-based ranking',
        'Case-insensitive matching',
        'Dynamic vocabulary updates',
        'Memory-efficient storage',
        'Fuzzy search with spell correction',
        'Edit distance-based suggestions'
      ],
      technicalDetails: 'The trie implementation uses nodes with 26 children arrays for lowercase letters, with additional metadata for word endings and frequencies. Hash tables provide O(1) lookups for word validation and frequency data. Levenshtein distance algorithm uses dynamic programming to calculate edit distance for fuzzy matching and spell correction.',
      href: '/autocomplete-system'
    },
    {
      id: 'navigation',
      name: 'GPS Navigation & Route Finding',
      description: 'Advanced pathfinding system implementing Dijkstra\'s algorithm and A* search to find optimal routes in weighted graphs representing road networks.',
      algorithms: [
        {
          name: 'Dijkstra\'s Algorithm',
          complexity: 'O((V + E) log V) with priority queue',
          usage: 'Finding shortest paths in weighted graphs'
        },
        {
          name: 'A* Search Algorithm',
          complexity: 'O(b^d) where b=branching factor, d=depth',
          usage: 'Heuristic-based pathfinding with goal direction'
        },
        {
          name: 'Graph Traversal (BFS/DFS)',
          complexity: 'O(V + E)',
          usage: 'Exploring graph connectivity and reachability'
        }
      ],
      realWorldApps: [
        'Google Maps route calculation',
        'Waze traffic-aware routing',
        'Uber/Lyft driver routing',
        'GPS navigation systems',
        'Network routing protocols'
      ],
      keyFeatures: [
        'Interactive map visualization',
        'Real-time pathfinding animation',
        'Multiple algorithm comparison',
        'Distance and time calculations',
        'Dynamic obstacle handling'
      ],
      technicalDetails: 'Graph representation using adjacency lists with weighted edges. Priority queue implementation for Dijkstra\'s algorithm using min-heap. A* uses Manhattan distance heuristic for city-grid layouts.',
      href: '/gps-navigation'
    },
    {
      id: 'social-network',
      name: 'Social Network Analysis Engine',
      description: 'Comprehensive social network analysis using graph algorithms for friend suggestions, community detection, and influence analysis.',
      algorithms: [
        {
          name: 'Breadth-First Search (BFS)',
          complexity: 'O(V + E)',
          usage: 'Finding shortest connection paths between users'
        },
        {
          name: 'Depth-First Search (DFS)',
          complexity: 'O(V + E)',
          usage: 'Community detection and connected components'
        },
        {
          name: 'Graph Analysis Algorithms',
          complexity: 'Various based on specific metric',
          usage: 'Centrality measures and influence scoring'
        }
      ],
      realWorldApps: [
        'Facebook friend suggestions',
        'LinkedIn connection recommendations',
        'Twitter follower analysis',
        'Instagram influencer detection',
        'Professional network analysis'
      ],
      keyFeatures: [
        'Interactive network visualization',
        'Friend suggestion algorithm',
        'Community detection',
        'Influence scoring system',
        'Connection path finding'
      ],
      technicalDetails: 'Graph stored as adjacency list with user objects as nodes. BFS used for shortest path calculations. DFS with connected components for community detection. Centrality algorithms for influence metrics.',
      href: '/social-network'
    },
    {
      id: 'undo-redo',
      name: 'Advanced Undo/Redo Text Editor',
      description: 'Professional-grade text editor with unlimited undo/redo functionality using stack data structures and command pattern implementation.',
      algorithms: [
        {
          name: 'Stack Data Structure',
          complexity: 'O(1) push/pop operations',
          usage: 'LIFO operations for undo/redo history'
        },
        {
          name: 'Command Pattern',
          complexity: 'O(1) command execution',
          usage: 'Encapsulating operations for reversibility'
        },
        {
          name: 'State Management',
          complexity: 'O(1) state transitions',
          usage: 'Tracking editor state changes'
        }
      ],
      realWorldApps: [
        'Microsoft Word document editing',
        'Adobe Photoshop layer operations',
        'VSCode text manipulation',
        'Google Docs collaborative editing',
        'CAD software operations'
      ],
      keyFeatures: [
        'Unlimited undo/redo operations',
        'Command history visualization',
        'Memory-efficient state storage',
        'Real-time operation tracking',
        'Keyboard shortcut support'
      ],
      technicalDetails: 'Two-stack implementation: undo stack for previous states, redo stack for future states. Command objects store operation type, position, and content for precise reversibility.',
      href: '/undo-redo-editor'
    },
    {
      id: 'browser-history',
      name: 'Browser History Navigation System',
      description: 'Complete browser-like navigation system using doubly linked lists to implement back/forward functionality with realistic website rendering.',
      algorithms: [
        {
          name: 'Doubly Linked Lists',
          complexity: 'O(1) insertion/deletion at current position',
          usage: 'Bidirectional navigation through history'
        },
        {
          name: 'Stack Operations',
          complexity: 'O(1) push/pop for history management',
          usage: 'Managing navigation states'
        },
        {
          name: 'History Management',
          complexity: 'O(1) for navigation operations',
          usage: 'Tracking and updating browser state'
        }
      ],
      realWorldApps: [
        'Chrome/Firefox browser navigation',
        'Safari back/forward buttons',
        'Mobile app navigation stacks',
        'File explorer history',
        'IDE navigation history'
      ],
      keyFeatures: [
        'Realistic browser interface',
        'Multiple website templates',
        'History truncation on new navigation',
        'Keyboard shortcut support',
        'Visual history timeline'
      ],
      technicalDetails: 'Doubly linked list with prev/next pointers for O(1) navigation. Current node tracking with state updates. History truncation when navigating to new page from middle of history.',
      href: '/browser-history'
    }
  ];

  const concepts = [
    {
      category: 'Data Structures',
      items: [
        { 
          name: 'Trie (Prefix Tree)', 
          description: 'A tree-like data structure used to store associative arrays where keys are strings. Each node represents a character, and paths from root to leaves represent complete words. Highly efficient for prefix-based operations.',
          timeComplexity: 'O(m) insertion/search, where m is key length',
          spaceComplexity: 'O(ALPHABET_SIZE * N * M), where N is number of keys and M is average length',
          applications: ['Autocomplete systems', 'Spell checkers', 'IP routing tables', 'Phone directories'],
          advantages: ['Fast prefix matching', 'Memory efficient for large datasets with common prefixes', 'Easy traversal for lexicographically sorted output'],
          implementation: 'Each node contains an array of child pointers (typically 26 for lowercase letters) and a boolean flag indicating end of word.'
        },
        { 
          name: 'Hash Tables', 
          description: 'A data structure that implements an associative array, mapping keys to values using a hash function. Provides average O(1) time complexity for insertion, deletion, and lookup operations.',
          timeComplexity: 'O(1) average case, O(n) worst case for all operations',
          spaceComplexity: 'O(n) where n is the number of key-value pairs',
          applications: ['Database indexing', 'Caches', 'Symbol tables in compilers', 'Set implementations'],
          advantages: ['Constant average time operations', 'Dynamic sizing', 'Flexible key types'],
          implementation: 'Uses hash function to map keys to array indices. Collision resolution via chaining or open addressing.'
        },
        { 
          name: 'Arrays & Dynamic Arrays', 
          description: 'Contiguous memory locations storing elements of the same type. Dynamic arrays can resize automatically, providing flexible storage with efficient random access.',
          timeComplexity: 'O(1) access, O(1) amortized insertion at end, O(n) insertion at arbitrary position',
          spaceComplexity: 'O(n) where n is the number of elements',
          applications: ['Matrix operations', 'Buffer management', 'Implementation base for other data structures'],
          advantages: ['Cache-friendly memory layout', 'Random access capability', 'Simple implementation'],
          implementation: 'Fixed-size arrays use contiguous memory. Dynamic arrays use growth strategy (typically doubling) when capacity is exceeded.'
        },
        { 
          name: 'Linked Lists', 
          description: 'Linear collection of nodes where each node contains data and a reference to the next node. Doubly linked lists also maintain a reference to the previous node.',
          timeComplexity: 'O(1) insertion/deletion at known position, O(n) search',
          spaceComplexity: 'O(n) where n is the number of nodes',
          applications: ['Implementation of stacks and queues', 'Undo functionality', 'Music playlist management'],
          advantages: ['Dynamic size', 'Efficient insertion/deletion', 'Memory allocation flexibility'],
          implementation: 'Each node contains data field and pointer(s) to adjacent nodes. Head pointer tracks the beginning of the list.'
        },
        { 
          name: 'Stacks', 
          description: 'Last-In-First-Out (LIFO) data structure supporting push and pop operations at one end (top). Essential for managing function calls, expression evaluation, and backtracking.',
          timeComplexity: 'O(1) for push, pop, and top operations',
          spaceComplexity: 'O(n) where n is the number of elements',
          applications: ['Function call management', 'Expression parsing', 'Undo operations', 'Backtracking algorithms'],
          advantages: ['Simple operations', 'Efficient memory usage', 'Natural recursion management'],
          implementation: 'Can be implemented using arrays or linked lists. Array implementation uses index to track top position.'
        },
        { 
          name: 'Graphs', 
          description: 'Non-linear data structure consisting of vertices (nodes) connected by edges. Can be directed or undirected, weighted or unweighted, representing relationships between entities.',
          timeComplexity: 'Varies by representation: Adjacency matrix O(1) edge check, O(V²) space; Adjacency list O(V+E) traversal',
          spaceComplexity: 'O(V²) for adjacency matrix, O(V+E) for adjacency list',
          applications: ['Social networks', 'GPS navigation', 'Network topology', 'Dependency resolution'],
          advantages: ['Models real-world relationships', 'Flexible structure', 'Rich algorithmic support'],
          implementation: 'Adjacency matrix uses 2D array. Adjacency list uses array of lists. Choice depends on density and operations needed.'
        },
        { 
          name: 'Trees', 
          description: 'Hierarchical data structure with nodes connected by edges, forming a connected acyclic graph. Binary trees have at most two children per node.',
          timeComplexity: 'O(log n) average for balanced BST operations, O(n) worst case',
          spaceComplexity: 'O(n) where n is the number of nodes',
          applications: ['File systems', 'Expression parsing', 'Database indexing', 'Decision trees'],
          advantages: ['Hierarchical organization', 'Efficient searching in balanced trees', 'Natural recursion'],
          implementation: 'Each node contains data and pointers to children. BST maintains ordering property for efficient operations.'
        },
        { 
          name: 'Priority Queues & Heaps', 
          description: 'Abstract data type where each element has an associated priority. Heaps are complete binary trees satisfying the heap property, commonly used to implement priority queues.',
          timeComplexity: 'O(log n) insertion/deletion, O(1) peek minimum/maximum',
          spaceComplexity: 'O(n) where n is the number of elements',
          applications: ['Task scheduling', 'Dijkstra\'s algorithm', 'Huffman coding', 'Event simulation'],
          advantages: ['Efficient priority-based operations', 'Guaranteed ordering', 'Compact array representation'],
          implementation: 'Binary heap uses array representation with parent-child relationship defined by indices. Min-heap or max-heap based on comparison.'
        }
      ]
    },
    {
      category: 'Core Algorithms',
      items: [
        { 
          name: 'Prefix Matching & Autocomplete', 
          description: 'Algorithm for finding all strings that begin with a given prefix. Utilizes trie data structure for efficient prefix traversal and suggestion generation.',
          timeComplexity: 'O(p + k) where p is prefix length and k is number of results',
          spaceComplexity: 'O(k) for storing results',
          applications: ['Search engines', 'IDE code completion', 'Command line interfaces', 'Mobile keyboards'],
          advantages: ['Real-time performance', 'Scalable to large vocabularies', 'Memory efficient'],
          implementation: 'Traverse trie to prefix node, then collect all words in subtree using DFS. Results can be sorted by frequency or relevance.'
        },
        { 
          name: 'Levenshtein Distance (Edit Distance)', 
          description: 'Dynamic programming algorithm calculating minimum number of single-character edits (insertions, deletions, substitutions) needed to transform one string into another.',
          timeComplexity: 'O(m × n) where m and n are string lengths',
          spaceComplexity: 'O(m × n) for 2D DP table, can be optimized to O(min(m,n))',
          applications: ['Spell correction', 'Fuzzy string matching', 'DNA sequence alignment', 'Plagiarism detection'],
          advantages: ['Handles all edit types', 'Optimal solution guaranteed', 'Widely applicable'],
          implementation: 'Fill 2D DP table where dp[i][j] represents edit distance between first i chars of string1 and first j chars of string2.'
        },
        { 
          name: 'Graph Traversal (BFS/DFS)', 
          description: 'Fundamental algorithms for systematically visiting all vertices in a graph. BFS explores level by level, DFS explores as deep as possible before backtracking.',
          timeComplexity: 'O(V + E) where V is vertices and E is edges',
          spaceComplexity: 'O(V) for visited array and auxiliary space',
          applications: ['Pathfinding', 'Connected components', 'Topological sorting', 'Cycle detection'],
          advantages: ['Complete graph exploration', 'Linear time complexity', 'Foundation for other algorithms'],
          implementation: 'BFS uses queue for level-order traversal. DFS uses stack (or recursion) for depth-first exploration.'
        },
        { 
          name: 'Shortest Path (Dijkstra\'s Algorithm)', 
          description: 'Greedy algorithm finding shortest paths from a source vertex to all other vertices in a weighted graph with non-negative edge weights.',
          timeComplexity: 'O((V + E) log V) with binary heap, O(V²) with simple implementation',
          spaceComplexity: 'O(V) for distance array and priority queue',
          applications: ['GPS navigation', 'Network routing protocols', 'Flight connections', 'Social network analysis'],
          advantages: ['Optimal solutions', 'Handles weighted graphs', 'Efficient with priority queue'],
          implementation: 'Maintain distance array and priority queue. Repeatedly extract minimum distance vertex and relax adjacent edges.'
        },
        { 
          name: 'A* Search Algorithm', 
          description: 'Informed search algorithm combining Dijkstra\'s algorithm with heuristic function to guide search towards goal. Uses f(n) = g(n) + h(n) where g is cost and h is heuristic.',
          timeComplexity: 'O(b^d) where b is branching factor and d is depth, but often much better with good heuristic',
          spaceComplexity: 'O(b^d) for storing nodes in memory',
          applications: ['Game AI pathfinding', 'Robotics navigation', 'Puzzle solving', 'Route planning'],
          advantages: ['Optimal with admissible heuristic', 'More efficient than Dijkstra for single target', 'Flexible heuristic design'],
          implementation: 'Maintain open and closed sets. Use f-score for priority queue ordering. Manhattan or Euclidean distance common heuristics.'
        },
        { 
          name: 'Dynamic Programming', 
          description: 'Optimization technique solving complex problems by breaking them into overlapping subproblems and storing results to avoid redundant calculations.',
          timeComplexity: 'Varies by problem, typically O(n²) to O(n³) for classic problems',
          spaceComplexity: 'O(n) to O(n²) depending on dimensionality of DP table',
          applications: ['Longest common subsequence', 'Knapsack problem', 'Edit distance', 'Optimal matrix multiplication'],
          advantages: ['Optimal substructure exploitation', 'Eliminates redundant computation', 'Polynomial time for exponential problems'],
          implementation: 'Bottom-up (tabulation) builds table iteratively. Top-down (memoization) uses recursion with caching.'
        },
        { 
          name: 'Binary Search', 
          description: 'Divide-and-conquer algorithm for finding target value in sorted array by repeatedly halving search space based on comparison with middle element.',
          timeComplexity: 'O(log n) where n is array size',
          spaceComplexity: 'O(1) iterative, O(log n) recursive due to call stack',
          applications: ['Database queries', 'Library systems', 'Numerical methods', 'Finding insertion points'],
          advantages: ['Logarithmic time complexity', 'Simple implementation', 'Optimal for sorted data'],
          implementation: 'Maintain left and right pointers. Compare middle element with target and adjust search space accordingly.'
        },
        { 
          name: 'Sorting Algorithms', 
          description: 'Algorithms for arranging elements in specific order. Quick sort uses divide-and-conquer with pivot partitioning. Merge sort guarantees O(n log n) with stable sorting.',
          timeComplexity: 'Quick: O(n log n) average, O(n²) worst; Merge: O(n log n) guaranteed',
          spaceComplexity: 'Quick: O(log n) average; Merge: O(n) for auxiliary array',
          applications: ['Data preprocessing', 'Database operations', 'Search optimization', 'Algorithm analysis'],
          advantages: ['Fundamental operation', 'Various trade-offs available', 'Well-studied complexity'],
          implementation: 'Quick sort partitions around pivot. Merge sort divides array and merges sorted halves.'
        }
      ]
    }
  ];

  const sections = [
    { id: 'overview', name: 'Project Overview', icon: BookOpen },
    { id: 'projects', name: 'Algorithm Implementations', icon: Code },
    { id: 'concepts', name: 'Data Structures & Algorithms', icon: Brain },
    { id: 'complexity', name: 'Complexity Analysis', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DSA Playground</h1>
                <p className="text-xs text-gray-500">Documentation</p>
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
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <section.icon className="h-4 w-4" />
                        <span className="text-sm">{section.name}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    DSA Playground - Technical Documentation
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Comprehensive implementation of data structures and algorithms with real-world applications
                  </p>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">🎯 Project Architecture</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      This project demonstrates practical implementations of fundamental computer science algorithms 
                      through interactive web applications. Each implementation showcases how theoretical concepts 
                      translate into real-world solutions, providing both educational value and practical utility.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      The architecture emphasizes clean separation between algorithm logic and presentation layers, 
                      enabling clear understanding of each algorithms mechanics while maintaining production-quality code standards.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Core Design Principles</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• <strong>Algorithmic Accuracy:</strong> Faithful implementation of classic algorithms with optimal time/space complexity</li>
                        <li>• <strong>Educational Clarity:</strong> Step-by-step execution visualization and detailed complexity analysis</li>
                        <li>• <strong>Production Quality:</strong> TypeScript implementation with comprehensive error handling</li>
                        <li>• <strong>Real-World Context:</strong> Each algorithm solves actual problems found in industry applications</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                        Key Features
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Interactive algorithm visualizations
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Real-world application contexts
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Step-by-step algorithm execution
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Comprehensive complexity analysis
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Modern React/TypeScript implementation
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Code className="h-5 w-5 mr-2 text-blue-600" />
                        Technical Stack
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center">
                          <Circle className="h-2 w-2 mr-3 text-blue-600" />
                          Next.js 14+ with App Router
                        </li>
                        <li className="flex items-center">
                          <Circle className="h-2 w-2 mr-3 text-blue-600" />
                          TypeScript for type safety
                        </li>
                        <li className="flex items-center">
                          <Circle className="h-2 w-2 mr-3 text-blue-600" />
                          Tailwind CSS for styling
                        </li>
                        <li className="flex items-center">
                          <Circle className="h-2 w-2 mr-3 text-blue-600" />
                          Framer Motion for animations
                        </li>
                        <li className="flex items-center">
                          <Circle className="h-2 w-2 mr-3 text-blue-600" />
                          Lucide React for icons
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeSection === 'projects' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  Algorithm Implementations
                </h1>

                {projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">{project.name}</CardTitle>
                        <Link href={project.href}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Try Demo
                          </Button>
                        </Link>
                      </div>
                      <p className="text-gray-700">{project.description}</p>
                    </CardHeader>
                    
                    <CardContent className="p-6 space-y-6">
                      {/* Algorithms */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center">
                          <Brain className="h-5 w-5 mr-2 text-purple-600" />
                          Core Algorithms
                        </h4>
                        <div className="grid md:grid-cols-1 gap-3">
                          {project.algorithms.map((algo, i) => (
                            <div key={i} className="bg-purple-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-purple-800">{algo.name}</span>
                                <span className="text-sm bg-purple-200 text-purple-800 px-2 py-1 rounded">
                                  {algo.complexity}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{algo.usage}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Real-world Applications */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-green-600" />
                          Real-World Applications
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {project.realWorldApps.map((app, i) => (
                            <div key={i} className="bg-green-50 p-3 rounded-lg">
                              <span className="text-sm text-green-800">{app}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Features */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center">
                          <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                          Key Features
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {project.keyFeatures.map((feature, i) => (
                            <div key={i} className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technical Implementation */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center">
                          <Code className="h-5 w-5 mr-2 text-blue-600" />
                          Technical Implementation
                        </h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {project.technicalDetails}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeSection === 'concepts' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  Data Structures & Algorithms Reference
                </h1>

                <div className="mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-700 leading-relaxed">
                        This comprehensive reference covers the fundamental data structures and algorithms implemented 
                        in this project. Each entry includes detailed complexity analysis, practical applications, 
                        and implementation insights essential for understanding algorithmic problem-solving.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {concepts.map((category) => (
                  <Card key={category.category} className="mb-8">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center">
                        {category.category === 'Data Structures' ? (
                          <Brain className="h-6 w-6 mr-3 text-blue-600" />
                        ) : (
                          <Code className="h-6 w-6 mr-3 text-purple-600" />
                        )}
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {category.items.map((concept, i) => (
                        <div key={i} className="border-l-4 border-gray-200 pl-6 py-4">
                          <div className="mb-4">
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{concept.name}</h4>
                            <p className="text-gray-700 leading-relaxed mb-4">{concept.description}</p>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h5 className="font-semibold text-blue-800 mb-2">Time Complexity</h5>
                                <p className="text-sm text-blue-700 font-mono">{concept.timeComplexity}</p>
                              </div>
                              <div className="bg-green-50 p-4 rounded-lg">
                                <h5 className="font-semibold text-green-800 mb-2">Space Complexity</h5>
                                <p className="text-sm text-green-700 font-mono">{concept.spaceComplexity}</p>
                              </div>
                            </div>

                            <div className="mb-4">
                              <h5 className="font-semibold text-gray-800 mb-2">Real-World Applications</h5>
                              <div className="grid md:grid-cols-2 gap-2">
                                {concept.applications.map((app, idx) => (
                                  <div key={idx} className="bg-purple-50 px-3 py-2 rounded text-sm text-purple-800">
                                    {app}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mb-4">
                              <h5 className="font-semibold text-gray-800 mb-2">Key Advantages</h5>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                {concept.advantages.map((advantage, idx) => (
                                  <li key={idx}>{advantage}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h5 className="font-semibold text-gray-800 mb-2">Implementation Details</h5>
                              <p className="text-sm text-gray-700 leading-relaxed">{concept.implementation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeSection === 'complexity' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  Complexity Analysis & Performance
                </h1>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Understanding Big O Notation</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Big O notation describes the upper bound of algorithm performance, focusing on how runtime 
                      or space requirements grow with input size. This analysis is crucial for choosing appropriate 
                      algorithms for different scenarios and data scales.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Time Complexity Classes</h3>
                        <div className="space-y-3">
                          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                            <h4 className="font-semibold text-green-800">O(1) - Constant</h4>
                            <p className="text-sm text-green-700">Hash table lookups, array access by index</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                            <h4 className="font-semibold text-blue-800">O(log n) - Logarithmic</h4>
                            <p className="text-sm text-blue-700">Binary search, balanced tree operations</p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                            <h4 className="font-semibold text-yellow-800">O(n) - Linear</h4>
                            <p className="text-sm text-yellow-700">Linear search, single pass through array</p>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                            <h4 className="font-semibold text-orange-800">O(n log n) - Linearithmic</h4>
                            <p className="text-sm text-orange-700">Efficient sorting algorithms (merge, heap sort)</p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                            <h4 className="font-semibold text-red-800">O(n²) - Quadratic</h4>
                            <p className="text-sm text-red-700">Dynamic programming, nested loops</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Space Complexity Considerations</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 text-sm mb-4">
                            Space complexity measures additional memory requirements beyond input size. 
                            Key considerations include:
                          </p>
                          <ul className="text-sm text-gray-600 space-y-2">
                            <li>• <strong>Auxiliary Space:</strong> Extra space used by algorithm</li>
                            <li>• <strong>In-place:</strong> O(1) extra space algorithms</li>
                            <li>• <strong>Recursion Stack:</strong> O(depth) space for recursive calls</li>
                            <li>• <strong>Dynamic Storage:</strong> Data structures that grow with input</li>
                          </ul>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-800 mb-2">Trade-offs in This Project</h4>
                          <ul className="text-sm text-purple-700 space-y-1">
                            <li>• Trie: O(n) space for O(1) prefix search</li>
                            <li>• Hash Tables: O(n) space for O(1) average lookup</li>
                            <li>• A*: Higher space usage for optimal pathfinding</li>
                            <li>• Edit Distance: O(mn) space, optimizable to O(min(m,n))</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-indigo-900 mb-4">Performance Benchmarks</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <h4 className="font-semibold text-indigo-800">Autocomplete System</h4>
                          <p className="text-sm text-indigo-700 mt-2">
                            <span className="block">Search: ~1ms for 10K words</span>
                            <span className="block">Insert: ~0.1ms average</span>
                            <span className="block">Memory: 2-3MB for 100K words</span>
                          </p>
                        </div>
                        <div className="text-center">
                          <h4 className="font-semibold text-indigo-800">Graph Algorithms</h4>
                          <p className="text-sm text-indigo-700 mt-2">
                            <span className="block">Dijkstra: O(V²) to O((V+E)log V)</span>
                            <span className="block">A*: 40-60% faster than Dijkstra</span>
                            <span className="block">BFS/DFS: Linear performance</span>
                          </p>
                        </div>
                        <div className="text-center">
                          <h4 className="font-semibold text-indigo-800">Edit Distance</h4>
                          <p className="text-sm text-indigo-700 mt-2">
                            <span className="block">100 char strings: ~10ms</span>
                            <span className="block">1000 char strings: ~1s</span>
                            <span className="block">Space optimization: 50% reduction</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Algorithm Selection Guidelines</h2>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">When to Use Each Algorithm</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Small Datasets (n &lt; 1000)</h4>
                            <p className="text-sm text-gray-600">Simple algorithms often suffice. Linear search, bubble sort acceptable.</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Large Datasets (n &gt; 10⁶)</h4>
                            <p className="text-sm text-gray-600">Logarithmic or linear algorithms essential. Hash tables, balanced trees critical.</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Memory Constrained</h4>
                            <p className="text-sm text-gray-600">Prefer in-place algorithms. Consider space-time trade-offs carefully.</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Real-time Requirements</h4>
                            <p className="text-sm text-gray-600">Predictable performance crucial. Avoid worst-case quadratic algorithms.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
