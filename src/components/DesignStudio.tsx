import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { MetalSelector } from './MetalSelector';
import { CategorySelector } from './CategorySelector';
import { WeightSlider } from './WeightSlider';
import { StyleSelect } from './StyleSelect';
import { DetailingInput } from './DetailingInput';
import { GenerateButton } from './GenerateButton';
import { ImageDisplay } from './ImageDisplay';
import { useAuth } from '../context/AuthContext';
import {
  addFavorite,
  addOrder,
  favoriteExistsByHash,
  saveGeneratedImageMetadata,
  uploadGeneratedImageForUser,
} from '../lib/userData';

export function DesignStudio() {
  const { user } = useAuth();
  const [metal, setMetal] = useState('gold');
  const [category, setCategory] = useState('ring');
  const [weight, setWeight] = useState(10);
  const [style, setStyle] = useState('calcutti');
  const [details, setDetails] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState('');
  const [imageHash, setImageHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [apiUrl, setApiUrl] = useState('https://19e4-34-127-3-70.ngrok-free.app');
  const [lastPrompt, setLastPrompt] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [studioMessage, setStudioMessage] = useState('');
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [advancePayment, setAdvancePayment] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const friendlySaveError = (error: unknown) =>
    error instanceof Error ? error.message : 'Could not save locally.';

  const handleGenerate = async () => {
    if (!user) return;

    setIsLoading(true);
    setStudioMessage('');
    setImageUrl(null);
    setImagePath('');
    setImageHash('');
    setIsFavorited(false);

    try {
      if (!apiUrl.trim()) {
        throw new Error('Please enter a valid API URL');
      }

      // Build prompt from design parameters
      const prompt = `A stunning piece of jewelry: Ultra realistic ${metal === 'gold' ? 'Gold' : metal === 'silver' ? 'Silver' : 'Platinum'} ${category}, ${style} style, ${weight}g, ${details || 'elegant engraved design'}, macro jewelry photography, luxury product shot, 8k, studio lighting`;
      setLastPrompt(prompt);
      
      console.log('Sending prompt:', prompt);
      console.log('API URL:', apiUrl);
      
      // Call the AI image generation API
      const response = await fetch(`${apiUrl.replace(/\/$/, '')}/generate_image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to generate image: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data received');
      
      if (data.image_base64) {
        const imageDataUrl = String(data.image_base64).startsWith('data:image')
          ? String(data.image_base64)
          : `data:image/png;base64,${data.image_base64}`;

        // Show generated image immediately.
        setImageUrl(imageDataUrl);
        setStudioMessage('Design generated. Saving locally...');

        try {
          const uploaded = await uploadGeneratedImageForUser(user.uid, imageDataUrl);
          setImageUrl(uploaded.imageUrl);
          setImagePath(uploaded.imagePath);
          setImageHash(uploaded.imageHash);

          await saveGeneratedImageMetadata(user.uid, {
            imageUrl: uploaded.imageUrl,
            imagePath: uploaded.imagePath,
            imageHash: uploaded.imageHash,
            prompt,
            metal,
            category,
            style,
            weight,
            details: details || 'elegant engraved design',
          });

          const alreadyFavorite = await favoriteExistsByHash(user.uid, uploaded.imageHash);
          setIsFavorited(alreadyFavorite);
          setStudioMessage('Design generated and saved locally.');
        } catch (saveError) {
          setImagePath('');
          setImageHash('');
          setIsFavorited(false);
          setStudioMessage(
            `Design generated, but local save failed: ${friendlySaveError(saveError)} You can still download this image.`,
          );
        }
      } else {
        console.error('No image_base64 in response:', data);
        throw new Error('No image received from the generation API.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Image generation error:', error);
      console.error('Error details:', message);
      setImageUrl(null);
      setStudioMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFavorite = async () => {
    if (!user || !imageUrl || isSavingFavorite) return;
    if (!imagePath || !imageHash) {
      setStudioMessage('This image is not saved locally yet, so it cannot be added to favorites.');
      return;
    }

    setIsSavingFavorite(true);
    setStudioMessage('');

    try {
      const exists = await favoriteExistsByHash(user.uid, imageHash);
      if (exists) {
        setIsFavorited(true);
        setStudioMessage('This design is already in your favorites.');
        return;
      }

      await addFavorite(user.uid, {
        imageUrl,
        imagePath,
        imageHash,
        prompt: lastPrompt,
        metal,
        category,
        style,
        weight,
        details: details || 'elegant engraved design',
      });

      setIsFavorited(true);
      setStudioMessage('Saved to your favorites.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save favorite.';
      setStudioMessage(message);
    } finally {
      setIsSavingFavorite(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `komal-jewellery-${category}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleBookDesign = () => {
    if (!imageUrl) return;
    if (!imagePath || !imageHash) {
      setStudioMessage('Local save is required before booking. Please generate again.');
      return;
    }
    setIsOrderOpen(true);
  };

  const handleSubmitOrder = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !imageUrl || !imagePath || !imageHash) return;
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      return;
    }

    setIsSubmittingOrder(true);
    setStudioMessage('');

    try {
      await addOrder(user.uid, {
        imageUrl,
        imagePath,
        imageHash,
        prompt: lastPrompt,
        metal,
        category,
        style,
        weight,
        details: details || 'elegant engraved design',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        advancePayment: advancePayment.trim(),
        orderNotes: orderNotes.trim(),
      });

      setIsOrderOpen(false);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setAdvancePayment('');
      setOrderNotes('');
      setStudioMessage('Order added to your ledger.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not place order.';
      setStudioMessage(message);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <section className="min-h-screen py-24 px-6" id="studio">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl mb-4" style={{ color: '#f5f5f5' }}>
            Design Studio
          </h2>
          <p className="text-base md:text-lg" style={{ color: '#888888' }}>
            Create bespoke jewelry with the power of AI
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left: Customization Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border-2 p-6 md:p-8 space-y-6 md:space-y-8 backdrop-blur-lg"
            style={{
              backgroundColor: 'rgba(26, 26, 26, 0.8)',
              borderColor: '#d4af37',
              boxShadow: '0 20px 60px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(212, 175, 55, 0.1)',
            }}
          >
            {/* API URL Input */}
            <div className="space-y-2 pb-4 border-b border-[#d4af37]/30">
              <label className="block text-sm tracking-wide" style={{ color: '#d4af37' }}>
                API URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="Paste ngrok URL here..."
                className="w-full px-4 py-2 rounded-lg text-sm bg-[#0f0f0f] border border-[#d4af37]/50 focus:outline-none focus:border-[#d4af37] transition-colors"
                style={{ color: '#f5f5f5' }}
              />
              <p className="text-xs" style={{ color: '#888888' }}>
                Paste your ngrok URL (e.g., https://xxx-xxx-xxx.ngrok-free.app)
              </p>
            </div>
            
            <MetalSelector value={metal} onChange={setMetal} />
            <CategorySelector value={category} onChange={setCategory} />
            <WeightSlider value={weight} onChange={setWeight} />
            <StyleSelect value={style} onChange={setStyle} />
            <DetailingInput value={details} onChange={setDetails} />
            <GenerateButton onClick={handleGenerate} isLoading={isLoading} />
          </motion.div>

          {/* Right: Image Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ImageDisplay
              imageUrl={imageUrl}
              isLoading={isLoading}
              onSaveFavorite={handleSaveFavorite}
              onDownload={handleDownload}
              isFavorited={isFavorited || isSavingFavorite}
              onBookDesign={handleBookDesign}
            />
          </motion.div>
        </div>

        {studioMessage ? (
          <p className="mt-6 text-sm text-center" style={{ color: '#d4af37' }}>
            {studioMessage}
          </p>
        ) : null}

        {isOrderOpen && (
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
                    disabled={isSubmittingOrder}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm tracking-wide"
                    style={{
                      backgroundColor: '#d4af37',
                      color: '#0f0f0f',
                      opacity: isSubmittingOrder ? 0.7 : 1,
                    }}
                  >
                    {isSubmittingOrder ? 'Saving...' : 'Confirm Order'}
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
      </div>
    </section>
  );
}