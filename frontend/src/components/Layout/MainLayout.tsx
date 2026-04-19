import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: '#0f172a' }}>
      <Sidebar />
      <div className="flex flex-col flex-1" style={{ marginLeft: '260px' }}>
        <Navbar />
        <main
          className="flex-1 p-6 page-enter"
          style={{ marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
