import React, { useState, useEffect } from 'react';
import '../styles/DSATrackerNew.css';

const DSATracker = () => {
  const [selectedSheet, setSelectedSheet] = useState('striver');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Load solved problems from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`dsa-solved-${selectedSheet}`);
    if (saved) {
      setSolvedProblems(new Set(JSON.parse(saved)));
    } else {
      setSolvedProblems(new Set());
    }
  }, [selectedSheet]);

  // Save to localStorage whenever solvedProblems changes
  useEffect(() => {
    localStorage.setItem(`dsa-solved-${selectedSheet}`, JSON.stringify([...solvedProblems]));
  }, [solvedProblems, selectedSheet]);

  // Popular DSA Sheets
  const dsaSheets = {
    striver: {
      name: "Striver's SDE Sheet",
      icon: '🔥',
      description: 'Most popular SDE sheet with 191 problems',
      totalProblems: 191,
      color: '#047857'
    },
    neetcode: {
      name: 'NeetCode 150',
      icon: '💡',
      description: 'Curated list of 150 best LeetCode questions',
      totalProblems: 150,
      color: '#059669'
    },
    blind75: {
      name: 'Blind 75',
      icon: '👁️',
      description: 'Essential 75 questions for interviews',
      totalProblems: 75,
      color: '#10B981'
    },
    love: {
      name: "Love Babbar's 450",
      icon: '❤️',
      description: 'Comprehensive 450 DSA problems',
      totalProblems: 450,
      color: '#065F46'
    },
    fraz: {
      name: "Fraz's List",
      icon: '⚡',
      description: 'Top questions asked in interviews',
      totalProblems: 250,
      color: '#047857'
    }
  };

  // All DSA Sheet Problems - Each sheet has its own unique problems
  const allSheetProblems = {
    // STRIVER'S SDE SHEET - Complete 191 Problems
    striver: [
      // Day 1: Arrays
      { id: 's1', title: 'Set Matrix Zeroes', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/set-matrix-zeroes/' },
      { id: 's2', title: 'Pascal\'s Triangle', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/pascals-triangle/' },
      { id: 's3', title: 'Next Permutation', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/next-permutation/' },
      { id: 's4', title: 'Maximum Subarray (Kadane\'s)', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: 's5', title: 'Sort Colors (Dutch Flag)', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/sort-colors/' },
      { id: 's6', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      // Day 2: Arrays Part 2
      { id: 's7', title: 'Rotate Image', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/rotate-image/' },
      { id: 's8', title: 'Merge Intervals', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-intervals/' },
      { id: 's9', title: 'Merge Sorted Arrays', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-sorted-array/' },
      { id: 's10', title: 'Find Duplicate Number', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/find-the-duplicate-number/' },
      { id: 's11', title: 'Repeat and Missing Number', difficulty: 'Medium', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-a-repeating-and-a-missing-number/' },
      { id: 's12', title: 'Inversion Count', difficulty: 'Hard', topic: 'Arrays', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-inversions/' },
      // Day 3: Arrays/Math
      { id: 's13', title: 'Search in 2D Matrix', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      { id: 's14', title: 'Pow(x, n)', difficulty: 'Medium', topic: 'Math', platform: 'leetcode', link: 'https://leetcode.com/problems/powx-n/' },
      { id: 's15', title: 'Majority Element (>N/2)', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/majority-element/' },
      { id: 's16', title: 'Majority Element II (>N/3)', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/majority-element-ii/' },
      { id: 's17', title: 'Unique Paths', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/unique-paths/' },
      { id: 's18', title: 'Reverse Pairs', difficulty: 'Hard', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-pairs/' },
      // Day 4: Hashing
      { id: 's19', title: 'Two Sum', difficulty: 'Easy', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/two-sum/' },
      { id: 's20', title: '4 Sum', difficulty: 'Medium', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/4sum/' },
      { id: 's21', title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Hashing', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
      { id: 's22', title: 'Longest Subarray with 0 Sum', difficulty: 'Easy', topic: 'Hashing', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-the-largest-subarray-with-0-sum/' },
      { id: 's23', title: 'Count Subarrays with Given XOR', difficulty: 'Medium', topic: 'Hashing', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-number-subarrays-given-xor/' },
      { id: 's24', title: 'Longest Substring Without Repeating', difficulty: 'Medium', topic: 'Sliding Window', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      // Day 5: Linked List
      { id: 's25', title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 's26', title: 'Middle of Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
      { id: 's27', title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { id: 's28', title: 'Remove Nth Node From End', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { id: 's29', title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/add-two-numbers/' },
      { id: 's30', title: 'Delete Node in Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/delete-node-in-a-linked-list/' },
      // Day 6: Linked List Part 2
      { id: 's31', title: 'Intersection of Two Linked Lists', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/intersection-of-two-linked-lists/' },
      { id: 's32', title: 'Detect Cycle in Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: 's33', title: 'Reverse Nodes in k-Group', difficulty: 'Hard', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
      { id: 's34', title: 'Palindrome Linked List', difficulty: 'Easy', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/palindrome-linked-list/' },
      { id: 's35', title: 'Starting Point of Loop in Linked List', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/linked-list-cycle-ii/' },
      { id: 's36', title: 'Flattening of Linked List', difficulty: 'Medium', topic: 'Linked List', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/flattening-a-linked-list/1' },
      // Day 7: 2-Pointer
      { id: 's37', title: 'Rotate List', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/rotate-list/' },
      { id: 's38', title: 'Clone Linked List with Random Pointer', difficulty: 'Medium', topic: 'Linked List', platform: 'leetcode', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
      { id: 's39', title: '3 Sum', difficulty: 'Medium', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/3sum/' },
      { id: 's40', title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/trapping-rain-water/' },
      { id: 's41', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', topic: 'Two Pointers', platform: 'leetcode', link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
      { id: 's42', title: 'Max Consecutive Ones', difficulty: 'Easy', topic: 'Arrays', platform: 'leetcode', link: 'https://leetcode.com/problems/max-consecutive-ones/' },
      // Day 8: Greedy
      { id: 's43', title: 'N Meetings in One Room', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1' },
      { id: 's44', title: 'Minimum Platforms', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1' },
      { id: 's45', title: 'Job Sequencing Problem', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1' },
      { id: 's46', title: 'Fractional Knapsack', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1' },
      { id: 's47', title: 'Minimum Coins', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-minimum-number-of-coins-that-make-a-change/' },
      { id: 's48', title: 'Activity Selection Problem', difficulty: 'Easy', topic: 'Greedy', platform: 'gfg', link: 'https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/' },
      // Day 9: Recursion
      { id: 's49', title: 'Subset Sums', difficulty: 'Easy', topic: 'Recursion', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/subset-sums2234/1' },
      { id: 's50', title: 'Subsets II', difficulty: 'Medium', topic: 'Recursion', platform: 'leetcode', link: 'https://leetcode.com/problems/subsets-ii/' },
      { id: 's51', title: 'Combination Sum', difficulty: 'Medium', topic: 'Recursion', platform: 'leetcode', link: 'https://leetcode.com/problems/combination-sum/' },
      { id: 's52', title: 'Combination Sum II', difficulty: 'Medium', topic: 'Recursion', platform: 'leetcode', link: 'https://leetcode.com/problems/combination-sum-ii/' },
      { id: 's53', title: 'Palindrome Partitioning', difficulty: 'Medium', topic: 'Recursion', platform: 'leetcode', link: 'https://leetcode.com/problems/palindrome-partitioning/' },
      { id: 's54', title: 'Kth Permutation Sequence', difficulty: 'Hard', topic: 'Recursion', platform: 'leetcode', link: 'https://leetcode.com/problems/permutation-sequence/' },
      // Day 10: Recursion and Backtracking
      { id: 's55', title: 'Print All Permutations', difficulty: 'Medium', topic: 'Recursion', platform: 'leetcode', link: 'https://leetcode.com/problems/permutations/' },
      { id: 's56', title: 'N-Queens', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/n-queens/' },
      { id: 's57', title: 'Sudoku Solver', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/sudoku-solver/' },
      { id: 's58', title: 'M Coloring Problem', difficulty: 'Medium', topic: 'Backtracking', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1' },
      { id: 's59', title: 'Rat in a Maze', difficulty: 'Medium', topic: 'Backtracking', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/rat-in-a-maze-problem/1' },
      { id: 's60', title: 'Word Break II', difficulty: 'Hard', topic: 'Backtracking', platform: 'leetcode', link: 'https://leetcode.com/problems/word-break-ii/' },
      // Day 11: Binary Search
      { id: 's61', title: 'Nth Root of M', difficulty: 'Easy', topic: 'Binary Search', platform: 'gfg', link: 'https://www.geeksforgeeks.org/n-th-root-number/' },
      { id: 's62', title: 'Matrix Median', difficulty: 'Medium', topic: 'Binary Search', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-median-row-wise-sorted-matrix/' },
      { id: 's63', title: 'Single Element in Sorted Array', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/single-element-in-a-sorted-array/' },
      { id: 's64', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: 's65', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
      { id: 's66', title: 'Kth Element of Two Sorted Arrays', difficulty: 'Medium', topic: 'Binary Search', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1' },
      { id: 's67', title: 'Allocate Books', difficulty: 'Hard', topic: 'Binary Search', platform: 'gfg', link: 'https://www.geeksforgeeks.org/allocate-minimum-number-pages/' },
      { id: 's68', title: 'Aggressive Cows', difficulty: 'Hard', topic: 'Binary Search', platform: 'spoj', link: 'https://www.spoj.com/problems/AGGRCOW/' },
      // Day 12: Heaps
      { id: 's69', title: 'Max Heap', difficulty: 'Easy', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/max-heap-in-java/' },
      { id: 's70', title: 'Kth Largest Element', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { id: 's71', title: 'Maximum Sum Combinations', difficulty: 'Medium', topic: 'Heaps', platform: 'gfg', link: 'https://www.geeksforgeeks.org/k-maximum-sum-combinations-two-arrays/' },
      { id: 's72', title: 'Find Median from Data Stream', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/find-median-from-data-stream/' },
      { id: 's73', title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: 's74', title: 'Top K Frequent Elements', difficulty: 'Medium', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      // Day 13: Stack and Queue
      { id: 's75', title: 'Implement Stack using Arrays', difficulty: 'Easy', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/stack-data-structure-introduction-program/' },
      { id: 's76', title: 'Implement Queue using Arrays', difficulty: 'Easy', topic: 'Queue', platform: 'gfg', link: 'https://www.geeksforgeeks.org/array-implementation-of-queue-simple/' },
      { id: 's77', title: 'Implement Stack using Queue', difficulty: 'Easy', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-stack-using-queues/' },
      { id: 's78', title: 'Implement Queue using Stack', difficulty: 'Easy', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
      { id: 's79', title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: 's80', title: 'Next Greater Element', difficulty: 'Easy', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/next-greater-element-i/' },
      { id: 's81', title: 'Sort a Stack', difficulty: 'Easy', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/sort-a-stack-using-recursion/' },
      // Day 14: Stack and Queue Part 2
      { id: 's82', title: 'Next Smaller Element', difficulty: 'Easy', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/next-smaller-element/' },
      { id: 's83', title: 'LRU Cache', difficulty: 'Medium', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/lru-cache/' },
      { id: 's84', title: 'LFU Cache', difficulty: 'Hard', topic: 'Design', platform: 'leetcode', link: 'https://leetcode.com/problems/lfu-cache/' },
      { id: 's85', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
      { id: 's86', title: 'Sliding Window Maximum', difficulty: 'Hard', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/sliding-window-maximum/' },
      { id: 's87', title: 'Min Stack', difficulty: 'Medium', topic: 'Stack', platform: 'leetcode', link: 'https://leetcode.com/problems/min-stack/' },
      { id: 's88', title: 'Rotten Oranges', difficulty: 'Medium', topic: 'Queue', platform: 'leetcode', link: 'https://leetcode.com/problems/rotting-oranges/' },
      { id: 's89', title: 'Stock Span Problem', difficulty: 'Medium', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/the-stock-span-problem/' },
      { id: 's90', title: 'Maximum of Minimum for Every Window Size', difficulty: 'Hard', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/find-the-maximum-of-minimums-for-every-window-size-in-a-given-array/' },
      { id: 's91', title: 'Celebrity Problem', difficulty: 'Medium', topic: 'Stack', platform: 'gfg', link: 'https://www.geeksforgeeks.org/the-celebrity-problem/' },
      // Day 15: String
      { id: 's92', title: 'Reverse Words in a String', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/reverse-words-in-a-string/' },
      { id: 's93', title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      { id: 's94', title: 'Roman to Integer', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/roman-to-integer/' },
      { id: 's95', title: 'String to Integer (atoi)', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/string-to-integer-atoi/' },
      { id: 's96', title: 'Longest Common Prefix', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-common-prefix/' },
      { id: 's97', title: 'Rabin Karp Algorithm', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/rabin-karp-algorithm-for-pattern-searching/' },
      // Day 16: String Part 2
      { id: 's98', title: 'Z-Algorithm', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/z-algorithm-linear-time-pattern-searching-algorithm/' },
      { id: 's99', title: 'KMP Algorithm', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/' },
      { id: 's100', title: 'Minimum Characters to Make String Palindrome', difficulty: 'Hard', topic: 'Strings', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-characters-added-front-make-string-palindrome/' },
      { id: 's101', title: 'Check for Anagrams', difficulty: 'Easy', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/valid-anagram/' },
      { id: 's102', title: 'Count and Say', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/count-and-say/' },
      { id: 's103', title: 'Compare Version Numbers', difficulty: 'Medium', topic: 'Strings', platform: 'leetcode', link: 'https://leetcode.com/problems/compare-version-numbers/' },
      // Day 17: Binary Tree
      { id: 's104', title: 'Inorder Traversal', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
      { id: 's105', title: 'Preorder Traversal', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-preorder-traversal/' },
      { id: 's106', title: 'Postorder Traversal', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-postorder-traversal/' },
      { id: 's107', title: 'Level Order Traversal', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { id: 's108', title: 'Morris Inorder Traversal', difficulty: 'Hard', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
      { id: 's109', title: 'Morris Preorder Traversal', difficulty: 'Hard', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-preorder-traversal/' },
      { id: 's110', title: 'Left View of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/left-view-of-binary-tree/1' },
      { id: 's111', title: 'Bottom View of Binary Tree', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1' },
      { id: 's112', title: 'Top View of Binary Tree', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/top-view-of-binary-tree/1' },
      // Day 18: Binary Tree Part 2
      { id: 's113', title: 'Vertical Order Traversal', difficulty: 'Hard', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/' },
      { id: 's114', title: 'Root to Node Path', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/print-path-root-given-node-binary-tree/' },
      { id: 's115', title: 'Maximum Width of Binary Tree', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-width-of-binary-tree/' },
      { id: 's116', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: 's117', title: 'Diameter of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
      { id: 's118', title: 'Check if Tree is Balanced', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/balanced-binary-tree/' },
      { id: 's119', title: 'Lowest Common Ancestor', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
      { id: 's120', title: 'Same Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/same-tree/' },
      // Day 19: Binary Tree Part 3
      { id: 's121', title: 'Zigzag Level Order Traversal', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/' },
      { id: 's122', title: 'Boundary Traversal', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1' },
      { id: 's123', title: 'Maximum Path Sum', difficulty: 'Hard', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
      { id: 's124', title: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
      { id: 's125', title: 'Construct Binary Tree from Postorder and Inorder', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/' },
      { id: 's126', title: 'Symmetric Tree', difficulty: 'Easy', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/symmetric-tree/' },
      { id: 's127', title: 'Flatten Binary Tree to Linked List', difficulty: 'Medium', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/' },
      { id: 's128', title: 'Check if Binary Tree is Mirror', difficulty: 'Easy', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/check-if-two-trees-are-mirror/' },
      { id: 's129', title: 'Children Sum Property', difficulty: 'Medium', topic: 'Binary Tree', platform: 'gfg', link: 'https://www.geeksforgeeks.org/check-for-children-sum-property-in-a-binary-tree/' },
      // Day 20: Binary Search Tree
      { id: 's130', title: 'Search in BST', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/search-in-a-binary-search-tree/' },
      { id: 's131', title: 'Convert Sorted Array to BST', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/' },
      { id: 's132', title: 'Construct BST from Preorder', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/' },
      { id: 's133', title: 'Validate BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { id: 's134', title: 'LCA in BST', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { id: 's135', title: 'Predecessor and Successor in BST', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/predecessor-and-successor/1' },
      { id: 's136', title: 'Floor in BST', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/floor-in-binary-search-tree-bst/' },
      { id: 's137', title: 'Ceil in BST', difficulty: 'Medium', topic: 'BST', platform: 'gfg', link: 'https://www.geeksforgeeks.org/ceil-in-binary-search-tree-bst/' },
      { id: 's138', title: 'Kth Smallest Element in BST', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
      { id: 's139', title: 'Kth Largest Element in BST', difficulty: 'Easy', topic: 'BST', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/kth-largest-element-in-bst/1' },
      // Day 21: Binary Search Tree Part 2
      { id: 's140', title: 'Two Sum in BST', difficulty: 'Easy', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/two-sum-iv-input-is-a-bst/' },
      { id: 's141', title: 'BST Iterator', difficulty: 'Medium', topic: 'BST', platform: 'leetcode', link: 'https://leetcode.com/problems/binary-search-tree-iterator/' },
      { id: 's142', title: 'Largest BST in Binary Tree', difficulty: 'Hard', topic: 'BST', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/largest-bst/1' },
      { id: 's143', title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topic: 'Binary Tree', platform: 'leetcode', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
      // Day 22: Binary Trees [Miscellaneous]
      { id: 's144', title: 'Binary Tree to DLL', difficulty: 'Hard', topic: 'Binary Tree', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/binary-tree-to-dll/1' },
      { id: 's145', title: 'Find Median in Stream of Integers', difficulty: 'Hard', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/find-median-from-data-stream/' },
      { id: 's146', title: 'Count Distinct Elements in Every K Window', difficulty: 'Easy', topic: 'Hashing', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-distinct-elements-in-every-window-of-size-k/' },
      { id: 's147', title: 'Kth Largest Element in Stream', difficulty: 'Easy', topic: 'Heaps', platform: 'leetcode', link: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
      { id: 's148', title: 'Flood Fill', difficulty: 'Easy', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/flood-fill/' },
      // Day 23: Graph
      { id: 's149', title: 'Clone Graph', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/clone-graph/' },
      { id: 's150', title: 'DFS of Graph', difficulty: 'Easy', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1' },
      { id: 's151', title: 'BFS of Graph', difficulty: 'Easy', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph/1' },
      { id: 's152', title: 'Detect Cycle in Undirected Graph (DFS)', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1' },
      { id: 's153', title: 'Detect Cycle in Undirected Graph (BFS)', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1' },
      { id: 's154', title: 'Detect Cycle in Directed Graph (DFS)', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1' },
      { id: 's155', title: 'Topological Sort (DFS)', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/topological-sort/1' },
      { id: 's156', title: 'Topological Sort (BFS/Kahn\'s Algorithm)', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/topological-sort/1' },
      { id: 's157', title: 'Number of Islands', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/number-of-islands/' },
      { id: 's158', title: 'Bipartite Graph (BFS)', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/is-graph-bipartite/' },
      { id: 's159', title: 'Bipartite Graph (DFS)', difficulty: 'Medium', topic: 'Graph', platform: 'leetcode', link: 'https://leetcode.com/problems/is-graph-bipartite/' },
      // Day 24: Graph Part 2
      { id: 's160', title: 'Dijkstra\'s Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1' },
      { id: 's161', title: 'Bellman Ford Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/' },
      { id: 's162', title: 'Floyd Warshall Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1' },
      { id: 's163', title: 'MST using Prim\'s Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1' },
      { id: 's164', title: 'MST using Kruskal\'s Algorithm', difficulty: 'Medium', topic: 'Graph', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1' },
      // Day 25: Dynamic Programming
      { id: 's165', title: 'Maximum Product Subarray', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-product-subarray/' },
      { id: 's166', title: 'Longest Increasing Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { id: 's167', title: 'Longest Common Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { id: 's168', title: '0-1 Knapsack', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1' },
      { id: 's169', title: 'Edit Distance', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/edit-distance/' },
      { id: 's170', title: 'Maximum Sum Increasing Subsequence', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/maximum-sum-increasing-subsequence4749/1' },
      { id: 's171', title: 'Matrix Chain Multiplication', difficulty: 'Hard', topic: 'DP', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1' },
      // Day 26: Dynamic Programming Part 2
      { id: 's172', title: 'Maximum Sum Path in Matrix', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://www.geeksforgeeks.org/minimum-maximum-path-to-reach-target-in-matrix/' },
      { id: 's173', title: 'Coin Change', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/coin-change/' },
      { id: 's174', title: 'Subset Sum Problem', difficulty: 'Medium', topic: 'DP', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1' },
      { id: 's175', title: 'Rod Cutting Problem', difficulty: 'Easy', topic: 'DP', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/rod-cutting0840/1' },
      { id: 's176', title: 'Egg Dropping Problem', difficulty: 'Hard', topic: 'DP', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/egg-dropping-puzzle-1587115620/1' },
      { id: 's177', title: 'Word Break', difficulty: 'Medium', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/word-break/' },
      { id: 's178', title: 'Palindrome Partitioning II', difficulty: 'Hard', topic: 'DP', platform: 'leetcode', link: 'https://leetcode.com/problems/palindrome-partitioning-ii/' },
      // Day 27: Trie
      { id: 's179', title: 'Implement Trie', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
      { id: 's180', title: 'Implement Trie II', difficulty: 'Medium', topic: 'Trie', platform: 'gfg', link: 'https://www.geeksforgeeks.org/trie-insert-and-search/' },
      { id: 's181', title: 'Longest String with All Prefixes', difficulty: 'Medium', topic: 'Trie', platform: 'gfg', link: 'https://www.geeksforgeeks.org/longest-word-in-dictionary/' },
      { id: 's182', title: 'Number of Distinct Substrings', difficulty: 'Hard', topic: 'Trie', platform: 'gfg', link: 'https://www.geeksforgeeks.org/count-distinct-substrings-string-using-suffix-trie/' },
      { id: 's183', title: 'Maximum XOR of Two Numbers', difficulty: 'Medium', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/' },
      { id: 's184', title: 'Maximum XOR with Element from Array', difficulty: 'Hard', topic: 'Trie', platform: 'leetcode', link: 'https://leetcode.com/problems/maximum-xor-with-an-element-from-array/' },
      // Additional Problems (185-191)
      { id: 's185', title: 'Job Sequencing Problem', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1' },
      { id: 's186', title: 'Minimum Number of Platforms', difficulty: 'Medium', topic: 'Greedy', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1' },
      { id: 's187', title: 'Aggressive Cows', difficulty: 'Hard', topic: 'Binary Search', platform: 'spoj', link: 'https://www.spoj.com/problems/AGGRCOW/' },
      { id: 's188', title: 'Allocate Minimum Pages', difficulty: 'Hard', topic: 'Binary Search', platform: 'gfg', link: 'https://practice.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1' },
      { id: 's189', title: 'Painters Partition Problem', difficulty: 'Hard', topic: 'Binary Search', platform: 'gfg', link: 'https://www.geeksforgeeks.org/painters-partition-problem/' },
      { id: 's190', title: 'ROTI (Prata - SPOJ)', difficulty: 'Medium', topic: 'Binary Search', platform: 'spoj', link: 'https://www.spoj.com/problems/PRATA/' },
      { id: 's191', title: 'Square Root using Binary Search', difficulty: 'Easy', topic: 'Binary Search', platform: 'leetcode', link: 'https://leetcode.com/problems/sqrtx/' },
    ],

    // NEETCODE 150 - Complete LeetCode Curated Problems (All 150)
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

    // BLIND 75 - Essential Interview Questions
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
    ],

    // LOVE BABBAR'S 450 - Comprehensive DSA Sheet
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
    ],

    // FRAZ'S LIST - Top Interview Questions
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
    ]
  };

  // Get problems based on selected sheet
  const getProblemsForSheet = (sheet) => {
    return allSheetProblems[sheet] || allSheetProblems.striver;
  };

  const problems = getProblemsForSheet(selectedSheet);

  // Filter problems by topic and search
  const filteredProblems = problems.filter(problem => {
    const matchesTopic = selectedTopic === 'all' || problem.topic === selectedTopic;
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  // Get unique topics
  const topics = ['all', ...new Set(problems.map(p => p.topic))];

  // Calculate statistics
  const totalProblems = problems.length;
  const solvedCount = solvedProblems.size;
  const progressPercent = Math.round((solvedCount / totalProblems) * 100);

  // Calculate topic-wise stats
  const topicStats = topics.slice(1).map(topic => {
    const topicProblems = problems.filter(p => p.topic === topic);
    const topicSolved = topicProblems.filter(p => solvedProblems.has(p.id)).length;
    return {
      topic,
      total: topicProblems.length,
      solved: topicSolved,
      percent: Math.round((topicSolved / topicProblems.length) * 100)
    };
  });

  // Toggle problem solved status
  const toggleProblem = (problemId) => {
    const newSolved = new Set(solvedProblems);
    if (newSolved.has(problemId)) {
      newSolved.delete(problemId);
    } else {
      newSolved.add(problemId);
    }
    setSolvedProblems(newSolved);
  };

  // Open problem link
  const openProblem = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div className="dsa-tracker-new">
      {/* Header */}
      <div className="tracker-header">
        <div className="header-content">
          <h1>🎯 DSA Problem Tracker</h1>
          <p>Master Data Structures & Algorithms with popular curated sheets</p>
        </div>
        <div className="overall-stats">
          <div className="stat-card">
            <div className="stat-value">{solvedCount}</div>
            <div className="stat-label">Solved</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalProblems}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{progressPercent}%</div>
            <div className="stat-label">Progress</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar-new">
          <div 
            className="progress-fill-new" 
            style={{ width: `${progressPercent}%` }}
          >
            <span className="progress-text-new">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Sheet Selection */}
      <div className="sheet-selection">
        <h2>📚 Choose Your Learning Path</h2>
        <div className="sheets-grid">
          {Object.entries(dsaSheets).map(([key, sheet]) => (
            <div
              key={key}
              className={`sheet-card ${selectedSheet === key ? 'active' : ''}`}
              onClick={() => setSelectedSheet(key)}
              style={{ borderColor: selectedSheet === key ? sheet.color : '#ddd' }}
            >
              <div className="sheet-icon" style={{ background: sheet.color }}>
                {sheet.icon}
              </div>
              <h3>{sheet.name}</h3>
              <p>{sheet.description}</p>
              <div className="sheet-meta">
                <span className="problem-count">{sheet.totalProblems} problems</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic-wise Statistics */}
      <div className="topic-stats-section">
        <h2>📊 Topic-wise Progress</h2>
        <div className="topic-stats-grid">
          {topicStats.map(stat => (
            <div key={stat.topic} className="topic-stat-card">
              <div className="topic-name">{stat.topic}</div>
              <div className="topic-progress">
                <div className="topic-progress-bar">
                  <div 
                    className="topic-progress-fill" 
                    style={{ width: `${stat.percent}%` }}
                  ></div>
                </div>
                <div className="topic-numbers">
                  {stat.solved}/{stat.total}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="topic-filters">
          {topics.map(topic => (
            <button
              key={topic}
              className={`filter-btn ${selectedTopic === topic ? 'active' : ''}`}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic === 'all' ? 'All Topics' : topic}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table */}
      <div className="problems-section">
        <div className="problems-header">
          <h2>📝 Problems ({filteredProblems.length})</h2>
        </div>
        <div className="problems-table">
          <div className="table-header">
            <div className="col-status">Status</div>
            <div className="col-title">Problem Title</div>
            <div className="col-difficulty">Difficulty</div>
            <div className="col-topic">Topic</div>
            <div className="col-platform">Platform</div>
            <div className="col-action">Action</div>
          </div>
          <div className="table-body">
            {filteredProblems.map(problem => {
              const isSolved = solvedProblems.has(problem.id);
              return (
                <div 
                  key={problem.id} 
                  className={`table-row ${isSolved ? 'solved' : ''}`}
                >
                  <div className="col-status">
                    <input
                      type="checkbox"
                      checked={isSolved}
                      onChange={() => toggleProblem(problem.id)}
                      className="problem-checkbox"
                    />
                  </div>
                  <div className="col-title">
                    {isSolved && <span className="check-icon">✅</span>}
                    <span className={isSolved ? 'solved-text' : ''}>{problem.title}</span>
                  </div>
                  <div className="col-difficulty">
                    <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="col-topic">
                    <span className="topic-badge">{problem.topic}</span>
                  </div>
                  <div className="col-platform">
                    <span className={`platform-badge ${problem.platform}`}>
                      {problem.platform === 'leetcode' ? 'LeetCode' : 
                       problem.platform === 'gfg' ? 'GFG' : 
                       problem.platform === 'spoj' ? 'SPOJ' : problem.platform}
                    </span>
                  </div>
                  <div className="col-action">
                    <button
                      className="solve-btn"
                      onClick={() => openProblem(problem.link)}
                    >
                      Solve →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSATracker;
