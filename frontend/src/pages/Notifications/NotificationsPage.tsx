import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyNotifications, markNotificationRead, markAllNotificationsRead } from '@/features/notifications/notificationSlice';
import type { AppDispatch, RootState } from '@/app/store';
import { Button, Chip, CircularProgress, Divider } from '@mui/material';
import { Notifications, DoneAll, MarkEmailRead } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const typeColors: Record<string, { bg: string; text: string }> = {
  WELCOME:       { bg: 'rgba(99,102,241,0.15)',  text: '#a5b4fc' },
  TASK_ASSIGNED: { bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24' },
  TASK_RESOLVED: { bg: 'rgba(16,185,129,0.15)',  text: '#34d399' },
  DEFAULT:       { bg: 'rgba(100,116,139,0.15)', text: '#94a3b8' },
};

export default function NotificationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading, unreadCount } = useSelector((state: RootState) => state.notifications);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { dispatch(fetchMyNotifications()); }, [dispatch]);

  const handleMarkRead = async (id: number) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAllRead = async () => {
    const result = await dispatch(markAllNotificationsRead());
    if (markAllNotificationsRead.fulfilled.match(result)) {
      enqueueSnackbar('All notifications marked as read', { variant: 'success' });
    }
  };

  const getTypeStyle = (type: string) => typeColors[type] || typeColors.DEFAULT;

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>Notifications</h2>
          <p className="text-sm" style={{ color: '#64748b' }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            id="mark-all-read-btn"
            variant="outlined"
            startIcon={<DoneAll />}
            onClick={handleMarkAllRead}
            size="small"
          >
            Mark All Read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><CircularProgress style={{ color: '#6366f1' }} /></div>
      ) : notifications.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl"
          style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}
        >
          <Notifications sx={{ fontSize: 48, color: '#334155', mb: 2 }} />
          <p style={{ color: '#475569' }}>No notifications yet</p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}
        >
          {notifications.map((n, i) => (
            <div key={n.id}>
              <div
                className="flex items-start gap-4 px-5 py-4 transition-all cursor-pointer"
                style={{
                  background: n.read ? 'transparent' : 'rgba(99,102,241,0.05)',
                  borderLeft: n.read ? '3px solid transparent' : '3px solid #6366f1',
                }}
                onClick={() => !n.read && handleMarkRead(n.id)}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center rounded-xl mt-0.5 flex-shrink-0"
                  style={{ width: 36, height: 36, background: getTypeStyle(n.type).bg }}
                >
                  <Notifications sx={{ fontSize: 18, color: getTypeStyle(n.type).text }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: n.read ? '#94a3b8' : '#f1f5f9', fontWeight: n.read ? 400 : 500 }}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs" style={{ color: '#475569' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                    <Chip
                      label={n.type || 'INFO'}
                      size="small"
                      sx={{
                        fontSize: '0.65rem',
                        height: 18,
                        background: getTypeStyle(n.type).bg,
                        color: getTypeStyle(n.type).text,
                      }}
                    />
                  </div>
                </div>

                {/* Unread indicator */}
                {!n.read && (
                  <div className="flex items-center gap-2">
                    <div className="pulse-dot" />
                    <Button
                      size="small"
                      startIcon={<MarkEmailRead sx={{ fontSize: 14 }} />}
                      onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id); }}
                      sx={{ fontSize: '0.7rem', color: '#6366f1', minWidth: 'auto' }}
                    >
                      Read
                    </Button>
                  </div>
                )}
              </div>
              {i < notifications.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
