import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Music,
  Volume2,
  VolumeX,
  Keyboard,
  Sparkles,
  Sliders,
  Edit3,
  HelpCircle,
  Play,
  Square,
  Layers,
  CheckCircle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { NoteDefinition, SongExercise, ExerciseNote } from '../types';
import { trumpetAudio } from '../utils/audioEngine';
import {
  PC_KEYBOARD_MAPPINGS,
  PIANO_VISUAL_KEYS,
  HARMONY_CHORDS,
  HarmonyChord,
  PianoVisualKey,
  findNoteDefinition,
  resolveKeyboardShortcut,
} from '../data/pianoKeyboardMap';
import { TrumpetValves } from './TrumpetValves';

interface PianoKeyboardPanelProps {
  onSelectTargetNote?: (note: NoteDefinition) => void;
  onInsertNoteToScore?: (note: NoteDefinition, duration: number) => void;
  targetNoteId?: string;
  isCompact?: boolean;
  scoreEditorActive?: boolean;
  activeContext?: 'tuner' | 'score' | 'exercises' | 'standalone';
}

export const PianoKeyboardPanel: React.FC<PianoKeyboardPanelProps> = ({
  onSelectTargetNote,
  onInsertNoteToScore,
  targetNoteId = 'C4',
  isCompact = false,
  scoreEditorActive = false,
  activeContext = 'standalone',
}) => {
  // Configurações do Teclado
  const [soundTimbre, setSoundTimbre] = useState<'piano' | 'trumpet'>('piano');
  const [keyboardShortcutsEnabled, setKeyboardShortcutsEnabled] = useState<boolean>(true);
  const [selectedOctave, setSelectedOctave] = useState<number | 'all'>('all');
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [lastPlayedNote, setLastPlayedNote] = useState<NoteDefinition>(findNoteDefinition(targetNoteId));

  // Harmonia & Acordes
  const [selectedChord, setSelectedChord] = useState<HarmonyChord>(HARMONY_CHORDS[0]);
  const [isDronePlaying, setIsDronePlaying] = useState<boolean>(false);
  const [droneChordName, setDroneChordName] = useState<string | null>(null);

  // Inserção em Partitura (quando conectado ao editor)
  const [insertDuration, setInsertDuration] = useState<number>(1); // 1 = Semínima
  const [showHotkeyGuide, setShowHotkeyGuide] = useState<boolean>(true);

  // Tocar uma nota individual
  const playNote = useCallback(
    (noteDef: NoteDefinition, fromKeyboard: boolean = false) => {
      // Tocar timbre selecionado
      if (soundTimbre === 'piano') {
        trumpetAudio.playPianoTone(noteDef, 1.8, 0.85);
      } else {
        trumpetAudio.playTrumpetTone(noteDef, 1.4);
      }

      setLastPlayedNote(noteDef);

      // Notificar afinador se função fornecida
      if (onSelectTargetNote) {
        onSelectTargetNote(noteDef);
      }

      // Inserir na partitura se estiver em modo editor
      if (scoreEditorActive && onInsertNoteToScore) {
        onInsertNoteToScore(noteDef, insertDuration);
      }

      // Feedback visual momentâneo
      setActiveNotes((prev) => {
        const next = new Set(prev);
        next.add(noteDef.id);
        return next;
      });

      window.setTimeout(() => {
        setActiveNotes((prev) => {
          const next = new Set(prev);
          next.delete(noteDef.id);
          return next;
        });
      }, 350);
    },
    [soundTimbre, onSelectTargetNote, scoreEditorActive, onInsertNoteToScore, insertDuration]
  );

  // Escuta de Teclado do Computador (PC Hotkeys com suporte a Shift e todas as oitavas)
  useEffect(() => {
    if (!keyboardShortcutsEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar se o usuário estiver digitando em campo de texto
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return;
      }

      const mapping = resolveKeyboardShortcut(e);

      if (mapping) {
        // Evita rolagem de página para teclas especiais e acentos
        if (
          e.key === ' ' ||
          e.key === '/' ||
          e.key === "'" ||
          e.key === '~' ||
          e.key === '[' ||
          e.key === ']' ||
          e.key === ';'
        ) {
          e.preventDefault();
        }

        const noteDef = findNoteDefinition(mapping.targetNoteId);
        playNote(noteDef, true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboardShortcutsEnabled, playNote]);

  // Tocar acorde de harmonia
  const handlePlayChord = (chord: HarmonyChord) => {
    setSelectedChord(chord);
    const chordNotes = chord.noteIds.map((id) => findNoteDefinition(id));
    trumpetAudio.playChord(chordNotes, 2.5, soundTimbre);
  };

  // Alternar sustentação de acorde (Drone Harmônico para estudo de afinação com trompete)
  const handleToggleDrone = (chord: HarmonyChord) => {
    if (isDronePlaying && droneChordName === chord.name) {
      trumpetAudio.stopDroneChord();
      setIsDronePlaying(false);
      setDroneChordName(null);
    } else {
      setSelectedChord(chord);
      const chordNotes = chord.noteIds.map((id) => findNoteDefinition(id));
      trumpetAudio.startDroneChord(chordNotes, chord.name);
      setIsDronePlaying(true);
      setDroneChordName(chord.name);
    }
  };

  // Parar drone ao desmontar
  useEffect(() => {
    return () => {
      trumpetAudio.stopDroneChord();
    };
  }, []);

  // Filtrar teclas por oitava se solicitado
  const displayedKeys = PIANO_VISUAL_KEYS.filter((k) => {
    if (selectedOctave === 'all') return true;
    return k.octave === selectedOctave;
  });

  // Dividir teclas brancas e calcular posições das teclas pretas
  const whiteKeys = displayedKeys.filter((k) => !k.isBlack);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
      {/* CABEÇALHO DO PAINEL DE PIANO & ATALHOS */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shadow-md shadow-amber-500/30">
            🎹
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Piano & Harmonia Interativa
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase border border-amber-500/30">
                Atalhos PC (QWERT / ASDFG / ZXCVB)
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Conectado à Partitura, Afinação em Tempo Real e Harmonia com Trompete
            </p>
          </div>
        </div>

        {/* CONTROLES DO PAINEL: TIMBRE, ATALHOS E OITAVAS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seletor de Timbre Acústico */}
          <div className="flex items-center bg-stone-800/90 p-1 rounded-xl border border-stone-700 text-xs">
            <button
              type="button"
              id="piano-timbre-piano"
              onClick={() => setSoundTimbre('piano')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                soundTimbre === 'piano'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
              title="Timbre de Piano Acústico (Web Audio API com martelo e ressonância)"
            >
              <span>🎹</span>
              <span>Piano</span>
            </button>
            <button
              type="button"
              id="piano-timbre-trumpet"
              onClick={() => setSoundTimbre('trumpet')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                soundTimbre === 'trumpet'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
              title="Timbre de Trompete (Metal com harmônicos e campana)"
            >
              <span>🎺</span>
              <span>Trompete</span>
            </button>
          </div>

          {/* Toggle de Atalhos do Teclado */}
          <button
            type="button"
            id="piano-toggle-hotkeys"
            onClick={() => setKeyboardShortcutsEnabled(!keyboardShortcutsEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              keyboardShortcutsEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
            title="Ativar/Desativar controle pelas teclas do computador"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teclas PC:</span>
            <span>{keyboardShortcutsEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Botão Guia de Teclas */}
          <button
            type="button"
            id="piano-toggle-guide"
            onClick={() => setShowHotkeyGuide(!showHotkeyGuide)}
            className={`p-1.5 rounded-xl text-xs transition-all border ${
              showHotkeyGuide
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
            title="Mostrar/Ocultar mapa das 3 linhas do teclado"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GUIA VISUAL DAS LINHAS DE TECLADO DO PC COM SUPORTE A SHIFT E TODAS AS OITAVAS */}
      {showHotkeyGuide && (
        <div className="bg-amber-50/90 border-b border-amber-200/90 p-3 sm:p-4 text-xs">
          <div className="max-w-6xl mx-auto space-y-3">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-black text-amber-950">
                <Keyboard className="w-4 h-4 text-amber-700" />
                <span>Mapa Completo de Atalhos do Teclado (Abrangência: Dó -1 até Si +3):</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md font-bold">
                  Extensão Shift após a tecla "Ç" ativada
                </span>
                <span className="text-[11px] text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md font-bold">
                  5 Oitavas Dinâmicas
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* LINHA ASDFG + SHIFT: NATURAIS */}
              <div className="bg-white p-2.5 rounded-2xl border border-sky-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-sky-900 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      Linha ASDFG: Naturais (♮)
                    </span>
                    <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-black">
                      Central (0)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                    {[
                      { k: 'A', n: 'Dó0 [3]' },
                      { k: 'S', n: 'Ré0 [4]' },
                      { k: 'D', n: 'Mi0 [5]' },
                      { k: 'F', n: 'Fá0 [6]' },
                      { k: 'G', n: 'Sol0 [7]' },
                      { k: 'H', n: 'Lá0 [1]' },
                      { k: 'J', n: 'Si0 [2]' },
                      { k: 'K', n: 'Dó+1 [3]' },
                      { k: 'L', n: 'Ré+1 [4]' },
                      { k: 'Ç', n: 'Mi+1 [5]' },
                    ].map((item) => (
                      <span
                        key={item.k}
                        className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 border border-stone-300 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                      >
                        <kbd className="text-sky-700 font-black">{item.k}</kbd>
                        <span className="text-stone-600 font-sans">{item.n}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CONTINUAÇÃO COM SHIFT: APÓS O Ç ATÉ AGUDO/SUPERAGUDO */}
              <div className="bg-white p-2.5 rounded-2xl border border-indigo-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-indigo-900 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      Continuação Shift após "Ç"
                    </span>
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-black">
                      +1 e +2
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                    {[
                      { k: '⇧F', n: 'Fá+1 [6]' },
                      { k: '⇧G', n: 'Sol+1 [7]' },
                      { k: '⇧H', n: 'Lá+1 [1]' },
                      { k: '⇧J', n: 'Si+1 [2]' },
                      { k: '⇧K', n: 'Dó+2 [3]' },
                      { k: '⇧L', n: 'Ré+2 [4]' },
                      { k: '⇧Ç', n: 'Mi+2 [5]' },
                      { k: '⇧1', n: 'Fá+2 [6]' },
                      { k: '⇧2', n: 'Sol+2 [7]' },
                      { k: '⇧3', n: 'Lá+2 [1]' },
                      { k: '⇧4', n: 'Si+2 [2]' },
                      { k: '⇧5', n: 'Dó+3 [3]' },
                    ].map((item) => (
                      <span
                        key={item.k}
                        className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-900 border border-indigo-200 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                      >
                        <kbd className="text-indigo-700 font-black">{item.k}</kbd>
                        <span className="text-indigo-800 font-sans">{item.n}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* LINHA QWERT + SHIFT: SUSTENIDOS */}
              <div className="bg-white p-2.5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Linha QWERT: Sustenidos (♯)
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-black">
                      Teclas Pretas
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                    {[
                      { k: 'Q', n: 'Dó♯0' },
                      { k: 'W', n: 'Ré♯0' },
                      { k: 'E', n: 'Fá♯0' },
                      { k: 'R', n: 'Sol♯0' },
                      { k: 'T', n: 'Lá♯0' },
                      { k: 'Y', n: 'Dó♯+1' },
                      { k: 'U', n: 'Ré♯+1' },
                      { k: 'I', n: 'Fá♯+1' },
                      { k: 'O', n: 'Sol♯+1' },
                      { k: 'P', n: 'Lá♯+1' },
                      { k: '⇧Q', n: 'Dó♯+2' },
                      { k: '⇧W', n: 'Ré♯+2' },
                      { k: '⇧I', n: 'Fá♯+2' },
                      { k: '⇧O', n: 'Sol♯+2' },
                      { k: '⇧P', n: 'Lá♯+2' },
                      { k: '⇧Y', n: 'Dó♯+3' },
                    ].map((item) => (
                      <span
                        key={item.k}
                        className="inline-flex items-center gap-1 bg-stone-900 text-white px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                      >
                        <kbd className="text-emerald-400 font-black">{item.k}</kbd>
                        <span className="text-stone-300 font-sans">{item.n}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* LINHA ZXCVB + 1-5: OITAVA -1 GRAVE PEDAL */}
              <div className="bg-white p-2.5 rounded-2xl border border-amber-300 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-amber-950 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Linha Z-M & 1-5: Grave (-1)
                    </span>
                    <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-black">
                      Pedal Trompete
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                    {[
                      { k: 'Z', n: 'Dó-1' },
                      { k: '1', n: 'Dó♯-1' },
                      { k: 'X', n: 'Ré-1' },
                      { k: '2', n: 'Ré♯-1' },
                      { k: 'C', n: 'Mi-1' },
                      { k: 'V', n: 'Fá-1' },
                      { k: '3', n: 'Fá♯-1' },
                      { k: 'B', n: 'Sol-1' },
                      { k: '4', n: 'Sol♯-1' },
                      { k: 'N', n: 'Lá-1' },
                      { k: '5', n: 'Lá♯-1' },
                      { k: 'M', n: 'Si-1' },
                    ].map((item) => (
                      <span
                        key={item.k}
                        className="inline-flex items-center gap-1 bg-amber-900 text-amber-100 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                      >
                        <kbd className="text-amber-300 font-black">{item.k}</kbd>
                        <span className="text-amber-200 font-sans">{item.n}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ÁREA PRINCIPAL: O TECLADO VISUAL DE PIANO COM FILTRO DE OITAVAS */}
      <div className="p-4 sm:p-6 bg-stone-100 flex flex-col items-center">
        {/* BARRA DE NAVEGAÇÃO E FILTROS DE OITAVAS (DÓ -1 ATÉ SI +3) */}
        <div className="w-full max-w-5xl mb-3 flex flex-wrap items-center justify-between gap-2 bg-white px-3 py-2 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-1 text-xs font-bold text-stone-700">
            <span className="text-stone-400 font-mono">Oitavas:</span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'Todas (-1 a +3)' },
                { id: 3, label: '[-1] Grave Pedal' },
                { id: 4, label: '[0] Central' },
                { id: 5, label: '[+1] Agudo' },
                { id: 6, label: '[+2] Superagudo' },
                { id: 7, label: '[+3] Ultra-Agudo' },
              ].map((oct) => (
                <button
                  key={oct.id}
                  type="button"
                  onClick={() => setSelectedOctave(oct.id as any)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedOctave === oct.id
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {oct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Botões de Transposição Rápida de Oitava */}
          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => {
                if (selectedOctave === 'all') setSelectedOctave(3);
                else if (typeof selectedOctave === 'number' && selectedOctave > 3) {
                  setSelectedOctave(selectedOctave - 1);
                }
              }}
              className="px-2 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 font-bold hover:bg-stone-200 transition-all"
              title="Descer uma oitava (8vb)"
            >
              8vb ▼
            </button>
            <button
              type="button"
              onClick={() => {
                if (selectedOctave === 'all') setSelectedOctave(7);
                else if (typeof selectedOctave === 'number' && selectedOctave < 7) {
                  setSelectedOctave(selectedOctave + 1);
                }
              }}
              className="px-2 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 font-bold hover:bg-stone-200 transition-all"
              title="Subir uma oitava (8va)"
            >
              8va ▲
            </button>
          </div>
        </div>

        {/* TECLADO DE PIANO COM PROPORÇÕES REALISTAS E ATALHOS */}
        <div className="w-full max-w-5xl overflow-x-auto pb-4 scrollbar-thin">
          <div className="relative inline-flex bg-stone-900 p-2 sm:p-3 rounded-2xl shadow-xl border-4 border-stone-800 select-none min-w-[760px]">
            {/* RENDERIZAÇÃO DAS TECLAS BRANCAS (NATURAIS) */}
            <div className="flex space-x-1">
              {whiteKeys.map((wKey) => {
                const noteDef = findNoteDefinition(wKey.noteId);
                const isActive = activeNotes.has(wKey.noteId);
                const isTarget = targetNoteId === wKey.noteId;

                return (
                  <button
                    key={wKey.noteId}
                    type="button"
                    id={`piano-key-white-${wKey.noteId}`}
                    onClick={() => playNote(noteDef)}
                    className={`relative w-12 sm:w-14 h-48 sm:h-56 rounded-b-xl border border-stone-300 transition-all flex flex-col justify-end items-center pb-3 cursor-pointer ${
                      isActive
                        ? 'bg-amber-200 border-amber-400 translate-y-1 shadow-inner'
                        : isTarget
                        ? 'bg-amber-50 border-amber-500 shadow-sm'
                        : 'bg-white hover:bg-stone-50 active:bg-amber-100 active:translate-y-0.5 shadow-md'
                    }`}
                  >
                    {/* Badge do Atalho PC */}
                    {wKey.shortcutNatural && (
                      <div className="mb-2 min-w-[24px] h-6 px-1 rounded-lg bg-sky-100 border border-sky-300 text-sky-900 font-mono font-black text-xs flex items-center justify-center shadow-xs">
                        {wKey.shortcutNatural}
                      </div>
                    )}

                    {/* Notação ABC e Solfejo */}
                    <span className="text-xs sm:text-sm font-black text-stone-900 leading-tight">
                      {wKey.solfege}
                    </span>
                    <span className="text-[11px] font-extrabold text-amber-800">
                      [{wKey.abcNumber}]
                    </span>

                    {/* Digitação de Pistões */}
                    <div className="mt-1 flex items-center gap-0.5">
                      <span className="text-[9px] font-mono font-bold text-stone-500 bg-stone-100 px-1 py-0.2 rounded">
                        ({wKey.valves})
                      </span>
                    </div>

                    {/* Indicador de Nota Alvo do Afinador */}
                    {isTarget && (
                      <span className="absolute top-2 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* RENDERIZAÇÃO DAS TECLAS PRETAS (SUSTENIDOS E BEMÓIS COM POSICIONAMENTO RELATIVO MATEMÁTICO) */}
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 pointer-events-none flex">
              {displayedKeys.map((key) => {
                if (!key.isBlack) return null;

                const noteDef = findNoteDefinition(key.noteId);
                const isActive = activeNotes.has(key.noteId);
                const isTarget = targetNoteId === key.noteId;

                // Encontrar a tecla branca que precede esta tecla preta
                const precedingWhiteIndex = whiteKeys.findIndex(
                  (w) =>
                    w.octave === key.octave &&
                    ((key.orderInOctave === 1 && w.orderInOctave === 0) || // C# após C
                      (key.orderInOctave === 3 && w.orderInOctave === 2) || // D# após D
                      (key.orderInOctave === 6 && w.orderInOctave === 5) || // F# após F
                      (key.orderInOctave === 8 && w.orderInOctave === 7) || // G# após G
                      (key.orderInOctave === 10 && w.orderInOctave === 9)) // A# após A
                );

                if (precedingWhiteIndex === -1) return null;

                // Dimensões do layout: tecla branca w-12 (48px) sm:w-14 (56px) + space-x-1 (4px)
                // Usamos a medida da tecla com espaçamento
                // Na versão desktop sm: whiteKeyWidth = 56, spacing = 4 -> totalUnit = 60
                // Na versão mobile: whiteKeyWidth = 48, spacing = 4 -> totalUnit = 52
                // O centro do vão é (precedingWhiteIndex + 1) * totalUnit - spacing/2
                // A tecla preta tem w-8 (32px) ou sm:w-9 (36px). Subtraímos metade para centralizar.
                const totalUnit = 60;
                const leftPos = (precedingWhiteIndex + 1) * totalUnit - 20;

                return (
                  <button
                    key={key.noteId}
                    type="button"
                    id={`piano-key-black-${key.noteId}`}
                    onClick={() => playNote(noteDef)}
                    style={{ left: `${leftPos}px` }}
                    className={`absolute pointer-events-auto w-8 sm:w-9 h-28 sm:h-34 rounded-b-lg border-2 z-10 transition-all flex flex-col justify-end items-center pb-2 cursor-pointer shadow-lg ${
                      isActive
                        ? 'bg-amber-400 border-amber-300 translate-y-1'
                        : isTarget
                        ? 'bg-stone-800 border-amber-400'
                        : 'bg-stone-900 border-stone-950 hover:bg-stone-800 active:bg-amber-500'
                    }`}
                  >
                    {/* Badge do Atalho PC Sustenido (#) */}
                    {key.shortcutSharp && (
                      <div className="min-w-[20px] h-5 px-1 rounded bg-emerald-600 text-white font-mono font-black text-[9px] flex items-center justify-center shadow-xs">
                        {key.shortcutSharp}
                      </div>
                    )}

                    {/* Badge do Atalho PC Bemol (♭) */}
                    {key.shortcutFlat && (
                      <div className="mt-0.5 min-w-[20px] h-4 px-1 rounded bg-amber-600 text-white font-mono font-black text-[8px] flex items-center justify-center shadow-xs">
                        {key.shortcutFlat}
                      </div>
                    )}

                    {/* Nome resumido da nota */}
                    <span className="text-[10px] font-bold text-stone-200 mt-1 leading-none">
                      {key.letter.split('/')[0]}
                    </span>
                    <span className="text-[8px] font-mono text-stone-400 mt-0.5">
                      {key.valves}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BARRA DE INFORMAÇÕES DA NOTA SELECIONADA */}
        <div className="w-full max-w-5xl mt-3 bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex flex-col items-center justify-center font-black shadow-sm">
              <span className="text-base leading-none">{lastPlayedNote.letter}</span>
              <span className="text-[10px] text-amber-200">{lastPlayedNote.numberNotation}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-stone-900">
                  Nota: {lastPlayedNote.solfege} ({lastPlayedNote.letter}) • Sistema ABC: [{lastPlayedNote.numberNotation}]
                </span>
                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-bold font-mono">
                  {lastPlayedNote.frequency.toFixed(1)} Hz
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Pistões no Trompete Si♭: <strong className="text-stone-800">{lastPlayedNote.fingerDescription}</strong>
              </p>
            </div>
          </div>

          {/* AÇÕES INTEGRADAS: AFINADOR & PARTITURA */}
          <div className="flex items-center gap-2">
            {onSelectTargetNote && (
              <button
                type="button"
                id="piano-btn-set-tuner-target"
                onClick={() => onSelectTargetNote(lastPlayedNote)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-950 font-bold text-xs border border-stone-200 transition-colors"
                title="Definir esta nota como referência para o ponteiro do afinador"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-700" />
                <span>Fixar no Afinador</span>
              </button>
            )}

            {scoreEditorActive && onInsertNoteToScore && (
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-600 px-1">Duração:</span>
                {[
                  { dur: 4, label: '4t (Semibreve)' },
                  { dur: 2, label: '2t (Mínima)' },
                  { dur: 1, label: '1t (Semínima)' },
                  { dur: 0.5, label: '0.5t (Colcheia)' },
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
                  id="piano-btn-insert-score"
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

      {/* PAINEL DE HARMONIA & ACORDES DIDÁTICOS (ESTUDO DE INTERVALO E AFINAÇÃO) */}
      <div className="p-4 sm:p-5 bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="text-sm font-black text-stone-900">
                  Composição de Harmonia & Acordes para Trompete
                </h3>
                <p className="text-[11px] text-stone-500">
                  Toque tríades e ative a sustentação contínua para praticar afinação e embocadura sobre o acorde do piano
                </p>
              </div>
            </div>

            {/* Status do Drone de Harmonia */}
            {isDronePlaying && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Acorde Sustentado: {droneChordName}</span>
                <button
                  type="button"
                  onClick={() => trumpetAudio.stopDroneChord()}
                  className="ml-1 text-rose-700 hover:text-rose-900 font-black underline text-[11px]"
                >
                  Parar
                </button>
              </div>
            )}
          </div>

          {/* LISTA DE TRÍADES E ACORDES PRINCIPAIS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {HARMONY_CHORDS.map((chord) => {
              const isSelected = selectedChord.id === chord.id;
              const isCurrentDrone = isDronePlaying && droneChordName === chord.name;

              return (
                <div
                  key={chord.id}
                  className={`p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrentDrone
                      ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-300'
                      : isSelected
                      ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                      : 'bg-stone-50 border-stone-200 hover:border-amber-300 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-stone-900 truncate">
                        {chord.name.split('(')[0]}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 font-bold">
                        ({chord.name.split('(')[1]?.replace(')', '') || ''})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-800 block mt-0.5">
                      {chord.abcFormula}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1">
                    <button
                      type="button"
                      id={`piano-btn-chord-play-${chord.id}`}
                      onClick={() => handlePlayChord(chord)}
                      className="flex-1 py-1 bg-white hover:bg-stone-100 text-stone-800 rounded-lg text-[10px] font-black border border-stone-300 transition-colors"
                      title="Ouvir tríade percutida"
                    >
                      Tocar
                    </button>
                    <button
                      type="button"
                      id={`piano-btn-chord-drone-${chord.id}`}
                      onClick={() => handleToggleDrone(chord)}
                      className={`px-1.5 py-1 rounded-lg text-[10px] font-black transition-colors ${
                        isCurrentDrone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-200 hover:bg-amber-200 text-stone-700'
                      }`}
                      title={isCurrentDrone ? 'Parar sustentação' : 'Sustentar harmonia para tocar trompete por cima'}
                    >
                      {isCurrentDrone ? <Square className="w-2.5 h-2.5" /> : 'Sustentar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESCRIÇÃO DIDÁTICA DO ACORDE ATIVO */}
          <div className="mt-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900">
                Como usar a Harmonia no Trompete:
              </span>{' '}
              {selectedChord.description} Quando você ativa a opção <strong>"Sustentar"</strong>, o piano mantém a base harmônica contínua. Pegue seu bocal ou trompete e pratique a afinação da fundamental e da quinta justa sem desviar o ponteiro da afinação central!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
