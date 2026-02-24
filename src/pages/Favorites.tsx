import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Download, ShoppingBag, Trash2 } from 'lucide-react';

type FavoriteItem = {
  id: string;
  imageUrl: string;
  prompt: string;
  metal: string;
  category: string;
  style: string;
  weight: number;
  details: string;
  createdAt: string;
};

const favoritesKey = 'komal-jewellery-favorites';
const ledgerKey = 'komal-jewellery-ledger';

const readFavorites = (): FavoriteItem[] => {
  try {
    const raw = localStorage.getItem(favoritesKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeFavorites = (items: FavoriteItem[]) => {
  localStorage.setItem(favoritesKey, JSON.stringify(items));
};

const readLedger = (): Array<Record<string, unknown>> => {
  try {
    const raw = localStorage.getItem(ledgerKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLedger = (items: Array<Record<string, unknown>>) => {
  localStorage.setItem(ledgerKey, JSON.stringify(items));
};

const formatLabel = (value: string) => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState<FavoriteItem | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [advancePayment, setAdvancePayment] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  const handleRemove = (id: string) => {
    const next = favorites.filter((item) => item.id !== id);
    setFavorites(next);
    writeFavorites(next);
  };

  const handleDownload = (imageUrl: string, category: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `komal-jewellery-${category}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleBuyNow = (item: FavoriteItem) => {
    setSelectedFavorite(item);
    setIsOrderOpen(true);
  };

  const handleSubmitOrder = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFavorite) return;
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) return;

    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const orders = readLedger();
    const next = [
      {
        id,
        imageUrl: selectedFavorite.imageUrl,
        prompt: selectedFavorite.prompt,
        metal: selectedFavorite.metal,
        category: selectedFavorite.category,
        style: selectedFavorite.style,
        weight: selectedFavorite.weight,
        details: selectedFavorite.details,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        advancePayment: advancePayment.trim(),
        orderNotes: orderNotes.trim(),
        createdAt: new Date().toISOString(),
      },
      ...orders,
    ];

    writeLedger(next);
    setIsOrderOpen(false);
    setSelectedFavorite(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setAdvancePayment('');
    setOrderNotes('');
  };

  return (
    <section className="min-h-screen py-28 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-3xl md:text-4xl mb-3" style={{ color: '#f5f5f5' }}>
            Favorites
          </h2>
          <p className="text-base md:text-lg" style={{ color: '#888888' }}>
            Your saved designs and their details
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: '#888888' }}>
              No favorites yet. Save a design to see it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {favorites.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border p-6 md:p-7"
                style={{
                  backgroundColor: 'rgba(26, 26, 26, 0.8)',
                  borderColor: '#d4af37',
                  boxShadow: '0 20px 60px rgba(212, 175, 55, 0.12)',
                }}
              >
                <div className="rounded-xl overflow-hidden mb-5" style={{ boxShadow: '0 16px 40px rgba(212, 175, 55, 0.2)' }}>
                  <img src={item.imageUrl} alt="Favorite jewelry" className="w-full h-auto" />
                </div>

                <div className="space-y-2 text-sm" style={{ color: '#c7c7c7' }}>
                  <div><span style={{ color: '#d4af37' }}>Category:</span> {formatLabel(item.category)}</div>
                  <div><span style={{ color: '#d4af37' }}>Metal:</span> {formatLabel(item.metal)}</div>
                  <div><span style={{ color: '#d4af37' }}>Style:</span> {formatLabel(item.style)}</div>
                  <div><span style={{ color: '#d4af37' }}>Weight:</span> {item.weight}g</div>
                  <div><span style={{ color: '#d4af37' }}>Details:</span> {item.details}</div>
                </div>

                <div className="mt-4 text-xs" style={{ color: '#777' }}>
                  {item.prompt}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBuyNow(item)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border transition-all duration-300"
                    style={{
                      backgroundColor: '#d4af37',
                      borderColor: '#d4af37',
                      color: '#0f0f0f',
                    }}
                  >
                    <ShoppingBag size={16} />
                    <span>Buy Now</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(item.imageUrl, item.category)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border transition-all duration-300"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: '#d4af37',
                      color: '#d4af37',
                    }}
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemove(item.id)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border transition-all duration-300"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: '#444',
                      color: '#bbb',
                    }}
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {isOrderOpen && selectedFavorite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            onClick={() => setIsOrderOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-xl rounded-2xl border p-6 md:p-8"
            style={{
              backgroundColor: 'rgba(26, 26, 26, 0.95)',
              borderColor: '#d4af37',
              boxShadow: '0 20px 60px rgba(212, 175, 55, 0.2)',
            }}
          >
            <h3 className="font-serif text-2xl mb-4" style={{ color: '#f5f5f5' }}>
              Book Design
            </h3>
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: '#d4af37' }}>Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-sm bg-[#0f0f0f] border border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37]"
                  style={{ color: '#f5f5f5' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: '#d4af37' }}>Phone Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-sm bg-[#0f0f0f] border border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37]"
                  style={{ color: '#f5f5f5' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: '#d4af37' }}>Address</label>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-sm bg-[#0f0f0f] border border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37]"
                  style={{ color: '#f5f5f5' }}
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: '#d4af37' }}>Advance Payment</label>
                <input
                  type="text"
                  value={advancePayment}
                  onChange={(e) => setAdvancePayment(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-sm bg-[#0f0f0f] border border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37]"
                  style={{ color: '#f5f5f5' }}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: '#d4af37' }}>Notes</label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-sm bg-[#0f0f0f] border border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37]"
                  style={{ color: '#f5f5f5' }}
                  rows={2}
                  placeholder="Optional"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm tracking-wide"
                  style={{
                    backgroundColor: '#d4af37',
                    color: '#0f0f0f',
                  }}
                >
                  Confirm Order
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setIsOrderOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm tracking-wide border"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: '#d4af37',
                    color: '#d4af37',
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
