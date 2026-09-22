import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Volume2, VolumeX, Music, Plus, Minus, RotateCcw } from 'lucide-react';
import { trumpetAudio } from '../utils/audioEngine';

interface MetronomeProps {
  initialBpm?: number;
  compact?: boolean;
}

export const Metronome: React.FC<MetronomeProps> = ({ initialBpm = 100, compact = false }) => {
  const [bpm, setBpm] = useState<number>(initialBpm);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState<number>(4);
  const [subdivision, setSubdivision] = useState<1 | 2>(1); // 1 = semínima, 2 = colcheia
  const [soundType, setSoundType] = useState<'wood' | 'beep' | 'drum'>('wood');
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0);

  // Tap tempo
  const tapTimesRef = useRef<number[]>([]);

  // Timers e estado do loop de áudio Web
  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  const bpmRef = useRef<number>(bpm);
  bpmRef.current = bpm;

  const beatsPerMeasureRef = useRef<number>(beatsPerMeasure);
  beatsPerMeasureRef.current = beatsPerMeasure;

  const subdivisionRef = useRef<number>(subdivision);
  subdivisionRef.current = subdivision;

  const soundTypeRef = useRef(soundType);
  soundTypeRef.current = soundType;

  const volumeRef = useRef(volume);
  volumeRef.current = isMuted ? 0 : volume;

  const timerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const currentSubBeatRef = useRef<number>(0);

  const tempoNames = [
    { name: 'Largo', range: [40, 60], bpm: 52 },
    { name: 'Adagio', range: [66, 76], bpm: 72 },
    { name: 'Andante', range: [76, 108], bpm: 92 },
    { name: 'Moderato', range: [108, 120], bpm: 112 },
    { name: 'Allegro', range: [120, 168], bpm: 132 },
    { name: 'Presto', range: [168, 208], bpm: 180 },
  ];

  const currentTempoName = tempoNames.find((t) => bpm >= t.range[0] && bpm <= t.range[1])?.name || 'Moderato';

  // Tocador de clique
  const playClick = useCallback((isAccent: boolean) => {
    if (volumeRef.current > 0) {
      trumpetAudio.playMetronomeClick(isAccent, soundTypeRef.current, volumeRef.current);
    }
  }, []);

  // Loop de agendamento preciso
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setCurrentBeat(0);
      return;
    }

    currentSubBeatRef.current = 0;
    const intervalMs = (60 / bpmRef.current / subdivisionRef.current) * 1000;

    // Disparar o primeiro beat imediatamente
    const totalSubBeatsPerMeasure = beatsPerMeasureRef.current * subdivisionRef.current;
    const isFirstAccent = true;
    playClick(isFirstAccent);
    setCurrentBeat(1);

    timerRef.current = window.setInterval(() => {
      currentSubBeatRef.current = (currentSubBeatRef.current + 1) % (beatsPerMeasureRef.current * subdivisionRef.current);
      
      const isQuarterBeat = currentSubBeatRef.current % subdivisionRef.current === 0;
      const measureBeatIndex = Math.floor(currentSubBeatRef.current / subdivisionRef.current);
      
      const isAccent = currentSubBeatRef.current === 0;
      playClick(isAccent);

      if (isQuarterBeat) {
        setCurrentBeat(measureBeatIndex + 1);
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, bpm, subdivision, beatsPerMeasure, playClick]);

  // Tap tempo handler
  const handleTap = () => {
    const now = performance.now();
    const taps = tapTimesRef.current;

    // Se passou mais de 2.5s desde o último tap, resetar
    if (taps.length > 0 && now - taps[taps.length - 1] > 2500) {
      tapTimesRef.current = [now];
      return;
    }

    taps.push(now);
    if (taps.length > 4) {
      taps.shift();
    }

    if (taps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 30 && calculatedBpm <= 260) {
        setBpm(calculatedBpm);
      }
    }
  };

  const adjustBpm = (delta: number) => {
    setBpm((prev) => Math.min(260, Math.max(30, prev + delta)));
  };

  if (compact) {
    return (
      <div id="metronome-compact" className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <button
            id="metronome-compact-toggle"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white transition-all shadow-md ${
              isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-amber-400 font-mono">{bpm}</span>
              <span className="text-xs text-slate-400 font-medium">BPM</span>
            </div>
            <div className="text-[11px] text-slate-400">{beatsPerMeasure}/4 • {currentTempoName}</div>
          </div>
        </div>

        {/* Indicadores de Batida Compactos */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: beatsPerMeasure }).map((_, i) => {
            const beatNum = i + 1;
            const isActive = isPlaying && currentBeat === beatNum;
            const isAccent = beatNum === 1;
            return (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-75 ${
                  isActive
                    ? isAccent
                      ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-500/50'
                      : 'bg-emerald-400 scale-110 shadow-md shadow-emerald-500/50'
                    : 'bg-slate-700'
                }`}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => adjustBpm(-1)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => adjustBpm(1)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="metronome-full" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Metrônomo do Trompetista</h2>
            <p className="text-xs text-slate-500">Desenvolva precisão rítmica, fôlego e estabilidade métrica</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="metronome-mute-btn"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-xl border transition-colors ${
              isMuted
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title={isMuted ? 'Desmutar' : 'Silenciar áudio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Visor Central de BPM e Batidas */}
      <div className="py-6 flex flex-col items-center justify-center bg-slate-50/80 rounded-2xl border border-slate-100 my-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-3 py-0.5 rounded-full mb-2">
          {currentTempoName}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-black text-slate-900 tracking-tight font-mono">{bpm}</span>
          <span className="text-sm font-semibold text-slate-500">BPM</span>
        </div>

        {/* Indicadores Visuais de Batidas */}
        <div className="flex items-center gap-3 mt-6">
          {Array.from({ length: beatsPerMeasure }).map((_, i) => {
            const beatNum = i + 1;
            const isActive = isPlaying && currentBeat === beatNum;
            const isAccent = beatNum === 1;

            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-75 ${
                    isActive
                      ? isAccent
                        ? 'bg-amber-500 text-white scale-110 shadow-lg shadow-amber-500/40 ring-4 ring-amber-200'
                        : 'bg-emerald-500 text-white scale-105 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-200'
                      : 'bg-white border border-slate-200 text-slate-400'
                  }`}
                >
                  {beatNum}
                </div>
                <span className="text-[10px] font-medium text-slate-400">
                  {isAccent ? 'Forte' : 'Fraco'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controles de BPM (Slider + Botões) */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => adjustBpm(-5)}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            -5
          </button>
          <button
            onClick={() => adjustBpm(-1)}
            className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="range"
            min="30"
            max="260"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="flex-1 accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          <button
            onClick={() => adjustBpm(1)}
            className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => adjustBpm(5)}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            +5
          </button>
        </div>

        {/* Botão de Tap Tempo e Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <button
            id="metronome-tap-btn"
            onClick={handleTap}
            className="px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Tap Tempo (Clique no Ritmo)
          </button>

          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {tempoNames.map((t) => (
              <button
                key={t.name}
                onClick={() => setBpm(t.bpm)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                  bpm >= t.range[0] && bpm <= t.range[1]
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Configurações de Compasso, Subdivisão e Som */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-100 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">Fórmula de Compasso</label>
          <div className="grid grid-cols-4 gap-1">
            {[2, 3, 4, 6].map((beats) => (
              <button
                key={beats}
                onClick={() => setBeatsPerMeasure(beats)}
                className={`py-1.5 rounded-lg font-bold border transition-colors ${
                  beatsPerMeasure === beats
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {beats}/4
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">Subdivisão Rítmica</label>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setSubdivision(1)}
              className={`py-1.5 rounded-lg font-bold border transition-colors ${
                subdivision === 1
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Semínima (1x)
            </button>
            <button
              onClick={() => setSubdivision(2)}
              className={`py-1.5 rounded-lg font-bold border transition-colors ${
                subdivision === 2
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Colcheia (2x)
            </button>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">Timbre do Clique</label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'wood', label: 'Madeira' },
              { id: 'beep', label: 'Digital' },
              { id: 'drum', label: 'Bateria' },
            ].map((snd) => (
              <button
                key={snd.id}
                onClick={() => setSoundType(snd.id as 'wood' | 'beep' | 'drum')}
                className={`py-1.5 rounded-lg font-bold border transition-colors ${
                  soundType === snd.id
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {snd.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botão de Iniciar / Parar em Destaque */}
      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <span className="text-xs text-slate-500 font-mono">{volume}%</span>
        </div>

        <button
          id="metronome-main-toggle-btn"
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-lg active:scale-95 ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              Parar Metrônomo
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Iniciar Metrônomo
            </>
          )}
        </button>
      </div>
    </div>
  );
};
