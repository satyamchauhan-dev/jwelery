import { motion } from 'motion/react';

interface HeroProps {
  onEnterStudio: () => void;
}

export function Hero({ onEnterStudio }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient glow - Primary */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #d4af37 0%, #f4d03f 18%, transparent 55%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Background gradient glow - Secondary */}
      <div 
        className="absolute inset-0 opacity-12"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #d4af37 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif mb-6 text-4xl md:text-5xl lg:text-7xl font-bold"
          style={{ 
            color: '#f5f5f5',
            lineHeight: '1.1',
            textShadow: '0 10px 40px rgba(212, 175, 55, 0.2)',
            letterSpacing: '0.02em',
          }}
        >
          Design Your Masterpiece
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-12"
          style={{ color: '#a8a8a8', letterSpacing: '0.01em' }}
        >
          AI-powered custom jewelry crafted to your imagination.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnterStudio}
          className="px-12 py-4 rounded-full text-lg tracking-wide transition-all duration-300 font-semibold"
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
            color: '#0f0f0f',
            boxShadow: '0 15px 50px rgba(212, 175, 55, 0.4), 0 0 30px rgba(212, 175, 55, 0.2)',
          }}
        >
          Enter Design Studio
        </motion.button>
      </div>
    </section>
  );
}