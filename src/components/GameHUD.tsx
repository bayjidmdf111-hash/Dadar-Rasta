import React, { useState } from 'react';
import { GameState } from '../game/scene';
import { BatteryCharging, Gauge, Coins, MapPin, Pause, Volume2, VolumeX, Sparkles, MessageSquareQuote } from 'lucide-react';

interface GameHUDProps {
  state: GameState;
  onPause: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  comment?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  state,
  onPause,
  isMuted,
  onToggleMute,
  comment,
}) => {
  const [showTranslate, setShowTranslate] = useState(false);

  // Battery bar color
  const batPct = Math.round(state.battery);
  const batteryColor =
    batPct > 50 ? 'bg-emerald-500' : batPct > 20 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-3 sm:p-5">
      {/* Top Header Stats Row */}
      <div className="flex items-center justify-between gap-2 w-full">
        {/* Left Stats: Distance & Fare */}
        <div className="flex items-center gap-2">
          {/* Distance */}
          <div className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2 text-white shadow-md">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 leading-tight">দূরত্ব (Distance)</div>
              <div className="text-sm font-black tracking-tight text-white">{state.score} m</div>
            </div>
          </div>

          {/* Fare Collected */}
          <div className="bg-slate-950/80 border border-amber-600/80 rounded-xl px-3 py-1.5 flex items-center gap-2 text-white shadow-md">
            <Coins className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-300 leading-tight">ভাড়া (Fare)</div>
              <div className="text-sm font-black text-amber-400">৳ {state.fare}</div>
            </div>
          </div>
        </div>

        {/* Center: Speedometer & Battery */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Speed */}
          <div className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2 text-white shadow-md">
            <Gauge className="w-4 h-4 text-sky-400 shrink-0" />
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 leading-tight">গতি (Speed)</div>
              <div className="text-sm font-black text-sky-400">{state.speedKmh} km/h</div>
            </div>
          </div>

          {/* Battery */}
          <div className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-1.5 flex flex-col justify-center min-w-[110px] text-white shadow-md">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                ব্যাটারি
              </span>
              <span>{batPct}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${batteryColor} transition-all duration-300`}
                style={{ width: `${batPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Buttons: Mute & Pause */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Mobile Speed indicator */}
          <div className="sm:hidden bg-slate-950/80 border border-slate-700/80 rounded-xl px-2.5 py-1 text-center text-white">
            <div className="text-xs font-black text-sky-400">{state.speedKmh} km/h</div>
            <div className="text-[9px] font-bold text-slate-400">{batPct}% ⚡</div>
          </div>

          <button
            type="button"
            onClick={onToggleMute}
            className="w-10 h-10 bg-slate-900/85 active:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl flex items-center justify-center shadow-md cursor-pointer transition-colors"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={onPause}
            className="w-10 h-10 bg-slate-900/85 active:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl flex items-center justify-center shadow-md cursor-pointer transition-colors"
            title="Pause Game (বিরতি)"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Near Miss Combo Badge */}
      {state.combo > 0 && (
        <div className="self-center mt-2 pointer-events-none animate-bounce">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs sm:text-sm font-black px-4 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>অল্পের জন্য বাঁচলেন! (Near Miss x{state.combo}) +150</span>
          </div>
        </div>
      )}

      {/* Dynamic Bangla Traffic Banter Notification */}
      {comment && (
        <div className="self-center pointer-events-auto max-w-md w-full mb-20 sm:mb-24 px-2">
          <div className="bg-slate-950/90 border border-amber-500/70 text-white rounded-2xl p-3 shadow-2xl flex items-start gap-3 backdrop-blur-xs">
            <div className="bg-amber-500/20 p-2 rounded-xl text-amber-400 shrink-0 mt-0.5">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-bold text-amber-300 leading-snug">
                "{comment}"
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                <span className="font-semibold text-slate-300">ঢাকাইয়া ড্রাইভার কমেন্ট্রি</span>
                <button
                  type="button"
                  onClick={() => setShowTranslate(!showTranslate)}
                  className="text-amber-400 underline cursor-pointer hover:text-amber-300"
                >
                  {showTranslate ? 'হাইড অনুবাদ' : 'English Meaning'}
                </button>
              </div>
              {showTranslate && (
                <div className="mt-1 text-[11px] text-slate-300 italic bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  Authentic Dhaka traffic commentary: sound horn, dodge incoming buses, and steer swiftly!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
