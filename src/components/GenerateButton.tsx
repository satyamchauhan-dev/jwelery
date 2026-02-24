import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function GenerateButton({ onClick, isLoading }: GenerateButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      whileHover={{ scale: isLoading ? 1 : 1.03 }}
      whileTap={{ scale: isLoading ? 1 : 0.96 }}
      className="w-full py-3 sm:py-4 rounded-full text-base sm:text-lg tracking-widest transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
      style={{
        background: isLoading 
          ? 'linear-gradient(135deg, #444 0%, #666 100%)'
          : 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
        color: '#0f0f0f',
        boxShadow: isLoading 
          ? '0 4px 12px rgba(0, 0, 0, 0.3)'
          : '0 15px 50px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      <Sparkles size={20} />
      {isLoading ? 'Forging Brilliance...' : 'Craft Your Masterpiece'}
    </motion.button>
  );
}