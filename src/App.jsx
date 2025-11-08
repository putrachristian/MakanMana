import { useState, useEffect, useRef } from 'react';
import SplashScreen from './components/SplashScreen';
import ModeSelect from './components/ModeSelect';
import LocationSelect from './components/LocationSelect';
import QuestionSwipe from './components/QuestionSwipe';
import Loading from './components/Loading';
import ResultsList from './components/ResultsList';
import Favorites from './components/Favorites';
import { Utensils } from 'lucide-react';
import { generateRecommendations } from './utils/recommendations';

const App = () => {
  const [screen, setScreen] = useState('splash');
  const [mode, setMode] = useState(null);
  const [location, setLocation] = useState(null);
  const [userAAnswers, setUserAAnswers] = useState([]);
  const [userBAnswers, setUserBAnswers] = useState([]);
  const [currentUser, setCurrentUser] = useState('A');
  const [recommendations, setRecommendations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const timeoutRef = useRef(null);

  // Helper function to reset app state
  const resetState = (targetScreen = 'mode') => {
    setScreen(targetScreen);
    setMode(null);
    setLocation(null);
    setUserAAnswers([]);
    setUserBAnswers([]);
    setCurrentUser('A');
    setRecommendations([]);
  };

  // Helper function to process recommendations with cleanup
  const processRecommendations = (delay = 3000) => {
    setScreen('loading');
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const results = generateRecommendations();
      setRecommendations(results);
      setScreen('result');
      timeoutRef.current = null;
    }, delay);
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
    setScreen('mode');
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setScreen('questions');
    setCurrentUser('A');
    setUserAAnswers([]);
    setUserBAnswers([]);
  };

  const handleQuestionsComplete = (answers) => {
    if (mode === 'solo') {
      setUserAAnswers(answers);
      processRecommendations();
    } else {
      if (currentUser === 'A') {
        setUserAAnswers(answers);
        setCurrentUser('B');
        setScreen('userSwitch');
      } else {
        setUserBAnswers(answers);
        processRecommendations(3500);
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
        return (
          <QuestionSwipe
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
            onLoadMore={() => processRecommendations(2000)}
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
