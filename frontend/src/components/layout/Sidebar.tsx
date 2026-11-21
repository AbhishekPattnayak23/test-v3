import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  ClipboardCheck, 
  CheckSquare, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  Users,
  FileText,
  Clock
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/assignments', label: 'My Assignments', icon: ClipboardCheck },
    { path: '/approvals', label: 'Pending Approvals', icon: CheckSquare },
    { path: '/audit', label: 'Audit Logs', icon: ShieldCheck },
    { path: '/requests', label: 'My Requests', icon: FileText },
  ];

  const adminNavItems = [
    { path: '/admin/metrics', label: 'Metrics Dashboard', icon: BarChart3 },
    { path: '/admin/users', label: 'User Management', icon: Users },
    { path: '/admin/config', label: 'Configuration', icon: Settings },
    { path: '/admin/workflows', label: 'Workflow Templates', icon: Clock },
  ];

  const renderNavItem = (item: typeof mainNavItems[0]) => (
    <li key={item.path}>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`
        }
      >
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
      </NavLink>
    </li>
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Solmar</h1>
            <p className="text-sm text-gray-500">Workflow Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
            Main Navigation
          </h2>
          <ul className="space-y-1">
            {mainNavItems.map(renderNavItem)}
          </ul>
        </div>

        {user?.role === 'ADMIN' && (
          <div className="mt-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              Administration
            </h2>
            <ul className="space-y-1">
              {adminNavItems.map(renderNavItem)}
            </ul>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {user?.firstName?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role?.toLowerCase() || 'User'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;