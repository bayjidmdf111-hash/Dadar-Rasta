import React from 'react';
import { GameOptions } from '../game/scene';
import { Play, Sparkles, Trophy, HelpCircle, Globe, Settings, Flame, ShieldAlert } from 'lucide-react';

interface StartMenuProps {
  options: GameOptions;
  onOptionsChange: (opts: Partial<GameOptions>) => void;
  onStart: () => void;
  onOpenExportGuide: () => void;
  highScore: number;
  highestFare: number;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  options,
  onOptionsChange,
  onStart,
  onOpenExportGuide,
  highScore,
  highestFare,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xs">
      <div className="max-w-xl w-full bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative my-auto">
        {/* Colorful Rickshaw Art Top Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 text-slate-950 px-4 py-1 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase mb-2 shadow-md">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>★ রাস্তা কি দাদার পাইছেন?! ★</span>
            <Sparkles className="w-4 h-4 fill-current" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-emerald-400 tracking-tight">
            দাদার রাস্তা
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            Dadar Rasta — ৩ডি দেশি অটো-রিকশা রেসিং গেম
          </p>
        </div>

        {/* High Score / Fare Badge */}
        <div className="grid grid-cols-2 gap-3 mb-5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">রেকর্ড দূরত্ব (Best Distance)</div>
              <div className="text-base sm:text-lg font-black text-amber-400">{highScore} m</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <span className="text-lg font-black">৳</span>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">সর্বোচ্চ ভাড়া (Highest Fare)</div>
              <div className="text-base sm:text-lg font-black text-emerald-400">৳ {highestFare}</div>
            </div>
          </div>
        </div>

        {/* Location / Route Selection */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            রুট ও জ্যামের তীব্রতা (Route & Traffic Jam)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'mirpur', label: 'মিরপুর ১০', sub: 'স্বাভাবিক জ্যাম (Easy)', level: '★☆☆' },
              { id: 'farmgate', label: 'ফার্মগেট', sub: 'বাসের তাণ্ডব (Insane)', level: '★★★' },
              { id: 'gulshan', label: 'পুরান ঢাকা', sub: 'চিপা গলি (Tight)', level: '★★☆' },
            ].map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() => onOptionsChange({ difficulty: route.id as GameOptions['difficulty'] })}
                className={`p-2.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                  options.difficulty === route.id
                    ? 'border-amber-400 bg-amber-500/20 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-200">{route.label}</div>
                <div className="text-[10px] text-slate-400">{route.sub}</div>
                <div className="text-[10px] text-amber-400 font-mono mt-0.5">{route.level}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Rickshaw Color Theme */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            অটো-রিকশার রঙ (Rickshaw Paint Scheme)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'green', name: 'শাপলা সবুজ', bg: 'bg-emerald-600' },
              { id: 'yellow', name: 'সুন্দরবন হলুদ', bg: 'bg-amber-500' },
              { id: 'blue', name: 'সুরমা নীল', bg: 'bg-sky-600' },
              { id: 'red', name: 'পদ্মা লাল', bg: 'bg-rose-600' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onOptionsChange({ rickshawColor: c.id as GameOptions['rickshawColor'] })}
                className={`p-2 rounded-xl text-center border-2 transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  options.rickshawColor === c.id
                    ? 'border-amber-400 bg-slate-800'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full ${c.bg} border border-white/50`} />
                <span className="text-[10px] font-bold text-slate-300">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Graphics Quality (Android 8.1 / Low phone optimization) */}
        <div className="mb-5 flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-xs font-bold text-slate-200">গ্রাফিক্স কোয়ালিটি (Performance)</div>
              <div className="text-[10px] text-slate-400">লো-এন্ড ফোনের জন্য 'Low' বেছে নিন</div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {(['low', 'med', 'high'] as const).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onOptionsChange({ graphicsQuality: q })}
                className={`px-2.5 py-1 text-[11px] font-bold rounded cursor-pointer uppercase ${
                  options.graphicsQuality === q
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Big Start Button */}
        <button
          type="button"
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 via-amber-500 to-yellow-400 hover:from-emerald-400 hover:to-yellow-300 active:scale-[0.98] text-slate-950 font-black text-lg sm:text-xl rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer mb-3"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>খেলা শুরু করুন (Start Rush)</span>
        </button>

        {/* Free Cloudflare / GitHub Hosting Guide & Instructions */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onOpenExportGuide}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Globe className="w-4 h-4" />
            <span>গিটহাব, ক্লাউডফ্লেয়ার ও গুগল সার্চে আনার গাইড</span>
          </button>

          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>টাচ বা কীবোর্ড (A/D/W/S/Space/H)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
