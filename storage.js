// utils/storage.js
// All localStorage operations for the Ramadan Tracker

export const USERS = ['musa', 'rufa', 'bilal'];

export const GOOD_DEEDS = [
  { id: 'table', label: 'Help set the table', candy: 1, category: 'home' },
  { id: 'toys', label: 'Clean up toys', candy: 1, category: 'home' },
  { id: 'quran', label: 'Read Qur\'an (per page)', candy: 1, category: 'ibadah', allowMultiple: true },
  { id: 'kitchen', label: 'Help in kitchen', candy: 1, category: 'home' },
  { id: 'salah', label: 'Pray salah on time', candy: 1, category: 'ibadah' },
  { id: 'sibling', label: 'Help sibling', candy: 1, category: 'kindness', cooldownDays: 2 },
  { id: 'unasked', label: 'Do something without being asked', candy: 3, category: 'kindness' },
  { id: 'bighelp', label: 'Big help (clean room, etc.)', candy: 3, category: 'home' },
];

export const REWARDS = [
  { id: 'icecream', label: 'Ice Cream Scoop', candy: 15, category: 'small', emoji: '🍦' },
  { id: 'waffle', label: 'Waffle', candy: 15, category: 'small', emoji: '🧇' },
  { id: 'cookie', label: 'Cookie', candy: 15, category: 'small', emoji: '🍪' },
  { id: 'popcorn', label: 'Popcorn Bowl', candy: 20, category: 'small', emoji: '🍿' },
  { id: 'smoothie', label: 'Drink or Smoothie', candy: 20, category: 'small', emoji: '🥤' },
  { id: 'fries', label: 'Fries', candy: 20, category: 'medium', emoji: '🍟' },
  { id: 'dinner', label: 'Pick dinner one day after Ramadan', candy: 30, category: 'big', emoji: '🍽️' },
  { id: 'eiddessert', label: 'Choose Eid dessert', candy: 40, category: 'big', emoji: '🎂' },
  { id: 'eidactivity', label: 'Pick family activity on Eid weekend', candy: 50, category: 'big', emoji: '🎉' },
];

export const MAX_DAILY_CANDY = 5;

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getStorage(key, defaultVal = null) {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStorage(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── USER DATA ───────────────────────────────────────────────────────────────

export function getUserData(userId) {
  const defaults = {
    totalCandies: 0,
    dailyData: {},
    submissions: [],
    tradeHistory: [],
  };
  const data = getStorage(`user_${userId}`, defaults);
  // Ensure all fields exist
  return { ...defaults, ...data };
}

export function saveUserData(userId, data) {
  setStorage(`user_${userId}`, data);
}

// ─── DAILY DATA ──────────────────────────────────────────────────────────────

export function getDailyData(userId) {
  const user = getUserData(userId);
  const today = getTodayKey();
  const daily = user.dailyData[today] || {
    candies: 0,
    deeds: [],
    locked: false,
    parentApproved: false,
  };
  return { today, daily };
}

export function saveDailyData(userId, dailyEntry) {
  const user = getUserData(userId);
  const today = getTodayKey();
  user.dailyData[today] = dailyEntry;
  saveUserData(userId, user);
}

// ─── CANDY OPERATIONS ────────────────────────────────────────────────────────

export function getTodayCandies(userId) {
  const { daily } = getDailyData(userId);
  return daily.candies;
}

export function getTotalCandies(userId) {
  const user = getUserData(userId);
  return user.totalCandies;
}

export function addCandies(userId, amount) {
  const { today, daily } = getDailyData(userId);
  const newDailyAmt = Math.min(daily.candies + amount, MAX_DAILY_CANDY);
  const actualAdded = newDailyAmt - daily.candies;
  daily.candies = newDailyAmt;
  
  const user = getUserData(userId);
  user.dailyData[today] = daily;
  user.totalCandies = (user.totalCandies || 0) + actualAdded;
  saveUserData(userId, user);
  return actualAdded;
}

export function deductCandies(userId, amount) {
  const user = getUserData(userId);
  const { today, daily } = getDailyData(userId);
  
  const deductFromDaily = Math.min(daily.candies, amount);
  daily.candies = Math.max(0, daily.candies - amount);
  user.dailyData[today] = daily;
  user.totalCandies = Math.max(0, (user.totalCandies || 0) - amount);
  saveUserData(userId, user);
}

export function addCandiesAdmin(userId, amount) {
  const user = getUserData(userId);
  const { today, daily } = getDailyData(userId);
  daily.candies = Math.min(MAX_DAILY_CANDY, daily.candies + amount);
  user.dailyData[today] = daily;
  user.totalCandies = (user.totalCandies || 0) + amount;
  saveUserData(userId, user);
}

// ─── DEED TRACKING ───────────────────────────────────────────────────────────

export function getDeedsForToday(userId) {
  const { daily } = getDailyData(userId);
  return daily.deeds || [];
}

export function canDoDeeds(userId) {
  const { daily } = getDailyData(userId);
  return !daily.locked && daily.candies < MAX_DAILY_CANDY;
}

export function isDeedDoneToday(userId, deedId) {
  const deeds = getDeedsForToday(userId);
  const deed = GOOD_DEEDS.find(d => d.id === deedId);
  if (deed?.allowMultiple) return false; // Qur'an pages can be logged multiple times
  return deeds.some(d => d.id === deedId);
}

export function isSiblingOnCooldown(userId) {
  const user = getUserData(userId);
  const today = getTodayKey();
  const todayDate = new Date(today);
  
  for (const [dateKey, dayData] of Object.entries(user.dailyData || {})) {
    if (dateKey === today) continue;
    const date = new Date(dateKey);
    const diffDays = (todayDate - date) / (1000 * 60 * 60 * 24);
    if (diffDays <= 2 && (dayData.deeds || []).some(d => d.id === 'sibling')) {
      return true;
    }
  }
  return false;
}

export function logDeed(userId, deedId) {
  const deed = GOOD_DEEDS.find(d => d.id === deedId);
  if (!deed) return { success: false, message: 'Deed not found' };

  const { today, daily } = getDailyData(userId);
  
  if (daily.locked) return { success: false, message: 'Today is locked by admin' };
  if (daily.candies >= MAX_DAILY_CANDY) return { success: false, message: 'Max candies reached for today!' };
  
  if (!deed.allowMultiple && isDeedDoneToday(userId, deedId)) {
    return { success: false, message: 'Already done this deed today!' };
  }
  
  if (deedId === 'sibling' && isSiblingOnCooldown(userId)) {
    return { success: false, message: 'Help sibling can only be done once every 2 days!' };
  }

  const prevCandies = daily.candies;
  const newCandies = Math.min(MAX_DAILY_CANDY, prevCandies + deed.candy);
  const candiesAdded = newCandies - prevCandies;

  daily.deeds = [...(daily.deeds || []), { id: deedId, time: new Date().toISOString() }];
  daily.candies = newCandies;

  const user = getUserData(userId);
  user.dailyData[today] = daily;
  user.totalCandies = (user.totalCandies || 0) + candiesAdded;
  saveUserData(userId, user);
  
  return { success: true, candiesAdded, message: `+${candiesAdded} 🍬` };
}

// ─── LOCK / PENALTIES ────────────────────────────────────────────────────────

export function lockDay(userId) {
  const { today, daily } = getDailyData(userId);
  daily.locked = true;
  const user = getUserData(userId);
  user.dailyData[today] = daily;
  saveUserData(userId, user);
}

export function resetDay(userId) {
  const { today, daily } = getDailyData(userId);
  // Remove today's candies from total
  const user = getUserData(userId);
  user.totalCandies = Math.max(0, (user.totalCandies || 0) - daily.candies);
  user.dailyData[today] = { candies: 0, deeds: [], locked: false, parentApproved: false };
  saveUserData(userId, user);
}

export function penaltyArgue(userId) {
  deductCandies(userId, 1);
}

export function setParentApproval(userId, approved) {
  const { today, daily } = getDailyData(userId);
  daily.parentApproved = approved;
  const user = getUserData(userId);
  user.dailyData[today] = daily;
  saveUserData(userId, user);
}

// ─── SUBMISSIONS ─────────────────────────────────────────────────────────────

export function submitCustomDeed(userId, description) {
  const user = getUserData(userId);
  const submission = {
    id: Date.now().toString(),
    userId,
    description,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    candyAmount: null,
    adminNote: null,
  };
  user.submissions = [...(user.submissions || []), submission];
  saveUserData(userId, user);
  return submission;
}

export function getSubmissions(userId) {
  const user = getUserData(userId);
  return (user.submissions || []).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export function getAllSubmissions() {
  const all = [];
  for (const userId of ['musa', 'rufa']) {
    const user = getUserData(userId);
    (user.submissions || []).forEach(s => all.push({ ...s, userId }));
  }
  return all.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export function approveSubmission(userId, submissionId, candyAmount, bonus = false) {
  const user = getUserData(userId);
  const sub = user.submissions.find(s => s.id === submissionId);
  if (!sub) return;
  sub.status = 'approved';
  sub.candyAmount = candyAmount;
  sub.bonus = bonus;
  sub.resolvedAt = new Date().toISOString();
  saveUserData(userId, user);
  // Add candies
  addCandiesAdmin(userId, candyAmount);
}

export function rejectSubmission(userId, submissionId, note = '') {
  const user = getUserData(userId);
  const sub = user.submissions.find(s => s.id === submissionId);
  if (!sub) return;
  sub.status = 'rejected';
  sub.adminNote = note;
  sub.resolvedAt = new Date().toISOString();
  saveUserData(userId, user);
}

// ─── TRADE-IN ────────────────────────────────────────────────────────────────

export function getTradeHistory(userId) {
  const user = getUserData(userId);
  return (user.tradeHistory || []).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function hasTradeToday(userId) {
  const user = getUserData(userId);
  const today = getTodayKey();
  return (user.tradeHistory || []).some(t => t.date.startsWith(today));
}

export function tradeReward(userId, rewardId) {
  const reward = REWARDS.find(r => r.id === rewardId);
  if (!reward) return { success: false, message: 'Reward not found' };
  
  const total = getTotalCandies(userId);
  if (total < reward.candy) return { success: false, message: 'Not enough candies!' };
  if (hasTradeToday(userId)) return { success: false, message: 'Only 1 trade per day!' };
  
  const user = getUserData(userId);
  user.totalCandies = total - reward.candy;
  user.tradeHistory = [...(user.tradeHistory || []), {
    rewardId,
    rewardLabel: reward.label,
    emoji: reward.emoji,
    candy: reward.candy,
    date: new Date().toISOString(),
  }];
  saveUserData(userId, user);
  return { success: true, message: `Traded for ${reward.label}!` };
}

// ─── PIN ─────────────────────────────────────────────────────────────────────

export function getPinHash() {
  return getStorage('admin_pin_hash', null);
}

export function setPinHash(hash) {
  setStorage('admin_pin_hash', hash);
}

export function hasPinSet() {
  return getPinHash() !== null;
}

// Simple hash (not cryptographic but adequate for local toy app)
export function hashPin(pin) {
  let hash = 0;
  const str = `ramadan_${pin}_tracker`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export function verifyPin(pin) {
  const stored = getPinHash();
  if (!stored) return false;
  return hashPin(pin) === stored;
}

export function changePin(newPin) {
  setPinHash(hashPin(newPin));
}
