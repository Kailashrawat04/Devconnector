import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserPlus, Github, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Explore = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await axios.get('/api/users/suggestions');
                setSuggestions(res.data);
            } catch (err) {
                console.error('Error fetching suggestions', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    const filteredSuggestions = suggestions.filter(dev =>
        dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dev.github && dev.github.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-display text-white">Explore Community</h1>
                <p className="text-[#7d8590]">Discover other developers and trending repositories.</p>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7d8590]" size={20} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for developers by name, github or skills..."
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-4 pl-12 pr-4 text-[#e6edf3] focus:outline-none focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7]/30 transition-all text-lg"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <h2 className="text-xl font-display text-white flex items-center gap-2">
                        <User className="text-[#2f81f7]" />
                        Trending Developers
                    </h2>
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="card h-20 animate-pulse border-[#30363d]/30"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredSuggestions.map(dev => (
                                <div key={dev._id} className="card flex items-center justify-between hover:bg-[#161b22] transition-all">
                                    <Link to={`/profile/${dev._id}`} className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#30363d] flex items-center justify-center font-bold text-white uppercase">
                                            {dev.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold hover:underline">{dev.name}</h4>
                                            <p className="text-[#7d8590] text-sm flex items-center gap-1">
                                                <Github size={12} />
                                                {dev.github || 'developer'}
                                            </p>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => onFollow(dev._id)}
                                        className="btn btn-outline text-xs px-4 py-1.5 border-[#30363d] hover:border-[#2f81f7] hover:text-[#2f81f7]"
                                    >
                                        <UserPlus size={14} />
                                        Follow
                                    </button>
                                </div>
                            ))}
                            {filteredSuggestions.length === 0 && <p className="text-[#7d8590] italic">No developers found matching your search.</p>}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-display text-white flex items-center gap-2">
                        <Github className="text-[#3fb950]" />
                        Popular Topics
                    </h2>
                    <div className="card space-y-4">
                        {['javascript', 'react', 'web3', 'ai', 'typescript', 'rust'].map(topic => (
                            <div key={topic} className="flex justify-between items-center group cursor-pointer">
                                <span className="text-[#7d8590] group-hover:text-[#2f81f7] transition-colors">#{topic}</span>
                                <span className="text-xs bg-[#161b22] px-2 py-1 rounded text-[#7d8590]">{Math.floor(Math.random() * 100)}k posts</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore;
