import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Github, MapPin, Calendar, Users, Briefcase, Star, Code, Loader2, Heart, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/users/profile/${id}`);
                setUser(res.data);
                setIsFollowing(res.data.followers.includes(currentUser?.id || currentUser?._id));

                if (res.data.github) {
                    const repoRes = await axios.get(`/api/users/github/${res.data.github}`);
                    setRepos(repoRes.data);
                }
            } catch (err) {
                console.error('Error fetching profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, currentUser]);

    const onFollow = async () => {
        try {
            await axios.put(`/api/users/follow/${id}`);
            setIsFollowing(true);
            setUser({ ...user, followers: [...user.followers, (currentUser?.id || currentUser?._id)] });
        } catch (err) {
            console.error('Error following user', err);
        }
    };

    if (loading) return (
        <div className="max-w-4xl mx-auto pb-20 animate-pulse">
            <div className="h-48 md:h-64 bg-[#161b22] rounded-xl border border-[#30363d] mb-20 relative">
                <div className="absolute -bottom-16 left-8 w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#30363d] border-4 border-[#0d1117]"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 px-4">
                <div className="md:col-span-1 space-y-6">
                    <div className="card h-40 bg-[#161b22] border-[#30363d]/50"></div>
                    <div className="card h-24 bg-[#161b22] border-[#30363d]/50"></div>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <div className="h-10 w-full border-b border-[#30363d]"></div>
                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="card h-32 bg-[#161b22] border-[#30363d]/50"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (!user) return <div className="text-center py-20 text-[#7d8590]">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header / Cover */}
            <div className="relative mb-20">
                <div className="h-48 md:h-64 bg-gradient-to-br from-[#161b22] to-[#2f81f7]/20 rounded-xl overflow-hidden border border-[#30363d]">
                    <div className="absolute inset-0 grid-bg opacity-30"></div>
                </div>
                <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#0d1117] border-4 border-[#0d1117] overflow-hidden shadow-2xl relative">
                        <div className="w-full h-full bg-[#30363d] flex items-center justify-center text-white text-5xl font-bold uppercase">
                            {user.name?.[0]}
                        </div>
                    </div>
                    <div className="mb-2 pb-2">
                        <h1 className="text-3xl font-display text-white">{user.name}</h1>
                        <p className="text-[#7d8590] font-medium">@{user.github || 'developer'}</p>
                    </div>
                </div>
                <div className="absolute -bottom-6 right-8">
                    {(currentUser?.id !== id && currentUser?._id !== id) && (
                        <button
                            onClick={onFollow}
                            disabled={isFollowing}
                            className={`btn ${isFollowing ? 'btn-outline opacity-70 cursor-default' : 'btn-primary'} px-8`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                    {(currentUser?.id === id || currentUser?._id === id) && (
                        <button className="btn btn-outline px-8 border-[#30363d] hover:border-white">Edit Profile</button>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 px-4">
                {/* Left Column: Stats & Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="card glass border-[#30363d]/50">
                        <p className="text-[#e6edf3] mb-4">{user.bio || 'No bio yet.'}</p>

                        <div className="space-y-3 text-[#7d8590] text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>Global / Earth</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>Joined {format(new Date(user.date), 'MMMM yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#2f81f7] hover:underline cursor-pointer">
                                <Github size={16} />
                                <span>github.com/{user.github}</span>
                            </div>
                        </div>

                        <div className="flex gap-6 mt-6 pt-6 border-t border-[#30363d]">
                            <div className="flex flex-col">
                                <span className="text-white font-bold">{user.followers?.length || 0}</span>
                                <span className="text-[#7d8590] text-xs font-bold uppercase">Followers</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold">{user.following?.length || 0}</span>
                                <span className="text-[#7d8590] text-xs font-bold uppercase">Following</span>
                            </div>
                        </div>
                    </div>

                    <div className="card glass border-[#30363d]/50">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#7d8590] mb-4">Activity</h3>
                        <div className="flex flex-wrap gap-1">
                            {[...Array(28)].map((_, i) => (
                                <div key={i} className={`w-3 h-3 rounded-[2px] ${Math.random() > 0.7 ? 'bg-[#3fb950]' : Math.random() > 0.4 ? 'bg-[#216e39]' : 'bg-[#161b22]'}`}></div>
                            ))}
                        </div>
                        <p className="text-[10px] text-[#7d8590] mt-2 italic">Developer contributions visualization</p>
                    </div>
                </div>

                {/* Right Column: Tabs & Content */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex border-b border-[#30363d] mb-6">
                        {['posts', 'repos', 'liked'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 font-semibold text-sm capitalize transition-all relative ${activeTab === tab ? 'text-white' : 'text-[#7d8590] hover:text-[#e6edf3]'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2f81f7]"></div>}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'posts' && (
                        <div className="space-y-4">
                            <PostPlaceholder text="Sharing my latest findings in the world of distributed systems!" />
                            <PostPlaceholder text="Just push a major update to the DevConnect core engine. Check it out on my GitHub! https://github.com/dev/core" />
                        </div>
                    )}

                    {activeTab === 'repos' && (
                        <div className="grid gap-4">
                            {repos.length > 0 ? repos.map(repo => (
                                <div key={repo.id} className="card hover:border-[#2f81f7] transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <Code size={18} className="text-[#7d8590]" />
                                            <h4 className="text-lg text-[#2f81f7] group-hover:underline cursor-pointer">{repo.name}</h4>
                                            {repo.private && <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-[#30363d] text-[#7d8590]">Private</span>}
                                        </div>
                                        <span className="flex items-center gap-1 text-[10px] text-[#7d8590] uppercase font-bold px-2 py-1 rounded-full border border-[#30363d]">
                                            Open Source
                                        </span>
                                    </div>
                                    <p className="text-[#7d8590] text-sm mb-4 line-clamp-2">{repo.description || 'No description provided.'}</p>
                                    <div className="flex items-center gap-4 text-[#7d8590] text-xs">
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <span>{repo.language || 'Code'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star size={14} />
                                            <span>{repo.stargazers_count}</span>
                                        </div>
                                        <div className="text-[#7d8590]">Updated {format(new Date(repo.updated_at), 'MMM d, yyyy')}</div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-[#7d8590]">No public repositories found.</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'liked' && (
                        <div className="text-center py-20 text-[#7d8590] italic">
                            No liked posts yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PostPlaceholder = ({ text }) => (
    <div className="card border-[#30363d]/30 opacity-60 grayscale hover:grayscale-0 transition-all">
        <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#30363d]"></div>
            <div className="flex-1">
                <div className="h-4 w-24 bg-[#30363d] rounded mb-2"></div>
                <p className="text-sm">{text}</p>
                <div className="flex gap-4 mt-4">
                    <div className="w-10 h-4 bg-[#161b22] rounded"></div>
                    <div className="w-10 h-4 bg-[#161b22] rounded"></div>
                </div>
            </div>
        </div>
    </div>
);

export default Profile;
