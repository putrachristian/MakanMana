import { motion } from 'motion/react';
import { ArrowLeft, Star, MapPin } from 'lucide-react';

const Favorites = ({ favorites, onBack }) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#FFF7ED] to-white">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-[#FFA654] rounded-full flex items-center justify-center text-white hover:bg-[#FF8C42] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-['Poppins'] font-semibold text-[#FFA654]">
            Tempat Favorit
          </h2>
        </div>
        <p className="text-gray-600 font-['Poppins'] text-sm ml-13">
          {favorites.length} tempat tersimpan
        </p>
      </div>

      {/* Favorites list */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center"
          >
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-['Poppins'] font-semibold text-gray-700 mb-2">
              Belum ada favorit
            </h3>
            <p className="text-gray-500 font-['Poppins']">
              Mulai cari tempat makan dan simpan favoritmu!
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {favorites.map((restaurant, index) => (
              <motion.div
                key={`${restaurant.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="flex">
                  {/* Image */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-['Poppins'] font-semibold text-gray-800 mb-1 line-clamp-1">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-['Poppins']">{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span className="font-['Poppins']">{restaurant.distance}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-['Poppins'] line-clamp-2">
                        {restaurant.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs bg-[#FFA654]/10 text-[#FFA654] px-2 py-1 rounded-full font-['Poppins']">
                        {restaurant.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom tip */}
      {favorites.length > 0 && (
        <div className="p-6 pt-0">
          <div className="bg-[#FFF7ED] p-4 rounded-2xl">
            <p className="text-sm text-gray-600 font-['Poppins'] text-center">
              💡 Klik tempat favorit untuk melihat di Google Maps
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;

