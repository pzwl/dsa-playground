'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Globe, 
  Settings, 
  Play, 
  RotateCcw, 
  Trash2,
  Link,
  Clock,
  ArrowRight,
  Eye,
  Navigation
} from 'lucide-react';

// History node for linked list implementation
interface HistoryNode {
  id: string;
  url: string;
  title: string;
  timestamp: number;
  favicon?: string;
  prev: HistoryNode | null;
  next: HistoryNode | null;
}

// Website content interface
interface WebsiteContent {
  type: string;
  bgColor: string;
  logo: string;
  title?: string;
  subtitle?: string;
  description?: string;
  searchPlaceholder?: string;
}

// Website data interface
interface WebsiteData {
  url: string;
  title: string;
  favicon: string;
  content: WebsiteContent;
}

// Browser state interface
interface BrowserState {
  currentNode: HistoryNode | null;
  canGoBack: boolean;
  canGoForward: boolean;
  totalPages: number;
}

// Navigation step for visualization
interface NavigationStep {
  description: string;
  action: 'navigate' | 'back' | 'forward' | 'clear';
  url?: string;
  title?: string;
  currentPosition: number;
  totalHistory: number;
  historyList: HistoryNode[];
  highlightedNodeId?: string;
}

// Sample website data with realistic content
const SAMPLE_WEBSITES: WebsiteData[] = [
  { 
    url: 'https://google.com', 
    title: 'Google', 
    favicon: '🔍',
    content: {
      type: 'search',
      bgColor: 'bg-white',
      logo: '🔍',
      searchPlaceholder: 'Search Google or type a URL',
      description: 'The world\'s most popular search engine'
    }
  },
  { 
    url: 'https://github.com', 
    title: 'GitHub - Code Repository', 
    favicon: '🐙',
    content: {
      type: 'platform',
      bgColor: 'bg-gray-900',
      logo: '🐙',
      title: 'GitHub',
      subtitle: 'Where the world builds software',
      description: 'Millions of developers use GitHub to build amazing things together.'
    }
  },
  { 
    url: 'https://stackoverflow.com', 
    title: 'Stack Overflow - Programming Q&A', 
    favicon: '📚',
    content: {
      type: 'qa',
      bgColor: 'bg-orange-50',
      logo: '📚',
      title: 'Stack Overflow',
      subtitle: 'Where developers learn, share, & build careers',
      description: 'Find answers to programming questions and help other developers.'
    }
  },
  { 
    url: 'https://youtube.com', 
    title: 'YouTube - Videos', 
    favicon: '📺',
    content: {
      type: 'media',
      bgColor: 'bg-red-50',
      logo: '📺',
      title: 'YouTube',
      subtitle: 'Broadcast Yourself',
      description: 'Enjoy videos and music you love, upload content, and share it all.'
    }
  },
  { 
    url: 'https://wikipedia.org', 
    title: 'Wikipedia - Encyclopedia', 
    favicon: '📖',
    content: {
      type: 'wiki',
      bgColor: 'bg-white',
      logo: '📖',
      title: 'Wikipedia',
      subtitle: 'The Free Encyclopedia',
      description: 'Wikipedia is a multilingual free online encyclopedia written and maintained by volunteers.'
    }
  },
  { 
    url: 'https://reddit.com', 
    title: 'Reddit - Social News', 
    favicon: '🤖',
    content: {
      type: 'social',
      bgColor: 'bg-orange-100',
      logo: '🤖',
      title: 'Reddit',
      subtitle: 'The front page of the internet',
      description: 'Reddit is a network of communities based on people\'s interests.'
    }
  },
  { 
    url: 'https://twitter.com', 
    title: 'Twitter - Social Media', 
    favicon: '🐦',
    content: {
      type: 'social',
      bgColor: 'bg-blue-50',
      logo: '🐦',
      title: 'Twitter',
      subtitle: 'What&apos;s happening?',
      description: 'Join the conversation and see what\'s happening in the world right now.'
    }
  },
  { 
    url: 'https://linkedin.com', 
    title: 'LinkedIn - Professional Network', 
    favicon: '💼',
    content: {
      type: 'professional',
      bgColor: 'bg-blue-100',
      logo: '💼',
      title: 'LinkedIn',
      subtitle: 'Professional Network',
      description: 'Connect with professionals and advance your career.'
    }
  },
  { 
    url: 'https://facebook.com', 
    title: 'Facebook - Social Network', 
    favicon: '👥',
    content: {
      type: 'social',
      bgColor: 'bg-blue-50',
      logo: '👥',
      title: 'Facebook',
      subtitle: 'Connect with friends and family',
      description: 'Share updates and photos, engage with friends and Pages.'
    }
  },
  { 
    url: 'https://amazon.com', 
    title: 'Amazon - Online Shopping', 
    favicon: '🛒',
    content: {
      type: 'ecommerce',
      bgColor: 'bg-yellow-50',
      logo: '🛒',
      title: 'Amazon',
      subtitle: 'Earth&apos;s Most Customer Centric Company',
      description: 'Online shopping for millions of products.'
    }
  },
  { 
    url: 'https://netflix.com', 
    title: 'Netflix - Streaming', 
    favicon: '🎬',
    content: {
      type: 'streaming',
      bgColor: 'bg-red-900',
      logo: '🎬',
      title: 'Netflix',
      subtitle: 'Watch TV shows & movies anytime, anywhere',
      description: 'Watch anywhere. Cancel anytime.'
    }
  },
  { 
    url: 'https://medium.com', 
    title: 'Medium - Publishing', 
    favicon: '✍️',
    content: {
      type: 'publishing',
      bgColor: 'bg-green-50',
      logo: '✍️',
      title: 'Medium',
      subtitle: 'Where good ideas find you',
      description: 'Read and write stories that matter to you.'
    }
  }
];

export default function BrowserHistoryPage() {
  // Browser history state (linked list implementation)
  const [browserState, setBrowserState] = useState<BrowserState>({
    currentNode: null,
    canGoBack: false,
    canGoForward: false,
    totalPages: 0
  });

  // Visualization state
  const [isAnimating, setIsAnimating] = useState(false);
  const [navigationSteps, setNavigationSteps] = useState<NavigationStep[]>([]);
  const [showVisualization, setShowVisualization] = useState(true);
  const [currentAddress, setCurrentAddress] = useState('');

  // Generate unique ID
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);

  // Create new history node
  const createHistoryNode = useCallback((url: string, title: string): HistoryNode => {
    const siteData = SAMPLE_WEBSITES.find(site => site.url === url);
    return {
      id: generateId(),
      url,
      title,
      timestamp: Date.now(),
      favicon: siteData?.favicon || '🌐',
      prev: null,
      next: null
    };
  }, [generateId]);

  // Convert linked list to array for visualization
  const getHistoryList = useCallback((currentNode: HistoryNode | null): HistoryNode[] => {
    if (!currentNode) return [];
    
    const history: HistoryNode[] = [];
    
    // Go to the beginning of the history
    let node = currentNode;
    while (node.prev) {
      node = node.prev;
    }
    
    // Collect all nodes
    while (node) {
      history.push(node);
      if (node.next) {
        node = node.next;
      } else {
        break;
      }
    }
    
    return history;
  }, []);

  // Navigate to a new page
  const navigateToPage = useCallback((url: string, title: string, skipHistory: boolean = false) => {
    const newNode = createHistoryNode(url, title);
    
    setBrowserState(prev => {
      if (prev.currentNode) {
        // Remove any forward history when navigating to a new page
        prev.currentNode.next = null;
        
        // Link the new node
        newNode.prev = prev.currentNode;
        prev.currentNode.next = newNode;
      }
      
      const historyList = getHistoryList(newNode);
      const currentPosition = historyList.findIndex(node => node.id === newNode.id);
      
      if (!skipHistory) {
        const newStep: NavigationStep = {
          description: `Navigate to "${title}"`,
          action: 'navigate',
          url,
          title,
          currentPosition: currentPosition + 1,
          totalHistory: historyList.length,
          historyList,
          highlightedNodeId: newNode.id
        };
        
        setNavigationSteps(prevSteps => [...prevSteps, newStep]);
      }
      
      return {
        currentNode: newNode,
        canGoBack: newNode.prev !== null,
        canGoForward: false, // Always false after new navigation
        totalPages: historyList.length
      };
    });
    
    setCurrentAddress(url);
  }, [createHistoryNode, getHistoryList]);

  // Go back in history
  const goBack = useCallback((skipHistory: boolean = false) => {
    setBrowserState(prev => {
      if (!prev.currentNode?.prev) return prev;
      
      const newCurrentNode = prev.currentNode.prev;
      const historyList = getHistoryList(newCurrentNode);
      const currentPosition = historyList.findIndex(node => node.id === newCurrentNode.id);
      
      if (!skipHistory) {
        const newStep: NavigationStep = {
          description: `Go back to "${newCurrentNode.title}"`,
          action: 'back',
          url: newCurrentNode.url,
          title: newCurrentNode.title,
          currentPosition: currentPosition + 1,
          totalHistory: historyList.length,
          historyList,
          highlightedNodeId: newCurrentNode.id
        };
        
        setNavigationSteps(prevSteps => [...prevSteps, newStep]);
      }
      
      setCurrentAddress(newCurrentNode.url);
      
      return {
        currentNode: newCurrentNode,
        canGoBack: newCurrentNode.prev !== null,
        canGoForward: true,
        totalPages: prev.totalPages
      };
    });
  }, [getHistoryList]);

  // Go forward in history
  const goForward = useCallback((skipHistory: boolean = false) => {
    setBrowserState(prev => {
      if (!prev.currentNode?.next) return prev;
      
      const newCurrentNode = prev.currentNode.next;
      const historyList = getHistoryList(newCurrentNode);
      const currentPosition = historyList.findIndex(node => node.id === newCurrentNode.id);
      
      if (!skipHistory) {
        const newStep: NavigationStep = {
          description: `Go forward to "${newCurrentNode.title}"`,
          action: 'forward',
          url: newCurrentNode.url,
          title: newCurrentNode.title,
          currentPosition: currentPosition + 1,
          totalHistory: historyList.length,
          historyList,
          highlightedNodeId: newCurrentNode.id
        };
        
        setNavigationSteps(prevSteps => [...prevSteps, newStep]);
      }
      
      setCurrentAddress(newCurrentNode.url);
      
      return {
        currentNode: newCurrentNode,
        canGoBack: true,
        canGoForward: newCurrentNode.next !== null,
        totalPages: prev.totalPages
      };
    });
  }, [getHistoryList]);

  // Navigate to home page
  const goHome = useCallback(() => {
    navigateToPage('https://google.com', 'Google - Search');
  }, [navigateToPage]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setBrowserState({
      currentNode: null,
      canGoBack: false,
      canGoForward: false,
      totalPages: 0
    });
    
    setCurrentAddress('');
    
    const newStep: NavigationStep = {
      description: 'Clear all browser history',
      action: 'clear',
      currentPosition: 0,
      totalHistory: 0,
      historyList: []
    };
    
    setNavigationSteps(prev => [...prev, newStep]);
  }, []);

  // Run demo navigation sequence
  const runDemo = useCallback(() => {
    setIsAnimating(true);
    let stepIndex = 0;
    
    const demoSequence = [
      () => navigateToPage(SAMPLE_WEBSITES[0].url, SAMPLE_WEBSITES[0].title, true),
      () => navigateToPage(SAMPLE_WEBSITES[1].url, SAMPLE_WEBSITES[1].title, true),
      () => navigateToPage(SAMPLE_WEBSITES[2].url, SAMPLE_WEBSITES[2].title, true),
      () => navigateToPage(SAMPLE_WEBSITES[3].url, SAMPLE_WEBSITES[3].title, true),
      () => goBack(true),
      () => goBack(true),
      () => goForward(true),
      () => navigateToPage(SAMPLE_WEBSITES[4].url, SAMPLE_WEBSITES[4].title, true)
    ];
    
    const runNextStep = () => {
      if (stepIndex < demoSequence.length) {
        demoSequence[stepIndex]();
        stepIndex++;
        
        setTimeout(runNextStep, 800);
      } else {
        setIsAnimating(false);
      }
    };
    
    runNextStep();
  }, [navigateToPage, goBack, goForward]);

  // Handle address bar input
  const handleAddressSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentAddress.trim()) {
      let url = currentAddress.trim();
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      
      // Find matching website or create generic one
      const matchedSite = SAMPLE_WEBSITES.find(site => 
        url.includes(site.url.replace('https://', ''))
      );
      
      const title = matchedSite?.title || `${url} - Webpage`;
      navigateToPage(url, title);
    }
  }, [currentAddress, navigateToPage]);

  // Reset browser
  const resetBrowser = useCallback(() => {
    setBrowserState({
      currentNode: null,
      canGoBack: false,
      canGoForward: false,
      totalPages: 0
    });
    setCurrentAddress('');
    setNavigationSteps([]);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (browserState.canGoBack) goBack();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (browserState.canGoForward) goForward();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [browserState.canGoBack, browserState.canGoForward, goBack, goForward]);

  // History visualization component
  const HistoryVisualization = () => {
    const historyList = getHistoryList(browserState.currentNode);
    const currentPosition = browserState.currentNode 
      ? historyList.findIndex(node => node.id === browserState.currentNode!.id)
      : -1;

    return (
      <div className="bg-white rounded-lg p-4 border">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Link className="h-4 w-4" />
          History Chain ({historyList.length} pages)
        </h4>
        
        {historyList.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No history yet. Navigate to some pages!
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {historyList.map((node, index) => (
              <div key={node.id} className="flex items-center gap-2">
                <div
                  className={`flex-1 p-2 rounded border-l-4 text-xs transition-all ${
                    index === currentPosition
                      ? 'bg-blue-50 border-blue-400 text-blue-800'
                      : index < currentPosition
                      ? 'bg-gray-50 border-gray-300 text-gray-600'
                      : 'bg-yellow-50 border-yellow-300 text-yellow-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{node.favicon}</span>
                    <div className="flex-1">
                      <div className="font-medium truncate">{node.title}</div>
                      <div className="text-gray-500 truncate">{node.url}</div>
                    </div>
                    {index === currentPosition && (
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </div>
                </div>
                
                {index < historyList.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Realistic browser window component
  const BrowserWindow = () => {
    const currentSite = browserState.currentNode ? 
      SAMPLE_WEBSITES.find(site => site.url === browserState.currentNode!.url) : null;

    const renderWebsiteContent = () => {
      if (!currentSite || !browserState.currentNode) {
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No page loaded</p>
              <p className="text-sm mt-2">Navigate to a website to get started!</p>
            </div>
          </div>
        );
      }

      const { content } = currentSite;

      // Render different website types
      switch (content.type) {
        case 'search':
          return (
            <div className={`${content.bgColor} h-full flex flex-col items-center justify-center p-8`}>
              <div className="text-center max-w-2xl">
                <div className="text-6xl mb-8">{content.logo}</div>
                <h1 className="text-4xl font-light text-gray-800 mb-8">Google</h1>
                <div className="relative mb-8">
                  <input 
                    type="text" 
                    placeholder={content.searchPlaceholder}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-full shadow-lg focus:outline-none focus:border-blue-400"
                    readOnly
                  />
                  <div className="absolute right-3 top-3">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded">🔍</button>
                      <button className="p-2 hover:bg-gray-100 rounded">🎤</button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">Google Search</button>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">I&apos;m Feeling Lucky</button>
                </div>
              </div>
            </div>
          );

        case 'platform':
          return (
            <div className={`${content.bgColor} h-full text-white`}>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl">{content.logo}</span>
                  <h1 className="text-3xl font-bold">{content.title}</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">📁 Repositories</h3>
                    <p className="text-gray-300">Browse and manage your code repositories</p>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">🌟 Stars</h3>
                    <p className="text-gray-300">Bookmark repositories you find interesting</p>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">👥 Teams</h3>
                    <p className="text-gray-300">Collaborate with your team members</p>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'media':
          return (
            <div className={`${content.bgColor} h-full`}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{content.logo}</span>
                    <h1 className="text-3xl font-bold text-red-600">{content.title}</h1>
                  </div>
                  <button className="bg-red-600 text-white px-6 py-2 rounded">Subscribe</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden shadow">
                      <div className="bg-gray-200 h-32 flex items-center justify-center">
                        <span className="text-2xl">📺</span>
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-sm">Video Title {i}</h4>
                        <p className="text-xs text-gray-600 mt-1">Channel Name</p>
                        <p className="text-xs text-gray-500 mt-1">1.2M views • 2 days ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'social':
          return (
            <div className={`${content.bgColor} h-full`}>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl">{content.logo}</span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{content.title}</h1>
                    <p className="text-gray-600">{content.subtitle}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      👤
                    </div>
                    <input 
                      placeholder="What&apos;s on your mind?" 
                      className="flex-1 bg-gray-100 rounded-full px-4 py-2"
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div>
                          <p className="font-semibold">User Name {i}</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <p className="text-gray-800 mb-4">This is a sample post content showing how social media platforms display user-generated content and interactions.</p>
                      <div className="flex gap-6 text-gray-500 text-sm">
                        <button className="hover:text-blue-600">👍 Like</button>
                        <button className="hover:text-blue-600">💬 Comment</button>
                        <button className="hover:text-blue-600">📤 Share</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'ecommerce':
          return (
            <div className={`${content.bgColor} h-full`}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{content.logo}</span>
                    <h1 className="text-3xl font-bold">{content.title}</h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      placeholder="Search products..." 
                      className="px-4 py-2 border rounded-lg w-64"
                      readOnly
                    />
                    <button className="bg-orange-400 text-white px-6 py-2 rounded">🛒 Cart</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-4">
                      <div className="bg-gray-200 h-32 rounded mb-3 flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                      <h4 className="font-semibold text-sm mb-2">Product {i}</h4>
                      <p className="text-lg font-bold text-green-600">${(Math.random() * 100 + 10).toFixed(2)}</p>
                      <div className="flex text-xs text-yellow-500 mt-1">
                        ⭐⭐⭐⭐⭐
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        default:
          return (
            <div className={`${content.bgColor || 'bg-white'} h-full flex items-center justify-center`}>
              <div className="text-center">
                <div className="text-6xl mb-4">{content.logo}</div>
                <h2 className="text-3xl font-bold mb-2">{content.title}</h2>
                <p className="text-gray-600 mb-4">{content.subtitle}</p>
                <p className="text-gray-500 max-w-md">{content.description}</p>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* Browser Chrome */}
        <div className="bg-gray-100 border-b border-gray-300 p-3">
          {/* Tab Bar */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`px-4 py-2 rounded-t bg-white border-l border-r border-t ${browserState.currentNode ? 'border-gray-300' : 'border-gray-200'} flex items-center gap-2 min-w-0 max-w-xs`}>
              <span className="text-sm">{browserState.currentNode?.favicon || '🌐'}</span>
              <span className="text-sm truncate">{browserState.currentNode?.title || 'New Tab'}</span>
              {browserState.currentNode && (
                <button className="text-gray-400 hover:text-gray-600 ml-2">×</button>
              )}
            </div>
            <button className="text-gray-600 hover:text-gray-800 text-lg">+</button>
          </div>
          
          {/* Address Bar */}
          <form onSubmit={handleAddressSubmit} className="flex items-center gap-2">
            <div className="flex gap-1">
              <Button
                onClick={() => goBack()}
                disabled={!browserState.canGoBack || isAnimating}
                variant="ghost"
                size="sm"
                className="p-2 h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => goForward()}
                disabled={!browserState.canGoForward || isAnimating}
                variant="ghost"
                size="sm"
                className="p-2 h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="ghost"
                size="sm"
                className="p-2 h-8 w-8"
              >
                ↻
              </Button>
            </div>
            
            <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-full px-4 py-2">
              <span className="text-green-600 mr-2">🔒</span>
              <input
                type="text"
                value={currentAddress || browserState.currentNode?.url || ''}
                onChange={(e) => setCurrentAddress(e.target.value)}
                placeholder="Search Google or type a URL"
                className="flex-1 outline-none text-sm"
              />
            </div>
            
            <div className="flex gap-1">
              <Button
                onClick={goHome}
                variant="ghost"
                size="sm"
                className="p-2 h-8 w-8"
              >
                <Home className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 w-8"
              >
                ⋮
              </Button>
            </div>
          </form>
        </div>
        
        {/* Website Content */}
        <div className="h-96 overflow-auto">
          {renderWebsiteContent()}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Navigation className="h-8 w-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">Browser History Navigation</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Understand how web browsers implement back/forward functionality using linked lists and stack operations.
            Experience the same navigation system used in Chrome, Firefox, and Safari.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            {/* Browser Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Browser Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Address Bar */}
                <form onSubmit={handleAddressSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                    placeholder="Enter URL (e.g., google.com)"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <Button type="submit" size="sm">
                    Go
                  </Button>
                </form>
                
                {/* Navigation Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => goBack()}
                    disabled={!browserState.canGoBack || isAnimating}
                    variant="outline"
                    className="flex items-center gap-2 text-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                  
                  <Button
                    onClick={() => goForward()}
                    disabled={!browserState.canGoForward || isAnimating}
                    variant="outline"
                    className="flex items-center gap-2 text-sm"
                  >
                    <ChevronRight className="h-4 w-4" />
                    Forward
                  </Button>
                  
                  <Button
                    onClick={goHome}
                    disabled={isAnimating}
                    variant="outline"
                    className="flex items-center gap-2 text-sm"
                  >
                    <Home className="h-4 w-4" />
                    Home
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
                      Run Demo Navigation
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
                        onClick={resetBrowser}
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

            {/* Quick Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_WEBSITES.slice(0, 8).map((site) => (
                    <Button
                      key={site.url}
                      onClick={() => navigateToPage(site.url, site.title)}
                      disabled={isAnimating}
                      variant="outline"
                      className="flex items-center gap-2 text-xs p-2 h-auto"
                    >
                      <span className="text-base">{site.favicon}</span>
                      <span className="truncate">{site.title.split(' - ')[0]}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings & Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <strong>Keyboard Shortcuts:</strong><br/>
                  Alt + ← (Back) | Alt + → (Forward)
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Current Page:</span>
                    <span className="font-medium">
                      {browserState.currentNode?.title || 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total History:</span>
                    <span className="font-medium">{browserState.totalPages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Can Go Back:</span>
                    <span className={`font-medium ${browserState.canGoBack ? 'text-green-600' : 'text-red-600'}`}>
                      {browserState.canGoBack ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Can Go Forward:</span>
                    <span className={`font-medium ${browserState.canGoForward ? 'text-green-600' : 'text-red-600'}`}>
                      {browserState.canGoForward ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Browser Window */}
          <div className="xl:col-span-2 space-y-6">
            {/* Browser Window */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Browser Window
                  {browserState.currentNode && (
                    <span className="text-sm font-normal text-gray-600">
                      - {browserState.currentNode.title}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <BrowserWindow />
                
                {/* Navigation Status */}
                <div className="p-4 flex items-center justify-between text-sm text-gray-600 border-t">
                  <div className="flex items-center gap-4">
                    <span className={browserState.canGoBack ? 'text-green-600' : 'text-gray-400'}>
                      ← Back {browserState.canGoBack ? 'Available' : 'Disabled'}
                    </span>
                    <span className={browserState.canGoForward ? 'text-green-600' : 'text-gray-400'}>
                      Forward Available → {browserState.canGoForward ? 'Available' : 'Disabled'}
                    </span>
                  </div>
                  <span>
                    History: {browserState.totalPages} pages
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* History Visualization */}
            {showVisualization && <HistoryVisualization />}

            {/* Navigation History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Navigation History
                  <Button
                    onClick={() => setNavigationSteps([])}
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                  >
                    Clear Log
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {navigationSteps.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                      No navigation history yet. Start browsing to see the history!
                    </div>
                  ) : (
                    navigationSteps.map((step, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 transition-all ${
                          step.action === 'navigate' ? 'bg-blue-50 border-blue-400' :
                          step.action === 'back' ? 'bg-orange-50 border-orange-400' :
                          step.action === 'forward' ? 'bg-green-50 border-green-400' :
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
                          <span>Position: {step.currentPosition}/{step.totalHistory}</span>
                          {step.url && (
                            <span className="bg-gray-100 px-2 py-1 rounded truncate max-w-48">
                              {step.url}
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
                <div className="font-semibold text-orange-600 mb-2">🎯 Learning Objectives</div>
                <ul className="text-gray-600 space-y-1">
                  <li>• Doubly Linked Lists</li>
                  <li>• Browser history management</li>
                  <li>• Stack operations (back/forward)</li>
                  <li>• Navigation state tracking</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-green-600 mb-2">🔧 Real-World Applications</div>
                <ul className="text-gray-600 space-y-1">
                  <li>• Web browsers (Chrome, Firefox)</li>
                  <li>• Mobile app navigation</li>
                  <li>• File manager history</li>
                  <li>• IDE navigation history</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-purple-600 mb-2">⚡ Key Concepts</div>
                <ul className="text-gray-600 space-y-1">
                  <li>• Doubly linked list traversal</li>
                  <li>• History truncation on new navigation</li>
                  <li>• Bidirectional navigation</li>
                  <li>• State management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
