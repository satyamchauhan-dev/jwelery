export function Footer() {
  return (
    <footer className="border-t py-12" style={{ borderColor: '#d4af37', opacity: 0.7 }}>
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6">
          <div className="text-xl md:text-2xl tracking-widest font-serif mb-2" style={{ color: '#d4af37' }}>
            Komal Jewellery
          </div>
          <p className="text-xs md:text-sm" style={{ color: '#d9d9d9' }}>
            Where artistry meets artificial intelligence
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-6 text-xs sm:text-sm">
          {['Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
            <a 
              key={item}
              href="#" 
              className="hover:opacity-70 transition-opacity"
              style={{ color: '#d9d9d9' }}
            >
              {item}
            </a>
          ))}
        </div>
        
        <p className="text-xs" style={{ color: '#c2c2c2' }}>
          © 2026 Komal Jewellery. All rights reserved.
        </p>
      </div>
    </footer>
  );
}