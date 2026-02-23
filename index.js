// pages/admin/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/auth';
import {
  getAllSubmissions, approveSubmission, rejectSubmission,
  getUserData, getTodayCandies, getTotalCandies,
  lockDay, resetDay, deductCandies, penaltyArgue, addCandiesAdmin,
  getTradeHistory,
  hasPinSet, hashPin, setPinHash, verifyPin,
} from '../../utils/storage';
import TopBar from '../../components/TopBar';
import { useToast } from '../../components/Toast';
import PinModal from '../../components/PinModal';

const CHILD_USERS = ['musa', 'rufa'];
const userEmojis = { musa: '🌙', rufa: '⭐' };

export default function AdminPage() {
  const { currentUser, isAdminUnlocked, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [submissions, setSubmissions] = useState([]);
  const [childData, setChildData] = useState({});
  const [approvalInput, setApprovalInput] = useState({});
  const [rejectInput, setRejectInput] = useState({});
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newPinStep, setNewPinStep] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    if (!currentUser || currentUser !== 'bilal') {
      router.push('/');
      return;
    }
    refresh();
  }, [currentUser]);

  const refresh = () => {
    setSubmissions(getAllSubmissions());
    const data = {};
    CHILD_USERS.forEach(uid => {
      data[uid] = {
        daily: getTodayCandies(uid),
        total: getTotalCandies(uid),
        trades: getTradeHistory(uid),
      };
    });
    setChildData(data);
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const resolvedSubmissions = submissions.filter(s => s.status !== 'pending');

  const handleApprove = (sub, bonus = false) => {
    const amount = parseInt(approvalInput[sub.id] || '1', 10);
    if (!amount || amount < 1) {
      showToast('Enter a candy amount!', 'error');
      return;
    }
    approveSubmission(sub.userId, sub.id, amount, bonus);
    setApprovalInput(prev => { const n = {...prev}; delete n[sub.id]; return n; });
    showToast(`✅ Approved! +${amount} 🍬 for ${sub.userId}`, 'success');
    refresh();
  };

  const handleReject = (sub) => {
    const note = rejectInput[sub.id] || '';
    rejectSubmission(sub.userId, sub.id, note);
    setRejectInput(prev => { const n = {...prev}; delete n[sub.id]; return n; });
    showToast(`❌ Rejected submission from ${sub.userId}`, 'info');
    refresh();
  };

  const handleDeduct = (userId, amount) => {
    deductCandies(userId, amount);
    showToast(`🍬 Deducted ${amount} from ${userId}`, 'info');
    refresh();
  };

  const handleLock = (userId) => {
    lockDay(userId);
    showToast(`🔒 ${userId}'s day is locked`, 'info');
    refresh();
  };

  const handleReset = (userId) => {
    if (!confirm(`Reset ${userId}'s day? This removes today's candies.`)) return;
    resetDay(userId);
    showToast(`🔄 ${userId}'s day has been reset`, 'info');
    refresh();
  };

  const handlePenalty = (userId) => {
    penaltyArgue(userId);
    showToast(`⚠️ -1 candy penalty for ${userId}`, 'info');
    refresh();
  };

  const handleChangePinSuccess = () => {
    setShowChangePinModal(false);
    showToast('🔐 PIN changed successfully!', 'success');
  };

  const TABS = [
    { label: '📬 Pending', count: pendingSubmissions.length },
    { label: '👦 Children', count: null },
    { label: '📋 History', count: null },
    { label: '⚙️ Settings', count: null },
  ];

  return (
    <div className="min-h-screen bg-pattern pb-safe">
      <ToastContainer />
      <TopBar title="Admin Panel" />

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="text-center">
          <p className="font-display text-3xl">🔑 Bilal</p>
          <p className="text-gray-400 text-sm font-medium">Admin Dashboard</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-2xl">
          {TABS.map((t, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all relative ${
                tab === i
                  ? 'bg-gradient-to-r from-purple-600 to-violet-700 text-white shadow-md'
                  : 'text-gray-500'
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB: Pending Submissions */}
        {tab === 0 && (
          <div className="space-y-4">
            {pendingSubmissions.length === 0 ? (
              <div className="card text-center py-10">
                <p className="text-4xl mb-2">📭</p>
                <p className="text-gray-400 font-medium">No pending submissions!</p>
              </div>
            ) : pendingSubmissions.map(sub => (
              <div key={sub.id} className="card border-2 border-amber-200 bg-amber-50 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{userEmojis[sub.userId]}</span>
                      <span className="font-bold text-gray-700 capitalize">{sub.userId}</span>
                      <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">Pending</span>
                    </div>
                    <p className="font-bold text-gray-800">{sub.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(sub.submittedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Candy amount input */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={approvalInput[sub.id] || ''}
                    onChange={e => setApprovalInput(prev => ({...prev, [sub.id]: e.target.value}))}
                    placeholder="🍬 amount"
                    className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleApprove(sub, false)}
                    className="btn-primary bg-emerald-500 text-center text-xs py-2 px-2"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleApprove(sub, true)}
                    className="btn-primary bg-amber-500 text-center text-xs py-2 px-2"
                  >
                    ⭐ + Bonus
                  </button>
                  <button
                    onClick={() => handleReject(sub)}
                    className="btn-primary bg-red-500 text-center text-xs py-2 px-2"
                  >
                    ❌ Reject
                  </button>
                </div>

                <input
                  type="text"
                  value={rejectInput[sub.id] || ''}
                  onChange={e => setRejectInput(prev => ({...prev, [sub.id]: e.target.value}))}
                  placeholder="Rejection note (optional)..."
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-300"
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB: Children overview */}
        {tab === 1 && (
          <div className="space-y-4">
            {CHILD_USERS.map(uid => {
              const data = childData[uid] || { daily: 0, total: 0 };
              return (
                <div key={uid} className="card space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{userEmojis[uid]}</span>
                      <div>
                        <p className="font-display text-2xl capitalize">{uid}</p>
                        <p className="text-sm text-gray-500">
                          Today: <strong className="text-amber-600">{data.daily}/5 🍬</strong>
                          {' · '}Total: <strong className="text-purple-600">{data.total} 🍬</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDeduct(uid, 1)}
                      className="btn-primary bg-orange-400 text-center text-sm py-2"
                    >
                      -1 Candy
                    </button>
                    <button
                      onClick={() => handlePenalty(uid)}
                      className="btn-primary bg-red-400 text-center text-sm py-2"
                    >
                      ⚠️ Argue Penalty
                    </button>
                    <button
                      onClick={() => handleLock(uid)}
                      className="btn-primary bg-gray-500 text-center text-sm py-2"
                    >
                      🔒 Lock Day
                    </button>
                    <button
                      onClick={() => handleReset(uid)}
                      className="btn-primary bg-gray-700 text-center text-sm py-2"
                    >
                      🔄 Reset Day
                    </button>
                  </div>

                  {/* Add candy manually */}
                  <div className="flex gap-2 items-center">
                    <p className="text-xs text-gray-500 font-bold shrink-0">Add candy:</p>
                    {[1, 2, 3].map(n => (
                      <button
                        key={n}
                        onClick={() => { addCandiesAdmin(uid, n); showToast(`+${n} 🍬 added for ${uid}`, 'success'); refresh(); }}
                        className="flex-1 py-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-sm active:scale-90 transition-transform"
                      >
                        +{n}
                      </button>
                    ))}
                  </div>

                  {/* Trade history for this user */}
                  {(data.trades || []).length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Recent Trades</p>
                      <div className="space-y-1">
                        {(data.trades || []).slice(0, 3).map((t, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-xl px-3 py-2">
                            <span>{t.emoji}</span>
                            <span className="flex-1">{t.rewardLabel}</span>
                            <span className="text-amber-600 font-bold">-{t.candy}🍬</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: History */}
        {tab === 2 && (
          <div className="space-y-3">
            <h3 className="font-display text-xl text-gray-700">All Submissions</h3>
            {resolvedSubmissions.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-gray-400 font-medium">No resolved submissions yet</p>
              </div>
            ) : resolvedSubmissions.map(sub => (
              <div key={sub.id} className={`card border-2 ${sub.status === 'approved' ? 'border-emerald-100 bg-emerald-50' : 'border-red-100 bg-red-50'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{userEmojis[sub.userId]}</span>
                      <span className="font-bold text-sm capitalize">{sub.userId}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sub.status === 'approved' ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'}`}>
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{sub.description}</p>
                    {sub.candyAmount && <p className="text-emerald-600 text-sm font-bold mt-1">+{sub.candyAmount} 🍬{sub.bonus ? ' ⭐' : ''}</p>}
                    {sub.adminNote && <p className="text-red-500 text-xs mt-1 italic">"{sub.adminNote}"</p>}
                  </div>
                  <p className="text-xs text-gray-400 shrink-0 text-right">
                    {new Date(sub.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: Settings */}
        {tab === 3 && (
          <div className="space-y-4">
            <div className="card space-y-4">
              <h3 className="font-display text-xl text-gray-800">Admin Settings</h3>
              
              <button
                onClick={() => setShowChangePinModal(true)}
                className="btn-primary bg-gradient-to-r from-purple-600 to-violet-700 w-full text-center"
              >
                🔐 Change PIN
              </button>

              <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-500 space-y-2">
                <p className="font-bold text-gray-700">📋 Rules Reminder</p>
                <p>• Max 5 candies per day per child</p>
                <p>• Help sibling: 1 per 2 days cooldown</p>
                <p>• No duplicate deeds (except Qur'an pages)</p>
                <p>• Only 1 store trade per day</p>
                <p>• Food rewards after Iftar only</p>
                <p>• Arguing = -1 candy penalty</p>
                <p>• Lying = lock the day</p>
              </div>
            </div>

            <button
              onClick={() => { logout(); router.push('/'); }}
              className="btn-primary bg-gray-200 text-gray-600 w-full text-center"
            >
              👋 Switch User
            </button>
          </div>
        )}

        <div className="h-6" />
      </div>

      {showChangePinModal && (
        <PinModal
          isSetup={true}
          onSuccess={handleChangePinSuccess}
          onCancel={() => setShowChangePinModal(false)}
        />
      )}
    </div>
  );
}
