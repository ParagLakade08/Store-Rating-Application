import { useState, useEffect, useCallback } from 'react';
import { Box, Button, Rating, Card, CardContent, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader       from '../../components/common/PageHeader';
import SearchBar        from '../../components/common/SearchBar';
import ErrorMessage     from '../../components/common/ErrorMessage';
import AddStoreDialog   from '../../components/forms/AddStoreDialog';
import adminService     from '../../services/adminService';
import { useDebounce }  from '../../hooks/useDebounce';

const columns = [
  { field: 'id',           headerName: 'ID',      width: 70 },
  { field: 'name',         headerName: 'Store',   flex: 1, minWidth: 150 },
  { field: 'email',        headerName: 'Email',   flex: 1, minWidth: 180 },
  { field: 'address',      headerName: 'Address', flex: 1, minWidth: 200,
    renderCell: (p) => <span title={p.value}>{p.value || '—'}</span> },
  { field: 'owner_name',   headerName: 'Owner',   width: 150 },
  { field: 'average_rating', headerName: 'Avg Rating', width: 180,
    renderCell: (p) => (
      <Box display="flex" alignItems="center" gap={0.5}>
        <Rating value={Number(p.value) || 0} precision={0.1} readOnly size="small" />
        <Typography variant="caption">{Number(p.value).toFixed(1)}</Typography>
      </Box>
    ),
  },
  { field: 'total_ratings', headerName: 'Total Ratings', width: 120, type: 'number' },
];

export default function AdminStoresPage() {
  const [rows,       setRows]       = useState([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel,  setSortModel]  = useState([{ field: 'created_at', sort: 'desc' }]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const fetchStores = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const sort = sortModel[0] || {};
      const res  = await adminService.getStores({
        search:    debouncedSearch || undefined,
        page:      paginationModel.page + 1,
        limit:     paginationModel.pageSize,
        sortBy:    sort.field    || 'created_at',
        sortOrder: sort.sort     || 'desc',
      });
      setRows(res.data.data.data);
      setTotal(res.data.data.meta.total);
    } catch { setError('Failed to load stores'); }
    finally  { setLoading(false); }
  }, [debouncedSearch, paginationModel, sortModel]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  return (
    <DashboardLayout title="Stores Management">
      <PageHeader
        title="Stores"
        subtitle="Manage all platform stores"
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>Add Store</Button>}
      />

      <Card>
        <CardContent>
          <Box mb={2}>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPaginationModel((m) => ({ ...m, page: 0 })); }} />
          </Box>
          {error && <ErrorMessage message={error} onRetry={fetchStores} />}
          <DataGrid
            rows={rows}
            columns={columns}
            rowCount={total}
            loading={loading}
            paginationMode="server"
            sortingMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            autoHeight
            sx={{ border: 0 }}
          />
        </CardContent>
      </Card>

      <AddStoreDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSuccess={fetchStores} />
    </DashboardLayout>
  );
}
