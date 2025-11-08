import { motion, useMotionValue, useTransform } from 'motion/react';
import { useState } from 'react';
import { X, Check, ArrowLeft, Home } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "Lagi pengen yang pedas gak?",
    emoji: "🌶️",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800"
  },
  {
    id: 2,
    question: "Mau makanan berkuah atau yang kering?",
    emoji: "🍜",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
    options: { left: "Kering", right: "Berkuah" }
  },
  {
    id: 3,
    question: "Lagi pengen makan nasi atau bukan nasi?",
    emoji: "🍚",
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800",
    options: { left: "Bukan Nasi", right: "Nasi" }
  },
  {
    id: 4,
    question: "Lagi pengen makanan lokal atau internasional?",
    emoji: "🌍",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    options: { left: "Internasional", right: "Lokal" }
  },
  {
    id: 5,
    question: "Budget makan hari ini?",
    emoji: "💰",
    image: "https://images.unsplash.com/photo-1554224311-beee460c201f?w=800",
    options: { left: "Hemat < 50k", right: "Bebas > 50k" }
  },
  {
    id: 6,
    question: "Lagi pengen suasana tenang atau ramai?",
    emoji: "🎭",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    options: { left: "Tenang", right: "Ramai" }
  },
  {
    id: 7,
    question: "Lagi mau makan di tempat atau dibawa pulang?",
    emoji: "🏠",
    image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800",
    options: { left: "Dibawa Pulang", right: "Di Tempat" }
  }
];

export default function QuestionSwipe({ onComplete, mode, currentUser, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [exitDirection, setExitDirection] = useState(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const currentQuestion = questions[currentIndex];

  const handleSwipe = (direction) => {
    const answer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: direction === 'right' ? 'yes' : 'no'
    };

    setExitDirection(direction);
    setAnswers([...answers, answer]);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setExitDirection(null);
      } else {
        onComplete([...answers, answer]);
      }
    }, 300);
  };

  const handleBackToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleBackToMenu = () => {
    if (window.confirm('Kembali ke menu utama? Progress akan hilang.')) {
      onBack();
    }
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
      handleSwipe('left');
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const modeColor = mode === 'duet' ? 'bg-[#FF7F89]' : 'bg-[#FFA654]';

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#FFF7ED] to-white p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-['Poppins'] font-semibold text-[#FFA654]">
            Pertanyaan {currentIndex + 1}/{questions.length}
          </span>
          {mode === 'duet' && (
            <span className="text-sm font-['Poppins'] text-gray-600">
              {currentUser === 'A' ? '👤 Kamu' : '💞 Pasangan'}
            </span>
          )}
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${modeColor} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card container */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Background cards for depth effect */}
        {currentIndex < questions.length - 1 && (
          <div className="absolute w-full max-w-sm h-[500px] bg-white rounded-3xl shadow-lg scale-95 opacity-50" />
        )}

        {/* Main card */}
        {!exitDirection && (
          <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute w-full max-w-sm h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          >
            {/* Image */}
            <div className="h-3/5 relative overflow-hidden">
              <img
                src={currentQuestion.image}
                alt={currentQuestion.question}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-4 right-4 text-5xl">
                {currentQuestion.emoji}
              </div>
            </div>

            {/* Question */}
            <div className="h-2/5 p-6 flex flex-col justify-center">
              <h3 className="text-2xl font-['Poppins'] font-semibold text-[#FFA654] text-center mb-4">
                {currentQuestion.question}
              </h3>
              
              {/* Swipe indicators */}
              <div className="flex justify-between items-center text-sm font-['Poppins']">
                <div className="flex items-center gap-2 text-red-500">
                  <X className="w-5 h-5" />
                  <span>{currentQuestion.options?.left || 'Tidak'}</span>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <span>{currentQuestion.options?.right || 'Ya'}</span>
                  <Check className="w-5 h-5" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Swipe buttons */}
      <div className="flex justify-center gap-8 mt-6 mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <X className="w-8 h-8 text-white" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <Check className="w-8 h-8 text-white" />
        </motion.button>
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-gray-500 font-['Poppins'] mb-4">
        Swipe kanan untuk Ya, swipe kiri untuk Tidak
      </p>

      {/* Navigation buttons */}
      <div className="flex justify-between gap-4 px-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToPrevious}
          disabled={currentIndex === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-600 py-3 rounded-full font-['Poppins'] font-semibold hover:border-[#FFA654] hover:text-[#FFA654] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToMenu}
          className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-600 py-3 rounded-full font-['Poppins'] font-semibold hover:border-[#FFA654] hover:text-[#FFA654] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Menu</span>
        </motion.button>
      </div>
    </div>
  );
}

