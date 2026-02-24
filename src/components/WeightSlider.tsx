import { motion } from 'motion/react';

interface WeightSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function WeightSlider({ value, onChange }: WeightSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm tracking-wide" style={{ color: '#d4af37' }}>
          Weight
        </label>
        <motion.span
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-lg"
          style={{ color: '#d4af37' }}
        >
          {value}g
        </motion.span>
      </div>
      
      <div className="relative pt-2">
        <input
          type="range"
          min="5"
          max="50"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 rounded-lg appearance-none cursor-pointer luxury-slider"
          style={{
            background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${((value - 5) / 45) * 100}%, #333 ${((value - 5) / 45) * 100}%, #333 100%)`,
          }}
        />
      </div>
      
      <style>{`
        .luxury-slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #d4af37;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
          transition: all 0.3s ease;
        }
        
        .luxury-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.8);
        }
        
        .luxury-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #d4af37;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
          border: none;
          transition: all 0.3s ease;
        }
        
        .luxury-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.8);
        }
      `}</style>
    </div>
  );
}
