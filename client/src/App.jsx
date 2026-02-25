import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import Auth from './pages/Auth';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2f81f7]"></div>
        </div>
    );

    return user ? children : <Navigate to="/auth" />;
};

import { Home, Compass, User, Bell, Search as SearchIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/*" element={
                        <PrivateRoute>
                            <div className="app-container grid-bg min-h-screen flex flex-col md:flex-row max-w-[1400px] mx-auto overflow-hidden">
                                <Sidebar />
                                <main className="flex-1 flex flex-col md:ml-64 border-l border-r border-[#30363d] bg-[#0d1117] min-h-screen">
                                    <Navbar />
                                    <div className="p-4 overflow-y-auto h-full pb-24 md:pb-4">
                                        <Routes>
                                            <Route path="/" element={<Feed />} />
                                            <Route path="/profile/:id" element={<Profile />} />
                                            <Route path="/explore" element={<Explore />} />
                                            <Route path="/notifications" element={<Notifications />} />
                                        </Routes>
                                    </div>
                                    <MobileNav />
                                </main>
                                <div className="hidden lg:block w-[350px] p-4 bg-[#0d1117] border-l border-[#30363d]">
                                    {/* Right Sidebar - Trends/Suggestions */}
                                    <div className="sticky top-4 space-y-4">
                                        <ExploreSuggestions />
                                    </div>
                                </div>
                            </div>
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

const MobileNav = () => {
    const location = useLocation();
    const { user } = useAuth();

    const navItems = [
        { icon: Home, path: '/' },
        { icon: SearchIcon, path: '/explore' },
        { icon: Bell, path: '/notifications' },
        { icon: User, path: `/profile/${user?.id || user?._id}` },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d1117]/80 backdrop-blur-xl border-t border-[#30363d] flex justify-around items-center h-16 px-4 z-50">
            {navItems.map((item, i) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link key={i} to={item.path} className={`p-2 rounded-full transition-colors ${isActive ? 'text-[#2f81f7] bg-[#2f81f7]/10' : 'text-[#7d8590]'}`}>
                        <item.icon size={24} />
                    </Link>
                );
            })}
        </nav>
    );
};

const ExploreSuggestions = () => {
    return (
        <div className="card">
            <h3 className="text-lg mb-4">Trending repos</h3>
            <div className="space-y-3 opacity-50 italic">
                Coming soon...
            </div>
        </div>
    );
};

export default App;
