import { NavLink } from 'react-router-dom';
import Logo from '../ui/Logo.jsx';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: '⌁' },
  { to: '/tests/create', label: 'Test Creation', icon: '✎' },
  { to: '/tracking', label: 'Test Tracking', icon: '◷' }
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r border-line bg-white">
      <div className="flex h-24 items-center px-8"><Logo /></div>
      <nav className="space-y-2 px-5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-soft hover:text-ink'}`}
          >
            <span>{item.icon}</span>{item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
