import { motion } from 'motion/react';
import { useState } from 'react';
import { MapPin, Building2, Loader } from 'lucide-react';

export default function LocationSelect({ onSelect }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityInput, setShowCityInput] = useState(false);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);

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
    setIsLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSelect({ type: 'gps', latitude, longitude });
        setIsLoadingGPS(false);
      },
      (error) => {
        console.error('Error getting GPS location:', error);
        setIsLoadingGPS(false);
      }
    );
  };

  const modeColor = 'from-[#FF7F89] to-[#FFB6C1]';

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#FFF7ED] to-white overflow-y-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-5xl mb-4">📍</div>
        <h2 className="text-3xl font-['Poppins'] font-semibold text-[#FFA654] mb-3">
          Kamu ingin cari makan di mana?
        </h2>
        <p className="text-gray-600 font-['Poppins']">
          Pilih lokasi untuk rekomendasi terbaik
        </p>
      </motion.div>

      {/* Location options */}
      <div className="w-full space-y-6 mb-8">
        {/* Current Location */}
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCurrentLocation}
          className={`w-full bg-gradient-to-br ${modeColor} p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all text-left relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 text-white/10 transform translate-x-4 -translate-y-4">
            <MapPin className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-['Poppins'] font-semibold text-white mb-1">
                📍 Gunakan Lokasi Sekarang
              </h3>
              <p className="text-white/90 font-['Poppins'] text-sm">
                Rekomendasi dalam radius 5 km dari posisimu
              </p>
            </div>
          </div>
        </motion.button>

        {/* Manual City Selection */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full bg-white p-6 rounded-3xl shadow-lg border-2 border-[#FFA654]/20"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#FFA654]/10 p-4 rounded-2xl">
              <Building2 className="w-8 h-8 text-[#FFA654]" />
            </div>
            <div>
              <h3 className="text-xl font-['Poppins'] font-semibold text-[#FFA654] mb-1">
                🏙️ Pilih Kota Manual
              </h3>
              <p className="text-gray-600 font-['Poppins'] text-sm">
                Cari rekomendasi di kota tertentu
              </p>
            </div>
          </div>

          {!showCityInput ? (
            <button
              onClick={() => setShowCityInput(true)}
              className="w-full bg-[#FFA654] text-white py-3.5 rounded-full font-['Poppins'] font-semibold hover:bg-[#FF8C42] transition-colors flex items-center justify-center mt-4"
            >
              Pilih Kota
            </button>
          ) : (
            <div className="space-y-3 mt-4">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-[#FFA654]/30 focus:border-[#FFA654] focus:outline-none font-['Poppins'] text-center"
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
                className="w-full bg-[#FFA654] text-white py-3.5 rounded-full font-['Poppins'] font-semibold hover:bg-[#FF8C42] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Lanjutkan
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-sm text-gray-500 font-['Poppins']">
          🔒 Lokasi kamu aman dan tidak disimpan
        </p>
      </motion.div>
    </div>
  );
}

