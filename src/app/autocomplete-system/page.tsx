'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Search, Zap, TrendingUp, Database, Hash, TreePine, Target, Filter, Settings, Plus, BookOpen, List, Trash2, Eye } from 'lucide-react';

// Metadata type
type MetadataType = {
  category: string;
  lastAccessed: number;
  description?: string;
};

// Advanced Trie Node with compression and metadata
interface TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  frequency: number;
  word?: string;
  metadata?: MetadataType;
}

// Hash Table with collision handling
class HashTable {
  private buckets: Array<Array<{key: string, value: unknown, frequency: number}>>;
  private size: number;
  private count: number;
  private loadFactor: number;

  constructor(initialSize: number = 16) {
    this.size = initialSize;
    this.buckets = new Array(this.size).fill(null).map(() => []);
    this.count = 0;
    this.loadFactor = 0;
  }

  private hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.size;
    }
    return Math.abs(hash);
  }

  insert(key: string, value: unknown, frequency: number = 1): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    const existingIndex = bucket.findIndex(item => item.key === key);
    if (existingIndex !== -1) {
      bucket[existingIndex].frequency += frequency;
      bucket[existingIndex].value = value;
    } else {
      bucket.push({ key, value, frequency });
      this.count++;
      this.loadFactor = this.count / this.size;
      
      if (this.loadFactor > 0.75) {
        this.resize();
      }
    }
  }

  search(key: string): {value: unknown, frequency: number} | null {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const item = bucket.find(item => item.key === key);
    return item ? { value: item.value, frequency: item.frequency } : null;
  }

  private resize(): void {
    const oldBuckets = this.buckets;
    this.size *= 2;
    this.buckets = new Array(this.size).fill(null).map(() => []);
    this.count = 0;
    
    for (const bucket of oldBuckets) {
      for (const item of bucket) {
        this.insert(item.key, item.value, item.frequency);
      }
    }
  }

  getStats() {
    return {
      size: this.size,
      count: this.count,
      loadFactor: this.loadFactor,
      collisions: this.buckets.filter(bucket => bucket.length > 1).length
    };
  }
}

// Enhanced Trie with compression and ranking
class EnhancedTrie {
  root: TrieNode;
  private totalWords: number;
  private maxDepth: number;

  constructor() {
    this.root = {
      children: new Map(),
      isEndOfWord: false,
      frequency: 0
    };
    this.totalWords = 0;
    this.maxDepth = 0;
  }

  insert(word: string, frequency: number = 1, metadata?: MetadataType): void {
    let node = this.root;
    let depth = 0;
    
    for (const char of word.toLowerCase()) {
      depth++;
      if (!node.children.has(char)) {
        node.children.set(char, {
          children: new Map(),
          isEndOfWord: false,
          frequency: 0
        });
      }
      node = node.children.get(char)!;
    }
    
    if (!node.isEndOfWord) {
      this.totalWords++;
    }
    
    node.isEndOfWord = true;
    node.frequency += frequency;
    node.word = word.toLowerCase();
    node.metadata = {
      category: metadata?.category || 'general',
      lastAccessed: Date.now(),
      description: metadata?.description
    };
    
    this.maxDepth = Math.max(this.maxDepth, depth);
  }

  // Exact prefix search
  searchExact(prefix: string): Array<{ word: string; frequency: number; metadata?: MetadataType }> {
    let node = this.root;
    
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char)!;
    }

    const results: Array<{ word: string; frequency: number; metadata?: MetadataType }> = [];
    this.dfsCollect(node, results);
    
    return results
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  }

  // Fuzzy search using Levenshtein distance
  searchFuzzy(query: string, maxDistance: number = 2): Array<{ word: string; frequency: number; distance: number; metadata?: MetadataType }> {
    const results: Array<{ word: string; frequency: number; distance: number; metadata?: MetadataType }> = [];
    const allWords: Array<{ word: string; frequency: number; metadata?: MetadataType }> = [];
    
    this.dfsCollect(this.root, allWords);
    
    for (const item of allWords) {
      const distance = this.levenshteinDistance(query.toLowerCase(), item.word);
      if (distance <= maxDistance) {
        results.push({ ...item, distance });
      }
    }
    
    return results
      .sort((a, b) => a.distance - b.distance || b.frequency - a.frequency)
      .slice(0, 8);
  }

  private levenshteinDistance(s1: string, s2: string): number {
    const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));

    for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= s2.length; j++) {
      for (let i = 1; i <= s1.length; i++) {
        const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator,
        );
      }
    }

    return matrix[s2.length][s1.length];
  }

  private dfsCollect(node: TrieNode, results: Array<{ word: string; frequency: number; metadata?: MetadataType }>) {
    if (node.isEndOfWord && node.word) {
      results.push({ 
        word: node.word, 
        frequency: node.frequency,
        metadata: node.metadata
      });
    }

    for (const child of node.children.values()) {
      this.dfsCollect(child, results);
    }
  }

  // Public method to get all words
  getAllWords() {
    const results: Array<{ word: string; frequency: number; metadata?: MetadataType }> = [];
    this.dfsCollect(this.root, results);
    return results;
  }

  getStats() {
    return {
      totalWords: this.totalWords,
      maxDepth: this.maxDepth,
      nodeCount: this.countNodes(this.root)
    };
  }

  private countNodes(node: TrieNode): number {
    let count = 1;
    for (const child of node.children.values()) {
      count += this.countNodes(child);
    }
    return count;
  }
}

// Database Management System
class DatabaseManager {
  private databases: Map<string, { trie: EnhancedTrie; hashTable: HashTable; metadata: { name: string; description: string; created: number; lastModified: number } }>;
  private activeDatabase: string;

  constructor() {
    this.databases = new Map();
    this.activeDatabase = '';
    this.initializeDefaultDatabases();
  }

  private initializeDefaultDatabases() {
    // Custom Words Database - 100 test words
    this.createDatabase('custom-words', 'Custom Test Words');
    const customWords = [
      { word: 'adventure', frequency: 850, category: 'noun', description: 'An exciting or unusual experience' },
      { word: 'beautiful', frequency: 920, category: 'adjective', description: 'Pleasing to the senses or mind' },
      { word: 'challenge', frequency: 780, category: 'noun', description: 'A difficult task or situation' },
      { word: 'discovery', frequency: 650, category: 'noun', description: 'The action of finding something new' },
      { word: 'elephant', frequency: 590, category: 'animal', description: 'Large mammal with a trunk' },
      { word: 'friendship', frequency: 720, category: 'noun', description: 'The state of being friends' },
      { word: 'garden', frequency: 680, category: 'place', description: 'An area for growing plants' },
      { word: 'happiness', frequency: 890, category: 'emotion', description: 'The feeling of joy and contentment' },
      { word: 'imagination', frequency: 760, category: 'noun', description: 'The ability to form mental images' },
      { word: 'journey', frequency: 810, category: 'noun', description: 'An act of traveling from one place to another' },
      { word: 'knowledge', frequency: 870, category: 'noun', description: 'Information and understanding' },
      { word: 'laughter', frequency: 640, category: 'emotion', description: 'The action of laughing' },
      { word: 'mountain', frequency: 580, category: 'nature', description: 'A large elevated landform' },
      { word: 'opportunity', frequency: 750, category: 'noun', description: 'A favorable circumstance' },
      { word: 'patience', frequency: 690, category: 'virtue', description: 'The ability to wait calmly' },
      { word: 'rainbow', frequency: 520, category: 'nature', description: 'An arc of colors in the sky' },
      { word: 'success', frequency: 940, category: 'noun', description: 'The accomplishment of an aim' },
      { word: 'treasure', frequency: 570, category: 'noun', description: 'Something of great value' },
      { word: 'universe', frequency: 660, category: 'science', description: 'All existing matter and space' },
      { word: 'victory', frequency: 710, category: 'noun', description: 'An act of defeating an opponent' },
      { word: 'wisdom', frequency: 800, category: 'virtue', description: 'The quality of having experience and judgment' },
      { word: 'excellence', frequency: 730, category: 'quality', description: 'The quality of being outstanding' },
      { word: 'youthful', frequency: 480, category: 'adjective', description: 'Having the qualities of youth' },
      { word: 'zenith', frequency: 390, category: 'noun', description: 'The highest point reached' },
      { word: 'amazing', frequency: 860, category: 'adjective', description: 'Causing wonder or surprise' },
      { word: 'brilliant', frequency: 770, category: 'adjective', description: 'Exceptionally clever or talented' },
      { word: 'creative', frequency: 820, category: 'adjective', description: 'Having the ability to create' },
      { word: 'delicious', frequency: 690, category: 'taste', description: 'Having a pleasant taste' },
      { word: 'energetic', frequency: 610, category: 'adjective', description: 'Full of energy' },
      { word: 'fantastic', frequency: 750, category: 'adjective', description: 'Extraordinarily good' },
      { word: 'gorgeous', frequency: 680, category: 'adjective', description: 'Very beautiful' },
      { word: 'hilarious', frequency: 540, category: 'adjective', description: 'Extremely funny' },
      { word: 'incredible', frequency: 830, category: 'adjective', description: 'Impossible to believe' },
      { word: 'joyful', frequency: 620, category: 'emotion', description: 'Feeling happiness' },
      { word: 'kindness', frequency: 790, category: 'virtue', description: 'The quality of being kind' },
      { word: 'magnificent', frequency: 670, category: 'adjective', description: 'Extremely beautiful' },
      { word: 'optimistic', frequency: 710, category: 'attitude', description: 'Hopeful about the future' },
      { word: 'peaceful', frequency: 650, category: 'adjective', description: 'Free from disturbance' },
      { word: 'quality', frequency: 880, category: 'noun', description: 'The standard of something' },
      { word: 'remarkable', frequency: 720, category: 'adjective', description: 'Worthy of attention' },
      { word: 'spectacular', frequency: 640, category: 'adjective', description: 'Beautiful in a dramatic way' },
      { word: 'tremendous', frequency: 590, category: 'adjective', description: 'Very great in amount' },
      { word: 'unique', frequency: 850, category: 'adjective', description: 'Being the only one of its kind' },
      { word: 'vibrant', frequency: 700, category: 'adjective', description: 'Full of energy and life' },
      { word: 'wonderful', frequency: 910, category: 'adjective', description: 'Inspiring delight' },
      { word: 'excellent', frequency: 780, category: 'adjective', description: 'Extremely good' },
      { word: 'charming', frequency: 560, category: 'adjective', description: 'Pleasant and attractive' },
      { word: 'delightful', frequency: 630, category: 'adjective', description: 'Causing delight' },
      { word: 'inspiring', frequency: 740, category: 'adjective', description: 'Having the effect of inspiring' },
      { word: 'marvelous', frequency: 580, category: 'adjective', description: 'Causing wonder' },
      { word: 'pleasant', frequency: 670, category: 'adjective', description: 'Giving a sense of happy satisfaction' },
      { word: 'refreshing', frequency: 520, category: 'adjective', description: 'Serving to refresh' },
      { word: 'satisfying', frequency: 660, category: 'adjective', description: 'Giving satisfaction' },
      { word: 'thrilling', frequency: 610, category: 'adjective', description: 'Causing excitement' },
      { word: 'uplifting', frequency: 550, category: 'adjective', description: 'Morally or spiritually elevating' },
      { word: 'vivid', frequency: 640, category: 'adjective', description: 'Producing powerful feelings' },
      { word: 'welcoming', frequency: 580, category: 'adjective', description: 'Behaving in a friendly way' },
      { word: 'zealous', frequency: 420, category: 'adjective', description: 'Having great energy for something' },
      { word: 'affection', frequency: 690, category: 'emotion', description: 'A gentle feeling of fondness' },
      { word: 'blissful', frequency: 480, category: 'emotion', description: 'Extremely happy' },
      { word: 'compassion', frequency: 720, category: 'virtue', description: 'Sympathetic concern for others' },
      { word: 'devotion', frequency: 610, category: 'emotion', description: 'Love and loyalty' },
      { word: 'empathy', frequency: 750, category: 'virtue', description: 'Understanding others feelings' },
      { word: 'gratitude', frequency: 820, category: 'virtue', description: 'The quality of being thankful' },
      { word: 'harmony', frequency: 680, category: 'noun', description: 'Agreement and peaceful coexistence' },
      { word: 'integrity', frequency: 790, category: 'virtue', description: 'The quality of being honest' },
      { word: 'jubilant', frequency: 440, category: 'emotion', description: 'Feeling triumphantly happy' },
      { word: 'loyalty', frequency: 760, category: 'virtue', description: 'Faithfulness to commitments' },
      { word: 'nurturing', frequency: 620, category: 'quality', description: 'Caring for and encouraging growth' },
      { word: 'perseverance', frequency: 670, category: 'virtue', description: 'Persistence in doing something' },
      { word: 'respect', frequency: 890, category: 'virtue', description: 'Admiration for someone' },
      { word: 'sincerity', frequency: 580, category: 'virtue', description: 'The quality of being genuine' },
      { word: 'tolerance', frequency: 710, category: 'virtue', description: 'Willingness to accept differences' },
      { word: 'understanding', frequency: 830, category: 'virtue', description: 'Sympathetic awareness' },
      { word: 'generosity', frequency: 740, category: 'virtue', description: 'The quality of being generous' },
      { word: 'honesty', frequency: 850, category: 'virtue', description: 'The quality of being truthful' },
      { word: 'humility', frequency: 640, category: 'virtue', description: 'A modest view of ones importance' },
      { word: 'courage', frequency: 870, category: 'virtue', description: 'The ability to face difficulty' },
      { word: 'determination', frequency: 780, category: 'quality', description: 'Firmness of purpose' },
      { word: 'enthusiasm', frequency: 720, category: 'emotion', description: 'Intense enjoyment' },
      { word: 'fascination', frequency: 590, category: 'emotion', description: 'The power to attract interest' },
      { word: 'gratification', frequency: 520, category: 'emotion', description: 'Pleasure from satisfaction' },
      { word: 'inspiration', frequency: 860, category: 'noun', description: 'The process of being mentally stimulated' },
      { word: 'meditation', frequency: 650, category: 'practice', description: 'The practice of focused thinking' },
      { word: 'reflection', frequency: 700, category: 'activity', description: 'Serious thought or consideration' },
      { word: 'serenity', frequency: 580, category: 'emotion', description: 'The state of being calm' },
      { word: 'tranquility', frequency: 560, category: 'state', description: 'The quality of being tranquil' },
      { word: 'admiration', frequency: 660, category: 'emotion', description: 'Respect and warm approval' },
      { word: 'appreciation', frequency: 750, category: 'emotion', description: 'Recognition of the worth of something' },
      { word: 'celebration', frequency: 680, category: 'activity', description: 'The action of celebrating' },
      { word: 'dedication', frequency: 720, category: 'quality', description: 'The quality of being committed' },
      { word: 'fulfillment', frequency: 640, category: 'emotion', description: 'Satisfaction from achievement' },
      { word: 'accomplishment', frequency: 700, category: 'noun', description: 'Something achieved successfully' },
      { word: 'aspiration', frequency: 620, category: 'noun', description: 'A hope or ambition' },
      { word: 'breakthrough', frequency: 580, category: 'noun', description: 'A sudden important development' },
      { word: 'contribution', frequency: 760, category: 'noun', description: 'The part played in bringing about a result' },
      { word: 'development', frequency: 840, category: 'noun', description: 'The process of growth' },
      { word: 'evolution', frequency: 690, category: 'science', description: 'Gradual development' },
      { word: 'exploration', frequency: 650, category: 'activity', description: 'The action of exploring' },
      { word: 'innovation', frequency: 780, category: 'noun', description: 'The introduction of new ideas' },
      { word: 'progress', frequency: 820, category: 'noun', description: 'Forward movement toward a destination' },
      { word: 'transformation', frequency: 710, category: 'noun', description: 'A complete change' },
      { word: 'achievement', frequency: 800, category: 'noun', description: 'A thing done successfully' },
      { word: 'milestone', frequency: 570, category: 'noun', description: 'A significant stage in development' },
      { word: 'pinnacle', frequency: 450, category: 'noun', description: 'The highest point of development' },
      { word: 'triumph', frequency: 620, category: 'noun', description: 'A great victory or achievement' }
    ];

    customWords.forEach(item => this.insertData('custom-words', item.word, item));

    this.setActiveDatabase('custom-words');
  }

  createDatabase(name: string, description: string) {
    this.databases.set(name, {
      trie: new EnhancedTrie(),
      hashTable: new HashTable(),
      metadata: { 
        name, 
        description, 
        created: Date.now(),
        lastModified: Date.now()
      }
    });
  }

  setActiveDatabase(name: string) {
    if (this.databases.has(name)) {
      this.activeDatabase = name;
      return true;
    }
    return false;
  }

  insertData(dbName: string, key: string, data: { frequency: number; category: string; description: string }) {
    const db = this.databases.get(dbName);
    if (!db) return false;

    const metadata: MetadataType = {
      category: data.category,
      description: data.description,
      lastAccessed: Date.now()
    };

    db.trie.insert(key, data.frequency, metadata);
    db.hashTable.insert(key, data, data.frequency);
    db.metadata.lastModified = Date.now();
    return true;
  }

  getActiveDatabase() {
    return this.databases.get(this.activeDatabase);
  }

  getAllDatabases() {
    return Array.from(this.databases.entries()).map(([dbName, db]) => ({
      name: dbName,
      description: db.metadata.description,
      created: db.metadata.created,
      lastModified: db.metadata.lastModified,
      stats: {
        ...db.trie.getStats(),
        ...db.hashTable.getStats()
      }
    }));
  }

  deleteDatabase(dbName: string): boolean {
    if (dbName === 'custom-words') {
      return false; // Cannot delete default database
    }
    
    const deleted = this.databases.delete(dbName);
    
    // If we deleted the active database, switch to custom-words
    if (deleted && this.activeDatabase === dbName) {
      this.setActiveDatabase('custom-words');
    }
    
    return deleted;
  }

  getAllWordsFromDatabase(dbName: string): Array<{ word: string; frequency: number; metadata?: MetadataType }> {
    const db = this.databases.get(dbName);
    if (!db) return [];
    
    const words: Array<{ word: string; frequency: number; metadata?: MetadataType }> = [];
    
    // Get all words from the trie
    const collectWords = (node: TrieNode, prefix: string) => {
      if (node.isEndOfWord && node.frequency > 0) {
        words.push({
          word: prefix,
          frequency: node.frequency,
          metadata: node.metadata
        });
      }
      
      // Iterate over Map entries
      for (const [char, childNode] of node.children.entries()) {
        collectWords(childNode, prefix + char);
      }
    };
    
    collectWords(db.trie.root, '');
    
    // Sort by frequency (descending) and then alphabetically
    words.sort((a, b) => {
      if (a.frequency !== b.frequency) {
        return b.frequency - a.frequency;
      }
      return a.word.localeCompare(b.word);
    });
    
    return words;
  }
}

type SearchMode = 'exact' | 'fuzzy';

export default function SmartAutocompleteSystem() {
  const [dbManager] = useState(() => new DatabaseManager());
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('exact');
  const [suggestions, setSuggestions] = useState<Array<{
    word: string;
    frequency: number;
    metadata?: MetadataType;
    distance?: number;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStats, setSearchStats] = useState({
    searchTime: 0,
    operationCount: 0,
    resultsFound: 0
  });
  const [activeDb, setActiveDb] = useState('custom-words');
  
  // New states for database management
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFrequency, setNewFrequency] = useState(100);
  const [bulkWords, setBulkWords] = useState('');
  const [entryMode, setEntryMode] = useState<'single' | 'bulk'>('single');
  const [showCreateDb, setShowCreateDb] = useState(false);
  const [newDbName, setNewDbName] = useState('');
  const [newDbDescription, setNewDbDescription] = useState('');
  const [showAllWords, setShowAllWords] = useState(false);
  const [allWords, setAllWords] = useState<Array<{ word: string; frequency: number; metadata?: MetadataType }>>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Enhanced search function with better fuzzy search
  const performSearch = useCallback(async (searchQuery: string, mode: SearchMode) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setSearchStats({ searchTime: 0, operationCount: 0, resultsFound: 0 });
      return;
    }

    setIsSearching(true);
    const startTime = performance.now();
    
    const db = dbManager.getActiveDatabase();
    if (!db) return;

    let results;
    if (mode === 'exact') {
      results = db.trie.searchExact(searchQuery);
    } else {
      // Enhanced fuzzy search with better distance threshold
      const maxDistance = Math.min(2, Math.ceil(searchQuery.length * 0.3));
      results = db.trie.searchFuzzy(searchQuery, maxDistance);
    }

    const endTime = performance.now();
    
    setSuggestions(results);
    setSearchStats({
      searchTime: endTime - startTime,
      operationCount: results.length * searchQuery.length,
      resultsFound: results.length
    });
    setIsSearching(false);
  }, [dbManager]);

  // Add single word
  const addSingleWord = () => {
    if (!newWord.trim()) return;
    
    const success = dbManager.insertData(activeDb, newWord.toLowerCase(), {
      frequency: newFrequency,
      category: newCategory || 'custom',
      description: newDescription || `Custom entry: ${newWord}`
    });

    if (success) {
      setNewWord('');
      setNewCategory('');
      setNewDescription('');
      setNewFrequency(100);
      setShowAddEntry(false);
      // Trigger refresh to update UI
      setRefreshTrigger(prev => prev + 1);
      // Refresh search if there's a query
      if (query) {
        performSearch(query, searchMode);
      }
    }
  };

  // Add bulk words - properly parse CSV format
  const addBulkWords = () => {
    if (!bulkWords.trim()) return;
    
    const lines = bulkWords.split('\n').filter(line => line.trim());
    lines.forEach(line => {
      const parts = line.trim().split(',').map(part => part.trim());
      const word = parts[0]?.toLowerCase();
      
      if (word) {
        const category = parts[1] || 'bulk-import';
        const frequency = parseInt(parts[2]) || 50;
        const description = parts[3] || `Bulk imported: ${word}`;
        
        dbManager.insertData(activeDb, word, {
          frequency,
          category,
          description
        });
      }
    });

    setBulkWords('');
    setShowAddEntry(false);
    // Force re-render to update word counts
    setRefreshTrigger(prev => prev + 1);
    // Refresh search if there's a query
    if (query) {
      performSearch(query, searchMode);
    }
  };

  const getAllWordsFromDatabase = (): Array<{ word: string; frequency: number; metadata?: MetadataType }> => {
    return dbManager.getAllWordsFromDatabase(activeDb);
  };

  const handleViewAllWords = () => {
    const words = getAllWordsFromDatabase();
    setAllWords(words);
    setShowAllWords(true);
  };

  const handleDeleteDatabase = (dbName: string) => {
    if (dbName === 'custom-words') {
      alert('Cannot delete the default database');
      return;
    }
    
    if (confirm(`Are you sure you want to delete the "${dbName}" database? This action cannot be undone.`)) {
      const deleted = dbManager.deleteDatabase(dbName);
      
      if (deleted) {
        // Switch to custom-words database if we deleted the active one
        if (activeDb === dbName) {
          setActiveDb('custom-words');
        }
        alert(`Database "${dbName}" has been deleted`);
      } else {
        alert('Failed to delete database');
      }
    }
  };

  // Create new database
  const createNewDatabase = () => {
    if (!newDbName.trim() || !newDbDescription.trim()) return;
    
    dbManager.createDatabase(newDbName.toLowerCase(), newDbDescription);
    setNewDbName('');
    setNewDbDescription('');
    setShowCreateDb(false);
  };

  // Clear all entries from current database
  const clearDatabase = () => {
    if (confirm(`Are you sure you want to clear all entries from ${activeDb} database?`)) {
      // Create a new empty database with the same name and description
      const currentDb = dbManager.getActiveDatabase();
      if (currentDb) {
        dbManager.createDatabase(activeDb, currentDb.metadata.description);
        setSuggestions([]);
        setQuery('');
      }
    }
  };

  // Get all words from current database
  const getAllWords = () => {
    const db = dbManager.getActiveDatabase();
    if (!db) return [];
    
    const results = db.trie.getAllWords();
    return results.sort((a, b) => b.frequency - a.frequency);
  };

  // Debounce search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query, searchMode);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query, searchMode, performSearch]);

  const handleDatabaseSwitch = (dbName: string) => {
    dbManager.setActiveDatabase(dbName);
    setActiveDb(dbName);
    performSearch(query, searchMode);
  };

  // Get all databases for display - include refreshTrigger to force re-render
  const databases = dbManager.getAllDatabases();
  // Use refreshTrigger to ensure databases update
  React.useEffect(() => {
    // This effect runs when refreshTrigger changes, causing re-render
  }, [refreshTrigger]);
  const currentDb = dbManager.getActiveDatabase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Search Engine System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience how modern search engines combine multiple data structures: 
            Trie trees for prefix matching, Hash tables for exact lookups, and fuzzy algorithms for error correction.
          </p>
        </div>

        {/* Database Selection */}
        <Card className="mb-6 p-4">
          <div className="flex items-center gap-4 mb-4">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Database Management</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {databases.map((db) => (
              <button
                key={db.name}
                onClick={() => handleDatabaseSwitch(db.name)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  activeDb === db.name
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">{db.description}</div>
                  <div className="text-xs opacity-75">
                    {db.stats.totalWords} entries • Load: {(db.stats.loadFactor * 100).toFixed(1)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Database Management Actions */}
        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Database Operations</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateDb(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Database
              </button>
              <button
                onClick={() => setShowAddEntry(!showAddEntry)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Add Words
              </button>
              <button
                onClick={handleViewAllWords}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View All
              </button>
              <button
                onClick={() => handleDeleteDatabase(activeDb)}
                disabled={activeDb === 'custom-words'}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete DB
              </button>
            </div>
          </div>

          {/* Add Entry Interface */}
          {showAddEntry && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setEntryMode('single')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      entryMode === 'single'
                        ? 'bg-white shadow-sm text-green-600'
                        : 'text-gray-600'
                    }`}
                  >
                    Single Word
                  </button>
                  <button
                    onClick={() => setEntryMode('bulk')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      entryMode === 'bulk'
                        ? 'bg-white shadow-sm text-green-600'
                        : 'text-gray-600'
                    }`}
                  >
                    Bulk Import
                  </button>
                </div>
              </div>

              {entryMode === 'single' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Word</label>
                      <input
                        type="text"
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value)}
                        placeholder="e.g., Python"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g., Language"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                      <input
                        type="number"
                        value={newFrequency}
                        onChange={(e) => setNewFrequency(parseInt(e.target.value) || 1)}
                        min="1"
                        placeholder="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="e.g., A high-level programming language"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <button
                    onClick={addSingleWord}
                    disabled={!newWord.trim()}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Word
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bulk Import (one word per line, format: word,category,frequency,description)
                    </label>
                    <textarea
                      value={bulkWords}
                      onChange={(e) => setBulkWords(e.target.value)}
                      rows={6}
                      placeholder="Python,Language,95000,A high-level programming language&#10;React,Framework,87000,JavaScript library for building user interfaces&#10;Node.js,Runtime,76000,JavaScript runtime built on Chrome's V8 engine"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="mb-1">Format examples:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><code>Python,Language,95000,A high-level programming language</code></li>
                      <li><code>React,Framework,87000</code> (description optional)</li>
                      <li><code>Node.js,Runtime</code> (frequency defaults to 1)</li>
                      <li><code>JavaScript</code> (category and frequency will be set to defaults)</li>
                    </ul>
                  </div>
                  <button
                    onClick={addBulkWords}
                    disabled={!bulkWords.trim()}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Import Words
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Database Actions */}
          <div className="border-t pt-4 mt-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const words = getAllWords();
                  console.log('All words in database:', words);
                  alert(`Found ${words.length} words in ${currentDb?.metadata.name} database. Check console for details.`);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                View All Words
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to clear all data from the ${currentDb?.metadata.name} database?`)) {
                    clearDatabase();
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Database
              </button>
            </div>
          </div>
        </Card>

        {/* Create New Database Modal */}
        {showCreateDb && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Create New Database</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                  <input
                    type="text"
                    value={newDbName}
                    onChange={(e) => setNewDbName(e.target.value)}
                    placeholder="e.g., cities"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newDbDescription}
                    onChange={(e) => setNewDbDescription(e.target.value)}
                    placeholder="e.g., World Cities Database"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={createNewDatabase}
                  disabled={!newDbName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Create Database
                </button>
                <button
                  onClick={() => {
                    setShowCreateDb(false);
                    setNewDbName('');
                    setNewDbDescription('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View All Words Modal */}
        {showAllWords && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">All Words in {activeDb} Database</h3>
                <button
                  onClick={() => setShowAllWords(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-auto">
                {allWords.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No words found in this database</p>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 mb-4">
                      Total words: {allWords.length}
                    </div>
                    
                    <div className="grid gap-2 max-h-96 overflow-y-auto">
                      {allWords.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-lg">{item.word}</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                Freq: {item.frequency}
                              </span>
                              {item.metadata?.category && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                  {item.metadata.category}
                                </span>
                              )}
                            </div>
                            {item.metadata?.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.metadata.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowAllWords(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Interface */}
        <Card className="mb-6 p-6">
          <div className="space-y-4">
            {/* Search Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Target className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold">Search Algorithm</h3>
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSearchMode('exact')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    searchMode === 'exact'
                      ? 'bg-white shadow-sm text-indigo-600'
                      : 'text-gray-600'
                  }`}
                >
                  <Hash className="w-4 h-4 inline mr-2" />
                  Exact Search
                </button>
                <button
                  onClick={() => setSearchMode('fuzzy')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    searchMode === 'fuzzy'
                      ? 'bg-white shadow-sm text-indigo-600'
                      : 'text-gray-600'
                  }`}
                >
                  <TreePine className="w-4 h-4 inline mr-2" />
                  Fuzzy Search
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${currentDb?.metadata.description.toLowerCase()}... (try "${
                  activeDb === 'custom-words' ? 'java' : 'goo'
                }")`}
                className="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search Results */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-600" />
                Search Results
                {suggestions.length > 0 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {suggestions.length}
                  </span>
                )}
              </h3>

              {query.trim() === '' ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start typing to see intelligent search suggestions</p>
                  <p className="text-sm mt-2">
                    Try: {activeDb === 'custom-words' ? '&quot;adventure&quot;, &quot;beautiful&quot;, or &quot;happ&quot;' : '&quot;google&quot;, &quot;micro&quot;, or &quot;app&quot;'}
                  </p>
                </div>
              ) : suggestions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No results found for &quot;{query}&quot;</p>
                  {searchMode === 'exact' && (
                    <button
                      onClick={() => setSearchMode('fuzzy')}
                      className="text-indigo-600 hover:text-indigo-800 mt-2"
                    >
                      Try fuzzy search for approximate matches
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {suggestions.map((item, index) => (
                    <div
                      key={`${item.word}-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">{item.word}</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {item.metadata?.category}
                          </span>
                          {item.distance !== undefined && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                              distance: {item.distance}
                            </span>
                          )}
                        </div>
                        {item.metadata?.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.metadata.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Frequency</div>
                        <div className="font-bold text-indigo-600">{item.frequency.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Performance
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Search Time</span>
                    <span className="font-bold text-green-600">
                      {searchStats.searchTime.toFixed(3)}ms
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(searchStats.searchTime / 10 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Results Found</span>
                    <span className="font-bold text-blue-600">{searchStats.resultsFound}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Algorithm</span>
                    <span className="font-bold text-indigo-600">
                      {searchMode === 'exact' ? 'O(m)' : 'O(n×m×d)'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                System Stats
              </h3>
              <div className="space-y-3">
                {currentDb && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Words</span>
                      <span className="font-bold">{currentDb.trie.getStats().totalWords}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Trie Depth</span>
                      <span className="font-bold">{currentDb.trie.getStats().maxDepth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Hash Load</span>
                      <span className="font-bold">{(currentDb.hashTable.getStats().loadFactor * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Nodes</span>
                      <span className="font-bold">{currentDb.trie.getStats().nodeCount}</span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Algorithm Explanation */}
        <Card className="mt-6 p-6">
          <h3 className="text-xl font-bold mb-4">How the Search Engine Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-indigo-600 mb-2">🌳 Trie-Based Prefix Search</h4>
              <p className="text-sm text-gray-700 mb-3">
                Every word is stored character by character in a tree structure. When you type &quot;ja&quot;, 
                the algorithm traverses: root → &apos;j&apos; → &apos;a&apos; → collect all words from that node.
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>Time Complexity:</strong> O(m) where m = query length</li>
                <li>• <strong>Space Complexity:</strong> O(ALPHABET_SIZE × N × M)</li>
                <li>• <strong>Use Case:</strong> Google Search autocomplete, IDE code completion</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-purple-600 mb-2">🔍 Hash Table + Fuzzy Search</h4>
              <p className="text-sm text-gray-700 mb-3">
                Combines exact lookups with Levenshtein distance algorithm for typo tolerance. 
                Handles misspellings like &quot;googel&quot; → &quot;google&quot;.
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>Hash Lookup:</strong> O(1) for exact matches</li>
                <li>• <strong>Edit Distance:</strong> O(m × n) dynamic programming</li>
                <li>• <strong>Use Case:</strong> Spell checkers, search suggestions</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
