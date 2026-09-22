import React, { useState, useEffect, useCallback } from 'react';
import {
  Volume2,
  Keyboard,
  Sliders,
  Edit3,
  HelpCircle,
  Play,
  Square,
  Layers,
  ArrowRight,
  Info,
  Sparkles,
  RotateCcw,
  Zap,
  Wind,
  CheckCircle,
} from 'lucide-react';
import { NoteDefinition } from '../types';
import { trumpetAudio } from '../utils/audioEngine';
import {
  PC_KEYBOARD_MAPPINGS,
  findNoteDefinition,
} from '../data/pianoKeyboardMap';
import {
  TRUMPET_VALVE_COMBINATIONS,
  ValveCombinationGroup,
  getValveGroupByArray,
  HarmonicSeriesLevel,
  OCTAVE_FINGERING_COMPARISONS,
  OctaveFingeringComparison,
} from '../data/trumpetValveMap';
import { TRUMPET_NOTES } from '../data/trumpetData';

interface TrumpetKeyboardPanelProps {
  onSelectTargetNote?: (note: NoteDefinition) => void;
  onInsertNoteToScore?: (note: NoteDefinition, duration: number) => void;
  targetNoteId?: string;
  isCompact?: boolean;
  scoreEditorActive?: boolean;
  activeContext?: 'tuner' | 'score' | 'exercises' | 'standalone';
}

export const TrumpetKeyboardPanel: React.FC<TrumpetKeyboardPanelProps> = ({
  onSelectTargetNote,
  onInsertNoteToScore,
  targetNoteId = 'C4',
  isCompact = false,
  scoreEditorActive = false,
  activeContext = 'standalone',
}) => {
  // Estado dos 3 Pistões Mecânicos do Trompete
  const initialNote = findNoteDefinition(targetNoteId);
  const [valves, setValves] = useState<[boolean, boolean, boolean]>(initialNote.valvesBb);
  const [lastPlayedNote, setLastPlayedNote] = useState<NoteDefinition>(initialNote);
  const [activeNoteId, setActiveNoteId] = useState<string>(targetNoteId);

  // Gatilho móvel da pompa do 3º pistão (Slide Trigger de afinação)
  const [triggerSlideExtended, setTriggerSlideExtended] = useState<boolean>(false);

  // Configurações de Áudio
  const [soundTimbre, setSoundTimbre] = useState<'trumpet' | 'mute' | 'piano'>('trumpet');
  const [keyboardShortcutsEnabled, setKeyboardShortcutsEnabled] = useState<boolean>(true);
  const [showHotkeyGuide, setShowHotkeyGuide] = useState<boolean>(true);

  // Drone de Som Contínuo de Trompete (Estudo de Notas Longas / Long Tones)
  const [isDronePlaying, setIsDronePlaying] = useState<boolean>(false);

  // Série Harmônica e Lip Slurs
  const currentValveGroup: ValveCombinationGroup = getValveGroupByArray(valves);
  const [selectedHarmonic, setSelectedHarmonic] = useState<HarmonicSeriesLevel | null>(null);
  const [isArpeggiatingSeries, setIsArpeggiatingSeries] = useState<boolean>(false);

  // Inserção na Partitura
  const [insertDuration, setInsertDuration] = useState<number>(1); // 1 = Semínima

  // Filtro Didático da Ordem Natural & Oitavas (8ª e 16ª acima)
  const [octaveFilter, setOctaveFilter] = useState<'all' | 'grave' | '8va' | '16va'>('all');

  // Tocar uma nota no trompete com feedback visual
  const playTrumpetNote = useCallback(
    (noteDef: NoteDefinition, fromKeyboard: boolean = false) => {
      // Ajustar pistões visuais para a digitação da nota
      setValves(noteDef.valvesBb);
      setActiveNoteId(noteDef.id);
      setLastPlayedNote(noteDef);

      // Gatilho automático visual para C#4 e D4
      const needsTrigger = noteDef.id === 'C#4' || noteDef.id === 'D4';
      setTriggerSlideExtended(needsTrigger);

      // Reproduzir timbre selecionado
      if (soundTimbre === 'trumpet') {
        trumpetAudio.playTrumpetTone(noteDef, 1.8);
      } else if (soundTimbre === 'mute') {
        trumpetAudio.playTrumpetMuteTone(noteDef, 1.8);
      } else {
        trumpetAudio.playPianoTone(noteDef, 1.8, 0.85);
      }

      // Notificar afinador se prop fornecida
      if (onSelectTargetNote) {
        onSelectTargetNote(noteDef);
      }

      // Inserir na partitura se modo de edição estiver ativo
      if (scoreEditorActive && onInsertNoteToScore) {
        onInsertNoteToScore(noteDef, insertDuration);
      }
    },
    [soundTimbre, onSelectTargetNote, scoreEditorActive, onInsertNoteToScore, insertDuration]
  );

  // Alternar um pistão individualmente (clicando no botão pérola)
  const handleToggleValve = (valveIndex: number) => {
    const newV: [boolean, boolean, boolean] = [...valves];
    newV[valveIndex] = !newV[valveIndex];
    setValves(newV);

    // Encontrar nota correspondente no registro médio/padrão
    const group = getValveGroupByArray(newV);
    if (group.harmonics.length > 0) {
      // Pega o harmônico médio mais acessível (nível 2 ou 3)
      const targetHarmonic = group.harmonics[1] || group.harmonics[0];
      const foundNote = findNoteDefinition(targetHarmonic.noteId);
      playTrumpetNote(foundNote);
    }
  };

  // Selecionar uma combinação rápida de pistões
  const handleSelectValveCombination = (combo: ValveCombinationGroup) => {
    setValves(combo.valves);
    const primaryHarmonic = combo.harmonics[0];
    if (primaryHarmonic) {
      const foundNote = findNoteDefinition(primaryHarmonic.noteId);
      playTrumpetNote(foundNote);
    }
  };

  // Alternar nota contínua de trompete (Drone de Som / Long Tones)
  const handleToggleTrumpetDrone = () => {
    if (isDronePlaying) {
      trumpetAudio.stopTrumpetDrone();
      setIsDronePlaying(false);
    } else {
      trumpetAudio.startTrumpetDrone(lastPlayedNote);
      setIsDronePlaying(true);
    }
  };

  // Parar drone ao desmontar
  useEffect(() => {
    return () => {
      trumpetAudio.stopTrumpetDrone();
    };
  }, []);

  // Tocar arpejo da série harmônica (Lip Slurs de flexibilidade labial)
  const handlePlayLipSlurArpeggio = () => {
    if (isArpeggiatingSeries) return;
    setIsArpeggiatingSeries(true);

    const harmonicsList = currentValveGroup.harmonics;
    harmonicsList.forEach((harm, idx) => {
      window.setTimeout(() => {
        const noteDef = findNoteDefinition(harm.noteId);
        playTrumpetNote(noteDef);
        setSelectedHarmonic(harm);

        if (idx === harmonicsList.length - 1) {
          setIsArpeggiatingSeries(false);
        }
      }, idx * 360);
    });
  };

  // Escuta de Teclado do Computador (PC Hotkeys das 3 Linhas + Teclas 1, 2, 3)
  useEffect(() => {
    if (!keyboardShortcutsEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar se o usuário estiver digitando em campo de texto
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return;
      }

      const key = e.key.toLowerCase();

      // Teclas 1, 2, 3 para alternar pistões manuais
      if (key === '1') {
        e.preventDefault();
        handleToggleValve(0);
        return;
      }
      if (key === '2') {
        e.preventDefault();
        handleToggleValve(1);
        return;
      }
      if (key === '3') {
        e.preventDefault();
        handleToggleValve(2);
        return;
      }

      // Mapeamento das 3 Linhas (QWERT, ASDFG, ZXCVB)
      const mapping = PC_KEYBOARD_MAPPINGS[key];
      if (mapping) {
        if (e.key === ' ' || e.key === '/') {
          e.preventDefault();
        }
        const noteDef = findNoteDefinition(mapping.targetNoteId);
        playTrumpetNote(noteDef, true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboardShortcutsEnabled, playTrumpetNote, valves]);

  // Lista de notas das 3 linhas para os botões do painel
  const sharpNotes = [
    { key: 'Q', id: 'C#4', label: 'Dó♯4', abc: '3#', valves: '1-2-3' },
    { key: 'W', id: 'D#4', label: 'Ré♯4', abc: '4#', valves: '2-3' },
    { key: 'E', id: 'F#4', label: 'Fá♯4', abc: '6#', valves: '2' },
    { key: 'R', id: 'G#4', label: 'Sol♯4', abc: '7#', valves: '2-3' },
    { key: 'T', id: 'Bb4', label: 'Lá♯4', abc: '1#', valves: '1' },
    { key: 'Y', id: 'C#5', label: 'Dó♯5', abc: '3#', valves: '1-2' },
    { key: 'U', id: 'D#5', label: 'Ré♯5', abc: '4#', valves: '2' },
    { key: 'I', id: 'F#5', label: 'Fá♯5', abc: '6#', valves: '2' },
    { key: 'O', id: 'G#5', label: 'Sol♯5', abc: '7#', valves: '2-3' },
    { key: 'P', id: 'Bb5', label: 'Lá♯5', abc: '1#', valves: '1' },
  ];

  const naturalNotes = [
    { key: 'A', id: 'C4', label: 'Dó4', abc: '3', valves: '0' },
    { key: 'S', id: 'D4', label: 'Ré4', abc: '4', valves: '1-3' },
    { key: 'D', id: 'E4', label: 'Mi4', abc: '5', valves: '1-2' },
    { key: 'F', id: 'F4', label: 'Fá4', abc: '6', valves: '1' },
    { key: 'G', id: 'G4', label: 'Sol4', abc: '7', valves: '0' },
    { key: 'H', id: 'A4', label: 'Lá4', abc: '1', valves: '1-2' },
    { key: 'J', id: 'B4', label: 'Si4', abc: '2', valves: '2' },
    { key: 'K', id: 'C5', label: 'Dó5', abc: '3', valves: '0' },
    { key: 'L', id: 'D5', label: 'Ré5', abc: '4', valves: '1' },
    { key: 'Ç', id: 'E5', label: 'Mi5', abc: '5', valves: '0' },
  ];

  const flatNotes = [
    { key: 'Z', id: 'C#4', label: 'Ré♭4', abc: '4b', valves: '1-2-3' },
    { key: 'X', id: 'D#4', label: 'Mi♭4', abc: '5b', valves: '2-3' },
    { key: 'C', id: 'F#4', label: 'Sol♭4', abc: '7b', valves: '2' },
    { key: 'V', id: 'G#4', label: 'Lá♭4', abc: '1b', valves: '2-3' },
    { key: 'B', id: 'Bb4', label: 'Si♭4', abc: '2b', valves: '1' },
    { key: 'N', id: 'C#5', label: 'Ré♭5', abc: '4b', valves: '1-2' },
    { key: 'M', id: 'D#5', label: 'Mi♭5', abc: '5b', valves: '2' },
    { key: ',', id: 'F#5', label: 'Sol♭5', abc: '7b', valves: '2' },
    { key: '.', id: 'G#5', label: 'Lá♭5', abc: '1b', valves: '2-3' },
    { key: '/', id: 'Bb5', label: 'Si♭5', abc: '2b', valves: '1' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
      {/* CABEÇALHO DO PAINEL DE TROMPETE & PISTÕES */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 flex items-center justify-center font-bold text-xl shadow-md shadow-amber-500/30">
            🎺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Trompete & Pistões Interativos
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase border border-amber-500/30">
                Atalhos PC (QWERT / ASDFG / ZXCVB)
              </span>
            </div>
            <p className="text-xs text-amber-200/80">
              Simulador Mecânico de Pistões, Flexibilidade Labial (Lip Slurs) e Afinação em Tempo Real
            </p>
          </div>
        </div>

        {/* CONTROLES DO CABEÇALHO: TIMBRES, ATALHOS E GUIA */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seletor de Timbres do Trompete */}
          <div className="flex items-center bg-stone-900/90 p-1 rounded-xl border border-amber-800/60 text-xs">
            <button
              type="button"
              id="trumpet-timbre-open"
              onClick={() => setSoundTimbre('trumpet')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                soundTimbre === 'trumpet'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
              title="Trompete Aberto (Brilhante e com projeção metálica)"
            >
              <span>🎺</span>
              <span>Aberto</span>
            </button>
            <button
              type="button"
              id="trumpet-timbre-mute"
              onClick={() => setSoundTimbre('mute')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                soundTimbre === 'mute'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
              title="Trompete com Surdina Harmon/Straight Mute (Zumbido característico de jazz)"
            >
              <span>🔇</span>
              <span>Surdina</span>
            </button>
            <button
              type="button"
              id="trumpet-timbre-piano"
              onClick={() => setSoundTimbre('piano')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                soundTimbre === 'piano'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
              title="Piano Acústico de Referência"
            >
              <span>🎹</span>
              <span>Piano</span>
            </button>
          </div>

          {/* Toggle de Atalhos do Teclado PC */}
          <button
            type="button"
            id="trumpet-toggle-hotkeys"
            onClick={() => setKeyboardShortcutsEnabled(!keyboardShortcutsEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              keyboardShortcutsEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
            title="Ativar/Desativar digitação pelas teclas do teclado"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teclas PC:</span>
            <span>{keyboardShortcutsEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Toggle Guia de Teclas */}
          <button
            type="button"
            id="trumpet-toggle-guide"
            onClick={() => setShowHotkeyGuide(!showHotkeyGuide)}
            className={`p-1.5 rounded-xl text-xs transition-all border ${
              showHotkeyGuide
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
            title="Mostrar/Ocultar mapa de teclas do PC"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GUIA RETRÁTIL DAS 3 LINHAS DO TECLADO PC */}
      {showHotkeyGuide && (
        <div className="bg-amber-50/90 border-b border-amber-200 p-3 sm:p-4 text-xs">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5 font-black text-amber-950">
                <Keyboard className="w-4 h-4 text-amber-700" />
                <span>Mapeamento de Teclas do PC para Trompete Si♭:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-bold">
                  Dica: Você também pode usar as teclas <strong>1</strong>, <strong>2</strong> e <strong>3</strong> para alternar os pistões manuais!
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* LINHA QWERT */}
              <div className="bg-white p-2.5 rounded-2xl border border-emerald-200 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Linha QWERT: Tons Sustenidos (♯)
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-black">
                    Acidentes
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  {sharpNotes.slice(0, 7).map((n) => (
                    <span
                      key={n.key}
                      className="inline-flex items-center gap-1 bg-stone-900 text-white px-1.5 py-0.5 rounded-md font-bold"
                    >
                      <kbd className="text-emerald-400 font-black">{n.key}</kbd>
                      <span className="text-stone-300 font-sans">{n.label}</span>
                      <span className="text-amber-400 text-[9px]">({n.valves})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* LINHA ASDFG */}
              <div className="bg-white p-2.5 rounded-2xl border border-sky-200 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sky-900 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    Linha ASDFG: Tons Normais (♮)
                  </span>
                  <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-black">
                    Naturais
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  {naturalNotes.slice(0, 8).map((n) => (
                    <span
                      key={n.key}
                      className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 border border-stone-300 px-1.5 py-0.5 rounded-md font-bold"
                    >
                      <kbd className="text-sky-700 font-black">{n.key}</kbd>
                      <span className="text-stone-600 font-sans">{n.label}</span>
                      <span className="text-amber-700 text-[9px]">({n.valves})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* LINHA ZXCVB */}
              <div className="bg-white p-2.5 rounded-2xl border border-amber-300 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-amber-950 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Linha ZXCVB: Tons Bemóis (♭)
                  </span>
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-black">
                    Enarmônicos
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  {flatNotes.slice(0, 7).map((n) => (
                    <span
                      key={n.key}
                      className="inline-flex items-center gap-1 bg-stone-800 text-white px-1.5 py-0.5 rounded-md font-bold"
                    >
                      <kbd className="text-amber-400 font-black">{n.key}</kbd>
                      <span className="text-stone-300 font-sans">{n.label}</span>
                      <span className="text-amber-400 text-[9px]">({n.valves})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ÁREA CENTRAL: O SIMULADOR MECÂNICO DO TROMPETE */}
      <div className="p-4 sm:p-6 bg-stone-100 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          {/* SIMULADOR VISUAL DA CAIXA DE PISTÕES E CORPO DO TROMPETE */}
          <div className="bg-gradient-to-b from-stone-900 via-stone-850 to-stone-950 p-5 sm:p-6 rounded-3xl border-4 border-amber-700/60 shadow-2xl relative overflow-hidden">
            {/* Tubo Superior do Trompete e Campana Decorativa */}
            <div className="absolute top-4 left-6 right-6 h-3 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-full opacity-70 shadow-sm"></div>
            <div className="absolute bottom-4 left-6 right-6 h-3 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-full opacity-70 shadow-sm"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* LADO ESQUERDO: OS 3 PISTÕES MECÂNICOS DO TROMPETE */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-between w-full px-2 mb-2 text-amber-200 text-xs font-black tracking-wider uppercase">
                  <span className="text-center w-20">Pistão 1<br/><span className="text-[10px] text-amber-400 font-normal font-sans">Indicador (Tecla 1)</span></span>
                  <span className="text-center w-20">Pistão 2<br/><span className="text-[10px] text-amber-400 font-normal font-sans">Médio (Tecla 2)</span></span>
                  <span className="text-center w-20">Pistão 3<br/><span className="text-[10px] text-amber-400 font-normal font-sans">Anelar (Tecla 3)</span></span>
                </div>

                <div className="flex items-center justify-center gap-4 p-3 bg-stone-950/70 rounded-2xl border-2 border-amber-600/40 shadow-inner">
                  {[0, 1, 2].map((idx) => {
                    const isPressed = valves[idx];
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        {/* Haste do Pistão que desce quando pressionado */}
                        <div
                          className={`w-4 rounded-t-sm transition-all duration-150 ${
                            isPressed
                              ? 'h-3 bg-amber-200 shadow-inner'
                              : 'h-9 bg-gradient-to-b from-amber-100 to-amber-300 shadow-md'
                          }`}
                        />

                        {/* Botão Pérola (Clicável pelo aluno) */}
                        <button
                          type="button"
                          id={`trumpet-panel-valve-${idx + 1}`}
                          onClick={() => handleToggleValve(idx)}
                          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center font-black transition-all duration-150 shadow-xl border-3 cursor-pointer ${
                            isPressed
                              ? 'bg-gradient-to-tr from-emerald-500 via-emerald-600 to-emerald-400 text-white border-emerald-300 scale-95 ring-4 ring-emerald-400/50 shadow-emerald-500/40 translate-y-2'
                              : 'bg-gradient-to-tr from-stone-100 via-amber-50 to-stone-200 text-stone-800 border-amber-400/90 hover:border-amber-300 hover:scale-105 active:translate-y-1'
                          }`}
                          title={`Clique para alternar o Pistão ${idx + 1} ou use a tecla ${idx + 1} no teclado`}
                        >
                          <span className="text-2xl leading-none font-black font-mono">
                            {idx + 1}
                          </span>
                          <span className={`text-[9px] uppercase font-bold tracking-tight mt-0.5 ${isPressed ? 'text-emerald-100' : 'text-stone-500'}`}>
                            {isPressed ? 'Apertado' : 'Solto'}
                          </span>
                        </button>

                        {/* Camisa do Pistão e mola mecânica */}
                        <div className="w-12 h-9 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 rounded-b-lg border-t-2 border-stone-900 mt-1 flex items-center justify-center shadow-inner">
                          <div
                            className={`w-3 h-3 rounded-full transition-colors ${
                              isPressed ? 'bg-emerald-400 animate-pulse' : 'bg-amber-900'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Resumo da Posição dos Pistões */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-900/80 border border-amber-500/40 text-amber-200 font-mono text-xs font-black">
                    Posição Atual: {currentValveGroup.displayFormula}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setValves([false, false, false]);
                      playTrumpetNote(findNoteDefinition('C4'));
                    }}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-[10px] font-bold border border-stone-700 flex items-center gap-1 transition-colors"
                    title="Soltar todos os pistões (Posição 0 Aberta)"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Zerar (0)</span>
                  </button>
                </div>
              </div>

              {/* LADO DIREITO: GATILHO DA POMPA DO 3º PISTÃO E DICA DIDÁTICA */}
              <div className="flex-1 w-full lg:w-auto bg-stone-900/80 p-4 rounded-2xl border border-amber-800/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Gatilho Móvel de Afinação (3º Pisto)
                    </span>
                    <button
                      type="button"
                      onClick={() => setTriggerSlideExtended(!triggerSlideExtended)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all border ${
                        triggerSlideExtended
                          ? 'bg-amber-500 text-stone-950 border-amber-300'
                          : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                      }`}
                    >
                      {triggerSlideExtended ? 'Pompa Estendida (-15c)' : 'Pompa Recolhida (0c)'}
                    </button>
                  </div>

                  <p className="text-xs text-stone-300 mb-3">
                    {currentValveGroup.requiresTriggerSlide ? (
                      <span className="text-amber-300 font-bold">
                        ⚠️ Atenção: Esta digitação ({currentValveGroup.displayFormula}) tende a soar alta! O gatilho de afinação deve ser empurrado para afinar a nota com precisão.
                      </span>
                    ) : (
                      <span>
                        Comprimento acústico ativo: <strong className="text-amber-200">{currentValveGroup.tubeLengthDescription}</strong>.
                      </span>
                    )}
                  </p>

                  {/* Visual do Gatilho Deslizando */}
                  <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex items-center gap-3">
                    <span className="text-[11px] font-mono text-stone-400">Pompa:</span>
                    <div className="flex-1 h-3 bg-stone-800 rounded-full overflow-hidden p-0.5 relative">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          triggerSlideExtended
                            ? 'w-3/4 bg-amber-400 shadow-md shadow-amber-400/50'
                            : 'w-1/4 bg-stone-600'
                        }`}
                      />
                    </div>
                    <span className={`text-[11px] font-mono font-bold ${triggerSlideExtended ? 'text-amber-400' : 'text-stone-500'}`}>
                      {triggerSlideExtended ? '+2.2 cm (Afinado)' : '0 cm'}
                    </span>
                  </div>
                </div>

                {/* BOTÕES DAS 7 POSIÇÕES NA ORDEM NATURAL NUMÉRICA DOS PISTÕES */}
                <div className="mt-4 pt-3 border-t border-stone-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      Ordem Natural Numérica dos Pistões:
                    </span>
                    <span className="text-[9px] text-stone-400 font-mono">
                      0 solto → 1 → 12 → 2 → 13 → 23 → 123
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TRUMPET_VALVE_COMBINATIONS.map((combo, idx) => {
                      const isSelected =
                        valves[0] === combo.valves[0] &&
                        valves[1] === combo.valves[1] &&
                        valves[2] === combo.valves[2];
                      const shortCode = combo.displayFormula.split(' ')[0];
                      return (
                        <button
                          key={combo.id}
                          type="button"
                          id={`trumpet-valve-combo-btn-${combo.id}`}
                          onClick={() => handleSelectValveCombination(combo)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-black transition-all flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md ring-2 ring-amber-300'
                              : 'bg-stone-800/90 text-stone-200 hover:bg-stone-700 hover:text-white border-stone-700'
                          }`}
                          title={`${combo.displayFormula}: ${combo.tubeLengthDescription}`}
                        >
                          <span className={`text-[10px] ${isSelected ? 'text-stone-900 font-bold' : 'text-amber-400'}`}>
                            #{idx + 1}
                          </span>
                          <span>{shortCode}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BARRA DE INFORMAÇÕES DA NOTA TOCADA */}
          <div className="mt-3 bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex flex-col items-center justify-center font-black shadow-sm">
                <span className="text-base leading-none">{lastPlayedNote.letter}</span>
                <span className="text-[10px] text-amber-200">{lastPlayedNote.numberNotation}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-stone-900">
                    {lastPlayedNote.solfege} ({lastPlayedNote.letter}) • Sistema ABC: [{lastPlayedNote.numberNotation}]
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-bold font-mono">
                    {lastPlayedNote.frequency.toFixed(1)} Hz
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold font-mono">
                    Pistões: {lastPlayedNote.fingerDescription}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  {lastPlayedNote.description || 'Embocadura e coluna de ar alinhadas com a ressonância do tubo.'}
                </p>
              </div>
            </div>

            {/* AÇÕES: DRONE DE NOTA LONGA, AFINADOR E PARTITURA */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Drone de Som Contínuo de Trompete */}
              <button
                type="button"
                id="trumpet-btn-toggle-drone"
                onClick={handleToggleTrumpetDrone}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs border transition-all ${
                  isDronePlaying
                    ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                    : 'bg-stone-100 hover:bg-amber-100 text-stone-800 border-stone-200'
                }`}
                title="Sustentar som contínuo para praticar afinação e notas longas (Long Tones)"
              >
                {isDronePlaying ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-700" />}
                <span>{isDronePlaying ? 'Parar Nota Longa' : 'Nota Longa (Drone)'}</span>
              </button>

              {/* Fixar no Afinador */}
              {onSelectTargetNote && (
                <button
                  type="button"
                  id="trumpet-btn-set-tuner-target"
                  onClick={() => onSelectTargetNote(lastPlayedNote)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-950 font-bold text-xs border border-stone-200 transition-colors"
                  title="Definir esta nota como alvo no afinador com ponteiro"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-700" />
                  <span>Fixar no Afinador</span>
                </button>
              )}

              {/* Inserir na Partitura */}
              {scoreEditorActive && onInsertNoteToScore && (
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-600 px-1">Duração:</span>
                  {[
                    { dur: 4, label: '4t' },
                    { dur: 2, label: '2t' },
                    { dur: 1, label: '1t' },
                    { dur: 0.5, label: '0.5t' },
                  ].map((d) => (
                    <button
                      key={d.dur}
                      type="button"
                      onClick={() => setInsertDuration(d.dur)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                        insertDuration === d.dur
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {d.dur}t
                    </button>
                  ))}
                  <button
                    type="button"
                    id="trumpet-btn-insert-score"
                    onClick={() => onInsertNoteToScore(lastPlayedNote, insertDuration)}
                    className="ml-1 flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black transition-all shadow-xs"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>+ Partitura</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DOS BOTÕES INTERATIVOS DAS 3 LINHAS DO TECLADO PC (CLICÁVEIS OU TECLÁVEIS) */}
      <div className="p-4 sm:p-5 bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-amber-600" />
              Teclas do Trompete por Fileira (Clique ou pressione no teclado do seu PC):
            </span>
          </div>

          {/* FILEIRA 1: QWERT (SUSTENIDOS) */}
          <div className="bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-200">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[11px] font-extrabold text-emerald-900">
                Linha Superior (QWERT) • Tons Sustenidos (♯):
              </span>
              <span className="text-[10px] text-emerald-700 font-mono">Teclas Q W E R T Y U I O P</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {sharpNotes.map((n) => {
                const isCurrent = activeNoteId === n.id;
                const noteDef = findNoteDefinition(n.id);
                return (
                  <button
                    key={n.key}
                    type="button"
                    id={`trumpet-key-sharp-${n.key}`}
                    onClick={() => playTrumpetNote(noteDef, true)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102 ring-2 ring-emerald-400'
                        : 'bg-white hover:bg-emerald-100/70 text-stone-800 border-emerald-200'
                    }`}
                  >
                    <kbd className={`w-5 h-5 rounded flex items-center justify-center font-mono font-black text-[10px] mb-0.5 ${
                      isCurrent ? 'bg-emerald-800 text-white' : 'bg-stone-900 text-emerald-400'
                    }`}>
                      {n.key}
                    </kbd>
                    <span className="text-xs font-black leading-tight">{n.label}</span>
                    <span className={`text-[10px] font-extrabold ${isCurrent ? 'text-emerald-100' : 'text-amber-800'}`}>
                      [{n.abc}]
                    </span>
                    <span className={`text-[9px] font-mono mt-0.5 ${isCurrent ? 'text-emerald-200' : 'text-stone-500'}`}>
                      ({n.valves})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FILEIRA 2: ASDFG (NATURAIS) */}
          <div className="bg-sky-50/60 p-2.5 rounded-2xl border border-sky-200">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[11px] font-extrabold text-sky-900">
                Linha Central (ASDFG) • Tons Normais (♮):
              </span>
              <span className="text-[10px] text-sky-700 font-mono">Teclas A S D F G H J K L Ç</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {naturalNotes.map((n) => {
                const isCurrent = activeNoteId === n.id;
                const noteDef = findNoteDefinition(n.id);
                return (
                  <button
                    key={n.key}
                    type="button"
                    id={`trumpet-key-natural-${n.key}`}
                    onClick={() => playTrumpetNote(noteDef, true)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-sky-600 text-white border-sky-700 shadow-md scale-102 ring-2 ring-sky-400'
                        : 'bg-white hover:bg-sky-100/70 text-stone-800 border-sky-200'
                    }`}
                  >
                    <kbd className={`w-5 h-5 rounded flex items-center justify-center font-mono font-black text-[10px] mb-0.5 ${
                      isCurrent ? 'bg-sky-800 text-white' : 'bg-sky-100 text-sky-900 border border-sky-300'
                    }`}>
                      {n.key}
                    </kbd>
                    <span className="text-xs font-black leading-tight">{n.label}</span>
                    <span className={`text-[10px] font-extrabold ${isCurrent ? 'text-sky-100' : 'text-amber-800'}`}>
                      [{n.abc}]
                    </span>
                    <span className={`text-[9px] font-mono mt-0.5 ${isCurrent ? 'text-sky-200' : 'text-stone-500'}`}>
                      ({n.valves})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FILEIRA 3: ZXCVB (BEMÓIS) */}
          <div className="bg-amber-50/60 p-2.5 rounded-2xl border border-amber-300">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[11px] font-extrabold text-amber-950">
                Linha Inferior (ZXCVB) • Tons Bemóis (♭):
              </span>
              <span className="text-[10px] text-amber-800 font-mono">Teclas Z X C V B N M , . /</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {flatNotes.map((n) => {
                const isCurrent = activeNoteId === n.id;
                const noteDef = findNoteDefinition(n.id);
                return (
                  <button
                    key={n.key}
                    type="button"
                    id={`trumpet-key-flat-${n.key}`}
                    onClick={() => playTrumpetNote(noteDef, true)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-102 ring-2 ring-amber-400'
                        : 'bg-white hover:bg-amber-100/70 text-stone-800 border-amber-200'
                    }`}
                  >
                    <kbd className={`w-5 h-5 rounded flex items-center justify-center font-mono font-black text-[10px] mb-0.5 ${
                      isCurrent ? 'bg-amber-800 text-white' : 'bg-stone-800 text-amber-300'
                    }`}>
                      {n.key}
                    </kbd>
                    <span className="text-xs font-black leading-tight">{n.label}</span>
                    <span className={`text-[10px] font-extrabold ${isCurrent ? 'text-amber-100' : 'text-amber-800'}`}>
                      [{n.abc}]
                    </span>
                    <span className={`text-[9px] font-mono mt-0.5 ${isCurrent ? 'text-amber-200' : 'text-stone-500'}`}>
                      ({n.valves})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DE SÉRIE HARMÔNICA & FLEXIBILIDADE LABIAL (LIP SLURS DE ARBAN) */}
      <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Wind className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="text-sm font-black text-stone-900">
                  Flexibilidade Labial & Série Harmônica da Posição {currentValveGroup.displayFormula}
                </h3>
                <p className="text-[11px] text-stone-500">
                  No trompete, a mesma combinação de pistões produz diferentes notas conforme a velocidade do ar e a tensão dos lábios (embocadura)
                </p>
              </div>
            </div>

            <button
              type="button"
              id="trumpet-btn-lip-slurs-arpeggio"
              onClick={handlePlayLipSlurArpeggio}
              disabled={isArpeggiatingSeries}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all shadow-xs ${
                isArpeggiatingSeries
                  ? 'bg-amber-300 text-amber-950 animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-600 text-stone-950'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Tocar Série Harmônica (Lip Slur)</span>
            </button>
          </div>

          {/* ESCADA DE NOTAS DA SÉRIE HARMÔNICA DA POSIÇÃO ATUAL */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {currentValveGroup.harmonics.map((harm) => {
              const isSelected = activeNoteId === harm.noteId;
              const noteDef = findNoteDefinition(harm.noteId);
              return (
                <button
                  key={`${harm.noteId}-${harm.harmonicNumber}`}
                  type="button"
                  onClick={() => {
                    setSelectedHarmonic(harm);
                    playTrumpetNote(noteDef);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-md ring-2 ring-amber-400'
                      : 'bg-white hover:bg-amber-50 text-stone-800 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-black leading-none">{harm.solfege}</span>
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-stone-950' : 'text-amber-800'}`}>
                      [{harm.abcNumber}]
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold block ${isSelected ? 'text-stone-900' : 'text-stone-500'}`}>
                    {harm.registerName}
                  </span>
                  <div className={`mt-2 pt-1 border-t text-[9px] ${isSelected ? 'border-amber-600/40 text-stone-950' : 'border-stone-100 text-stone-400'}`}>
                    <div>Ar: {harm.airSpeed}</div>
                    <div>Lábios: {harm.lipTension}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 p-3 bg-white rounded-2xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900">Como estudar Flexibilidade de Embocadura:</span> Mantenha os pistões fixos na posição selecionada ({currentValveGroup.displayFormula}) e alterne entre as notas acima sem mexer os dedos, apenas acelerando o ar do abdômen e contraindo sutilmente os cantos da boca (métodos Arban e Colin).
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO DIDÁTICA: ORDEM NATURAL NUMÉRICA DOS PISTÕES & LÓGICA DAS OITAVAS (8ª E 16ª ACIMA) */}
      <div className="p-4 sm:p-6 bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho da Seção */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Ordem Natural Numérica: 0 solto, 1, 12, 2, 13, 23, 123</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-stone-900">
                Lógica dos Pistões & Simplificação na 8ª e 16ª Acima
              </h3>
              <p className="text-xs text-stone-600 max-w-3xl">
                Observe como a série harmônica encurta os circuitos: combinações pesadas do registro grave (como <strong className="text-amber-900">123</strong> e <strong className="text-amber-900">13</strong>) simplificam diretamente para a ordem natural compacta (<strong className="text-emerald-800">12</strong>, <strong className="text-sky-800">1</strong>, <strong className="text-amber-800">2</strong> e <strong className="text-stone-800">0</strong>) nas oitavas superiores.
              </p>
            </div>

            {/* Filtros de Oitava */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl self-start md:self-auto border border-stone-200">
              <button
                type="button"
                onClick={() => setOctaveFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                  octaveFilter === 'all'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Todas as 12 Notas
              </button>
              <button
                type="button"
                onClick={() => setOctaveFilter('grave')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                  octaveFilter === 'grave'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Grave
              </button>
              <button
                type="button"
                onClick={() => setOctaveFilter('8va')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                  octaveFilter === '8va'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                8ª Acima (8va)
              </button>
              <button
                type="button"
                onClick={() => setOctaveFilter('16va')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                  octaveFilter === '16va'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                16ª Acima (16va)
              </button>
            </div>
          </div>

          {/* PAINEL DIDÁTICO: A REGRA DA ORDEM NATURAL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200">
              <span className="text-xs font-black text-amber-950 block mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-700" />
                1. Ordem Acústica dos Tubos
              </span>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Cada pistão adiciona comprimento ao tubo:<br />
                • <strong>0 (Solto)</strong>: Tubo original livre<br />
                • <strong>1</strong>: -1 tom (-2 semitons)<br />
                • <strong>12</strong>: -1½ tom (-3 semitons)<br />
                • <strong>2</strong>: -½ tom (-1 semitono)<br />
                • <strong>13</strong>: -2 tons (requer gatilho de afinação)<br />
                • <strong>23</strong>: -2½ tons<br />
                • <strong>123</strong>: -3 tons (trítono máximo)
              </p>
            </div>

            <div className="p-3.5 bg-sky-50/70 rounded-2xl border border-sky-200">
              <span className="text-xs font-black text-sky-950 block mb-1 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-700" />
                2. A Lógica da 8ª Acima (8va)
              </span>
              <p className="text-[11px] text-sky-900 leading-relaxed">
                Na oitava acima, a densidade de harmônicos dobra. O trompetista não precisa de tubos longos:<br />
                • <strong>Dó#4 (123)</strong> simplifica para <strong>C#5 = 12</strong><br />
                • <strong>Ré4 (13)</strong> simplifica para <strong>D5 = 1</strong><br />
                • <strong>Ré#4 (23)</strong> simplifica para <strong>D#5 = 2</strong><br />
                • <strong>Mi4 (12)</strong> passa a ser tocado <strong>Aberto (0)</strong>!
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
              <span className="text-xs font-black text-emerald-950 block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                3. A Lógica da 16ª Acima (16va)
              </span>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                No registro superagudo (acima do C6), os harmônicos estão separados por apenas 1 semitono:<br />
                • As digitações naturais <strong>0, 1, 12, 2</strong> produzem praticamente toda a escala!<br />
                • O controle passa a ser 90% foco de velocidade do ar no centro dos lábios e 10% mecânica dos dedos.
              </p>
            </div>
          </div>

          {/* TABELA COMPARATIVA INTERATIVA */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 uppercase font-black text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Nota & ABC</th>
                  {(octaveFilter === 'all' || octaveFilter === 'grave') && (
                    <th className="py-2.5 px-3">Registro Fundamental (Grave)</th>
                  )}
                  {(octaveFilter === 'all' || octaveFilter === '8va') && (
                    <th className="py-2.5 px-3">8ª Acima (8va)</th>
                  )}
                  {(octaveFilter === 'all' || octaveFilter === '16va') && (
                    <th className="py-2.5 px-3">16ª Acima (16va Superagudo)</th>
                  )}
                  <th className="py-2.5 px-3 hidden lg:table-cell">Lógica da Ordem Natural</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {OCTAVE_FINGERING_COMPARISONS.map((row) => {
                  const isCurrentGrave = activeNoteId === row.graveNoteId;
                  const isCurrent8va = activeNoteId === row.octave8NoteId;
                  const isCurrent16va = activeNoteId === row.octave16NoteId;

                  return (
                    <tr
                      key={row.noteLabel}
                      className={`hover:bg-amber-50/40 transition-colors ${
                        isCurrentGrave || isCurrent8va || isCurrent16va ? 'bg-amber-50/80 font-bold' : ''
                      }`}
                    >
                      {/* Coluna Nota & ABC */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-stone-900 text-sm">{row.noteLabel}</span>
                          <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md font-bold">
                            [{row.abcNumber}]
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500 font-mono">Letra: {row.letter}</span>
                      </td>

                      {/* Coluna Grave */}
                      {(octaveFilter === 'all' || octaveFilter === 'grave') && (
                        <td className="py-2.5 px-3">
                          <button
                            type="button"
                            id={`btn-octave-grave-${row.graveNoteId}`}
                            onClick={() => {
                              setValves(row.graveValves);
                              setActiveNoteId(row.graveNoteId);
                              const def = findNoteDefinition(row.graveNoteId);
                              if (def) playTrumpetNote(def);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl border flex items-center justify-between gap-1 transition-all ${
                              isCurrentGrave
                                ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm ring-2 ring-amber-300'
                                : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
                            }`}
                          >
                            <div>
                              <span className="font-mono font-black text-xs block">{row.graveNoteId}</span>
                              <span className="text-[10px] font-bold text-amber-900">{row.graveFingering}</span>
                            </div>
                            <Volume2 className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                          </button>
                        </td>
                      )}

                      {/* Coluna 8ª Acima */}
                      {(octaveFilter === 'all' || octaveFilter === '8va') && (
                        <td className="py-2.5 px-3">
                          <button
                            type="button"
                            id={`btn-octave-8va-${row.octave8NoteId}`}
                            onClick={() => {
                              setValves(row.octave8Valves);
                              setActiveNoteId(row.octave8NoteId);
                              const def = findNoteDefinition(row.octave8NoteId);
                              if (def) playTrumpetNote(def);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl border flex items-center justify-between gap-1 transition-all ${
                              isCurrent8va
                                ? 'bg-sky-500 text-white border-sky-600 shadow-sm ring-2 ring-sky-300'
                                : 'bg-sky-50/50 hover:bg-sky-100/60 text-stone-800 border-sky-200'
                            }`}
                          >
                            <div>
                              <span className="font-mono font-black text-xs block">{row.octave8NoteId}</span>
                              <span className="text-[10px] font-bold text-sky-900">{row.octave8Fingering}</span>
                            </div>
                            <Volume2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          </button>
                        </td>
                      )}

                      {/* Coluna 16ª Acima */}
                      {(octaveFilter === 'all' || octaveFilter === '16va') && (
                        <td className="py-2.5 px-3">
                          <button
                            type="button"
                            id={`btn-octave-16va-${row.octave16NoteId}`}
                            onClick={() => {
                              setValves(row.octave16Valves);
                              setActiveNoteId(row.octave16NoteId);
                              const def = findNoteDefinition(row.octave16NoteId);
                              if (def) playTrumpetNote(def);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl border flex items-center justify-between gap-1 transition-all ${
                              isCurrent16va
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300'
                                : 'bg-emerald-50/50 hover:bg-emerald-100/60 text-stone-800 border-emerald-200'
                            }`}
                          >
                            <div>
                              <span className="font-mono font-black text-xs block">{row.octave16NoteId}</span>
                              <span className="text-[10px] font-bold text-emerald-900">{row.octave16Fingering}</span>
                            </div>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          </button>
                        </td>
                      )}

                      {/* Regra Didática */}
                      <td className="py-2.5 px-3 text-[11px] text-stone-600 leading-tight hidden lg:table-cell">
                        {row.didacticRule}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
