import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Code2, Github, Loader2, ArrowRight } from 'lucide-react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        github: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 grid-bg relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#2f81f7]/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#3fb950]/10 blur-[120px] rounded-full"></div>

            <div className="card w-full max-w-md relative z-10 glass border-[#30363d]/50 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#2f81f7]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#2f81f7]/20">
                        <Code2 size={40} className="text-[#2f81f7]" />
                    </div>
                    <h1 className="text-3xl font-display text-white tracking-tight">DevConnect</h1>
                    <p className="text-[#7d8590] mt-2 font-medium">The social network for developers.</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex p-1 bg-[#161b22] rounded-lg mb-8 border border-[#30363d]">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${isLogin ? 'bg-[#2f81f7] text-white shadow-lg' : 'text-[#7d8590] hover:text-white'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${!isLogin ? 'bg-[#2f81f7] text-white shadow-lg' : 'text-[#7d8590] hover:text-white'}`}
                    >
                        Register
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-bold text-[#7d8590] uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onChange}
                                placeholder="Your full name"
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg py-3 px-4 text-[#e6edf3] focus:outline-none focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7]/30 transition-all font-medium"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-[#7d8590] uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            placeholder="you@company.com"
                            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg py-3 px-4 text-[#e6edf3] focus:outline-none focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7]/30 transition-all font-medium"
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1.5 ml-1">
                            <label className="block text-xs font-bold text-[#7d8590] uppercase tracking-wider">Password</label>
                            {isLogin && <button type="button" className="text-xs font-bold text-[#2f81f7] hover:underline uppercase tracking-wider">Forgot?</button>}
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            placeholder="••••••••"
                            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg py-3 px-4 text-[#e6edf3] focus:outline-none focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7]/30 transition-all font-medium"
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-bold text-[#7d8590] uppercase tracking-wider mb-1.5 ml-1">Github Username (Optional)</label>
                            <div className="relative">
                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8590]" size={18} />
                                <input
                                    type="text"
                                    name="github"
                                    value={formData.github}
                                    onChange={onChange}
                                    placeholder="e.g. janesmith"
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg py-3 pl-11 pr-4 text-[#e6edf3] focus:outline-none focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7]/30 transition-all font-medium"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-3.5 mt-2 shadow-[0_8px_16px_rgba(47,129,247,0.2)]"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <span className="flex items-center gap-2 font-display text-base">
                                {isLogin ? 'Login Securely' : 'Join DevConnect'}
                                <ArrowRight size={18} />
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-4">
                    <div className="h-[1px] bg-[#30363d] flex-1"></div>
                    <span className="text-[#7d8590] text-xs font-bold uppercase tracking-[0.2em]">Or use github</span>
                    <div className="h-[1px] bg-[#30363d] flex-1"></div>
                </div>

                <div className="mt-6">
                    <button className="w-full bg-[#161b22] border border-[#30363d] rounded-lg py-3 flex items-center justify-center gap-2 text-[#e6edf3] font-semibold hover:bg-[#30363d] transition-all">
                        <Github size={18} />
                        Continue with GitHub
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
