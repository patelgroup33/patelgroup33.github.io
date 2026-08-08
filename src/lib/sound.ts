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
    this.master.connect(this.ctx.destination);
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
}

export const sound = new SoundEngine();
