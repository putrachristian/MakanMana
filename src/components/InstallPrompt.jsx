import { motion, AnimatePresence } from "motion/react";
import { X, Download } from "lucide-react";
import { useState, useEffect } from "react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem(
        "pwa-install-dismissed",
      );
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      setShowPrompt(false);
    }

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler,
      );
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 pb-4 sm:pb-6"
        >
          <div className="bg-gradient-to-r from-[#FFA654] to-[#FF8C42] rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 relative max-w-2xl mx-auto">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Icon & Text Container */}
            <div className="flex items-center gap-3 flex-1 pr-6 sm:pr-8">
              {/* Icon */}
              <div className="flex-shrink-0 bg-white/20 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <div className="text-2xl sm:text-3xl">🍜</div>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="font-['Poppins'] font-semibold text-white mb-0.5 text-sm sm:text-base">
                  Install MakanMana?
                </h3>
                <p className="text-xs sm:text-sm text-white/90 font-['Poppins']">
                  Akses lebih cepat, tanpa browser! 🚀
                </p>
              </div>
            </div>

            {/* Install button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInstall}
              className="w-full sm:w-auto flex-shrink-0 bg-white text-[#FFA654] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-['Poppins'] font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              Install
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
