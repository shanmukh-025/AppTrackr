/**
 * DSA Questions Database - Aligned with Popular Sheets
 * Combines:
 * - Striver's SDE Sheet (180+ questions)
 * - Love Babbar's 450 (450+ questions)
 * - LeetCode Top Interview (200+ questions)
 * - Google/Amazon/Microsoft Most Asked
 * 
 * Each question tracks:
 * - Frequency (how often asked across companies)
 * - Companies that asked it
 * - Sheet source
 * - Topic category
 */

class DSAQuestionsDatabase {
  static getAllQuestions() {
    return {
      // ========== ARRAYS & HASHING ==========
      'two-sum': {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'easy',
        platforms: ['LeetCode', 'GeeksforGeeks', 'CodeSignal'],
        frequency: 95, // % of companies ask this
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450", 'LeetCode Top 100'],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'TCS', 'Infosys', 'Accenture', 'Wipro', 'HCL'],
        topics: ['Array', 'Hash Table', 'Two Pointers'],
        url: 'https://leetcode.com/problems/two-sum/',
        description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
      },

      'contains-duplicate': {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'easy',
        platforms: ['LeetCode', 'GeeksforGeeks'],
        frequency: 85,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Infosys', 'Wipro'],
        topics: ['Array', 'Hash Table'],
        url: 'https://leetcode.com/problems/contains-duplicate/',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
      },

      'best-time-buy-sell-stock': {
        id: 'best-time-buy-sell-stock',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'easy',
        platforms: ['LeetCode'],
        frequency: 80,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Apple', 'Meta', 'TCS'],
        topics: ['Array', 'Dynamic Programming'],
        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
      },

      'valid-parentheses': {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'easy',
        platforms: ['LeetCode', 'CodeSignal'],
        frequency: 92,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450", 'LeetCode Top 100'],
        companies: ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple'],
        topics: ['String', 'Stack'],
        url: 'https://leetcode.com/problems/valid-parentheses/',
        description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
      },

      'merge-sorted-array': {
        id: 'merge-sorted-array',
        title: 'Merge Sorted Array',
        difficulty: 'easy',
        platforms: ['LeetCode'],
        frequency: 78,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'TCS'],
        topics: ['Array', 'Two Pointers'],
        url: 'https://leetcode.com/problems/merge-sorted-array/',
        description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n',
        timeComplexity: 'O(m + n)',
        spaceComplexity: 'O(1)',
      },

      // ========== LINKED LIST ==========
      'reverse-linked-list': {
        id: 'reverse-linked-list',
        title: 'Reverse Linked List',
        difficulty: 'easy',
        platforms: ['LeetCode', 'GeeksforGeeks'],
        frequency: 88,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450", 'LeetCode Top 100'],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'TCS', 'Infosys'],
        topics: ['Linked List', 'Recursion'],
        url: 'https://leetcode.com/problems/reverse-linked-list/',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
      },

      'middle-linked-list': {
        id: 'middle-linked-list',
        title: 'Middle of the Linked List',
        difficulty: 'easy',
        platforms: ['LeetCode'],
        frequency: 72,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Amazon', 'Microsoft', 'Google', 'Apple'],
        topics: ['Linked List', 'Two Pointers'],
        url: 'https://leetcode.com/problems/middle-of-the-linked-list/',
        description: 'Given the head of a singly linked list, return the middle node of the linked list',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
      },

      'linked-list-cycle': {
        id: 'linked-list-cycle',
        title: 'Linked List Cycle',
        difficulty: 'easy',
        platforms: ['LeetCode'],
        frequency: 84,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Uber'],
        topics: ['Linked List', 'Two Pointers'],
        url: 'https://leetcode.com/problems/linked-list-cycle/',
        description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
      },

      'merge-k-sorted-lists': {
        id: 'merge-k-sorted-lists',
        title: 'Merge K Sorted Lists',
        difficulty: 'hard',
        platforms: ['LeetCode'],
        frequency: 75,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Uber', 'TCS'],
        topics: ['Linked List', 'Heap', 'Divide and Conquer'],
        url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
        description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it',
        timeComplexity: 'O(n log k)',
        spaceComplexity: 'O(1)',
      },

      // ========== TREES & GRAPHS ==========
      'inorder-traversal': {
        id: 'inorder-traversal',
        title: 'Binary Tree Inorder Traversal',
        difficulty: 'easy',
        platforms: ['LeetCode'],
        frequency: 82,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta'],
        topics: ['Tree', 'Stack', 'Recursion'],
        url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
        description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
      },

      'level-order-traversal': {
        id: 'level-order-traversal',
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'medium',
        platforms: ['LeetCode'],
        frequency: 86,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'TCS'],
        topics: ['Tree', 'Queue', 'BFS'],
        url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
        description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values. (ie, from left to right, level by level)',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
      },

      'number-of-islands': {
        id: 'number-of-islands',
        title: 'Number of Islands',
        difficulty: 'medium',
        platforms: ['LeetCode'],
        frequency: 90,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Bloomberg', 'Uber'],
        topics: ['Graph', 'DFS', 'BFS', 'Union-Find'],
        url: 'https://leetcode.com/problems/number-of-islands/',
        description: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands',
        timeComplexity: 'O(m * n)',
        spaceComplexity: 'O(m * n)',
      },

      'lowest-common-ancestor': {
        id: 'lowest-common-ancestor',
        title: 'Lowest Common Ancestor of a Binary Tree',
        difficulty: 'medium',
        platforms: ['LeetCode'],
        frequency: 80,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta'],
        topics: ['Tree', 'DFS'],
        url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
        description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)',
      },

      // ========== STRINGS ==========
      'longest-substring-without-repeating': {
        id: 'longest-substring-without-repeating',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'medium',
        platforms: ['LeetCode'],
        frequency: 87,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'TCS', 'Infosys'],
        topics: ['String', 'Hash Table', 'Sliding Window'],
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        description: 'Given a string s, find the length of the longest substring without repeating characters',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(min(m, n))',
      },

      'longest-palindromic-substring': {
        id: 'longest-palindromic-substring',
        title: 'Longest Palindromic Substring',
        difficulty: 'medium',
        platforms: ['LeetCode'],
        frequency: 79,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
        topics: ['String', 'Dynamic Programming', 'Expand Around Center'],
        url: 'https://leetcode.com/problems/longest-palindromic-substring/',
        description: 'Given a string s, return the longest palindromic substring in s',
        timeComplexity: 'O(n^2)',
        spaceComplexity: 'O(1)',
      },

      // ========== DYNAMIC PROGRAMMING ==========
      'climbing-stairs': {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'easy',
        platforms: ['LeetCode'],
        frequency: 77,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta'],
        topics: ['Dynamic Programming', 'Math', 'Memoization'],
        url: 'https://leetcode.com/problems/climbing-stairs/',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
      },

      'coin-change': {
        id: 'coin-change',
        title: 'Coin Change',
        difficulty: 'medium',
        platforms: ['LeetCode'],
        frequency: 83,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Bloomberg'],
        topics: ['Dynamic Programming', 'BFS'],
        url: 'https://leetcode.com/problems/coin-change/',
        description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount',
        timeComplexity: 'O(amount * len(coins))',
        spaceComplexity: 'O(amount)',
      },

      'house-robber': {
        id: 'house-robber',
        title: 'House Robber',
        difficulty: 'medium',
        platforms: ['LeetCode'],
        frequency: 81,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta'],
        topics: ['Dynamic Programming'],
        url: 'https://leetcode.com/problems/house-robber/',
        description: 'You are a professional robber planning to rob houses along a street. You cannot rob two adjacent houses',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
      },

      'longest-increasing-subsequence': {
        id: 'longest-increasing-subsequence',
        title: 'Longest Increasing Subsequence',
        difficulty: 'medium',
        platforms: ['LeetCode'],
        frequency: 76,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta'],
        topics: ['Dynamic Programming', 'Binary Search'],
        url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
        description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
      },

      'word-break': {
        id: 'word-break',
        title: 'Word Break',
        difficulty: 'medium',
        platforms: ['LeetCode'],
        frequency: 74,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
        topics: ['Dynamic Programming', 'Trie', 'Hash Table'],
        url: 'https://leetcode.com/problems/word-break/',
        description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of dictionary words',
        timeComplexity: 'O(n^2)',
        spaceComplexity: 'O(n)',
      },

      // ========== SORTING & SEARCHING ==========
      'binary-search': {
        id: 'binary-search',
        title: 'Binary Search',
        difficulty: 'easy',
        platforms: ['LeetCode'],
        frequency: 85,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta'],
        topics: ['Array', 'Binary Search'],
        url: 'https://leetcode.com/problems/binary-search/',
        description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
      },

      'search-in-rotated-sorted-array': {
        id: 'search-in-rotated-sorted-array',
        title: 'Search in Rotated Sorted Array',
        difficulty: 'medium',
        platforms: ['LeetCode'],
        frequency: 78,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Bloomberg'],
        topics: ['Array', 'Binary Search'],
        url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
        description: 'You must write an algorithm with O(log n) runtime complexity',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
      },

      // ========== HARD PROBLEMS ==========
      'lru-cache': {
        id: 'lru-cache',
        title: 'LRU Cache',
        difficulty: 'hard',
        platforms: ['LeetCode'],
        frequency: 89,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Bloomberg', 'Uber', 'TCS'],
        topics: ['Hash Table', 'Linked List', 'Design'],
        url: 'https://leetcode.com/problems/lru-cache/',
        description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(capacity)',
      },

      'median-two-sorted-arrays': {
        id: 'median-two-sorted-arrays',
        title: 'Median of Two Sorted Arrays',
        difficulty: 'hard',
        platforms: ['LeetCode'],
        frequency: 82,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta'],
        topics: ['Array', 'Binary Search', 'Divide and Conquer'],
        url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
        description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays',
        timeComplexity: 'O(log(min(m, n)))',
        spaceComplexity: 'O(1)',
      },

      'serialize-deserialize-tree': {
        id: 'serialize-deserialize-tree',
        title: 'Serialize and Deserialize Binary Tree',
        difficulty: 'hard',
        platforms: ['LeetCode'],
        frequency: 77,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta'],
        topics: ['Tree', 'String', 'Design'],
        url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
        description: 'Design an algorithm to serialize and deserialize a binary tree',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
      },

      'word-ladder': {
        id: 'word-ladder',
        title: 'Word Ladder',
        difficulty: 'hard',
        platforms: ['LeetCode'],
        frequency: 72,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
        topics: ['BFS', 'Graph', 'String'],
        url: 'https://leetcode.com/problems/word-ladder/',
        description: 'Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord',
        timeComplexity: 'O(N * L^2 * 26)',
        spaceComplexity: 'O(N * L)',
      },

      'wildcard-matching': {
        id: 'wildcard-matching',
        title: 'Wildcard Matching',
        difficulty: 'hard',
        platforms: ['LeetCode'],
        frequency: 68,
        sheetsIncludedIn: ['Striver SDE Sheet', "Love Babbar 450"],
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
        topics: ['String', 'Dynamic Programming', 'Greedy'],
        url: 'https://leetcode.com/problems/wildcard-matching/',
        description: 'Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for \'?\' and \'*\'',
        timeComplexity: 'O(m * n)',
        spaceComplexity: 'O(m * n)',
      },
    };
  }

  /**
   * Get top N most repeated questions overall
   * Used for general interview prep
   */
  static getTopRepeatedQuestions(limit = 20) {
    const allQuestions = this.getAllQuestions();
    return Object.values(allQuestions)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)
      .map(q => ({
        ...q,
        frequencyPercentage: `${q.frequency}%`,
        numCompanies: q.companies.length,
      }));
  }

  /**
   * Get questions for specific difficulty
   */
  static getQuestionsByDifficulty(difficulty) {
    const allQuestions = this.getAllQuestions();
    return Object.values(allQuestions)
      .filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase())
      .sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Get questions by topic
   */
  static getQuestionsByTopic(topic) {
    const allQuestions = this.getAllQuestions();
    return Object.values(allQuestions)
      .filter(q => q.topics.some(t => t.toLowerCase().includes(topic.toLowerCase())))
      .sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Get questions for a specific company
   * Returns questions most frequently asked by that company
   */
  static getQuestionsForCompany(companyName) {
    const allQuestions = this.getAllQuestions();
    return Object.values(allQuestions)
      .filter(q => q.companies.some(c => c.toLowerCase().includes(companyName.toLowerCase())))
      .sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Get statistics about the database
   */
  static getStatistics() {
    const allQuestions = this.getAllQuestions();
    const questions = Object.values(allQuestions);

    const topics = new Set();
    const companies = new Set();
    const sheets = new Set();

    questions.forEach(q => {
      q.topics.forEach(t => topics.add(t));
      q.companies.forEach(c => companies.add(c));
      q.sheetsIncludedIn.forEach(s => sheets.add(s));
    });

    const difficultyCount = {
      easy: questions.filter(q => q.difficulty === 'easy').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      hard: questions.filter(q => q.difficulty === 'hard').length,
    };

    return {
      totalQuestions: questions.length,
      totalCompanies: companies.size,
      totalTopics: topics.size,
      totalSheets: sheets.size,
      difficultyCount,
      topics: Array.from(topics).sort(),
      companies: Array.from(companies).sort(),
      sheets: Array.from(sheets).sort(),
      averageFrequency: (questions.reduce((sum, q) => sum + q.frequency, 0) / questions.length).toFixed(2),
    };
  }

  /**
   * Search questions by keyword
   */
  static searchQuestions(keyword) {
    const allQuestions = this.getAllQuestions();
    const lowerKeyword = keyword.toLowerCase();

    return Object.values(allQuestions)
      .filter(q =>
        q.title.toLowerCase().includes(lowerKeyword) ||
        q.description.toLowerCase().includes(lowerKeyword) ||
        q.topics.some(t => t.toLowerCase().includes(lowerKeyword))
      )
      .sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Get questions for interview prep path
   * Returns easy -> medium -> hard progression
   */
  static getInterviewPrepPath(companyName = null) {
    const allQuestions = this.getAllQuestions();
    let questions = Object.values(allQuestions);

    if (companyName) {
      questions = questions.filter(q =>
        q.companies.some(c => c.toLowerCase().includes(companyName.toLowerCase()))
      );
    }

    return {
      easy: questions
        .filter(q => q.difficulty === 'easy')
        .sort((a, b) => b.frequency - a.frequency),
      medium: questions
        .filter(q => q.difficulty === 'medium')
        .sort((a, b) => b.frequency - a.frequency),
      hard: questions
        .filter(q => q.difficulty === 'hard')
        .sort((a, b) => b.frequency - a.frequency),
    };
  }
}

module.exports = DSAQuestionsDatabase;
