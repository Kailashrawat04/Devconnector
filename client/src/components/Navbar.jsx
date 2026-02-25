import { useState, useEffect } from 'react';
import { Search, Bell, User, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

const Navbar = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState(0);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        if (user) {
            newSocket.emit('join', user.id || user._id);
        }

        newSocket.on('notification', () => {
            setNotifications(prev => prev + 1);
        });

        return () => newSocket.close();
    }, [user]);

    return (
        <header className="sticky top-0 h-16 border-b border-[#30363d] bg-[#0d1117]/80 backdrop-blur-md z-10 flex items-center justify-between px-6">
            <div className="md:hidden flex items-center gap-2">
                <Code2 className="text-[#2f81f7] w-6 h-6" />
                <h1 className="text-xl font-display text-white">DC</h1>
            </div>

            <div className="flex-1 max-w-xl mx-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8590] group-focus-within:text-[#2f81f7] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search developers, repos, or skills..."
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-full py-2 pl-10 pr-4 text-sm text-[#e6edf3] focus:outline-none focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7]/30 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative cursor-pointer group">
                    <Bell className={`text-[#7d8590] group-hover:text-white transition-colors ${notifications > 0 ? 'animate-pulse text-[#2f81f7]' : ''}`} size={22} />
                    {notifications > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#0d1117]">
                            {notifications}
                        </span>
                    )}
                </div>

                <Link to={`/profile/${user?.id || user?._id}`} className="flex items-center gap-2 max-md:hidden">
                    <div className="w-8 h-8 rounded-full bg-[#2f81f7]/20 flex items-center justify-center">
                        <User className="text-[#2f81f7]" size={18} />
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
