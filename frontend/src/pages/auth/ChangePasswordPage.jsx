import { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import authService from '../../services/authService';
import { validatePassword } from '../../utils/validators';

export default function ChangePasswordPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [form,    setForm]    = useState({ currentPassword: '', newPassword: '' });
  const [errors,  setErrors]  = useState({});
  const [apiErr,  setApiErr]  = useState('');
  const [loading, setLoading] = useState(false);
  const [show,    setShow]    = useState({ cur: false, new: false });

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: '' })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = { newPassword: validatePassword(form.newPassword) };
    if (!form.currentPassword) errs.currentPassword = 'Current password is required';
    if (Object.values(errs).some(Boolean)) { setErrors(errs); return; }
    setApiErr('');
    setLoading(true);
    try {
      await authService.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      enqueueSnackbar('Password changed successfully', { variant: 'success' });
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setApiErr(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (k) => setShow((s) => ({ ...s, [k]: !s[k] }));

  return (
    <DashboardLayout title="Change Password">
      <PageHeader title="Change Password" subtitle="Update your account password" />
      <Box display="flex" justifyContent="center">
        <Paper sx={{ p: 4, width: '100%', maxWidth: 440, borderRadius: 3 }}>
          {apiErr && <Alert severity="error" sx={{ mb: 2 }}>{apiErr}</Alert>}
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth label="Current Password" type={show.cur ? 'text' : 'password'}
              value={form.currentPassword} onChange={set('currentPassword')} sx={{ mb: 2 }}
              error={Boolean(errors.currentPassword)} helperText={errors.currentPassword} required
              InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => toggle('cur')} edge="end" size="small">{show.cur ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }}
            />
            <TextField
              fullWidth label="New Password" type={show.new ? 'text' : 'password'}
              value={form.newPassword} onChange={set('newPassword')} sx={{ mb: 1 }}
              error={Boolean(errors.newPassword)}
              helperText={errors.newPassword || '8–16 chars, 1 uppercase, 1 special (!@#$%^&*)'} required
              InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => toggle('new')} edge="end" size="small">{show.new ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }}
            />
            <Button fullWidth variant="contained" type="submit" size="large" sx={{ mt: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Update Password'}
            </Button>
          </form>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
