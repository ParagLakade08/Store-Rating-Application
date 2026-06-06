import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import PeopleIcon  from '@mui/icons-material/PeopleAlt';
import StoreIcon   from '@mui/icons-material/Store';
import StarIcon    from '@mui/icons-material/Star';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader      from '../../components/common/PageHeader';
import StatCard        from '../../components/common/StatCard';
import Loader          from '../../components/common/Loader';
import ErrorMessage    from '../../components/common/ErrorMessage';
import adminService    from '../../services/adminService';

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetch = async () => {
    setLoading(true); setError('');
    try {
      const res = await adminService.getDashboard();
      setStats(res.data.data);
    } catch { setError('Failed to load dashboard stats'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <DashboardLayout title="Admin Dashboard">
      <PageHeader title="Dashboard" subtitle="Platform overview" />
      {loading && <Loader />}
      {error   && <ErrorMessage message={error} onRetry={fetch} />}
      {stats && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <StatCard label="Total Users"   value={stats.totalUsers}   icon={<PeopleIcon />} color="#e3f2fd" iconColor="#1976d2" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard label="Total Stores"  value={stats.totalStores}  icon={<StoreIcon />}  color="#e8f5e9" iconColor="#388e3c" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard label="Total Ratings" value={stats.totalRatings} icon={<StarIcon />}   color="#fff8e1" iconColor="#f57c00" />
          </Grid>
        </Grid>
      )}
    </DashboardLayout>
  );
}
