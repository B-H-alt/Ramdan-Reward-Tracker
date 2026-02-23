// components/DeedCard.js
import { useState } from 'react';

const categoryColors = {
  home: { bg: 'from-blue-50 to-sky-50', border: 'border-sky-200', icon: '🏠', badge: 'bg-sky-100 text-sky-700' },
  ibadah: { bg: 'from-emerald-50 to-green-50', border: 'border-emerald-200', icon: '🕌', badge: 'bg-emerald-100 text-emerald-700' },
  kindness: { bg: 'from-rose-50 to-pink-50', border: 'border-rose-200', icon: '💝', badge: 'bg-rose-100 text-rose-700' },
};

export default function DeedCard({ deed, done, disabled, onLog, cooldown }) {
  const [pressed, setPressed] = useState(false);
  const colors = categoryColors[deed.category] || categoryColors.home;

  const handleClick = async () => {
    if (done || disabled || cooldown) return;
    setPressed(true);
    await onLog(deed.id);
    setTimeout(() => setPressed(false), 400);
  };

  const isUnavailable = (done && !deed.allowMultiple) || disabled || cooldown;

  return (
    <button
      onClick={handleClick}
      disabled={isUnavailable}
      className={`
        w-full text-left card bg-gradient-to-br ${colors.bg} border-2 ${colors.border}
        transition-all duration-200
        ${isUnavailable ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg active:scale-95 cursor-pointer'}
        ${pressed ? 'animate-pop' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{colors.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm leading-tight">{deed.label}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
              +{deed.candy} 🍬
            </span>
            {deed.allowMultiple && (
              <span className="text-xs text-gray-400 font-medium">repeatable</span>
            )}
            {cooldown && (
              <span className="text-xs text-orange-500 font-bold">⏳ cooldown</span>
            )}
          </div>
        </div>
        <div className="shrink-0">
          {done && !deed.allowMultiple ? (
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
              <span className="text-white text-sm">✓</span>
            </div>
          ) : (
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
              ${isUnavailable ? 'border-gray-300 bg-gray-100' : `border-current ${colors.badge} shadow-sm`}`}>
              <span className="text-sm">+</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
