// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// const Sidebar = ({ isCollapsed, onToggle }) => {
//   const { user, logout } = useContext(AuthContext);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const menuItems = {
// WORKER: [
//       { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
//       { icon: '👤', label: 'Profile', path: '/profile' },
//       { icon: '📊', label: 'Progress', path: '/progress' },
//       { icon: '🔔', label: 'Notifications', path: '/notifications' },
//       { icon: '⭐', label: 'Ratings', path: '/ratings' },
//     ],
//     EMPLOYER: [
//       { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
//       { icon: '➕', label: 'Post Job', path: '/post-job' },
//       { icon: '📋', label: 'My Jobs', path: '/jobs' },
//     ],
//     ADMIN: [
//       { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
//       { icon: '➕', label: 'Post Job', path: '/post-job' },
//       { icon: '👥', label: 'Manage Users', path: '/admin' },
//       { icon: '📋', label: 'All Jobs', path: '/jobs' },
//     ]
//   };

//   const items = menuItems[user?.role] || [];

//   const handleLogout = (e) => {
//     e.stopPropagation();
//     logout();
//     navigate('/login');
//   };

//   const isActive = (path) => location.pathname === path;

//   return (
//     <>
//       <aside className={`sidebar fixed left-0 top-0 h-screen w-60 bg-[#1E293B] text-white shadow-lg transition-transform duration-300 z-40 ${
//         isCollapsed ? '-translate-x-full' : 'translate-x-0'
//       }`}>
//         <div className="p-6 border-b border-slate-800">
//           <div className="flex items-center justify-between">
//             <h1 className="text-xl font-bold">WorkBridge</h1>
//             <button 
//               onClick={onToggle}
//               className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>
//         <nav className="p-4 flex-1">
//           <div className="space-y-2">
//             {items.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
//                   isActive(item.path)
//                     ? 'bg-[#2563EB] text-white shadow-lg'
//                     : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//                 }`}
//               >
//                 <span className="w-6 text-center">{item.icon}</span>
//                 <span>{item.label}</span>
//               </Link>
//             ))}
//           </div>
//         </nav>
//         <div className="p-4 border-t border-slate-800">
//           <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors" onClick={handleLogout}>
//             <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-sm font-medium">
//               {user?.name?.charAt(0)?.toUpperCase()}
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
//               <p className="text-xs text-slate-400 truncate">{user?.role}</p>
//             </div>
//             <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
//             </svg>
//           </div>
//         </div>
//       </aside>
//       {isCollapsed && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//           onClick={onToggle}
//         />
//       )}
//     </>
//   );
// };

// export default Sidebar;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = {
    WORKER: [
      { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
      { icon: '👤', label: 'Profile', path: '/profile' },
      { icon: '📊', label: 'Progress', path: '/progress' },
      { icon: '🔔', label: 'Notifications', path: '/notifications' },
      { icon: '⭐', label: 'Ratings', path: '/ratings' },
    ],
    EMPLOYER: [
      { icon: '🏠', label: 'Dashboard', path: '/employer-dashboard' },
      { icon: '➕', label: 'Post Job', path: '/post-job' },
      { icon: '📋', label: 'Jobs', path: '/employer-jobs' },
    ],
    ADMIN: [
      { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
      { icon: '➕', label: 'Post Job', path: '/post-job' },
      { icon: '👥', label: 'Manage Users', path: '/admin' },
      { icon: '📋', label: 'All Jobs', path: '/jobs' },
    ]
  };

  const items = menuItems[user?.role] || [];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <aside className={`sidebar fixed left-0 top-0 h-screen w-60 bg-[#1E293B] text-white shadow-lg transition-transform duration-300 z-40 ${
        isCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">WorkBridge</h1>
            <button 
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 flex-1">
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-[#2563EB] text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="w-6 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

      </aside>

      {/* Overlay */}
      {isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;