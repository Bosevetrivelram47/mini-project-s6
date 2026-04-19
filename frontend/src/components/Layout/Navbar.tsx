import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import type { RootState, AppDispatch } from '@/app/store';
import { fetchUnreadCount } from '@/features/notifications/notificationSlice';
import { Badge, IconButton, Tooltip, Avatar } from '@mui/material';
import { Notifications, NotificationsOutlined } from '@mui/icons-material';

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());
    }
  }, [dispatch, user]);

  const getPageTitle = () => {
    const map: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/users': 'User Management',
      '/tasks': 'Task Management',
      '/assignments': 'Task Assignments',
      '/resolutions': 'Task Resolutions',
      '/navigation-logs': 'Navigation Logs',
      '/notifications': 'Notifications',
    };
    return map[location.pathname] || 'Smart Tracker';
  };

  return (
    <header
      className="fixed z-40 flex items-center px-6"
      style={{
        left: '260px',
        right: 0,
        height: '64px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(99,102,241,0.15)',
      }}
    >
      <div className="flex-1">
        <h1 className="text-lg font-bold" style={{ color: '#f1f5f9' }}>
          {getPageTitle()}
        </h1>
        <p className="text-xs" style={{ color: '#64748b' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Tooltip title={`${unreadCount} unread notifications`}>
          <IconButton
            onClick={() => navigate('/notifications')}
            sx={{
              color: '#94a3b8',
              '&:hover': { color: '#6366f1', background: 'rgba(99,102,241,0.1)' },
            }}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              max={99}
              sx={{ '& .MuiBadge-badge': { fontWeight: 700, fontSize: '0.65rem' } }}
            >
              {unreadCount > 0 ? <Notifications /> : <NotificationsOutlined />}
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <Avatar
            sx={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>{user?.name}</div>
            <div className="text-xs" style={{ color: '#6366f1' }}>{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
