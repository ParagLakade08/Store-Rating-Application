import { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, StorefrontOutlined } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';

const ROLE_HOME = { ADMIN: '/admin/dashboard', USER: '/user/dashboard', STORE_OWNER: '/owner/dashboard' };

export default function LoginPage() {
  const { login }           = useAuth();
  const navigate            = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      enqueueSnackbar(`Welcome back, ${user.name}!`, { variant: 'success' });
      navigate(ROLE_HOME[user.role] || '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8">
      <Paper sx={{ p: 4, width: '100%', maxWidth: 420, borderRadius: 3 }}>
        <Box textAlign="center" mb={3}>
          <StorefrontOutlined sx={{ fontSize: 44, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5">Store Rating Platform</Typography>
          <Typography variant="body2" color="text.secondary">Sign in to your account</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth label="Email" type="email" value={form.email}
            onChange={set('email')} sx={{ mb: 2 }} required autoFocus
          />
          <TextField
            fullWidth label="Password" type={showPwd ? 'text' : 'password'}
            value={form.password} onChange={set('password')} sx={{ mb: 3 }} required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPwd((v) => !v)} edge="end" size="small">
                    {showPwd ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button fullWidth variant="contained" type="submit" size="large" disabled={loading}>
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
          </Button>
        </form>

        <Typography variant="body2" textAlign="center" mt={2}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#1976d2', fontWeight: 600 }}>Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
