import { motion } from 'motion/react';
import { MapPin, Star, Heart, RefreshCw, Navigation, Clock, DollarSign } from 'lucide-react';

const ResultCard = ({ recommendation, mode, onTryAgain, onAddToFavorites, isFavorited }) => {
  const handleOpenMaps = () => {
    // Mock Google Maps link
    const query = encodeURIComponent(recommendation.name);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#FFF7ED] to-white overflow-y-auto">
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center py-6"
      >
        <div className="text-6xl mb-2">🎉</div>
        <h2 className="text-2xl font-['Poppins'] font-semibold text-[#FFA654] mb-2">
          Ketemu!
        </h2>
        {mode === 'duet' && (
          <p className="text-sm text-gray-600 font-['Poppins']">
            Kalian berdua lagi sepakat mau makan di sini 😍
          </p>
        )}
      </motion.div>

      {/* Restaurant card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-6 mb-6 bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Image */}
        <div className="relative h-64">
          <img
            src={recommendation.image}
            alt={recommendation.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Favorite button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddToFavorites(recommendation)}
            className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isFavorited ? 'bg-red-500' : 'bg-white'
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavorited ? 'text-white fill-white' : 'text-red-500'}`} />
          </motion.button>

          {/* Restaurant name */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-3xl font-['Poppins'] font-semibold text-white mb-2">
              {recommendation.name}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-['Poppins'] font-semibold text-white">
                  {recommendation.rating}
                </span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <MapPin className="w-4 h-4" />
                <span className="font-['Poppins']">{recommendation.distance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          <p className="text-gray-700 font-['Poppins'] mb-4">
            {recommendation.description}
          </p>

          {/* Quick info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#FFF7ED] p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-[#FFA654]" />
                <span className="text-xs font-['Poppins'] text-gray-600">Budget</span>
              </div>
              <p className="text-sm font-['Poppins'] font-semibold text-[#FFA654]">
                {recommendation.priceRange}
              </p>
            </div>
            <div className="bg-[#FFF7ED] p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[#FFA654]" />
                <span className="text-xs font-['Poppins'] text-gray-600">Suasana</span>
              </div>
              <p className="text-sm font-['Poppins'] font-semibold text-[#FFA654]">
                {recommendation.ambiance}
              </p>
            </div>
          </div>

          {/* Category badge */}
          <div className="inline-block bg-[#FFA654] text-white px-4 py-2 rounded-full font-['Poppins'] text-sm mb-6">
            {recommendation.category}
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenMaps}
              className="w-full bg-gradient-to-r from-[#FFA654] to-[#FF8C42] text-white py-4 rounded-full font-['Poppins'] font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Navigation className="w-5 h-5" />
              Lihat di Google Maps
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTryAgain}
              className="w-full bg-white border-2 border-[#FFA654] text-[#FFA654] py-4 rounded-full font-['Poppins'] font-semibold flex items-center justify-center gap-2 hover:bg-[#FFF7ED] transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Coba Lagi
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Bottom message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center pb-8 px-6"
      >
        <div className="text-4xl mb-2">🍽️</div>
        <p className="text-sm text-gray-600 font-['Poppins']">
          Selamat makan! Semoga cocok dengan selera kamu hari ini 😊
        </p>
      </motion.div>
    </div>
  );
};

export default ResultCard;

