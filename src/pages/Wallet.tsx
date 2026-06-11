import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Wallet() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, dbUser, loading: authLoading } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  // Convert wallet values to string with fallbacks
  const totalBalance = (dbUser?.totalBalance || 0).toFixed(2);
  const deposited = (dbUser?.depositBalance || 0).toFixed(2);
  const winning = (dbUser?.winningBalance || 0).toFixed(2);
  const earnings = (dbUser?.earnings || 0); // Assuming integer for earnings/payouts in UI like the image
  const payouts = (dbUser?.payouts || 0);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'wallet_transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingHistory(false);
    }, (err) => {
      console.error(err);
      setLoadingHistory(false);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const checkOrder = async () => {
      const orderId = searchParams.get('verify_order');
      if (orderId && user) {
        setVerifying(true);
        try {
          // Remove the parameter from URL without reloading
          window.history.replaceState({}, '', '/wallet');
          
          const res = await fetch('/api/verify-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId })
          });
          
          const data = await res.json();
          if (data.status === 'success' && data.data?.status === 'Success') {
            toast.success('Payment successful! Coins added to your wallet.');
          } else if (data.data?.status === 'Pending') {
            toast.success('Payment is pending. It will be added once confirmed.');
          } else {
            toast.error('Payment failed or cancelled.');
          }
        } catch (error) {
           console.error("Verification failed:", error);
        } finally {
          setVerifying(false);
        }
      }
    };
    if (!authLoading) {
      checkOrder();
    }
  }, [searchParams, user, authLoading]);

  return (
    <div className="flex flex-col min-h-screen bg-black font-sans pb-20">
      <header className="flex items-center px-4 py-4 bg-black sticky top-0 z-20">
        <div className="flex items-center space-x-3 w-full">
          <button aria-label="Back" className="text-white p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white font-bold text-[20px] tracking-wide">My Wallet</h1>
        </div>
      </header>

      {verifying && (
        <div className="bg-[#170a29] border border-brand-purple/50 m-4 rounded-xl p-4 flex items-center justify-center space-x-2 text-white animate-pulse">
           <div className="w-4 h-4 rounded-full border-2 border-brand-purple border-t-white animate-spin"></div>
           <span className="font-bold">Verifying your payment...</span>
        </div>
      )}

      <div className="px-4 mt-2">
        <div className="bg-[#170a29] rounded-[1.8rem] p-6 pt-7 relative shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="mb-4">
             <div className="text-[#847894] font-black uppercase tracking-wider leading-tight text-[15px] mb-1">TOTAL<br/>BALANCE</div>
             <div className="text-white font-bold text-[19px]">{totalBalance} Coins</div>
          </div>
          
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-3">
               <div className="flex flex-col">
                  <span className="text-[#847894] font-black text-[15px]">Deposited</span>
                  <span className="text-white font-bold text-[19px]">{deposited} Coins</span>
               </div>
               <div className="flex flex-col mt-1">
                  <span className="text-[#847894] font-black text-[15px]">Winning</span>
                  <span className="text-white font-bold text-[19px]">{winning} Coins</span>
               </div>
               <div className="flex flex-col mt-1">
                  <span className="text-[#847894] font-black text-[15px]">Earnings</span>
                  <span className="text-white font-bold text-[19px]">{earnings} Coins</span>
               </div>
               <div className="flex flex-col mt-1">
                  <span className="text-[#847894] font-black uppercase tracking-wider text-[15px]">PAYOUTS</span>
                  <span className="text-white font-bold text-[19px]">{payouts} Coins</span>
               </div>
            </div>
            
            <div className="flex flex-col gap-3 w-[150px] relative top-1">
               <button onClick={() => navigate('/add-coins')} className="w-full bg-[#35108b] rounded-xl text-white font-bold text-[13px] tracking-wide py-3.5 shadow-sm transform transition-all active:scale-95">
                 ADD COINS
               </button>
               <button onClick={() => navigate('/withdraw-coins')} className="w-full bg-[#004ff4] rounded-xl text-white font-bold text-[13px] tracking-wide py-3.5 shadow-sm transform transition-all active:scale-95">
                 WITHDRAW COINS
               </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center pt-2">
          <h2 className="text-white font-black text-[15px] uppercase tracking-widest">WALLET HISTORY</h2>
        </div>
        
        <div className="mt-4 flex flex-col gap-3">
          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-brand-purple border-t-white rounded-full animate-spin"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm">No transactions yet</div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="bg-[#170a29] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'winning' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                       {tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'winning' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                       <div className="text-white font-bold text-sm capitalize">{tx.type}</div>
                       <div className="text-gray-400 text-[10px] mt-0.5">
                         {tx.createdAt?.toDate ? new Date(tx.createdAt.toDate()).toLocaleDateString() : 'Pending'} • {tx.status || 'Completed'}
                       </div>
                    </div>
                 </div>
                 <div className={`font-black tracking-wider ${tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'winning' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'winning' ? '+' : '-'}{tx.amount}
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
