// components/SubmissionCard.js

const statusConfig = {
  pending: { label: 'Pending', emoji: '⏳', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  approved: { label: 'Approved', emoji: '✅', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', emoji: '❌', color: 'bg-red-100 text-red-700 border-red-200' },
};

export default function SubmissionCard({ submission }) {
  const config = statusConfig[submission.status];
  const date = new Date(submission.submittedAt);
  const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="card border-2 border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm">{submission.description}</p>
          <p className="text-xs text-gray-400 mt-1">{dateStr} at {timeStr}</p>
          {submission.candyAmount && (
            <p className="text-emerald-600 font-bold text-sm mt-1">+{submission.candyAmount} 🍬{submission.bonus ? ' ⭐ Bonus!' : ''}</p>
          )}
          {submission.adminNote && (
            <p className="text-red-500 text-xs mt-1 italic">"{submission.adminNote}"</p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full border ${config.color}`}>
          {config.emoji} {config.label}
        </span>
      </div>
    </div>
  );
}
