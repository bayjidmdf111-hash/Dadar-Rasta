import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Settings } from 'lucide-react';
import { GameOptions } from '../game/scene';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  options: GameOptions;
  onOptionsChange: (opts: Partial<GameOptions>) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onMenu,
  isMuted,
  onToggleMute,
  options,
  onOptionsChange,
}) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="max-w-sm w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 text-white shadow-2xl text-center">
        <h2 className="text-2xl font-black text-amber-400 mb-1">খেলা সাময়িক স্থগিত</h2>
        <p className="text-xs text-slate-400 mb-6">Game Paused — বিশ্রাম নিতে পারেন</p>

        {/* Options */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>চালিয়ে যান (Resume)</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>পুনরায় শুরু করুন (Restart)</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="w-full py-2.5 bg-slate-950/80 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-800 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>শব্দ {isMuted ? 'চালু করুন (Unmute)' : 'বন্ধ করুন (Mute)'}</span>
          </button>
        </div>

        {/* Quality switch */}
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 mb-4 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Settings className="w-4 h-4" />
            কোয়ালিটি:
          </span>
          <div className="flex gap-1">
            {(['low', 'med', 'high'] as const).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onOptionsChange({ graphicsQuality: q })}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
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

        <button
          type="button"
          onClick={onMenu}
          className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>প্রধান মেনুতে ফিরুন (Main Menu)</span>
        </button>
      </div>
    </div>
  );
};
