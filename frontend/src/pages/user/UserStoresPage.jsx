import { useState, useEffect, useCallback } from 'react';
import { Box, Rating, Typography, Card, CardContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardLayout   from '../../layouts/DashboardLayout';
import PageHeader        from '../../components/common/PageHeader';
import SearchBar         from '../../components/common/SearchBar';
import ErrorMessage      from '../../components/common/ErrorMessage';
import StoreRatingWidget from '../../components/ratings/StoreRatingWidget';
import storeService      from '../../services/storeService';
import { useDebounce }   from '../../hooks/useDebounce';

export default function UserStoresPage() {
  const [rows,   setRows]   = useState([]);
  const [total,  setTotal]  = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [search,  setSearch]  = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState([{ field: 'name', sort: 'asc' }]);

  const debouncedSearch = useDebounce(search, 400);

  const fetchStores = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const sort = sortModel[0] || {};
      const res  = await storeService.getStores({
        search:    debouncedSearch || undefined,
        page:      paginationModel.page + 1,
        limit:     paginationModel.pageSize,
        sortBy:    sort.field || 'name',
        sortOrder: sort.sort  || 'asc',
      });
      setRows(res.data.data.data);
      setTotal(res.data.data.meta.total);
    } catch { setError('Failed to load stores'); }
    finally  { setLoading(false); }
  }, [debouncedSearch, paginationModel, sortModel]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleRated = useCallback((storeId, value) => {
    setRows((prev) => prev.map((r) => r.id === storeId ? { ...r, my_rating: value } : r));
    setTimeout(fetchStores, 600);
  }, [fetchStores]);

  const columns = [
    { field: 'name',    headerName: 'Store Name', flex: 1, minWidth: 160 },
    { field: 'address', headerName: 'Address',    flex: 1, minWidth: 200,
      renderCell: (p) => <span title={p.value}>{p.value}</span> },
    {
      field: 'average_rating', headerName: 'Avg Rating', width: 210,
      renderCell: (p) => (
        <Box display="flex" alignItems="center" gap={0.5}>
          <Rating value={Number(p.value) || 0} precision={0.1} readOnly size="small" />
          <Typography variant="caption" fontWeight={600}>{Number(p.value || 0).toFixed(1)}</Typography>
          <Typography variant="caption" color="text.secondary">({p.row.total_ratings})</Typography>
        </Box>
      ),
    },
    {
      field: 'my_rating', headerName: 'My Rating', width: 230, sortable: false,
      renderCell: (p) => (
        <StoreRatingWidget
          storeId={p.row.id}
          myRating={p.value}
          onRated={(val) => handleRated(p.row.id, val)}
        />
      ),
    },
  ];

  return (
    <DashboardLayout title="Browse Stores">
      <PageHeader title="Stores" subtitle="Browse stores and submit your ratings" />
      <Card>
        <CardContent>
          <Box mb={2}>
            <SearchBar
              value={search}
              onChange={(v) => { setSearch(v); setPaginationModel((m) => ({ ...m, page: 0 })); }}
              placeholder="Search by name or address…"
            />
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
            rowHeight={62}
            disableRowSelectionOnClick
            autoHeight
            sx={{ border: 0 }}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
