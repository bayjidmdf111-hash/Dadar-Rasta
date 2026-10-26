import React from 'react';
import { ArrowLeft, ArrowRight, Zap, OctagonAlert, Volume2 } from 'lucide-react';

interface TouchControlsProps {
  onSteerLeft: (active: boolean) => void;
  onSteerRight: (active: boolean) => void;
  onAccelerate: (active: boolean) => void;
  onBrake: (active: boolean) => void;
  onHorn: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onSteerLeft,
  onSteerRight,
  onAccelerate,
  onBrake,
  onHorn,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-between p-3 pb-6 md:p-6">
      {/* Top spacing */}
      <div className="h-16" />

      {/* Bottom Controls Bar */}
      <div className="flex items-end justify-between w-full pointer-events-auto">
        {/* Left Side: Steering Pad (Left / Right) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900/85 active:bg-amber-500 border-2 border-slate-700/80 active:border-white rounded-2xl flex flex-col items-center justify-center text-white shadow-xl backdrop-blur-xs transition-transform active:scale-95 touch-none"
            onPointerDown={(e) => {
              e.preventDefault();
              onSteerLeft(true);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              onSteerLeft(false);
            }}
            onPointerCancel={() => onSteerLeft(false)}
            title="Steer Left (বামে)"
          >
            <ArrowLeft className="w-8 h-8 text-amber-400" />
            <span className="text-[10px] font-bold tracking-wider text-slate-300">বামে</span>
          </button>

          <button
            type="button"
            className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900/85 active:bg-amber-500 border-2 border-slate-700/80 active:border-white rounded-2xl flex flex-col items-center justify-center text-white shadow-xl backdrop-blur-xs transition-transform active:scale-95 touch-none"
            onPointerDown={(e) => {
              e.preventDefault();
              onSteerRight(true);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              onSteerRight(false);
            }}
            onPointerCancel={() => onSteerRight(false)}
            title="Steer Right (ডানে)"
          >
            <ArrowRight className="w-8 h-8 text-amber-400" />
            <span className="text-[10px] font-bold tracking-wider text-slate-300">ডানে</span>
          </button>
        </div>

        {/* Center: Big Bangladeshi Musical Electric Horn */}
        <div className="flex flex-col items-center mb-1">
          <button
            type="button"
            className="w-18 h-18 sm:w-22 sm:h-22 bg-gradient-to-tr from-amber-600 to-yellow-400 active:from-yellow-400 active:to-amber-500 text-slate-950 rounded-full border-4 border-white shadow-2xl flex flex-col items-center justify-center font-black transition-transform active:scale-90 touch-none cursor-pointer"
            onPointerDown={(e) => {
              e.preventDefault();
              onHorn();
            }}
            title="Musical Horn (হর্ন)"
          >
            <Volume2 className="w-8 h-8 fill-current" />
            <span className="text-xs font-black uppercase tracking-tighter">হর্ন</span>
          </button>
        </div>

        {/* Right Side: Gas & Brake */}
        <div className="flex items-center gap-2">
          {/* Brake */}
          <button
            type="button"
            className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-950/85 active:bg-rose-600 border-2 border-rose-700/80 active:border-white rounded-2xl flex flex-col items-center justify-center text-white shadow-xl backdrop-blur-xs transition-transform active:scale-95 touch-none"
            onPointerDown={(e) => {
              e.preventDefault();
              onBrake(true);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              onBrake(false);
            }}
            onPointerCancel={() => onBrake(false)}
            title="Brake (ব্রেক)"
          >
            <OctagonAlert className="w-7 h-7 text-rose-400" />
            <span className="text-[10px] font-bold tracking-wider text-rose-200">ব্রেক</span>
          </button>

          {/* Accelerate */}
          <button
            type="button"
            className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-950/85 active:bg-emerald-600 border-2 border-emerald-600/80 active:border-white rounded-2xl flex flex-col items-center justify-center text-white shadow-xl backdrop-blur-xs transition-transform active:scale-95 touch-none"
            onPointerDown={(e) => {
              e.preventDefault();
              onAccelerate(true);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              onAccelerate(false);
            }}
            onPointerCancel={() => onAccelerate(false)}
            title="Gas (গতি)"
          >
            <Zap className="w-7 h-7 text-emerald-400 fill-emerald-400" />
            <span className="text-[10px] font-bold tracking-wider text-emerald-200">গতি</span>
          </button>
        </div>
      </div>
    </div>
  );
};
