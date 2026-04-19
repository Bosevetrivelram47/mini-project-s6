import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import {
  Dashboard, People, Assignment, Task, CheckCircle,
  Timeline, Notifications, Logout, Shield
} from '@mui/icons-material';
import { Avatar, Tooltip } from '@mui/material';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <Dashboard fontSize="small" />, roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/users', label: 'User Management', icon: <People fontSize="small" />, roles: ['ADMIN'] },
  { to: '/tasks', label: 'Tasks', icon: <Task fontSize="small" />, roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/assignments', label: 'Assignments', icon: <Assignment fontSize="small" />, roles: ['ADMIN', 'MANAGER'] },
  { to: '/resolutions', label: 'Resolutions', icon: <CheckCircle fontSize="small" />, roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/navigation-logs', label: 'Navigation Logs', icon: <Timeline fontSize="small" />, roles: ['ADMIN'] },
  { to: '/notifications', label: 'Notifications', icon: <Notifications fontSize="small" />, roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
];

const roleColors: Record<string, string> = {
  ADMIN: '#a78bfa', MANAGER: '#60a5fa', EMPLOYEE: '#34d399'
};

export default function Sidebar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filteredItems = navItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col z-50"
      style={{
        width: '260px',
        background: 'linear-gradient(180deg, #0f172a 0%, #1a1f35 100%)',
        borderRight: '1px solid rgba(99,102,241,0.15)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 20px rgba(99,102,241,0.4)',
          }}
        >
          <Shield style={{ color: 'white', fontSize: 20 }} />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: '#f1f5f9' }}>Smart Tracker</div>
          <div className="text-xs" style={{ color: '#6366f1' }}>Behavior System</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3 px-3" style={{ color: '#475569' }}>
          Menu
        </div>
        <ul className="space-y-1">
          {filteredItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-white'
                      : 'hover:text-white'
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))'
                    : 'transparent',
                  color: isActive ? '#a5b4fc' : '#94a3b8',
                  border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                })}
              >
                <span style={{ opacity: 0.9 }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.to === '/notifications' && unreadCount > 0 && (
                  <span
                    className="ml-auto text-xs font-bold rounded-full flex items-center justify-center"
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      minWidth: 20,
                      height: 20,
                      padding: '0 4px',
                    }}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            sx={{
              width: 36, height: 36,
              bgcolor: roleColors[user?.role || 'EMPLOYEE'],
              fontSize: '0.875rem', fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: '#f1f5f9' }}>{user?.name}</div>
            <div
              className="text-xs px-1.5 py-0.5 rounded-full inline-block"
              style={{
                background: `${roleColors[user?.role || 'EMPLOYEE']}22`,
                color: roleColors[user?.role || 'EMPLOYEE'],
                fontWeight: 600,
              }}
            >
              {user?.role}
            </div>
          </div>
        </div>
        <Tooltip title="Logout">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
          >
            <Logout fontSize="small" />
            Sign Out
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
