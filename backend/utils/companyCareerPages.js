/**
 * Company Career Pages Database
 * Curated list of direct company career page URLs
 * This makes your app MORE valuable than just redirecting!
 */

const companyCareerPages = {
  // Tech Giants
  'google': 'https://careers.google.com/jobs/results/',
  'microsoft': 'https://careers.microsoft.com/us/en/search-results',
  'apple': 'https://jobs.apple.com/en-us/search',
  'amazon': 'https://www.amazon.jobs/en/search',
  'meta': 'https://www.metacareers.com/jobs/',
  'facebook': 'https://www.metacareers.com/jobs/',
  
  // Popular Tech Companies
  'netflix': 'https://jobs.netflix.com/search',
  'spotify': 'https://www.lifeatspotify.com/jobs',
  'uber': 'https://www.uber.com/us/en/careers/list/',
  'airbnb': 'https://careers.airbnb.com/positions/',
  'tesla': 'https://www.tesla.com/careers/search/',
  'spacex': 'https://www.spacex.com/careers/',
  
  // Startups & Scale-ups
  'stripe': 'https://stripe.com/jobs/search',
  'coinbase': 'https://www.coinbase.com/careers/positions',
  'shopify': 'https://www.shopify.com/careers/search',
  'github': 'https://github.com/about/careers',
  'gitlab': 'https://about.gitlab.com/jobs/apply/',
  'atlassian': 'https://www.atlassian.com/company/careers/all-jobs',
  
  // Consulting & Services
  'accenture': 'https://www.accenture.com/us-en/careers/jobsearch',
  'deloitte': 'https://careers.deloitte.com/us/en/search-results',
  'pwc': 'https://www.pwc.com/us/en/careers/campus/jobs.html',
  'ibm': 'https://www.ibm.com/careers/search',
  
  // Enterprise Software
  'salesforce': 'https://salesforce.wd12.myworkdayjobs.com/External_Career_Site',
  'oracle': 'https://www.oracle.com/careers/',
  'sap': 'https://jobs.sap.com/search/',
  'adobe': 'https://careers.adobe.com/us/en/search-results',
  'vmware': 'https://careers.vmware.com/main/',
  
  // Financial Tech
  'visa': 'https://jobs.smartrecruiters.com/Visa',
  'mastercard': 'https://careers.mastercard.com/us/en/search-results',
  'paypal': 'https://www.paypal.com/us/smarthelp/careers/search',
  'square': 'https://careers.squareup.com/us/en/jobs',
  
  // E-commerce & Retail
  'walmart': 'https://careers.walmart.com/results',
  'target': 'https://corporate.target.com/careers/job-search',
  'ebay': 'https://careers.ebayinc.com/search/',
  'etsy': 'https://www.etsy.com/careers',
  
  // Gaming
  'epic games': 'https://www.epicgames.com/site/en-US/careers',
  'riot games': 'https://www.riotgames.com/en/work-with-us/jobs',
  'blizzard': 'https://careers.blizzard.com/global/en/search-results',
  'valve': 'https://www.valvesoftware.com/en/jobs',
  
  // Additional Tech Companies (from user's jobs)
  'zscaler': 'https://www.zscaler.com/careers',
  'govcio': 'https://www.govcio.com/careers/',
  'teravision technologies': 'https://teravisiontech.com/careers/',
  'teravision': 'https://teravisiontech.com/careers/',
  'cority': 'https://www.cority.com/careers/',
  
  // Add more as you find them!
};

/**
 * Generate a likely career page URL for a company
 * @param {string} companyName - Company name
 * @returns {string} - Generated career page URL
 */
function generateCareerPageURL(companyName) {
  // Normalize company name for URL
  const normalized = companyName
    .toLowerCase()
    .replace(/\s+(inc|llc|ltd|corporation|corp)\.?$/i, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '')
    .trim();
  
  // Common career page patterns
  const patterns = [
    `https://www.${normalized}.com/careers`,
    `https://careers.${normalized}.com`,
    `https://${normalized}.com/jobs`,
    `https://www.${normalized}.com/about/careers`
  ];
  
  // Return the most common pattern
  return patterns[0];
}

/**
 * Find company career page URL
 * @param {string} companyName - Company name from job listing
 * @returns {string|null} - Direct career page URL or generated URL
 */
function findCompanyCareerPage(companyName) {
  if (!companyName) return null;
  
  // Normalize company name (lowercase, remove Inc/LLC/etc)
  const normalized = companyName
    .toLowerCase()
    .replace(/\s+(inc|llc|ltd|corporation|corp)\.?$/i, '')
    .trim();
  
  // Direct match
  if (companyCareerPages[normalized]) {
    return companyCareerPages[normalized];
  }
  
  // Partial match (e.g., "Google Inc" -> "google")
  const match = Object.keys(companyCareerPages).find(key => 
    normalized.includes(key) || key.includes(normalized)
  );
  
  if (match) {
    return companyCareerPages[match];
  }
  
  // AUTO-GENERATE career page URL for unknown companies!
  // This ensures EVERY company gets a direct link attempt
  const generatedURL = generateCareerPageURL(companyName);
  console.log(`💡 Generated career page for ${companyName}: ${generatedURL}`);
  
  return generatedURL;
}

module.exports = {
  companyCareerPages,
  findCompanyCareerPage
};
