import { NoteDefinition, PitchDetectionResult, TuningState } from '../types';
import { TRUMPET_NOTES } from '../data/trumpetData';

/**
 * Motor de Áudio Web: Detecção de Afinação em Tempo Real e Sintetizador de Trompete
 */
export class AudioPitchEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private buffer: Float32Array<ArrayBuffer> | null = null;

  // Transposição: true = Trompete em Bb (padrão), false = Som Real / Concerto (C)
  public isTrumpetBbMode: boolean = true;

  // Limiar de silêncio (Noise Gate)
  public noiseThreshold: number = 0.018;

  // Callback de resultado em tempo real
  private onPitchCallback: ((result: PitchDetectionResult) => void) | null = null;

  // Controle de estabilidade da nota
  private currentStableNoteId: string | null = null;
  private stableNoteStartTime: number = 0;

  constructor() {}

  /**
   * Inicia a escuta pelo microfone
   */
  public async start(onPitch: (result: PitchDetectionResult) => void): Promise<void> {
    this.onPitchCallback = onPitch;

    if (this.isRunning) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      });

      this.sourceNode = this.audioCtx.createMediaStreamSource(this.micStream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048; // Boa resolução temporal e de frequência para trompete (~160Hz a 1000Hz)
      this.sourceNode.connect(this.analyser);

      this.buffer = new Float32Array(this.analyser.fftSize);
      this.isRunning = true;
      this.currentStableNoteId = null;
      this.stableNoteStartTime = 0;

      this.loop();
    } catch (err) {
      console.error('Erro ao inicializar microfone para afinação:', err);
      throw err;
    }
  }

  /**
   * Encerra a escuta do microfone
   */
  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }

    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }

    this.analyser = null;
    this.buffer = null;
  }

  public getRunningState(): boolean {
    return this.isRunning;
  }

  /**
   * Loop contínuo de amostragem e autocorrelação
   */
  private loop = (): void => {
    if (!this.isRunning || !this.analyser || !this.buffer || !this.audioCtx) return;

    this.analyser.getFloatTimeDomainData(this.buffer);

    // Calcular RMS (volume / energia)
    let sumSquares = 0;
    for (let i = 0; i < this.buffer.length; i++) {
      sumSquares += this.buffer[i] * this.buffer[i];
    }
    const rms = Math.sqrt(sumSquares / this.buffer.length);
    const volumePercent = Math.min(100, Math.round(rms * 400));

    if (rms < this.noiseThreshold) {
      // Silêncio ou ruído de fundo
      this.currentStableNoteId = null;
      this.stableNoteStartTime = 0;

      if (this.onPitchCallback) {
        this.onPitchCallback({
          frequency: 0,
          closestNote: TRUMPET_NOTES[6], // Default C4
          cents: 0,
          tuningState: 'too_quiet',
          volume: volumePercent,
          clarity: 0,
          isStable: false,
          stabilityDuration: 0,
        });
      }
    } else {
      // Detectar pitch por Autocorrelação com Interpolação Parabólica
      const { frequency, clarity } = this.detectPitchAutocorrelation(this.buffer, this.audioCtx.sampleRate);

      if (frequency > 65 && frequency < 1600 && clarity > 0.8) {
        const pitchInfo = this.evaluatePitch(frequency);

        // Atualizar estabilidade da nota sustentada
        const now = performance.now();
        let stabilityDuration = 0;
        const isCurrentlyInTune = Math.abs(pitchInfo.cents) <= 12;

        if (isCurrentlyInTune) {
          if (this.currentStableNoteId === pitchInfo.closestNote.id) {
            stabilityDuration = (now - this.stableNoteStartTime) / 1000;
          } else {
            this.currentStableNoteId = pitchInfo.closestNote.id;
            this.stableNoteStartTime = now;
            stabilityDuration = 0;
          }
        } else {
          this.currentStableNoteId = null;
          this.stableNoteStartTime = 0;
        }

        if (this.onPitchCallback) {
          this.onPitchCallback({
            frequency: Math.round(frequency * 10) / 10,
            closestNote: pitchInfo.closestNote,
            cents: pitchInfo.cents,
            tuningState: pitchInfo.tuningState,
            volume: volumePercent,
            clarity,
            isStable: stabilityDuration >= 0.8,
            stabilityDuration: Math.round(stabilityDuration * 10) / 10,
          });
        }
      } else {
        if (this.onPitchCallback) {
          this.onPitchCallback({
            frequency: 0,
            closestNote: TRUMPET_NOTES[6],
            cents: 0,
            tuningState: 'listening',
            volume: volumePercent,
            clarity,
            isStable: false,
            stabilityDuration: 0,
          });
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  /**
   * Algoritmo de Autocorrelação com refinamento parabólico
   */
  private detectPitchAutocorrelation(buffer: Float32Array<ArrayBuffer>, sampleRate: number): { frequency: number; clarity: number } {
    const SIZE = buffer.length;
    let r1 = 0;
    let r2 = SIZE - 1;
    const thres = 0.2;

    // Aparar bordas com pouco sinal
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < thres) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < thres) {
        r2 = SIZE - i;
        break;
      }
    }

    const trimmed = buffer.subarray(r1, r2);
    const c = new Float32Array(trimmed.length);

    for (let i = 0; i < trimmed.length; i++) {
      let sum = 0;
      for (let j = 0; j < trimmed.length - i; j++) {
        sum += trimmed[j] * trimmed[j + i];
      }
      c[i] = sum;
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;

    let maxval = -1;
    let maxpos = -1;
    for (let i = d; i < trimmed.length; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    let T0 = maxpos;

    // Interpolação parabólica para precisão sub-amostra
    if (maxpos > 0 && maxpos < trimmed.length - 1) {
      const x1 = c[maxpos - 1];
      const x2 = c[maxpos];
      const x3 = c[maxpos + 1];
      const a = (x1 + x3 - 2 * x2) / 2;
      const b = (x3 - x1) / 2;
      if (a) {
        T0 = T0 - b / (2 * a);
      }
    }

    const frequency = sampleRate / T0;
    const clarity = c[0] > 0 ? maxval / c[0] : 0;

    return { frequency, clarity };
  }

  /**
   * Avalia a frequência em relação às notas do trompete
   */
  public evaluatePitch(detectedFreq: number): {
    closestNote: NoteDefinition;
    cents: number;
    tuningState: TuningState;
  } {
    // No trompete em Bb, a frequência soada é 2 semitons abaixo da nota escrita (Bb3 = Dó4 escrito).
    // Se isTrumpetBbMode estiver ativo, comparamos com a frequência acústica da nota do trompete.
    let bestNote = TRUMPET_NOTES[0];
    let minCentsDiff = 9999;
    let computedCents = 0;

    for (const note of TRUMPET_NOTES) {
      // Frequência esperada da nota:
      // Se estamos em modo Trompete Bb, note.frequency já representa o som acústico que o trompete emite!
      const targetFreq = this.isTrumpetBbMode ? note.frequency : this.getConcertFrequency(note);
      const cents = 1200 * Math.log2(detectedFreq / targetFreq);

      if (Math.abs(cents) < Math.abs(minCentsDiff)) {
        minCentsDiff = cents;
        bestNote = note;
        computedCents = Math.round(cents);
      }
    }

    let tuningState: TuningState = 'perfect';
    if (computedCents < -8) {
      tuningState = 'flat'; // Muito baixo (bemol)
    } else if (computedCents > 8) {
      tuningState = 'sharp'; // Muito alto (sustenido)
    }

    return {
      closestNote: bestNote,
      cents: Math.max(-50, Math.min(50, computedCents)),
      tuningState,
    };
  }

  /**
   * Converte para frequência de concerto se não estiver no modo Bb
   */
  private getConcertFrequency(note: NoteDefinition): number {
    // Escala temperada igual padrão: f = 440 * 2^((semitones from A4)/12)
    // C4 som real = 261.63Hz
    const A4_FREQ = 440;
    // Semitons a partir de A4 (A4 = 0)
    const semitonesFromA4 = (note.octave - 4) * 12 + (note.semitoneIndex - 0);
    return A4_FREQ * Math.pow(2, semitonesFromA4 / 12);
  }

  /**
   * Toca o timbre sintético de trompete para o aluno escutar a nota correta
   */
  public playTrumpetTone(note: NoteDefinition, durationSeconds: number = 1.6): void {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = this.audioCtx && this.audioCtx.state === 'running' ? this.audioCtx : new AudioCtxClass();

      const now = ctx.currentTime;
      const targetFreq = this.isTrumpetBbMode ? note.frequency : this.getConcertFrequency(note);

      // Criar osciladores harmônicos para modelar o timbre de metal / trompete
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(targetFreq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(targetFreq * 2, now); // 2º harmônico

      osc3.type = 'sawtooth';
      osc3.frequency.setValueAtTime(targetFreq * 3, now); // 3º harmônico

      // Filtro passa-baixa dinâmico simulando a ressonância da campana do trompete
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(targetFreq * 1.5, now);
      filter.frequency.exponentialRampToValueAtTime(targetFreq * 4.5, now + 0.1);
      filter.frequency.exponentialRampToValueAtTime(targetFreq * 2.2, now + durationSeconds);
      filter.Q.setValueAtTime(2.5, now);

      // Envelope de ganho (Attack, Decay, Sustain, Release)
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(0.28, now + 0.08); // Ataque suave de sopro
      gainNode.gain.linearRampToValueAtTime(0.22, now + 0.3); // Sustentação
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds); // Release natural

      // Conexões
      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + durationSeconds + 0.1);
      osc2.stop(now + durationSeconds + 0.1);
      osc3.stop(now + durationSeconds + 0.1);
    } catch (err) {
      console.warn('Não foi possível reproduzir som sintético:', err);
    }
  }

  /**
   * Helper para obter AudioContext ativo
   */
  public getAudioContext(): AudioContext {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Toca o timbre acústico percussivo de Piano (Web Audio API)
   */
  public playPianoTone(
    target: number | NoteDefinition,
    durationSeconds: number = 2.0,
    velocity: number = 0.8
  ): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const freq =
        typeof target === 'number'
          ? target
          : this.isTrumpetBbMode
          ? target.frequency
          : this.getConcertFrequency(target);

      if (!freq || isNaN(freq)) return;

      const mainGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Filtro dinâmico de piano: cordas percutidas pelo martelo
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(freq * 7, 7500), now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.4, 200), now + durationSeconds);
      filter.Q.setValueAtTime(1.2, now);

      // Envelope percussivo de Piano
      mainGain.gain.setValueAtTime(0.0001, now);
      mainGain.gain.linearRampToValueAtTime(0.42 * velocity, now + 0.006); // Ataque imediato do martelo
      mainGain.gain.exponentialRampToValueAtTime(0.24 * velocity, now + 0.14); // Decay inicial
      mainGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds); // Decay suave

      // Harmônicos do piano com ligeira desafinação de corda dupla acústica (+0.5 Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(freq + 0.5, now);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);

      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + durationSeconds + 0.05);
      osc2.stop(now + durationSeconds + 0.05);
      osc3.stop(now + durationSeconds + 0.05);
    } catch (e) {
      console.warn('Erro ao reproduzir som de piano:', e);
    }
  }

  /**
   * Toca acordes para compor e estudar harmonia (tríades maiores, menores, etc.)
   */
  public playChord(
    notes: (number | NoteDefinition)[],
    durationSeconds: number = 2.4,
    timbre: 'piano' | 'trumpet' = 'piano'
  ): void {
    notes.forEach((n, idx) => {
      // Pequeno arpeggio sutil (14ms) para naturalidade musical
      window.setTimeout(() => {
        if (timbre === 'trumpet' && typeof n !== 'number') {
          this.playTrumpetTone(n, durationSeconds);
        } else {
          this.playPianoTone(n, durationSeconds, 0.72);
        }
      }, idx * 14);
    });
  }

  // Estado do acorde sustentado (Drone de Harmonia)
  private activeDroneNodes: { oscs: OscillatorNode[]; gain: GainNode } | null = null;
  public activeDroneName: string | null = null;

  /**
   * Inicia um acorde sustentado para o estudante afinar trompete sobre a harmonia
   */
  public startDroneChord(notes: (number | NoteDefinition)[], chordName: string): void {
    this.stopDroneChord();
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.4);
      gain.connect(ctx.destination);

      const oscs: OscillatorNode[] = [];
      notes.forEach((n) => {
        const freq = typeof n === 'number' ? n : (this.isTrumpetBbMode ? n.frequency : this.getConcertFrequency(n));
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(gain);
        osc.start(now);
        oscs.push(osc);
      });

      this.activeDroneNodes = { oscs, gain };
      this.activeDroneName = chordName;
    } catch (err) {
      console.warn('Erro ao iniciar drone chord:', err);
    }
  }

  /**
   * Para o acorde sustentado
   */
  public stopDroneChord(): void {
    if (this.activeDroneNodes) {
      try {
        const ctx = this.getAudioContext();
        const now = ctx.currentTime;
        this.activeDroneNodes.gain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
        const oldOscs = this.activeDroneNodes.oscs;
        window.setTimeout(() => {
          oldOscs.forEach((o) => {
            try {
              o.stop();
              o.disconnect();
            } catch (_) {}
          });
        }, 350);
      } catch (_) {}
      this.activeDroneNodes = null;
    }
    this.activeDroneName = null;
  }
  /**
   * Toca o som de trompete com surdina (Mute / Harmon Mute com corte de frequência e zumbido)
   */
  public playTrumpetMuteTone(note: NoteDefinition, durationSeconds: number = 1.6): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const targetFreq = this.isTrumpetBbMode ? note.frequency : this.getConcertFrequency(note);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(targetFreq, now);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(targetFreq * 2, now);

      // Filtro passa-faixa com ressonância alta simulando a câmara da surdina de trompete
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(Math.min(targetFreq * 2.8, 3800), now);
      filter.Q.setValueAtTime(6.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSeconds + 0.05);
      osc2.stop(now + durationSeconds + 0.05);
    } catch (e) {
      console.warn('Erro ao tocar som de surdina:', e);
    }
  }

  // Estado do drone sustentado de trompete para notas longas (Long Tone)
  private activeTrumpetDroneNodes: { oscs: OscillatorNode[]; gain: GainNode } | null = null;
  public activeTrumpetDroneNote: NoteDefinition | null = null;

  /**
   * Inicia nota longa contínua de trompete para o aluno estabilizar a embocadura
   */
  public startTrumpetDrone(note: NoteDefinition): void {
    this.stopTrumpetDrone();
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const targetFreq = this.isTrumpetBbMode ? note.frequency : this.getConcertFrequency(note);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(targetFreq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(targetFreq * 2, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(targetFreq * 3.5, now);
      filter.Q.setValueAtTime(2.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.20, now + 0.2);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      this.activeTrumpetDroneNodes = { oscs: [osc1, osc2], gain };
      this.activeTrumpetDroneNote = note;
    } catch (e) {
      console.warn('Erro ao iniciar trumpet drone:', e);
    }
  }

  /**
   * Para a nota longa sustentada
   */
  public stopTrumpetDrone(): void {
    if (this.activeTrumpetDroneNodes) {
      try {
        const ctx = this.getAudioContext();
        const now = ctx.currentTime;
        this.activeTrumpetDroneNodes.gain.gain.linearRampToValueAtTime(0.0001, now + 0.2);
        const oldOscs = this.activeTrumpetDroneNodes.oscs;
        window.setTimeout(() => {
          oldOscs.forEach((o) => {
            try {
              o.stop();
              o.disconnect();
            } catch (_) {}
          });
        }, 250);
      } catch (_) {}
      this.activeTrumpetDroneNodes = null;
    }
    this.activeTrumpetDroneNote = null;
  }

  public playMetronomeClick(accent: boolean, sound: 'wood' | 'beep' | 'drum' = 'wood', volume: number = 80): void {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = this.audioCtx && this.audioCtx.state === 'running' ? this.audioCtx : new AudioCtxClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const gainScale = Math.max(0.01, Math.min(1, volume / 100));

      if (sound === 'beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(accent ? 1200 : 800, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.35 * gainScale, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (sound === 'drum') {
        // Kick ou snare rápido
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(accent ? 240 : 160, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.5 * gainScale, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
      } else {
        // Wood block acústico (clique orgânico de madeira)
        const osc = ctx.createOscillator();
        const bandpass = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const baseFreq = accent ? 1040 : 780;
        osc.frequency.setValueAtTime(baseFreq, now);

        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(baseFreq, now);
        bandpass.Q.setValueAtTime(8, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.6 * gainScale, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.connect(bandpass);
        bandpass.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch (err) {
      console.warn('Erro ao reproduzir clique do metrônomo:', err);
    }
  }

  // Controle de reprodução de melodia/partitura
  private melodyTimeouts: number[] = [];
  public isMelodyPlaying: boolean = false;

  /**
   * Toca uma sequência de notas (partitura) no tempo
   */
  public playScoreMelody(
    notes: { note: NoteDefinition; durationSeconds: number }[],
    onNoteHighlight?: (index: number) => void,
    onFinish?: () => void
  ): void {
    this.stopScoreMelody();
    this.isMelodyPlaying = true;

    let accumulatedTime = 0;

    notes.forEach((item, index) => {
      const timeoutId = window.setTimeout(() => {
        if (!this.isMelodyPlaying) return;
        if (onNoteHighlight) onNoteHighlight(index);
        this.playTrumpetTone(item.note, Math.max(0.2, item.durationSeconds * 0.9));
      }, accumulatedTime * 1000);

      this.melodyTimeouts.push(timeoutId);
      accumulatedTime += item.durationSeconds;
    });

    const endTimeoutId = window.setTimeout(() => {
      this.isMelodyPlaying = false;
      this.melodyTimeouts = [];
      if (onFinish) onFinish();
    }, accumulatedTime * 1000);

    this.melodyTimeouts.push(endTimeoutId);
  }

  /**
   * Para a execução da melodia
   */
  public stopScoreMelody(): void {
    this.isMelodyPlaying = false;
    this.melodyTimeouts.forEach((id) => clearTimeout(id));
    this.melodyTimeouts = [];
  }
}

// Instância singleton para uso em todo o app
export const trumpetAudio = new AudioPitchEngine();
