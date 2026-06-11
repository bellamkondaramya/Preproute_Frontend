import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function Illustration() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#F3F7FC] p-12 select-none">
      <svg viewBox="0 0 500 400" className="h-full w-full max-w-[450px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background stars / sparks */}
        {/* Left sparkle */}
        <path d="M150 150 L153 158 L161 161 L153 164 L150 172 L147 164 L139 161 L147 158 Z" fill="#94A3B8" />
        <circle cx="130" cy="200" r="2" fill="#94A3B8" />

        {/* Right circle */}
        <circle cx="330" cy="180" r="6" stroke="#94A3B8" strokeWidth="1.5" fill="none" />

        {/* Right sparkle */}
        <path d="M390 200 L392 205 L397 207 L392 209 L390 214 L388 209 L383 207 L388 205 Z" fill="#94A3B8" />

        {/* Desk Legs */}
        <line x1="110" y1="240" x2="110" y2="360" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="184" y1="240" x2="184" y2="360" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="326" y1="240" x2="326" y2="360" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="400" y1="240" x2="400" y2="360" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Desk Surface */}
        <rect x="100" y="238" width="310" height="8" rx="4" fill="#64748B" />

        {/* Laptop */}
        <polygon points="122,238 135,175 205,182 210,238" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="120" y1="238" x2="220" y2="238" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Hourglass Base and Top */}
        {/* Top Plate */}
        <rect x="222" y="100" width="60" height="10" rx="5" fill="#D0E2FF" stroke="#4A72F6" strokeWidth="1.5" />
        <rect x="228" y="94" width="48" height="6" rx="3" fill="#E8F2FF" />

        {/* Bottom Plate */}
        <rect x="222" y="310" width="60" height="10" rx="5" fill="#D0E2FF" stroke="#4A72F6" strokeWidth="1.5" />
        <rect x="228" y="320" width="48" height="6" rx="3" fill="#E8F2FF" />

        {/* Glass Outer Cylinder */}
        <rect x="228" y="110" width="48" height="200" rx="24" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
        <rect x="231" y="110" width="42" height="200" rx="21" stroke="#E2E8F0" strokeWidth="1" fill="none" opacity="0.6" />

        {/* Cute Character inside Hourglass */}
        {/* Body/Head */}
        <rect x="232" y="156" width="40" height="110" rx="20" fill="white" stroke="#1F2937" strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="244" cy="182" r="2.5" fill="#1F2937" />
        <circle cx="260" cy="182" r="2.5" fill="#1F2937" />
        {/* Smile */}
        <path d="M 248,194 Q 252,198 256,194" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Arm Typing */}
        <path d="M 232,198 C 210,198 205,215 212,230" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Hand typing circle */}
        <circle cx="212" cy="230" r="4.5" fill="white" stroke="#1F2937" strokeWidth="1.5" />
        {/* Fingers */}
        <path d="M 215,226 C 218,226 222,228 224,231" stroke="#1F2937" strokeWidth="1" strokeLinecap="round" />
        <path d="M 215,230 C 218,231 222,232 224,234" stroke="#1F2937" strokeWidth="1" strokeLinecap="round" />

        {/* Arm Resting / Waving */}
        <path d="M 272,198 C 285,198 295,208 288,224" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="288" cy="224" r="4.5" fill="white" stroke="#1F2937" strokeWidth="1.5" />

        {/* Hourglass Sand */}
        {/* Top Sand */}
        <path d="M 230,126 Q 252,142 274,126 L 274,111 L 230,111 Z" fill="#D0E2FF" opacity="0.6" />
        {/* Sand stream */}
        <line x1="252" y1="110" x2="252" y2="310" stroke="#D0E2FF" strokeWidth="1.5" strokeDasharray="3 3.5" opacity="0.7" />
        {/* Bottom Sand */}
        <path d="M 230,296 Q 252,280 274,296 L 274,309 L 230,309 Z" fill="#D0E2FF" opacity="0.8" />
      </svg>
    </div>
  );
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left side: Slide illustration */}
      <div className="hidden lg:block bg-[#F3F7FC]"><Illustration /></div>

      {/* Right side: Login form card */}
      <div className="flex items-center justify-center bg-white p-6 sm:p-10 md:p-16">
        <div className="w-full max-w-[480px] rounded-2xl border border-blue-50/80 bg-white px-8 py-10 sm:px-14 sm:py-16 md:px-16 md:py-20 shadow-card">
          <div className="flex justify-start"><Logo /></div>
          
          <div className="mt-8">
            <h1 className="text-[28px] font-bold tracking-tight text-[#0A0923] font-sans">Login</h1>
            <p className="mt-1 text-sm font-medium text-muted">Use your company provided Login credentials</p>
          </div>
          
          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <span className="block text-sm font-semibold text-[#1F2937] mb-2 select-none">User ID</span>
              <input 
                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium outline-none transition duration-200 focus:border-[#4A72F6] focus:ring-4 focus:ring-[#4A72F6]/10 placeholder:text-gray-400 placeholder:font-normal" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter User ID"
                disabled={loading}
                autoComplete="username"
              />
            </div>
            <div>
              <span className="block text-sm font-semibold text-[#1F2937] mb-2 select-none">Password</span>
              <input 
                type="password" 
                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium outline-none transition duration-200 focus:border-[#4A72F6] focus:ring-4 focus:ring-[#4A72F6]/10 placeholder:text-gray-400 placeholder:font-normal" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter Password"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
            
            <div className="flex items-center">
              <button type="button" className="text-sm font-semibold text-[#4A72F6] hover:text-[#3B61E6] transition hover:underline">
                Forgot password?
              </button>
            </div>
            
            {error && (
              <p className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </p>
            )}
            
            <button 
              type="submit"
              disabled={loading} 
              className="w-full rounded-lg bg-[#4A72F6] hover:bg-[#3B61E6] py-3.5 text-sm font-bold text-white transition-all duration-200 hover:shadow-lg hover:shadow-[#4A72F6]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}   