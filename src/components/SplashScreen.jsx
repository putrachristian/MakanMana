import { motion } from 'motion/react';
import { Utensils, Pizza, Soup, Sandwich } from 'lucide-react';

export default function SplashScreen({ onStart }) {
  return (
    <div className="h-full flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-br from-[#FFA654] to-[#FF7F50] relative overflow-hidden">
      {/* Floating food icons */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-12 sm:top-20 left-6 sm:left-10 text-white/20"
      >
        <Pizza className="w-10 h-10 sm:w-16 sm:h-16" />
      </motion.div>
      
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-24 sm:top-40 right-6 sm:right-10 text-white/20"
      >
        <Soup className="w-12 h-12 sm:w-20 sm:h-20" />
      </motion.div>
      
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-32 sm:bottom-40 left-4 sm:left-8 text-white/20"
      >
        <Sandwich className="w-10 h-10 sm:w-14 sm:h-14" />
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-4 sm:mb-6"
        >
          <div className="text-6xl sm:text-7xl md:text-8xl mb-2">🍽️</div>
        </motion.div>

        {/* App name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl font-['Poppins'] font-semibold text-white mb-3 sm:mb-4 text-center"
        >
          MakanMana?
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl font-['Poppins'] text-white/90 mb-8 sm:mb-12 text-center px-4"
        >
          Swipe dulu, makan kemudian.
        </motion.p>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🤔</div>
          <p className="text-sm sm:text-base text-white/80 font-['Poppins']">Bingung mau makan apa?</p>
        </motion.div>
      </div>

      {/* Start button */}
      <motion.button
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="w-full max-w-md bg-white text-[#FFA654] py-3.5 sm:py-4 rounded-full font-['Poppins'] font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all mb-6 sm:mb-8 flex items-center justify-center"
      >
        Mulai Sekarang 🎉
      </motion.button>

      {/* Rotating food emojis */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-3 sm:gap-4 text-2xl sm:text-3xl"
      >
        {['🍔', '🍜', '🍕', '🍖'].map((emoji, index) => (
          <motion.span
            key={index}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
