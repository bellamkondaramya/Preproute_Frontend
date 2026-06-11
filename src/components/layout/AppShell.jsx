import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-soft">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Header />
        <div className="p-8"><Outlet /></div>
      </main>
    </div>
  );
}
