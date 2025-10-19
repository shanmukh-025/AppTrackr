/**
 * Direct URL Extractor
 * Extracts hidden company URLs from aggregator redirect URLs
 * 
 * Many job APIs embed the actual company URL as a redirect parameter!
 * Example: jooble.org/jdp/123?redirect=https://company.com/apply
 * This extracts: https://company.com/apply
 */

const axios = require('axios');

/**
 * Extract direct company URL from aggregator redirect URL
 * @param {string} aggregatorUrl - The API's redirect URL
 * @param {string} source - The API source (jooble, remoteok, etc.)
 * @returns {Promise<string|null>} - Extracted direct URL or null
 */
async function extractDirectURL(aggregatorUrl, source) {
  if (!aggregatorUrl || typeof aggregatorUrl !== 'string') {
    return null;
  }

  try {
    const url = new URL(aggregatorUrl);
    
    // Common redirect parameter names used by job aggregators
    const redirectParams = [
      'redirect',
      'url',
      'link',
      'dest',
      'destination',
      'goto',
      'target',
      'redir',
      'out',
      'external',
      'apply_url',
      'job_url',
      'company_url'
    ];

    // Check each possible redirect parameter
    for (const param of redirectParams) {
      const value = url.searchParams.get(param);
      
      if (value) {
        // Decode the URL (might be URL encoded)
        const decodedUrl = decodeURIComponent(value);
        
        // Validate it's a real URL
        if (isValidURL(decodedUrl)) {
          // Make sure it's not another aggregator redirect
          if (!isAggregatorURL(decodedUrl)) {
            console.log(`✅ Extracted direct URL from ${source}:`, decodedUrl);
            return decodedUrl;
          }
        }
      }
    }

    // If no query parameters found, try following the redirect
    // This makes an HTTP HEAD request to see where it redirects
    const finalUrl = await followRedirect(aggregatorUrl);
    if (finalUrl && finalUrl !== aggregatorUrl && !isAggregatorURL(finalUrl)) {
      console.log(`✅ Followed redirect from ${source}: ${aggregatorUrl} → ${finalUrl}`);
      return finalUrl;
    }

    // Source-specific extraction logic
    switch (source) {
      case 'jooble':
        return await extractFromJooble(url);
      
      case 'remoteok':
        return await extractFromRemoteOK(url);
      
      case 'remotive':
        return await extractFromRemotive(url);
      
      case 'arbeitnow':
        return await extractFromArbeitnow(url);
      
      case 'apijobs':
        return await extractFromAPIJobs(url);
      
      default:
        return null;
    }

  } catch (error) {
    console.warn('⚠️ Error extracting direct URL:', error.message);
    return null;
  }
}

/**
 * Jooble-specific URL extraction
 */
function extractFromJooble(url) {
  // Jooble format: jooble.org/jdp/ID?redirect=ACTUAL_URL
  // or: jooble.org/jdp/ID (then redirects server-side)
  
  // Check query parameters
  const redirect = url.searchParams.get('redirect') || 
                   url.searchParams.get('url') ||
                   url.searchParams.get('link');
  
  if (redirect) {
    const decoded = decodeURIComponent(redirect);
    if (isValidURL(decoded) && !isAggregatorURL(decoded)) {
      return decoded;
    }
  }
  
  // If no redirect param found, Jooble redirects server-side
  // We can't extract it without making an HTTP request
  return null;
}

/**
 * RemoteOK-specific URL extraction
 */
function extractFromRemoteOK(url) {
  // RemoteOK format: remoteok.com/remote-jobs/ID
  // Often has ?ref= parameter with actual URL
  
  const ref = url.searchParams.get('ref') ||
              url.searchParams.get('apply') ||
              url.searchParams.get('url');
  
  if (ref) {
    const decoded = decodeURIComponent(ref);
    if (isValidURL(decoded) && !isAggregatorURL(decoded)) {
      return decoded;
    }
  }
  
  return null;
}

/**
 * Remotive-specific URL extraction
 */
function extractFromRemotive(url) {
  // Remotive format: remotive.com/remote-jobs/category/job-title-id
  // Check for apply_url parameter
  
  const applyUrl = url.searchParams.get('apply_url') ||
                   url.searchParams.get('url') ||
                   url.searchParams.get('application_url');
  
  if (applyUrl) {
    const decoded = decodeURIComponent(applyUrl);
    if (isValidURL(decoded) && !isAggregatorURL(decoded)) {
      return decoded;
    }
  }
  
  return null;
}

/**
 * Arbeitnow-specific URL extraction
 */
function extractFromArbeitnow(url) {
  // Arbeitnow format: arbeitnow.com/jobs/company-job-id
  
  const redirect = url.searchParams.get('redirect') ||
                   url.searchParams.get('apply');
  
  if (redirect) {
    const decoded = decodeURIComponent(redirect);
    if (isValidURL(decoded) && !isAggregatorURL(decoded)) {
      return decoded;
    }
  }
  
  return null;
}

/**
 * APIJobs-specific URL extraction
 */
function extractFromAPIJobs(url) {
  const applyUrl = url.searchParams.get('apply_url') ||
                   url.searchParams.get('url');
  
  if (applyUrl) {
    const decoded = decodeURIComponent(applyUrl);
    if (isValidURL(decoded) && !isAggregatorURL(decoded)) {
      return decoded;
    }
  }
  
  return null;
}

/**
 * Check if string is a valid URL
 */
function isValidURL(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Check if URL is from an aggregator (not a direct company URL)
 */
function isAggregatorURL(url) {
  const aggregators = [
    'jooble.org',
    'jooble.com',
    'remoteok.com',
    'remoteok.io',
    'remotive.com',
    'remotive.io',
    'arbeitnow.com',
    'apijobs.dev',
    'indeed.com',
    'linkedin.com',
    'glassdoor.com',
    'monster.com',
    'ziprecruiter.com',
    'simplyhired.com'
  ];
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    return aggregators.some(agg => hostname.includes(agg));
  } catch {
    return false;
  }
}

/**
 * Follow redirect chain to get final URL
 * Makes an HTTP HEAD request to see where the aggregator URL redirects
 */
async function followRedirect(url) {
  try {
    // Use HEAD request to save bandwidth (we only need the redirect location)
    const response = await axios.head(url, {
      maxRedirects: 5,
      validateStatus: () => true,
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    // Get the final URL after following redirects
    const finalUrl = response.request.res.responseUrl || response.request.res.req?.path;
    
    if (finalUrl && finalUrl !== url) {
      // Check if it's a company URL (not another aggregator)
      if (!isAggregatorURL(finalUrl)) {
        return finalUrl;
      }
    }
    
    return null;
  } catch (error) {
    // Silent fail - this is an optional enhancement
    return null;
  }
}

module.exports = {
  extractDirectURL,
  followRedirect,
  isValidURL,
  isAggregatorURL
};
