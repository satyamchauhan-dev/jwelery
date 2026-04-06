import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'register';

const getFriendlyError = (message: string) => {
  if (message.includes('auth/invalid-credential')) return 'Invalid email or password.';
  if (message.includes('auth/email-already-in-use')) return 'Email is already registered.';
  if (message.includes('auth/weak-password')) return 'Password should be at least 6 characters.';
  if (message.includes('auth/invalid-email')) return 'Please enter a valid email address.';
  return 'Something went wrong. Please try again.';
};

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { signIn, signUp, user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from || '/studio';
  }, [location.state]);

  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthLoading, navigate, redirectPath, user]);

  if (!isAuthLoading && user) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(getFriendlyError(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border p-7 md:p-8"
        style={{
          backgroundColor: 'rgba(26, 26, 26, 0.88)',
          borderColor: '#d4af37',
          boxShadow: '0 20px 60px rgba(212, 175, 55, 0.2)',
        }}
      >
        <h2 className="font-serif text-3xl mb-2" style={{ color: '#f5f5f5' }}>
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm mb-6" style={{ color: '#b2b2b2' }}>
          {mode === 'login'
            ? 'Log in to access your private studio, favorites and ledger.'
            : 'Register to unlock your private design workspace.'}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-6 rounded-lg p-1" style={{ backgroundColor: '#111' }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            className="py-2 rounded-md text-sm"
            style={{
              backgroundColor: mode === 'login' ? '#d4af37' : 'transparent',
              color: mode === 'login' ? '#0f0f0f' : '#d4af37',
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className="py-2 rounded-md text-sm"
            style={{
              backgroundColor: mode === 'register' ? '#d4af37' : 'transparent',
              color: mode === 'register' ? '#0f0f0f' : '#d4af37',
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: '#d4af37' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="w-full px-4 py-2 rounded-lg text-sm bg-[#0f0f0f] border border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37]"
              style={{ color: '#f5f5f5' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: '#d4af37' }}>
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="w-full px-4 py-2 rounded-lg text-sm bg-[#0f0f0f] border border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37]"
              style={{ color: '#f5f5f5' }}
            />
          </div>

          {errorMessage ? (
            <p className="text-sm" style={{ color: '#ff8c8c' }}>
              {errorMessage}
            </p>
          ) : null}

          <motion.button
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full py-3 rounded-lg font-semibold"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
              color: '#0f0f0f',
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
