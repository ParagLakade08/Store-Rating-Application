import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert, CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import adminService from '../../services/adminService';

const INIT = { name: '', email: '', address: '', owner_id: '' };

export default function AddStoreDialog({ open, onClose, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  const [form,    setForm]    = useState(INIT);
  const [errors,  setErrors]  = useState({});
  const [apiErr,  setApiErr]  = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: '' })); };

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 3) errs.name    = 'Name required (min 3 chars)';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.address) errs.address = 'Address is required';
    if (!form.owner_id || isNaN(Number(form.owner_id))) errs.owner_id = 'Valid owner ID required';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.values(errs).some(Boolean)) { setErrors(errs); return; }
    setApiErr(''); setLoading(true);
    try {
      await adminService.addStore({ ...form, owner_id: Number(form.owner_id) });
      enqueueSnackbar('Store created successfully', { variant: 'success' });
      setForm(INIT); onSuccess(); onClose();
    } catch (e) {
      const msg = e.response?.data?.message;
      setApiErr(Array.isArray(msg) ? msg.map((m) => m.message || m).join(', ') : (msg || 'Error'));
    } finally { setLoading(false); }
  };

  const handleClose = () => { setForm(INIT); setErrors({}); setApiErr(''); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Store</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        {apiErr && <Alert severity="error">{apiErr}</Alert>}
        <TextField label="Store Name" value={form.name} onChange={set('name')} error={Boolean(errors.name)} helperText={errors.name} required />
        <TextField label="Email" type="email" value={form.email} onChange={set('email')} error={Boolean(errors.email)} helperText={errors.email} required />
        <TextField label="Address" value={form.address} onChange={set('address')} error={Boolean(errors.address)} helperText={errors.address} required />
        <TextField
          label="Owner ID" type="number" value={form.owner_id} onChange={set('owner_id')}
          error={Boolean(errors.owner_id)} helperText={errors.owner_id || 'Must be the ID of a STORE_OWNER user'} required
        />
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
