// components/CandyBar.js
import { MAX_DAILY_CANDY } from '../utils/storage';

export default function CandyBar({ daily, total, userName }) {
  const dots = Array.from({ length: MAX_DAILY_CANDY }, (_, i) => i < daily);

  return (
    <div className="card bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">Today's Candies</p>
          <p className="font-display text-3xl text-amber-700">{daily} <span className="text-lg text-amber-500">/ {MAX_DAILY_CANDY}</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">Total Saved</p>
          <p className="font-display text-3xl text-purple-700">{total} 🍬</p>
        </div>
      </div>
      <div className="flex gap-2 justify-center mt-2">
        {dots.map((filled, i) => (
          <div
            key={i}
            className={`candy-dot transition-all duration-500 ${
              filled
                ? 'bg-amber-400 border-amber-600 shadow-md scale-110'
                : 'bg-gray-100 border-gray-300'
            }`}
            style={{ transitionDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
      {daily >= MAX_DAILY_CANDY && (
        <p className="text-center text-xs font-bold text-emerald-600 mt-2 animate-bounce">
          🎉 Full candy jar today! Amazing!
        </p>
      )}
    </div>
  );
}
