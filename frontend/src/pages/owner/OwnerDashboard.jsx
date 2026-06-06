import { useEffect, useState, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Rating,
  Chip, Grid, Divider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import StarIcon      from '@mui/icons-material/Star';
import StoreIcon     from '@mui/icons-material/Store';
import PeopleIcon    from '@mui/icons-material/People';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader      from '../../components/common/PageHeader';
import StatCard        from '../../components/common/StatCard';
import Loader          from '../../components/common/Loader';
import ErrorMessage    from '../../components/common/ErrorMessage';
import ownerService    from '../../services/ownerService';

const columns = [
  { field: 'user_name',  headerName: 'User Name',  flex: 1, minWidth: 160 },
  { field: 'user_email', headerName: 'Email',       flex: 1, minWidth: 200 },
  {
    field: 'rating', headerName: 'Rating', width: 200,
    renderCell: (p) => (
      <Box display="flex" alignItems="center" gap={1}>
        <Rating value={p.value} readOnly size="small" precision={1} />
        <Typography variant="body2" fontWeight={600}>{p.value}</Typography>
      </Box>
    ),
  },
  {
    field: 'rated_at', headerName: 'Rated On', width: 160,
    renderCell: (p) => new Date(p.value).toLocaleDateString(),
  },
];

export default function OwnerDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState([{ field: 'rated_at', sort: 'desc' }]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await ownerService.getDashboard();
      setData(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // Client-side sort & paginate raters (small dataset)
  const getSortedRows = () => {
    if (!data?.raters) return [];
    const sorted = [...data.raters].sort((a, b) => {
      const s = sortModel[0];
      if (!s) return 0;
      const av = a[s.field], bv = b[s.field];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return s.sort === 'asc' ? cmp : -cmp;
    });
    const start = paginationModel.page * paginationModel.pageSize;
    return sorted.slice(start, start + paginationModel.pageSize);
  };

  return (
    <DashboardLayout title="Store Owner Dashboard">
      <PageHeader title="My Store Dashboard" subtitle="Monitor your store performance and ratings" />

      {loading && <Loader />}
      {error   && <ErrorMessage message={error} onRetry={fetchDashboard} />}

      {data && (
        <>
          {/* Store Info Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="flex-start" gap={2} flexWrap="wrap">
                <Box sx={{ bgcolor: '#e3f2fd', borderRadius: 2, p: 1.5 }}>
                  <StoreIcon sx={{ color: '#1976d2', fontSize: 32 }} />
                </Box>
                <Box flexGrow={1}>
                  <Typography variant="h6">{data.store.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{data.store.address}</Typography>
                  <Typography variant="body2" color="text.secondary">{data.store.email}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Stat Cards */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={4}>
              <StatCard
                label="Average Rating"
                value={Number(data.store.average_rating || 0).toFixed(2)}
                icon={<StarIcon />}
                color="#fff8e1"
                iconColor="#f57c00"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                label="Total Ratings"
                value={data.store.total_ratings}
                icon={<PeopleIcon />}
                color="#e3f2fd"
                iconColor="#1976d2"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Visual Rating</Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Rating
                      value={Number(data.store.average_rating || 0)}
                      precision={0.1}
                      readOnly
                      size="large"
                    />
                    <Typography variant="h5" fontWeight={700}>
                      {Number(data.store.average_rating || 0).toFixed(1)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Raters Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Users Who Rated Your Store</Typography>
              <Divider sx={{ mb: 2 }} />
              <DataGrid
                rows={getSortedRows().map((r, i) => ({ ...r, id: r.user_id ?? i }))}
                columns={columns}
                rowCount={data.raters.length}
                paginationMode="client"
                sortingMode="client"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                pageSizeOptions={[10, 25]}
                rowHeight={60}
                disableRowSelectionOnClick
                autoHeight
                sx={{ border: 0 }}
              />
            </CardContent>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
