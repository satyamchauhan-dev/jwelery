import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Studio', href: '/#studio' },
    { label: 'Favorites', to: '/favorites' },
    { label: 'Ledger', to: '/ledger' },
    { label: 'About', href: '#' },
  ];
  
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b"
      style={{ 
        backgroundColor: 'rgba(15, 15, 15, 0.7)',
        borderColor: 'rgba(212, 175, 55, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}
    >
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <motion.div 
          className="text-3xl tracking-widest font-serif font-bold"
          style={{ 
            color: '#d4af37',
            textShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
            letterSpacing: '0.15em'
          }}
          whileHover={{ scale: 1.02 }}
        >
          Komal Jewellery
        </motion.div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <motion.div key={item.label} whileHover={{ scale: 1.05 }} className="relative group">
              {item.to ? (
                <Link
                  to={item.to}
                  className="text-sm tracking-widest"
                  style={{ color: '#f5f5f5' }}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href}
                  className="text-sm tracking-widest"
                  style={{ color: '#f5f5f5' }}
                >
                  {item.label}
                </a>
              )}
              <span 
                className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" 
                style={{ backgroundColor: '#d4af37' }} 
              />
            </motion.div>
          ))}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg transition-all"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ 
            color: '#d4af37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)'
          }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t py-4"
          style={{ 
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            borderColor: 'rgba(212, 175, 55, 0.2)',
          }}
        >
          {navItems.map((item) => (
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className="block px-6 py-3 text-sm tracking-widest border-l-2 transition-all"
                style={{ 
                  color: '#f5f5f5',
                  borderColor: 'transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d4af37'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="block px-6 py-3 text-sm tracking-widest border-l-2 transition-all"
                style={{ 
                  color: '#f5f5f5',
                  borderColor: 'transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d4af37'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            )
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}