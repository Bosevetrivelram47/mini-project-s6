import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { dashboardApi } from '@/api/dashboardApi';
import type { DashboardStats } from '@/types';
import { CircularProgress } from '@mui/material';
import {
  PeopleAlt, Task, CheckCircle, HourglassEmpty, Sync, Assignment
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981'];

function StatCard({ title, value, icon, color, subtitle }: {
  title: string; value: number | string; icon: React.ReactNode;
  color: string; subtitle?: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 hover-lift"
      style={{
        background: 'rgba(30,41,59,0.8)',
        border: `1px solid ${color}25`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>{title}</p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#f1f5f9' }}>{value}</p>
          {subtitle && <p className="text-xs mt-1" style={{ color: color }}>{subtitle}</p>}
        </div>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: 48, height: 48, background: `${color}20`, color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularProgress style={{ color: '#6366f1' }} />
      </div>
    );
  }

  const taskChartData = stats ? [
    { name: 'Pending', value: stats.pendingTasks, fill: '#f59e0b' },
    { name: 'In Progress', value: stats.inProgressTasks, fill: '#3b82f6' },
    { name: 'Resolved', value: stats.resolvedTasks, fill: '#10b981' },
  ] : [];

  const barData = stats ? [
    { name: 'Pending', count: stats.pendingTasks },
    { name: 'In Progress', count: stats.inProgressTasks },
    { name: 'Resolved', count: stats.resolvedTasks },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <h2 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>
          Welcome back, <span className="gradient-text">{user?.name}!</span> 👋
        </h2>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
          Here's an overview of your Smart Tracker system.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={<PeopleAlt />} color="#6366f1" subtitle={`${stats?.activeUsers} active`} />
        <StatCard title="Total Tasks" value={stats?.totalTasks ?? 0} icon={<Task />} color="#8b5cf6" />
        <StatCard title="Pending Tasks" value={stats?.pendingTasks ?? 0} icon={<HourglassEmpty />} color="#f59e0b" />
        <StatCard title="In Progress" value={stats?.inProgressTasks ?? 0} icon={<Sync />} color="#3b82f6" />
        <StatCard title="Resolved Tasks" value={stats?.resolvedTasks ?? 0} icon={<CheckCircle />} color="#10b981" />
        <StatCard title="Assignments" value={stats?.totalAssignments ?? 0} icon={<Assignment />} color="#06b6d4" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}
        >
          <h3 className="text-base font-bold mb-4" style={{ color: '#f1f5f9' }}>Task Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {barData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}
        >
          <h3 className="text-base font-bold mb-4" style={{ color: '#f1f5f9' }}>Task Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={taskChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {taskChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Legend
                formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
              />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Summary */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}
      >
        <h3 className="text-sm font-bold mb-3" style={{ color: '#94a3b8' }}>SYSTEM HEALTH</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'User Activation Rate', value: stats ? `${Math.round((stats.activeUsers / Math.max(stats.totalUsers,1)) * 100)}%` : '—', color: '#10b981' },
            { label: 'Task Completion Rate', value: stats ? `${Math.round((stats.resolvedTasks / Math.max(stats.totalTasks,1)) * 100)}%` : '—', color: '#6366f1' },
            { label: 'Assignment Rate', value: stats ? `${Math.round((stats.totalAssignments / Math.max(stats.totalTasks,1)) * 100)}%` : '—', color: '#f59e0b' },
            { label: 'Active Users', value: `${stats?.activeUsers ?? 0} / ${stats?.totalUsers ?? 0}`, color: '#3b82f6' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
              <div className="text-xs mt-1" style={{ color: '#64748b' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
