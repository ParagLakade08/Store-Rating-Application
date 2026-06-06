import { useState, useEffect, useCallback } from 'react';
import { Box, Button, Chip, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader       from '../../components/common/PageHeader';
import SearchBar        from '../../components/common/SearchBar';
import ErrorMessage     from '../../components/common/ErrorMessage';
import AddUserDialog    from '../../components/forms/AddUserDialog';
import adminService     from '../../services/adminService';
import { useDebounce }  from '../../hooks/useDebounce';
import { useSnackbar }  from 'notistack';

const ROLE_COLOR = { ADMIN: 'error', USER: 'primary', STORE_OWNER: 'success' };

const getColumns = (onDeleteClick) => [
  { field: 'id',      headerName: 'ID',      width: 70 },
  { field: 'name',    headerName: 'Name',    flex: 1, minWidth: 150 },
  { field: 'email',   headerName: 'Email',   flex: 1, minWidth: 180 },
  { field: 'address', headerName: 'Address', flex: 1, minWidth: 200,
    renderCell: (p) => <span title={p.value}>{p.value || '—'}</span> },
  { field: 'role', headerName: 'Role', width: 130,
    renderCell: (p) => <Chip label={p.value} size="small" color={ROLE_COLOR[p.value] || 'default'} /> },
  { field: 'created_at', headerName: 'Created', width: 160,
    renderCell: (p) => new Date(p.value).toLocaleDateString() },
  { 
    field: 'actions', 
    headerName: 'Actions', 
    width: 100, 
    sortable: false,
    renderCell: (p) => (
      p.row.role === 'ADMIN' ? (
        <span title="Cannot delete admin users" style={{ color: '#999' }}>—</span>
      ) : (
        <IconButton 
          size="small" 
          color="error" 
          onClick={() => onDeleteClick(p.row.id, p.row.name)}
          title="Delete user"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )
    ),
  },
];

export default function AdminUsersPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows,       setRows]       = useState([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel,  setSortModel]  = useState([{ field: 'created_at', sort: 'desc' }]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const sort = sortModel[0] || {};
      const res  = await adminService.getUsers({
        search:    debouncedSearch || undefined,
        page:      paginationModel.page + 1,
        limit:     paginationModel.pageSize,
        sortBy:    sort.field    || 'created_at',
        sortOrder: sort.sort     || 'desc',
      });
      setRows(res.data.data.data);
      setTotal(res.data.data.meta.total);
    } catch { setError('Failed to load users'); }
    finally  { setLoading(false); }
  }, [debouncedSearch, paginationModel, sortModel]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDeleteClick = (id, name) => {
    setDeleteDialog({ open: true, id, name });
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteUser(deleteDialog.id);
      enqueueSnackbar(`User "${deleteDialog.name}" deleted successfully`, { variant: 'success' });
      setDeleteDialog({ open: false, id: null, name: '' });
      fetchUsers();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to delete user', { variant: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Users Management">
      <PageHeader
        title="Users"
        subtitle="Manage all platform users"
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>Add User</Button>}
      />

      <Card>
        <CardContent>
          <Box mb={2}>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPaginationModel((m) => ({ ...m, page: 0 })); }} />
          </Box>
          {error && <ErrorMessage message={error} onRetry={fetchUsers} />}
          <DataGrid
            rows={rows}
            columns={getColumns(handleDeleteClick)}
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

      <AddUserDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSuccess={fetchUsers} />

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete user <strong>"{deleteDialog.name}"</strong>? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null, name: '' })}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
