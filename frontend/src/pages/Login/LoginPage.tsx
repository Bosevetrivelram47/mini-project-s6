import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginThunk, clearError } from '@/features/auth/authSlice';
import type { AppDispatch, RootState } from '@/app/store';
import { TextField, Button, Alert, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Shield } from '@mui/icons-material';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@system.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a1035 50%, #0f172a 100%)' }}
    >
      {/* Animated background orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 600, height: 600, top: '-200px', left: '-200px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400, height: 400, bottom: '-100px', right: '-100px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
          animation: 'pulse 5s ease-in-out infinite 1s',
        }}
      />

      <div className="w-full max-w-md mx-4 relative z-10">
        {/* Card */}
        <div
          className="p-8 rounded-2xl"
          style={{
            background: 'rgba(30, 41, 59, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.2)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center rounded-2xl mb-4"
              style={{
                width: 64, height: 64,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 0 30px rgba(99,102,241,0.5)',
              }}
            >
              <Shield style={{ color: 'white', fontSize: 32 }} />
            </div>
            <h1 className="text-2xl font-bold gradient-text mb-1">Smart Tracker</h1>
            <p className="text-sm" style={{ color: '#64748b' }}>User Behavior Tracking System</p>
          </div>

          {/* Sign in title */}
          <div className="mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>Welcome back</h2>
            <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Sign in to your account to continue</p>
          </div>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              id="login-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              required
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email fontSize="small" sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                },
              }}
            />
            <TextField
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              required
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock fontSize="small" sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                },
              }}
            />

            <Button
              id="login-submit"
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              size="large"
              sx={{
                mt: 1, py: 1.5,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #4338ca)' },
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#6366f1' }}>🔑 Demo Credentials</p>
            <div className="space-y-1 text-xs" style={{ color: '#94a3b8' }}>
              <div>Admin: <span style={{ color: '#a5b4fc' }}>admin@system.com / Admin@123</span></div>
              <div>Manager: <span style={{ color: '#a5b4fc' }}>manager@system.com / Manager@123</span></div>
              <div>Employee: <span style={{ color: '#a5b4fc' }}>employee1@system.com / Employee@123</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
