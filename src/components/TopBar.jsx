import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export default function TopBar({ favorites, onViewFavorites }) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Logo */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-xl sm:text-2xl">🍜</span>
        <h1 className="text-base sm:text-xl font-['Poppins'] font-semibold text-[#FFA654]">
          MakanMana?
        </h1>
      </div>

      {/* Favorites button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onViewFavorites}
        className="relative w-9 h-9 sm:w-10 sm:h-10 bg-[#FFF7ED] rounded-full flex items-center justify-center text-[#FFA654] hover:bg-[#FFA654] hover:text-white transition-colors"
      >
        <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
        {favorites.length > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] sm:text-xs text-white font-['Poppins'] font-semibold">
              {favorites.length}
            </span>
          </div>
        )}
      </motion.button>
    </div>
  );
}

