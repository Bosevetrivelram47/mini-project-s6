import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, toggleUserStatus } from '@/features/users/userSlice';
import type { AppDispatch, RootState } from '@/app/store';
import type { User } from '@/types';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Switch, Chip, CircularProgress,
  InputAdornment, Paper, Tooltip, IconButton
} from '@mui/material';
import { Add, Search, PersonAdd, Block, CheckCircle } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const roleColors: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
  ADMIN: 'secondary', MANAGER: 'primary', EMPLOYEE: 'success'
};

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.users);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleCreate = async () => {
    const result = await dispatch(createUser(form));
    if (createUser.fulfilled.match(result)) {
      enqueueSnackbar('User created successfully!', { variant: 'success' });
      setOpenCreate(false);
      setForm({ name: '', email: '', password: '', role: 'EMPLOYEE' });
    } else {
      enqueueSnackbar(result.payload as string, { variant: 'error' });
    }
  };

  const handleToggle = async (user: User) => {
    const result = await dispatch(toggleUserStatus({ id: user.id, active: !user.active }));
    if (toggleUserStatus.fulfilled.match(result)) {
      enqueueSnackbar(`User ${user.active ? 'deactivated' : 'activated'}`, { variant: 'info' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>User Management</h2>
          <p className="text-sm" style={{ color: '#64748b' }}>{users.length} total users</p>
        </div>
        <Button
          id="create-user-btn"
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setOpenCreate(true)}
        >
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <TextField
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 260 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: '#64748b' }} /></InputAdornment> }}
        />
        <TextField
          select
          label="Role"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 140 }}
        >
          {['ALL', 'ADMIN', 'MANAGER', 'EMPLOYEE'].map(r => (
            <MenuItem key={r} value={r}>{r}</MenuItem>
          ))}
        </TextField>
      </div>

      {/* Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(99,102,241,0.1)' }}>
        {loading ? (
          <div className="flex justify-center py-16"><CircularProgress style={{ color: '#6366f1' }} /></div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['#', 'Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((user, i) => (
                  <TableRow key={user.id}>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.75rem' }}>{i + 1}</TableCell>
                    <TableCell>
                      <span className="font-semibold" style={{ color: '#f1f5f9' }}>{user.name}</span>
                    </TableCell>
                    <TableCell style={{ color: '#94a3b8' }}>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={user.role} color={roleColors[user.role]} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.active ? 'Active' : 'Inactive'}
                        color={user.active ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={user.active ? 'Deactivate' : 'Activate'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggle(user)}
                          sx={{ color: user.active ? '#ef4444' : '#10b981' }}
                        >
                          {user.active ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#475569' }}>
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#f1f5f9', fontWeight: 700 }}>
          <Add sx={{ mr: 1, color: '#6366f1' }} />
          Create New User
        </DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <TextField label="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} fullWidth />
          <TextField label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} fullWidth />
          <TextField label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} fullWidth />
          <TextField select label="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} fullWidth>
            {['ADMIN', 'MANAGER', 'EMPLOYEE'].map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button id="cancel-create-user" onClick={() => setOpenCreate(false)} variant="outlined">Cancel</Button>
          <Button id="submit-create-user" onClick={handleCreate} variant="contained">Create User</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
