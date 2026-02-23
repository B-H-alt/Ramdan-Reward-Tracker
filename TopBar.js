// components/TopBar.js
import { useAuth } from '../utils/auth';
import { useRouter } from 'next/router';

const userEmojis = { musa: '🌙', rufa: '⭐', bilal: '🔑' };
const userColors = { musa: 'bg-sky-500', rufa: 'bg-rose-500', bilal: 'bg-purple-600' };

export default function TopBar({ title, showBack = false }) {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
            >
              ←
            </button>
          )}
          <div>
            <h1 className="font-display text-lg text-gray-800 leading-none">{title}</h1>
            {currentUser && (
              <p className="text-xs text-gray-400 font-medium capitalize mt-0.5">
                {userEmojis[currentUser]} {currentUser}
              </p>
            )}
          </div>
        </div>
        {currentUser && (
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all active:scale-90"
          >
            Switch
          </button>
        )}
      </div>
    </div>
  );
}
