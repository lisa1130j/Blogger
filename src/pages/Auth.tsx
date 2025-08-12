import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(email, password);
        // Create profile with username if provided
        if (username.trim()) {
          await supabase.from('profiles').insert({
            id: (await supabase.auth.getUser()).data.user?.id,
            username: username.trim(),
            created_at: new Date().toISOString(),
          });
        }
      } else {
        await signIn(email, password);
      }
      navigate(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="rounded-xl p-8" style={{
          background: 'linear-gradient(135deg, rgba(255, 107, 156, 0.05), rgba(108, 223, 255, 0.05))',
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 12px rgba(255, 107, 156, 0.1)',
        }}>
          <h1 className="text-3xl font-bold mb-2 text-center" style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent), var(--color-accent-2))',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradientMove 8s ease-in-out infinite',
          }}>
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className="text-center text-gray-600 mb-6">
            {mode === 'signin' 
              ? 'Welcome back! Sign in to join the discussion.'
              : 'Join our community to share your Labubu experiences!'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-8">
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Username (optional)</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  placeholder="Choose a display name"
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="form-input flex-1"
                  placeholder="Enter your password"
                  style={{ marginBottom: 0 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ display: 'flex', alignItems: 'center', height: '100%' }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-white rounded-lg font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 create-post-btn"
              style={{
                background: 'linear-gradient(90deg, #6366f1 0%, #f472b6 100%)',
                boxShadow: '0 1px 4px rgba(99,102,241,0.08)',
              }}
            >
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="text-gray-500">
              {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="px-6 py-2.5 rounded-lg text-white font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-2))',
                border: 'none',
                boxShadow: '0 2px 4px rgba(108, 223, 255, 0.2)',
              }}
            >
              {mode === 'signin' ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Auth;
