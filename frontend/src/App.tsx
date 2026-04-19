import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import MainLayout from '@/components/Layout/MainLayout';
import LoginPage from '@/pages/Login/LoginPage';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import UsersPage from '@/pages/Users/UsersPage';
import TasksPage from '@/pages/Tasks/TasksPage';
import AssignmentsPage from '@/pages/Assignments/AssignmentsPage';
import ResolutionsPage from '@/pages/Resolutions/ResolutionsPage';
import NavigationLogsPage from '@/pages/NavigationLogs/NavigationLogsPage';
import NotificationsPage from '@/pages/Notifications/NotificationsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function RoleRoute({ children, roles }: { children: React.ReactNode; roles: string[] }) {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={
          <RoleRoute roles={['ADMIN']}><UsersPage /></RoleRoute>
        } />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="assignments" element={
          <RoleRoute roles={['ADMIN', 'MANAGER']}><AssignmentsPage /></RoleRoute>
        } />
        <Route path="resolutions" element={<ResolutionsPage />} />
        <Route path="navigation-logs" element={
          <RoleRoute roles={['ADMIN']}><NavigationLogsPage /></RoleRoute>
        } />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
