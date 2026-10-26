/**
 * Procedural Web Audio API sound synthesizer for Dhaka Traffic Rush.
 * 100% generated in real-time with zero external audio files.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private motorOsc: OscillatorNode | null = null;
  private motorGain: GainNode | null = null;
  private motorFilter: BiquadFilterNode | null = null;
  private isMotorRunning: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.motorGain && this.ctx) {
      this.motorGain.gain.setValueAtTime(muted ? 0 : 0.08, this.ctx.currentTime);
    }
  }

  /**
   * Continuous Electric Auto-Rickshaw Motor Sound.
   * Whirring electric motor that shifts frequency with vehicle speed.
   */
  public startMotor() {
    if (this.isMotorRunning) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      this.motorOsc = this.ctx.createOscillator();
      this.motorFilter = this.ctx.createBiquadFilter();
      this.motorGain = this.ctx.createGain();

      this.motorOsc.type = 'sawtooth';
      this.motorOsc.frequency.setValueAtTime(90, this.ctx.currentTime);

      this.motorFilter.type = 'lowpass';
      this.motorFilter.frequency.setValueAtTime(450, this.ctx.currentTime);

      this.motorGain.gain.setValueAtTime(this.isMuted ? 0 : 0.06, this.ctx.currentTime);

      this.motorOsc.connect(this.motorFilter);
      this.motorFilter.connect(this.motorGain);
      this.motorGain.connect(this.ctx.destination);

      this.motorOsc.start();
      this.isMotorRunning = true;
    } catch {
      // Audio context might fail before user interaction
    }
  }

  public updateMotorSpeed(speedRatio: number) {
    if (!this.isMotorRunning || !this.ctx || !this.motorOsc || !this.motorFilter || !this.motorGain) return;
    if (this.isMuted) return;

    const baseFreq = 90 + speedRatio * 240; // 90Hz to 330Hz electric whir
    const filterFreq = 400 + speedRatio * 800;
    const vol = 0.03 + speedRatio * 0.07;

    const t = this.ctx.currentTime;
    this.motorOsc.frequency.setTargetAtTime(baseFreq, t, 0.05);
    this.motorFilter.frequency.setTargetAtTime(filterFreq, t, 0.05);
    this.motorGain.gain.setTargetAtTime(vol, t, 0.05);
  }

  public stopMotor() {
    if (!this.isMotorRunning) return;
    try {
      this.motorOsc?.stop();
      this.motorOsc?.disconnect();
      this.motorGain?.disconnect();
      this.motorFilter?.disconnect();
    } catch {
      // Ignore
    }
    this.motorOsc = null;
    this.motorGain = null;
    this.motorFilter = null;
    this.isMotorRunning = false;
  }

  /**
   * Play typical funny Dhaka electric rickshaw musical horn!
   * High-pitch rapid double beep "PA-PEEEP!" with harmonic vibrato.
   */
  public playRickshawHorn() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const tones = [
      { freq: 880, dur: 0.1, delay: 0 },
      { freq: 1100, dur: 0.18, delay: 0.12 },
    ];

    tones.forEach((tone) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(tone.freq, now + tone.delay);
      // Slight comedic frequency dip
      osc.frequency.exponentialRampToValueAtTime(tone.freq * 1.05, now + tone.delay + tone.dur);

      gain.gain.setValueAtTime(0, now + tone.delay);
      gain.gain.linearRampToValueAtTime(0.25, now + tone.delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + tone.delay + tone.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + tone.delay);
      osc.stop(now + tone.delay + tone.dur + 0.05);
    });
  }

  /**
   * Loud Dhakaiya Bus Air Horn "BHOOOONN!"
   * Dual-tone brass pneumatic air horn used by Murir Tin local buses.
   */
  public playBusHorn() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [330, 392]; // E4 & G4 chord

    freqs.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.setValueAtTime(0.2, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  /**
   * Brake screech sound
   */
  public playBrake() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.25);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  /**
   * Fare collected / Taka coin chime (৳ 50 Taka!)
   */
  public playFareCoin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.38);
  }

  /**
   * Battery Boost pickup sound
   */
  public playBatteryBoost() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Funny Crash "DHAAM!" sound + comic wobble
   */
  public playCrash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Noise blast
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);

    // Comic spring tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.45);

    oscGain.gain.setValueAtTime(0.2, now + 0.05);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    osc.start(now + 0.05);
    osc.stop(now + 0.5);
  }

  /**
   * Near miss close shave "WHEW!" sound
   */
  public playNearMiss() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(750, now + 0.08);
    osc.frequency.linearRampToValueAtTime(500, now + 0.2);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }
}

export const sound = new SoundSystem();
