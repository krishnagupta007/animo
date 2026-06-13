/* eslint-disable */
// Animo Premium Synthesized Web Audio API Engine
// Generated client-side to ensure zero-latency feedback and 100% offline reliability.

let globalCtx: AudioContext | null = null;
let activeAmbientTrack: 'lofi' | 'binaural' | 'brown' | null = null;
const activeNodes: { [key: string]: any[] } = {};
let lofiIntervalId: any = null;

let masterAmbientGain: GainNode | null = null;
let ambientVolume = 0.5; // Default volume (0.0 to 1.0)

// Initialize or resume the Web Audio context
function getAudioContext(): AudioContext | null {
  try {
    if (!globalCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        globalCtx = new AudioContextClass();
      }
    }
    if (globalCtx) {
      if (globalCtx.state === 'suspended') {
        globalCtx.resume();
      }
      if (!masterAmbientGain) {
        masterAmbientGain = globalCtx.createGain();
        masterAmbientGain.gain.setValueAtTime(ambientVolume, globalCtx.currentTime);
        masterAmbientGain.connect(globalCtx.destination);
      }
    }
    return globalCtx;
  } catch (e) {
    console.error("Failed to initialize AudioContext:", e);
    return null;
  }
}

// 1. Play standard short SFX chimes (bypass master ambient volume for notifications)
export const playSound = (freqs: number[], type: OscillatorType, duration: number, volume = 0.08) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    let time = ctx.currentTime;
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + duration);

      time += duration * 0.45; // slight overlap
    });
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

export const playClickSound = () => playSound([600], 'sine', 0.05);
export const playSuccessSound = () => playSound([523.25, 659.25, 783.99], 'sine', 0.15);
export const playFailureSound = () => playSound([150, 110], 'triangle', 0.25);
export const playLevelUpSound = () => playSound([261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50], 'sine', 0.1);

// 2. Play continuous Ambient Soundscapes & control volume

export const setAmbientVolume = (vol: number) => {
  ambientVolume = Math.max(0, Math.min(1, vol));
  const ctx = getAudioContext();
  if (ctx && masterAmbientGain) {
    masterAmbientGain.gain.setValueAtTime(ambientVolume, ctx.currentTime);
  }
};

export const startAmbientSound = (trackId: 'lofi' | 'binaural' | 'brown') => {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Stop any current ambient audio
  stopAmbientSound();
  activeAmbientTrack = trackId;

  if (trackId === 'brown') {
    playBrownNoise(ctx);
  } else if (trackId === 'binaural') {
    playBinauralBeats(ctx);
  } else if (trackId === 'lofi') {
    playLofiFocus(ctx);
  }
};

export const stopAmbientSound = () => {
  activeAmbientTrack = null;
  if (lofiIntervalId) {
    clearInterval(lofiIntervalId);
    lofiIntervalId = null;
  }

  // Terminate and clean up all active nodes
  Object.keys(activeNodes).forEach((key) => {
    activeNodes[key].forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    delete activeNodes[key];
  });
};

// Generative Brown Noise (Simulated Deep Ocean Rumble - louder base gain)
function playBrownNoise(ctx: AudioContext) {
  try {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // 1st order filter to create brown/pink-ish spectrum (1/f^2 slope)
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // compensations for volume loss
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, ctx.currentTime); // low rumble

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.65, ctx.currentTime); // Louder base volume

    const masterGain = getMasterGain(ctx);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    source.start(0);
    activeNodes['brown'] = [source, filter, gain];
  } catch (e) {
    console.error("Failed to start Brown Noise:", e);
  }
}

// Alpha Binaural Beats (140Hz Left, 150Hz Right - louder base gain)
function playBinauralBeats(ctx: AudioContext) {
  try {
    const oscL = ctx.createOscillator();
    const gainL = ctx.createGain();
    const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    const masterGain = getMasterGain(ctx);

    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(140, ctx.currentTime);
    gainL.gain.setValueAtTime(0.28, ctx.currentTime); // Louder base volume

    const oscR = ctx.createOscillator();
    const gainR = ctx.createGain();
    const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(150, ctx.currentTime); // 10Hz difference
    gainR.gain.setValueAtTime(0.28, ctx.currentTime); // Louder base volume

    if (pannerL && pannerR) {
      pannerL.pan.setValueAtTime(-1, ctx.currentTime);
      pannerR.pan.setValueAtTime(1, ctx.currentTime);

      oscL.connect(gainL).connect(pannerL).connect(masterGain);
      oscR.connect(gainR).connect(pannerR).connect(masterGain);
      activeNodes['binaural'] = [oscL, oscR, gainL, gainR, pannerL, pannerR];
    } else {
      oscL.connect(gainL).connect(masterGain);
      oscR.connect(gainR).connect(masterGain);
      activeNodes['binaural'] = [oscL, oscR, gainL, gainR];
    }

    oscL.start(0);
    oscR.start(0);
  } catch (e) {
    console.error("Failed to start Binaural Beats:", e);
  }
}

// Helper to get or create Master Ambient Gain Node
function getMasterGain(ctx: AudioContext): GainNode {
  if (!masterAmbientGain) {
    masterAmbientGain = ctx.createGain();
    masterAmbientGain.gain.setValueAtTime(ambientVolume, ctx.currentTime);
    masterAmbientGain.connect(ctx.destination);
  }
  return masterAmbientGain;
}

// Generative Lo-Fi Focus Music (Retro chord sequence + vinyl clicks + warm lowpass)
function playLofiFocus(ctx: AudioContext) {
  try {
    const progressions = [
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
      [110.00, 130.81, 164.81, 196.00], // Am7
      [87.31, 130.81, 174.61, 220.00],  // Fmaj7
      [98.00, 123.47, 146.83, 196.00]   // G6
    ];

    let currentChordIdx = 0;
    const masterGain = getMasterGain(ctx);

    const playChord = (chordFreqs: number[]) => {
      if (activeAmbientTrack !== 'lofi' || !globalCtx) return;
      const now = globalCtx.currentTime;
      const duration = 3.8;

      const filter = globalCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, now); // soft warm cut

      const mainGain = globalCtx.createGain();
      mainGain.gain.setValueAtTime(0.25, now); // Louder base volume
      mainGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      chordFreqs.forEach((freq) => {
        if (!globalCtx) return;
        const osc = globalCtx.createOscillator();
        const oscGain = globalCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now); // vintage flutter

        oscGain.gain.setValueAtTime(0.6, now); // Louder base volume

        osc.connect(oscGain).connect(filter);
        osc.start(now);
        osc.stop(now + duration);
      });

      filter.connect(mainGain).connect(masterGain);
    };

    // Play immediate chord
    playChord(progressions[currentChordIdx]);

    // Loop progressions
    lofiIntervalId = setInterval(() => {
      currentChordIdx = (currentChordIdx + 1) % progressions.length;
      playChord(progressions[currentChordIdx]);
    }, 4000);

    // Continuous Vinyl Hiss / crackle overlay
    const bufferSize = ctx.sampleRate * 2.5;
    const crackleBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = crackleBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const rand = Math.random();
      if (rand > 0.99985) {
        // vinyl pop impulse
        data[i] = (Math.random() * 2 - 1) * 0.25;
      } else {
        // soft background white noise hiss
        data[i] = (Math.random() * 2 - 1) * 0.004;
      }
    }

    const crackleSource = ctx.createBufferSource();
    crackleSource.buffer = crackleBuffer;
    crackleSource.loop = true;

    const crackleFilter = ctx.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.setValueAtTime(1200, ctx.currentTime);
    crackleFilter.Q.setValueAtTime(0.6, ctx.currentTime);

    const crackleGain = ctx.createGain();
    crackleGain.gain.setValueAtTime(0.18, ctx.currentTime); // Louder base volume

    crackleSource.connect(crackleFilter).connect(crackleGain).connect(masterGain);
    crackleSource.start(0);

    activeNodes['lofi'] = [crackleSource, crackleFilter, crackleGain];
  } catch (e) {
    console.error("Failed to start Lo-Fi Focus:", e);
  }
}
