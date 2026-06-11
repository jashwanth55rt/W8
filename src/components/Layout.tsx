import { Outlet, Link, useLocation } from "react-router-dom";
import { Gamepad2, User as UserIcon, Globe, Headphones, Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/utils";
import { toast } from 'react-hot-toast';

export default function Layout() {
  const { pathname } = useLocation();
  const { dbUser } = useAuth();

  const showComingSoon = () => {
    toast('Coming Soon!', {
      icon: '🚧',
    });
  };

  const links = [
    { name: "Earn", href: "/earn", icon: null },
    { name: "Play", href: "/", icon: Gamepad2 },
    { name: "Account", href: "/profile", icon: UserIcon },
  ];
  
  const hideHeaderRoutes = ['/my-matches', '/leaderboard', '/announcement', '/about', '/terms', '/tutorial', '/tournaments', '/my-profile', '/my-orders', '/my-statistics', '/my-rewards', '/wallet', '/add-coins', '/withdraw-coins'];
  const shouldHideHeader = hideHeaderRoutes.includes(pathname) || pathname.startsWith('/tournaments/');

  return (
    <div className="flex h-screen w-full flex-col bg-[#0B0B0F] overflow-hidden font-sans">
      <main className="flex-1 overflow-y-auto pb-[70px]">
        {/* Header matching the reference UI */}
        {!shouldHideHeader && (
          <header className="flex h-[56px] items-center justify-between px-3 bg-[#0B0B0F] sticky top-0 z-50 w-full mb-1 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden border-[1.5px] border-white">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover bg-gradient-to-br from-blue-900 to-black" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[11px] font-medium text-white leading-tight">Welcome Back,</span>
                <span className="text-[13px] font-bold text-[#3B82F6] tracking-wide leading-tight uppercase">NG ESPORTS</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Globe onClick={showComingSoon} className="w-[18px] h-[18px] text-white cursor-pointer" strokeWidth={2.5} />
              <Headphones onClick={showComingSoon} className="w-[18px] h-[18px] text-white cursor-pointer" strokeWidth={2.5} />
              
              <Link to="/wallet" className="flex items-center bg-[#0747E8] text-white rounded h-[26px] overflow-hidden ml-1">
                <div className="flex items-center justify-center bg-white h-[22px] px-1 ml-[2px] rounded-[2px] my-[2px]">
                   <div className="w-[14px] h-[14px] flex items-center justify-center border-[1.5px] border-[#0747E8] rounded-sm relative">
                      <div className="absolute top-[1px] right-0 w-1.5 h-0.5 border border-[#0747E8]"></div>
                      <div className="font-bold text-[#0747E8] text-[8px] -mt-0.5">₹</div>
                   </div>
                </div>
                <span className="text-[12px] font-bold px-2">
                  {(dbUser?.walletBalance || 0) + (dbUser?.bonusBalance || 0)}.00
                </span>
                <div className="flex items-center justify-center h-full px-1 border-l border-white/20 hover:bg-white/10 transition-colors">
                  <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
              </Link>
            </div>
          </header>
        )}

        <div className="mx-auto w-full max-w-[500px]">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[70px] items-center justify-around bg-[#12121A] px-2 max-w-[500px] mx-auto w-full pb-1 border-t border-white/5 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] rounded-t-2xl">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
          
          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-[70px] h-full transition-colors gap-1.5",
                isActive ? "text-white" : "text-gray-500 hover:text-white"
              )}
            >
              {link.name === 'Earn' ? (
                 <div className="w-[22px] h-[22px] bg-yellow-400 rounded-full flex items-center justify-center text-[13px] font-black text-black shadow-[0_0_10px_rgba(250,204,21,0.6)]">C</div>
              ) : (
                 link.icon && <link.icon className={cn("h-[24px] w-[24px]", isActive ? "fill-white" : "fill-gray-500")} strokeWidth={2} />
              )}
              <span className="text-[12px] font-bold">{link.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
}
