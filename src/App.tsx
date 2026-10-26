/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { DhakaGameEngine, GameState, GameOptions } from './game/scene';
import { sound } from './game/audio';
import { TouchControls } from './components/TouchControls';
import { GameHUD } from './components/GameHUD';
import { StartMenu } from './components/StartMenu';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { ExportGuideModal } from './components/ExportGuideModal';
import { FUNNY_COMMENTS } from './game/dialogues';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<DhakaGameEngine | null>(null);

  const [mode, setMode] = useState<'menu' | 'playing' | 'paused' | 'gameover'>('menu');
  const [options, setOptions] = useState<GameOptions>({
    difficulty: 'mirpur',
    rickshawColor: 'green',
    graphicsQuality: 'med',
  });

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    fare: 0,
    speedKmh: 0,
    battery: 100,
    combo: 0,
    gameOver: false,
    paused: false,
    nearMissCount: 0,
    lastComment: '',
  });

  const [currentComment, setCurrentComment] = useState<string>('বিসমিল্লাহ! দাদার রাস্তায় ডানে-বামে দেখিয়া চালান!');
  const [isMuted, setIsMuted] = useState(false);
  const [showExportGuide, setShowExportGuide] = useState(false);

  // Local storage high scores
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('dhaka_rush_high_dist') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [highestFare, setHighestFare] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('dhaka_rush_high_fare') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [isNewHighDistance, setIsNewHighDistance] = useState(false);
  const [isNewHighFare, setIsNewHighFare] = useState(false);

  // Initialize or update game engine
  useEffect(() => {
    if (!mountRef.current) return;

    const engine = new DhakaGameEngine(
      mountRef.current,
      options,
      (newState) => {
        setGameState(newState);

        if (newState.gameOver) {
          setMode('gameover');

          // Check records
          let newHighDist = false;
          let newHighFare = false;
          if (newState.score > highScore) {
            newHighDist = true;
            setHighScore(newState.score);
            try {
              localStorage.setItem('dhaka_rush_high_dist', String(newState.score));
            } catch {
              // Ignore
            }
          }
          if (newState.fare > highestFare) {
            newHighFare = true;
            setHighestFare(newState.fare);
            try {
              localStorage.setItem('dhaka_rush_high_fare', String(newState.fare));
            } catch {
              // Ignore
            }
          }
          setIsNewHighDistance(newHighDist);
          setIsNewHighFare(newHighFare);
        }
      },
      (comment) => {
        setCurrentComment(comment);
      }
    );

    engineRef.current = engine;

    // Periodic random Dhakaiya commentary during play
    const dialogueInterval = setInterval(() => {
      if (engineRef.current && !engineRef.current.state.gameOver && !engineRef.current.state.paused) {
        const randomQuote = FUNNY_COMMENTS[Math.floor(Math.random() * FUNNY_COMMENTS.length)];
        setCurrentComment(randomQuote.bangla);
      }
    }, 7000);

    return () => {
      clearInterval(dialogueInterval);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Update options in running engine
  const handleOptionsChange = (newOpts: Partial<GameOptions>) => {
    const updated = { ...options, ...newOpts };
    setOptions(updated);
    engineRef.current?.setOptions(newOpts);
  };

  const handleStartGame = () => {
    setMode('playing');
    setIsNewHighDistance(false);
    setIsNewHighFare(false);
    engineRef.current?.restart();
  };

  const handlePause = () => {
    if (mode === 'playing') {
      setMode('paused');
      engineRef.current?.togglePause();
    }
  };

  const handleResume = () => {
    if (mode === 'paused') {
      setMode('playing');
      engineRef.current?.togglePause();
    }
  };

  const handleRestart = () => {
    setMode('playing');
    setIsNewHighDistance(false);
    setIsNewHighFare(false);
    engineRef.current?.restart();
  };

  const handleBackToMenu = () => {
    setMode('menu');
    sound.stopMotor();
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMute(nextMuted);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 3D WebGL Canvas dedicated container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* In-Game HUD overlay */}
      {(mode === 'playing' || mode === 'paused') && (
        <GameHUD
          state={gameState}
          onPause={handlePause}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          comment={currentComment}
        />
      )}

      {/* Mobile Touch Controls overlay */}
      {mode === 'playing' && engineRef.current && (
        <TouchControls
          onSteerLeft={(active) => {
            if (engineRef.current) engineRef.current.input.left = active;
          }}
          onSteerRight={(active) => {
            if (engineRef.current) engineRef.current.input.right = active;
          }}
          onAccelerate={(active) => {
            if (engineRef.current) engineRef.current.input.accelerate = active;
          }}
          onBrake={(active) => {
            if (engineRef.current) engineRef.current.input.brake = active;
            if (active) sound.playBrake();
          }}
          onHorn={() => {
            engineRef.current?.triggerHorn();
          }}
        />
      )}

      {/* Start Menu Overlay */}
      {mode === 'menu' && (
        <StartMenu
          options={options}
          onOptionsChange={handleOptionsChange}
          onStart={handleStartGame}
          onOpenExportGuide={() => setShowExportGuide(true)}
          highScore={highScore}
          highestFare={highestFare}
        />
      )}

      {/* Game Over Screen */}
      {mode === 'gameover' && (
        <GameOverModal
          state={gameState}
          onRestart={handleRestart}
          onMenu={handleBackToMenu}
          isNewHighDistance={isNewHighDistance}
          isNewHighFare={isNewHighFare}
        />
      )}

      {/* Pause Modal */}
      {mode === 'paused' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onMenu={handleBackToMenu}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          options={options}
          onOptionsChange={handleOptionsChange}
        />
      )}

      {/* GitHub & Cloudflare Pages Free Export Guide Modal */}
      {showExportGuide && <ExportGuideModal onClose={() => setShowExportGuide(false)} />}
    </div>
  );
}
