import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Star, ExternalLink } from 'lucide-react';

export default function Favorites({ favorites, onBack }) {
  const handleOpenMaps = (restaurant) => {
    const query = encodeURIComponent(restaurant.name);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-[#FFF7ED] to-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#FFA654]"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
        <h2 className="text-xl sm:text-2xl font-['Poppins'] font-semibold text-[#FFA654]">
          Favorit Saya
        </h2>
      </div>

      {/* Favorites list */}
      {favorites.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">💔</div>
          <h3 className="text-lg sm:text-xl font-['Poppins'] font-semibold text-gray-700 mb-2">
            Belum ada favorit
          </h3>
          <p className="text-sm sm:text-base text-gray-500 font-['Poppins'] px-4">
            Tambahkan restoran favoritmu dari hasil rekomendasi!
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {favorites.map((restaurant, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-32 sm:h-40">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-['Poppins'] font-semibold text-xs sm:text-sm">{restaurant.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                <h3 className="font-['Poppins'] font-semibold text-base sm:text-lg text-gray-800 mb-1.5 sm:mb-2">
                  {restaurant.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-['Poppins'] mb-2 sm:mb-3">
                  {restaurant.description}
                </p>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFA654]" />
                    <span className="font-['Poppins']">{restaurant.distance}</span>
                  </div>
                  <div className="text-xs text-gray-600 font-['Poppins']">
                    {restaurant.category}
                  </div>
                  <div className="text-xs text-gray-600 font-['Poppins'] col-span-2">
                    💰 {restaurant.priceRange}
                  </div>
                </div>

                {/* Maps button */}
                <button
                  onClick={() => handleOpenMaps(restaurant)}
                  className="w-full bg-[#FFA654] text-white py-2 sm:py-2.5 rounded-xl font-['Poppins'] font-semibold hover:bg-[#FF8C42] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Buka di Google Maps
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
