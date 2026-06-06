import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert, CircularProgress,
  InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import adminService from '../../services/adminService';

const INIT = { name: '', email: '', password: '', address: '', role: 'USER' };

export default function AddUserDialog({ open, onClose, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  const [form,    setForm]    = useState(INIT);
  const [errors,  setErrors]  = useState({});
  const [apiErr,  setApiErr]  = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: '' })); };

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 4) errs.name = 'Name must be 4–60 characters';
    if (form.name.trim().length > 60)               errs.name = 'Name must be 4–60 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password || form.password.length < 8 || form.password.length > 16) errs.password = 'Password: 8–16 chars';
    if (!/[A-Z]/.test(form.password))   errs.password = 'Need at least one uppercase letter';
    if (!/[!@#$%^&*]/.test(form.password)) errs.password = 'Need at least one special character';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.values(errs).some(Boolean)) { setErrors(errs); return; }
    setApiErr(''); setLoading(true);
    try {
      await adminService.addUser(form);
      enqueueSnackbar('User created successfully', { variant: 'success' });
      setForm(INIT); onSuccess(); onClose();
    } catch (e) {
      const msg = e.response?.data?.message;
      setApiErr(Array.isArray(msg) ? msg.map((m) => m.message || m).join(', ') : (msg || 'Error'));
    } finally { setLoading(false); }
  };

  const handleClose = () => { setForm(INIT); setErrors({}); setApiErr(''); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        {apiErr && <Alert severity="error">{apiErr}</Alert>}
        <TextField label="Full Name" value={form.name} onChange={set('name')} error={Boolean(errors.name)} helperText={errors.name || '4–60 characters'} required />
        <TextField label="Email" type="email" value={form.email} onChange={set('email')} error={Boolean(errors.email)} helperText={errors.email} required />
        <TextField
          label="Password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')}
          error={Boolean(errors.password)} helperText={errors.password || '8–16 chars, 1 uppercase, 1 special'} required
          InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPwd((v) => !v)} edge="end" size="small">{showPwd ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }}
        />
        <TextField label="Address (optional)" value={form.address} onChange={set('address')} />
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select label="Role" value={form.role} onChange={set('role')}>
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="STORE_OWNER">STORE_OWNER</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={18} color="inherit" /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
