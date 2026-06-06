import { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, StorefrontOutlined } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import authService from '../../services/authService';
import { validateRegisterForm, hasErrors } from '../../utils/validators';

export default function RegisterPage() {
  const navigate            = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [form,    setForm]    = useState({ name: '', email: '', password: '', address: '' });
  const [errors,  setErrors]  = useState({});
  const [apiErr,  setApiErr]  = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateRegisterForm(form);
    if (hasErrors(errs)) { setErrors(errs); return; }
    setApiErr('');
    setLoading(true);
    try {
      await authService.register(form);
      enqueueSnackbar('Registration successful! Please log in.', { variant: 'success' });
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message;
      setApiErr(Array.isArray(msg) ? msg.map((m) => m.message).join(', ') : (msg || 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8" py={4}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 440, borderRadius: 3 }}>
        <Box textAlign="center" mb={3}>
          <StorefrontOutlined sx={{ fontSize: 44, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5">Create Account</Typography>
          <Typography variant="body2" color="text.secondary">Register as a normal user</Typography>
        </Box>

        {apiErr && <Alert severity="error" sx={{ mb: 2 }}>{apiErr}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth label="Full Name" value={form.name} onChange={set('name')} sx={{ mb: 2 }}
            error={Boolean(errors.name)} helperText={errors.name || '4–60 characters'} required autoFocus
          />
          <TextField
            fullWidth label="Email" type="email" value={form.email} onChange={set('email')} sx={{ mb: 2 }}
            error={Boolean(errors.email)} helperText={errors.email} required
          />
          <TextField
            fullWidth label="Password" type={showPwd ? 'text' : 'password'}
            value={form.password} onChange={set('password')} sx={{ mb: 1 }}
            error={Boolean(errors.password)} helperText={errors.password || '8–16 chars, 1 uppercase, 1 special (!@#$%^&*)'} required
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
          <TextField
            fullWidth label="Address (optional)" value={form.address} onChange={set('address')}
            sx={{ mt: 1, mb: 3 }} error={Boolean(errors.address)} helperText={errors.address}
          />
          <Button fullWidth variant="contained" type="submit" size="large" disabled={loading}>
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Register'}
          </Button>
        </form>

        <Typography variant="body2" textAlign="center" mt={2}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1976d2', fontWeight: 600 }}>Sign In</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
