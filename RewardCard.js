// components/RewardCard.js

const categoryStyles = {
  small: { label: 'Small', color: 'from-sky-400 to-blue-500', shadow: 'shadow-blue-200' },
  medium: { label: 'Medium', color: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-200' },
  big: { label: 'Big', color: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-200' },
};

export default function RewardCard({ reward, totalCandies, onTrade, alreadyTradedToday }) {
  const canAfford = totalCandies >= reward.candy;
  const styles = categoryStyles[reward.category];
  const disabled = !canAfford || alreadyTradedToday;

  return (
    <div className={`card border-2 ${canAfford ? 'border-amber-200' : 'border-gray-200'} transition-all`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${styles.color} flex items-center justify-center text-2xl shadow-lg ${styles.shadow} shrink-0`}>
          {reward.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${styles.color} text-white`}>
              {styles.label}
            </span>
          </div>
          <p className="font-bold text-gray-800 text-sm leading-tight">{reward.label}</p>
          <p className="text-amber-600 font-black text-sm mt-0.5">{reward.candy} 🍬</p>
        </div>
        <button
          onClick={() => onTrade(reward.id)}
          disabled={disabled}
          className={`shrink-0 btn-primary text-sm px-4 py-2
            ${disabled 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
              : `bg-gradient-to-r ${styles.color} text-white shadow-lg hover:scale-105 active:scale-95`
            }`}
        >
          {alreadyTradedToday ? '1/day' : canAfford ? 'Trade!' : `Need ${reward.candy - totalCandies} more`}
        </button>
      </div>
    </div>
  );
}
