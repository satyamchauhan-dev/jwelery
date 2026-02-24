import { motion } from 'motion/react';

interface MetalSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const metals = [
  { id: 'silver', label: 'Silver' },
  { id: 'gold', label: 'Gold' },
  { id: 'platinum', label: 'Platinum' },
];

export function MetalSelector({ value, onChange }: MetalSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm tracking-wide" style={{ color: '#d4af37' }}>
        Metal Type
      </label>
      <div className="flex gap-3 sm:gap-4">
        {metals.map((metal) => {
          const isSelected = value === metal.id;
          return (
            <motion.button
              key={metal.id}
              onClick={() => onChange(metal.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-2 sm:py-3 rounded-lg border transition-all duration-300 text-sm sm:text-base"
              style={{
                backgroundColor: isSelected ? '#d4af37' : 'transparent',
                borderColor: isSelected ? '#d4af37' : '#333',
                color: isSelected ? '#0f0f0f' : '#f5f5f5',
              }}
            >
              {metal.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}