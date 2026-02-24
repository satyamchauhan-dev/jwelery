interface StyleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const styles = [
  'Calcutti',
  'Traditional',
  'Modern',
  'Minimal',
];

export function StyleSelect({ value, onChange }: StyleSelectProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm tracking-wide" style={{ color: '#d4af37' }}>
        Style
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border transition-all duration-300 appearance-none cursor-pointer"
        style={{
          backgroundColor: '#1a1a1a',
          borderColor: '#333',
          color: '#f5f5f5',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23d4af37' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
        }}
      >
        {styles.map((style) => (
          <option key={style} value={style.toLowerCase()}>
            {style}
          </option>
        ))}
      </select>
    </div>
  );
}
