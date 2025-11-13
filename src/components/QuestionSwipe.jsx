import { motion, useMotionValue, useTransform } from 'motion/react';
import { useState } from 'react';
import { X, Check, ArrowLeft, Home } from 'lucide-react';

export default function QuestionSwipe({ questions, onComplete, mode, currentUser, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [exitDirection, setExitDirection] = useState(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const currentQuestion = questions && questions[currentIndex];

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
        // Convert to object format for compatibility
        const answersObj = {};
        [...answers, answer].forEach(a => {
          answersObj[a.question] = a.answer;
        });
        onComplete(answersObj);
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

  if (!questions || questions.length === 0 || !currentQuestion) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#FFA654] to-[#FF7F50]">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-['Poppins'] font-semibold mb-2">
            Tidak ada pertanyaan
          </h2>
          <p className="text-lg opacity-90 mb-4">
            Terjadi kesalahan saat memuat pertanyaan
          </p>
          <button
            onClick={onBack}
            className="bg-white text-[#FFA654] px-6 py-3 rounded-full font-['Poppins'] font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const modeColor = mode === 'duet' ? 'bg-[#FF7F89]' : 'bg-[#FFA654]';

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#FFF7ED] to-white p-3 sm:p-4">
      {/* Progress bar - outside card */}
      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between items-center mb-2.5 sm:mb-3">
          <span className="text-base sm:text-lg font-['Poppins'] font-bold text-[#FFA654]">
            Pertanyaan {currentIndex + 1}/{questions.length}
          </span>
          {mode === 'duet' && (
            <span className="text-sm sm:text-base font-['Poppins'] font-semibold text-gray-600">
              {currentUser === 'A' ? '👤 Kamu' : '💞 Pasangan'}
            </span>
          )}
        </div>
        <div className="w-full h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${modeColor} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card container - fills available space */}
      <div className="flex-1 relative flex items-center justify-center min-h-0 mb-4 sm:mb-5">
        {/* Background cards for depth effect */}
        {currentIndex < questions.length - 1 && (
          <div className="absolute inset-0 max-w-md mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-lg scale-95 opacity-50" />
        )}

        {/* Main card */}
        {!exitDirection && (
          <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 max-w-md mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing flex flex-col"
          >
            {/* Image - takes 70% */}
            <div className="flex-[7] relative overflow-hidden min-h-0">
              <img
                src={currentQuestion.image}
                alt={currentQuestion.question}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 text-4xl sm:text-5xl">
                {currentQuestion.emoji}
              </div>
              
              {/* Swipe hint overlay */}
              <div className="absolute bottom-0 left-0 right-0 pb-3 px-4 text-center">
                <p className="text-white/80 text-xs sm:text-sm font-['Poppins'] font-medium drop-shadow-lg">
                  ← Swipe atau tap tombol →
                </p>
              </div>
            </div>

            {/* Question & Buttons - takes 30% */}
            <div className="flex-[3] flex flex-col justify-center p-4 sm:p-5 min-h-0">
              {/* Question */}
              <div className="mb-4 sm:mb-5">
                <h3 className="text-lg sm:text-xl md:text-2xl font-['Poppins'] font-semibold text-[#FFA654] text-center px-2 leading-tight">
                  {currentQuestion.question}
                </h3>
              </div>
              
              {/* YES/NO buttons at bottom of card */}
              <div className="flex justify-center gap-6 sm:gap-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSwipe('left')}
                  className="flex flex-col items-center justify-center gap-1.5 group"
                >
                  <div className="w-16 h-16 sm:w-18 sm:h-18 bg-red-50 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all border-2 border-red-300 group-hover:bg-red-100">
                    <X className="w-8 h-8 sm:w-9 sm:h-9 text-red-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm sm:text-base font-['Poppins'] font-semibold text-red-500">
                    {currentQuestion.options?.left || 'Tidak'}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSwipe('right')}
                  className="flex flex-col items-center justify-center gap-1.5 group"
                >
                  <div className="w-16 h-16 sm:w-18 sm:h-18 bg-green-50 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all border-2 border-green-300 group-hover:bg-green-100">
                    <Check className="w-8 h-8 sm:w-9 sm:h-9 text-green-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm sm:text-base font-['Poppins'] font-semibold text-green-500">
                    {currentQuestion.options?.right || 'Ya'}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation buttons - larger and at bottom */}
      <div className="flex justify-between gap-4 px-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToPrevious}
          disabled={currentIndex === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-600 py-3.5 sm:py-4 rounded-full font-['Poppins'] font-semibold hover:border-[#FFA654] hover:text-[#FFA654] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base sm:text-lg shadow-md"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Kembali</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToMenu}
          className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-600 py-3.5 sm:py-4 rounded-full font-['Poppins'] font-semibold hover:border-[#FFA654] hover:text-[#FFA654] transition-colors text-base sm:text-lg shadow-md"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Menu</span>
        </motion.button>
      </div>
    </div>
  );
}
