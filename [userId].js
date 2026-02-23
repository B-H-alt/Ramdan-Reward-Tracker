// pages/user/[userId].js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/auth';
import {
  GOOD_DEEDS, REWARDS,
  getUserData, getDailyData, getTodayCandies, getTotalCandies,
  logDeed, isDeedDoneToday, isSiblingOnCooldown, getDeedsForToday,
  submitCustomDeed, getSubmissions,
  tradeReward, hasTradeToday, getTradeHistory,
} from '../../utils/storage';
import TopBar from '../../components/TopBar';
import CandyBar from '../../components/CandyBar';
import DeedCard from '../../components/DeedCard';
import RewardCard from '../../components/RewardCard';
import SubmissionCard from '../../components/SubmissionCard';
import { useToast } from '../../components/Toast';

const TABS = ['Deeds', 'Store', 'My Deeds', 'History'];

const userConfig = {
  musa: { emoji: '🌙', color: 'text-sky-600', gradient: 'from-sky-500 to-blue-600' },
  rufa: { emoji: '⭐', color: 'text-rose-600', gradient: 'from-rose-500 to-pink-600' },
};

export default function UserPage() {
  const router = useRouter();
  const { userId } = router.query;
  const { currentUser, logout } = useAuth();
  const [tab, setTab] = useState(0);
  const [dailyCandies, setDailyCandies] = useState(0);
  const [totalCandies, setTotalCandies] = useState(0);
  const [todayDeeds, setTodayDeeds] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [customDeed, setCustomDeed] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [siblingCooldown, setSiblingCooldown] = useState(false);
  const [tradedToday, setTradedToday] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const refresh = useCallback(() => {
    if (!userId) return;
    setDailyCandies(getTodayCandies(userId));
    setTotalCandies(getTotalCandies(userId));
    setTodayDeeds(getDeedsForToday(userId));
    setSubmissions(getSubmissions(userId));
    setTradeHistory(getTradeHistory(userId));
    setSiblingCooldown(isSiblingOnCooldown(userId));
    setTradedToday(hasTradeToday(userId));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    // Auth guard
    if (currentUser !== userId) {
      router.push('/');
      return;
    }
    refresh();
  }, [userId, currentUser, refresh]);

  const handleLogDeed = async (deedId) => {
    const result = logDeed(userId, deedId);
    if (result.success) {
      showToast(result.message + ' Deed logged!', 'success');
    } else {
      showToast(result.message, 'error');
    }
    refresh();
  };

  const handleTrade = (rewardId) => {
    const result = tradeReward(userId, rewardId);
    if (result.success) {
      showToast('🎉 ' + result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
    refresh();
  };

  const handleSubmitCustom = () => {
    if (!customDeed.trim()) return;
    submitCustomDeed(userId, customDeed.trim());
    setCustomDeed('');
    setSubmitting(false);
    showToast('📬 Sent to admin for approval!', 'info');
    refresh();
  };

  const config = userConfig[userId] || userConfig.musa;

  const isDeedDone = (deedId) => {
    const deed = GOOD_DEEDS.find(d => d.id === deedId);
    if (deed?.allowMultiple) return false;
    return todayDeeds.some(d => d.id === deedId);
  };

  const maxCandiesReached = dailyCandies >= 5;

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-pattern pb-safe">
      <ToastContainer />
      <TopBar title="Good Deeds Tracker" />

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* User greeting */}
        <div className="text-center py-2">
          <p className="font-display text-4xl capitalize">
            {config.emoji} {userId}
          </p>
          <p className="text-gray-400 text-sm font-medium mt-1">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Candy Bar */}
        <CandyBar daily={dailyCandies} total={totalCandies} userName={userId} />

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`tab-btn text-xs font-bold transition-all ${
                tab === i
                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-md`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* TAB: Deeds */}
        {tab === 0 && (
          <div className="space-y-3">
            {maxCandiesReached && (
              <div className="card bg-emerald-50 border-emerald-200 text-center py-4">
                <p className="text-2xl mb-1">🎉</p>
                <p className="font-bold text-emerald-700">You've earned all 5 candies today!</p>
                <p className="text-emerald-500 text-sm">Amazing work! Come back tomorrow.</p>
              </div>
            )}
            {GOOD_DEEDS.map(deed => (
              <DeedCard
                key={deed.id}
                deed={deed}
                done={isDeedDone(deed.id)}
                disabled={maxCandiesReached}
                cooldown={deed.id === 'sibling' && siblingCooldown}
                onLog={handleLogDeed}
              />
            ))}

            {/* Custom deed submission */}
            <div className="card border-2 border-dashed border-purple-200 bg-purple-50">
              <p className="font-bold text-purple-700 mb-2 text-sm">🌟 Did something else amazing?</p>
              {!submitting ? (
                <button
                  onClick={() => setSubmitting(true)}
                  className="btn-primary bg-gradient-to-r from-purple-500 to-violet-600 w-full text-center text-sm py-3"
                >
                  Submit Other Good Deed
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={customDeed}
                    onChange={e => setCustomDeed(e.target.value)}
                    placeholder="Describe what you did..."
                    className="w-full border-2 border-purple-200 rounded-2xl p-3 text-sm resize-none font-medium focus:outline-none focus:border-purple-400"
                    rows={3}
                    maxLength={200}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitCustom}
                      disabled={!customDeed.trim()}
                      className="flex-1 btn-primary bg-gradient-to-r from-purple-500 to-violet-600 text-center text-sm py-3 disabled:opacity-40"
                    >
                      Send to Admin 📬
                    </button>
                    <button
                      onClick={() => { setSubmitting(false); setCustomDeed(''); }}
                      className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-500 font-bold text-sm active:scale-90"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Store */}
        {tab === 1 && (
          <div className="space-y-3">
            <div className="card bg-amber-50 border-amber-100 text-center">
              <p className="font-display text-3xl text-amber-700">{totalCandies} 🍬</p>
              <p className="text-amber-500 text-xs font-bold mt-1">Available to spend</p>
            </div>

            {tradedToday && (
              <div className="card bg-orange-50 border-orange-200 text-center py-3">
                <p className="text-orange-600 font-bold text-sm">⏰ You've already traded today! Come back tomorrow.</p>
              </div>
            )}

            <div className="card bg-sky-50 border-sky-100 text-xs text-sky-700 font-medium">
              <p className="font-bold text-sm mb-1">💡 Candy Conversion</p>
              <p>• 1 packaged candy = 3 🍬</p>
              <p>• 2 Smarties = 1 🍬</p>
              <p>• Food rewards after Iftar only 🌙</p>
            </div>

            {['small', 'medium', 'big'].map(cat => {
              const catRewards = REWARDS.filter(r => r.category === cat);
              const catLabels = { small: '🍦 Small Rewards', medium: '🍟 Medium Rewards', big: '🎉 Big Rewards' };
              return (
                <div key={cat}>
                  <h3 className="font-display text-lg text-gray-700 mb-2">{catLabels[cat]}</h3>
                  <div className="space-y-2">
                    {catRewards.map(reward => (
                      <RewardCard
                        key={reward.id}
                        reward={reward}
                        totalCandies={totalCandies}
                        onTrade={handleTrade}
                        alreadyTradedToday={tradedToday}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: My Deeds (submissions) */}
        {tab === 2 && (
          <div className="space-y-3">
            <div className="card bg-purple-50 border-purple-100 text-sm text-purple-700 font-medium">
              Submit a custom good deed from the Deeds tab. Admin will review and approve with candies!
            </div>
            {submissions.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-4xl mb-2">📭</p>
                <p className="text-gray-400 font-medium">No submissions yet</p>
              </div>
            ) : (
              submissions.map(sub => (
                <SubmissionCard key={sub.id} submission={sub} />
              ))
            )}
          </div>
        )}

        {/* TAB: History */}
        {tab === 3 && (
          <div className="space-y-3">
            <h3 className="font-display text-xl text-gray-700">Trade History</h3>
            {tradeHistory.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-4xl mb-2">🏪</p>
                <p className="text-gray-400 font-medium">No trades yet — start earning!</p>
              </div>
            ) : (
              tradeHistory.map((trade, i) => (
                <div key={i} className="card border-2 border-amber-100 flex items-center gap-3">
                  <span className="text-3xl">{trade.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{trade.rewardLabel}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(trade.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="text-amber-600 font-black text-sm">-{trade.candy} 🍬</span>
                </div>
              ))
            )}
          </div>
        )}

        <div className="h-6" />
      </div>
    </div>
  );
}
