import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import ModeSelect from './components/ModeSelect';
import LocationSelect from './components/LocationSelect';
import QuestionSwipe from './components/QuestionSwipe';
import Loading from './components/Loading';
import ResultsList from './components/ResultsList';
import Favorites from './components/Favorites';
import { Utensils } from 'lucide-react';

const App = () => {
  const [screen, setScreen] = useState('splash');
  const [mode, setMode] = useState(null);
  const [location, setLocation] = useState(null);
  const [userAAnswers, setUserAAnswers] = useState([]);
  const [userBAnswers, setUserBAnswers] = useState([]);
  const [currentUser, setCurrentUser] = useState('A');
  const [recommendation, setRecommendation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const handleStart = () => {
    setScreen('location');
  };

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
      setScreen('loading');
      // Simulate AI processing
      setTimeout(() => {
        const results = generateRecommendations(answers, location, mode);
        setRecommendations(results);
        setScreen('result');
      }, 3000);
    } else {
      // Duet mode
      if (currentUser === 'A') {
        setUserAAnswers(answers);
        setCurrentUser('B');
        setScreen('userSwitch');
      } else {
        setUserBAnswers(answers);
        setScreen('loading');
        // Simulate AI processing for duet
        setTimeout(() => {
          const results = generateRecommendations([...userAAnswers, ...answers], location, mode);
          setRecommendations(results);
          setScreen('result');
        }, 3500);
      }
    }
  };

  const handleUserBStart = () => {
    setScreen('questions');
  };

  const handleTryAgain = () => {
    setScreen('mode');
    setMode(null);
    setLocation(null);
    setUserAAnswers([]);
    setUserBAnswers([]);
    setCurrentUser('A');
    setRecommendations([]);
  };

  const handleBackToMenu = () => {
    setScreen('location');
    setMode(null);
    setLocation(null);
    setUserAAnswers([]);
    setUserBAnswers([]);
    setCurrentUser('A');
    setRecommendations([]);
  };

  const handleLoadMore = () => {
    setScreen('loading');
    setTimeout(() => {
      const results = generateRecommendations(userAAnswers, location, mode);
      setRecommendations(results);
      setScreen('result');
    }, 2000);
  };

  const handleAddToFavorites = (restaurant) => {
    if (!favorites.find(f => f.name === restaurant.name)) {
      setFavorites([...favorites, restaurant]);
    }
  };

  const handleViewFavorites = () => {
    setScreen('favorites');
  };

  const handleBackToResult = () => {
    setScreen('result');
  };

  return (
    <div className="min-h-screen bg-[#FFA654]">
      <div className="w-full h-screen bg-white overflow-hidden relative">
        {/* Header */}
        {screen !== 'splash' && screen !== 'loading' && (
          <div className="absolute top-0 left-0 right-0 bg-[#FFA654] text-white p-4 flex items-center justify-between z-10 shadow-md">
            <div className="flex items-center gap-2">
              <Utensils className="w-6 h-6" />
              <span className="font-['Poppins'] font-semibold">MakanMana?</span>
            </div>
            <button
              onClick={handleViewFavorites}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
            >
              ❤️ {favorites.length}
            </button>
          </div>
        )}

        {/* Content */}
        <div className={`h-full overflow-hidden ${screen !== 'splash' && screen !== 'loading' ? 'pt-16' : ''}`}>
          {screen === 'splash' && <SplashScreen onStart={handleStart} />}
          {screen === 'location' && <LocationSelect onSelect={handleLocationSelect} />}
          {screen === 'mode' && <ModeSelect onSelect={handleModeSelect} />}
          {screen === 'questions' && (
            <QuestionSwipe
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
      </div>
    </div>
  );
};

// Generate mock recommendations based on answers
const generateRecommendations = (answers, location, mode) => {
  const allRestaurants = [
    {
      name: "Warung Mie Pedas Juara",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
      rating: 4.6,
      description: "Makanan berkuah, pedas sedang, cocok untuk makan malam.",
      distance: "2.8 km",
      category: "Mie & Noodles",
      priceRange: "Rp 20.000 - 50.000",
      ambiance: "Casual & Ramai"
    },
    {
      name: "Bebek Goreng Crispy Pak Slamet",
      image: "https://images.unsplash.com/photo-1604908815852-8158682bda77?w=800",
      rating: 4.8,
      description: "Makanan kering, gurih, dengan nasi putih hangat.",
      distance: "1.5 km",
      category: "Makanan Lokal",
      priceRange: "Rp 30.000 - 70.000",
      ambiance: "Tenang & Nyaman"
    },
    {
      name: "Sushi Rama",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
      rating: 4.7,
      description: "Fresh sushi, cocok untuk makan siang atau malam.",
      distance: "3.2 km",
      category: "Makanan Internasional",
      priceRange: "Rp 50.000 - 150.000",
      ambiance: "Modern & Tenang"
    },
    {
      name: "Nasi Goreng Kambing Bang Toyib",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
      rating: 4.5,
      description: "Nasi goreng pedas dengan daging kambing empuk.",
      distance: "0.8 km",
      category: "Makanan Lokal",
      priceRange: "Rp 25.000 - 60.000",
      ambiance: "Ramai & Meriah"
    },
    {
      name: "Pasta & Pizza Corner",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
      rating: 4.4,
      description: "Pasta creamy dan pizza panggang oven.",
      distance: "4.1 km",
      category: "Makanan Internasional",
      priceRange: "Rp 40.000 - 100.000",
      ambiance: "Cozy & Romantis"
    },
    {
      name: "Ayam Geprek Sambal Matah",
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800",
      rating: 4.7,
      description: "Ayam crispy dengan sambal matah pedas manis.",
      distance: "1.2 km",
      category: "Makanan Lokal",
      priceRange: "Rp 25.000 - 45.000",
      ambiance: "Casual & Ramai"
    },
    {
      name: "Bakso Beranak Malang",
      image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800",
      rating: 4.6,
      description: "Bakso jumbo isi bakso kecil dengan kuah gurih.",
      distance: "2.1 km",
      category: "Makanan Lokal",
      priceRange: "Rp 20.000 - 40.000",
      ambiance: "Ramai & Meriah"
    },
    {
      name: "Kafe Kopi & Roti Bakar",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
      rating: 4.5,
      description: "Kopi specialty dengan roti bakar topping premium.",
      distance: "3.5 km",
      category: "Cafe & Snack",
      priceRange: "Rp 30.000 - 60.000",
      ambiance: "Tenang & Nyaman"
    },
    {
      name: "Seafood Bakar Jimbaran",
      image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800",
      rating: 4.8,
      description: "Seafood segar dibakar dengan bumbu khas Bali.",
      distance: "4.5 km",
      category: "Seafood",
      priceRange: "Rp 80.000 - 200.000",
      ambiance: "Ramai & Meriah"
    }
  ];

  // Shuffle array and pick 3 random restaurants
  const shuffled = [...allRestaurants].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

export default App;

