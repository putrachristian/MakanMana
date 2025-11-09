const SERP_API_KEY = import.meta.env.VITE_SERP_API_KEY;
import { searchUnsplashImage } from './unsplashApi';

/**
 * Search for image from SerpAPI (Google Images) based on query
 * @param {string} query - Search query (e.g., restaurant name, food category)
 * @returns {Promise<string>} Image URL
 */
export const searchSerpImage = async (query) => {
  if (!SERP_API_KEY) {
    console.warn('VITE_SERP_API_KEY is not set in environment variables');
    return null;
  }

  try {
    const searchQuery = encodeURIComponent(query);
    const url = `https://serpapi.com/search.json?engine=google_images_light&q=${searchQuery}&api_key=${SERP_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      console.error(`SerpAPI error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    if (data.images_results && data.images_results.length > 0) {
      // Return the first image URL
      return data.images_results[0].original || data.images_results[0].link;
    }

    return null;
  } catch (error) {
    console.error('Error searching SerpAPI image:', error);
    // If CORS error, try using a proxy or alternative approach
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      console.warn('CORS error detected. SerpAPI may not support direct browser requests.');
    }
    return null;
  }
};

/**
 * Get image for restaurant recommendation using SerpAPI
 * @param {Object} restaurant - Restaurant object with name, category, etc.
 * @returns {Promise<string>} Image URL
 */
export const getRestaurantImageFromSerp = async (restaurant) => {
  // Build search query from restaurant name only
  let searchQuery = restaurant.name || '';
  
  // Clean up query - remove common restaurant words
  searchQuery = searchQuery
    .replace(/restoran|warung|rumah makan|kedai|cafe|kafe/gi, '')
    .trim();
  
  // If query is too short or empty, use category
  if (!searchQuery || searchQuery.length < 3) {
    searchQuery = restaurant.category || 'indonesian restaurant';
  }

  // Try SerpAPI first
  let imageUrl = await searchSerpImage(searchQuery);
  
  // If SerpAPI fails, fallback to Pexels
  if (!imageUrl) {
    console.warn('SerpAPI failed, falling back to Pexels');
    imageUrl = await searchUnsplashImage(`${searchQuery} restaurant`);
  }
  
  return imageUrl;
};

