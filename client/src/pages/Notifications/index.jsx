import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Heart, UserPlus, MessageSquare, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
    const { user } = useAuth();
    const [pageNotifications, setPageNotifications] = useState([]);

    // Mocking some initial notifications
    useEffect(() => {
        setPageNotifications([
            { id: 1, type: 'follow', from: 'Kailash Rawat', fromId: 'mock1', date: new Date(Date.now() - 1000 * 60 * 60 * 2) },
            { id: 2, type: 'like', from: 'Jane Smith', fromId: 'mock2', date: new Date(Date.now() - 1000 * 60 * 60 * 24), postText: 'Just push a major update...' },
            { id: 3, type: 'follow', from: 'Bob Martin', fromId: 'mock3', date: new Date(Date.now() - 1000 * 60 * 60 * 48) },
        ]);

        const socket = io('http://localhost:5000');
        if (user) {
            socket.emit('join', user.id || user._id);
        }

        socket.on('notification', (data) => {
            setPageNotifications(prev => [{
                id: Date.now(),
                type: data.type,
                from: data.from,
                fromId: data.fromId,
                date: new Date()
            }, ...prev]);
        });

        return () => socket.close();
    }, [user]);

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-3 mb-8">
                <Bell className="text-[#2f81f7]" size={28} />
                <h1 className="text-3xl font-display text-white">Notifications</h1>
            </div>

            <div className="space-y-4">
                {pageNotifications.map(notification => (
                    <div key={notification.id} className="card flex gap-4 hover:bg-[#161b22]/50 transition-all border-[#30363d]/50">
                        <div className="mt-1">
                            {notification.type === 'follow' && <UserPlus className="text-[#2f81f7]" size={20} />}
                            {notification.type === 'like' && <Heart className="text-[#f91880]" size={20} />}
                            {notification.type === 'comment' && <MessageSquare className="text-[#3fb950]" size={20} />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#30363d] flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                                    {notification.from[0]}
                                </div>
                                <p className="text-[#e6edf3]">
                                    <span className="font-bold">{notification.from}</span>
                                    {notification.type === 'follow' && ' started following you'}
                                    {notification.type === 'like' && ' liked your post'}
                                    {notification.type === 'comment' && ' commented on your post'}
                                </p>
                            </div>
                            {notification.postText && (
                                <p className="mt-2 text-[#7d8590] text-sm border-l-2 border-[#30363d] pl-3 italic">
                                    "{notification.postText.substring(0, 50)}..."
                                </p>
                            )}
                            <p className="mt-2 text-[#7d8590] text-xs">
                                {formatDistanceToNow(new Date(notification.date))} ago
                            </p>
                        </div>
                    </div>
                ))}

                {pageNotifications.length === 0 && (
                    <div className="text-center py-20 text-[#7d8590]">
                        <p className="text-xl font-display">All quiet here.</p>
                        <p>We'll notify you when someone interacts with your profile or posts.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
