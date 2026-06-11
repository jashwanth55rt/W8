import React from 'react';
import { 
  Users,
  Copy,
  Share2,
  Gift,
  Coins,
  Ticket,
  Gem,
  CheckCircle2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Earn() {
  const { user } = useAuth();
  
  // Real data to be fetched from database
  const referralStats = {
    totalInvites: 0,
    successfulSignups: 0,
    activePlayers: 0,
    earnings: '₹0'
  };

  const referralCode = `NG-${user?.uid?.substring(0, 6).toUpperCase() || 'FREE123'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join NG ESPORTS',
        text: `Use my referral code ${referralCode} to get free starting bonuses!`,
        url: window.location.origin
      });
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-6 text-white font-sans max-w-[500px] mx-auto w-full pb-20">
      
      {/* Header section */}
      <div className="text-center mb-2">
        <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase drop-shadow-md">
          REFER & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">EARN</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">Invite friends and unlock exclusive rewards</p>
      </div>

      {/* Referral Code Card */}
      <div className="bg-gradient-to-br from-[#1C093B] to-[#120524] rounded-2xl p-5 border border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <span className="text-[11px] font-bold text-blue-400 tracking-wider uppercase mb-2 block">Your Referral Code</span>
        <div className="bg-black/50 border border-white/10 rounded-xl py-3 px-4 flex items-center justify-between mb-4">
          <span className="font-mono font-bold text-xl tracking-widest text-white">{referralCode}</span>
          <button onClick={copyToClipboard} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Copy className="w-5 h-5 text-gray-300" />
          </button>
        </div>
        <button onClick={shareReferral} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
          <Share2 className="w-5 h-5" />
          SHARE WITH FRIENDS
        </button>
      </div>

      {/* Rewards Types */}
      <div>
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
          <Gift className="w-4 h-4 text-purple-400" /> Referral Rewards
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1C093B]/40 border border-white/5 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
               <span className="text-green-500 font-black text-lg">₹</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400 font-medium leading-tight mb-0.5">Cash Bonus</span>
              <span className="text-[13px] font-bold text-white">₹5–₹50 / user</span>
            </div>
          </div>
          <div className="bg-[#1C093B]/40 border border-white/5 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
               <Coins className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400 font-medium leading-tight mb-0.5">Wallet Coins</span>
              <span className="text-[13px] font-bold text-white">Bonus Coins</span>
            </div>
          </div>
          <div className="bg-[#1C093B]/40 border border-white/5 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
               <Ticket className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400 font-medium leading-tight mb-0.5">Entry Tickets</span>
              <span className="text-[13px] font-bold text-white">Tournaments</span>
            </div>
          </div>
          <div className="bg-[#1C093B]/40 border border-white/5 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
               <Gem className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400 font-medium leading-tight mb-0.5">Diamonds</span>
              <span className="text-[13px] font-bold text-white">Game Credits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Tracking */}
      <div>
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" /> Referral Statistics
        </h3>
        <div className="bg-[#1A0B2E] rounded-xl border border-white/10 overflow-hidden divide-y divide-white/5">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[14px] text-gray-200 font-medium">Total Invites</span>
            </div>
            <span className="text-lg font-black text-white">{referralStats.totalInvites}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-gray-200 font-medium leading-tight">Successful Signups</span>
              </div>
            </div>
            <span className="text-lg font-black text-white">{referralStats.successfulSignups}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-gray-200 font-medium leading-tight">Active Players</span>
                <span className="text-[10px] text-gray-500">Must play 1 match</span>
              </div>
            </div>
            <span className="text-lg font-black text-white">{referralStats.activePlayers}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                <span className="text-white font-bold">₹</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] text-white font-bold leading-tight">Total Earnings</span>
                <span className="text-[11px] text-blue-300">From referrals</span>
              </div>
            </div>
            <span className="text-2xl font-black text-blue-400">{referralStats.earnings}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
