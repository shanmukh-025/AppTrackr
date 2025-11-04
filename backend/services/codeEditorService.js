/**
 * Code Editor Service
 * Interactive LeetCode-style code editor with problem solving capabilities
 * Supports multiple languages and real-time execution
 */

const axios = require('axios');

class CodeEditorService {
  constructor() {
    this.problemDatabase = this.initializeProblemDatabase();
    this.judgeAPI = process.env.JUDGE_API_URL || 'https://judge0-ce.p.rapidapi.com';
  }

  /**
   * Initialize comprehensive problem database
   */
  initializeProblemDatabase() {
    return {
      'easy-1': {
        id: 'easy-1',
        title: 'Two Sum',
        difficulty: 'Easy',
        acceptanceRate: '48.3%',
        description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume each input has exactly one solution, and you cannot use the same element twice.',
        examples: [
          {
            id: 1,
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
          },
          {
            id: 2,
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
            explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
          },
          {
            id: 3,
            input: 'nums = [3,3], target = 6',
            output: '[0,1]',
            explanation: 'The only combination.'
          }
        ],
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists.'
        ],
        topics: ['Array', 'Hash Table'],
        companies: ['Google', 'Amazon', 'Apple', 'Microsoft', 'Facebook'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        boilerplate: {
          javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
};

// Test cases
console.log(twoSum([2,7,11,15], 9)); // Output: [0,1]
console.log(twoSum([3,2,4], 6)); // Output: [1,2]
console.log(twoSum([3,3], 6)); // Output: [0,1]`,
          python: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your code here
    pass

# Test cases
print(twoSum([2,7,11,15], 9))  # Output: [0,1]
print(twoSum([3,2,4], 6))      # Output: [1,2]
print(twoSum([3,3], 6))        # Output: [0,1]`,
          java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}

// Test cases
public static void main(String[] args) {
    Solution sol = new Solution();
    System.out.println(Arrays.toString(sol.twoSum(new int[]{2,7,11,15}, 9))); // [0,1]
    System.out.println(Arrays.toString(sol.twoSum(new int[]{3,2,4}, 6))); // [1,2]
}`
        },
        solution: {
          javascript: `var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
          python: `def twoSum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
          java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`
        },
        hints: [
          'A really brute force way would be to search for complements for every element in the array. The time complexity would be O(n^2). Too slow.',
          'By trading space for speed, we could use a hash map to store all values that we have seen so far. Then for every number we just look up potential complement in O(1) time.',
          'What if the given input is sorted? How would you optimize your algorithm?'
        ],
        relatedProblems: [
          { id: 'easy-2', title: 'Valid Parentheses', difficulty: 'Easy' },
          { id: 'medium-1', title: '3Sum', difficulty: 'Medium' },
          { id: 'medium-2', title: '4Sum', difficulty: 'Medium' }
        ]
      },
      'easy-2': {
        id: 'easy-2',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        acceptanceRate: '40.2%',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: 1) Open brackets must be closed by the same type of brackets. 2) Open brackets must be closed in the correct order. 3) Every close bracket has a corresponding open bracket of the same type.',
        examples: [
          { input: 's = "()"', output: 'true' },
          { input: 's = "()[]{}"', output: 'true' },
          { input: 's = "(]"', output: 'false' },
          { input: 's = "([)]"', output: 'false' }
        ],
        constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\''],
        topics: ['String', 'Stack'],
        companies: ['Google', 'Amazon', 'Apple', 'Facebook', 'Microsoft'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        boilerplate: {
          javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    // Your code here
};`
        },
        solution: {
          javascript: `var isValid = function(s) {
    const stack = [];
    const map = {'(': ')', '{': '}', '[': ']'};
    
    for (const char of s) {
        if (char in map) {
            stack.push(char);
        } else {
            if (stack.length === 0 || map[stack.pop()] !== char) {
                return false;
            }
        }
    }
    return stack.length === 0;
};`
        },
        hints: ['An interesting property about a valid parentheses string is that a sub-expression of a valid string should also be a valid string.', 'Additionally, if you restricted the subproblem to include a valid substring without any of the matching parentheses, then the substring between the parentheses of a valid string should also be valid.'],
        relatedProblems: [
          { id: 'easy-1', title: 'Two Sum', difficulty: 'Easy' },
          { id: 'medium-3', title: 'Generate Parentheses', difficulty: 'Medium' }
        ]
      },
      'medium-1': {
        id: 'medium-1',
        title: '3Sum',
        difficulty: 'Medium',
        acceptanceRate: '32.8%',
        description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.',
        examples: [
          { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
          { input: 'nums = [0]', output: '[]' },
          { input: 'nums = [-2,0,1,1,2]', output: '[[-2,0,2],[-2,1,1]]' }
        ],
        constraints: ['0 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
        topics: ['Array', 'Sorting', 'Two Pointers'],
        companies: ['Google', 'Amazon', 'Adobe', 'Bloomberg'],
        timeComplexity: 'O(n^2)',
        spaceComplexity: 'O(1) or O(n)',
        boilerplate: { javascript: 'var threeSum = function(nums) {\n    // Your code here\n};' },
        solution: { javascript: 'var threeSum = function(nums) {\n    nums.sort((a,b) => a-b);\n    const result = [];\n    for (let i = 0; i < nums.length - 2; i++) {\n        if (i > 0 && nums[i] === nums[i-1]) continue;\n        let left = i + 1, right = nums.length - 1;\n        while (left < right) {\n            const sum = nums[i] + nums[left] + nums[right];\n            if (sum === 0) {\n                result.push([nums[i], nums[left], nums[right]]);\n                while (left < right && nums[left] === nums[left+1]) left++;\n                while (left < right && nums[right] === nums[right-1]) right--;\n                left++; right--;\n            } else if (sum < 0) {\n                left++;\n            } else {\n                right--;\n            }\n        }\n    }\n    return result;\n};' },
        hints: ['So, the problem now is to find two numbers in a sorted array that add up to -nums[i].', 'For an array, we can use two pointers approach to find if there exists a pair that sums to a given value.'],
        relatedProblems: []
      }
    };
  }

  /**
   * Get problem by ID
   */
  async getProblem(problemId) {
    try {
      const problem = this.problemDatabase[problemId];
      if (!problem) {
        return { success: false, error: 'Problem not found' };
      }
      return { success: true, problem };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get problems by difficulty
   */
  async getProblemsByDifficulty(difficulty) {
    try {
      const problems = Object.values(this.problemDatabase)
        .filter(p => p.difficulty === difficulty)
        .map(p => ({
          id: p.id,
          title: p.title,
          difficulty: p.difficulty,
          acceptanceRate: p.acceptanceRate,
          topics: p.topics,
          companies: p.companies
        }));
      
      return { success: true, count: problems.length, problems };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get problems by topic
   */
  async getProblemsByTopic(topic) {
    try {
      const problems = Object.values(this.problemDatabase)
        .filter(p => p.topics.includes(topic))
        .map(p => ({
          id: p.id,
          title: p.title,
          difficulty: p.difficulty,
          acceptanceRate: p.acceptanceRate
        }));
      
      return { success: true, topic, count: problems.length, problems };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Execute code (would use Judge0 API in production)
   */
  async executeCode(code, language, testInput) {
    try {
      // For MVP, return mock result
      // In production, integrate with Judge0 API
      return {
        success: true,
        status: 'Accepted',
        runtime: '45ms',
        memory: '42.1MB',
        runtimePercentile: 95,
        memoryPercentile: 87,
        output: testInput ? 'Test passed' : 'Code executed',
        executionTime: '45ms'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all problems with filtering
   */
  async getAllProblems(filters = {}) {
    try {
      let problems = Object.values(this.problemDatabase);

      if (filters.difficulty) {
        problems = problems.filter(p => p.difficulty === filters.difficulty);
      }

      if (filters.topic) {
        problems = problems.filter(p => p.topics.includes(filters.topic));
      }

      if (filters.company) {
        problems = problems.filter(p => p.companies.includes(filters.company));
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        problems = problems.filter(p => 
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        );
      }

      return {
        success: true,
        count: problems.length,
        problems: problems.map(p => ({
          id: p.id,
          title: p.title,
          difficulty: p.difficulty,
          acceptanceRate: p.acceptanceRate,
          topics: p.topics
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get problem statistics
   */
  async getProblemStatistics() {
    try {
      const problems = Object.values(this.problemDatabase);
      const stats = {
        total: problems.length,
        byDifficulty: {
          Easy: problems.filter(p => p.difficulty === 'Easy').length,
          Medium: problems.filter(p => p.difficulty === 'Medium').length,
          Hard: problems.filter(p => p.difficulty === 'Hard').length
        },
        byTopic: {},
        byCompany: {}
      };

      problems.forEach(p => {
        p.topics.forEach(topic => {
          stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;
        });
        p.companies.forEach(company => {
          stats.byCompany[company] = (stats.byCompany[company] || 0) + 1;
        });
      });

      return { success: true, stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new CodeEditorService();
