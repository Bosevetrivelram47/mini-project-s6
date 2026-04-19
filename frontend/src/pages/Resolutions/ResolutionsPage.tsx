import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResolutions, resolveTask } from '@/features/resolutions/resolutionSlice';
import { fetchTasks } from '@/features/tasks/taskSlice';
import type { AppDispatch, RootState } from '@/app/store';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, CircularProgress, Paper, TextField, Chip
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

export default function ResolutionsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { resolutions, loading } = useSelector((state: RootState) => state.resolutions);
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const [openResolve, setOpenResolve] = useState(false);
  const [form, setForm] = useState({ taskId: '', remarks: '' });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(fetchResolutions());
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleResolve = async () => {
    const result = await dispatch(resolveTask({ taskId: Number(form.taskId), remarks: form.remarks }));
    if (resolveTask.fulfilled.match(result)) {
      enqueueSnackbar('Task resolved successfully!', { variant: 'success' });
      setOpenResolve(false);
      setForm({ taskId: '', remarks: '' });
    } else {
      enqueueSnackbar(result.payload as string, { variant: 'error' });
    }
  };

  const resolvableTasks = tasks.filter(t => t.status !== 'RESOLVED');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>Task Resolutions</h2>
          <p className="text-sm" style={{ color: '#64748b' }}>{resolutions.length} resolved tasks</p>
        </div>
        <Button id="resolve-task-btn" variant="contained" startIcon={<CheckCircle />} onClick={() => setOpenResolve(true)}
          sx={{ background: 'linear-gradient(135deg, #10b981, #059669)', '&:hover': { background: '#059669' } }}>
          Resolve Task
        </Button>
      </div>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(99,102,241,0.1)' }}>
        {loading ? (
          <div className="flex justify-center py-16"><CircularProgress style={{ color: '#6366f1' }} /></div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['#', 'Task', 'Resolved By', 'Remarks', 'Resolved At'].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {resolutions.map((r, i) => (
                  <TableRow key={r.id}>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.75rem' }}>{i + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle fontSize="small" sx={{ color: '#10b981' }} />
                        <span className="font-medium" style={{ color: '#f1f5f9' }}>{r.taskTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip label={r.resolvedByName} size="small" sx={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }} />
                    </TableCell>
                    <TableCell style={{ color: '#94a3b8', maxWidth: 200 }}>
                      <span className="truncate">{r.remarks || '—'}</span>
                    </TableCell>
                    <TableCell style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {new Date(r.resolvedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {resolutions.length === 0 && (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: '#475569' }}>No resolutions yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={openResolve} onClose={() => setOpenResolve(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#f1f5f9', fontWeight: 700 }}>Resolve a Task</DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <TextField select label="Select Task" value={form.taskId} onChange={e => setForm({...form, taskId: e.target.value})} fullWidth>
            {resolvableTasks.map(t => <MenuItem key={t.id} value={t.id}>{t.title} ({t.status})</MenuItem>)}
          </TextField>
          <TextField
            label="Resolution Remarks"
            value={form.remarks}
            onChange={e => setForm({...form, remarks: e.target.value})}
            fullWidth multiline rows={3}
            placeholder="Describe how the task was resolved..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button id="cancel-resolve" onClick={() => setOpenResolve(false)} variant="outlined">Cancel</Button>
          <Button id="submit-resolve" onClick={handleResolve} variant="contained" disabled={!form.taskId}>Resolve Task</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
