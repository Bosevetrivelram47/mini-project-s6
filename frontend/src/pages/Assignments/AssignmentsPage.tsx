import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignments, assignTask } from '@/features/assignments/assignmentSlice';
import { fetchTasks } from '@/features/tasks/taskSlice';
import { fetchUsers } from '@/features/users/userSlice';
import type { AppDispatch, RootState } from '@/app/store';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, CircularProgress, Paper, TextField, Chip
} from '@mui/material';
import { Assignment, PersonAdd } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

export default function AssignmentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, loading } = useSelector((state: RootState) => state.assignments);
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { users } = useSelector((state: RootState) => state.users);
  const [openAssign, setOpenAssign] = useState(false);
  const [form, setForm] = useState({ taskId: '', assignedToUserId: '' });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(fetchAssignments());
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAssign = async () => {
    const result = await dispatch(assignTask({
      taskId: Number(form.taskId),
      assignedToUserId: Number(form.assignedToUserId),
    }));
    if (assignTask.fulfilled.match(result)) {
      enqueueSnackbar('Task assigned successfully!', { variant: 'success' });
      setOpenAssign(false);
      setForm({ taskId: '', assignedToUserId: '' });
    } else {
      enqueueSnackbar(result.payload as string, { variant: 'error' });
    }
  };

  const unassignedTasks = tasks.filter(t => t.status !== 'RESOLVED');
  const employees = users.filter(u => u.active && u.role === 'EMPLOYEE');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>Task Assignments</h2>
          <p className="text-sm" style={{ color: '#64748b' }}>{assignments.length} total assignments</p>
        </div>
        <Button id="assign-task-btn" variant="contained" startIcon={<PersonAdd />} onClick={() => setOpenAssign(true)}>
          Assign Task
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
                  {['#', 'Task', 'Assigned To', 'Assigned By', 'Assigned At'].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((a, i) => (
                  <TableRow key={a.id}>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.75rem' }}>{i + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Assignment fontSize="small" sx={{ color: '#6366f1' }} />
                        <span className="font-medium" style={{ color: '#f1f5f9' }}>{a.taskTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip label={a.assignedToName} size="small" sx={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={a.assignedByName} size="small" sx={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }} />
                    </TableCell>
                    <TableCell style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {new Date(a.assignedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {assignments.length === 0 && (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: '#475569' }}>No assignments yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={openAssign} onClose={() => setOpenAssign(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#f1f5f9', fontWeight: 700 }}>Assign Task to Employee</DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <TextField select label="Select Task" value={form.taskId} onChange={e => setForm({...form, taskId: e.target.value})} fullWidth>
            {unassignedTasks.length === 0 ? (
              <MenuItem disabled>No available tasks</MenuItem>
            ) : (
              unassignedTasks.map(t => <MenuItem key={t.id} value={t.id}>{t.title} ({t.status})</MenuItem>)
            )}
          </TextField>
          <TextField select label="Assign To" value={form.assignedToUserId} onChange={e => setForm({...form, assignedToUserId: e.target.value})} fullWidth>
            {employees.length === 0 ? (
              <MenuItem disabled>No active employees</MenuItem>
            ) : (
              employees.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)
            )}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button id="cancel-assign" onClick={() => setOpenAssign(false)} variant="outlined">Cancel</Button>
          <Button id="submit-assign" onClick={handleAssign} variant="contained" disabled={!form.taskId || !form.assignedToUserId}>
            Assign Task
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
