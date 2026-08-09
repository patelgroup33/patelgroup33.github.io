"use client";

/**
 * Zero-asset synthesized UI sound. WebAudio oscillators only — no files to load.
 * Muted by default; the user opts in. Respects a global enabled flag.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  enabled = false;

  private ensure() {
    if (this.ctx) return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.16;
    // dry path
    this.master.connect(this.ctx.destination);
    // subtle reverb send — gives every cue a shared, spacious "OS" character
    const reverb = this.ctx.createConvolver();
    reverb.buffer = this.makeImpulse(0.6, 2.4);
    const wet = this.ctx.createGain();
    wet.gain.value = 0.16;
    this.master.connect(reverb);
    reverb.connect(wet);
    wet.connect(this.ctx.destination);
  }

  /** Synthesized impulse response for the reverb (no asset needed). */
  private makeImpulse(dur: number, decay: number) {
    const rate = this.ctx!.sampleRate;
    const len = Math.floor(rate * dur);
    const buf = this.ctx!.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  /** Pitch-glide sine used for swells inside richer cues. */
  private swell(f0: number, f1: number, dur: number, gain: number) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (on) {
      this.ensure();
      this.ctx?.resume();
      this.startup();
    }
  }

  private blip(freq: number, dur: number, type: OscillatorType, gain = 0.5) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  hover() {
    this.blip(880, 0.06, "sine", 0.28);
  }

  click() {
    this.blip(1320, 0.05, "triangle", 0.4);
    this.blip(660, 0.12, "sine", 0.3);
  }

  startup() {
    if (!this.enabled || !this.ctx) return;
    const notes = [220, 330, 440, 660, 880];
    notes.forEach((f, i) =>
      setTimeout(() => this.blip(f, 0.22, "sine", 0.3), i * 70)
    );
  }

  /** Very quiet high tick emitted while scrolling; pitch tracks velocity. */
  tick(intensity = 0) {
    const base = 1500 + Math.min(Math.max(intensity, 0), 1) * 1000;
    this.blip(base + Math.random() * 180, 0.016, "sine", 0.045);
  }

  /** Soft rising chirp — a graphic/section popping into view. */
  reveal() {
    if (!this.enabled) return;
    this.blip(523, 0.09, "sine", 0.12);
    setTimeout(() => this.blip(784, 0.12, "sine", 0.1), 55);
  }

  /** Airy band-passed noise whoosh — content assembling on a transition. */
  sweep() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const dur = 0.45;
    const buffer = this.ctx.createBuffer(
      1,
      Math.floor(this.ctx.sampleRate * dur),
      this.ctx.sampleRate
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(360, t);
    bp.frequency.exponentialRampToValueAtTime(2600, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.07);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start(t);
    src.stop(t + dur);
  }

  /** Combined cue used when a new section materialises. */
  transition() {
    this.sweep();
    this.reveal();
  }

  /** Jarvis uplink opening — ascending arpeggio + swell + whoosh. */
  powerUp() {
    if (!this.enabled || !this.ctx) return;
    [392, 523, 659, 784, 1046].forEach((f, i) =>
      setTimeout(() => this.blip(f, 0.16, "sine", 0.16), i * 55)
    );
    this.swell(110, 340, 0.55, 0.13);
    this.sweep();
  }

  /** Uplink closing — descending, softer. */
  powerDown() {
    if (!this.enabled || !this.ctx) return;
    [784, 587, 440, 294].forEach((f, i) =>
      setTimeout(() => this.blip(f, 0.14, "sine", 0.11), i * 50)
    );
  }

  /** Soft counting tick — call repeatedly while a number animates. */
  count() {
    this.blip(1150 + Math.random() * 350, 0.014, "triangle", 0.05);
  }

  /** Bright confirm blip when a value/counter lands. */
  confirm() {
    this.blip(880, 0.07, "sine", 0.13);
    setTimeout(() => this.blip(1320, 0.12, "sine", 0.11), 45);
  }
}

export const sound = new SoundEngine();
