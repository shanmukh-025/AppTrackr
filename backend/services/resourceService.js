class ResourceService {
  // ==================== RESUME TEMPLATES ====================
  static getResumeTemplates() {
    return {
      technical_junior: {
        name: 'Junior Software Engineer',
        industry: 'Technical',
        description: 'Perfect for graduates and junior developers (0-2 years experience)',
        template: `JOHN DOE
(555) 123-4567 | john@email.com | linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Entry-level Software Engineer with strong foundation in full-stack development and passion for building scalable applications. 
Proficient in JavaScript, React, Node.js, and databases. Quick learner with excellent problem-solving skills.

TECHNICAL SKILLS
Languages: JavaScript, Python, Java, SQL
Frontend: React, HTML5, CSS3, Bootstrap, Responsive Design
Backend: Node.js, Express, REST APIs
Databases: PostgreSQL, MongoDB
Tools: Git, GitHub, VS Code, npm
Methodologies: Agile, Git workflow, OOP

EDUCATION
Bachelor of Science in Computer Science | XYZ University | May 2023
GPA: 3.8/4.0 | Relevant Coursework: Data Structures, Web Development, Database Design

PROFESSIONAL EXPERIENCE

Frontend Developer Intern | Tech Startup | Jan 2023 - Apr 2023
• Built responsive React components for customer dashboard used by 5000+ users
• Fixed 15+ bugs and improved page load time by 25% through code optimization
• Collaborated with design team to implement pixel-perfect UI from Figma designs
• Wrote unit tests achieving 80% code coverage for assigned components

Web Developer Intern | Digital Agency | Jun 2022 - Aug 2022
• Developed full-stack features using React, Node.js, and PostgreSQL
• Created REST APIs for 3 client projects handling 100K+ daily requests
• Implemented authentication and authorization for secure user sessions
• Participated in code reviews and daily stand-ups with 8-person team

PROJECTS

Personal Portfolio Website | github.com/johndoe/portfolio
• Built responsive portfolio website using React and deployed on Vercel
• Integrated contact form with email notification system
• Achieved 95 Lighthouse score for performance optimization

E-Commerce App | github.com/johndoe/ecommerce
• Full-stack project: React frontend, Node.js backend, MongoDB database
• Implemented product filtering, shopping cart, and payment integration
• 500+ GitHub stars from community

CERTIFICATIONS & ACHIEVEMENTS
AWS Certified Cloud Practitioner (2023)
Completed Meta Front-End Developer Professional Certificate
Top performer in coding bootcamp with 98% score on final project`
      },
      
      technical_mid: {
        name: 'Mid-Level Software Engineer',
        industry: 'Technical',
        description: 'For developers with 3-7 years of experience',
        template: `SARAH JOHNSON
(555) 987-6543 | sarah@email.com | linkedin.com/in/sarahjohnson | github.com/sarahjohnson

PROFESSIONAL SUMMARY
Results-driven Senior Software Engineer with 6+ years designing and scaling backend systems.
Expert in microservices architecture, database optimization, and leading technical teams.
Proven track record of delivering high-impact solutions for 50M+ users globally.

TECHNICAL SKILLS
Languages: Python, Java, JavaScript, Go, SQL
Frameworks: Django, Spring Boot, FastAPI, Node.js, React
Cloud: AWS (EC2, S3, Lambda, RDS), Google Cloud, Docker, Kubernetes
Databases: PostgreSQL, MongoDB, Redis, Elasticsearch
Tools: Git, Jenkins, GitLab CI/CD, Prometheus, Grafana, DataDog
Specialties: System Design, Microservices, Performance Optimization, Database Sharding

PROFESSIONAL EXPERIENCE

Senior Backend Engineer | Tech Giant | Mar 2021 - Present
• Led redesign of payment processing system, increasing throughput from 1K to 50K transactions/sec
• Designed and implemented microservices architecture serving 100M+ daily active users
• Mentored team of 5 engineers, conducted technical interviews, and architecture reviews
• Reduced database query latency by 60% through indexing and query optimization
• Owned on-call rotations, maintained 99.95% system uptime SLA

Backend Engineer | Growth Stage Startup | Jun 2018 - Feb 2021
• Built real-time notification system processing 10M events/day using Redis and WebSockets
• Designed event-driven architecture using Kafka for reliable message processing
• Implemented advanced caching strategies, reducing API response time from 2s to 200ms
• Led database migration from MySQL to PostgreSQL for 1TB+ data, zero downtime
• Conducted architecture reviews and established best practices for 15-person team

Junior Software Engineer | Startup | Jan 2017 - May 2018
• Developed core features for SaaS product using Django and PostgreSQL
• Participated in full product lifecycle from design to production deployment
• Implemented REST APIs following OpenAPI specifications
• Contributed to open-source projects with 1000+ GitHub stars

ACHIEVEMENTS & PROJECTS
• Architected distributed caching layer reducing load times by 70%
• Led successful Kubernetes migration for entire infrastructure
• Published 3 technical blog posts on Medium with 50K+ total views
• Open source contributor: 2000+ GitHub stars on personal projects

CERTIFICATIONS
AWS Certified Solutions Architect - Professional (2023)
AWS Certified Developer - Associate (2022)
Kubernetes Administrator Certified (2021)`
      },

      technical_senior: {
        name: 'Senior/Staff Engineer',
        industry: 'Technical',
        description: 'For engineers with 8+ years, leadership roles',
        template: `ALEX KUMAR
(555) 456-7890 | alex@email.com | linkedin.com/in/alexkumar | github.com/alexkumar

EXECUTIVE PROFILE
Staff Engineer with 10+ years scaling systems to billions of users. Expert in distributed systems, 
high-performance architecture, and engineering leadership. Track record of building and scaling 
technical teams while maintaining code quality and system reliability.

CORE COMPETENCIES
Distributed Systems | Microservices Architecture | System Design | Team Leadership | 
Scalability Engineering | Performance Optimization | Database Optimization | DevOps/Infrastructure

PROFESSIONAL EXPERIENCE

Staff Software Engineer | FAANG Company | Jan 2020 - Present
• Led architecture and implementation of company-wide payment platform serving 10B+ annual transactions
• Designed distributed tracing system processing 1 trillion events/month, enabling real-time observability
• Built and mentored team of 12 engineers, establishing technical standards across 3 teams
• Reduced infrastructure costs by $5M annually through intelligent resource allocation
• Drove adoption of event-driven architecture across entire engineering organization

Principal Engineer | Series B Startup | Jun 2016 - Dec 2019
• Scaled platform from 100K to 100M users while maintaining single-digit latency
• Designed fault-tolerant service mesh handling 500K RPS at 99.99% availability
• Led complete infrastructure migration saving 60% on cloud costs
• Established engineering culture that grew from 5 to 40 engineers with 0 senior attrition

Senior Engineer | Established Tech Company | Jan 2014 - May 2016
• Architected real-time analytics pipeline processing 50TB+ daily data
• Implemented machine learning platform improving recommendation accuracy by 35%
• Led performance optimization initiatives resulting in 10x throughput improvement

MAJOR ACHIEVEMENTS
• Architected systems handling 1M+ concurrent connections with <50ms latency
• Mentored 50+ engineers, 8 promoted to senior roles
• Published 5 papers on distributed systems in tech conferences
• Built culture attracting top talent, reducing turnover to <5%

CERTIFICATIONS & SPEAKING
AWS Certified Solutions Architect - Professional
Regular speaker at tech conferences (Google I/O, AWS Summit, QCon)
Thought leader in distributed systems and scalability`
      },

      product_manager: {
        name: 'Product Manager',
        industry: 'Business',
        description: 'For Product Managers and Product Leaders',
        template: `EMILY CHEN
(555) 321-9876 | emily@email.com | linkedin.com/in/emilychen | medium.com/@emilychen

EXECUTIVE PROFILE
Strategic Product Manager with 8+ years driving product strategy and go-to-market initiatives.
Proven ability to lead cross-functional teams from concept to $100M+ revenue products.
Expert in data-driven decision making, user research, and scaling products globally.

CORE COMPETENCIES
Product Strategy | Go-to-Market | User Research | Analytics | OKR Framework | 
Roadmap Planning | Stakeholder Management | Technical Acumen | A/B Testing

PROFESSIONAL EXPERIENCE

Senior Product Manager | Tech Leader | Jul 2021 - Present
• Led product strategy for $50M revenue stream serving 50M monthly active users
• Launched 3 new products, 2 generated $10M+ in first year revenue
• Managed $5M+ annual product budget and resource allocation across 5 teams
• Increased user engagement by 35% through data-driven feature prioritization
• Conducted extensive user research with 500+ interviews impacting roadmap decisions

Product Manager | Growth Stage Company | Mar 2019 - Jun 2021
• Built product from MVP to 10M users in 18 months, generating $25M revenue
• Established OKR framework across product organization
• Led A/B testing program averaging 8 experiments/week with 30% win rate
• Partnered with engineering and design to ship 50+ features quarterly
• Mentored 2 junior PMs, both promoted to senior roles

Associate Product Manager | Startup | Jan 2017 - Feb 2019
• Launched flagship mobile app achieving #1 ranking in category within 6 months
• Managed analytics dashboard used by entire organization for data-driven decisions
• Conducted 100+ user interviews and synthesized insights driving 20+ features

KEY ACHIEVEMENTS
• Grew user base from 0 to 50M in 4 years, $100M revenue
• Implemented data culture improving feature success rate from 60% to 85%
• Speaker at Product School and ProductTank conferences
• Published 10 articles on product strategy with 100K+ total views

EDUCATION & CERTIFICATIONS
MBA | Top Business School | 2016
Reforge: Product Strategy & Analytics Graduate
Pragmatic Marketing Certification`
      },

      marketing_manager: {
        name: 'Marketing Manager',
        industry: 'Marketing',
        description: 'For Marketing Leaders and Growth professionals',
        template: `JAMES RODRIGUEZ
(555) 789-1234 | james@email.com | linkedin.com/in/jamesrodriguez | medium.com/@jamesrodriguez

MARKETING EXECUTIVE
Growth Marketing Manager with 7+ years driving customer acquisition and brand building.
Proven track record of growing platforms from 0 to 10M+ users through strategic marketing
and data-driven campaigns. Expert in growth hacking, product marketing, and team leadership.

CORE COMPETENCIES
Growth Marketing | User Acquisition | Retention & Engagement | Content Strategy | 
Paid Advertising | Analytics & Attribution | Brand Strategy | Team Leadership

PROFESSIONAL EXPERIENCE

Head of Growth | Tech Unicorn | Aug 2020 - Present
• Built growth function from scratch, scaling user acquisition from 100K to 5M monthly
• Managed $3M annual marketing budget across 8 channels, achieving 5:1 ROAS
• Grew email list from 0 to 2M subscribers with 35% engagement rate
• Led partnership strategy generating 30% of new user acquisition
• Managed team of 8 across growth, content, and paid marketing

Senior Growth Manager | Series B Startup | Feb 2018 - Jul 2020
• Launched product in 5 new markets simultaneously, growing MAU by 3x
• Built and scaled paid advertising programs generating $50M+ revenue
• Implemented customer feedback loop improving product-market fit signals
• Created content marketing program generating 500K+ monthly organic traffic
• Hired and trained growth team, building culture of experimentation

Digital Marketing Manager | E-commerce Company | Jun 2015 - Jan 2018
• Led integrated campaign generating 10M+ impressions and 500K conversions
• Grew social media following from 50K to 1M across platforms
• Implemented marketing automation improving conversion rate by 40%

ACHIEVEMENTS
• Increased brand awareness from 5% to 60% in target market
• Generated $100M+ in attributed revenue through growth initiatives
• 3x Twitter ranking in "Top 50 Growth Marketers"
• Published 20 articles on growth strategy with 500K+ views

EDUCATION
Bachelor of Science in Marketing | University | 2013
Google Analytics Certified
HubSpot Certified Inbound Marketer`
      },

      designer: {
        name: 'UX/UI Designer',
        industry: 'Design',
        description: 'For Product Designers and Design Leaders',
        template: `LINDA MARTINEZ
(555) 654-3210 | linda@email.com | linkedin.com/in/lindamartinez | portfolio.design

CREATIVE DIRECTOR
Senior UX/UI Designer with 6+ years creating intuitive, beautiful experiences for millions of users.
Expertise in design systems, user research, and leading design teams. Track record of 
transforming complex problems into elegant solutions that drive user engagement and business growth.

CORE COMPETENCIES
UX Research & Testing | UI Design | Design Systems | User Experience Strategy | 
Interaction Design | Prototyping | Figma & Design Tools | Design Leadership | Accessibility

PROFESSIONAL EXPERIENCE

Senior Product Designer | Tech Company | May 2020 - Present
• Led design for flagship product serving 20M users, increasing engagement by 30%
• Built company-wide design system from scratch with 200+ components, adopted by 5 teams
• Conducted extensive user research (100+ interviews) informing product strategy
• Mentored team of 5 designers, establishing design best practices and critique culture
• Reduced support tickets by 35% through improved UX and better onboarding flows

Product Designer | Growth Stage Startup | Jan 2018 - Apr 2020
• Designed new user onboarding flow improving activation rate from 20% to 45%
• Created mobile app UI achieving 4.8/5 rating with 100K+ reviews
• Implemented accessibility features (WCAG 2.1 AA compliance) expanding user base by 20%
• Established design process with weekly user testing sessions impacting all releases

UX/UI Designer | Agency | Jun 2015 - Dec 2017
• Designed digital products for 20+ Fortune 500 clients across 5 industries
• Created award-winning website redesign increasing conversions by 60%
• Developed design guidelines for rebranding initiative

AWARDS & RECOGNITION
2023 Designer of the Year - Tech Magazine
Featured in Dribbble's Hall of Fame (150K+ followers)
Published 15 case studies on Medium with 200K+ views
Speaker at designconf and Adobe MAX

EDUCATION & TOOLS
Bachelor of Fine Arts in Graphic Design | University | 2015
Tools: Figma, Adobe XD, Sketch, Protopie, Principle
Google Design Professional Certificate`
      },

      data_scientist: {
        name: 'Data Scientist',
        industry: 'Technical',
        description: 'For Data Scientists and ML Engineers',
        template: `PRIYA PATEL
(555) 111-2222 | priya@email.com | linkedin.com/in/priyapatel | github.com/priyapatel

DATA SCIENCE LEADER
Senior Data Scientist with 7+ years building machine learning systems impacting 100M+ users.
Expert in predictive modeling, recommendation systems, and scaling ML in production.
Proven track record of translating business problems into ML solutions generating millions in value.

TECHNICAL SKILLS
Languages: Python, SQL, R, Scala
ML/Deep Learning: TensorFlow, PyTorch, Scikit-learn, XGBoost, LightGBM
Data Tools: Jupyter, Pandas, NumPy, Spark, Airflow, Kubeflow
Databases: PostgreSQL, BigQuery, Redshift, Elasticsearch
Cloud: AWS SageMaker, Google Cloud AI, Azure ML
Specialties: Recommendation Systems, NLP, Time Series, A/B Testing, Feature Engineering

PROFESSIONAL EXPERIENCE

Senior Machine Learning Engineer | Tech Giant | Aug 2020 - Present
• Built recommendation system serving 1B+ personalized recommendations daily, driving 20% revenue increase
• Implemented fraud detection model reducing fraudulent transactions by $50M annually
• Led MLOps infrastructure supporting 50+ models in production with 99.9% uptime
• Mentored team of 8 data scientists, established best practices for ML development
• Published research paper on recommendation systems at major conference

Data Scientist | FinTech Startup | Feb 2018 - Jul 2020
• Built credit risk model improving approval rate by 15% while reducing defaults by 25%
• Developed churn prediction model saving $10M in customer lifetime value
• Created real-time anomaly detection system processing 1M+ transactions/day
• Implemented feature store reducing model training time by 70%

Junior Data Scientist | Consulting Firm | Jun 2016 - Jan 2018
• Built predictive models for 15+ enterprise clients across healthcare, finance, retail
• Conducted data analysis projects supporting strategic business decisions

ACHIEVEMENTS
• Deployed 30+ ML models to production, average impact $5M+ per model
• Reduced model training time from 8 hours to 15 minutes through infrastructure optimization
• Published 3 papers on machine learning in peer-reviewed journals
• 5K+ followers on Medium with articles on ML engineering and best practices

EDUCATION & CERTIFICATIONS
MS Computer Science (ML specialization) | Top University | 2016
Bachelor of Science in Statistics | University | 2014
Deep Learning Specialization - Andrew Ng (Coursera)
Stanford ML Engineering for Production (MLOps) Certificate`
      }
    };
  }

  // ==================== COVER LETTER TEMPLATES ====================
  static getCoverLetterTemplates() {
    return {
      entry_level: {
        name: 'Entry-Level Professional',
        description: 'For recent graduates and career starters',
        template: `Dear [Hiring Manager Name],

I am writing to express my enthusiasm for the [Position Title] role at [Company Name]. 
As a recent graduate with a degree in [Field] and hands-on experience through [internships/projects], 
I am confident in my ability to contribute meaningfully to your team while growing as a professional.

During my [internship/project] at [Company/University], I [specific accomplishment with metric - increased efficiency by X%, 
built feature, etc.]. This experience solidified my passion for [relevant field] and demonstrated my ability to 
quickly master new technologies and deliver quality work under pressure. Your company's commitment to [company value/innovation/product] 
particularly resonates with me and aligns perfectly with my career aspirations.

I am particularly excited about [Company Name] because of [specific reason - mention a specific product, initiative, or company value]. 
I am eager to bring my skills in [key skills], my strong work ethic, and my genuine passion for [field] to your growing team. 
I am confident that my [specific skill/achievement] and collaborative approach make me a strong fit for this role.

Thank you for considering my application. I look forward to discussing how I can contribute to [Company Name]'s continued success. 
Please feel free to contact me at [phone] or [email].

Best regards,
[Your Full Name]`
      },

      mid_level: {
        name: 'Mid-Level Professional',
        description: 'For professionals with 3-7 years experience',
        template: `Dear [Hiring Manager Name],

I am excited to apply for the [Position Title] position at [Company Name]. With [X years] of progressive 
experience in [your domain], I have consistently delivered [key type of results]. I am confident that my proven 
track record of [specific achievement], combined with my expertise in [key skills], positions me to make an 
immediate and significant impact on your team.

In my current role at [Current Company], I have [describe major accomplishment with metrics - led team that 
achieved X%, launched product that generated Y revenue, etc.]. Beyond this, I have [describe another key contribution], 
resulting in [quantifiable impact]. These experiences have equipped me with the strategic thinking, technical expertise, 
and leadership capabilities necessary to excel in your [Position Title] role. I pride myself on my ability to 
[mention specific strength], which I believe is crucial for success at [Company Name].

What particularly excites me about this opportunity is [Company Name]'s focus on [company goal/mission]. 
Your recent [mention specific initiative/product], combined with your commitment to [company value], represents 
exactly the kind of impact-driven work I want to contribute to. My background in [relevant experience], 
along with my track record of [specific achievement], positions me to drive meaningful results for [specific team/initiative].

I would welcome the opportunity to discuss how my experience, proven ability to [key accomplishment], 
and passion for [industry/field] can contribute to [Company Name]'s ambitious goals. Thank you for your consideration.

Best regards,
[Your Full Name]`
      },

      senior_level: {
        name: 'Senior/Leadership Role',
        description: 'For senior professionals and leadership positions',
        template: `Dear [Hiring Manager Name],

I am writing to express my strong interest in the [Position Title] opportunity at [Company Name]. 
With [X years] of progressive experience leading teams and driving strategic initiatives in [industry], 
I have established a proven track record of building high-performing organizations, scaling operations, 
and delivering substantial business impact. I am confident that my leadership experience and vision 
align perfectly with [Company Name]'s strategic objectives.

Throughout my career, I have successfully led initiatives resulting in [major achievement with quantified impact - 
$X million revenue growth, X% operational improvement, etc.]. Most notably, at [Previous Company], I [describe 
transformational achievement], which established me as a thought leader in [field]. My ability to 
[key leadership strength] has been instrumental in building teams that [describe team achievement], 
creating a culture of [company value], and establishing best practices that have become [broader impact].

Your company's ambitious vision for [company's strategic direction] is exactly where I want to contribute my expertise. 
The opportunity to lead [specific team/initiative] and drive [specific business objective] aligns perfectly with my 
career trajectory and passion for [industry/challenge]. I am particularly impressed by [specific company achievement/initiative], 
and I am excited about the prospect of contributing to this momentum.

I bring not only deep expertise in [relevant domains] but also a proven ability to build and scale teams, 
foster innovation, and execute at the highest level. I would welcome the opportunity to discuss how my 
leadership experience, strategic vision, and commitment to excellence can drive success for [Company Name].

Thank you for considering my application. I look forward to our conversation.

Sincerely,
[Your Full Name]`
      },

      career_change: {
        name: 'Career Change',
        description: 'For transitioning to a new industry/role',
        template: `Dear [Hiring Manager Name],

After [X years] in [Previous Industry], I have made the strategic decision to transition into [New Field] 
as a [Position Title] at [Company Name]. While my background differs from the traditional candidate profile, 
my unique combination of [transferable skills] and demonstrated commitment to [new field] through 
[specific actions - courses, projects, etc.] position me to bring fresh perspective and strong execution 
capabilities to your team.

My decision to transition stems from [meaningful reason for change]. This realization led me to invest 
deliberately in developing expertise in [new field]. Over the past [timeframe], I have completed [relevant 
certifications/courses/projects], including [specific achievement], demonstrating both my commitment and 
capability in this domain. Furthermore, my [X years] experience in [previous industry] has given me deep expertise 
in [relevant skills], which I believe brings unique value to [Company Name].

Specifically, my background in [previous industry skill] has taught me [relevant insight] - a perspective 
that I believe is invaluable for [specific problem your company solves]. I have already demonstrated my 
ability to [bridge skills], as evidenced by [specific example]. This combination of experience, combined 
with my proven ability to learn quickly and deliver results, makes me confident in my ability to contribute 
meaningfully to your team.

I am not simply seeking a career change; I am pursuing a direction where my passion for [new field] aligns 
with my professional capabilities. I am excited about the prospect of bringing my work ethic, [key strength], 
and fresh perspective to [Company Name].

Thank you for considering my application. I look forward to discussing this opportunity further.

Best regards,
[Your Full Name]`
      },

      startup: {
        name: 'Startup Application',
        description: 'Casual, energetic tone for startup positions',
        template: `Hey [Hiring Manager Name],

I'm excited about the [Position Title] opportunity at [Company Name]! I've been following your work 
on [specific product/initiative], and I love your mission of [company mission]. The intersection of 
[relevant passion] and [company focus] is exactly where I want to make my mark professionally.

Here's why I think I'd be a great fit: Over the past [X years], I've [key accomplishment with impact]. 
This experience taught me how to [relevant skill], which I know is critical for [Company Name]'s goals. 
What excites me most is that you're tackling [specific challenge], and I've directly solved similar problems 
by [specific example]. The results? [quantifiable impact].

I'm particularly drawn to [Company Name] because [specific reason - mention product feature, company culture, technical challenge]. 
Your approach to [specific company initiative] aligns with how I think about [relevant topic], and I'm eager 
to contribute to that vision. I thrive in fast-paced environments where [startup value], and I genuinely believe 
in [company mission].

I'd love to chat about how I can contribute to [Company Name]'s next chapter. Feel free to reach out at [phone] 
or [email] - or we could grab coffee if you're in [your location]!

Looking forward to connecting,
[Your Name]`
      }
    };
  }

  // ==================== DSA INTERVIEW QUESTIONS (100+ questions) ====================
  static getDSAQuestions(difficulty = null, topic = null) {
    const allQuestions = [
      // ARRAYS & STRINGS
      { id: 1, title: 'Two Sum', platform: 'LeetCode 1', difficulty: 'easy', topics: ['Array', 'Hash Map'], solutions: 2, companies: ['Google', 'Meta', 'Amazon'], link: 'https://leetcode.com/problems/two-sum' },
      { id: 2, title: 'Best Time to Buy and Sell Stock', platform: 'LeetCode 121', difficulty: 'easy', topics: ['Array', 'Dynamic Programming'], solutions: 1, companies: ['Google', 'Microsoft'], link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock' },
      { id: 3, title: 'Contains Duplicate', platform: 'LeetCode 217', difficulty: 'easy', topics: ['Array', 'Hash Set'], solutions: 2, companies: ['Google', 'Meta', 'Apple'], link: 'https://leetcode.com/problems/contains-duplicate' },
      { id: 4, title: 'Valid Anagram', platform: 'LeetCode 242', difficulty: 'easy', topics: ['String', 'Hash Map'], solutions: 2, companies: ['Google', 'Microsoft'], link: 'https://leetcode.com/problems/valid-anagram' },
      { id: 5, title: 'Longest Substring Without Repeating Characters', platform: 'LeetCode 3', difficulty: 'medium', topics: ['String', 'Sliding Window'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft'], link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters' },
      { id: 6, title: '3Sum', platform: 'LeetCode 15', difficulty: 'medium', topics: ['Array', 'Sorting'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/3sum' },
      { id: 7, title: 'Container With Most Water', platform: 'LeetCode 11', difficulty: 'medium', topics: ['Array', 'Two Pointers'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/container-with-most-water' },
      { id: 8, title: 'Minimum Window Substring', platform: 'LeetCode 76', difficulty: 'hard', topics: ['String', 'Sliding Window', 'Hash Map'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/minimum-window-substring' },
      { id: 9, title: 'Trapping Rain Water', platform: 'LeetCode 42', difficulty: 'hard', topics: ['Array', 'Dynamic Programming'], solutions: 2, companies: ['Google', 'Meta', 'Amazon'], link: 'https://leetcode.com/problems/trapping-rain-water' },
      { id: 10, title: 'Longest Palindromic Substring', platform: 'LeetCode 5', difficulty: 'medium', topics: ['String', 'Dynamic Programming'], solutions: 2, companies: ['Google', 'Meta'], link: 'https://leetcode.com/problems/longest-palindromic-substring' },
      
      // LINKED LISTS
      { id: 11, title: 'Reverse Linked List', platform: 'LeetCode 206', difficulty: 'easy', topics: ['Linked List'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/reverse-linked-list' },
      { id: 12, title: 'Merge Two Sorted Lists', platform: 'LeetCode 21', difficulty: 'easy', topics: ['Linked List'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft'], link: 'https://leetcode.com/problems/merge-two-sorted-lists' },
      { id: 13, title: 'Linked List Cycle', platform: 'LeetCode 141', difficulty: 'easy', topics: ['Linked List', 'Two Pointers'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft'], link: 'https://leetcode.com/problems/linked-list-cycle' },
      { id: 14, title: 'Remove Nth Node From End of List', platform: 'LeetCode 19', difficulty: 'medium', topics: ['Linked List', 'Two Pointers'], solutions: 1, companies: ['Google', 'Meta', 'Amazon'], link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list' },
      { id: 15, title: 'Reorder List', platform: 'LeetCode 143', difficulty: 'medium', topics: ['Linked List'], solutions: 1, companies: ['Google', 'Meta'], link: 'https://leetcode.com/problems/reorder-list' },
      { id: 16, title: 'Merge K Sorted Lists', platform: 'LeetCode 23', difficulty: 'hard', topics: ['Linked List', 'Heap', 'Divide & Conquer'], solutions: 3, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/merge-k-sorted-lists' },
      
      // TREES & GRAPHS
      { id: 17, title: 'Invert Binary Tree', platform: 'LeetCode 226', difficulty: 'easy', topics: ['Tree', 'BFS', 'DFS'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft'], link: 'https://leetcode.com/problems/invert-binary-tree' },
      { id: 18, title: 'Binary Tree Level Order Traversal', platform: 'LeetCode 102', difficulty: 'medium', topics: ['Tree', 'BFS'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/binary-tree-level-order-traversal' },
      { id: 19, title: 'Validate Binary Search Tree', platform: 'LeetCode 98', difficulty: 'medium', topics: ['Tree', 'DFS'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft'], link: 'https://leetcode.com/problems/validate-binary-search-tree' },
      { id: 20, title: 'Lowest Common Ancestor of BST', platform: 'LeetCode 235', difficulty: 'medium', topics: ['Tree', 'Binary Search Tree'], solutions: 2, companies: ['Google', 'Meta'], link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree' },
      { id: 21, title: 'Binary Tree Maximum Path Sum', platform: 'LeetCode 124', difficulty: 'hard', topics: ['Tree', 'DFS'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum' },
      { id: 22, title: 'Number of Islands', platform: 'LeetCode 200', difficulty: 'medium', topics: ['Graph', 'DFS', 'BFS'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/number-of-islands' },
      { id: 23, title: 'Clone Graph', platform: 'LeetCode 133', difficulty: 'medium', topics: ['Graph', 'DFS', 'BFS'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft'], link: 'https://leetcode.com/problems/clone-graph' },
      { id: 24, title: 'Course Schedule', platform: 'LeetCode 207', difficulty: 'medium', topics: ['Graph', 'Topological Sort'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/course-schedule' },
      { id: 25, title: 'Alien Dictionary', platform: 'LeetCode 269', difficulty: 'hard', topics: ['Graph', 'Topological Sort'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/alien-dictionary' },
      
      // DYNAMIC PROGRAMMING
      { id: 26, title: 'Climbing Stairs', platform: 'LeetCode 70', difficulty: 'easy', topics: ['Dynamic Programming'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft'], link: 'https://leetcode.com/problems/climbing-stairs' },
      { id: 27, title: 'Coin Change', platform: 'LeetCode 322', difficulty: 'medium', topics: ['Dynamic Programming'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/coin-change' },
      { id: 28, title: 'Longest Increasing Subsequence', platform: 'LeetCode 300', difficulty: 'medium', topics: ['Dynamic Programming', 'Binary Search'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft'], link: 'https://leetcode.com/problems/longest-increasing-subsequence' },
      { id: 29, title: '0/1 Knapsack', platform: 'Classic DP', difficulty: 'medium', topics: ['Dynamic Programming'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://www.geeksforgeeks.org/0-1-knapsack-problem' },
      { id: 30, title: 'Word Break', platform: 'LeetCode 139', difficulty: 'medium', topics: ['Dynamic Programming'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft'], link: 'https://leetcode.com/problems/word-break' },
      { id: 31, title: 'House Robber', platform: 'LeetCode 198', difficulty: 'medium', topics: ['Dynamic Programming'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft'], link: 'https://leetcode.com/problems/house-robber' },
      { id: 32, title: 'Edit Distance', platform: 'LeetCode 72', difficulty: 'hard', topics: ['Dynamic Programming'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/edit-distance' },
      
      // SEARCHING & SORTING
      { id: 33, title: 'Binary Search', platform: 'LeetCode 704', difficulty: 'easy', topics: ['Binary Search'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft'], link: 'https://leetcode.com/problems/binary-search' },
      { id: 34, title: 'Search in Rotated Sorted Array', platform: 'LeetCode 33', difficulty: 'medium', topics: ['Binary Search'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/search-in-rotated-sorted-array' },
      { id: 35, title: 'Kth Largest Element in Array', platform: 'LeetCode 215', difficulty: 'medium', topics: ['Heap', 'Quickselect'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/kth-largest-element-in-an-array' },
      { id: 36, title: 'Median of Two Sorted Arrays', platform: 'LeetCode 4', difficulty: 'hard', topics: ['Binary Search'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/median-of-two-sorted-arrays' },
      
      // HEAPS
      { id: 37, title: 'Top K Frequent Elements', platform: 'LeetCode 347', difficulty: 'medium', topics: ['Heap', 'Hash Map'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/top-k-frequent-elements' },
      { id: 38, title: 'Merge K Sorted Lists (with Heap)', platform: 'LeetCode 23', difficulty: 'hard', topics: ['Heap', 'Linked List'], solutions: 2, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/merge-k-sorted-lists' },
      
      // INTERVALS
      { id: 39, title: 'Merge Intervals', platform: 'LeetCode 56', difficulty: 'medium', topics: ['Intervals', 'Sorting'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/merge-intervals' },
      { id: 40, title: 'Insert Interval', platform: 'LeetCode 57', difficulty: 'medium', topics: ['Intervals', 'Array'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft'], link: 'https://leetcode.com/problems/insert-interval' },
      
      // ADVANCED
      { id: 41, title: 'LRU Cache', platform: 'LeetCode 146', difficulty: 'hard', topics: ['Hash Map', 'Linked List'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/lru-cache' },
      { id: 42, title: 'Word Ladder II', platform: 'LeetCode 126', difficulty: 'hard', topics: ['BFS', 'Backtracking', 'Graph'], solutions: 1, companies: ['Google', 'Meta', 'Microsoft', 'Amazon'], link: 'https://leetcode.com/problems/word-ladder-ii' }
    ];

    if (difficulty && topic) {
      return allQuestions.filter(q => q.difficulty === difficulty && q.topics.includes(topic));
    }
    if (difficulty) {
      return allQuestions.filter(q => q.difficulty === difficulty);
    }
    if (topic) {
      return allQuestions.filter(q => q.topics.includes(topic));
    }
    return allQuestions;
  }

  // ==================== SYSTEM DESIGN QUESTIONS ====================
  static getSystemDesignQuestions() {
    return [
      {
        id: 1,
        title: 'Design YouTube',
        difficulty: 'hard',
        topics: ['Scalability', 'Storage', 'CDN', 'Streaming'],
        keyPoints: [
          'Video upload and processing pipeline',
          'Distributed storage (S3, CDN)',
          'Recommendation engine with ML',
          'Real-time analytics',
          'Comment system at scale'
        ],
        companies: ['Google', 'Meta', 'Amazon'],
        estimatedTime: '45 mins'
      },
      {
        id: 2,
        title: 'Design Uber',
        difficulty: 'hard',
        topics: ['Geolocation', 'Real-time', 'Matching Algorithm', 'Payment'],
        keyPoints: [
          'Real-time driver/rider matching',
          'Geospatial indexing (Quadtree)',
          'ETA calculation',
          'Surge pricing algorithm',
          'Payment and billing system'
        ],
        companies: ['Google', 'Meta', 'Microsoft', 'Amazon'],
        estimatedTime: '45 mins'
      },
      {
        id: 3,
        title: 'Design WhatsApp',
        difficulty: 'hard',
        topics: ['Messaging', 'Real-time', 'Scalability', 'Reliability'],
        keyPoints: [
          'Message queue architecture',
          'WebSocket for real-time updates',
          'Message delivery guarantees',
          'Group messaging',
          'End-to-end encryption'
        ],
        companies: ['Google', 'Meta', 'Microsoft'],
        estimatedTime: '45 mins'
      },
      {
        id: 4,
        title: 'Design Netflix',
        difficulty: 'hard',
        topics: ['Streaming', 'CDN', 'Recommendation', 'Analytics'],
        keyPoints: [
          'Video encoding and storage',
          'CDN for global distribution',
          'Recommendation engine (ML)',
          'User profile and preference',
          'Scalable search indexing'
        ],
        companies: ['Google', 'Meta', 'Amazon'],
        estimatedTime: '45 mins'
      },
      {
        id: 5,
        title: 'Design Twitter',
        difficulty: 'hard',
        topics: ['Feed Generation', 'Real-time', 'Caching', 'Search'],
        keyPoints: [
          'Feed generation and ranking',
          'Timeline caching',
          'Search indexing',
          'Notification system',
          'Trending topics'
        ],
        companies: ['Google', 'Meta', 'Microsoft', 'Amazon'],
        estimatedTime: '45 mins'
      },
      {
        id: 6,
        title: 'Design Airbnb',
        difficulty: 'hard',
        topics: ['Search', 'Geolocation', 'Booking', 'Payments'],
        keyPoints: [
          'Property search with filters',
          'Geospatial indexing',
          'Availability calendar',
          'Booking and payment',
          'Review and rating system'
        ],
        companies: ['Google', 'Meta', 'Microsoft', 'Amazon'],
        estimatedTime: '45 mins'
      },
      {
        id: 7,
        title: 'Design Slack',
        difficulty: 'medium',
        topics: ['Messaging', 'Real-time', 'Search', 'Notifications'],
        keyPoints: [
          'Message storage and retrieval',
          'Channel management',
          'Real-time updates',
          'Search across messages',
          'Notification system'
        ],
        companies: ['Google', 'Meta', 'Microsoft'],
        estimatedTime: '40 mins'
      },
      {
        id: 8,
        title: 'Design Load Balancer',
        difficulty: 'hard',
        topics: ['Scalability', 'Distribution', 'Fault Tolerance'],
        keyPoints: [
          'Load balancing algorithms (round-robin, LRU, IP hash)',
          'Health checks',
          'Sticky sessions',
          'Horizontal scaling',
          'Failover mechanism'
        ],
        companies: ['Google', 'Meta', 'Microsoft', 'Amazon'],
        estimatedTime: '40 mins'
      },
      {
        id: 9,
        title: 'Design Cache System',
        difficulty: 'medium',
        topics: ['Caching', 'Eviction Policy', 'Consistency'],
        keyPoints: [
          'LRU/LFU eviction policies',
          'Cache invalidation',
          'Distributed caching',
          'Cache warming',
          'Consistency guarantees'
        ],
        companies: ['Google', 'Meta', 'Microsoft', 'Amazon'],
        estimatedTime: '35 mins'
      },
      {
        id: 10,
        title: 'Design Database Sharding',
        difficulty: 'hard',
        topics: ['Database', 'Scalability', 'Consistency'],
        keyPoints: [
          'Sharding strategies (range, hash, directory)',
          'Shard key selection',
          'Hot shard problem',
          'Cross-shard queries',
          'Rebalancing'
        ],
        companies: ['Google', 'Meta', 'Microsoft', 'Amazon'],
        estimatedTime: '45 mins'
      }
    ];
  }

  // ==================== BEHAVIORAL QUESTIONS ====================
  static getBehavioralQuestions() {
    return [
      {
        id: 1,
        question: 'Tell me about yourself',
        difficulty: 'easy',
        category: 'intro',
        tips: 'Keep it concise (2-3 mins), focus on relevant experience, end with enthusiasm',
        sample_answer: 'I am a software engineer with 5 years of experience building scalable backend systems. At my current company, I led the redesign of our payment processing system which increased throughput by 50x. I am passionate about solving complex problems and mentoring junior engineers. I am excited about this opportunity because...'
      },
      {
        id: 2,
        question: 'Why do you want to work here?',
        difficulty: 'easy',
        category: 'motivation',
        tips: 'Show genuine research about company, connect your skills to their needs',
        sample_answer: 'I have been impressed by [Company]\'s approach to [specific initiative]. Your focus on [company value] aligns with my career goals. Additionally, your tech stack of [specific tech] is exactly where I want to deepen my expertise. I am confident I can contribute to [specific project].'
      },
      {
        id: 3,
        question: 'What are your greatest strengths?',
        difficulty: 'easy',
        category: 'strength',
        tips: '2-3 strengths with examples, not generic. Avoid humble bragging.',
        sample_answer: 'My top strengths are: 1) Problem-solving - I break down complex problems into manageable parts, 2) Leadership - I led team of 5 and improved velocity by 30%, 3) Adaptability - I quickly learned Kubernetes in 2 weeks when assigned.'
      },
      {
        id: 4,
        question: 'What is an area you are working to improve?',
        difficulty: 'medium',
        category: 'growth',
        tips: 'Be honest but show growth mindset and concrete steps',
        sample_answer: 'Public speaking was challenging for me. To improve, I joined Toastmasters, gave 5 tech talks at work, and presented at a conference. This has significantly increased my confidence.'
      },
      {
        id: 5,
        question: 'Tell me about a time you had to work with a difficult teammate',
        difficulty: 'medium',
        category: 'collaboration',
        tips: 'Use STAR method, focus on understanding and resolution',
        sample_answer: 'A backend engineer and I had different coding standards. Instead of imposing my way, I scheduled a one-on-one to understand their perspective. We created shared standards that incorporated best ideas from both approaches. Result: Improved code quality and team cohesion.'
      },
      {
        id: 6,
        question: 'Describe a project where you had to learn a new technology quickly',
        difficulty: 'medium',
        category: 'learning',
        tips: 'Show initiative, resourcefulness, and results',
        sample_answer: 'Assigned a Kubernetes migration project with 2-week deadline. I took online courses, built small projects, paired with senior engineers. Delivered on-time with zero downtime. Became team expert on Kubernetes.'
      },
      {
        id: 7,
        question: 'Tell me about your biggest failure',
        difficulty: 'hard',
        category: 'failure',
        tips: 'Be honest, take responsibility, focus on learnings and growth',
        sample_answer: 'I deployed code without thorough testing, causing a production outage affecting 10K users. I immediately helped resolve it and implemented mandatory code reviews. This taught me the importance of testing and peer review.'
      },
      {
        id: 8,
        question: 'How do you handle disagreement with your manager?',
        difficulty: 'medium',
        category: 'conflict',
        tips: 'Show respect for hierarchy while maintaining integrity',
        sample_answer: 'I would respectfully present my perspective with data. I once disagreed on task priority. I showed metrics on impact and met with my manager. We collaborated on the best approach.'
      },
      {
        id: 9,
        question: 'Tell me about a time you showed leadership',
        difficulty: 'medium',
        category: 'leadership',
        tips: 'Leadership doesn\'t mean title - it means influence and impact',
        sample_answer: 'Though not officially titled lead, I noticed team was inconsistent in practices. I created coding standards doc, led discussions, got buy-in. Result: Reduced bugs by 25%, improved onboarding time by 30%.'
      },
      {
        id: 10,
        question: 'How do you handle pressure and deadlines?',
        difficulty: 'medium',
        category: 'pressure',
        tips: 'Show examples of handling high pressure professionally',
        sample_answer: 'I break down tasks into smaller chunks, prioritize ruthlessly, and communicate clearly. When we had 1-week deadline for critical feature, I identified MVP requirements, coordinated with team. Shipped on time.'
      },
      {
        id: 11,
        question: 'Tell me about a time you went above and beyond',
        difficulty: 'medium',
        category: 'initiative',
        tips: 'Show initiative and ownership, not just extra hours',
        sample_answer: 'Noticed our monitoring was insufficient. I spent 2 weeks building comprehensive monitoring dashboard that caught issues early. Result: 50% reduction in production incidents.'
      },
      {
        id: 12,
        question: 'How do you stay updated with technology?',
        difficulty: 'easy',
        category: 'growth',
        tips: 'Mention specific resources, learning mindset',
        sample_answer: 'I read tech blogs, follow GitHub trends, take online courses on areas I want to master, contribute to open source, and discuss new technologies with colleagues.'
      }
    ];
  }

  // ==================== COMPANY-SPECIFIC QUESTIONS ====================
  static getCompanyQuestions(company) {
    const questions = {
      google: {
        name: 'Google',
        description: 'Focus on scalability, distributed systems, hiring for smart engineers',
        questions: [
          'Why Google?',
          'Google process billions of queries - how would you scale a search system?',
          'How does Google Maps calculate fastest route?',
          'Design YouTube recommendation algorithm',
          'Describe your most complex technical problem and how you solved it'
        ]
      },
      meta: {
        name: 'Meta (Facebook)',
        description: 'Focus on scale, user engagement, rapid iteration',
        questions: [
          'How would you build a real-time feed ranking system?',
          'Describe your experience with distributed systems',
          'How would you handle scaling to billions of users?',
          'Tell me about handling rapid feature releases',
          'Design a system to detect fake accounts at scale'
        ]
      },
      amazon: {
        name: 'Amazon',
        description: 'Focus on customer obsession, high bar for hiring, leadership principles',
        questions: [
          'Tell me about a time you were customer-obsessed',
          'Amazon leadership principle: "Earn Trust" - describe an example',
          'How would you design AWS EC2?',
          'Describe a time you had to make a decision with incomplete information',
          'Tell me about a project that failed and what you learned'
        ]
      },
      microsoft: {
        name: 'Microsoft',
        description: 'Focus on product quality, collaboration, breadth of experience',
        questions: [
          'How would you design Office 365?',
          'Describe your experience with cloud technologies',
          'Tell me about collaborating across teams',
          'How would you approach learning a new domain quickly?',
          'Design Azure infrastructure for enterprise use case'
        ]
      },
      apple: {
        name: 'Apple',
        description: 'Focus on user experience, attention to detail, perfectionism',
        questions: [
          'How would you improve iOS?',
          'Tell me about an experience where you focused on user experience',
          'How would you design Siri?',
          'Describe a time you had to balance functionality with simplicity',
          'How would you handle security and privacy at scale?'
        ]
      },
      tesla: {
        name: 'Tesla',
        description: 'Focus on hardware-software integration, autonomous driving, efficiency',
        questions: [
          'How would you approach building autonomous driving systems?',
          'Describe your experience with real-time embedded systems',
          'How would you optimize battery management software?',
          'Tell me about handling safety-critical systems',
          'Design a system to improve vehicle efficiency'
        ]
      },
      netflix: {
        name: 'Netflix',
        description: 'Focus on scalability, content delivery, user experience',
        questions: [
          'How would you build Netflix recommendation system?',
          'Describe your experience with video streaming',
          'How would you handle billions of hours of content?',
          'Design a system to prevent password sharing',
          'Tell me about optimizing for different network conditions'
        ]
      },
      spotify: {
        name: 'Spotify',
        description: 'Focus on music recommendation, user experience, data',
        questions: [
          'How would you design Spotify recommendation algorithm?',
          'Describe your experience with recommendation systems',
          'How would you handle discovering new music at scale?',
          'Design a system to prevent music piracy',
          'Tell me about personalizing user experience'
        ]
      },
      uber: {
        name: 'Uber',
        description: 'Focus on real-time matching, scalability, distributed systems',
        questions: [
          'How would you design the real-time matching algorithm?',
          'Describe your experience with geolocation systems',
          'How would you calculate ETA?',
          'Design surge pricing algorithm',
          'How would you handle millions of concurrent requests?'
        ]
      },
      airbnb: {
        name: 'Airbnb',
        description: 'Focus on search, geolocation, user trust, platform thinking',
        questions: [
          'How would you design the search and discovery system?',
          'Design an availability calendar system',
          'Describe your experience with geospatial indexing',
          'How would you handle preventing fraud?',
          'Tell me about building trust in a marketplace'
        ]
      }
    };
    
    return questions[company.toLowerCase()] || questions['google'];
  }
}

module.exports = ResourceService;
