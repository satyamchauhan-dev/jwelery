import { motion, AnimatePresence } from 'motion/react';
import { Heart, Download, ShoppingBag, Loader2 } from 'lucide-react';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  onSaveFavorite: () => void;
  onDownload: () => void;
  isFavorited: boolean;
  onBookDesign: () => void;
}

export function ImageDisplay({ imageUrl, isLoading, onSaveFavorite, onDownload, isFavorited, onBookDesign }: ImageDisplayProps) {
  return (
    <div 
      className="rounded-2xl border p-6 md:p-8 flex items-center justify-center min-h-[400px] md:min-h-[600px] relative overflow-hidden"
      style={{
        backgroundColor: '#1a1a1a',
        borderColor: '#d4af37',
      }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 
              size={48} 
              className="animate-spin" 
              style={{ color: '#d4af37' }}
            />
            <p className="text-lg tracking-wide" style={{ color: '#888888' }}>
              Forging brilliance...
            </p>
          </motion.div>
        ) : imageUrl ? (
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6 w-full"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-xl overflow-hidden"
              style={{
                boxShadow: '0 20px 60px rgba(212, 175, 55, 0.2)',
              }}
            >
              <img 
                src={imageUrl} 
                alt="Generated jewelry"
                className="w-full h-auto"
              />
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSaveFavorite}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border transition-all duration-300"
                style={{
                  backgroundColor: isFavorited ? '#d4af37' : 'transparent',
                  borderColor: '#d4af37',
                  color: isFavorited ? '#0f0f0f' : '#d4af37',
                }}
              >
                <Heart size={18} />
                <span className="text-sm">{isFavorited ? 'Saved' : 'Save'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDownload}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border transition-all duration-300"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#d4af37',
                  color: '#d4af37',
                }}
              >
                <Download size={18} />
                <span className="text-sm">Download</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBookDesign}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border transition-all duration-300"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#d4af37',
                  color: '#d4af37',
                }}
              >
                <ShoppingBag size={18} />
                <span className="text-sm">Book Design</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center px-4"
          >
            <p className="text-xl md:text-2xl font-serif mb-2" style={{ color: '#888888' }}>
              Your creation will appear here
            </p>
            <p className="text-xs md:text-sm" style={{ color: '#555' }}>
              Configure your design and craft your masterpiece
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}