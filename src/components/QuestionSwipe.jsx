import { motion, useMotionValue, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { X, Check, ArrowLeft, Home } from 'lucide-react';

const QuestionSwipe = ({ questions, onComplete, mode, currentUser, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [exitDirection, setExitDirection] = useState(null);
  const timeoutRef = useRef(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const currentQuestion = questions && questions[currentIndex];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSwipe = (direction) => {
    const answerValue = direction === 'right' ? 'yes' : 'no';
    const newAnswers = {
      ...answers,
      [currentQuestion.question]: answerValue
    };
    
    setExitDirection(direction);
    setAnswers(newAnswers);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const isLastQuestion = currentIndex >= questions.length - 1;
      if (isLastQuestion) {
        onComplete(newAnswers);
      } else {
        setCurrentIndex(currentIndex + 1);
        setExitDirection(null);
      }
      timeoutRef.current = null;
    }, 300);
  };

  const handleBackToPrevious = () => {
    if (currentIndex > 0) {
      const newAnswers = { ...answers };
      // Remove answer for current question before going back
      delete newAnswers[currentQuestion.question];
      setCurrentIndex(currentIndex - 1);
      setAnswers(newAnswers);
    }
  };

  // Safety check: if no questions or current question is missing
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
            onDragEnd={(event, info) => {
              if (info.offset.x > 100) {
                handleSwipe('right');
              } else if (info.offset.x < -100) {
                handleSwipe('left');
              }
            }}
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
          onClick={() => {
            if (window.confirm('Kembali ke menu utama? Progress akan hilang.')) {
              onBack();
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-600 py-3 rounded-full font-['Poppins'] font-semibold hover:border-[#FFA654] hover:text-[#FFA654] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Menu</span>
        </motion.button>
      </div>
    </div>
  );
};

export default QuestionSwipe;
