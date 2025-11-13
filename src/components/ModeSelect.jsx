import { motion } from 'motion/react';
import { User, Users } from 'lucide-react';

export default function ModeSelect({ onSelect }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-b from-[#FFF7ED] to-white">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8 md:mb-12 px-2"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-['Poppins'] font-semibold text-[#FFA654] mb-2 sm:mb-3">
          Mau makan sendiri atau bareng pasangan?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 font-['Poppins']">
          Pilih mode yang sesuai dengan kebutuhanmu
        </p>
      </motion.div>

      {/* Mode cards */}
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        {/* Solo Mode */}
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect('solo')}
          className="w-full bg-gradient-to-br from-[#FFA654] to-[#FF8C42] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 text-white/10 transform translate-x-4 -translate-y-4">
            <User className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40" />
          </div>
          <div className="relative z-10">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4">🍜</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-['Poppins'] font-semibold text-white mb-1 sm:mb-2">
              Solo Mode
            </h3>
            <p className="text-sm sm:text-base text-white/90 font-['Poppins']">
              Cari makan untuk dirimu sendiri
            </p>
          </div>
        </motion.button>

        {/* Duet Mode */}
        <motion.button
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect('duet')}
          className="w-full bg-gradient-to-br from-[#FF7F89] to-[#FFB6C1] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 text-white/10 transform translate-x-4 -translate-y-4">
            <Users className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40" />
          </div>
          <div className="relative z-10">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4">💞</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-['Poppins'] font-semibold text-white mb-1 sm:mb-2">
              Duet Mode
            </h3>
            <p className="text-sm sm:text-base text-white/90 font-['Poppins']">
              Temukan tempat makan yang cocok berdua
            </p>
          </div>
        </motion.button>
      </div>

      {/* Bottom illustration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 sm:mt-8 md:mt-12 text-center"
      >
        <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">👫</div>
        <p className="text-xs sm:text-sm text-gray-500 font-['Poppins']">
          Pilih mode sesuai kebutuhanmu
        </p>
      </motion.div>
    </div>
  );
}
