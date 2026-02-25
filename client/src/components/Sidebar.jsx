import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, User, Bell, LogOut, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Explore', path: '/explore', icon: Compass },
        { name: 'Profile', path: `/profile/${user?.id || user?._id}`, icon: User },
        { name: 'Notifications', path: '/notifications', icon: Bell },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-[#30363d] bg-[#0d1117] hidden md:flex flex-col p-6 z-10">
            <div className="mb-10 flex items-center gap-2">
                <Code2 className="text-[#2f81f7] w-8 h-8" />
                <h1 className="text-2xl font-display text-white">DevConnect</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-[#2f81f7]/10 text-[#2f81f7] border border-[#2f81f7]/20 shadow-[0_0_15px_rgba(47,129,247,0.1)]'
                                    : 'text-[#7d8590] hover:bg-[#161b22] hover:text-white'
                                }`}
                        >
                            <item.icon size={22} className={isActive ? 'stroke-[2.5px]' : ''} />
                            <span className="font-semibold">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto border-t border-[#30363d] pt-6 flex flex-col gap-4">
                {user && (
                    <div className="flex items-center gap-3 px-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#30363d] overflow-hidden flex items-center justify-center text-white font-bold text-lg">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate leading-tight">{user.name}</p>
                            <p className="text-[#7d8590] text-sm truncate">@{user.github || 'developer'}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={logout}
                    className="flex items-center gap-4 px-4 py-3 text-[#7d8590] hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
                >
                    <LogOut size={22} />
                    <span className="font-semibold">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
