import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const loadingMessages = [
  "Sedang membaca selera kamu hari ini…",
  "Menyesuaikan mood makannya 🍜💞",
  "Sebentar lagi ketemu tempat yang cocok!",
  "Mencari tempat makan terbaik untukmu…",
  "Hampir selesai! 🎉"
];

export default function Loading({ mode }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const modeColor = mode === 'duet' ? ['#FF7F89', '#FFB6C1'] : ['#FFA654', '#FF8C42'];

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#FFF7ED] to-white">
      {/* Animated food icons */}
      <div className="relative w-64 h-64 mb-12">
        {/* Left food icon */}
        <motion.div
          animate={{
            x: [0, 50, 50, 0],
            y: [0, -20, -20, 0],
            rotate: [0, 180, 360, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2"
        >
          <div className="text-7xl">🍜</div>
        </motion.div>

        {/* Right food icon */}
        <motion.div
          animate={{
            x: [0, -50, -50, 0],
            y: [0, -20, -20, 0],
            rotate: [0, -180, -360, -360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2"
        >
          <div className="text-7xl">🍕</div>
        </motion.div>

        {/* Center heart/sparkle */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="text-5xl">{mode === 'duet' ? '💞' : '✨'}</div>
        </motion.div>
      </div>

      {/* Loading message */}
      <motion.div
        key={messageIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center mb-8"
      >
        <p className="text-2xl font-['Poppins'] font-semibold text-[#FFA654]">
          {loadingMessages[messageIndex]}
        </p>
      </motion.div>

      {/* Loading dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.5, 1],
              backgroundColor: modeColor
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: modeColor[0] }}
          />
        ))}
      </div>

      {/* Fun fact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-gray-500 font-['Poppins']">
          💡 Tahukah kamu? Rata-rata orang menghabiskan 30 menit per hari untuk memutuskan mau makan apa!
        </p>
      </motion.div>
    </div>
  );
}
