import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Container, Form, Card, Button, InputGroup } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';

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
    <Container className="py-5">
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="w-100" style={{ maxWidth: '450px' }}>
          <Card.Body className="p-4">
            <h1 className="text-center mb-2 gradient-text">
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </h1>
            <p className="text-center text-muted mb-4">
              {mode === 'signin' 
                ? 'Welcome back! Sign in to join the discussion.'
                : 'Join our community to share your Labubu experiences!'}
            </p>
            
            <Form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <Form.Group className="mb-3">
                  <Form.Label>Username (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a display name"
                  />
                </Form.Group>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Enter your password"
                  />
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </InputGroup>
              </Form.Group>
              
              {error && (
                <div className="text-danger mb-3 small">{error}</div>
              )}
              
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-100 mb-3"
              >
                {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-muted mb-2">
                  {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Button
                  variant="outline-primary"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                >
                  {mode === 'signin' ? "Sign up" : "Sign in"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Auth;
