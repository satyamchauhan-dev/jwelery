import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const categories = [
  { id: 'ring', label: 'Ring' },
  { id: 'necklace', label: 'Necklace' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'bangles', label: 'Bangles' },
  { id: 'chain', label: 'Chain' },
];

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm tracking-wide" style={{ color: '#d4af37' }}>
        Category
      </label>
      <div className="relative">
        <motion.select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          whileHover={{ scale: 1.01 }}
          className="w-full appearance-none rounded-lg border px-4 py-3 pr-10 text-sm sm:text-base transition-all duration-300"
          style={{
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            borderColor: '#333',
            color: '#f5f5f5',
          }}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </motion.select>
        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: '#d4af37' }}
        />
      </div>
    </div>
  );
}