/**
 * Salary & Negotiation Tool Service
 * Real-time salary data, company comparisons, negotiation scripts
 * Benefits calculator and market research
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class SalaryNegotiationService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    this.salaryData = this.initializeSalaryData();
  }

  /**
   * Initialize salary data for different roles and companies
   */
  initializeSalaryData() {
    return {
      'Software Engineer': {
        'Junior (0-2 yrs)': {
          min: 100000,
          median: 130000,
          max: 160000,
          totalCompensation: { min: 120000, median: 160000, max: 200000 }
        },
        'Mid-level (2-5 yrs)': {
          min: 150000,
          median: 200000,
          max: 250000,
          totalCompensation: { min: 200000, median: 280000, max: 350000 }
        },
        'Senior (5-10 yrs)': {
          min: 250000,
          median: 320000,
          max: 400000,
          totalCompensation: { min: 350000, median: 450000, max: 600000 }
        }
      },
      'Frontend Developer': {
        'Junior (0-2 yrs)': {
          min: 95000,
          median: 125000,
          max: 155000,
          totalCompensation: { min: 115000, median: 155000, max: 195000 }
        },
        'Mid-level (2-5 yrs)': {
          min: 140000,
          median: 190000,
          max: 240000,
          totalCompensation: { min: 180000, median: 260000, max: 330000 }
        }
      },
      'Backend Developer': {
        'Junior (0-2 yrs)': {
          min: 105000,
          median: 135000,
          max: 165000,
          totalCompensation: { min: 125000, median: 165000, max: 205000 }
        }
      }
    };
  }

  /**
   * Get salary range for role
   */
  async getSalaryRange(role, experience, location = 'US') {
    try {
      const roleData = this.salaryData[role];
      if (!roleData) {
        return { success: false, error: 'Role not found' };
      }

      const levelData = roleData[experience];
      if (!levelData) {
        return { success: false, error: 'Experience level not found' };
      }

      // Adjust for location
      const locationMultiplier = this.getLocationMultiplier(location);

      return {
        success: true,
        salary: {
          role,
          experience,
          location,
          baseSalary: {
            min: Math.round(levelData.min * locationMultiplier),
            median: Math.round(levelData.median * locationMultiplier),
            max: Math.round(levelData.max * locationMultiplier)
          },
          totalCompensation: {
            min: Math.round(levelData.totalCompensation.min * locationMultiplier),
            median: Math.round(levelData.totalCompensation.median * locationMultiplier),
            max: Math.round(levelData.totalCompensation.max * locationMultiplier)
          },
          breakdown: {
            salary: '60-70%',
            bonus: '10-20%',
            stocks: '15-25%',
            other: '5%'
          }
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get location multiplier for salary adjustment
   */
  getLocationMultiplier(location) {
    const multipliers = {
      'San Francisco, CA': 1.4,
      'New York, NY': 1.3,
      'Seattle, WA': 1.25,
      'Austin, TX': 1.1,
      'Denver, CO': 1.05,
      'US': 1.0,
      'Remote': 0.95,
      'International': 0.7
    };
    return multipliers[location] || 1.0;
  }

  /**
   * Compare salaries across companies
   */
  async compareSalaries(role, experience, companies) {
    try {
      const comparison = {};

      for (const company of companies) {
        const baseRange = await this.getSalaryRange(role, experience);
        const companyMultiplier = this.getCompanyMultiplier(company);

        comparison[company] = {
          baseSalary: {
            median: Math.round(baseRange.salary.baseSalary.median * companyMultiplier)
          },
          totalCompensation: {
            median: Math.round(baseRange.salary.totalCompensation.median * companyMultiplier)
          },
          benefits: this.getCompanyBenefits(company),
          rating: this.getCompanyRating(company)
        };
      }

      return {
        success: true,
        comparison,
        recommendation: this.getComparisonRecommendation(comparison)
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get company salary multiplier
   */
  getCompanyMultiplier(company) {
    const multipliers = {
      'Google': 1.15,
      'Facebook': 1.15,
      'Apple': 1.1,
      'Amazon': 1.05,
      'Microsoft': 1.08,
      'Netflix': 1.2,
      'Tesla': 0.95,
      'Startup': 0.8
    };
    return multipliers[company] || 1.0;
  }

  /**
   * Get company benefits
   */
  getCompanyBenefits(company) {
    const benefits = {
      'Google': [
        '401(k) matching: 50% up to 4%',
        'Health insurance: Excellent',
        'Stock options: Yes',
        'Remote work: Hybrid',
        'Parental leave: 20 weeks'
      ],
      'Amazon': [
        '401(k) matching: 50% up to 6%',
        'Health insurance: Good',
        'Stock options: Yes (RSUs)',
        'Remote work: Hybrid',
        'Parental leave: 20 weeks'
      ],
      'Apple': [
        '401(k) matching: 50% up to 4%',
        'Health insurance: Excellent',
        'Stock options: Yes',
        'Remote work: Limited',
        'Parental leave: 16 weeks'
      ]
    };

    return benefits[company] || [
      '401(k) matching: 50% up to 4%',
      'Health insurance: Good',
      'Paid time off: 20 days'
    ];
  }

  /**
   * Get company rating
   */
  getCompanyRating(company) {
    const ratings = {
      'Google': 4.7,
      'Amazon': 3.9,
      'Apple': 4.4,
      'Microsoft': 4.5,
      'Facebook': 4.2,
      'Netflix': 4.3
    };
    return ratings[company] || 4.0;
  }

  /**
   * Get negotiation script
   */
  async getNegotiationScript(scenario, offerAmount, marketRate) {
    try {
      const prompt = `You are an expert career negotiator. Help someone negotiate their ${scenario} offer.

Their offer: $${offerAmount}
Market rate: $${marketRate}
Difference: ${Math.round(((marketRate - offerAmount) / marketRate) * 100)}%

Generate a professional negotiation script with:
1. Opening statement
2. Key points to mention
3. Potential responses to objections
4. Closing statement
5. Walk-away point

Format as JSON:
{
  "opening": "Your opening statement",
  "keyPoints": ["point1", "point2", "point3"],
  "objectionResponses": {
    "objection": "response"
  },
  "closing": "Your closing statement",
  "walkAwayPoint": "$X or you decline",
  "tips": ["tip1", "tip2"],
  "targetRange": "$X - $Y"
}`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          return { success: true, script: JSON.parse(jsonMatch[0]) };
        } catch (e) {
          return this.getDefaultScript(offerAmount, marketRate);
        }
      }

      return this.getDefaultScript(offerAmount, marketRate);
    } catch (error) {
      console.error('Error generating script:', error.message);
      return this.getDefaultScript(offerAmount, marketRate);
    }
  }

  /**
   * Get default negotiation script
   */
  getDefaultScript(offerAmount, marketRate) {
    const difference = Math.round(((marketRate - offerAmount) / marketRate) * 100);
    return {
      success: true,
      script: {
        opening: 'Thank you for the offer. I\'m excited about this opportunity. I wanted to discuss the compensation package.',
        keyPoints: [
          `Market rate for this role is $${marketRate}`,
          'Your offer is ' + difference + '% below market',
          'I bring [specific skills/experience] to this role',
          'I\'m looking for $' + marketRate
        ],
        objectionResponses: {
          'That\'s our budget': 'I understand budget constraints. Could we discuss stock options or other benefits?',
          'We don\'t negotiate': 'Most companies do. I\'m very interested in this role and want to find a mutually beneficial arrangement.'
        },
        closing: 'I\'m excited to join your team. Can we revisit the compensation?',
        walkAwayPoint: '$' + Math.round(marketRate * 0.9) + ' or decline',
        tips: [
          'Don\'t mention your current salary',
          'Get everything in writing',
          'Negotiate total compensation, not just base'
        ],
        targetRange: '$' + Math.round(marketRate * 0.95) + ' - $' + Math.round(marketRate * 1.05)
      }
    };
  }

  /**
   * Benefits calculator
   */
  async benefitsCalculator(baseSalary, benefits) {
    try {
      let totalValue = baseSalary;
      const breakdown = { baseSalary };

      // Health insurance
      if (benefits.healthInsurance) {
        const value = baseSalary * 0.08; // ~8% of salary
        breakdown.healthInsurance = value;
        totalValue += value;
      }

      // 401k matching
      if (benefits.matching401k) {
        const value = baseSalary * benefits.matching401k;
        breakdown['401kMatching'] = value;
        totalValue += value;
      }

      // Stock options
      if (benefits.stocks) {
        const value = baseSalary * benefits.stocks;
        breakdown.stocks = value;
        totalValue += value;
      }

      // PTO value
      if (benefits.ptoWeeks) {
        const dailyRate = baseSalary / 250; // Working days per year
        const value = dailyRate * (benefits.ptoWeeks * 5);
        breakdown.pto = value;
        totalValue += value;
      }

      return {
        success: true,
        breakdown: breakdown,
        totalCompensation: Math.round(totalValue),
        effectiveIncrease: Math.round(((totalValue - baseSalary) / baseSalary) * 100) + '%'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get comparison recommendation
   */
  getComparisonRecommendation(comparison) {
    let highest = null;
    let highestCompensation = 0;

    for (const [company, data] of Object.entries(comparison)) {
      if (data.totalCompensation.median > highestCompensation) {
        highestCompensation = data.totalCompensation.median;
        highest = company;
      }
    }

    return `${highest} offers the highest total compensation at $${highestCompensation.toLocaleString()}`;
  }

  /**
   * Get market insights for role
   */
  async getMarketInsights(role, experience) {
    try {
      return {
        success: true,
        insights: {
          role,
          experience,
          trends: [
            'Demand is very high',
            'Remote work is increasing compensation flexibility',
            'Sign-on bonuses are common',
            'Stock compensation is increasing'
          ],
          averageIncrease: '8-12% year over year',
          hotLocations: ['San Francisco', 'New York', 'Seattle'],
          topCompanies: ['Google', 'Apple', 'Microsoft'],
          negotiationTips: [
            'Know your market rate',
            'Get competing offers',
            'Negotiate total compensation',
            'Request sign-on bonus'
          ]
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new SalaryNegotiationService();
