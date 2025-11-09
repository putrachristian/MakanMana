import { GoogleGenAI } from '@google/genai';
import { getRestaurantImage, searchUnsplashImage } from './unsplashApi';
import { getRestaurantImageFromSerp } from './serpApi';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set in environment variables');
}

// Initialize GoogleGenAI client
const genAI = API_KEY ? new GoogleGenAI({
  apiKey: API_KEY,
}) : null;

/**
 * Generate questions for restaurant recommendation quiz using Gemini AI
 * @returns {Promise<Array>} Array of questions in the format: { id, question, emoji, image, options? }
 */
export const generateQuestions = async () => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    const systemInstruction = `Kamu adalah asisten AI yang ahli dalam membuat pertanyaan untuk rekomendasi restoran di Indonesia.

Tugas kamu:
1. Buat 10-15 pertanyaan yang GENERAL dan UMUM untuk mendapatkan preferensi makanan user
2. Setiap pertanyaan harus membantu mengidentifikasi karakteristik restoran yang cocok
3. Pertanyaan harus fokus pada preferensi dasar: nasi/tidak nasi, berkuah/kering, pedas/tidak pedas, murah/mahal, lokal/internasional, dll
4. Gunakan bahasa Indonesia yang natural, mudah dipahami, dan cukup panjang untuk jelas (5-8 kata)
5. Setiap pertanyaan harus memiliki emoji yang relevan
6. PENTING: Semua pertanyaan HARUS dalam format BINARY CHOICE (ya/tidak) yang cocok dengan swipe interface
7. Pertanyaan bukan soal suka makan apa tapi sedang ingin makan apa
8. PENTING: Pertanyaan harus GENERAL dan UMUM - hindari pertanyaan yang terlalu spesifik atau niche

Format output HARUS berupa JSON array dengan struktur berikut (TANPA markdown, TANPA code block, HANYA JSON murni):
[
  {
    "id": 1,
    "question": "Pertanyaan yang spesifik dan jelas dalam format ya/tidak",
    "emoji": "🍜",
    "image": "URL gambar dari Unsplash/Pexels yang relevan dengan pertanyaan",
    "options": {
      "left": "Label untuk jawaban kiri (swipe kiri = tidak)",
      "right": "Label untuk jawaban kanan (swipe kanan = ya)"
    }
  }
]

Rules untuk pertanyaan:
1. SEMUA pertanyaan HARUS dalam format YES/NO atau BINARY CHOICE yang cocok dengan swipe kiri/kanan
2. Pertanyaan harus GENERAL dan UMUM (5-8 kata) - cukup panjang untuk jelas namun tetap ringkas
3. Fokus pada preferensi dasar yang mempengaruhi rekomendasi restoran secara signifikan
4. PENTING: Pastikan pertanyaan TIDAK REPETITIF - setiap pertanyaan harus unik dan berbeda, tidak ada pertanyaan yang mirip atau menanyakan hal yang sama
5. Pastikan pertanyaan tidak redundan dan saling melengkapi
6. Emoji harus relevan dengan konteks pertanyaan
7. Image URL tidak perlu disediakan (akan di-generate otomatis)
8. Options WAJIB ada untuk memberikan konteks yang jelas pada jawaban ya/tidak
9. Left label = label untuk swipe kiri (tidak), Right label = label untuk swipe kanan (ya)
10. PENTING: Options HARUS saling oposisi (binary), BUKAN leveling atau gradasi
11. Gunakan kalimat yang natural dan mudah dipahami, tidak terlalu singkat
12. PENTING: Gunakan pertanyaan GENERAL dan UMUM yang relevan untuk semua orang, bukan pertanyaan niche atau terlalu spesifik

Contoh pertanyaan yang BAIK (GENERAL dan UMUM dengan opsi saling oposisi):
- "Lagi pengen makan nasi?" dengan options: { left: "Bukan Nasi", right: "Nasi" }
- "Mau makanan berkuah?" dengan options: { left: "Kering", right: "Berkuah" }
- "Lagi pengen makanan pedas?" dengan options: { left: "Tidak Pedas", right: "Pedas" }
- "Budget makan hari ini murah?" dengan options: { left: "Mahal", right: "Murah" }
- "Mau makanan lokal Indonesia?" dengan options: { left: "Internasional", right: "Lokal" }
- "Preferensi suasana ramai?" dengan options: { left: "Tenang", right: "Ramai" }
- "Lagi pengen makanan manis?" dengan options: { left: "Tidak Manis", right: "Manis" }
- "Mau makanan yang gurih?" dengan options: { left: "Tidak Gurih", right: "Gurih" }
- "Lagi pengen makanan panas?" dengan options: { left: "Dingin", right: "Panas" }

Contoh pertanyaan yang SALAH (tidak cocok dengan swipe, terlalu panjang, atau terlalu spesifik):
- "Lagi pengen makanan pedas level berapa?" (bukan binary choice, terlalu panjang)
- "Budget makan hari ini berapa?" (bukan binary choice, perlu input angka)
- "Preferensi tekstur makanan: crispy/crunchy atau lembut/empuk?" (bukan format ya/tidak, terlalu panjang)
- "Makanan kaya rempah?" (terlalu spesifik, tidak general)
- "Makanan dengan tekstur crispy?" (terlalu spesifik, tidak general)
- "Makanan dengan bumbu khas daerah tertentu?" (terlalu spesifik, tidak general)
- "Makan nasi?" (terlalu singkat, kurang natural)
- "Makanan berkuah?" (terlalu singkat, kurang natural)

Contoh options yang SALAH (menggunakan leveling/gradasi):
- { left: "Tidak Terlalu Pedas", right: "Sangat Pedas" } ❌ (bukan oposisi, ini leveling)
- { left: "Sedikit Pedas", right: "Sangat Pedas" } ❌ (bukan oposisi, ini leveling)
- { left: "Pedas Sedang", right: "Pedas Banget" } ❌ (bukan oposisi, ini leveling)

Contoh options yang BENAR (saling oposisi):
- { left: "Tidak Pedas", right: "Pedas" } ✅ (saling oposisi)
- { left: "Kering", right: "Berkuah" } ✅ (saling oposisi)
- { left: "Simple", right: "Kaya Rempah" } ✅ (saling oposisi)

Return HANYA JSON array dengan 10-15 pertanyaan dalam format ya/tidak, tidak lebih dan tidak kurang.`;

    const contents = `Generate 10-15 pertanyaan yang GENERAL dan UMUM (5-8 kata) untuk rekomendasi restoran di Indonesia.
PENTING: 
- Semua pertanyaan HARUS dalam format YA/TIDAK (binary choice) yang cocok dengan swipe interface (swipe kiri = tidak, swipe kanan = ya)
- Pertanyaan harus GENERAL dan UMUM - fokus pada preferensi dasar seperti: nasi/tidak nasi, berkuah/kering, pedas/tidak pedas, murah/mahal, lokal/internasional, dll
- Pertanyaan harus cukup panjang (5-8 kata) untuk natural dan mudah dipahami, tidak terlalu singkat
- PENTING: Pastikan TIDAK ADA pertanyaan yang REPETITIF atau MIRIP - setiap pertanyaan harus unik dan berbeda
- Hindari pertanyaan yang terlalu spesifik atau niche
- Pertanyaan harus membantu mengidentifikasi preferensi makanan user dengan akurasi tinggi`;

    // Generate content using GoogleGenAI
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error('No response text from Gemini API');
    }

    // Clean the text - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    // Try to extract JSON array from the response
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    // Parse JSON with error handling
    let questions;
    try {
      questions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse JSON from Gemini response:', parseError);
      console.error('Response text:', cleanedText);
      throw new Error('Invalid JSON response from Gemini API');
    }

    // Validate and ensure we have questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid response format from Gemini API');
    }

    // Ensure we have 10-15 questions
    if (questions.length < 10) {
      console.warn(`Received only ${questions.length} questions, expected 10-15`);
    } else if (questions.length > 15) {
      console.warn(`Received ${questions.length} questions, limiting to 15`);
      questions = questions.slice(0, 15);
    }

    // Validate and format questions with images from Pexels
    const questionsWithImages = await Promise.all(
      questions.map(async (q, index) => {
        // Ensure id is sequential
        const questionId = q.id || index + 1;
        
        // Validate required fields
        if (!q.question || !q.emoji) {
          throw new Error(`Question ${questionId} is missing required fields (question, emoji)`);
        }

        // Validate options format if present
        let options = undefined;
        if (q.options) {
          if (typeof q.options === 'object' && q.options.left && q.options.right) {
            options = {
              left: q.options.left,
              right: q.options.right
            };
          }
        }

        // Get image from Pexels based on question keyword
        // Extract main keyword from question (the main point, not the whole question)
        let searchQuery = q.question
          .toLowerCase()
          .replace(/lagi pengen|mau|preferensi|makanan|makan|yang|ini|hari|apa|atau|dan|dengan|di|untuk|adalah|saja|juga|sudah|belum|tidak|bukan/gi, '')
          .replace(/[?]/g, '')
          .trim();
        
        // Extract the main keyword (usually the last meaningful word or the key concept)
        // Examples: "Lagi pengen makan nasi?" -> "nasi"
        //           "Lagi pengen makanan pedas?" -> "pedas"
        //           "Mau makanan berkuah?" -> "berkuah"
        const words = searchQuery.split(/\s+/).filter(word => word.length > 2);
        
        // Get the most relevant keyword (usually the last word or a key food-related word)
        if (words.length > 0) {
          // Priority: look for food-related keywords first
          const foodKeywords = ['nasi', 'pedas', 'berkuah', 'kering', 'seafood', 'lokal', 'internasional', 'murah', 'mahal', 'ramai', 'tenang', 'manis', 'gurih', 'panas', 'dingin'];
          const foundKeyword = words.find(word => foodKeywords.includes(word));
          searchQuery = foundKeyword || words[words.length - 1];
        } else {
          searchQuery = 'indonesian food';
        }

        // Get image from Pexels using the keyword
        const imageUrl = await searchUnsplashImage(searchQuery) || `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=800`;

        return {
          id: questionId,
          question: q.question,
          emoji: q.emoji,
          image: imageUrl,
          options: options // Optional field, only include if valid
        };
      })
    );

    return questionsWithImages;

  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    throw error;
  }
};

/**
 * Generate restaurant recommendations using Gemini AI
 * @param {Object} answers - User answers object { "question": "yes/no", ... }
 * @param {Object} location - Location data { type: 'current'|'city', coordinates?: {lat, lng}, city?: string }
 * @param {string} mode - 'solo' or 'duet'
 * @returns {Promise<Array>} Array of restaurant recommendations
 */
export const generateRecommendationsWithGemini = async (answers, location, mode = 'solo') => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    // Build system instruction with all rules
    let systemInstruction = `Kamu adalah asisten AI yang ahli dalam memberikan rekomendasi restoran di Indonesia. 
Berikan rekomendasi restoran yang sesuai dengan preferensi user.

Tugas kamu:
1. Analisis jawaban pengguna dan cocokkan dengan karakteristik restoran
2. Pilih HANYA 3 (TIGA) restoran yang PALING COCOK berdasarkan preferensi pengguna
3. Berikan deskripsi singkat mengapa restoran tersebut cocok
4. Gunakan URL gambar makanan yang sesuai dengan restoran, tidak harus dari restoran tersebut, paling tidak gambar sesuai dengan kategori makanan, dan boleh ambil dari unsplash.

Format output HARUS berupa JSON array dengan struktur berikut (TANPA markdown, TANPA code block, HANYA JSON murni):
[
  {
    "name": "Nama Restoran",
    "placeId": "ChIJ... (Google Place ID jika tersedia, atau null)",
    "image": "URL gambar.",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "rating": 4.5,
    "description": "Deskripsi singkat restoran yang sesuai dengan preferensi",
    "distance": "X.X km",
    "category": "Kategori makanan",
    "priceRange": "Rp XX.XXX - XX.XXX",
    "ambiance": "Suasana restoran",
    "address": "Alamat restoran (opsional)",
    "googleMapsUrl": "Link Google Maps lokasi restoran dengan format seperti https://maps.google.com/?cid=837353299636375309&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ"
  }
]

Rules:
1. Deskripsi harus sesuai dengan jawaban user
2. Rating antara 4.0 - 5.0
3. Distance harus realistis:
   - Jika user menggunakan lokasi sekarang: maksimal 5 km dari koordinat user
   - Jika user memilih kota manual: jarak bisa bervariasi di seluruh kota (tidak ada batasan radius)
4. Price range harus realistis untuk Indonesia
5. Category harus sesuai (Makanan Lokal, Makanan Internasional, Cafe & Snack, Seafood, dll)
6. Ambiance harus sesuai (Tenang & Nyaman, Ramai & Meriah, Casual & Ramai, dll)
7. Sertakan koordinat (latitude, longitude) restoran yang akurat dan sesuai dengan lokasi restoran di Indonesia
8. Google Maps URL harus valid dan bisa digunakan untuk redirect langsung ke lokasi restoran di Google Maps
9. Hanya return JSON array dengan TEPAT 3 (TIGA) restoran, tidak lebih dan tidak kurang
10. Rekomendasi hanya restoran yang umum dan populer di Indonesia
11. Urutkan dari yang paling cocok`;

    // Add location context to system instruction
    if (location?.type === 'current' && location?.coordinates) {
      const { latitude, longitude } = location.coordinates;
      systemInstruction += `\n\nUser berada di lokasi dengan koordinat: Latitude ${latitude}, Longitude ${longitude}. 
Berikan rekomendasi restoran yang dekat dengan lokasi tersebut (dalam radius ${location.radius || '5 km'} dari koordinat tersebut). 
PENTING: Hanya cari restoran dalam radius 5 km dari koordinat tersebut.`;
    } else if (location?.type === 'city' && location?.city) {
      systemInstruction += `\n\nUser mencari restoran di kota: ${location.city}. 
Berikan rekomendasi restoran yang berada di seluruh kota ${location.city} (tidak ada batasan radius, cari di seluruh area kota). 
PENTING: Cari restoran di seluruh kota ${location.city}, bukan hanya area tertentu.`;
    }

    // Build contents - only answers and location
    let contents = '';
    
    if (mode === 'duet' && answers.user1 && answers.user2) {
      // Duet mode: combine both users' answers
      const user1Answers = Object.entries(answers.user1)
        .map(([question, answer]) => `- ${question}: ${answer === 'yes' ? 'Ya' : 'Tidak'}`)
        .join('\n');
      const user2Answers = Object.entries(answers.user2)
        .map(([question, answer]) => `- ${question}: ${answer === 'yes' ? 'Ya' : 'Tidak'}`)
        .join('\n');
      contents = `Preferensi User 1:\n${user1Answers}\n\nPreferensi User 2:\n${user2Answers}`;
    } else {
      // Solo mode or single answers object
      const answersToUse = answers.user1 || answers;
      contents = Object.entries(answersToUse)
        .map(([question, answer]) => `- ${question}: ${answer === 'yes' ? 'Ya' : 'Tidak'}`)
        .join('\n');
    }

    // Add location info to contents if available
    if (location?.type === 'current' && location?.coordinates) {
      contents += `\n\nLokasi: Latitude ${location.coordinates.latitude}, Longitude ${location.coordinates.longitude}`;
    } else if (location?.type === 'city' && location?.city) {
      contents += `\n\nLokasi: Kota ${location.city}`;
    }


    // Generate content using GoogleGenAI with systemInstruction and tools in config
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleMaps: {} }],
        ...(location?.type === 'current' && location?.coordinates ? {
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: location.coordinates.latitude,
                longitude: location.coordinates.longitude,
              },
            },
          },
        } : {}),
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error('No response text from Gemini API');
    }

    // Clean the text - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    // Try to extract JSON array from the response
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    // Parse JSON with error handling
    let recommendations;
    try {
      recommendations = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse JSON from Gemini response:', parseError);
      console.error('Response text:', cleanedText);
      throw new Error('Invalid JSON response from Gemini API');
    }

    // Validate and ensure we have recommendations
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error('Invalid response format from Gemini API');
    }

    // Ensure we only return exactly 3 recommendations
    if (recommendations.length > 3) {
      console.warn(`Received ${recommendations.length} recommendations, limiting to 3`);
      recommendations = recommendations.slice(0, 3);
    } else if (recommendations.length < 3) {
      console.warn(`Received only ${recommendations.length} recommendations, expected 3`);
    }

    // Validate and format recommendations with SerpAPI images
    const recommendationsWithImages = await Promise.all(
      recommendations.map(async (rec, index) => {
        // Get image from SerpAPI based on restaurant name/category
        // let imageUrl = rec.image;
        // if (!imageUrl) {
          let imageUrl = await getRestaurantImageFromSerp(rec);
        // }

        // Use Google Maps URL from Gemini response, no fallback
        const googleMapsUrl = rec.googleMapsUrl || null;

        return {
          name: rec.name || `Restoran ${index + 1}`,
          image: imageUrl,
          rating: rec.rating || 4.5,
          description: rec.description || 'Restoran dengan menu yang sesuai preferensi kamu',
          distance: rec.distance || '2.0 km',
          category: rec.category || 'Makanan Lokal',
          priceRange: rec.priceRange || 'Rp 30.000 - 70.000',
          ambiance: rec.ambiance || 'Casual & Ramai',
          latitude: rec.latitude,
          longitude: rec.longitude,
          placeId: rec.placeId || null,
          address: rec.address || null,
          googleMapsUrl: googleMapsUrl
        };
      })
    );

    return recommendationsWithImages;

  } catch (error) {
    console.error('Error generating recommendations with Gemini:', error);
    throw error;
  }
};

