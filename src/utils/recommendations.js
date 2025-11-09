import { generateRecommendationsWithGemini } from './geminiApi';

/**
 * Generate restaurant recommendations using Gemini AI
 * @param {Object} answers - User answers { "question": "yes/no", ... }
 * @param {Object} location - Location data { type: 'current'|'city', coordinates?: {lat, lng}, city?: string }
 * @param {string} mode - 'solo' or 'duet'
 * @returns {Promise<Array>} Array of restaurant recommendations
 */
export const generateRecommendations = async (answers, location, mode = 'solo') => {
  if (!answers || Object.keys(answers).length === 0) {
    throw new Error('Answers are required to generate recommendations');
  }

  try {
    const recommendations = await generateRecommendationsWithGemini(answers, location, mode);
    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations with Gemini:', error);
    throw error;
  }
};

