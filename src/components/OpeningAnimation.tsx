import { useEffect } from "react";
import { motion } from "motion/react";

interface OpeningAnimationProps {
  onComplete: () => void;
}

export default function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-gray-900 px-4 overflow-hidden select-none">
      <div className="text-center flex flex-col items-center max-w-md">
        {/* Logo Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 flex justify-center"
        >
          <img
            src="/logo.jpg"
            alt="pret Studio London Logo"
            className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-full shadow-xs border border-gray-100"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-serif text-2xl md:text-3xl font-light tracking-[0.35em] text-gray-900 uppercase"
        >
          pret Studio London
        </motion.h1>

        {/* Developer Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 pt-5 border-t border-gray-100 w-48 text-center"
        >
          <p className="text-[10px] md:text-xs tracking-widest text-gray-500 font-sans">
            Developer: Website Developed by Saleh Rizwan
          </p>
        </motion.div>

        {/* Loading Spinner Indicator */}
        <div className="mt-8">
          <div className="w-5 h-5 border-2 border-[#C5A880]/30 border-t-[#C5A880] rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

