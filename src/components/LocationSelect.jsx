import { motion } from 'motion/react';
import { useState } from 'react';
import { MapPin, Building2, Loader, AlertCircle } from 'lucide-react';

export default function LocationSelect({ onSelect }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityInput, setShowCityInput] = useState(false);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [error, setError] = useState('');

  const cities = [
    'Jakarta',
    'Bandung',
    'Surabaya',
    'Yogyakarta',
    'Semarang',
    'Malang',
    'Medan',
    'Bali'
  ];

  const handleCurrentLocation = () => {
    onSelect({ type: 'current', radius: '5 km' });
  };

  const handleCitySelect = () => {
    if (selectedCity) {
      onSelect({ type: 'city', city: selectedCity });
    }
  };

  const handleGPSLocation = () => {
    setError('');
    setIsLoadingGPS(true);
    
    if (!navigator.geolocation) {
      setError('GPS tidak tersedia di browser kamu 😢');
      setIsLoadingGPS(false);
      setShowCityInput(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSelect({ type: 'gps', latitude, longitude });
        setIsLoadingGPS(false);
      },
      (err) => {
        console.error('Error getting GPS location:', err);
        setIsLoadingGPS(false);
        
        // Show user-friendly error message based on error code
        let errorMessage = '';
        
        if (err?.code === 1) {
          // PERMISSION_DENIED
          errorMessage = 'Akses lokasi ditolak. Silakan izinkan akses lokasi di browser kamu atau pilih kota manual 📍';
        } else if (err?.code === 2) {
          // POSITION_UNAVAILABLE
          errorMessage = 'Lokasi tidak tersedia. Silakan coba lagi atau pilih kota manual 🗺️';
        } else if (err?.code === 3) {
          // TIMEOUT
          errorMessage = 'Waktu habis mencari lokasi. Silakan coba lagi atau pilih kota manual ⏱️';
        } else {
          // Unknown error or empty error object
          errorMessage = 'Tidak bisa mendapatkan lokasi. Silakan pilih kota manual atau aktifkan GPS/lokasi di perangkat kamu 🏙️';
        }
        
        setError(errorMessage);
        
        // Auto show city input after error
        setTimeout(() => {
          setShowCityInput(true);
        }, 1500);
      },
      {
        enableHighAccuracy: false, // Changed to false for better compatibility
        timeout: 10000,
        maximumAge: 300000 // Cache position for 5 minutes
      }
    );
  };

  const modeColor = 'from-[#FF7F89] to-[#FFB6C1]';

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-b from-[#FFF7ED] to-white overflow-y-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8 md:mb-12 px-2"
      >
        <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📍</div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-['Poppins'] font-semibold text-[#FFA654] mb-2 sm:mb-3">
          Di mana kamu sekarang?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 font-['Poppins']">
          Kami akan carikan tempat makan terdekat
        </p>
      </motion.div>

      {/* Location options */}
      <div className="w-full max-w-md space-y-4">
        {/* GPS Location */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGPSLocation}
          disabled={isLoadingGPS}
          className="w-full bg-gradient-to-br from-[#FFA654] to-[#FF8C42] text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoadingGPS ? (
            <>
              <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              <span className="font-['Poppins'] font-semibold text-base sm:text-lg">Mencari lokasi...</span>
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              <div className="text-left">
                <div className="font-['Poppins'] font-semibold text-base sm:text-lg">Lokasi Saat Ini</div>
                <div className="text-xs sm:text-sm text-white/80 font-['Poppins']">Gunakan GPS (radius 5km)</div>
              </div>
            </>
          )}
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-xs sm:text-sm text-gray-500 font-['Poppins']">atau</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Manual City Selection */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          {!showCityInput ? (
            <button
              onClick={() => setShowCityInput(true)}
              className="w-full bg-[#FFA654] text-white py-3 sm:py-3.5 rounded-full font-['Poppins'] font-semibold hover:bg-[#FF8C42] transition-colors flex items-center justify-center text-sm sm:text-base mt-4"
            >
              Pilih Kota
            </button>
          ) : (
            <div className="space-y-3 mt-4">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border-2 border-[#FFA654]/30 focus:border-[#FFA654] focus:outline-none font-['Poppins'] text-center text-sm sm:text-base"
              >
                <option value="">Pilih kota...</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <button
                onClick={handleCitySelect}
                disabled={!selectedCity}
                className="w-full bg-[#FFA654] text-white py-3 sm:py-3.5 rounded-full font-['Poppins'] font-semibold hover:bg-[#FF8C42] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
              >
                Lanjutkan
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Info text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 font-['Poppins'] text-center px-4"
      >
        Lokasi kamu aman dan hanya dipakai untuk rekomendasi
      </motion.p>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-4 w-full max-w-md"
        >
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-600 font-['Poppins'] flex-1">
              {error}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
