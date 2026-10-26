import React from 'react';
import { GameState } from '../game/scene';
import { RotateCcw, Home, Trophy, Coins, MapPin, AlertTriangle, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  state: GameState;
  onRestart: () => void;
  onMenu: () => void;
  isNewHighDistance: boolean;
  isNewHighFare: boolean;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  state,
  onRestart,
  onMenu,
  isNewHighDistance,
  isNewHighFare,
}) => {
  const cause = state.crashCause || {
    headline: 'মিরপুর এক্সপ্রেস বাসের সাথে অটো-রিকশার রক্তক্ষয়ী সংঘর্ষ!',
    sub: 'ড্রাইভার বলিলেন: "আমার গাড়ির কোনো ব্রেক আছিল না মামা!"',
    advice: 'টিপস: বাসের সামনে ওভারটেক করার আগে দুইবার হর্ন দিন।',
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="max-w-md w-full bg-slate-900 border-2 border-rose-600/80 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative my-auto">
        {/* Comic Accident Newspaper Header */}
        <div className="bg-amber-100 text-slate-950 p-4 rounded-2xl mb-4 border-2 border-amber-300 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-950/20 pb-1 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">দৈনিক দাদার রাস্তা বার্তা</span>
            <span className="text-[10px] font-mono text-slate-600">বিশেষ বুলেটিন</span>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-rose-600 text-white rounded-xl shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-rose-950 leading-snug">
                {cause.headline}
              </h2>
              <p className="text-xs text-slate-800 italic font-semibold mt-1">
                "{cause.sub}"
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-950/15 text-[11px] text-slate-700 bg-amber-200/50 p-2 rounded-lg font-medium">
            💡 {cause.advice}
          </div>
        </div>

        {/* High Score Celebration */}
        {(isNewHighDistance || isNewHighFare) && (
          <div className="mb-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>নতুন রেকর্ড সৃষ্টি হইয়াছে! (New High Score!)</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {/* Distance */}
          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800 text-center">
            <MapPin className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-[9px] text-slate-400 font-bold uppercase">দূরত্ব</div>
            <div className="text-sm sm:text-base font-black text-white">{state.score} m</div>
          </div>

          {/* Fare */}
          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800 text-center">
            <Coins className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-[9px] text-slate-400 font-bold uppercase">উপার্জন</div>
            <div className="text-sm sm:text-base font-black text-amber-400">৳ {state.fare}</div>
          </div>

          {/* Near-Misses */}
          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800 text-center">
            <Trophy className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <div className="text-[9px] text-slate-400 font-bold uppercase">ওভারটেক</div>
            <div className="text-sm sm:text-base font-black text-sky-400">{state.nearMissCount} টি</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>আবার চালান (Restart)</span>
          </button>

          <button
            type="button"
            onClick={onMenu}
            className="py-3.5 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>মেনু</span>
          </button>
        </div>
      </div>
    </div>
  );
};
