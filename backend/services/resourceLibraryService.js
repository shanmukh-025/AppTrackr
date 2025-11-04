/**
 * Resource Library Service
 * Curated YouTube videos, articles, blogs, books, podcasts
 * All categorized and searchable
 */

class ResourceLibraryService {
  constructor() {
    this.resources = this.initializeResourceLibrary();
  }

  /**
   * Initialize comprehensive resource library
   */
  initializeResourceLibrary() {
    return {
      videos: [
        {
          id: 'vid-1',
          title: 'Complete Data Structures & Algorithms Course',
          channel: 'Striver',
          duration: '50 hours',
          difficulty: 'Beginner to Advanced',
          topics: ['Array', 'String', 'Trees', 'Graphs', 'DP'],
          url: 'https://youtube.com/watch?v=xxx',
          rating: 4.9,
          views: '2.5M'
        },
        {
          id: 'vid-2',
          title: 'System Design Master Class',
          channel: 'Design Gurus',
          duration: '20 hours',
          difficulty: 'Hard',
          topics: ['System Design', 'Scalability', 'Architecture'],
          url: 'https://youtube.com/watch?v=yyy',
          rating: 4.8,
          views: '1.2M'
        },
        {
          id: 'vid-3',
          title: 'React Complete Guide 2024',
          channel: 'Maximilian Schwarzmüller',
          duration: '40 hours',
          difficulty: 'Intermediate',
          topics: ['React', 'JavaScript', 'Web Development'],
          url: 'https://youtube.com/watch?v=zzz',
          rating: 4.7,
          views: '3M'
        },
        {
          id: 'vid-4',
          title: 'JavaScript Mastery',
          channel: 'JavaScript Mastery',
          duration: '30 hours',
          difficulty: 'Beginner to Intermediate',
          topics: ['JavaScript', 'ES6+', 'Advanced Concepts'],
          url: 'https://youtube.com/watch?v=aaa',
          rating: 4.8,
          views: '2.8M'
        }
      ],
      articles: [
        {
          id: 'art-1',
          title: 'Understanding Binary Search Trees',
          author: 'GeeksforGeeks',
          platform: 'GeeksforGeeks',
          readTime: '15 mins',
          difficulty: 'Intermediate',
          topics: ['Data Structures', 'Trees'],
          url: 'https://geeksforgeeks.org/binary-search-tree',
          rating: 4.6
        },
        {
          id: 'art-2',
          title: 'System Design Interview Questions Explained',
          author: 'ByteByteGo',
          platform: 'ByteByteGo',
          readTime: '20 mins',
          difficulty: 'Hard',
          topics: ['System Design', 'Interviews'],
          url: 'https://bytebytego.com/system-design',
          rating: 4.9
        },
        {
          id: 'art-3',
          title: 'The STAR Method for Behavioral Interviews',
          author: 'HackerRank',
          platform: 'HackerRank',
          readTime: '10 mins',
          difficulty: 'Easy',
          topics: ['Behavioral', 'Interviews'],
          url: 'https://hackerrank.com/star-method',
          rating: 4.7
        },
        {
          id: 'art-4',
          title: 'React Hooks Deep Dive',
          author: 'LogRocket Blog',
          platform: 'LogRocket',
          readTime: '18 mins',
          difficulty: 'Intermediate',
          topics: ['React', 'JavaScript'],
          url: 'https://logrocket.com/react-hooks',
          rating: 4.5
        }
      ],
      books: [
        {
          id: 'book-1',
          title: 'Cracking the Coding Interview',
          author: 'Gayle Laakmann McDowell',
          publisher: 'CareerCup',
          pages: 687,
          difficulty: 'All Levels',
          topics: ['Algorithms', 'DSA', 'Interviews'],
          rating: 4.8,
          price: '$49.99'
        },
        {
          id: 'book-2',
          title: 'Introduction to Algorithms (CLRS)',
          author: 'Cormen, Leiserson, Rivest, Stein',
          publisher: 'MIT Press',
          pages: 1312,
          difficulty: 'Advanced',
          topics: ['Algorithms', 'Computer Science'],
          rating: 4.7,
          price: '$89.99'
        },
        {
          id: 'book-3',
          title: 'Designing Data-Intensive Applications',
          author: 'Martin Kleppmann',
          publisher: "O'Reilly",
          pages: 616,
          difficulty: 'Hard',
          topics: ['System Design', 'Architecture', 'Databases'],
          rating: 4.9,
          price: '$59.99'
        },
        {
          id: 'book-4',
          title: 'The Pragmatic Programmer',
          author: 'Hunt & Thomas',
          publisher: 'Addison-Wesley',
          pages: 352,
          difficulty: 'Intermediate',
          topics: ['Software Development', 'Best Practices'],
          rating: 4.6,
          price: '$59.99'
        }
      ],
      podcasts: [
        {
          id: 'pod-1',
          name: 'Software Engineering Daily',
          host: 'Jeff Meyerson',
          frequency: 'Daily',
          episodes: '1000+',
          topics: ['Technology', 'Interviews', 'Career'],
          rating: 4.7,
          url: 'https://podcasts.apple.com/softwareengineeringdaily'
        },
        {
          id: 'pod-2',
          name: 'The Tech Interview Handbook Podcast',
          host: 'Yangshun Tay',
          frequency: 'Weekly',
          episodes: '50+',
          topics: ['Interviews', 'Career', 'Algorithms'],
          rating: 4.8,
          url: 'https://podcasts.apple.com/techinterviewhandbook'
        },
        {
          id: 'pod-3',
          name: 'CodeNewbie',
          host: 'Saron Yitbarek',
          frequency: 'Weekly',
          episodes: '400+',
          topics: ['Programming', 'Career', 'Community'],
          rating: 4.6,
          url: 'https://podcasts.apple.com/codenewbie'
        },
        {
          id: 'pod-4',
          name: 'Syntax',
          host: 'Wes Bos & Scott Tolinski',
          frequency: '2x Weekly',
          episodes: '500+',
          topics: ['JavaScript', 'Web Development', 'Tools'],
          rating: 4.9,
          url: 'https://podcasts.apple.com/syntax'
        }
      ]
    };
  }

  /**
   * Search resources
   */
  async searchResources(query, type = 'all') {
    try {
      const results = {};
      const searchTerm = query.toLowerCase();

      if (type === 'all' || type === 'videos') {
        results.videos = this.resources.videos.filter(v =>
          v.title.toLowerCase().includes(searchTerm) ||
          v.channel.toLowerCase().includes(searchTerm) ||
          v.topics.some(t => t.toLowerCase().includes(searchTerm))
        );
      }

      if (type === 'all' || type === 'articles') {
        results.articles = this.resources.articles.filter(a =>
          a.title.toLowerCase().includes(searchTerm) ||
          a.platform.toLowerCase().includes(searchTerm) ||
          a.topics.some(t => t.toLowerCase().includes(searchTerm))
        );
      }

      if (type === 'all' || type === 'books') {
        results.books = this.resources.books.filter(b =>
          b.title.toLowerCase().includes(searchTerm) ||
          b.author.toLowerCase().includes(searchTerm) ||
          b.topics.some(t => t.toLowerCase().includes(searchTerm))
        );
      }

      if (type === 'all' || type === 'podcasts') {
        results.podcasts = this.resources.podcasts.filter(p =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.host.toLowerCase().includes(searchTerm) ||
          p.topics.some(t => t.toLowerCase().includes(searchTerm))
        );
      }

      return { success: true, results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get resources by topic
   */
  async getResourcesByTopic(topic) {
    try {
      const results = {
        videos: this.resources.videos.filter(v => v.topics.includes(topic)),
        articles: this.resources.articles.filter(a => a.topics.includes(topic)),
        books: this.resources.books.filter(b => b.topics.includes(topic)),
        podcasts: this.resources.podcasts.filter(p => p.topics.includes(topic))
      };

      return {
        success: true,
        topic,
        results,
        total: Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get resources by difficulty
   */
  async getResourcesByDifficulty(difficulty) {
    try {
      const results = {
        videos: this.resources.videos.filter(v => 
          v.difficulty.includes(difficulty) || v.difficulty === difficulty
        ),
        articles: this.resources.articles.filter(a => 
          a.difficulty.includes(difficulty) || a.difficulty === difficulty
        ),
        books: this.resources.books.filter(b => 
          b.difficulty.includes(difficulty) || b.difficulty === difficulty
        )
      };

      return {
        success: true,
        difficulty,
        results,
        total: Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get trending resources
   */
  async getTrendingResources() {
    try {
      const trendingVideos = [...this.resources.videos]
        .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
        .slice(0, 5);

      const trendingArticles = [...this.resources.articles]
        .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
        .slice(0, 5);

      return {
        success: true,
        trending: {
          videos: trendingVideos,
          articles: trendingArticles,
          books: this.resources.books.slice(0, 3),
          podcasts: this.resources.podcasts.slice(0, 3)
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all topics
   */
  async getAllTopics() {
    try {
      const topics = new Set();

      this.resources.videos.forEach(v => v.topics.forEach(t => topics.add(t)));
      this.resources.articles.forEach(a => a.topics.forEach(t => topics.add(t)));
      this.resources.books.forEach(b => b.topics.forEach(t => topics.add(t)));
      this.resources.podcasts.forEach(p => p.topics.forEach(t => topics.add(t)));

      return {
        success: true,
        topics: Array.from(topics).sort(),
        count: topics.size
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get recommended learning path
   */
  async getRecommendedLearningPath(role, currentLevel) {
    try {
      const pathMap = {
        'Frontend Developer': {
          beginner: [
            { resource: 'HTML/CSS Fundamentals', type: 'video' },
            { resource: 'JavaScript Basics', type: 'article' },
            { resource: 'React Complete Guide', type: 'video' }
          ]
        },
        'Backend Developer': {
          intermediate: [
            { resource: 'System Design Master Class', type: 'video' },
            { resource: 'Data Structures & Algorithms', type: 'video' },
            { resource: 'Designing Data-Intensive Applications', type: 'book' }
          ]
        }
      };

      return {
        success: true,
        path: pathMap[role]?.[currentLevel] || [],
        recommendation: 'Follow this sequence to master the role'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get resources by type
   */
  async getResourcesByType(type) {
    try {
      const resources = this.resources[type];
      if (!resources) {
        return { success: false, error: 'Resource type not found' };
      }

      return {
        success: true,
        type,
        count: resources.length,
        resources
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get curated collections
   */
  async getCuratedCollections() {
    return {
      success: true,
      collections: [
        {
          id: 'coll-1',
          name: 'DSA Mastery',
          description: 'Complete guide to master data structures and algorithms',
          resources: 15,
          duration: '40 hours',
          difficulty: 'Intermediate to Hard'
        },
        {
          id: 'coll-2',
          name: 'System Design Expert',
          description: 'Learn to design scalable systems like Google and Amazon',
          resources: 12,
          duration: '25 hours',
          difficulty: 'Hard'
        },
        {
          id: 'coll-3',
          name: 'React Pro',
          description: 'Master React from basics to advanced patterns',
          resources: 18,
          duration: '35 hours',
          difficulty: 'Intermediate'
        },
        {
          id: 'coll-4',
          name: 'Interview Ready',
          description: 'Comprehensive interview preparation guide',
          resources: 25,
          duration: '50 hours',
          difficulty: 'All levels'
        }
      ]
    };
  }
}

module.exports = new ResourceLibraryService();
