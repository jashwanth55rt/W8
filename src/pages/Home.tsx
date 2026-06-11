import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Megaphone,
  Info,
  CheckCircle2,
  Clock,
  PlayCircle,
  Share2,
  Instagram,
  Send,
  MessageCircle,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Crosshair
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const navigate = useNavigate();

  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'sliders'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const allSliders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const activeSliders = allSliders.filter((s: any) => s.status === 'active');
      if (activeSliders.length > 0) {
        setSlides(activeSliders);
      } else {
        setSlides([]);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'games'), (snap) => {
      setGames(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, err => console.error(err));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'Trophy': return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'Gamepad2': return <Gamepad2 className="w-6 h-6 text-blue-500" />;
      case 'PlayCircle': return <PlayCircle className="w-6 h-6 text-red-500" />;
      case 'Instagram': return <Instagram className="w-6 h-6 text-pink-500" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'Crosshair': return <Crosshair className="w-6 h-6 text-cyan-500" />;
      case 'Megaphone': return <Megaphone className="w-6 h-6 text-yellow-400" />;
      default: return <Info className="w-6 h-6 text-white" />;
    }
  };

  // Swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="flex flex-col gap-6 px-3 py-2 text-white font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#FF4A4A]/20 to-[#FF4A4A]/5 rounded-xl border border-[#FF4A4A]/30 flex items-center justify-between px-3 py-2.5 relative overflow-hidden mt-1 mx-1 shadow-[0_0_15px_rgba(255,74,74,0.1)]">
        <div className="flex items-center gap-2.5 relative z-10 w-full justify-center">
          <div className="text-white bg-gradient-to-br from-[#FF4A4A] to-[#DC2626] rounded-full p-1 shrink-0 ml-[-2px] shadow-lg">
            <Megaphone className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-extrabold text-[12px] tracking-widest text-[#FF4A4A] uppercase text-center flex-1 drop-shadow-md">
            BIGGEST DEPOSIT BONUS IN APP <span className="text-yellow-400 text-sm ml-1" style={{textShadow: "0 0 10px rgba(250,204,21,0.8)"}}>⚡</span>
          </span>
        </div>
      </div>

      {/* Important Section */}
      {slides.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[#3B82F6] font-bold text-sm tracking-wide uppercase">IMPORTANT</h2>
            <Info className="w-[14px] h-[14px] text-[#3B82F6] fill-[#3B82F6] text-black" />
          </div>
          <p className="text-gray-400 text-[11px] mb-2">Updates and Alerts</p>
          
          <div 
            className="w-full aspect-[2/1] rounded-xl overflow-hidden relative border border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] bg-[#0B0B1A] group"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div 
                key={index} 
                className="w-full h-full shrink-0 relative cursor-pointer"
                onClick={() => {
                  if (slide.link) {
                    if (slide.link.startsWith('http')) window.open(slide.link, '_blank');
                    else navigate(slide.link);
                  }
                }}
              >
                {/* Using a placeholder background gradient to mimic the image */}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
                
                <div className="absolute inset-x-0 bottom-0 top-[20%] bg-gradient-to-t from-gray-900/80 to-transparent" />
                
                {/* Inner content simulating the banner graphic */}
                <div className="absolute inset-0 flex flex-col justify-center items-end pr-6">
                   <div 
                     className="font-black text-2xl text-white italic tracking-tighter leading-none mb-1 text-right drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-10"
                     dangerouslySetInnerHTML={{ __html: slide.title }}
                   />
                   <div className="flex items-center justify-end w-full mt-2 relative z-10">
                      <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-lg flex items-center justify-center p-[2px]">
                         <div className="w-full h-full bg-black rounded-md flex items-center justify-center">
                           {renderIcon(slide.iconType)}
                         </div>
                      </div>
                   </div>
                </div>
                {/* Faux character sprite */}
                <div className="absolute left-[-10px] bottom-0 w-1/2 h-[90%] opacity-80 pointer-events-none pb-2 flex items-end">
                  <div 
                    className="w-full h-full bg-contain bg-no-repeat bg-bottom drop-shadow-2xl brightness-110 filter hue-rotate-180" 
                    style={{ backgroundImage: `url('https://api.dicebear.com/7.x/adventurer/svg?seed=${slide.spriteSeed}&flip=true')` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows (visible on hover) */}
          <div className="absolute inset-y-0 left-0 flex items-center px-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={prevSlide}
              className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center border border-white/20 hover:bg-black/60 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center px-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={nextSlide}
              className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center border border-white/20 hover:bg-black/60 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-white w-4' : 'bg-white/50 w-1.5'
                }`}
              />
            ))}
          </div>
        </div>
        </div>
      )}

      {/* My Contests Section */}
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex items-center gap-2">
          <h2 className="text-[#3B82F6] font-bold text-sm tracking-wide uppercase">MY CONTESTS</h2>
          <CheckCircle2 className="w-[14px] h-[14px] text-[#3B82F6] fill-[#3B82F6] text-black" />
        </div>
        <p className="text-gray-400 text-[11px] mb-2">Your Tournaments Journey</p>
        
        <div className="grid grid-cols-3 gap-3 mx-1">
          {/* Ongoing card */}
          <Link to="/my-matches?tab=ongoing" className="bg-[#1C1C28] rounded-2xl aspect-[3/4] flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group hover:border-[#FF4A4A]/50 transition-colors shadow-lg">
             <div className="absolute inset-0 bg-gradient-to-b from-[#FF4A4A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-14 h-14 rounded-full border-[2.5px] border-[#FF4A4A]/30 flex items-center justify-center mb-3">
               <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#FF4A4A] to-[#DC2626] flex items-center justify-center relative shadow-[0_0_15px_rgba(255,74,74,0.5)]">
                  <PlayCircle className="w-6 h-6 text-white fill-white" />
               </div>
             </div>
             <span className="text-[13px] font-bold z-10 text-white tracking-wide">Ongoing</span>
          </Link>

          {/* Upcoming card */}
          <Link to="/my-matches?tab=upcoming" className="bg-[#1C1C28] rounded-2xl aspect-[3/4] flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group hover:border-[#8C6DF2]/50 transition-colors shadow-lg">
             <div className="absolute inset-0 bg-gradient-to-b from-[#8C6DF2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-14 h-14 rounded-full border-[2.5px] border-[#8C6DF2]/30 flex items-center justify-center mb-3">
               <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#6251DD] to-[#8C6DF2] flex items-center justify-center shadow-[0_0_15px_rgba(140,109,242,0.5)]">
                  <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
               </div>
             </div>
             <span className="text-[13px] font-bold z-10 text-white tracking-wide">Upcoming</span>
          </Link>

          {/* Completed card */}
          <Link to="/my-matches?tab=completed" className="bg-[#1C1C28] rounded-2xl aspect-[3/4] flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group hover:border-[#10B981]/50 transition-colors shadow-lg">
             <div className="absolute inset-0 bg-gradient-to-b from-[#10B981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-14 h-14 rounded-full border-[2.5px] border-[#10B981]/30 flex items-center justify-center mb-3 pb-0.5">
               <CheckCircle2 className="w-11 h-11 text-[#10B981] fill-[#10B981] text-[#1C1C28] translate-y-[1px]" />
             </div>
             <span className="text-[13px] font-bold z-10 text-white tracking-wide">Completed</span>
          </Link>
        </div>
      </div>

      {/* EXCLUSIVE Section */}
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex items-center gap-2">
          <h2 className="text-[#3B82F6] font-bold text-sm tracking-wide uppercase">EXCLUSIVE</h2>
          <CheckCircle2 className="w-[14px] h-[14px] text-[#3B82F6] fill-[#3B82F6] text-black" />
        </div>
        <p className="text-gray-400 text-[11px] mb-2">Big Winnings For All</p>
        
        <div className="grid grid-cols-3 gap-x-3 gap-y-4 px-1">
          {games.map((g, i) => (
             <Link key={g.id || i} to={`/tournaments?game=${encodeURIComponent(g.title)}`} className="flex flex-col rounded-2xl overflow-hidden border border-white/5 bg-[#1C1C28] shadow-lg group">
                <div className="aspect-square bg-gradient-to-b from-gray-800 to-gray-900 relative p-0 flex flex-col items-center justify-center border-b border-white/5 group-hover:border-[#FF4A4A]/50 transition-colors">
                   {/* Abstract background graphics */}
                   <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9InAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGw0MCA0ME00MCAwbC00MCA0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcCkiLz48L3N2Zz4=')]" />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                   
                   <div className="w-full h-full relative z-10 pt-2 pb-6 flex items-center justify-center">
                     <img src={g.image} alt={g.title} className="w-[90%] h-[90%] object-contain mix-blend-screen opacity-100 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300" />
                   </div>
                   
                   {/* Title overlay in graphic part */}
                   <div className="absolute bottom-1.5 left-1.5 right-1.5 h-6 bg-gradient-to-r from-gray-800 to-gray-700 border border-white/10 rounded overflow-hidden z-10 flex items-center justify-center shadow-lg">
                      <span className="text-[10px] font-black text-white px-1 leading-none font-sans tracking-wider truncate uppercase">{g.title}</span>
                   </div>
                </div>
                <div className={`bg-gradient-to-r from-[#FF4A4A] to-[#DC2626] py-2 w-full text-center flex items-center justify-center group-hover:from-[#ef4444] group-hover:to-[#b91c1c] transition-colors`}>
                  <span className="text-[12px] font-bold text-white tracking-widest block uppercase whitespace-nowrap overflow-hidden text-ellipsis px-1">PLAY</span>
                </div>
             </Link>
          ))}
          {games.length === 0 && <p className="col-span-3 text-center text-gray-500 py-4 text-xs font-bold bg-[#13092A] rounded-xl border border-[#3B82F6]/20">No games listed.</p>}
        </div>
      </div>

      {/* Refer & Earn Banner */}
      <Link to="/earn" className="mt-4 rounded-xl overflow-hidden bg-gradient-to-r from-[#4B5563] via-[#6B7280] to-[#9CA3AF] p-5 flex flex-col justify-center min-h-[140px] relative shadow-lg block">
         <div className="z-10 w-[60%]">
            <h3 className="text-xl font-bold text-white mb-1 tracking-wide text-shadow">Refer And Earn</h3>
            <p className="text-[10px] text-white/90 font-medium">Get amazing products here in low cost</p>
         </div>
         {/* Placeholder graphic for refer and earn */}
         <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pr-2 opacity-95">
             <div className="w-full h-full flex pt-4 relative right-2">
                 {/* Two icon badges */}
                 <div className="w-14 h-[85px] bg-white rounded flex items-center justify-center rotate-[15deg] shadow-xl border border-gray-200 translate-x-4 z-0">
                   <MessageCircle className="w-7 h-7 text-blue-500 fill-blue-50" />
                 </div>
                 <div className="w-14 h-[90px] bg-white rounded flex flex-col justify-between py-2 items-center -rotate-[5deg] shadow-2xl border border-gray-100 z-10 -translate-y-1">
                   <div className="w-6 h-1 bg-gray-200 rounded-full" />
                   <MessageCircle className="w-8 h-8 text-blue-500 fill-blue-500" />
                   <div className="w-4 h-4 rounded-full border border-gray-200" />
                 </div>
             </div>
         </div>
         {/* Decorative green chips */}
         <div className="absolute right-[45%] bottom-5 w-7 h-7 bg-green-500/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[9px] font-bold -rotate-12 outline outline-[1.5px] outline-white shadow-[0_2px_10px_rgba(0,0,0,0.5)] z-20">Rs</div>
         <div className="absolute right-4 bottom-3 w-8 h-8 bg-green-500/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[10px] font-bold rotate-[15deg] outline outline-[1.5px] outline-white shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-20">Rs</div>
      </Link>

      {/* Share Buttons */}
      <div className="flex gap-2.5 mt-2">
        <Button variant="secondary" className="flex-1 bg-[#1E1128] text-white hover:bg-[#2A1B3E] border-none h-11 flex items-center justify-center gap-2 rounded text-[13px] font-bold tracking-wide">
           <Share2 className="w-[18px] h-[18px]" />
           Share
        </Button>
        <Button className="flex-[1.4] bg-[#10B981] hover:bg-[#059669] text-white border-none h-11 flex items-center justify-center gap-2 rounded text-[13px] font-bold tracking-wide shadow-none">
           <MessageCircle className="w-[18px] h-[18px] fill-white text-white" />
           Share on Whatsapp
        </Button>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center items-center gap-4 mt-4 mb-2">
        <a href="#" className="w-[42px] h-[42px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
           <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
             <Instagram className="w-5 h-5 text-[#E1306C]" />
           </div>
        </a>
        <a href="#" className="w-[42px] h-[42px] bg-[#229ED9] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
           <Send className="w-5 h-5 text-white ml-[-2px] mt-[1px]" />
        </a>
        <a href="#" className="w-[42px] h-[42px] bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
           <MessageCircle className="w-[26px] h-[26px] text-white fill-white" />
        </a>
      </div>

    </div>
  );
}
