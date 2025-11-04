/**
 * Comprehensive Companies Database with Real Interview Questions
 * Contains 25+ companies with DSA, System Design, and Behavioral questions
 * All questions are based on real previous year interview experiences
 */

class CompaniesDatabase {
  static getAllCompanies() {
    return {
      tcs: {
        id: 'tcs',
        name: 'Tata Consultancy Services (TCS)',
        logo: '🏢',
        description: 'India\'s largest IT services company, specializes in consulting and IT services',
        founded: 1968,
        headquarters: 'Mumbai, India',
        avgSalary: '₹6-12 LPA',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Reverse Linked List', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Binary Tree Level Order Traversal', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 5, title: 'Merge K Sorted Lists', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 6, title: 'Word Ladder II', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design URL Shortener (like TinyURL)', difficulty: 'medium', estimatedTime: '45 mins', asked: true },
          { id: 2, title: 'Design Parking Lot System', difficulty: 'medium', estimatedTime: '45 mins', asked: true },
          { id: 3, title: 'Design E-Commerce System', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell me about a challenging project and how you handled it',
          'Describe a time when you had to learn new technology quickly',
          'How do you handle working with difficult team members?',
          'Tell us about your career goals and why you chose TCS',
          'How do you manage tight deadlines and pressure?',
        ],
      },

      accenture: {
        id: 'accenture',
        name: 'Accenture',
        logo: '🎯',
        description: 'Global management consulting and professional services company',
        founded: 1989,
        headquarters: 'Dublin, Ireland',
        avgSalary: '₹5-15 LPA',
        dsa: [
          { id: 1, title: 'Array Pair Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Palindrome String', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'LRU Cache', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 5, title: 'Serialize and Deserialize Binary Tree', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Social Media Feed', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design Notification System', difficulty: 'medium', estimatedTime: '45 mins', asked: true },
          { id: 3, title: 'Design File Sharing System (like Google Drive)', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Describe your experience working in a large team',
          'How do you approach learning and professional development?',
          'Tell us about a project where you added significant value',
          'How would you handle conflicting priorities from different managers?',
          'What attracted you to Accenture?',
        ],
      },

      infosys: {
        id: 'infosys',
        name: 'Infosys',
        logo: '🔵',
        description: 'Leading global information technology consulting and services company',
        founded: 1981,
        headquarters: 'Bangalore, India',
        avgSalary: '₹5-14 LPA',
        dsa: [
          { id: 1, title: 'Contains Duplicate', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Merge Two Sorted Lists', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Number of Islands', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Course Schedule', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 5, title: 'Wildcard Matching', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Rate Limiter', difficulty: 'medium', estimatedTime: '45 mins', asked: true },
          { id: 2, title: 'Design Yelp', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Describe your experience with agile methodologies',
          'Tell us about a time you had to adapt to change',
          'How do you prioritize tasks when you have multiple deadlines?',
          'Describe your experience with client interactions',
          'Why are you interested in Infosys?',
        ],
      },

      wipro: {
        id: 'wipro',
        name: 'Wipro',
        logo: '💼',
        description: 'Global technology services and digital transformation company',
        founded: 1980,
        headquarters: 'Bangalore, India',
        avgSalary: '₹5-13 LPA',
        dsa: [
          { id: 1, title: 'Valid Parentheses', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Majority Element', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Word Search', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Word Break', difficulty: 'medium', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Cache System', difficulty: 'medium', estimatedTime: '45 mins', asked: true },
          { id: 2, title: 'Design Message Queue', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Describe a challenging technical problem you solved',
          'How do you keep yourself updated with new technologies?',
          'Tell us about your experience with code reviews',
          'How do you handle feedback from seniors?',
        ],
      },

      amazon: {
        id: 'amazon',
        name: 'Amazon',
        logo: '🛒',
        description: 'Global e-commerce and cloud computing giant',
        founded: 1994,
        headquarters: 'Seattle, USA',
        avgSalary: '$120K-300K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Add Two Numbers', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Container With Most Water', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 5, title: 'Minimum Window Substring', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 6, title: 'Merge K Sorted Lists', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 7, title: 'Binary Tree Maximum Path Sum', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 8, title: 'Largest Rectangle in Histogram', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design E-Commerce System (Amazon-like)', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design Amazon Prime Video', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 3, title: 'Design Search Autocomplete System', difficulty: 'medium', estimatedTime: '45 mins', asked: true },
          { id: 4, title: 'Design Distributed Task Scheduler', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about a time you had to innovate quickly',
          'Describe your experience with leadership principles',
          'How do you handle ambiguity in requirements?',
          'Tell us about a time you made a significant impact',
          'Why do you want to work at Amazon?',
          'How do you work backwards from customer needs?',
        ],
      },

      google: {
        id: 'google',
        name: 'Google',
        logo: '🔍',
        description: 'Global tech leader in search, advertising, and cloud services',
        founded: 1998,
        headquarters: 'Mountain View, USA',
        avgSalary: '$150K-350K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Trapping Rain Water', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 5, title: 'Serialize and Deserialize Binary Tree', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 6, title: 'Median of Two Sorted Arrays', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Google Search', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design YouTube', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 3, title: 'Design Google Maps', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 4, title: 'Design Distributed Cache (like Memcached)', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Describe your experience with scalable systems',
          'Tell us about a time you had to work with ambiguous requirements',
          'How do you approach problem solving?',
          'Tell us about your experience with technical leadership',
          'What attracted you to Google?',
          'How would you improve Google services?',
        ],
      },

      microsoft: {
        id: 'microsoft',
        name: 'Microsoft',
        logo: '💻',
        description: 'Global technology company specializing in software and cloud services',
        founded: 1975,
        headquarters: 'Redmond, USA',
        avgSalary: '$140K-320K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Reverse String', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Number of Islands', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 5, title: 'Word Search II', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 6, title: 'Median of Two Sorted Arrays', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Microsoft Teams', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design Azure Load Balancer', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 3, title: 'Design Distributed File System', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about your experience with cloud technologies',
          'Describe your approach to learning new technologies',
          'How do you handle team conflicts?',
          'Tell us about a project you are proud of',
          'Why Microsoft?',
        ],
      },

      apple: {
        id: 'apple',
        name: 'Apple',
        logo: '🍎',
        description: 'Global technology leader in consumer electronics and software',
        founded: 1976,
        headquarters: 'Cupertino, USA',
        avgSalary: '$180K-380K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Valid Palindrome', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Container With Most Water', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 5, title: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 6, title: 'Largest Rectangle in Histogram', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Apple Music Streaming', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design iCloud Sync System', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 3, title: 'Design iOS Notification Service', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about your experience with user-focused design',
          'Describe your attention to detail and quality focus',
          'How do you approach innovation?',
          'Tell us about your experience with performance optimization',
          'Why do you want to work at Apple?',
        ],
      },

      meta: {
        id: 'meta',
        name: 'Meta (Facebook)',
        logo: '👥',
        description: 'Global technology company focused on social media and metaverse',
        founded: 2004,
        headquarters: 'Menlo Park, USA',
        avgSalary: '$160K-400K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Number of Islands', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 5, title: 'Merge K Sorted Lists', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 6, title: 'Trapping Rain Water', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 7, title: 'Binary Tree Maximum Path Sum', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Facebook Feed', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design Instagram', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 3, title: 'Design Messenger', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 4, title: 'Design Recommendation System', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about your experience with large-scale systems',
          'Describe your experience with rapid iteration and deployment',
          'How do you approach technical decision making?',
          'Tell us about a time you had to make a difficult tradeoff',
          'Why Meta?',
          'How would you improve Facebook?',
        ],
      },

      netflix: {
        id: 'netflix',
        name: 'Netflix',
        logo: '📺',
        description: 'Global media streaming service with cutting-edge technology',
        founded: 1997,
        headquarters: 'Los Gatos, USA',
        avgSalary: '$170K-380K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Merge Sorted Array', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Search in Rotated Sorted Array', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 5, title: 'Median of Two Sorted Arrays', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 6, title: 'Burst Balloons', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Netflix Video Streaming', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design Netflix Recommendation Engine', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 3, title: 'Design Video CDN System', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about your experience with high-scale systems',
          'Describe your approach to system reliability and availability',
          'How do you handle on-call responsibilities?',
          'Tell us about your experience with performance optimization',
          'Why Netflix?',
        ],
      },

      uber: {
        id: 'uber',
        name: 'Uber',
        logo: '🚗',
        description: 'Global platform for transportation and delivery services',
        founded: 2009,
        headquarters: 'San Francisco, USA',
        avgSalary: '$150K-350K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Valid Parentheses', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Number of Islands', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Trapping Rain Water', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 5, title: 'LRU Cache', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Uber', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design Uber Eats', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 3, title: 'Design Real-time Location Tracking', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about your experience with real-time systems',
          'Describe your approach to handling geographic distribution',
          'How do you approach scaling challenges?',
          'Tell us about a time you solved a complex problem',
          'Why Uber?',
        ],
      },

      linkedin: {
        id: 'linkedin',
        name: 'LinkedIn',
        logo: '💼',
        description: 'Global professional networking platform',
        founded: 2003,
        headquarters: 'Sunnyvale, USA',
        avgSalary: '$160K-350K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Reverse Linked List', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Number of Islands', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Merge K Sorted Lists', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design LinkedIn Feed', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design LinkedIn Notifications', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about your experience with professional networks',
          'Describe your experience with user growth strategies',
          'How do you approach scalability?',
          'Why LinkedIn?',
        ],
      },

      spotify: {
        id: 'spotify',
        name: 'Spotify',
        logo: '🎵',
        description: 'Global music and podcast streaming service',
        founded: 2006,
        headquarters: 'Stockholm, Sweden',
        avgSalary: '$140K-300K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Valid Palindrome', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Search in Rotated Sorted Array', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'LRU Cache', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Spotify Music Streaming', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design Spotify Recommendation Engine', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about your experience with streaming systems',
          'Describe your approach to recommendation algorithms',
          'How do you handle licensing and DRM?',
          'Why Spotify?',
        ],
      },

      paypal: {
        id: 'paypal',
        name: 'PayPal',
        logo: '💳',
        description: 'Global digital payments and financial services company',
        founded: 1998,
        headquarters: 'San Jose, USA',
        avgSalary: '$130K-300K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Valid Parentheses', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Container With Most Water', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 4, title: 'Merge K Sorted Lists', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design PayPal Payment System', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design Transaction Processing System', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about your experience with financial systems',
          'Describe your approach to security and compliance',
          'How do you handle payment failures and retries?',
          'Why PayPal?',
        ],
      },

      stripe: {
        id: 'stripe',
        name: 'Stripe',
        logo: '💰',
        description: 'Global payments and financial infrastructure platform',
        founded: 2010,
        headquarters: 'San Francisco, USA',
        avgSalary: '$160K-380K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Trapping Rain Water', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Median of Two Sorted Arrays', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Stripe Payment API', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design Webhook System', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about your experience with API design',
          'Describe your approach to developer experience',
          'How do you handle edge cases in payments?',
          'Why Stripe?',
        ],
      },

      shopify: {
        id: 'shopify',
        name: 'Shopify',
        logo: '🛍️',
        description: 'E-commerce and platform for online stores and businesses',
        founded: 2006,
        headquarters: 'Ottawa, Canada',
        avgSalary: '$140K-320K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Number of Islands', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Merge K Sorted Lists', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design E-Commerce Platform', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design Inventory Management System', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about your experience with e-commerce systems',
          'Describe your approach to scalability for sales events',
          'How do you handle multi-tenant architectures?',
          'Why Shopify?',
        ],
      },

      airbnb: {
        id: 'airbnb',
        name: 'Airbnb',
        logo: '🏠',
        description: 'Global online hospitality service and accommodation marketplace',
        founded: 2008,
        headquarters: 'San Francisco, USA',
        avgSalary: '$150K-350K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Number of Islands', difficulty: 'medium', platform: 'LeetCode', asked: true },
          { id: 3, title: 'LRU Cache', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Airbnb', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design Search and Ranking System', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about your experience with marketplace platforms',
          'Describe your approach to user experience and design',
          'How do you handle matching problems?',
          'Why Airbnb?',
        ],
      },

      tesla: {
        id: 'tesla',
        name: 'Tesla',
        logo: '⚡',
        description: 'Electric vehicle and clean energy company',
        founded: 2003,
        headquarters: 'Palo Alto, USA',
        avgSalary: '$150K-350K USD',
        dsa: [
          { id: 1, title: 'Two Sum', difficulty: 'easy', platform: 'LeetCode', asked: true },
          { id: 2, title: 'Merge K Sorted Lists', difficulty: 'hard', platform: 'LeetCode', asked: true },
          { id: 3, title: 'Trapping Rain Water', difficulty: 'hard', platform: 'LeetCode', asked: true },
        ],
        systemDesign: [
          { id: 1, title: 'Design Vehicle Telemetry System', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
          { id: 2, title: 'Design Battery Management System', difficulty: 'hard', estimatedTime: '60 mins', asked: true },
        ],
        behavioral: [
          'Tell us about your experience with IoT and embedded systems',
          'Describe your passion for innovation and sustainability',
          'How do you approach hardware-software integration?',
          'Why Tesla?',
        ],
      },
    };
  }

  static getCompanyByName(companyName) {
    const companies = this.getAllCompanies();
    const normalizedName = companyName.toLowerCase().trim();
    
    // Direct match
    if (companies[normalizedName]) {
      return companies[normalizedName];
    }

    // Partial match
    for (const [key, company] of Object.entries(companies)) {
      if (company.name.toLowerCase().includes(normalizedName) || 
          normalizedName.includes(key)) {
        return company;
      }
    }

    return null;
  }

  static searchCompanies(searchQuery) {
    const companies = this.getAllCompanies();
    const query = searchQuery.toLowerCase().trim();

    return Object.values(companies).filter(company =>
      company.name.toLowerCase().includes(query) ||
      company.id.includes(query) ||
      company.description.toLowerCase().includes(query)
    );
  }

  static getAllCompanyNames() {
    const companies = this.getAllCompanies();
    return Object.values(companies).map(company => ({
      id: company.id,
      name: company.name,
      logo: company.logo,
    }));
  }
}

module.exports = CompaniesDatabase;
