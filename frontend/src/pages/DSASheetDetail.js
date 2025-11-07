import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/DSATrackerNew.css';

const DSASheetDetail = () => {
  const { sheetId } = useParams();
  const navigate = useNavigate();
  const [expandedTopics, setExpandedTopics] = useState({}); // Track which topics are expanded
  const [expandedDifficulties, setExpandedDifficulties] = useState({}); // Track which difficulty levels are expanded
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Load solved problems from backend
  useEffect(() => {
    const fetchProgress = async () => {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(
          `${API_URL}/api/dsa/progress/${sheetId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success && response.data.solvedProblems) {
          setSolvedProblems(new Set(response.data.solvedProblems));
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        // Fall back to localStorage if API fails
        const saved = localStorage.getItem(`dsa-solved-${sheetId}`);
        if (saved) {
          setSolvedProblems(new Set(JSON.parse(saved)));
        }
      }
    };

    fetchProgress();
  }, [sheetId]);

  // Save to localStorage whenever solvedProblems changes
  useEffect(() => {
    localStorage.setItem(`dsa-solved-${sheetId}`, JSON.stringify([...solvedProblems]));
  }, [solvedProblems, sheetId]);

  // Toggle topic expansion
  const toggleTopic = (topic) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

  // Toggle difficulty expansion
  const toggleDifficulty = (key) => {
    setExpandedDifficulties(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Get all unique topics
  const getTopics = () => {
    const problems = allSheetProblems[sheetId] || [];
    return [...new Set(problems.map(p => p.topic))].sort();
  };

  // Get problems for a specific topic
  const getProblemsByTopic = (topic) => {
    const problems = allSheetProblems[sheetId] || [];
    return problems.filter(p => p.topic === topic);
  };

  // Get problems for a specific topic and difficulty
  const getProblemsByTopicAndDifficulty = (topic, difficulty) => {
    return getProblemsByTopic(topic).filter(p => p.difficulty === difficulty);
  };

  // Get difficulties for a topic
  const getDifficultiesForTopic = (topic) => {
    const difficulties = [...new Set(getProblemsByTopic(topic).map(p => p.difficulty))];
    return difficulties.sort((a, b) => {
      const order = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      return order[a] - order[b];
    });
  };

  // All problem data (same as before)
  const allSheetProblems = {
    // STRIVER'S SDE SHEET - Complete 191 Problems
    striver: [
      // Day 1: Arrays
      { id: 's1', title: 'Set Matrix Zeroes', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/set-matrix-zeroes/' },
      { id: 's2', title: 'Pascal\'s Triangle', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/pascals-triangle/' },
      { id: 's3', title: 'Next Permutation', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/next-permutation/' },
      { id: 's4', title: 'Kadane\'s Algorithm (Maximum Subarray)', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: 's5', title: 'Sort Colors (Dutch National Flag)', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/sort-colors/' },
      { id: 's6', title: 'Stock Buy and Sell', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      
      // Day 2: Arrays Part 2
      { id: 's7', title: 'Rotate Matrix', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/rotate-image/' },
      { id: 's8', title: 'Merge Overlapping Intervals', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-intervals/' },
      { id: 's9', title: 'Merge Sorted Array', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-sorted-array/' },
      { id: 's10', title: 'Find Duplicate Number', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/find-the-duplicate-number/' },
      { id: 's11', title: 'Repeat and Missing Number', difficulty: 'Medium', topic: 'Arrays', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/find-missing-and-repeating2512/1' },
      { id: 's12', title: 'Inversion Count', difficulty: 'Hard', topic: 'Arrays', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/inversion-of-array-1587115620/1' },
      
      // Day 3: Arrays/Math
      { id: 's13', title: 'Search in 2D Matrix', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      { id: 's14', title: 'Pow(x, n)', difficulty: 'Medium', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/powx-n/' },
      { id: 's15', title: 'Majority Element (>n/2)', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/majority-element/' },
      { id: 's16', title: 'Majority Element II (>n/3)', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/majority-element-ii/' },
      { id: 's17', title: 'Grid Unique Paths', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/unique-paths/' },
      { id: 's18', title: 'Reverse Pairs', difficulty: 'Hard', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-pairs/' },
      
      // Day 4: Hashing
      { id: 's19', title: '2 Sum Problem', difficulty: 'Easy', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/two-sum/' },
      { id: 's20', title: '4 Sum Problem', difficulty: 'Medium', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/4sum/' },
      { id: 's21', title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
      { id: 's22', title: 'Longest Subarray with Zero Sum', difficulty: 'Medium', topic: 'Hashing', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1' },
      { id: 's23', title: 'Count Subarrays with Given XOR', difficulty: 'Medium', topic: 'Hashing', platform: 'gfg', link: 'https://www.interviewbit.com/problems/subarray-with-given-xor/' },
      { id: 's24', title: 'Longest Substring Without Repeat', difficulty: 'Medium', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      
      // Day 5: Linked List
      { id: 's25', title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 's26', title: 'Find Middle of Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
      { id: 's27', title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { id: 's28', title: 'Remove Nth Node From End', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { id: 's29', title: 'Delete Node in Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/delete-node-in-a-linked-list/' },
      { id: 's30', title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/add-two-numbers/' },
      
      // Day 6: Linked List Part 2
      { id: 's31', title: 'Intersection of Two Linked Lists', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/intersection-of-two-linked-lists/' },
      { id: 's32', title: 'Detect Cycle in Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: 's33', title: 'Reverse Nodes in k-Group', difficulty: 'Hard', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
      { id: 's34', title: 'Check if Linked List is Palindrome', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/palindrome-linked-list/' },
      { id: 's35', title: 'Starting Point of Loop', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/linked-list-cycle-ii/' },
      { id: 's36', title: 'Flattening a Linked List', difficulty: 'Hard', topic: 'Linked List', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/flattening-a-linked-list/1' },
      
      // Day 7: 2-Pointer
      { id: 's37', title: 'Rotate List', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/rotate-list/' },
      { id: 's38', title: 'Clone Linked List with Random Pointer', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
      { id: 's39', title: '3 Sum', difficulty: 'Medium', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/3sum/' },
      { id: 's40', title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/trapping-rain-water/' },
      { id: 's41', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
      { id: 's42', title: 'Max Consecutive Ones', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/max-consecutive-ones/' },
      
      // Day 8: Greedy
      { id: 's43', title: 'N Meetings in One Room', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1' },
      { id: 's44', title: 'Minimum Platforms', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1' },
      { id: 's45', title: 'Job Sequencing Problem', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1' },
      { id: 's46', title: 'Fractional Knapsack', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1' },
      { id: 's47', title: 'Greedy Algorithm to Find Minimum Coins', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/coin-piles5152/1' },
      { id: 's48', title: 'Activity Selection', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/activity-selection-1587115620/1' },
      
      // Day 9: Recursion
      { id: 's49', title: 'Subset Sum', difficulty: 'Medium', topic: 'Recursion', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/subset-sums2234/1' },
      { id: 's50', title: 'Subsets II', difficulty: 'Medium', topic: 'Recursion', platform: 'leetcode', link: 'https://leetcode.com/problems/subsets-ii/' },
      { id: 's51', title: 'Combination Sum', difficulty: 'Medium', topic: 'Recursion', platform: 'leetcode', link: 'https://leetcode.com/problems/combination-sum/' },
      { id: 's52', title: 'Combination Sum II', difficulty: 'Medium', topic: 'Recursion', platform: 'leetcode', link: 'https://leetcode.com/problems/combination-sum-ii/' },
      { id: 's53', title: 'Palindrome Partitioning', difficulty: 'Medium', topic: 'Recursion', platform: 'leetcode', link: 'https://leetcode.com/problems/palindrome-partitioning/' },
      { id: 's54', title: 'K-th Permutation Sequence', difficulty: 'Hard', topic: 'Recursion', platform: 'leetcode', link: 'https://leetcode.com/problems/permutation-sequence/' },
      
      // Day 10: Recursion & Backtracking
      { id: 's55', title: 'Print All Permutations', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/permutations/' },
      { id: 's56', title: 'N-Queens Problem', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/n-queens/' },
      { id: 's57', title: 'Sudoku Solver', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/sudoku-solver/' },
      { id: 's58', title: 'M-Coloring Problem', difficulty: 'Hard', topic: 'Backtracking', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1' },
      { id: 's59', title: 'Rat in a Maze', difficulty: 'Medium', topic: 'Backtracking', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/rat-in-a-maze-problem/1' },
      { id: 's60', title: 'Word Break II', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/word-break-ii/' },
      
      // Day 11: Binary Search
      { id: 's61', title: 'Nth Root of M', difficulty: 'Medium', topic: 'Binary Search', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/find-nth-root-of-m5843/1' },
      { id: 's62', title: 'Matrix Median', difficulty: 'Medium', topic: 'Binary Search', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1' },
      { id: 's63', title: 'Find Peak Element', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/find-peak-element/' },
      { id: 's64', title: 'Single Element in Sorted Array', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/single-element-in-a-sorted-array/' },
      { id: 's65', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: 's66', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
      { id: 's67', title: 'Kth Element of Two Sorted Arrays', difficulty: 'Medium', topic: 'Binary Search', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1' },
      { id: 's68', title: 'Allocate Minimum Pages', difficulty: 'Hard', topic: 'Binary Search', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1' },
      
      // Day 12: Heaps
      { id: 's69', title: 'Max Heap Implementation', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/operations-on-binary-min-heap/1' },
      { id: 's70', title: 'Kth Largest Element', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { id: 's71', title: 'Maximum Sum Combination', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://www.interviewbit.com/problems/maximum-sum-combinations/' },
      { id: 's72', title: 'Find Median from Data Stream', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/find-median-from-data-stream/' },
      { id: 's73', title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: 's74', title: 'Top K Frequent Elements', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      
      // Day 13: Stack and Queue
      { id: 's75', title: 'Implement Stack using Arrays', difficulty: 'Easy', topic: 'Stack', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/implement-stack-using-array/1' },
      { id: 's76', title: 'Implement Queue using Arrays', difficulty: 'Easy', topic: 'Queue', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/implement-queue-using-array/1' },
      { id: 's77', title: 'Implement Stack using Queue', difficulty: 'Easy', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-stack-using-queues/' },
      { id: 's78', title: 'Implement Queue using Stack', difficulty: 'Easy', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
      { id: 's79', title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: 's80', title: 'Next Greater Element', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/next-greater-element-i/' },
      { id: 's81', title: 'Sort a Stack', difficulty: 'Medium', topic: 'Stack', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/sort-a-stack/1' },
      
      // Day 14: Stack and Queue Part 2
      { id: 's82', title: 'Next Smaller Element', difficulty: 'Medium', topic: 'Stack', platform: 'gfg', link: 'https://www.interviewbit.com/problems/nearest-smaller-element/' },
      { id: 's83', title: 'LRU Cache', difficulty: 'Hard', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/lru-cache/' },
      { id: 's84', title: 'LFU Cache', difficulty: 'Hard', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/lfu-cache/' },
      { id: 's85', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
      { id: 's86', title: 'Sliding Window Maximum', difficulty: 'Hard', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/sliding-window-maximum/' },
      { id: 's87', title: 'Min Stack', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/min-stack/' },
      { id: 's88', title: 'Rotting Oranges', difficulty: 'Medium', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/rotting-oranges/' },
      { id: 's89', title: 'Stock Span Problem', difficulty: 'Medium', topic: 'Stack', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/stock-span-problem-1587115621/1' },
      { id: 's90', title: 'Maximum of Minimum for Every Window', difficulty: 'Hard', topic: 'Stack', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/maximum-of-minimum-for-every-window-size3453/1' },
      { id: 's91', title: 'Celebrity Problem', difficulty: 'Medium', topic: 'Stack', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/the-celebrity-problem/1' },
      
      // Day 15: String
      { id: 's92', title: 'Reverse Words in a String', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-words-in-a-string/' },
      { id: 's93', title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      { id: 's94', title: 'Roman to Integer', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/roman-to-integer/' },
      { id: 's95', title: 'Implement ATOI', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/string-to-integer-atoi/' },
      { id: 's96', title: 'Longest Common Prefix', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-common-prefix/' },
      { id: 's97', title: 'Rabin Karp Algorithm', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/search-pattern-rabin-karp-algorithm--141631/1' },
      
      // Day 16: String Part 2
      { id: 's98', title: 'Z Algorithm', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/z-algorithm-linear-time-pattern-searching-algorithm/' },
      { id: 's99', title: 'KMP Algorithm', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/search-pattern0205/1' },
      { id: 's100', title: 'Minimum Characters to Make String Palindrome', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/minimum-characters-to-be-added-at-front-to-make-string-palindrome/1' },
      { id: 's101', title: 'Check for Anagrams', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-anagram/' },
      { id: 's102', title: 'Count and Say', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/count-and-say/' },
      { id: 's103', title: 'Compare Version Numbers', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/compare-version-numbers/' },
      
      // Day 17: Binary Tree
      { id: 's104', title: 'Inorder Traversal', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
      { id: 's105', title: 'Preorder Traversal', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-preorder-traversal/' },
      { id: 's106', title: 'Postorder Traversal', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-postorder-traversal/' },
      { id: 's107', title: 'Morris Inorder Traversal', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://www.geeksforgeeks.org/inorder-tree-traversal-without-recursion-and-without-stack/' },
      { id: 's108', title: 'Morris Preorder Traversal', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://www.geeksforgeeks.org/morris-traversal-for-preorder/' },
      { id: 's109', title: 'Left View of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/left-view-of-binary-tree/1' },
      { id: 's110', title: 'Bottom View of Binary Tree', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1' },
      { id: 's111', title: 'Top View of Binary Tree', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/top-view-of-binary-tree/1' },
      { id: 's112', title: 'Vertical Order Traversal', difficulty: 'Hard', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/' },
      
      // Day 18: Binary Tree Part 2
      { id: 's113', title: 'Root to Node Path', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.interviewbit.com/problems/path-to-given-node/' },
      { id: 's114', title: 'Maximum Width of Binary Tree', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-width-of-binary-tree/' },
      { id: 's115', title: 'Level Order Traversal', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { id: 's116', title: 'Height of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: 's117', title: 'Diameter of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
      { id: 's118', title: 'Check if Binary Tree is Balanced', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/balanced-binary-tree/' },
      { id: 's119', title: 'LCA in Binary Tree', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
      { id: 's120', title: 'Check for Identical Trees', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/same-tree/' },
      
      // Day 19: Binary Tree Part 3
      { id: 's121', title: 'Zigzag Level Order Traversal', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/' },
      { id: 's122', title: 'Boundary Traversal', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1' },
      { id: 's123', title: 'Maximum Path Sum', difficulty: 'Hard', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
      { id: 's124', title: 'Construct Binary Tree from Inorder and Preorder', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
      { id: 's125', title: 'Construct Binary Tree from Inorder and Postorder', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/' },
      { id: 's126', title: 'Symmetric Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/symmetric-tree/' },
      { id: 's127', title: 'Flatten Binary Tree to Linked List', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/' },
      { id: 's128', title: 'Check if Binary Tree is Mirror', difficulty: 'Easy', topic: 'Binary Tree', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/check-mirror-in-n-ary-tree1528/1' },
      { id: 's129', title: 'Children Sum Property', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/children-sum-parent/1' },
      
      // Day 20: Binary Search Tree
      { id: 's130', title: 'Populate Next Right Pointers', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/' },
      { id: 's131', title: 'Search in BST', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/search-in-a-binary-search-tree/' },
      { id: 's132', title: 'Convert Sorted Array to BST', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/' },
      { id: 's133', title: 'Construct BST from Preorder', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/' },
      { id: 's134', title: 'Validate BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { id: 's135', title: 'LCA in BST', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { id: 's136', title: 'Predecessor and Successor in BST', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/predecessor-and-successor/1' },
      { id: 's137', title: 'Floor in BST', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/floor-in-bst/1' },
      { id: 's138', title: 'Ceil in BST', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/implementing-ceil-in-bst/1' },
      { id: 's139', title: 'Kth Smallest Element in BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
      
      // Day 21: Binary Search Tree Part 2
      { id: 's140', title: 'Kth Largest Element in BST', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/kth-largest-element-in-bst/1' },
      { id: 's141', title: 'Two Sum in BST', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/two-sum-iv-input-is-a-bst/' },
      { id: 's142', title: 'BST Iterator', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-search-tree-iterator/' },
      { id: 's143', title: 'Size of Largest BST in Binary Tree', difficulty: 'Hard', topic: 'BST', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/largest-bst/1' },
      { id: 's144', title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
      
      // Day 22: Binary Trees [Miscellaneous]
      { id: 's145', title: 'Binary Tree to DLL', difficulty: 'Hard', topic: 'Binary Tree', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/binary-tree-to-dll/1' },
      { id: 's146', title: 'Find Median in Stream', difficulty: 'Hard', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/find-median-from-data-stream/' },
      { id: 's147', title: 'Kth Largest in Stream', difficulty: 'Easy', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
      { id: 's148', title: 'Distinct Numbers in Window', difficulty: 'Medium', topic: 'Sliding Window', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/count-distinct-elements-in-every-window/1' },
      
      // Day 23: Graph
      { id: 's149', title: 'Clone Graph', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/clone-graph/' },
      { id: 's150', title: 'DFS Traversal', difficulty: 'Easy', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1' },
      { id: 's151', title: 'BFS Traversal', difficulty: 'Easy', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph/1' },
      { id: 's152', title: 'Detect Cycle in Undirected Graph (DFS)', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1' },
      { id: 's153', title: 'Detect Cycle in Undirected Graph (BFS)', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1' },
      { id: 's154', title: 'Detect Cycle in Directed Graph (DFS)', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1' },
      { id: 's155', title: 'Topological Sort (DFS)', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/topological-sort/1' },
      { id: 's156', title: 'Topological Sort (BFS - Kahn\'s Algorithm)', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/topological-sort/1' },
      { id: 's157', title: 'Number of Islands', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-islands/' },
      { id: 's158', title: 'Bipartite Graph (DFS)', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/bipartite-graph/1' },
      { id: 's159', title: 'Bipartite Graph (BFS)', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/bipartite-graph/1' },
      
      // Day 24: Graph Part 2
      { id: 's160', title: 'Strongly Connected Components (Kosaraju)', difficulty: 'Hard', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1' },
      { id: 's161', title: 'Dijkstra\'s Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1' },
      { id: 's162', title: 'Bellman-Ford Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1' },
      { id: 's163', title: 'Floyd Warshall Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1' },
      { id: 's164', title: 'MST using Prim\'s Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1' },
      
      // Day 25: Dynamic Programming
      { id: 's165', title: 'Maximum Product Subarray', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-product-subarray/' },
      { id: 's166', title: 'Longest Increasing Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { id: 's167', title: 'Longest Common Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { id: 's168', title: '0-1 Knapsack', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1' },
      { id: 's169', title: 'Edit Distance', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/edit-distance/' },
      { id: 's170', title: 'Maximum Sum Increasing Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/maximum-sum-increasing-subsequence4749/1' },
      { id: 's171', title: 'Matrix Chain Multiplication', difficulty: 'Hard', topic: 'DP', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1' },
      
      // Day 26: Dynamic Programming Part 2
      { id: 's172', title: 'Maximum Sum Path in Matrix', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/path-in-matrix3805/1' },
      { id: 's173', title: 'Coin Change', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/coin-change/' },
      { id: 's174', title: 'Subset Sum Problem', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1' },
      { id: 's175', title: 'Rod Cutting', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/rod-cutting0840/1' },
      { id: 's176', title: 'Egg Dropping Problem', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/super-egg-drop/' },
      { id: 's177', title: 'Word Break', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/word-break/' },
      { id: 's178', title: 'Palindrome Partitioning II', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/palindrome-partitioning-ii/' },
      
      // Day 27: Trie
      { id: 's179', title: 'Implement Trie', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
      { id: 's180', title: 'Implement Trie II', difficulty: 'Medium', topic: 'Trie', platform: 'gfg', link: 'https://www.codingninjas.com/codestudio/problems/implement-trie_1387095' },
      { id: 's181', title: 'Longest String with All Prefixes', difficulty: 'Medium', topic: 'Trie', platform: 'gfg', link: 'https://www.codingninjas.com/codestudio/problems/complete-string_2687860' },
      { id: 's182', title: 'Number of Distinct Substrings', difficulty: 'Hard', topic: 'Trie', platform: 'gfg', link: 'https://www.codingninjas.com/codestudio/problems/count-distinct-substrings_985292' },
      { id: 's183', title: 'Maximum XOR of Two Numbers', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/' },
      { id: 's184', title: 'Maximum XOR With an Element From Array', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-xor-with-an-element-from-array/' },
      
      // Additional Problems
      { id: 's185', title: 'Aggressive Cows', difficulty: 'Hard', topic: 'Binary Search', platform: 'spoj', link: 'https://www.spoj.com/problems/AGGRCOW/' },
      { id: 's186', title: 'Book Allocation', difficulty: 'Hard', topic: 'Binary Search', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1' },
      { id: 's187', title: 'Chess Tournament', difficulty: 'Hard', topic: 'Binary Search', platform: 'spoj', link: 'https://www.codechef.com/problems/AMCS03' },
      { id: 's188', title: 'SQRT Decomposition', difficulty: 'Hard', topic: 'Advanced', platform: 'gfg', link: 'https://www.geeksforgeeks.org/sqrt-square-root-decomposition-technique-set-1-introduction/' },
      { id: 's189', title: 'Segment Tree', difficulty: 'Hard', topic: 'Advanced', platform: 'gfg', link: 'https://www.geeksforgeeks.org/segment-tree-set-1-sum-of-given-range/' },
      { id: 's190', title: 'Binary Indexed Tree (Fenwick Tree)', difficulty: 'Hard', topic: 'Advanced', platform: 'gfg', link: 'https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/' },
      { id: 's191', title: 'Square Root using Binary Search', difficulty: 'Easy', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/sqrtx/' },
    ],

    // NEETCODE 150 - Complete 150 Problems
    neetcode: [
      // Arrays & Hashing (9)
      { id: 'n1', title: 'Contains Duplicate', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/contains-duplicate/' },
      { id: 'n2', title: 'Valid Anagram', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-anagram/' },
      { id: 'n3', title: 'Two Sum', difficulty: 'Easy', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/two-sum/' },
      { id: 'n4', title: 'Group Anagrams', difficulty: 'Medium', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/group-anagrams/' },
      { id: 'n5', title: 'Top K Frequent Elements', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { id: 'n6', title: 'Product of Array Except Self', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { id: 'n7', title: 'Valid Sudoku', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-sudoku/' },
      { id: 'n8', title: 'Encode and Decode Strings', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/encode-and-decode-strings/' },
      { id: 'n9', title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
      // Two Pointers (5)
      { id: 'n10', title: 'Valid Palindrome', difficulty: 'Easy', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: 'n11', title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { id: 'n12', title: '3Sum', difficulty: 'Medium', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/3sum/' },
      { id: 'n13', title: 'Container With Most Water', difficulty: 'Medium', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/container-with-most-water/' },
      { id: 'n14', title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/trapping-rain-water/' },
      // Sliding Window (6)
      { id: 'n15', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Sliding Window', platform: 'leetcode', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { id: 'n16', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'Sliding Window', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: 'n17', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', topic: 'Sliding Window', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
      { id: 'n18', title: 'Permutation in String', difficulty: 'Medium', topic: 'Sliding Window', platform: 'leetcode', link: 'https://leetcode.com/problems/permutation-in-string/' },
      { id: 'n19', title: 'Minimum Window Substring', difficulty: 'Hard', topic: 'Sliding Window', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-window-substring/' },
      { id: 'n20', title: 'Sliding Window Maximum', difficulty: 'Hard', topic: 'Sliding Window', platform: 'leetcode', link: 'https://leetcode.com/problems/sliding-window-maximum/' },
      // Stack (7)
      { id: 'n21', title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: 'n22', title: 'Min Stack', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/min-stack/' },
      { id: 'n23', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
      { id: 'n24', title: 'Generate Parentheses', difficulty: 'Medium', topic: 'Recursion', platform: 'leetcode', link: 'https://leetcode.com/problems/generate-parentheses/' },
      { id: 'n25', title: 'Daily Temperatures', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/daily-temperatures/' },
      { id: 'n26', title: 'Car Fleet', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/car-fleet/' },
      { id: 'n27', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
      // Binary Search (7)
      { id: 'n28', title: 'Binary Search', difficulty: 'Easy', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-search/' },
      { id: 'n29', title: 'Search a 2D Matrix', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      { id: 'n30', title: 'Koko Eating Bananas', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/koko-eating-bananas/' },
      { id: 'n31', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { id: 'n32', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: 'n33', title: 'Time Based Key-Value Store', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/time-based-key-value-store/' },
      { id: 'n34', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
      // Linked List (11)
      { id: 'n35', title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 'n36', title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { id: 'n37', title: 'Reorder List', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reorder-list/' },
      { id: 'n38', title: 'Remove Nth Node From End of List', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { id: 'n39', title: 'Copy List with Random Pointer', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
      { id: 'n40', title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/add-two-numbers/' },
      { id: 'n41', title: 'Linked List Cycle', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: 'n42', title: 'Find the Duplicate Number', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/find-the-duplicate-number/' },
      { id: 'n43', title: 'LRU Cache', difficulty: 'Medium', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/lru-cache/' },
      { id: 'n44', title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: 'n45', title: 'Reverse Nodes in k-Group', difficulty: 'Hard', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
      // Trees (15)
      { id: 'n46', title: 'Invert Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/invert-binary-tree/' },
      { id: 'n47', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: 'n48', title: 'Diameter of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
      { id: 'n49', title: 'Balanced Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/balanced-binary-tree/' },
      { id: 'n50', title: 'Same Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/same-tree/' },
      { id: 'n51', title: 'Subtree of Another Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/subtree-of-another-tree/' },
      { id: 'n52', title: 'Lowest Common Ancestor of BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { id: 'n53', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { id: 'n54', title: 'Binary Tree Right Side View', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
      { id: 'n55', title: 'Count Good Nodes in Binary Tree', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/' },
      { id: 'n56', title: 'Validate Binary Search Tree', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { id: 'n57', title: 'Kth Smallest Element in BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
      { id: 'n58', title: 'Construct Tree from Preorder and Inorder', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
      { id: 'n59', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
      { id: 'n60', title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
      // Tries (3)
      { id: 'n61', title: 'Implement Trie', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
      { id: 'n62', title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
      { id: 'n63', title: 'Word Search II', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/word-search-ii/' },
      // Heap / Priority Queue (7)
      { id: 'n64', title: 'Kth Largest Element in Stream', difficulty: 'Easy', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
      { id: 'n65', title: 'Last Stone Weight', difficulty: 'Easy', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/last-stone-weight/' },
      { id: 'n66', title: 'K Closest Points to Origin', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
      { id: 'n67', title: 'Kth Largest Element in Array', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { id: 'n68', title: 'Task Scheduler', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/task-scheduler/' },
      { id: 'n69', title: 'Design Twitter', difficulty: 'Medium', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/design-twitter/' },
      { id: 'n70', title: 'Find Median from Data Stream', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/find-median-from-data-stream/' },
      // Backtracking (9)
      { id: 'n71', title: 'Subsets', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/subsets/' },
      { id: 'n72', title: 'Combination Sum', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/combination-sum/' },
      { id: 'n73', title: 'Permutations', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/permutations/' },
      { id: 'n74', title: 'Subsets II', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/subsets-ii/' },
      { id: 'n75', title: 'Combination Sum II', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/combination-sum-ii/' },
      { id: 'n76', title: 'Word Search', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/word-search/' },
      { id: 'n77', title: 'Palindrome Partitioning', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/palindrome-partitioning/' },
      { id: 'n78', title: 'Letter Combinations of Phone Number', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
      { id: 'n79', title: 'N-Queens', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/n-queens/' },
      // Graphs (13)
      { id: 'n80', title: 'Number of Islands', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-islands/' },
      { id: 'n81', title: 'Clone Graph', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/clone-graph/' },
      { id: 'n82', title: 'Max Area of Island', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/max-area-of-island/' },
      { id: 'n83', title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
      { id: 'n84', title: 'Surrounded Regions', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/surrounded-regions/' },
      { id: 'n85', title: 'Rotting Oranges', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/rotting-oranges/' },
      { id: 'n86', title: 'Walls and Gates', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/walls-and-gates/' },
      { id: 'n87', title: 'Course Schedule', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/course-schedule/' },
      { id: 'n88', title: 'Course Schedule II', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/course-schedule-ii/' },
      { id: 'n89', title: 'Redundant Connection', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/redundant-connection/' },
      { id: 'n90', title: 'Number of Connected Components', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
      { id: 'n91', title: 'Graph Valid Tree', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/graph-valid-tree/' },
      { id: 'n92', title: 'Word Ladder', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/word-ladder/' },
      // Advanced Graphs (6)
      { id: 'n93', title: 'Reconstruct Itinerary', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/reconstruct-itinerary/' },
      { id: 'n94', title: 'Min Cost to Connect All Points', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/min-cost-to-connect-all-points/' },
      { id: 'n95', title: 'Network Delay Time', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/network-delay-time/' },
      { id: 'n96', title: 'Swim in Rising Water', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/swim-in-rising-water/' },
      { id: 'n97', title: 'Alien Dictionary', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/alien-dictionary/' },
      { id: 'n98', title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },
      // 1-D Dynamic Programming (12)
      { id: 'n99', title: 'Climbing Stairs', difficulty: 'Easy', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: 'n100', title: 'Min Cost Climbing Stairs', difficulty: 'Easy', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/min-cost-climbing-stairs/' },
      { id: 'n101', title: 'House Robber', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/house-robber/' },
      { id: 'n102', title: 'House Robber II', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/house-robber-ii/' },
      { id: 'n103', title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      { id: 'n104', title: 'Palindromic Substrings', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/palindromic-substrings/' },
      { id: 'n105', title: 'Decode Ways', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/decode-ways/' },
      { id: 'n106', title: 'Coin Change', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/coin-change/' },
      { id: 'n107', title: 'Maximum Product Subarray', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-product-subarray/' },
      { id: 'n108', title: 'Word Break', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/word-break/' },
      { id: 'n109', title: 'Longest Increasing Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { id: 'n110', title: 'Partition Equal Subset Sum', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
      // 2-D Dynamic Programming (11)
      { id: 'n111', title: 'Unique Paths', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/unique-paths/' },
      { id: 'n112', title: 'Longest Common Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { id: 'n113', title: 'Best Time to Buy/Sell Stock with Cooldown', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/' },
      { id: 'n114', title: 'Coin Change II', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/coin-change-2/' },
      { id: 'n115', title: 'Target Sum', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/target-sum/' },
      { id: 'n116', title: 'Interleaving String', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/interleaving-string/' },
      { id: 'n117', title: 'Longest Increasing Path in Matrix', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/' },
      { id: 'n118', title: 'Distinct Subsequences', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/distinct-subsequences/' },
      { id: 'n119', title: 'Edit Distance', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/edit-distance/' },
      { id: 'n120', title: 'Burst Balloons', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/burst-balloons/' },
      { id: 'n121', title: 'Regular Expression Matching', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/regular-expression-matching/' },
      // Greedy (8)
      { id: 'n122', title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: 'n123', title: 'Jump Game', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/jump-game/' },
      { id: 'n124', title: 'Jump Game II', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/jump-game-ii/' },
      { id: 'n125', title: 'Gas Station', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/gas-station/' },
      { id: 'n126', title: 'Hand of Straights', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/hand-of-straights/' },
      { id: 'n127', title: 'Merge Triplets to Form Target', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/' },
      { id: 'n128', title: 'Partition Labels', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/partition-labels/' },
      { id: 'n129', title: 'Valid Parenthesis String', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-parenthesis-string/' },
      // Intervals (6)
      { id: 'n130', title: 'Insert Interval', difficulty: 'Medium', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/insert-interval/' },
      { id: 'n131', title: 'Merge Intervals', difficulty: 'Medium', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-intervals/' },
      { id: 'n132', title: 'Non-overlapping Intervals', difficulty: 'Medium', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/non-overlapping-intervals/' },
      { id: 'n133', title: 'Meeting Rooms', difficulty: 'Easy', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/meeting-rooms/' },
      { id: 'n134', title: 'Meeting Rooms II', difficulty: 'Medium', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/meeting-rooms-ii/' },
      { id: 'n135', title: 'Minimum Interval to Include Each Query', difficulty: 'Hard', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/' },
      // Math & Geometry (8)
      { id: 'n136', title: 'Rotate Image', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/rotate-image/' },
      { id: 'n137', title: 'Spiral Matrix', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/spiral-matrix/' },
      { id: 'n138', title: 'Set Matrix Zeroes', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/set-matrix-zeroes/' },
      { id: 'n139', title: 'Happy Number', difficulty: 'Easy', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/happy-number/' },
      { id: 'n140', title: 'Plus One', difficulty: 'Easy', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/plus-one/' },
      { id: 'n141', title: 'Pow(x, n)', difficulty: 'Medium', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/powx-n/' },
      { id: 'n142', title: 'Multiply Strings', difficulty: 'Medium', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/multiply-strings/' },
      { id: 'n143', title: 'Detect Squares', difficulty: 'Medium', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/detect-squares/' },
      // Bit Manipulation (7)
      { id: 'n144', title: 'Single Number', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/single-number/' },
      { id: 'n145', title: 'Number of 1 Bits', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-1-bits/' },
      { id: 'n146', title: 'Counting Bits', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/counting-bits/' },
      { id: 'n147', title: 'Reverse Bits', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-bits/' },
      { id: 'n148', title: 'Missing Number', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/missing-number/' },
      { id: 'n149', title: 'Sum of Two Integers', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/sum-of-two-integers/' },
      { id: 'n150', title: 'Reverse Integer', difficulty: 'Medium', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-integer/' },
    ],

    // BLIND 75 - Essential Interview Questions (25 problems shown)
    blind75: [
      // Array
      { id: 'b1', title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/two-sum/' },
      { id: 'b2', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { id: 'b3', title: 'Contains Duplicate', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/contains-duplicate/' },
      { id: 'b4', title: 'Product of Array Except Self', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { id: 'b5', title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: 'b6', title: 'Maximum Product Subarray', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-product-subarray/' },
      { id: 'b7', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { id: 'b8', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: 'b9', title: '3Sum', difficulty: 'Medium', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/3sum/' },
      { id: 'b10', title: 'Container With Most Water', difficulty: 'Medium', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/container-with-most-water/' },
      // Binary
      { id: 'b11', title: 'Sum of Two Integers', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/sum-of-two-integers/' },
      { id: 'b12', title: 'Number of 1 Bits', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-1-bits/' },
      { id: 'b13', title: 'Counting Bits', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/counting-bits/' },
      { id: 'b14', title: 'Missing Number', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/missing-number/' },
      { id: 'b15', title: 'Reverse Bits', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-bits/' },
      // Dynamic Programming
      { id: 'b16', title: 'Climbing Stairs', difficulty: 'Easy', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: 'b17', title: 'Coin Change', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/coin-change/' },
      { id: 'b18', title: 'Longest Increasing Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { id: 'b19', title: 'Longest Common Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { id: 'b20', title: 'Word Break', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/word-break/' },
      { id: 'b21', title: 'Combination Sum IV', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/combination-sum-iv/' },
      { id: 'b22', title: 'House Robber', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/house-robber/' },
      { id: 'b23', title: 'House Robber II', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/house-robber-ii/' },
      { id: 'b24', title: 'Decode Ways', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/decode-ways/' },
      { id: 'b25', title: 'Unique Paths', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/unique-paths/' },
      { id: 'b26', title: 'Jump Game', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/jump-game/' },
      // Graph
      { id: 'b27', title: 'Clone Graph', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/clone-graph/' },
      { id: 'b28', title: 'Course Schedule', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/course-schedule/' },
      { id: 'b29', title: 'Pacific Atlantic Water Flow', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
      { id: 'b30', title: 'Number of Islands', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-islands/' },
      { id: 'b31', title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
      { id: 'b32', title: 'Alien Dictionary', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/alien-dictionary/' },
      { id: 'b33', title: 'Graph Valid Tree', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/graph-valid-tree/' },
      { id: 'b34', title: 'Number of Connected Components', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
      // Interval
      { id: 'b35', title: 'Insert Interval', difficulty: 'Medium', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/insert-interval/' },
      { id: 'b36', title: 'Merge Intervals', difficulty: 'Medium', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-intervals/' },
      { id: 'b37', title: 'Non-overlapping Intervals', difficulty: 'Medium', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/non-overlapping-intervals/' },
      { id: 'b38', title: 'Meeting Rooms', difficulty: 'Easy', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/meeting-rooms/' },
      { id: 'b39', title: 'Meeting Rooms II', difficulty: 'Medium', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/meeting-rooms-ii/' },
      // Linked List
      { id: 'b40', title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 'b41', title: 'Detect Cycle in Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: 'b42', title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { id: 'b43', title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: 'b44', title: 'Remove Nth Node From End', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { id: 'b45', title: 'Reorder List', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reorder-list/' },
      // Matrix
      { id: 'b46', title: 'Set Matrix Zeroes', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/set-matrix-zeroes/' },
      { id: 'b47', title: 'Spiral Matrix', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/spiral-matrix/' },
      { id: 'b48', title: 'Rotate Image', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/rotate-image/' },
      { id: 'b49', title: 'Word Search', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/word-search/' },
      // String
      { id: 'b50', title: 'Longest Substring Without Repeating', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: 'b51', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
      { id: 'b52', title: 'Minimum Window Substring', difficulty: 'Hard', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-window-substring/' },
      { id: 'b53', title: 'Valid Anagram', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-anagram/' },
      { id: 'b54', title: 'Group Anagrams', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/group-anagrams/' },
      { id: 'b55', title: 'Valid Palindrome', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: 'b56', title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      { id: 'b57', title: 'Palindromic Substrings', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/palindromic-substrings/' },
      { id: 'b58', title: 'Encode and Decode Strings', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/encode-and-decode-strings/' },
      // Tree
      { id: 'b59', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: 'b60', title: 'Same Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/same-tree/' },
      { id: 'b61', title: 'Invert Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/invert-binary-tree/' },
      { id: 'b62', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
      { id: 'b63', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { id: 'b64', title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
      { id: 'b65', title: 'Subtree of Another Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/subtree-of-another-tree/' },
      { id: 'b66', title: 'Construct Tree from Preorder and Inorder', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
      { id: 'b67', title: 'Validate Binary Search Tree', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { id: 'b68', title: 'Kth Smallest Element in BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
      { id: 'b69', title: 'Lowest Common Ancestor of BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { id: 'b70', title: 'Implement Trie', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
      { id: 'b71', title: 'Add and Search Word', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
      { id: 'b72', title: 'Word Search II', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/word-search-ii/' },
      // Heap
      { id: 'b73', title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: 'b74', title: 'Top K Frequent Elements', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { id: 'b75', title: 'Find Median from Data Stream', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/find-median-from-data-stream/' },
    ],

    // LOVE BABBAR'S 450 - Comprehensive DSA Sheet (450 problems - showing all categories)
    love: [
      // Array (50 problems - showing 25)
      { id: 'l1', title: 'Reverse the Array', difficulty: 'Easy', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/write-a-program-to-reverse-an-array-or-string/' },
      { id: 'l2', title: 'Find Maximum and Minimum', difficulty: 'Easy', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/maximum-and-minimum-in-an-array/' },
      { id: 'l3', title: 'Kth Smallest Element', difficulty: 'Medium', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/kth-smallestlargest-element-unsorted-array/' },
      { id: 'l4', title: 'Sort 0s, 1s and 2s', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/sort-colors/' },
      { id: 'l5', title: 'Move Negative to One Side', difficulty: 'Easy', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/move-negative-numbers-beginning-positive-end-constant-extra-space/' },
      { id: 'l6', title: 'Union of Two Arrays', difficulty: 'Easy', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-union-and-intersection-of-two-unsorted-arrays/' },
      { id: 'l7', title: 'Cyclically Rotate Array', difficulty: 'Easy', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/array-rotation/' },
      { id: 'l8', title: 'Kadane\'s Algorithm', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: 'l9', title: 'Minimize Heights', difficulty: 'Medium', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimize-the-maximum-difference-between-the-heights/' },
      { id: 'l10', title: 'Minimum Jumps', difficulty: 'Medium', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-number-of-jumps-to-reach-end-of-a-given-array/' },
      { id: 'l11', title: 'Find Duplicate', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/find-the-duplicate-number/' },
      { id: 'l12', title: 'Merge Intervals', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-intervals/' },
      { id: 'l13', title: 'Next Permutation', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/next-permutation/' },
      { id: 'l14', title: 'Count Inversions', difficulty: 'Hard', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-inversions/' },
      { id: 'l15', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      // Matrix
      { id: 'l16', title: 'Spiral Traversal of Matrix', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/spiral-matrix/' },
      { id: 'l17', title: 'Search in 2D Matrix', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      { id: 'l18', title: 'Median in Row-wise Sorted Matrix', difficulty: 'Medium', topic: 'Matrix', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-median-row-wise-sorted-matrix/' },
      { id: 'l19', title: 'Rotate Matrix by 90', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/rotate-image/' },
      { id: 'l20', title: 'Kth Element in Matrix', difficulty: 'Hard', topic: 'Matrix', platform: 'gfg', link: 'https://www.geeksforgeeks.org/kth-smallest-element-in-a-row-wise-and-column-wise-sorted-2d-array-set-1/' },
      // String
      { id: 'l21', title: 'Reverse String', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-string/' },
      { id: 'l22', title: 'Check Palindrome', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: 'l23', title: 'Find Duplicate Characters', difficulty: 'Easy', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/print-all-the-duplicates-in-the-input-string/' },
      { id: 'l24', title: 'Check Rotation', difficulty: 'Easy', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/a-program-to-check-if-strings-are-rotations-of-each-other/' },
      { id: 'l25', title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      { id: 'l26', title: 'Print All Permutations', difficulty: 'Medium', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/write-a-c-program-to-print-all-permutations-of-a-given-string/' },
      { id: 'l27', title: 'Split Binary String', difficulty: 'Medium', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/split-the-binary-string-into-substrings-with-equal-number-of-0s-and-1s/' },
      { id: 'l28', title: 'Word Wrap Problem', difficulty: 'Medium', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/word-wrap-problem-dp-19/' },
      { id: 'l29', title: 'Edit Distance', difficulty: 'Hard', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/edit-distance/' },
      { id: 'l30', title: 'Next Permutation', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/next-permutation/' },
      // Searching & Sorting
      { id: 'l31', title: 'First and Last Position in Sorted Array', difficulty: 'Medium', topic: 'Searching', platform: 'leetcode', link: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' },
      { id: 'l32', title: 'Value Equal to Index', difficulty: 'Easy', topic: 'Searching', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-element-array-sum-left-array-equal-sum-right-array/' },
      { id: 'l33', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Searching', platform: 'leetcode', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: 'l34', title: 'Count Squares', difficulty: 'Easy', topic: 'Searching', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-squares/' },
      { id: 'l35', title: 'Middle of Three', difficulty: 'Easy', topic: 'Searching', platform: 'gfg', link: 'https://www.geeksforgeeks.org/middle-of-three/' },
      { id: 'l36', title: 'Optimum Location of Point', difficulty: 'Hard', topic: 'Searching', platform: 'gfg', link: 'https://www.geeksforgeeks.org/optimum-location-point-minimize-total-distance/' },
      { id: 'l37', title: 'Find Repeating Element', difficulty: 'Easy', topic: 'Searching', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-repetitive-element-1-n-1/' },
      { id: 'l38', title: 'Searching in Array Where Adjacent Differ', difficulty: 'Medium', topic: 'Searching', platform: 'gfg', link: 'https://www.geeksforgeeks.org/searching-array-adjacent-differ-k/' },
      { id: 'l39', title: 'Find Pair with Given Difference', difficulty: 'Easy', topic: 'Searching', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-pair-given-difference/' },
      { id: 'l40', title: 'Find All Four Sum Numbers', difficulty: 'Medium', topic: 'Searching', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-four-numbers-with-sum-equal-to-given-sum/' },
      // Linked List
      { id: 'l41', title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 'l42', title: 'Reverse in Groups', difficulty: 'Medium', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/reverse-a-list-in-groups-of-given-size/' },
      { id: 'l43', title: 'Detect Loop in Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/' },
      { id: 'l44', title: 'Remove Loop', difficulty: 'Medium', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/detect-and-remove-loop-in-a-linked-list/' },
      { id: 'l45', title: 'Find Starting Point of Loop', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/linked-list-cycle-ii/' },
      { id: 'l46', title: 'Delete Node without Head', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/delete-node-in-a-linked-list/' },
      { id: 'l47', title: 'Find Length of Loop', difficulty: 'Easy', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-length-of-loop-in-linked-list/' },
      { id: 'l48', title: 'Segregate Even and Odd Nodes', difficulty: 'Easy', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/segregate-even-and-odd-elements-in-a-linked-list/' },
      { id: 'l49', title: 'Remove Duplicates from Sorted LL', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list/' },
      { id: 'l50', title: 'Remove Duplicates from Unsorted LL', difficulty: 'Medium', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/remove-duplicates-from-an-unsorted-linked-list/' },
      // Binary Trees
      { id: 'l51', title: 'Level Order Traversal', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { id: 'l52', title: 'Reverse Level Order Traversal', difficulty: 'Easy', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/reverse-level-order-traversal/' },
      { id: 'l53', title: 'Height of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: 'l54', title: 'Diameter of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
      { id: 'l55', title: 'Mirror of Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/create-a-mirror-tree-from-the-given-binary-tree/' },
      { id: 'l56', title: 'Inorder Traversal (Iterative)', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
      { id: 'l57', title: 'Preorder Traversal (Iterative)', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-preorder-traversal/' },
      { id: 'l58', title: 'Postorder Traversal (Iterative)', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-postorder-traversal/' },
      { id: 'l59', title: 'Left View of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/print-left-view-binary-tree/' },
      { id: 'l60', title: 'Right View of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/print-right-view-binary-tree-2/' },
      // BST
      { id: 'l61', title: 'Find Min and Max in BST', difficulty: 'Easy', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-the-minimum-element-in-a-binary-search-tree/' },
      { id: 'l62', title: 'Check if Binary Tree is BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { id: 'l63', title: 'Delete Node in BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/delete-node-in-a-bst/' },
      { id: 'l64', title: 'Find Inorder Successor', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/inorder-successor-in-binary-search-tree/' },
      { id: 'l65', title: 'Find Inorder Predecessor', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/inorder-predecessor-successor-given-key-bst/' },
      { id: 'l66', title: 'Check for Dead End in BST', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/check-whether-bst-contains-dead-end-not/' },
      { id: 'l67', title: 'Largest BST in Binary Tree', difficulty: 'Hard', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/largest-bst-binary-tree-set-2/' },
      { id: 'l68', title: 'Flatten BST to Sorted List', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/flatten-bst-to-sorted-list-increasing-order/' },
      { id: 'l69', title: 'Find Kth Largest in BST', difficulty: 'Easy', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/kth-largest-element-in-bst-when-modification-to-bst-is-not-allowed/' },
      { id: 'l70', title: 'Count Pairs with Given Sum', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-pairs-from-two-bsts-whose-sum-is-equal-to-given-value-x/' },
      // Greedy
      { id: 'l71', title: 'Activity Selection Problem', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/' },
      { id: 'l72', title: 'Job Sequencing Problem', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/job-sequencing-problem/' },
      { id: 'l73', title: 'Huffman Coding', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/huffman-coding-greedy-algo-3/' },
      { id: 'l74', title: 'Water Connection Problem', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/water-connection-problem/' },
      { id: 'l75', title: 'Fractional Knapsack', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/fractional-knapsack-problem/' },
      { id: 'l76', title: 'Greedy Algorithm to Find Min Coins', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/greedy-algorithm-to-find-minimum-number-of-coins/' },
      { id: 'l77', title: 'Maximum Trains Stoppage', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/maximum-trains-stoppage-can-provided/' },
      { id: 'l78', title: 'Minimum Platforms', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-number-platforms-required-railwaybus-station/' },
      { id: 'l79', title: 'Buy Maximum Stocks', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/buy-maximum-stocks-stocks-can-bought-day/' },
      { id: 'l80', title: 'Find Maximum Meetings', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-maximum-meetings-in-one-room/' },
      // Backtracking
      { id: 'l81', title: 'Rat in a Maze', difficulty: 'Medium', topic: 'Backtracking', platform: 'gfg', link: 'https://www.geeksforgeeks.org/rat-in-a-maze-backtracking-2/' },
      { id: 'l82', title: 'N-Queen Problem', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/n-queens/' },
      { id: 'l83', title: 'Word Break Problem', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/word-break/' },
      { id: 'l84', title: 'Remove Invalid Parentheses', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-invalid-parentheses/' },
      { id: 'l85', title: 'Sudoku Solver', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/sudoku-solver/' },
      { id: 'l86', title: 'M Coloring Problem', difficulty: 'Hard', topic: 'Backtracking', platform: 'gfg', link: 'https://www.geeksforgeeks.org/m-coloring-problem-backtracking-5/' },
      { id: 'l87', title: 'Print All Palindromic Partitions', difficulty: 'Medium', topic: 'Backtracking', platform: 'gfg', link: 'https://www.geeksforgeeks.org/given-a-string-print-all-possible-palindromic-partition/' },
      { id: 'l88', title: 'Subset Sum Problem', difficulty: 'Medium', topic: 'Backtracking', platform: 'gfg', link: 'https://www.geeksforgeeks.org/subset-sum-backtracking-4/' },
      { id: 'l89', title: 'Find Shortest Safe Route', difficulty: 'Hard', topic: 'Backtracking', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-shortest-safe-route-in-a-path-with-landmines/' },
      { id: 'l90', title: 'Combinational Sum', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/combination-sum/' },
      // Stacks and Queues
      { id: 'l91', title: 'Implement Stack Using Arrays', difficulty: 'Easy', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/stack-data-structure-introduction-program/' },
      { id: 'l92', title: 'Implement Queue Using Arrays', difficulty: 'Easy', topic: 'Queue', platform: 'gfg', link: 'https://www.geeksforgeeks.org/queue-set-1introduction-and-array-implementation/' },
      { id: 'l93', title: 'Implement Stack Using Queue', difficulty: 'Easy', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-stack-using-queues/' },
      { id: 'l94', title: 'Implement Queue Using Stack', difficulty: 'Easy', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
      { id: 'l95', title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: 'l96', title: 'Next Greater Element', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/next-greater-element-i/' },
      { id: 'l97', title: 'The Celebrity Problem', difficulty: 'Medium', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/the-celebrity-problem/' },
      { id: 'l98', title: 'LRU Cache Implementation', difficulty: 'Hard', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/lru-cache/' },
      { id: 'l99', title: 'Reverse String Using Stack', difficulty: 'Easy', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/stack-set-3-reverse-string-using-stack/' },
      { id: 'l100', title: 'Design Stack with Get Min', difficulty: 'Easy', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/min-stack/' },
      // Heaps
      { id: 'l101', title: 'Implement Min Heap', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/binary-heap/' },
      { id: 'l102', title: 'Implement Max Heap', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/max-heap-in-java/' },
      { id: 'l103', title: 'Kth Largest Element', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { id: 'l104', title: 'Kth Smallest Element', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/kth-smallestlargest-element-unsorted-array/' },
      { id: 'l105', title: 'Merge K Sorted Arrays', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/merge-k-sorted-arrays/' },
      { id: 'l106', title: 'Median in a Stream', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/find-median-from-data-stream/' },
      { id: 'l107', title: 'Check Min Heap', difficulty: 'Easy', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/how-to-check-if-a-given-array-represents-a-binary-heap/' },
      { id: 'l108', title: 'Connect n Ropes with Min Cost', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/connect-n-ropes-minimum-cost/' },
      { id: 'l109', title: 'Convert BST to Min Heap', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/convert-bst-min-heap/' },
      { id: 'l110', title: 'Convert Min Heap to Max Heap', difficulty: 'Easy', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/convert-min-heap-to-max-heap/' },
      // Graph
      { id: 'l111', title: 'BFS Traversal', difficulty: 'Easy', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/' },
      { id: 'l112', title: 'DFS Traversal', difficulty: 'Easy', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/' },
      { id: 'l113', title: 'Detect Cycle in Directed Graph', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/detect-cycle-in-a-graph/' },
      { id: 'l114', title: 'Detect Cycle in Undirected Graph', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/detect-cycle-undirected-graph/' },
      { id: 'l115', title: 'Search in Maze', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/rat-in-a-maze/' },
      { id: 'l116', title: 'Minimum Step by Knight', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-steps-reach-target-knight/' },
      { id: 'l117', title: 'Flood Fill Algorithm', difficulty: 'Easy', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/flood-fill/' },
      { id: 'l118', title: 'Clone a Graph', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/clone-graph/' },
      { id: 'l119', title: 'Making Wired Connections', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-operations-to-make-network-connected/' },
      { id: 'l120', title: 'Word Ladder', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/word-ladder/' },
      // Dynamic Programming
      { id: 'l121', title: 'Coin Change Problem', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/coin-change/' },
      { id: 'l122', title: '0-1 Knapsack', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/' },
      { id: 'l123', title: 'Longest Increasing Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { id: 'l124', title: 'Longest Common Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { id: 'l125', title: 'Edit Distance', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/edit-distance/' },
      { id: 'l126', title: 'Minimum Partition', difficulty: 'Hard', topic: 'DP', platform: 'gfg', link: 'https://www.geeksforgeeks.org/partition-a-set-into-two-subsets-such-that-the-difference-of-subset-sums-is-minimum/' },
      { id: 'l127', title: 'Count Ways to Reach Nth Stair', difficulty: 'Easy', topic: 'DP', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-ways-reach-nth-stair/' },
      { id: 'l128', title: 'Maximum Sum Increasing Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://www.geeksforgeeks.org/maximum-sum-increasing-subsequence-dp-14/' },
      { id: 'l129', title: 'Matrix Chain Multiplication', difficulty: 'Hard', topic: 'DP', platform: 'gfg', link: 'https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/' },
      { id: 'l130', title: 'Palindrome Partitioning', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/palindrome-partitioning-ii/' },
      // Bit Manipulation
      { id: 'l131', title: 'Count Set Bits', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-set-bits-in-an-integer/' },
      { id: 'l132', title: 'Find Two Non-Repeating Elements', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-two-non-repeating-elements-in-an-array-of-repeating-elements/' },
      { id: 'l133', title: 'Count Number of Bits to Flip', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-number-of-bits-to-be-flipped-to-convert-a-to-b/' },
      { id: 'l134', title: 'Find Position of Set Bit', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-position-of-the-only-set-bit/' },
      { id: 'l135', title: 'Copy Set Bits in Range', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'gfg', link: 'https://www.geeksforgeeks.org/copy-set-bits-in-a-range/' },
      { id: 'l136', title: 'Divide Two Integers', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/divide-two-integers/' },
      { id: 'l137', title: 'Power Set Using Bit', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'gfg', link: 'https://www.geeksforgeeks.org/power-set/' },
      { id: 'l138', title: 'Find XOR from 1 to N', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-xor-of-numbers-from-the-range-l-r/' },
      { id: 'l139', title: 'Find Missing Number', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/missing-number/' },
      { id: 'l140', title: 'Square of Number Without Multiply', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'gfg', link: 'https://www.geeksforgeeks.org/calculate-square-of-a-number-without-using-multiplication-operator/' },
      // Trie
      { id: 'l141', title: 'Construct Trie from Scratch', difficulty: 'Medium', topic: 'Trie', platform: 'gfg', link: 'https://www.geeksforgeeks.org/trie-insert-and-search/' },
      { id: 'l142', title: 'Count Distinct Substrings', difficulty: 'Hard', topic: 'Trie', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-distinct-substrings-string-using-suffix-trie/' },
      { id: 'l143', title: 'Print Unique Rows in Boolean Matrix', difficulty: 'Medium', topic: 'Trie', platform: 'gfg', link: 'https://www.geeksforgeeks.org/print-unique-rows/' },
      { id: 'l144', title: 'Implement Phone Directory', difficulty: 'Medium', topic: 'Trie', platform: 'gfg', link: 'https://www.geeksforgeeks.org/implement-a-phone-directory/' },
      { id: 'l145', title: 'Print Anagrams Together', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/group-anagrams/' },
      { id: 'l146', title: 'Word Break Trie', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/word-break/' },
      { id: 'l147', title: 'Given String Can Be Segmented', difficulty: 'Medium', topic: 'Trie', platform: 'gfg', link: 'https://www.geeksforgeeks.org/word-break-problem-dp-32/' },
      { id: 'l148', title: 'Find Shortest Unique Prefix', difficulty: 'Medium', topic: 'Trie', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-all-shortest-unique-prefixes-to-represent-each-word-in-a-given-list/' },
      { id: 'l149', title: 'Boggle Game', difficulty: 'Hard', topic: 'Trie', platform: 'gfg', link: 'https://www.geeksforgeeks.org/boggle-find-possible-words-board-characters/' },
      { id: 'l150', title: 'Longest Common Prefix', difficulty: 'Easy', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-common-prefix/' },
      // Segment Tree
      { id: 'l151', title: 'Build Segment Tree', difficulty: 'Hard', topic: 'Segment Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/segment-tree-set-1-sum-of-given-range/' },
      { id: 'l152', title: 'Range Minimum Query', difficulty: 'Hard', topic: 'Segment Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/segment-tree-set-1-range-minimum-query/' },
      { id: 'l153', title: 'Lazy Propagation', difficulty: 'Hard', topic: 'Segment Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/lazy-propagation-in-segment-tree/' },
      { id: 'l154', title: 'Range Sum Query Mutable', difficulty: 'Medium', topic: 'Segment Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/range-sum-query-mutable/' },
      { id: 'l155', title: 'Count Inversions Using Segment Tree', difficulty: 'Hard', topic: 'Segment Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/counting-inversions-using-segment-tree/' },
      // Binary Indexed Tree
      { id: 'l156', title: 'Binary Indexed Tree (Fenwick Tree)', difficulty: 'Hard', topic: 'BIT', platform: 'gfg', link: 'https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/' },
      { id: 'l157', title: 'Range Sum Query Using BIT', difficulty: 'Medium', topic: 'BIT', platform: 'gfg', link: 'https://www.geeksforgeeks.org/binary-indexed-tree-range-updates-point-queries/' },
      { id: 'l158', title: 'Count Inversions Using BIT', difficulty: 'Hard', topic: 'BIT', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-inversions-array-set-3-using-bit/' },
      { id: 'l159', title: '2D Binary Indexed Tree', difficulty: 'Hard', topic: 'BIT', platform: 'gfg', link: 'https://www.geeksforgeeks.org/two-dimensional-binary-indexed-tree-or-fenwick-tree/' },
      { id: 'l160', title: 'Range Update Query BIT', difficulty: 'Hard', topic: 'BIT', platform: 'gfg', link: 'https://www.geeksforgeeks.org/binary-indexed-tree-range-update-range-queries/' },
      // Disjoint Set Union
      { id: 'l161', title: 'Disjoint Set Union', difficulty: 'Medium', topic: 'DSU', platform: 'gfg', link: 'https://www.geeksforgeeks.org/union-find/' },
      { id: 'l162', title: 'Detect Cycle Using DSU', difficulty: 'Medium', topic: 'DSU', platform: 'gfg', link: 'https://www.geeksforgeeks.org/union-find-algorithm-set-2-union-by-rank/' },
      { id: 'l163', title: 'Find Number of Islands', difficulty: 'Medium', topic: 'DSU', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-islands/' },
      { id: 'l164', title: 'MST Using Kruskal Algorithm', difficulty: 'Medium', topic: 'DSU', platform: 'gfg', link: 'https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/' },
      { id: 'l165', title: 'Job Sequencing Using DSU', difficulty: 'Medium', topic: 'DSU', platform: 'gfg', link: 'https://www.geeksforgeeks.org/job-sequencing-using-disjoint-set-union/' },
      // Advanced Graph
      { id: 'l166', title: 'Dijkstra Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/' },
      { id: 'l167', title: 'Bellman Ford Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/' },
      { id: 'l168', title: 'Floyd Warshall Algorithm', difficulty: 'Hard', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/' },
      { id: 'l169', title: 'Topological Sort Using DFS', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/topological-sorting/' },
      { id: 'l170', title: 'Topological Sort Using Kahn Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/' },
      { id: 'l171', title: 'Prim\'s MST Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/' },
      { id: 'l172', title: 'Kruskal MST Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/' },
      { id: 'l173', title: 'Bridges in Graph', difficulty: 'Hard', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/bridge-in-a-graph/' },
      { id: 'l174', title: 'Articulation Points', difficulty: 'Hard', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/articulation-points-or-cut-vertices-in-a-graph/' },
      { id: 'l175', title: 'Kosaraju Algorithm', difficulty: 'Hard', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/strongly-connected-components/' },
      { id: 'l176', title: 'Travelling Salesman Problem', difficulty: 'Hard', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/travelling-salesman-problem-set-1/' },
      { id: 'l177', title: 'Graph Coloring Problem', difficulty: 'Hard', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/graph-coloring-applications/' },
      { id: 'l178', title: 'Snake and Ladder Problem', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/snake-ladder-problem-2/' },
      { id: 'l179', title: 'Minimum Time Taken by Each Job', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-time-taken-by-each-job-to-be-completed-given-by-a-directed-acyclic-graph/' },
      { id: 'l180', title: 'Find Whether Path Exists', difficulty: 'Easy', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-if-there-is-a-path-between-two-vertices-in-a-given-graph/' },
      // Advanced DP
      { id: 'l181', title: 'Longest Palindromic Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-palindromic-subsequence/' },
      { id: 'l182', title: 'Count Palindromic Subsequences', difficulty: 'Hard', topic: 'DP', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-palindromic-subsequence-given-string/' },
      { id: 'l183', title: 'Longest Repeating Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://www.geeksforgeeks.org/longest-repeating-subsequence/' },
      { id: 'l184', title: 'Sequence Pattern Matching', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-if-string-is-k-palindrome-or-not/' },
      { id: 'l185', title: 'Minimum Deletions Palindrome', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-number-deletions-make-string-palindrome/' },
      { id: 'l186', title: 'Shortest Common Supersequence', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/shortest-common-supersequence/' },
      { id: 'l187', title: 'Distinct Subsequences', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/distinct-subsequences/' },
      { id: 'l188', title: 'Longest String Chain', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-string-chain/' },
      { id: 'l189', title: 'Maximum Profit in Job Scheduling', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-profit-in-job-scheduling/' },
      { id: 'l190', title: 'Palindrome Partitioning II', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/palindrome-partitioning-ii/' },
      { id: 'l191', title: 'Word Break II', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/word-break-ii/' },
      { id: 'l192', title: 'Decode Ways II', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/decode-ways-ii/' },
      { id: 'l193', title: 'Best Time to Buy Sell Stock III', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/' },
      { id: 'l194', title: 'Best Time to Buy Sell Stock IV', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/' },
      { id: 'l195', title: 'Burst Balloons', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/burst-balloons/' },
      { id: 'l196', title: 'Evaluate Expression', difficulty: 'Hard', topic: 'DP', platform: 'gfg', link: 'https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/' },
      { id: 'l197', title: 'Scramble String', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/scramble-string/' },
      { id: 'l198', title: 'Egg Drop Problem', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/super-egg-drop/' },
      { id: 'l199', title: 'Boolean Parenthesization', difficulty: 'Hard', topic: 'DP', platform: 'gfg', link: 'https://www.geeksforgeeks.org/boolean-parenthesization-problem-dp-37/' },
      { id: 'l200', title: 'Largest Square in Matrix', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/maximal-square/' },
      // Additional Arrays
      { id: 'l201', title: 'Count Pairs with Given Sum', difficulty: 'Easy', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-pairs-with-given-sum/' },
      { id: 'l202', title: 'Find All Duplicates', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/' },
      { id: 'l203', title: 'Product of Array Except Self', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { id: 'l204', title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/trapping-rain-water/' },
      { id: 'l205', title: 'Chocolate Distribution', difficulty: 'Easy', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/chocolate-distribution-problem/' },
      { id: 'l206', title: 'Smallest Subarray with Sum Greater', difficulty: 'Medium', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-length-subarray-sum-greater-given-value/' },
      { id: 'l207', title: 'Three Way Partitioning', difficulty: 'Easy', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/three-way-partitioning-of-an-array-around-a-given-range/' },
      { id: 'l208', title: 'Minimum Swaps to Sort', difficulty: 'Medium', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-number-swaps-required-sort-array/' },
      { id: 'l209', title: 'Bishu and Soldiers', difficulty: 'Easy', topic: 'Arrays', platform: 'gfg', link: 'https://www.hackerearth.com/practice/algorithms/searching/binary-search/practice-problems/algorithm/bishu-and-soldiers/' },
      { id: 'l210', title: 'Rasta and Kheshtak', difficulty: 'Medium', topic: 'Arrays', platform: 'gfg', link: 'https://www.hackerearth.com/practice/data-structures/arrays/1-d/practice-problems/' },
      // Additional Strings
      { id: 'l211', title: 'KMP Algorithm Implementation', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/' },
      { id: 'l212', title: 'Z Algorithm Implementation', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/z-algorithm-linear-time-pattern-searching-algorithm/' },
      { id: 'l213', title: 'Rabin Karp Algorithm', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/rabin-karp-algorithm-for-pattern-searching/' },
      { id: 'l214', title: 'Convert String to Integer', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/string-to-integer-atoi/' },
      { id: 'l215', title: 'Strstr Implementation', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-strstr/' },
      { id: 'l216', title: 'Longest Prefix Suffix', difficulty: 'Medium', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/length-of-the-longest-valid-substring/' },
      { id: 'l217', title: 'Smallest Window Containing Pattern', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-the-smallest-window-in-a-string-containing-all-characters-of-another-string/' },
      { id: 'l218', title: 'First Unique Character', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/first-unique-character-in-a-string/' },
      { id: 'l219', title: 'Minimum Bracket Reversals', difficulty: 'Medium', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-number-of-bracket-reversals-needed-to-make-an-expression-balanced/' },
      { id: 'l220', title: 'Minimum Characters for Palindrome', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-characters-added-front-make-string-palindrome/' },
      // More Matrix Problems
      { id: 'l221', title: 'Boolean Matrix Problem', difficulty: 'Medium', topic: 'Matrix', platform: 'gfg', link: 'https://www.geeksforgeeks.org/a-boolean-matrix-question/' },
      { id: 'l222', title: 'Print Elements in Sorted Order', difficulty: 'Medium', topic: 'Matrix', platform: 'gfg', link: 'https://www.geeksforgeeks.org/print-elements-sorted-order-row-column-wise-sorted-matrix/' },
      { id: 'l223', title: 'Maximum Size Rectangle', difficulty: 'Hard', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/maximal-rectangle/' },
      { id: 'l224', title: 'Find Specific Pair in Matrix', difficulty: 'Medium', topic: 'Matrix', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-a-specific-pair-in-matrix/' },
      { id: 'l225', title: 'Rotate Matrix Elements', difficulty: 'Medium', topic: 'Matrix', platform: 'gfg', link: 'https://www.geeksforgeeks.org/rotate-matrix-elements/' },
      { id: 'l226', title: 'Print in Diagonal Pattern', difficulty: 'Easy', topic: 'Matrix', platform: 'gfg', link: 'https://www.geeksforgeeks.org/print-matrix-diagonal-pattern/' },
      { id: 'l227', title: 'Sorted Matrix Search', difficulty: 'Medium', topic: 'Matrix', platform: 'gfg', link: 'https://www.geeksforgeeks.org/search-in-row-wise-and-column-wise-sorted-matrix/' },
      { id: 'l228', title: 'Count Islands in Matrix', difficulty: 'Medium', topic: 'Matrix', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-number-of-islands/' },
      { id: 'l229', title: 'Maximum Path Sum', difficulty: 'Medium', topic: 'Matrix', platform: 'gfg', link: 'https://www.geeksforgeeks.org/maximum-path-sum-matrix/' },
      { id: 'l230', title: 'Minimum Cost Path', difficulty: 'Medium', topic: 'Matrix', platform: 'gfg', link: 'https://www.geeksforgeeks.org/min-cost-path-dp-6/' },
      // More Searching & Sorting
      { id: 'l231', title: 'Majority Element II', difficulty: 'Medium', topic: 'Searching', platform: 'leetcode', link: 'https://leetcode.com/problems/majority-element-ii/' },
      { id: 'l232', title: 'Find Peak Element', difficulty: 'Medium', topic: 'Searching', platform: 'leetcode', link: 'https://leetcode.com/problems/find-peak-element/' },
      { id: 'l233', title: 'Print 2D Array in Spiral', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/spiral-matrix/' },
      { id: 'l234', title: 'Search in Matrix', difficulty: 'Medium', topic: 'Searching', platform: 'leetcode', link: 'https://leetcode.com/problems/search-a-2d-matrix-ii/' },
      { id: 'l235', title: 'Allocate Books', difficulty: 'Hard', topic: 'Searching', platform: 'gfg', link: 'https://www.geeksforgeeks.org/allocate-minimum-number-pages/' },
      { id: 'l236', title: 'Painters Partition', difficulty: 'Hard', topic: 'Searching', platform: 'gfg', link: 'https://www.geeksforgeeks.org/painters-partition-problem/' },
      { id: 'l237', title: 'EKOSPOJ Problem', difficulty: 'Medium', topic: 'Searching', platform: 'spoj', link: 'https://www.spoj.com/problems/EKO/' },
      { id: 'l238', title: 'Job Scheduling Algo', difficulty: 'Medium', topic: 'Sorting', platform: 'gfg', link: 'https://www.geeksforgeeks.org/weighted-job-scheduling/' },
      { id: 'l239', title: 'Missing Number in AP', difficulty: 'Easy', topic: 'Searching', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-missing-number-arithmetic-progression/' },
      { id: 'l240', title: 'Smallest Factorial Number', difficulty: 'Medium', topic: 'Searching', platform: 'gfg', link: 'https://www.geeksforgeeks.org/smallest-number-whose-factorial-contains-at-least-n-trailing-zeroes/' },
      // More Linked List
      { id: 'l241', title: 'Move Last Element to Front', difficulty: 'Easy', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/move-last-element-to-front-of-a-given-linked-list/' },
      { id: 'l242', title: 'Pairwise Swap Elements', difficulty: 'Easy', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/pairwise-swap-elements-of-a-given-linked-list/' },
      { id: 'l243', title: 'Find Intersection Point', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/intersection-of-two-linked-lists/' },
      { id: 'l244', title: 'QuickSort on Linked List', difficulty: 'Medium', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/quicksort-on-singly-linked-list/' },
      { id: 'l245', title: 'Find Pairs with Given Sum DLL', difficulty: 'Medium', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-pairs-given-sum-doubly-linked-list/' },
      { id: 'l246', title: 'Count Triplets in Sorted DLL', difficulty: 'Medium', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-triplets-sorted-doubly-linked-list-whose-sum-equal-given-value-x/' },
      { id: 'l247', title: 'Sort K Sorted Doubly LL', difficulty: 'Medium', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/sort-k-sorted-doubly-linked-list/' },
      { id: 'l248', title: 'Rotate Doubly LL by N', difficulty: 'Easy', topic: 'Linked List', platform: 'gfg', link: 'https://www.geeksforgeeks.org/rotate-doubly-linked-list-n-nodes/' },
      { id: 'l249', title: 'Rotate LL by K', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/rotate-list/' },
      { id: 'l250', title: 'Clone LL with Random Pointer', difficulty: 'Hard', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
      // More Binary Tree
      { id: 'l251', title: 'Check for Children Sum Property', difficulty: 'Easy', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/check-for-children-sum-property-in-a-binary-tree/' },
      { id: 'l252', title: 'Check if Tree is Isomorphic', difficulty: 'Easy', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/tree-isomorphism-problem/' },
      { id: 'l253', title: 'Transform to Sum Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/convert-a-given-tree-to-sum-tree/' },
      { id: 'l254', title: 'Check if Tree is Balanced', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/balanced-binary-tree/' },
      { id: 'l255', title: 'Diagonal Traversal', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/diagonal-traversal-of-binary-tree/' },
      { id: 'l256', title: 'Check if All Leaf at Same Level', difficulty: 'Easy', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/check-leaves-level/' },
      { id: 'l257', title: 'Check if Tree is Complete', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/check-if-a-given-binary-tree-is-complete-tree-or-not/' },
      { id: 'l258', title: 'Sum of Longest Path', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-the-maximum-sum-path-in-a-binary-tree/' },
      { id: 'l259', title: 'Print All K Sum Paths', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/print-k-sum-paths-binary-tree/' },
      { id: 'l260', title: 'Find LCA in Binary Tree', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
      // More BST
      { id: 'l261', title: 'Populate Inorder Successor', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/populate-inorder-successor-for-all-nodes/' },
      { id: 'l262', title: 'Find Kth Smallest', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
      { id: 'l263', title: 'Brother Nodes', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/print-cousins-of-a-given-node-in-binary-tree/' },
      { id: 'l264', title: 'Sum of K Smallest Elements', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/sum-k-smallest-elements-bst/' },
      { id: 'l265', title: 'Merge Two BSTs', difficulty: 'Hard', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/merge-two-balanced-binary-search-trees/' },
      { id: 'l266', title: 'Binary Tree to BST', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/binary-tree-to-binary-search-tree-conversion/' },
      { id: 'l267', title: 'Normal BST to Balanced', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/convert-normal-bst-balanced-bst/' },
      { id: 'l268', title: 'Preorder to Postorder', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/construct-bst-from-given-preorder-traversa/' },
      { id: 'l269', title: 'Check Preorder is Valid', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/check-if-a-given-array-can-represent-preorder-traversal-of-binary-search-tree/' },
      { id: 'l270', title: 'Count BST Nodes in Range', difficulty: 'Easy', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-bst-nodes-that-are-in-a-given-range/' },
      // Additional Stack Queue
      { id: 'l271', title: 'Next Smaller Element', difficulty: 'Medium', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/next-smaller-element/' },
      { id: 'l272', title: 'The Stock Span Problem', difficulty: 'Medium', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/the-stock-span-problem/' },
      { id: 'l273', title: 'Maximum Rectangle Area', difficulty: 'Hard', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
      { id: 'l274', title: 'Length of Longest Valid Substring', difficulty: 'Hard', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-valid-parentheses/' },
      { id: 'l275', title: 'Expression Contains Redundant', difficulty: 'Medium', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/expression-contains-redundant-bracket-not/' },
      { id: 'l276', title: 'Implement Stack Using Deque', difficulty: 'Easy', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/implement-stack-queue-using-deque/' },
      { id: 'l277', title: 'Stack Permutations', difficulty: 'Medium', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/stack-permutations-check-if-an-array-is-stack-permutation-of-other/' },
      { id: 'l278', title: 'Implement Queue Using Stack', difficulty: 'Easy', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
      { id: 'l279', title: 'Implement n Stacks in Array', difficulty: 'Hard', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/efficiently-implement-k-stacks-single-array/' },
      { id: 'l280', title: 'Reverse First K Elements', difficulty: 'Easy', topic: 'Queue', platform: 'gfg', link: 'https://www.geeksforgeeks.org/reversing-first-k-elements-queue/' },
      // More Heaps
      { id: 'l281', title: 'K Most Frequent Elements', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { id: 'l282', title: 'Sort Nearly K Sorted', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/nearly-sorted-algorithm/' },
      { id: 'l283', title: 'K Closest Numbers', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-k-closest-elements-given-value/' },
      { id: 'l284', title: 'Find Median in Stream', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/find-median-from-data-stream/' },
      { id: 'l285', title: 'Reorganize String', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/reorganize-string/' },
      { id: 'l286', title: 'Minimum Cost of Ropes', difficulty: 'Easy', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/connect-n-ropes-minimum-cost/' },
      { id: 'l287', title: 'Kth Smallest in Unsorted', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/kth-smallestlargest-element-unsorted-array/' },
      { id: 'l288', title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: 'l289', title: 'Smallest Range in K Lists', difficulty: 'Hard', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-smallest-range-containing-elements-from-k-lists/' },
      { id: 'l290', title: 'Huffman Encoding', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/huffman-coding-greedy-algo-3/' },
      // More Greedy
      { id: 'l291', title: 'N Meetings in One Room', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-maximum-meetings-in-one-room/' },
      { id: 'l292', title: 'Shop in Candy Store', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/shop-in-candy-store/' },
      { id: 'l293', title: 'Check if Reversing Subarray', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/check-reversing-sub-array-make-array-sorted/' },
      { id: 'l294', title: 'Minimum Sum of Product', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-sum-product-two-arrays/' },
      { id: 'l295', title: 'Maximize Array Sum', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/maximize-array-sum-after-k-negations-set-1/' },
      { id: 'l296', title: 'Maximum Product Subset', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/maximum-product-subset-array/' },
      { id: 'l297', title: 'Maximize Sum After K Negations', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/maximize-array-sum-after-k-negations-set-2/' },
      { id: 'l298', title: 'Minimum Cost to Cut Board', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-cost-cut-board-squares/' },
      { id: 'l299', title: 'Check if String Can Become Equal', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/check-if-two-strings-can-be-made-equal-by-reversing-substring-of-equal-length-from-both-strings/' },
      { id: 'l300', title: 'Minimum Cost of Ropes', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/connect-n-ropes-minimum-cost/' },
      // More Backtracking
      { id: 'l301', title: 'Find Unique Binary String', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/find-unique-binary-string/' },
      { id: 'l302', title: 'Letter Case Permutation', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/letter-case-permutation/' },
      { id: 'l303', title: 'Find Kth Bit in Nth Binary String', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/find-kth-bit-in-nth-binary-string/' },
      { id: 'l304', title: 'Count Number of Maximum Bitwise-OR', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets/' },
      { id: 'l305', title: 'Fair Distribution of Cookies', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/fair-distribution-of-cookies/' },
      { id: 'l306', title: 'Maximum Compatibility Score Sum', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-compatibility-score-sum/' },
      { id: 'l307', title: 'Maximum Length of Concatenated String', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/' },
      { id: 'l308', title: 'Iterator for Combination', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/iterator-for-combination/' },
      { id: 'l309', title: 'Combination Sum III', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/combination-sum-iii/' },
      { id: 'l310', title: 'Factor Combinations', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/factor-combinations/' },
      // More Graph Advanced
      { id: 'l311', title: 'Critical Connections in Network', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/critical-connections-in-a-network/' },
      { id: 'l312', title: 'Path with Maximum Probability', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/path-with-maximum-probability/' },
      { id: 'l313', title: 'Find the City', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/' },
      { id: 'l314', title: 'Reconstruct Itinerary', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/reconstruct-itinerary/' },
      { id: 'l315', title: 'Network Delay Time', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/network-delay-time/' },
      { id: 'l316', title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },
      { id: 'l317', title: 'Minimum Cost to Reach Destination', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-cost-reach-destination-in-time/' },
      { id: 'l318', title: 'Count Unreachable Pairs of Nodes', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/count-unreachable-pairs-of-nodes-in-an-undirected-graph/' },
      { id: 'l319', title: 'Number of Operations to Make Connected', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-operations-to-make-network-connected/' },
      { id: 'l320', title: 'Reorder Routes to Lead to Zero', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/' },
      // More DP Advanced
      { id: 'l321', title: 'Stone Game', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/stone-game/' },
      { id: 'l322', title: 'Stone Game II', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/stone-game-ii/' },
      { id: 'l323', title: 'Stone Game III', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/stone-game-iii/' },
      { id: 'l324', title: 'Predict the Winner', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/predict-the-winner/' },
      { id: 'l325', title: 'Minimum Cost Tree From Leaf Values', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/' },
      { id: 'l326', title: 'Minimum Score Triangulation', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-score-triangulation-of-polygon/' },
      { id: 'l327', title: 'Number of Dice Rolls', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-dice-rolls-with-target-sum/' },
      { id: 'l328', title: 'Knight Dialer', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/knight-dialer/' },
      { id: 'l329', title: 'Out of Boundary Paths', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/out-of-boundary-paths/' },
      { id: 'l330', title: 'Knight Probability in Chessboard', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/knight-probability-in-chessboard/' },
      { id: 'l331', title: 'Profitable Schemes', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/profitable-schemes/' },
      { id: 'l332', title: 'Number of Ways to Form Target String', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/' },
      { id: 'l333', title: 'Minimum Difficulty of Job Schedule', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-difficulty-of-a-job-schedule/' },
      { id: 'l334', title: 'Number of Music Playlists', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-music-playlists/' },
      { id: 'l335', title: 'Pizza With 3n Slices', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/pizza-with-3n-slices/' },
      { id: 'l336', title: 'Minimum Number of Refueling Stops', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-number-of-refueling-stops/' },
      { id: 'l337', title: 'Cherry Pickup', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/cherry-pickup/' },
      { id: 'l338', title: 'Cherry Pickup II', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/cherry-pickup-ii/' },
      { id: 'l339', title: 'Count Vowels Permutation', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/count-vowels-permutation/' },
      { id: 'l340', title: 'Number of Ways to Stay Same Place', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-ways-to-stay-in-the-same-place-after-some-steps/' },
      // More Arrays Advanced
      { id: 'l341', title: 'Longest Mountain in Array', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-mountain-in-array/' },
      { id: 'l342', title: 'Maximum Length of Subarray with Positive Product', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product/' },
      { id: 'l343', title: 'Find All Duplicates in Array', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/' },
      { id: 'l344', title: 'Set Mismatch', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/set-mismatch/' },
      { id: 'l345', title: 'Third Maximum Number', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/third-maximum-number/' },
      { id: 'l346', title: 'Can Place Flowers', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/can-place-flowers/' },
      { id: 'l347', title: 'Max Consecutive Ones III', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/max-consecutive-ones-iii/' },
      { id: 'l348', title: 'Longest Turbulent Subarray', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-turbulent-subarray/' },
      { id: 'l349', title: 'Subarray Product Less Than K', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/subarray-product-less-than-k/' },
      { id: 'l350', title: 'Maximum Sum Circular Subarray', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-sum-circular-subarray/' },
      // More Strings Advanced
      { id: 'l351', title: 'Repeated Substring Pattern', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/repeated-substring-pattern/' },
      { id: 'l352', title: 'Longest Happy String', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-happy-string/' },
      { id: 'l353', title: 'String Without AAA or BBB', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/string-without-aaa-or-bbb/' },
      { id: 'l354', title: 'Construct K Palindrome Strings', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/construct-k-palindrome-strings/' },
      { id: 'l355', title: 'Make String Great', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/make-the-string-great/' },
      { id: 'l356', title: 'Number of Substrings with Only 1s', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/count-number-of-homogenous-substrings/' },
      { id: 'l357', title: 'Minimum Deletions to Make String Balanced', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-deletions-to-make-string-balanced/' },
      { id: 'l358', title: 'Minimum Changes to Make Alternating', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-changes-to-make-alternating-binary-string/' },
      { id: 'l359', title: 'Check If Two String Arrays Equivalent', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/check-if-two-string-arrays-are-equivalent/' },
      { id: 'l360', title: 'String Matching in Array', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/string-matching-in-an-array/' },
      // More Linked List Advanced
      { id: 'l361', title: 'Odd Even Linked List', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/odd-even-linked-list/' },
      { id: 'l362', title: 'Plus One Linked List', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/plus-one-linked-list/' },
      { id: 'l363', title: 'Linked List Components', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/linked-list-components/' },
      { id: 'l364', title: 'Split Linked List in Parts', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/split-linked-list-in-parts/' },
      { id: 'l365', title: 'Delete N Nodes After M Nodes', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/delete-n-nodes-after-m-nodes-of-a-linked-list/' },
      { id: 'l366', title: 'Convert Binary Number in LL to Integer', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/' },
      { id: 'l367', title: 'Next Greater Node in LL', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/next-greater-node-in-linked-list/' },
      { id: 'l368', title: 'Remove Zero Sum Consecutive Nodes', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-zero-sum-consecutive-nodes-from-linked-list/' },
      { id: 'l369', title: 'Merge In Between Linked Lists', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-in-between-linked-lists/' },
      { id: 'l370', title: 'Swapping Nodes in Linked List', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/swapping-nodes-in-a-linked-list/' },
      // More Binary Tree Advanced
      { id: 'l371', title: 'Deepest Leaves Sum', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/deepest-leaves-sum/' },
      { id: 'l372', title: 'Find Bottom Left Tree Value', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/find-bottom-left-tree-value/' },
      { id: 'l373', title: 'Average of Levels in Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/average-of-levels-in-binary-tree/' },
      { id: 'l374', title: 'Most Frequent Subtree Sum', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/most-frequent-subtree-sum/' },
      { id: 'l375', title: 'Find Largest Value in Each Row', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/find-largest-value-in-each-tree-row/' },
      { id: 'l376', title: 'Add One Row to Tree', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/add-one-row-to-tree/' },
      { id: 'l377', title: 'Print Binary Tree', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/print-binary-tree/' },
      { id: 'l378', title: 'Trim Binary Search Tree', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/trim-a-binary-search-tree/' },
      { id: 'l379', title: 'Second Minimum Node in Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/second-minimum-node-in-a-binary-tree/' },
      { id: 'l380', title: 'Longest Univalue Path', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-univalue-path/' },
      // More BST Advanced
      { id: 'l381', title: 'Range Sum of BST', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/range-sum-of-bst/' },
      { id: 'l382', title: 'Minimum Absolute Difference in BST', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-absolute-difference-in-bst/' },
      { id: 'l383', title: 'Convert BST to Greater Tree', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/convert-bst-to-greater-tree/' },
      { id: 'l384', title: 'Two Sum IV - Input is BST', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/two-sum-iv-input-is-a-bst/' },
      { id: 'l385', title: 'All Elements in Two BSTs', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/all-elements-in-two-binary-search-trees/' },
      { id: 'l386', title: 'Balance BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/balance-a-binary-search-tree/' },
      { id: 'l387', title: 'Increasing Order Search Tree', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/increasing-order-search-tree/' },
      { id: 'l388', title: 'Recover Binary Search Tree', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/recover-binary-search-tree/' },
      { id: 'l389', title: 'Unique Binary Search Trees', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/unique-binary-search-trees/' },
      { id: 'l390', title: 'Unique Binary Search Trees II', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/unique-binary-search-trees-ii/' },
      // More Stack/Queue Advanced
      { id: 'l391', title: 'Online Stock Span', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/online-stock-span/' },
      { id: 'l392', title: 'Score of Parentheses', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/score-of-parentheses/' },
      { id: 'l393', title: 'Remove All Adjacent Duplicates', difficulty: 'Easy', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/' },
      { id: 'l394', title: 'Remove All Adjacent Duplicates II', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/' },
      { id: 'l395', title: 'Validate Stack Sequences', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/validate-stack-sequences/' },
      { id: 'l396', title: 'Number of Recent Calls', difficulty: 'Easy', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-recent-calls/' },
      { id: 'l397', title: 'Dota2 Senate', difficulty: 'Medium', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/dota2-senate/' },
      { id: 'l398', title: 'Reveal Cards in Increasing Order', difficulty: 'Medium', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/reveal-cards-in-increasing-order/' },
      { id: 'l399', title: 'Time Needed to Buy Tickets', difficulty: 'Easy', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/time-needed-to-buy-tickets/' },
      { id: 'l400', title: 'Design Circular Queue', difficulty: 'Medium', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/design-circular-queue/' },
      // More Heaps Advanced
      { id: 'l401', title: 'Last Stone Weight', difficulty: 'Easy', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/last-stone-weight/' },
      { id: 'l402', title: 'K Closest Points to Origin', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
      { id: 'l403', title: 'Kth Largest Element in Stream', difficulty: 'Easy', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
      { id: 'l404', title: 'Maximum Subsequence Score', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-subsequence-score/' },
      { id: 'l405', title: 'IPO', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/ipo/' },
      { id: 'l406', title: 'Find K Pairs with Smallest Sums', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/find-k-pairs-with-smallest-sums/' },
      { id: 'l407', title: 'Ugly Number II', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/ugly-number-ii/' },
      { id: 'l408', title: 'Super Ugly Number', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/super-ugly-number/' },
      { id: 'l409', title: 'Sliding Window Median', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/sliding-window-median/' },
      { id: 'l410', title: 'Distant Barcodes', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/distant-barcodes/' },
      // More Bit Manipulation
      { id: 'l411', title: 'Hamming Distance', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/hamming-distance/' },
      { id: 'l412', title: 'Total Hamming Distance', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/total-hamming-distance/' },
      { id: 'l413', title: 'Binary Watch', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-watch/' },
      { id: 'l414', title: 'Maximum XOR of Two Numbers', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/' },
      { id: 'l415', title: 'Concatenation of Consecutive Binary', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/concatenation-of-consecutive-binary-numbers/' },
      { id: 'l416', title: 'Decode XORed Array', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/decode-xored-array/' },
      { id: 'l417', title: 'XOR Operation in Array', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/xor-operation-in-an-array/' },
      { id: 'l418', title: 'Number Complement', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/number-complement/' },
      { id: 'l419', title: 'Convert to Base -2', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/convert-to-base-2/' },
      { id: 'l420', title: 'Minimum Flips to OR to K', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/' },
      // More Trie Advanced
      { id: 'l421', title: 'Stream of Characters', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/stream-of-characters/' },
      { id: 'l422', title: 'Design File System', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/design-file-system/' },
      { id: 'l423', title: 'Short Encoding of Words', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/short-encoding-of-words/' },
      { id: 'l424', title: 'Design In-Memory File System', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/design-in-memory-file-system/' },
      { id: 'l425', title: 'Maximum XOR With Element From Array', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-xor-with-an-element-from-array/' },
      { id: 'l426', title: 'Palindrome Pairs', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/palindrome-pairs/' },
      { id: 'l427', title: 'Design Search Autocomplete System', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/design-search-autocomplete-system/' },
      { id: 'l428', title: 'Word Squares', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/word-squares/' },
      { id: 'l429', title: 'Implement Magic Dictionary', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-magic-dictionary/' },
      { id: 'l430', title: 'Index Pairs of String', difficulty: 'Easy', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/index-pairs-of-a-string/' },
      // Additional Matrix
      { id: 'l431', title: 'Valid Sudoku', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-sudoku/' },
      { id: 'l432', title: 'Toeplitz Matrix', difficulty: 'Easy', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/toeplitz-matrix/' },
      { id: 'l433', title: 'Transpose Matrix', difficulty: 'Easy', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/transpose-matrix/' },
      { id: 'l434', title: 'Flipping an Image', difficulty: 'Easy', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/flipping-an-image/' },
      { id: 'l435', title: 'Lucky Numbers in Matrix', difficulty: 'Easy', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/lucky-numbers-in-a-matrix/' },
      { id: 'l436', title: 'Cells with Odd Values', difficulty: 'Easy', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/cells-with-odd-values-in-a-matrix/' },
      { id: 'l437', title: 'Check if Every Row and Column Contains', difficulty: 'Easy', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/check-if-every-row-and-column-contains-all-numbers/' },
      { id: 'l438', title: 'Diagonal Traverse', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/diagonal-traverse/' },
      { id: 'l439', title: 'Matrix Diagonal Sum', difficulty: 'Easy', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/matrix-diagonal-sum/' },
      { id: 'l440', title: 'Shift 2D Grid', difficulty: 'Easy', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/shift-2d-grid/' },
      // Final Miscellaneous
      { id: 'l441', title: 'Pascals Triangle', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/pascals-triangle/' },
      { id: 'l442', title: 'Pascals Triangle II', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/pascals-triangle-ii/' },
      { id: 'l443', title: 'Monotonic Array', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/monotonic-array/' },
      { id: 'l444', title: 'Fibonacci Number', difficulty: 'Easy', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/fibonacci-number/' },
      { id: 'l445', title: 'N-th Tribonacci Number', difficulty: 'Easy', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/n-th-tribonacci-number/' },
      { id: 'l446', title: 'Divisor Game', difficulty: 'Easy', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/divisor-game/' },
      { id: 'l447', title: 'Get Maximum in Generated Array', difficulty: 'Easy', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/get-maximum-in-generated-array/' },
      { id: 'l448', title: 'Is Subsequence', difficulty: 'Easy', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/is-subsequence/' },
      { id: 'l449', title: 'Assign Cookies', difficulty: 'Easy', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/assign-cookies/' },
      { id: 'l450', title: 'Lemonade Change', difficulty: 'Easy', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/lemonade-change/' },
    ],

    // FRAZ'S LIST - Top Interview Questions (25 problems shown)
    fraz: [
      // Arrays & Hashing
      { id: 'f1', title: 'Two Sum', difficulty: 'Easy', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/two-sum/' },
      { id: 'f2', title: 'Group Anagrams', difficulty: 'Medium', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/group-anagrams/' },
      { id: 'f3', title: 'Top K Frequent Elements', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { id: 'f4', title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
      { id: 'f5', title: 'Subarray Sum Equals K', difficulty: 'Medium', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
      { id: 'f6', title: 'LRU Cache', difficulty: 'Medium', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/lru-cache/' },
      { id: 'f7', title: 'Insert Delete GetRandom O(1)', difficulty: 'Medium', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/insert-delete-getrandom-o1/' },
      // Strings
      { id: 'f8', title: 'Longest Substring Without Repeating', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: 'f9', title: 'Minimum Window Substring', difficulty: 'Hard', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-window-substring/' },
      { id: 'f10', title: 'Valid Anagram', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-anagram/' },
      { id: 'f11', title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: 'f12', title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      // Trees
      { id: 'f13', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: 'f14', title: 'Same Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/same-tree/' },
      { id: 'f15', title: 'Invert Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/invert-binary-tree/' },
      { id: 'f16', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { id: 'f17', title: 'Validate Binary Search Tree', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { id: 'f18', title: 'Kth Smallest in BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
      { id: 'f19', title: 'Lowest Common Ancestor of BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { id: 'f20', title: 'Binary Tree Right Side View', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
      // Graphs
      { id: 'f21', title: 'Number of Islands', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-islands/' },
      { id: 'f22', title: 'Clone Graph', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/clone-graph/' },
      { id: 'f23', title: 'Course Schedule', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/course-schedule/' },
      { id: 'f24', title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
      { id: 'f25', title: 'Word Ladder', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/word-ladder/' },
      // Dynamic Programming
      { id: 'f26', title: 'Climbing Stairs', difficulty: 'Easy', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: 'f27', title: 'House Robber', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/house-robber/' },
      { id: 'f28', title: 'Coin Change', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/coin-change/' },
      { id: 'f29', title: 'Longest Increasing Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { id: 'f30', title: 'Word Break', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/word-break/' },
      { id: 'f31', title: 'Combination Sum IV', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/combination-sum-iv/' },
      { id: 'f32', title: 'House Robber II', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/house-robber-ii/' },
      { id: 'f33', title: 'Decode Ways', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/decode-ways/' },
      { id: 'f34', title: 'Unique Paths', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/unique-paths/' },
      { id: 'f35', title: 'Jump Game', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/jump-game/' },
      // Linked List
      { id: 'f36', title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 'f37', title: 'Linked List Cycle', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: 'f38', title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { id: 'f39', title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: 'f40', title: 'Remove Nth Node From End', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { id: 'f41', title: 'Reorder List', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reorder-list/' },
      { id: 'f42', title: 'Linked List Cycle II', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/linked-list-cycle-ii/' },
      { id: 'f43', title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/add-two-numbers/' },
      { id: 'f44', title: 'Copy List with Random Pointer', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
      { id: 'f45', title: 'Reverse Nodes in k-Group', difficulty: 'Hard', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
      // Matrix
      { id: 'f46', title: 'Set Matrix Zeroes', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/set-matrix-zeroes/' },
      { id: 'f47', title: 'Spiral Matrix', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/spiral-matrix/' },
      { id: 'f48', title: 'Rotate Image', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/rotate-image/' },
      { id: 'f49', title: 'Word Search', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/word-search/' },
      { id: 'f50', title: 'Search 2D Matrix', difficulty: 'Medium', topic: 'Matrix', platform: 'leetcode', link: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      // Intervals
      { id: 'f51', title: 'Merge Intervals', difficulty: 'Medium', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-intervals/' },
      { id: 'f52', title: 'Insert Interval', difficulty: 'Medium', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/insert-interval/' },
      { id: 'f53', title: 'Non-overlapping Intervals', difficulty: 'Medium', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/non-overlapping-intervals/' },
      { id: 'f54', title: 'Meeting Rooms', difficulty: 'Easy', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/meeting-rooms/' },
      { id: 'f55', title: 'Meeting Rooms II', difficulty: 'Medium', topic: 'Intervals', platform: 'leetcode', link: 'https://leetcode.com/problems/meeting-rooms-ii/' },
      // Two Pointers
      { id: 'f56', title: 'Valid Palindrome', difficulty: 'Easy', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: 'f57', title: '3Sum', difficulty: 'Medium', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/3sum/' },
      { id: 'f58', title: 'Container With Most Water', difficulty: 'Medium', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/container-with-most-water/' },
      { id: 'f59', title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/trapping-rain-water/' },
      { id: 'f60', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
      // Binary Search
      { id: 'f61', title: 'Binary Search', difficulty: 'Easy', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-search/' },
      { id: 'f62', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: 'f63', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { id: 'f64', title: 'Koko Eating Bananas', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/koko-eating-bananas/' },
      { id: 'f65', title: 'Time Based Key-Value Store', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/time-based-key-value-store/' },
      // Stack
      { id: 'f66', title: 'Min Stack', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/min-stack/' },
      { id: 'f67', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
      { id: 'f68', title: 'Generate Parentheses', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/generate-parentheses/' },
      { id: 'f69', title: 'Daily Temperatures', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/daily-temperatures/' },
      { id: 'f70', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
      // Sliding Window
      { id: 'f71', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Sliding Window', platform: 'leetcode', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { id: 'f72', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', topic: 'Sliding Window', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
      { id: 'f73', title: 'Permutation in String', difficulty: 'Medium', topic: 'Sliding Window', platform: 'leetcode', link: 'https://leetcode.com/problems/permutation-in-string/' },
      { id: 'f74', title: 'Minimum Window Substring', difficulty: 'Hard', topic: 'Sliding Window', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-window-substring/' },
      { id: 'f75', title: 'Sliding Window Maximum', difficulty: 'Hard', topic: 'Sliding Window', platform: 'leetcode', link: 'https://leetcode.com/problems/sliding-window-maximum/' },
      // Heaps
      { id: 'f76', title: 'Kth Largest Element in Array', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { id: 'f77', title: 'Find Median from Data Stream', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/find-median-from-data-stream/' },
      { id: 'f78', title: 'Task Scheduler', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/task-scheduler/' },
      { id: 'f79', title: 'K Closest Points to Origin', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
      { id: 'f80', title: 'Kth Largest Element in Stream', difficulty: 'Easy', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
      // Backtracking
      { id: 'f81', title: 'Subsets', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/subsets/' },
      { id: 'f82', title: 'Combination Sum', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/combination-sum/' },
      { id: 'f83', title: 'Permutations', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/permutations/' },
      { id: 'f84', title: 'Subsets II', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/subsets-ii/' },
      { id: 'f85', title: 'Combination Sum II', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/combination-sum-ii/' },
      { id: 'f86', title: 'Palindrome Partitioning', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/palindrome-partitioning/' },
      { id: 'f87', title: 'Letter Combinations of Phone Number', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
      { id: 'f88', title: 'N-Queens', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/n-queens/' },
      { id: 'f89', title: 'Word Search II', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/word-search-ii/' },
      { id: 'f90', title: 'Sudoku Solver', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/sudoku-solver/' },
      // Bit Manipulation
      { id: 'f91', title: 'Single Number', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/single-number/' },
      { id: 'f92', title: 'Number of 1 Bits', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-1-bits/' },
      { id: 'f93', title: 'Counting Bits', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/counting-bits/' },
      { id: 'f94', title: 'Reverse Bits', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-bits/' },
      { id: 'f95', title: 'Missing Number', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/missing-number/' },
      { id: 'f96', title: 'Sum of Two Integers', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/sum-of-two-integers/' },
      { id: 'f97', title: 'Reverse Integer', difficulty: 'Medium', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-integer/' },
      // Greedy
      { id: 'f98', title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: 'f99', title: 'Jump Game', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/jump-game/' },
      { id: 'f100', title: 'Jump Game II', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/jump-game-ii/' },
      // More Arrays
      { id: 'f101', title: 'Product of Array Except Self', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { id: 'f102', title: 'Maximum Product Subarray', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-product-subarray/' },
      { id: 'f103', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { id: 'f104', title: 'Contains Duplicate', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/contains-duplicate/' },
      { id: 'f105', title: 'Contains Duplicate II', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/contains-duplicate-ii/' },
      { id: 'f106', title: 'Valid Sudoku', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-sudoku/' },
      { id: 'f107', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
      { id: 'f108', title: 'First Missing Positive', difficulty: 'Hard', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/first-missing-positive/' },
      { id: 'f109', title: 'Move Zeroes', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/move-zeroes/' },
      { id: 'f110', title: 'Find All Numbers Disappeared', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/' },
      // More Strings
      { id: 'f111', title: 'Reverse String', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-string/' },
      { id: 'f112', title: 'Reverse Words in String', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-words-in-a-string/' },
      { id: 'f113', title: 'Find All Anagrams', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/' },
      { id: 'f114', title: 'String Compression', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/string-compression/' },
      { id: 'f115', title: 'Count and Say', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/count-and-say/' },
      { id: 'f116', title: 'Isomorphic Strings', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/isomorphic-strings/' },
      { id: 'f117', title: 'Word Pattern', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/word-pattern/' },
      { id: 'f118', title: 'Decode String', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/decode-string/' },
      { id: 'f119', title: 'Zigzag Conversion', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/zigzag-conversion/' },
      { id: 'f120', title: 'Multiply Strings', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/multiply-strings/' },
      // More DP
      { id: 'f121', title: 'Partition Equal Subset Sum', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
      { id: 'f122', title: 'Target Sum', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/target-sum/' },
      { id: 'f123', title: 'Perfect Squares', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/perfect-squares/' },
      { id: 'f124', title: 'Maximal Square', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/maximal-square/' },
      { id: 'f125', title: 'Dungeon Game', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/dungeon-game/' },
      { id: 'f126', title: 'Best Time to Buy Sell Stock III', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/' },
      { id: 'f127', title: 'Best Time to Buy Sell Stock IV', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/' },
      { id: 'f128', title: 'Interleaving String', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/interleaving-string/' },
      { id: 'f129', title: 'Wildcard Matching', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/wildcard-matching/' },
      { id: 'f130', title: 'Regular Expression Matching', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/regular-expression-matching/' },
      // More Trees
      { id: 'f131', title: 'Symmetric Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/symmetric-tree/' },
      { id: 'f132', title: 'Path Sum', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/path-sum/' },
      { id: 'f133', title: 'Path Sum II', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/path-sum-ii/' },
      { id: 'f134', title: 'Flatten Binary Tree to Linked List', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/' },
      { id: 'f135', title: 'Populating Next Right Pointers', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/' },
      { id: 'f136', title: 'Sum Root to Leaf Numbers', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/sum-root-to-leaf-numbers/' },
      { id: 'f137', title: 'Binary Tree Zigzag Level Order', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/' },
      { id: 'f138', title: 'Count Complete Tree Nodes', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/count-complete-tree-nodes/' },
      { id: 'f139', title: 'Lowest Common Ancestor Binary Tree', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
      { id: 'f140', title: 'Binary Tree Paths', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-paths/' },
      // More Graphs
      { id: 'f141', title: 'Word Ladder II', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/word-ladder-ii/' },
      { id: 'f142', title: 'Minimum Height Trees', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-height-trees/' },
      { id: 'f143', title: 'Evaluate Division', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/evaluate-division/' },
      { id: 'f144', title: 'Find Eventual Safe States', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/find-eventual-safe-states/' },
      { id: 'f145', title: 'Shortest Path in Binary Matrix', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/' },
      { id: 'f146', title: 'All Paths From Source to Target', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/all-paths-from-source-to-target/' },
      { id: 'f147', title: 'Is Graph Bipartite', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/is-graph-bipartite/' },
      { id: 'f148', title: 'Keys and Rooms', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/keys-and-rooms/' },
      { id: 'f149', title: 'Redundant Connection', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/redundant-connection/' },
      { id: 'f150', title: 'Accounts Merge', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/accounts-merge/' },
      // Design Problems
      { id: 'f151', title: 'Design HashSet', difficulty: 'Easy', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/design-hashset/' },
      { id: 'f152', title: 'Design HashMap', difficulty: 'Easy', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/design-hashmap/' },
      { id: 'f153', title: 'Design Browser History', difficulty: 'Medium', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/design-browser-history/' },
      { id: 'f154', title: 'Design Underground System', difficulty: 'Medium', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/design-underground-system/' },
      { id: 'f155', title: 'Design Parking System', difficulty: 'Easy', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/design-parking-system/' },
      { id: 'f156', title: 'LFU Cache', difficulty: 'Hard', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/lfu-cache/' },
      { id: 'f157', title: 'All O\'one Data Structure', difficulty: 'Hard', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/all-oone-data-structure/' },
      { id: 'f158', title: 'Design Hit Counter', difficulty: 'Medium', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/design-hit-counter/' },
      { id: 'f159', title: 'Design File System', difficulty: 'Medium', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/design-file-system/' },
      { id: 'f160', title: 'Design Search Autocomplete', difficulty: 'Hard', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/design-search-autocomplete-system/' },
      // Math Problems
      { id: 'f161', title: 'Happy Number', difficulty: 'Easy', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/happy-number/' },
      { id: 'f162', title: 'Plus One', difficulty: 'Easy', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/plus-one/' },
      { id: 'f163', title: 'Factorial Trailing Zeroes', difficulty: 'Medium', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/factorial-trailing-zeroes/' },
      { id: 'f164', title: 'Excel Sheet Column Number', difficulty: 'Easy', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/excel-sheet-column-number/' },
      { id: 'f165', title: 'Excel Sheet Column Title', difficulty: 'Easy', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/excel-sheet-column-title/' },
      { id: 'f166', title: 'Count Primes', difficulty: 'Medium', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/count-primes/' },
      { id: 'f167', title: 'Integer to Roman', difficulty: 'Medium', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/integer-to-roman/' },
      { id: 'f168', title: 'Roman to Integer', difficulty: 'Easy', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/roman-to-integer/' },
      { id: 'f169', title: 'Sqrt(x)', difficulty: 'Easy', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/sqrtx/' },
      { id: 'f170', title: 'Valid Perfect Square', difficulty: 'Easy', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-perfect-square/' },
      // Sorting Problems
      { id: 'f171', title: 'Sort Colors', difficulty: 'Medium', topic: 'Sorting', platform: 'leetcode', link: 'https://leetcode.com/problems/sort-colors/' },
      { id: 'f172', title: 'Sort List', difficulty: 'Medium', topic: 'Sorting', platform: 'leetcode', link: 'https://leetcode.com/problems/sort-list/' },
      { id: 'f173', title: 'Wiggle Sort', difficulty: 'Medium', topic: 'Sorting', platform: 'leetcode', link: 'https://leetcode.com/problems/wiggle-sort/' },
      { id: 'f174', title: 'Wiggle Sort II', difficulty: 'Medium', topic: 'Sorting', platform: 'leetcode', link: 'https://leetcode.com/problems/wiggle-sort-ii/' },
      { id: 'f175', title: 'Largest Number', difficulty: 'Medium', topic: 'Sorting', platform: 'leetcode', link: 'https://leetcode.com/problems/largest-number/' },
      { id: 'f176', title: 'Meeting Rooms III', difficulty: 'Hard', topic: 'Sorting', platform: 'leetcode', link: 'https://leetcode.com/problems/meeting-rooms-iii/' },
      { id: 'f177', title: 'Car Pooling', difficulty: 'Medium', topic: 'Sorting', platform: 'leetcode', link: 'https://leetcode.com/problems/car-pooling/' },
      { id: 'f178', title: 'Maximum Number of Events', difficulty: 'Medium', topic: 'Sorting', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/' },
      { id: 'f179', title: 'Queue Reconstruction by Height', difficulty: 'Medium', topic: 'Sorting', platform: 'leetcode', link: 'https://leetcode.com/problems/queue-reconstruction-by-height/' },
      { id: 'f180', title: 'Relative Sort Array', difficulty: 'Easy', topic: 'Sorting', platform: 'leetcode', link: 'https://leetcode.com/problems/relative-sort-array/' },
      // More Backtracking
      { id: 'f181', title: 'Restore IP Addresses', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/restore-ip-addresses/' },
      { id: 'f182', title: 'Gray Code', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/gray-code/' },
      { id: 'f183', title: 'Beautiful Arrangement', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/beautiful-arrangement/' },
      { id: 'f184', title: 'Increasing Subsequences', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/increasing-subsequences/' },
      { id: 'f185', title: 'Matchsticks to Square', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/matchsticks-to-square/' },
      { id: 'f186', title: 'Partition to K Equal Sum Subsets', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/partition-to-k-equal-sum-subsets/' },
      { id: 'f187', title: 'Split Array into Fibonacci Sequence', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/split-array-into-fibonacci-sequence/' },
      { id: 'f188', title: 'Additive Number', difficulty: 'Medium', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/additive-number/' },
      { id: 'f189', title: 'Expression Add Operators', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/expression-add-operators/' },
      { id: 'f190', title: 'Remove Invalid Parentheses', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-invalid-parentheses/' },
      // Trie Problems
      { id: 'f191', title: 'Longest Word in Dictionary', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-word-in-dictionary/' },
      { id: 'f192', title: 'Replace Words', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/replace-words/' },
      { id: 'f193', title: 'Map Sum Pairs', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/map-sum-pairs/' },
      { id: 'f194', title: 'Maximum XOR of Two Numbers', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/' },
      { id: 'f195', title: 'Concatenated Words', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/concatenated-words/' },
      // More Bit Manipulation
      { id: 'f196', title: 'Power of Two', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/power-of-two/' },
      { id: 'f197', title: 'Power of Three', difficulty: 'Easy', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/power-of-three/' },
      { id: 'f198', title: 'Power of Four', difficulty: 'Easy', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/power-of-four/' },
      { id: 'f199', title: 'UTF-8 Validation', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/utf-8-validation/' },
      { id: 'f200', title: 'Find Duplicate Number', difficulty: 'Medium', topic: 'Bit Manipulation', platform: 'leetcode', link: 'https://leetcode.com/problems/find-the-duplicate-number/' },
      // Union Find
      { id: 'f201', title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Union Find', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
      { id: 'f202', title: 'Number of Provinces', difficulty: 'Medium', topic: 'Union Find', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-provinces/' },
      { id: 'f203', title: 'Most Stones Removed', difficulty: 'Medium', topic: 'Union Find', platform: 'leetcode', link: 'https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/' },
      { id: 'f204', title: 'Satisfiability of Equality Equations', difficulty: 'Medium', topic: 'Union Find', platform: 'leetcode', link: 'https://leetcode.com/problems/satisfiability-of-equality-equations/' },
      { id: 'f205', title: 'Regions Cut By Slashes', difficulty: 'Medium', topic: 'Union Find', platform: 'leetcode', link: 'https://leetcode.com/problems/regions-cut-by-slashes/' },
      // Additional Important
      { id: 'f206', title: 'Min Stack', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/min-stack/' },
      { id: 'f207', title: 'Kth Smallest Element in Sorted Matrix', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/' },
      { id: 'f208', title: 'Shortest Unsorted Continuous Subarray', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/shortest-unsorted-continuous-subarray/' },
      { id: 'f209', title: 'Next Permutation', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/next-permutation/' },
      { id: 'f210', title: 'Game of Life', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/game-of-life/' },
      { id: 'f211', title: 'Random Pick with Weight', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/random-pick-with-weight/' },
      { id: 'f212', title: 'Palindrome Pairs', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/palindrome-pairs/' },
      { id: 'f213', title: 'Course Schedule III', difficulty: 'Hard', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/course-schedule-iii/' },
      { id: 'f214', title: 'Partition Labels', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/partition-labels/' },
      { id: 'f215', title: 'Hand of Straights', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/hand-of-straights/' },
      { id: 'f216', title: 'Gas Station', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/gas-station/' },
      { id: 'f217', title: 'Valid Parenthesis String', difficulty: 'Medium', topic: 'Greedy', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-parenthesis-string/' },
      { id: 'f218', title: 'Reconstruct Itinerary', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/reconstruct-itinerary/' },
      { id: 'f219', title: 'Min Cost to Connect All Points', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/min-cost-to-connect-all-points/' },
      { id: 'f220', title: 'Network Delay Time', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/network-delay-time/' },
      { id: 'f221', title: 'Swim in Rising Water', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/swim-in-rising-water/' },
      { id: 'f222', title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },
      { id: 'f223', title: 'Minimum Knight Moves', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-knight-moves/' },
      { id: 'f224', title: 'Open the Lock', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/open-the-lock/' },
      { id: 'f225', title: 'Rotting Oranges', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/rotting-oranges/' },
      { id: 'f226', title: '01 Matrix', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/01-matrix/' },
      { id: 'f227', title: 'As Far from Land as Possible', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/as-far-from-land-as-possible/' },
      { id: 'f228', title: 'Walls and Gates', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/walls-and-gates/' },
      { id: 'f229', title: 'Shortest Bridge', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/shortest-bridge/' },
      { id: 'f230', title: 'Snakes and Ladders', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/snakes-and-ladders/' },
      { id: 'f231', title: 'Minimum Genetic Mutation', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/minimum-genetic-mutation/' },
      { id: 'f232', title: 'Sliding Puzzle', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/sliding-puzzle/' },
      { id: 'f233', title: 'Bus Routes', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/bus-routes/' },
      { id: 'f234', title: 'Shortest Path Visiting All Nodes', difficulty: 'Hard', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/shortest-path-visiting-all-nodes/' },
      { id: 'f235', title: 'Is Subsequence', difficulty: 'Easy', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/is-subsequence/' },
      { id: 'f236', title: 'Boats to Save People', difficulty: 'Medium', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/boats-to-save-people/' },
      { id: 'f237', title: 'Partition Array into Disjoint Intervals', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/partition-array-into-disjoint-intervals/' },
      { id: 'f238', title: 'Array Nesting', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/array-nesting/' },
      { id: 'f239', title: 'Pancake Sorting', difficulty: 'Medium', topic: 'Sorting', platform: 'leetcode', link: 'https://leetcode.com/problems/pancake-sorting/' },
      { id: 'f240', title: 'Find K-th Smallest Pair Distance', difficulty: 'Hard', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/find-k-th-smallest-pair-distance/' },
      { id: 'f241', title: 'Split Array Largest Sum', difficulty: 'Hard', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/split-array-largest-sum/' },
      { id: 'f242', title: 'Minimize Max Distance to Gas Station', difficulty: 'Hard', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/minimize-max-distance-to-gas-station/' },
      { id: 'f243', title: 'Maximum Average Subarray II', difficulty: 'Hard', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-average-subarray-ii/' },
      { id: 'f244', title: 'Find Peak Element II', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/find-a-peak-element-ii/' },
      { id: 'f245', title: 'Valid Triangle Number', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-triangle-number/' },
      { id: 'f246', title: 'Count of Smaller Numbers After Self', difficulty: 'Hard', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/' },
      { id: 'f247', title: 'Reverse Pairs', difficulty: 'Hard', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-pairs/' },
      { id: 'f248', title: 'Count of Range Sum', difficulty: 'Hard', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/count-of-range-sum/' },
      { id: 'f249', title: 'Smallest Good Base', difficulty: 'Hard', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/smallest-good-base/' },
      { id: 'f250', title: 'Super Pow', difficulty: 'Medium', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/super-pow/' },
    ]
  };

  // Get sheet metadata
  const sheetMetadata = {
    striver: { name: "Striver's SDE Sheet", icon: '🔥', color: '#FF6B6B', totalProblems: 191 },
    neetcode: { name: 'NeetCode 150', icon: '💡', color: '#4ECDC4', totalProblems: 150 },
    blind75: { name: 'Blind 75', icon: '👁️', color: '#95E1D3', totalProblems: 75 },
    love: { name: "Love Babbar's 450", icon: '❤️', color: '#F38181', totalProblems: 450 },
    fraz: { name: "Fraz's List", icon: '⚡', color: '#AA96DA', totalProblems: 250 }
  };

  const currentSheet = sheetMetadata[sheetId] || sheetMetadata.striver;
  const allProblems = allSheetProblems[sheetId] || [];
  
  // Calculate progress
  const totalProblems = allProblems.length;
  const solvedCount = solvedProblems.size;
  const progressPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  // Topic-wise stats
  const topicStats = {};
  getTopics().forEach(topic => {
    const topicProblems = getProblemsByTopic(topic);
    const topicSolved = topicProblems.filter(p => solvedProblems.has(p.id)).length;
    topicStats[topic] = { total: topicProblems.length, solved: topicSolved };
  });

  // Toggle problem solved status
  const toggleSolved = async (problemId) => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    try {
      const newSolved = new Set(solvedProblems);
      const isSolved = newSolved.has(problemId);

      // Update local state immediately for UI feedback
      if (isSolved) {
        newSolved.delete(problemId);
      } else {
        newSolved.add(problemId);
      }
      setSolvedProblems(newSolved);

      // Call backend API
      const endpoint = isSolved ? '/api/dsa/progress/mark-unsolved' : '/api/dsa/progress/mark-solved';
      await axios.post(
        `${API_URL}${endpoint}`,
        { sheetId, problemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error saving progress:', error);
      // Revert local state on error
      const reverted = new Set(solvedProblems);
      if (solvedProblems.has(problemId)) {
        reverted.delete(problemId);
      } else {
        reverted.add(problemId);
      }
      setSolvedProblems(reverted);
    }
  };

  // Open problem link
  const openProblem = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div className="dsa-sheet-detail-wrapper">
      {/* Header */}
      <div className="sheet-detail-header">
        <button className="back-button" onClick={() => navigate('/dsa-sheets')}>
          ← Back to Sheets
        </button>
        <div className="sheet-title-section">
          <span className="sheet-icon-large">{currentSheet.icon}</span>
          <h1 className="sheet-name-large">{currentSheet.name}</h1>
        </div>
      </div>

      <div className="sheet-detail-container">
        {/* Left Sidebar - Progress */}
        <div className="sheet-sidebar">
          <div className="progress-card">
            <h3>Progress</h3>
            <div className="progress-circle">
              <div className="circle-content">
                <span className="percentage">{progressPercentage}%</span>
                <span className="solved-count">{solvedCount}/{totalProblems}</span>
              </div>
              <svg className="progress-ring" width="120" height="120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="4"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={currentSheet.color}
                  strokeWidth="4"
                  strokeDasharray={`${(progressPercentage / 100) * 2 * Math.PI * 54} ${2 * Math.PI * 54}`}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
                />
              </svg>
            </div>
          </div>

          {/* Topic Stats */}
          <div className="topic-stats-sidebar">
            <h4>By Topic</h4>
            {Object.entries(topicStats).map(([topic, stats]) => (
              <div key={topic} className="topic-stat-item">
                <div className="stat-label">
                  <span className="topic-name">{topic}</span>
                  <span className="stat-count">{stats.solved}/{stats.total}</span>
                </div>
                <div className="stat-progress">
                  <div 
                    className="stat-progress-fill"
                    style={{ 
                      width: `${(stats.solved / stats.total) * 100}%`,
                      backgroundColor: currentSheet.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="sheet-main-content">
          {/* Search Box */}
          <div className="filters-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Problems Grouped by Topic - Collapsible */}
          <div className="problems-section">
            {getTopics().map(topic => {
              const topicKey = `${sheetId}-${topic}`;
              const isTopicExpanded = expandedTopics[topicKey];
              const topicProblems = getProblemsByTopic(topic);
              const difficulties = getDifficultiesForTopic(topic);
              
              return (
                <div key={topic} className="topic-group">
                  {/* Topic Header - Collapsible */}
                  <div 
                    className="topic-header collapsible"
                    onClick={() => toggleTopic(topicKey)}
                  >
                    <span className="toggle-icon">
                      {isTopicExpanded ? '▼' : '▶'}
                    </span>
                    <h3>{topic}</h3>
                    <span className="topic-count">{topicProblems.length} problems</span>
                  </div>

                  {/* Difficulties - Show when topic is expanded */}
                  {isTopicExpanded && (
                    <div className="difficulty-levels">
                      {difficulties.map(difficulty => {
                        const difficultyKey = `${topicKey}-${difficulty}`;
                        const isDifficultyExpanded = expandedDifficulties[difficultyKey];
                        const diffProblems = getProblemsByTopicAndDifficulty(topic, difficulty);
                        const solvedCount = diffProblems.filter(p => solvedProblems.has(p.id)).length;
                        
                        return (
                          <div key={difficulty} className="difficulty-group">
                            {/* Difficulty Header - Collapsible */}
                            <div 
                              className="difficulty-header collapsible"
                              onClick={() => toggleDifficulty(difficultyKey)}
                            >
                              <span className="toggle-icon">
                                {isDifficultyExpanded ? '▼' : '▶'}
                              </span>
                              <span className={`difficulty-label ${difficulty.toLowerCase()}`}>
                                {difficulty}
                              </span>
                              <span className="difficulty-count">
                                {solvedCount}/{diffProblems.length}
                              </span>
                            </div>

                            {/* Problems - Show when difficulty is expanded */}
                            {isDifficultyExpanded && (
                              <div className="problems-list">
                                {diffProblems.map(problem => (
                                  <div key={problem.id} className="problem-item">
                                    <input
                                      type="checkbox"
                                      checked={solvedProblems.has(problem.id)}
                                      onChange={() => toggleSolved(problem.id)}
                                      className="problem-checkbox"
                                    />
                                    <div className="problem-info">
                                      <span 
                                        className={`problem-title ${solvedProblems.has(problem.id) ? 'solved' : ''}`}
                                        onClick={() => openProblem(problem.link)}
                                      >
                                        {problem.title}
                                      </span>
                                      <div className="problem-platforms">
                                        <span className={`platform-tag ${problem.platform}`}>
                                          {problem.platform === 'leetcode' ? '💻' : '🔖'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSASheetDetail;
