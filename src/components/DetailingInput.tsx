interface DetailingInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DetailingInput({ value, onChange }: DetailingInputProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm tracking-wide" style={{ color: '#d4af37' }}>
        Design Details
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your vision..."
        rows={4}
        className="w-full px-4 py-3 rounded-lg border resize-none transition-all duration-300 focus:outline-none focus:ring-1"
        style={{
          backgroundColor: '#1a1a1a',
          borderColor: '#333',
          color: '#f5f5f5',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#d4af37';
          e.target.style.ringColor = '#d4af37';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#333';
        }}
      />
    </div>
  );
}
