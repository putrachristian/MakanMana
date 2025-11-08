import { motion } from 'motion/react';
import { Utensils, Pizza, Soup, Sandwich } from 'lucide-react';

export default function SplashScreen({ onStart }) {
  return (
    <div className="h-full flex flex-col items-center justify-between p-8 bg-gradient-to-br from-[#FFA654] to-[#FF7F50] relative overflow-hidden">
      {/* Floating food icons */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-10 text-white/20"
      >
        <Pizza className="w-16 h-16" />
      </motion.div>
      
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-40 right-10 text-white/20"
      >
        <Soup className="w-20 h-20" />
      </motion.div>
      
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-40 left-8 text-white/20"
      >
        <Sandwich className="w-14 h-14" />
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-6"
        >
          <div className="text-8xl mb-2">🍽️</div>
        </motion.div>

        {/* App name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-['Poppins'] font-semibold text-white mb-4 text-center"
        >
          MakanMana?
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl font-['Poppins'] text-white/90 mb-12 text-center"
        >
          Swipe dulu, makan kemudian.
        </motion.p>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">🤔</div>
          <p className="text-white/80 font-['Poppins']">Bingung mau makan apa?</p>
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
        className="w-full bg-white text-[#FFA654] py-4 rounded-full font-['Poppins'] font-semibold text-lg shadow-lg hover:shadow-xl transition-all mb-8 flex items-center justify-center"
      >
        Mulai Sekarang 🎉
      </motion.button>

      {/* Rotating food emojis */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-4 text-3xl"
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

