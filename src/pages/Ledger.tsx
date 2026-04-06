import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listOrders, type LedgerItem } from '../lib/userData';

const formatLabel = (value: string) => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function LedgerPage() {
  const { user } = useAuth();
  const [ledger, setLedger] = useState<LedgerItem[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageMessage, setPageMessage] = useState('');

  useEffect(() => {
    const loadLedger = async () => {
      if (!user) return;

      setIsPageLoading(true);
      try {
        const data = await listOrders(user.uid);
        setLedger(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not load ledger.';
        setPageMessage(message);
      } finally {
        setIsPageLoading(false);
      }
    };

    void loadLedger();
  }, [user]);

  const handleDownload = (imageUrl: string, category: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `komal-jewellery-${category}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <section className="min-h-screen py-28 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl mb-3" style={{ color: '#f5f5f5' }}>
            Ledger
          </h2>
          <p className="text-base md:text-lg" style={{ color: '#888888' }}>
            Orders and customer details
          </p>
        </motion.div>

        {isPageLoading ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: '#888888' }}>
              Loading ledger...
            </p>
          </div>
        ) : ledger.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: '#888888' }}>
              No orders yet. Book a design to see it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ledger.map((item) => (
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
                <button
                  type="button"
                  onClick={() => setActiveImage(item.imageUrl)}
                  className="w-full rounded-xl overflow-hidden mb-5"
                  style={{ boxShadow: '0 16px 40px rgba(212, 175, 55, 0.2)' }}
                >
                  <img src={item.imageUrl} alt="Order design" className="w-full h-auto" />
                </button>

                <div className="space-y-2 text-sm" style={{ color: '#c7c7c7' }}>
                  <div><span style={{ color: '#d4af37' }}>Customer:</span> {item.customerName}</div>
                  <div><span style={{ color: '#d4af37' }}>Phone:</span> {item.customerPhone}</div>
                  <div><span style={{ color: '#d4af37' }}>Address:</span> {item.customerAddress}</div>
                  <div><span style={{ color: '#d4af37' }}>Advance:</span> {item.advancePayment || 'N/A'}</div>
                  <div><span style={{ color: '#d4af37' }}>Category:</span> {formatLabel(item.category)}</div>
                  <div><span style={{ color: '#d4af37' }}>Metal:</span> {formatLabel(item.metal)}</div>
                  <div><span style={{ color: '#d4af37' }}>Style:</span> {formatLabel(item.style)}</div>
                  <div><span style={{ color: '#d4af37' }}>Weight:</span> {item.weight}g</div>
                  <div><span style={{ color: '#d4af37' }}>Details:</span> {item.details}</div>
                  {item.orderNotes ? (
                    <div><span style={{ color: '#d4af37' }}>Notes:</span> {item.orderNotes}</div>
                  ) : null}
                </div>

                <div className="mt-4 text-xs" style={{ color: '#777' }}>
                  {item.prompt}
                </div>

                <div className="mt-6">
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
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {pageMessage ? (
          <p className="text-center text-sm mt-6" style={{ color: '#d4af37' }}>
            {pageMessage}
          </p>
        ) : null}
      </div>

      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setActiveImage(null)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-4xl rounded-2xl border p-4 md:p-6"
            style={{
              backgroundColor: 'rgba(26, 26, 26, 0.95)',
              borderColor: '#d4af37',
            }}
          >
            <img src={activeImage} alt="Order preview" className="w-full h-auto rounded-xl" />
          </motion.div>
        </div>
      )}
    </section>
  );
}
