import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import SplashScreen from './components/SplashScreen';
import ModeSelect from './components/ModeSelect';
import LocationSelect from './components/LocationSelect';
import QuestionSwipe from './components/QuestionSwipe';
import Loading from './components/Loading';
import ResultsList from './components/ResultsList';
import Favorites from './components/Favorites';
import { Utensils } from 'lucide-react';
import { generateRecommendations } from './utils/recommendations';
import { generateQuestions } from './utils/geminiApi';
import { questions as defaultQuestions } from './constants/questions';

const App = () => {
  const [screen, setScreen] = useState('splash');
  const [mode, setMode] = useState(null);
  const [location, setLocation] = useState(null);
  const [userAAnswers, setUserAAnswers] = useState({});
  const [userBAnswers, setUserBAnswers] = useState({});
  const [currentUser, setCurrentUser] = useState('A');
  const [recommendations, setRecommendations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [questions, setQuestions] = useState(defaultQuestions);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const timeoutRef = useRef(null);
  const userAAnswersRef = useRef({});

  // Helper function to reset app state
  const resetState = (targetScreen = 'mode') => {
    setScreen(targetScreen);
    setMode(null);
    setLocation(null);
    setUserAAnswers({});
    setUserBAnswers({});
    userAAnswersRef.current = {}; // Reset ref as well
    setCurrentUser('A');
    setRecommendations([]);
  };

  // Helper function to process recommendations with cleanup
  const processRecommendations = async (answers, delay = 3000) => {
    setScreen('loading');
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Validate answers
    if (!answers || (typeof answers === 'object' && Object.keys(answers).length === 0)) {
      console.error('No answers provided for recommendations');
      setRecommendations([]);
      setScreen('result');
      return;
    }
    
    // Wait for minimum delay to show loading screen
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      const results = await generateRecommendations(answers, location, mode);
      setRecommendations(results);
      setScreen('result');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback: use empty array or show error
      setRecommendations([]);
      setScreen('result');
    }
    
    timeoutRef.current = null;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    
    // Log location data for debugging
    if (selectedLocation.type === 'current' && selectedLocation.coordinates) {
      console.log('Device location:', {
        latitude: selectedLocation.coordinates.latitude,
        longitude: selectedLocation.coordinates.longitude,
        radius: selectedLocation.radius
      });
    } else if (selectedLocation.type === 'city') {
      console.log('Selected city:', selectedLocation.city);
    }
    
    setScreen('mode');
  };

  const handleModeSelect = async (selectedMode) => {
    setMode(selectedMode);
    setCurrentUser('A');
    setUserAAnswers({});
    setUserBAnswers({});
    userAAnswersRef.current = {}; // Reset ref as well
    
    // Set screen to questions first to show loading
    setScreen('questions');
    setIsGeneratingQuestions(true);
    
    // Generate questions from Gemini
    try {
      const generatedQuestions = await generateQuestions();
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to default questions
      setQuestions(defaultQuestions);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleQuestionsComplete = async (answers) => {
    if (mode === 'solo') {
      // Solo mode: save as simple object
      setUserAAnswers(answers);
      console.log('Solo answers:', answers);
      await processRecommendations(answers);
    } else {
      // Duet mode: save with user1 and user2 structure
      if (currentUser === 'A') {
        setUserAAnswers(answers);
        userAAnswersRef.current = answers; // Store in ref for immediate access
        setCurrentUser('B');
        setScreen('userSwitch');
      } else {
        setUserBAnswers(answers);
        // Use userAAnswers from ref (guaranteed to be set from user A)
        const duetAnswers = {
          user1: userAAnswersRef.current,
          user2: answers
        };
        console.log('Duet answers:', duetAnswers);
        await processRecommendations(duetAnswers, 3500);
      }
    }
  };

  const handleAddToFavorites = (restaurant) => {
    if (!favorites.some(f => f.name === restaurant.name)) {
      setFavorites([...favorites, restaurant]);
    }
  };

  // Render current screen based on state
  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen onStart={() => setScreen('location')} />;
      
      case 'location':
        return <LocationSelect onSelect={handleLocationSelect} />;
      
      case 'mode':
        return <ModeSelect onSelect={handleModeSelect} />;
      
      case 'questions':
        if (isGeneratingQuestions) {
          return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#FFF7ED] to-white">
              {/* Animated food icons */}
              <div className="relative w-64 h-64 mb-12">
                {/* Left food icon */}
                <motion.div
                  animate={{
                    x: [0, 50, 50, 0],
                    y: [0, -20, -20, 0],
                    rotate: [0, 180, 360, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                >
                  <div className="text-7xl">❓</div>
                </motion.div>

                {/* Right food icon */}
                <motion.div
                  animate={{
                    x: [0, -50, -50, 0],
                    y: [0, -20, -20, 0],
                    rotate: [0, -180, -360, -360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                >
                  <div className="text-7xl">🍽️</div>
                </motion.div>

                {/* Center sparkle */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="text-5xl">✨</div>
                </motion.div>
              </div>

              {/* Loading message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl font-['Poppins'] font-semibold text-[#FFA654] mb-2">
                  Menyiapkan pertanyaan...
                </h2>
                <p className="text-lg text-gray-600 font-['Poppins']">
                  AI sedang membuat pertanyaan khusus untukmu
                </p>
              </motion.div>

              {/* Loading dots */}
              <div className="flex gap-2">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut"
                    }}
                    className="w-3 h-3 rounded-full bg-[#FFA654]"
                  />
                ))}
              </div>
            </div>
          );
        }
        return (
          <QuestionSwipe
            questions={questions}
            onComplete={handleQuestionsComplete}
            mode={mode}
            currentUser={currentUser}
            onBack={() => resetState('location')}
          />
        );
      
      case 'userSwitch':
        return (
          <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#FFA654] to-[#FF7F50]">
            <div className="text-center text-white mb-8">
              <div className="text-6xl mb-4">💞</div>
              <h2 className="text-3xl font-['Poppins'] font-semibold mb-4">
                Sekarang giliran pasanganmu!
              </h2>
              <p className="text-lg opacity-90">
                Kasih HP-nya ke pasanganmu untuk jawab pertanyaan yang sama
              </p>
            </div>
            <button
              onClick={() => setScreen('questions')}
              className="bg-white text-[#FFA654] px-8 py-4 rounded-full font-['Poppins'] font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Mulai Jawab ❤️
            </button>
          </div>
        );
      
      case 'loading':
        return <Loading mode={mode} />;
      
      case 'result':
        return (
          <ResultsList
            recommendations={recommendations}
            mode={mode}
            onTryAgain={() => resetState('mode')}
            onLoadMore={async () => {
              const answers = mode === 'solo' ? userAAnswers : { user1: userAAnswers, user2: userBAnswers };
              await processRecommendations(answers, 2000);
            }}
            onAddToFavorites={handleAddToFavorites}
            favorites={favorites}
          />
        );
      
      case 'favorites':
        return (
          <Favorites
            favorites={favorites}
            onBack={() => setScreen('result')}
          />
        );
      
      default:
        return <SplashScreen onStart={() => setScreen('location')} />;
    }
  };

  const showHeader = screen !== 'splash' && screen !== 'loading';

  return (
    <div className="min-h-screen bg-[#FFA654]">
      <div className="w-full h-screen bg-white overflow-hidden relative">
        {showHeader && (
          <div className="absolute top-0 left-0 right-0 bg-[#FFA654] text-white p-4 flex items-center justify-between z-10 shadow-md">
            <div className="flex items-center gap-2">
              <Utensils className="w-6 h-6" />
              <span className="font-['Poppins'] font-semibold">MakanMana?</span>
            </div>
            <button
              onClick={() => setScreen('favorites')}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
            >
              ❤️ {favorites.length}
            </button>
          </div>
        )}

        <div className={`h-full overflow-hidden ${showHeader ? 'pt-16' : ''}`}>
          {renderScreen()}
        </div>
      </div>
    </div>
  );
};

export default App;
