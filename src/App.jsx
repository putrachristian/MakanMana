import { useState, useRef, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import ModeSelect from './components/ModeSelect';
import LocationSelect from './components/LocationSelect';
import QuestionSwipe from './components/QuestionSwipe';
import Loading from './components/Loading';
import ResultsList from './components/ResultsList';
import TopBar from './components/TopBar';
import PWAInstallPrompt from './components/InstallPrompt';
import Favorites from './components/Favorites';
import { generateRecommendations } from './utils/recommendations';
import { generateQuestions } from './utils/geminiApi';
import { questions as defaultQuestions } from './constants/questions';

export default function App() {
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
  const userAAnswersRef = useRef({});
  const isNavigatingRef = useRef(false);

  // Initialize history state and handle browser back/forward buttons
  useEffect(() => {
    // Set initial history state
    const initialState = {
      screen: 'splash',
      mode: null,
      location: null,
      previousScreen: null
    };
    window.history.replaceState(initialState, '', window.location.href);

    // Handle browser back/forward buttons
    const handlePopState = (event) => {
      if (event.state) {
        isNavigatingRef.current = true;
        const state = event.state;
        
        // Restore screen state
        setScreen(state.screen);
        
        // Restore mode and location if available
        if (state.mode) setMode(state.mode);
        if (state.location) setLocation(state.location);
        
        // Handle special cases
        if (state.screen === 'splash') {
          // Reset to initial state when going back to splash
          setMode(null);
          setLocation(null);
          setUserAAnswers({});
          setUserBAnswers({});
          userAAnswersRef.current = {};
          setCurrentUser('A');
          setRecommendations([]);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Helper function to update screen and history
  const navigateToScreen = (newScreen, stateData = {}) => {
    // Don't add history entry if we're navigating from browser back/forward
    if (!isNavigatingRef.current) {
      const newState = {
        screen: newScreen,
        mode: stateData.mode !== undefined ? stateData.mode : mode,
        location: stateData.location !== undefined ? stateData.location : location,
        previousScreen: screen
      };
      
      // Push new state to browser history
      window.history.pushState(newState, '', window.location.href);
    } else {
      isNavigatingRef.current = false;
    }
    
    setScreen(newScreen);
    if (stateData.mode !== undefined) setMode(stateData.mode);
    if (stateData.location !== undefined) setLocation(stateData.location);
  };

  const handleStart = () => {
    navigateToScreen('location');
  };

  const handleLocationSelect = (selectedLocation) => {
    console.log('Location selected:', selectedLocation);
    navigateToScreen('mode', { location: selectedLocation });
  };

  const handleModeSelect = async (selectedMode) => {
    navigateToScreen('questions', { mode: selectedMode });
    setCurrentUser('A');
    setUserAAnswers({});
    setUserBAnswers({});
    userAAnswersRef.current = {};
    
    setIsGeneratingQuestions(true);
    try {
      const generatedQuestions = await generateQuestions();
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
      setQuestions(defaultQuestions);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleQuestionsComplete = async (answers) => {
    if (mode === 'solo') {
      setUserAAnswers(answers);
      navigateToScreen('loading');
      try {
        console.log('Generating recommendations with location:', location);
        const results = await generateRecommendations(answers, location, mode);
        setRecommendations(results);
        navigateToScreen('result');
      } catch (error) {
        console.error('Error generating recommendations:', error);
        setRecommendations([]);
        navigateToScreen('result');
      }
    } else {
      // Duet mode
      if (currentUser === 'A') {
        setUserAAnswers(answers);
        userAAnswersRef.current = answers;
        setCurrentUser('B');
        navigateToScreen('userSwitch');
      } else {
        setUserBAnswers(answers);
        navigateToScreen('loading');
        try {
          const duetAnswers = {
            user1: userAAnswersRef.current,
            user2: answers
          };
          const results = await generateRecommendations(duetAnswers, location, mode);
          setRecommendations(results);
          navigateToScreen('result');
        } catch (error) {
          console.error('Error generating recommendations:', error);
          setRecommendations([]);
          navigateToScreen('result');
        }
      }
    }
  };

  const handleUserBStart = () => {
    navigateToScreen('questions');
  };

  const handleTryAgain = () => {
    navigateToScreen('mode', { mode: null, location: null });
    setUserAAnswers({});
    setUserBAnswers({});
    userAAnswersRef.current = {};
    setCurrentUser('A');
    setRecommendations([]);
  };

  const handleBackToMenu = () => {
    navigateToScreen('mode', { mode: null, location: null });
    setUserAAnswers({});
    setUserBAnswers({});
    userAAnswersRef.current = {};
    setCurrentUser('A');
    setRecommendations([]);
  };

  const handleBackToLocation = () => {
    navigateToScreen('location');
  };

  const handleLoadMore = async () => {
    navigateToScreen('loading');
    try {
      const answers = mode === 'solo' ? userAAnswers : { user1: userAAnswers, user2: userBAnswers };
      const results = await generateRecommendations(answers, location, mode);
      setRecommendations(results);
      navigateToScreen('result');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setRecommendations([]);
      navigateToScreen('result');
    }
  };

  const handleAddToFavorites = (restaurant) => {
    if (!favorites.find(f => f.name === restaurant.name)) {
      setFavorites([...favorites, restaurant]);
    }
  };

  const handleViewFavorites = () => {
    navigateToScreen('favorites');
  };

  const handleBackToResult = () => {
    navigateToScreen('result');
  };

  // Show loading screen while generating questions
  if (screen === 'questions' && isGeneratingQuestions) {
    return (
      <div className="min-h-screen bg-[#FFA654]">
        <div className="w-full h-screen bg-white overflow-hidden relative">
          <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#FFF7ED] to-white">
            <div className="relative w-64 h-64 mb-12">
              <div className="absolute left-0 top-1/2 -translate-y-1/2">
                <div className="text-7xl">❓</div>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <div className="text-7xl">🍽️</div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="text-5xl">✨</div>
              </div>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-['Poppins'] font-semibold text-[#FFA654] mb-2">
                Menyiapkan pertanyaan...
              </h2>
              <p className="text-lg text-gray-600 font-['Poppins']">
                AI sedang membuat pertanyaan khusus untukmu
              </p>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full bg-[#FFA654]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFA654]">
      <div className="w-full h-screen bg-white overflow-hidden relative">
        {/* Header */}
        {screen !== 'splash' && screen !== 'loading' && (
          <TopBar
            favorites={favorites}
            onViewFavorites={handleViewFavorites}
          />
        )}

        {/* Content */}
        <div className={`h-full overflow-hidden ${screen !== 'splash' && screen !== 'loading' ? 'pt-14 sm:pt-16' : ''}`}>
          {screen === 'splash' && <SplashScreen onStart={handleStart} />}
          {screen === 'location' && <LocationSelect onSelect={handleLocationSelect} />}
          {screen === 'mode' && <ModeSelect onSelect={handleModeSelect} location={location} onLocationClick={handleBackToLocation} />}
          {screen === 'questions' && (
            <QuestionSwipe
              questions={questions}
              onComplete={handleQuestionsComplete}
              mode={mode}
              currentUser={currentUser}
              onBack={handleBackToMenu}
            />
          )}
          {screen === 'userSwitch' && (
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
                onClick={handleUserBStart}
                className="bg-white text-[#FFA654] px-8 py-4 rounded-full font-['Poppins'] font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Mulai Jawab ❤️
              </button>
            </div>
          )}
          {screen === 'loading' && <Loading mode={mode} />}
          {screen === 'result' && (
            <ResultsList
              recommendations={recommendations}
              mode={mode}
              onTryAgain={handleTryAgain}
              onLoadMore={handleLoadMore}
              onAddToFavorites={handleAddToFavorites}
              favorites={favorites}
            />
          )}
          {screen === 'favorites' && (
            <Favorites
              favorites={favorites}
              onBack={handleBackToResult}
            />
          )}
        </div>

        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
      </div>
    </div>
  );
}
