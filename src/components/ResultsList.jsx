import { motion } from 'motion/react';
import { MapPin, Star, Heart, RefreshCw, Navigation, DollarSign, Sparkles } from 'lucide-react';

const ResultsList = ({ 
  recommendations, 
  mode, 
  onTryAgain,
  onLoadMore,
  onAddToFavorites, 
  favorites 
}) => {
  const handleOpenMaps = (restaurant) => {
    const query = encodeURIComponent(restaurant.name);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  const isFavorited = (restaurant) => 
    favorites.some(f => f.name === restaurant.name);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#FFF7ED] to-white">
      {/* Success header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center py-6 px-4"
      >
        <div className="text-5xl mb-2">🎉</div>
        <h2 className="text-2xl font-['Poppins'] font-semibold text-[#FFA654] mb-1">
          Rekomendasi Untukmu!
        </h2>
        {mode === 'duet' && (
          <p className="text-sm text-gray-600 font-['Poppins']">
            Pilihan terbaik untuk kalian berdua 💞
          </p>
        )}
        <p className="text-sm text-gray-500 font-['Poppins'] mt-1">
          {recommendations.length} tempat makan yang cocok
        </p>
      </motion.div>

      {/* Restaurant cards list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-4">
          {recommendations.map((restaurant, index) => (
            <motion.div
              key={`${restaurant.name}-${index}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Favorite button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onAddToFavorites(restaurant)}
                  className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                    isFavorited(restaurant) ? 'bg-red-500' : 'bg-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited(restaurant) ? 'text-white fill-white' : 'text-red-500'}`} />
                </motion.button>

                {/* Restaurant name & rating */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-['Poppins'] font-semibold text-white mb-1">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-['Poppins'] font-semibold text-white text-sm">
                        {restaurant.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white text-sm">
                      <MapPin className="w-3 h-3" />
                      <span className="font-['Poppins']">{restaurant.distance} dari kamu</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-4">
                <p className="text-gray-700 font-['Poppins'] text-sm mb-3">
                  {restaurant.description}
                </p>

                {/* Quick info */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-[#FFF7ED] p-2 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign className="w-3 h-3 text-[#FFA654]" />
                      <span className="text-xs font-['Poppins'] text-gray-600">Budget</span>
                    </div>
                    <p className="text-xs font-['Poppins'] font-semibold text-[#FFA654]">
                      {restaurant.priceRange}
                    </p>
                  </div>
                  <div className="bg-[#FFF7ED] p-2 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-['Poppins'] text-gray-600">Suasana</span>
                    </div>
                    <p className="text-xs font-['Poppins'] font-semibold text-[#FFA654]">
                      {restaurant.ambiance}
                    </p>
                  </div>
                </div>

                {/* Category badge */}
                <div className="inline-block bg-[#FFA654] text-white px-3 py-1 rounded-full font-['Poppins'] text-xs mb-3">
                  {restaurant.category}
                </div>

                {/* Map button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenMaps(restaurant)}
                  className="w-full bg-gradient-to-r from-[#FFA654] to-[#FF8C42] text-white py-3 rounded-full font-['Poppins'] font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-sm"
                >
                  <Navigation className="w-4 h-4" />
                  Lihat di Google Maps
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-4 bg-white border-t border-gray-100 space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLoadMore}
          className="w-full bg-gradient-to-r from-[#FFA654] to-[#FF8C42] text-white py-3.5 rounded-full font-['Poppins'] font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Sparkles className="w-5 h-5" />
          Tampilkan 3 Rekomendasi Baru
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onTryAgain}
          className="w-full bg-white border-2 border-[#FFA654] text-[#FFA654] py-3.5 rounded-full font-['Poppins'] font-semibold flex items-center justify-center gap-2 hover:bg-[#FFF7ED] transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Coba Lagi
        </motion.button>
      </div>

      {/* Bottom message */}
      <div className="text-center pb-4 px-4">
        <p className="text-xs text-gray-500 font-['Poppins']">
          🍽️ Selamat makan! Semoga cocok dengan selera hari ini
        </p>
      </div>
    </div>
  );
};

export default ResultsList;

