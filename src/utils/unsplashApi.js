const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

/**
 * Search for image from Pexels based on query
 * @param {string} query - Search query (e.g., restaurant name, food category)
 * @returns {Promise<string>} Image URL
 */
export const searchUnsplashImage = async (query) => {
  if (!PEXELS_API_KEY) {
    console.warn('VITE_PEXELS_API_KEY is not set in environment variables');
    return null;
  }

  try {
    const searchQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      // Return large image URL (or medium if large not available)
      return data.photos[0].src.landscape;
    }

    return null;
  } catch (error) {
    console.error('Error searching Pexels image:', error);
    return null;
  }
};

/**
 * Get image for restaurant recommendation
 * @param {Object} restaurant - Restaurant object with name, category, etc.
 * @returns {Promise<string>} Image URL
 */
export const getRestaurantImage = async (restaurant) => {
  // Build search query from restaurant name
  // Remove common words and focus on food/restaurant name
  let searchQuery = restaurant.name || '';
  
  // Clean up query - remove common restaurant words
  searchQuery = searchQuery
    .replace(/restoran|warung|rumah makan|kedai|cafe|kafe/gi, '')
    .trim();
  
  // If query is too short or empty, use category
  if (!searchQuery || searchQuery.length < 3) {
    searchQuery = restaurant.category || 'indonesian food';
  }
  
  // Add "food" or "makanan" to make search more relevant
  if (!searchQuery.toLowerCase().includes('food') && !searchQuery.toLowerCase().includes('makanan')) {
    searchQuery = `${searchQuery} food`;
  }

  const imageUrl = await searchUnsplashImage(searchQuery);
  return imageUrl;
};

