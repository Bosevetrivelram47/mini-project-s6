import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNavigationLogs } from '@/features/navigation/navigationSlice';
import type { AppDispatch, RootState } from '@/app/store';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, CircularProgress
} from '@mui/material';
import { Timeline, Timer, Language } from '@mui/icons-material';

export default function NavigationLogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, loading } = useSelector((state: RootState) => state.navigation);

  useEffect(() => { dispatch(fetchNavigationLogs()); }, [dispatch]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>Navigation Logs</h2>
        <p className="text-sm" style={{ color: '#64748b' }}>Track user page visits and time spent</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Visits', value: logs.length, icon: <Timeline />, color: '#6366f1' },
          { label: 'Unique Users', value: new Set(logs.map(l => l.userId)).size, icon: <Language />, color: '#8b5cf6' },
          { label: 'Avg Time / Visit', value: logs.length ? formatTime(Math.round(logs.reduce((a, l) => a + l.timeSpentSeconds, 0) / logs.length)) : '0s', icon: <Timer />, color: '#06b6d4' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: 'rgba(30,41,59,0.8)', border: `1px solid ${s.color}25` }}>
            <div className="rounded-xl p-2" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
            <div>
              <div className="text-xl font-bold" style={{ color: '#f1f5f9' }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#64748b' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(99,102,241,0.1)' }}>
        {loading ? (
          <div className="flex justify-center py-16"><CircularProgress style={{ color: '#6366f1' }} /></div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['#', 'User', 'Page', 'URL', 'Time Spent', 'Visited At'].map(h => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log, i) => (
                  <TableRow key={log.id}>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.75rem' }}>{i + 1}</TableCell>
                    <TableCell>
                      <Chip label={log.userName} size="small" sx={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }} />
                    </TableCell>
                    <TableCell style={{ color: '#f1f5f9', fontWeight: 500 }}>{log.page}</TableCell>
                    <TableCell style={{ color: '#64748b', fontSize: '0.75rem' }}>{log.url || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        icon={<Timer sx={{ fontSize: '14px !important' }} />}
                        label={formatTime(log.timeSpentSeconds)}
                        size="small"
                        sx={{ background: 'rgba(6,182,212,0.15)', color: '#22d3ee' }}
                      />
                    </TableCell>
                    <TableCell style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {new Date(log.visitedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: '#475569' }}>No navigation logs yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </div>
  );
}
