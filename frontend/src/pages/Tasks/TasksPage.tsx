import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTaskStatus } from '@/features/tasks/taskSlice';
import type { AppDispatch, RootState } from '@/app/store';
import type { Task } from '@/types';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Chip, CircularProgress, Paper, Tooltip,
  IconButton, InputAdornment, Select, FormControl, InputLabel
} from '@mui/material';
import { Add, Search, Edit } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const statusColors: Record<string, 'warning' | 'info' | 'success'> = {
  PENDING: 'warning', IN_PROGRESS: 'info', RESOLVED: 'success'
};
const priorityColors: Record<string, 'default' | 'warning' | 'error'> = {
  LOW: 'default', MEDIUM: 'warning', HIGH: 'error'
};

export default function TasksPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const user = useSelector((state: RootState) => state.auth.user);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [openCreate, setOpenCreate] = useState(false);
  const [statusDialog, setStatusDialog] = useState<Task | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { dispatch(fetchTasks()); }, [dispatch]);

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleCreate = async () => {
    const result = await dispatch(createTask(form));
    if (createTask.fulfilled.match(result)) {
      enqueueSnackbar('Task created!', { variant: 'success' });
      setOpenCreate(false);
      setForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
    } else {
      enqueueSnackbar(result.payload as string, { variant: 'error' });
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusDialog || !newStatus) return;
    const result = await dispatch(updateTaskStatus({ id: statusDialog.id, status: newStatus }));
    if (updateTaskStatus.fulfilled.match(result)) {
      enqueueSnackbar('Task status updated!', { variant: 'success' });
      setStatusDialog(null);
    } else {
      enqueueSnackbar(result.payload as string, { variant: 'error' });
    }
  };

  const canCreate = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>Task Management</h2>
          <p className="text-sm" style={{ color: '#64748b' }}>{tasks.length} total tasks</p>
        </div>
        {canCreate && (
          <Button id="create-task-btn" variant="contained" startIcon={<Add />} onClick={() => setOpenCreate(true)}>
            New Task
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <TextField
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: '#64748b' }} /></InputAdornment> }}
        />
        <TextField select label="Status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} size="small" sx={{ minWidth: 140 }}>
          {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField select label="Priority" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} size="small" sx={{ minWidth: 130 }}>
          {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>
      </div>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(99,102,241,0.1)' }}>
        {loading ? (
          <div className="flex justify-center py-16"><CircularProgress style={{ color: '#6366f1' }} /></div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['#', 'Title', 'Status', 'Priority', 'Due Date', 'Created By', 'Created', 'Actions'].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((task, i) => (
                  <TableRow key={task.id}>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.75rem' }}>{i + 1}</TableCell>
                    <TableCell>
                      <div className="font-semibold" style={{ color: '#f1f5f9' }}>{task.title}</div>
                      {task.description && <div className="text-xs truncate max-w-xs" style={{ color: '#64748b' }}>{task.description}</div>}
                    </TableCell>
                    <TableCell><Chip label={task.status.replace('_',' ')} color={statusColors[task.status]} size="small" /></TableCell>
                    <TableCell><Chip label={task.priority} color={priorityColors[task.priority]} size="small" variant="outlined" /></TableCell>
                    <TableCell style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{task.createdByName}</TableCell>
                    <TableCell style={{ color: '#64748b', fontSize: '0.75rem' }}>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {task.status !== 'RESOLVED' && (
                        <Tooltip title="Update Status">
                          <IconButton
                            size="small"
                            onClick={() => { setStatusDialog(task); setNewStatus(task.status); }}
                            sx={{ color: '#6366f1' }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6, color: '#475569' }}>No tasks found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#f1f5f9', fontWeight: 700 }}>Create New Task</DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <TextField label="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} fullWidth required />
          <TextField label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} fullWidth multiline rows={3} />
          <TextField select label="Priority" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} fullWidth>
            {['LOW', 'MEDIUM', 'HIGH'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </TextField>
          <TextField label="Due Date" type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} fullWidth InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button id="cancel-create-task" onClick={() => setOpenCreate(false)} variant="outlined">Cancel</Button>
          <Button id="submit-create-task" onClick={handleCreate} variant="contained" disabled={!form.title}>Create Task</Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={!!statusDialog} onClose={() => setStatusDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: '#f1f5f9', fontWeight: 700 }}>Update Task Status</DialogTitle>
        <DialogContent>
          <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>{statusDialog?.title}</p>
          <FormControl fullWidth size="small">
            <InputLabel>New Status</InputLabel>
            <Select value={newStatus} onChange={e => setNewStatus(e.target.value)} label="New Status">
              {['PENDING', 'IN_PROGRESS', 'RESOLVED'].map(s => <MenuItem key={s} value={s}>{s.replace('_',' ')}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button id="cancel-status-update" onClick={() => setStatusDialog(null)} variant="outlined">Cancel</Button>
          <Button id="submit-status-update" onClick={handleStatusUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
