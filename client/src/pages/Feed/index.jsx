import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Heart, MessageSquare, Share2, Send, Loader2, Github, Star, Code } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Feed = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('/api/posts');
                setPosts(res.data);
            } catch (err) {
                console.error('Error fetching posts', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setSubmitting(true);
        try {
            const res = await axios.post('/api/posts', { text });
            setPosts([res.data, ...posts]);
            setText('');
        } catch (err) {
            console.error('Error creating post', err);
        } finally {
            setSubmitting(false);
        }
    };

    const onLike = async (id) => {
        try {
            const res = await axios.put(`/api/posts/like/${id}`);
            // Optimistic/Easy update
            setPosts(posts.map(post => post._id === id ? { ...post, likes: res.data } : post));
        } catch (err) {
            console.error('Error liking post', err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {/* Create Post */}
            <div className="card glass border-[#30363d]/50">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#30363d] flex-shrink-0 flex items-center justify-center font-bold text-white">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <form onSubmit={onSubmit} className="flex-1 space-y-3">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What's on your mind, dev?"
                            className="w-full bg-transparent border-none focus:ring-0 text-[#e6edf3] placeholder-[#7d8590] resize-none text-lg min-h-[100px]"
                        ></textarea>
                        <div className="flex justify-between items-center border-t border-[#30363d] pt-3">
                            <div className="flex gap-2 text-[#7d8590]">
                                <button type="button" className="p-2 hover:bg-[#161b22] rounded-full transition-colors"><Code size={20} /></button>
                                <button type="button" className="p-2 hover:bg-[#161b22] rounded-full transition-colors"><Github size={20} /></button>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting || !text.trim()}
                                className="btn btn-primary px-6 py-2"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Feed List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="card animate-pulse border-[#30363d]/30">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#30363d]"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-3 w-1/4 bg-[#30363d] rounded"></div>
                                    <div className="h-3 w-full bg-[#161b22] rounded"></div>
                                    <div className="h-3 w-5/6 bg-[#161b22] rounded"></div>
                                    <div className="flex gap-8 pt-2">
                                        <div className="h-4 w-12 bg-[#161b22] rounded"></div>
                                        <div className="h-4 w-12 bg-[#161b22] rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} onLike={() => onLike(post._id)} currentUser={user} />
                    ))}
                    {posts.length === 0 && (
                        <div className="text-center py-20 text-[#7d8590]">
                            <p className="text-xl font-display">No posts yet.</p>
                            <p>Be the first to share something with the community!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const PostCard = ({ post, onLike, currentUser }) => {
    const isLiked = post.likes.some(like => (like.user === (currentUser?.id || currentUser?._id)));
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(post.comments || []);
    const [submitting, setSubmitting] = useState(false);

    const onComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            const res = await axios.post(`/api/posts/comment/${post._id}`, { text: commentText });
            setComments(res.data);
            setCommentText('');
        } catch (err) {
            console.error('Error commenting', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card hover:bg-[#161b22]/50 transition-colors">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#30363d] flex-shrink-0 flex items-center justify-center font-bold text-white overflow-hidden uppercase">
                    {post.avatar ? <img src={post.avatar} alt="" /> : post.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white hover:underline cursor-pointer">{post.name}</h4>
                        <span className="text-[#7d8590] text-sm">• {formatDistanceToNow(new Date(post.date))} ago</span>
                    </div>
                    <p className="text-[#e6edf3] whitespace-pre-wrap mb-4">{post.text}</p>

                    {/* Mock Repo Embed if text mentions github */}
                    {post.text.toLowerCase().includes('github.com') && (
                        <div className="mb-4 bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex items-center justify-between hover:border-[#2f81f7] transition-all cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <Github className="text-[#e6edf3]" size={24} />
                                <div>
                                    <h5 className="text-[#2f81f7] font-semibold group-hover:underline">awesome-react-hooks</h5>
                                    <p className="text-[#7d8590] text-xs">A collection of top-tier hooks for React developers.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-[#7d8590]">
                                <span className="flex items-center gap-1 text-xs"><Star size={14} className="text-yellow-500" /> 1.2k</span>
                                <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> JavaScript</span>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between text-[#7d8590] mt-2">
                        <button
                            onClick={onLike}
                            className={`flex items-center gap-2 group transition-colors ${isLiked ? 'text-[#f91880]' : 'hover:text-[#f91880]'}`}
                        >
                            <div className={`p-2 rounded-full ${isLiked ? 'bg-[#f91880]/10' : 'group-hover:bg-[#f91880]/10'}`}>
                                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                            </div>
                            <span className="text-sm font-medium">{post.likes.length}</span>
                        </button>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className={`flex items-center gap-2 group transition-colors ${showComments ? 'text-[#2f81f7]' : 'hover:text-[#2f81f7]'}`}
                        >
                            <div className={`p-2 rounded-full ${showComments ? 'bg-[#2f81f7]/10' : 'group-hover:bg-[#2f81f7]/10'}`}>
                                <MessageSquare size={18} />
                            </div>
                            <span className="text-sm font-medium">{comments.length}</span>
                        </button>
                        <button className="flex items-center gap-2 group hover:text-[#3fb950] transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-[#3fb950]/10">
                                <Share2 size={18} />
                            </div>
                        </button>
                        <button className="p-2 rounded-full hover:bg-[#161b22] transition-colors">
                            <Send size={18} />
                        </button>
                    </div>

                    {/* Comment Section */}
                    {showComments && (
                        <div className="mt-4 pt-4 border-t border-[#30363d] space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <form onSubmit={onComment} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#30363d] flex-shrink-0 flex items-center justify-center font-bold text-white text-xs uppercase overflow-hidden">
                                    {currentUser?.name?.[0]}
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-full py-2 px-4 text-sm text-[#e6edf3] focus:outline-none focus:border-[#2f81f7] transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting || !commentText.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2f81f7] hover:text-[#58a6ff] disabled:opacity-50"
                                    >
                                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {comments.map((comment, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-7 h-7 rounded-full bg-[#30363d] flex-shrink-0 flex items-center justify-center font-bold text-white text-[10px] uppercase overflow-hidden">
                                            {comment.avatar ? <img src={comment.avatar} alt="" /> : comment.name?.[0]}
                                        </div>
                                        <div className="flex-1 bg-[#161b22] rounded-2xl px-4 py-2">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className="text-white text-sm font-bold">{comment.name}</span>
                                                <span className="text-[#7d8590] text-[10px]">{formatDistanceToNow(new Date(comment.date))} ago</span>
                                            </div>
                                            <p className="text-[#e6edf3] text-sm">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {comments.length === 0 && (
                                    <p className="text-center text-[#7d8590] text-sm py-4">No comments yet. Start the conversation!</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Feed;
