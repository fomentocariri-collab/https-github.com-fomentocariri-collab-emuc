import React, { useState, useRef } from 'react';
import { 
  Play, Square, Plus, Trash2, Volume2, ArrowLeft, ArrowRight,
  Music, Sparkles, AlertCircle, HelpCircle, Check, RotateCcw
} from 'lucide-react';
import { NoteDefinition, ExerciseNote } from '../types';
import { TRUMPET_NOTES } from '../data/trumpetData';
import { findNoteDefinition } from '../data/pianoKeyboardMap';
import { trumpetAudio } from '../utils/audioEngine';

export type RhythmicFigure = 'breve' | 'semibreve' | 'minima' | 'seminima' | 'colcheia' | 'semicolcheia';
export type ClefType = 'sol' | 'fa';
export type AccidentalType = 'none' | 'sharp' | 'flat' | 'natural';

export interface StaffNoteItem {
  id: string;
  noteId: string; // Ex: C4, D4, etc. ou 'REST' para pausa
  isRest: boolean;
  figure: RhythmicFigure;
  beats: number; // Ex: 4 para semibreve, 2 para minima, 1 para seminima, 0.5 para colcheia, 0.25 para semicolcheia, 8 para breve
  dotted: boolean; // se tem ponto de aumento
  accidental: AccidentalType;
  customTip?: string;
}

export interface VisualStaffEditorProps {
  notes: StaffNoteItem[];
  onChangeNotes: (notes: StaffNoteItem[]) => void;
  timeSignature?: string; // '4/4', '3/4', '2/4', '6/8'
  bpm?: number;
  clef?: ClefType;
  onChangeClef?: (clef: ClefType) => void;
  playbackInstrument?: 'trompete' | 'piano';
  onPlayNoteDef?: (note: NoteDefinition) => void;
}

// Definição das figuras rítmicas tradicionais
export const RHYTHMIC_FIGURES: {
  type: RhythmicFigure;
  name: string;
  baseBeats: number;
  symbol: string;
  number: number; // valor proporcional relativo (Semibreve=1, Mínima=2, etc.)
  description: string;
}[] = [
  { type: 'breve', name: 'Breve', baseBeats: 8, symbol: '𝄺', number: 0, description: '8 tempos (Vale 2 Semibreves)' },
  { type: 'semibreve', name: 'Semibreve', baseBeats: 4, symbol: '𝅝', number: 1, description: '4 tempos (Cabeça oca, sem haste)' },
  { type: 'minima', name: 'Mínima', baseBeats: 2, symbol: '𝅗𝅥', number: 2, description: '2 tempos (Cabeça oca, com haste)' },
  { type: 'seminima', name: 'Semínima', baseBeats: 1, symbol: '𝅘𝅥', number: 4, description: '1 tempo (Cabeça cheia, com haste)' },
  { type: 'colcheia', name: 'Colcheia', baseBeats: 0.5, symbol: '𝅘𝅥𝅮', number: 8, description: '1/2 tempo (Cabeça cheia, 1 bandeirola)' },
  { type: 'semicolcheia', name: 'Semicolcheia', baseBeats: 0.25, symbol: '𝅘𝅥𝅯', number: 16, description: '1/4 tempo (Cabeça cheia, 2 bandeirolas)' },
];

// Mapeamento vertical de cada semitom / nota diatônica no pentagrama
// Na clave de Sol:
// Linha 1 = E4 (y=80)
// Espaço 1 = F4 (y=70)
// Linha 2 = G4 (y=60)
// Espaço 2 = A4 (y=50)
// Linha 3 = B4 (y=40)
// Espaço 3 = C5 (y=30)
// Linha 4 = D5 (y=20)
// Espaço 4 = E5 (y=10)
// Linha 5 = F5 (y=0)

interface StaffPitchLevel {
  noteId: string;
  solfege: string;
  letter: string;
  numberNotation: string;
  octave: number;
  yOffset: number; // Deslocamento em pixels relativos à Linha 5 (y=0)
  staffLocationDescription: string;
  isLedger: boolean;
  ledgerPositions?: number[]; // y coordinates onde desenhar tracinhos suplementares
}

// Níveis para Clave de Sol (De C4 até A5)
export const TREBLE_STAFF_LEVELS: StaffPitchLevel[] = [
  { noteId: 'A5', solfege: 'Lá', letter: 'A', numberNotation: '1', octave: 5, yOffset: -20, staffLocationDescription: '1ª Linha Sup. Superior', isLedger: true, ledgerPositions: [-20] },
  { noteId: 'G5', solfege: 'Sol', letter: 'G', numberNotation: '7', octave: 5, yOffset: -10, staffLocationDescription: 'Espaço Acima da 5ª Linha', isLedger: false },
  { noteId: 'F5', solfege: 'Fá', letter: 'F', numberNotation: '6', octave: 5, yOffset: 0, staffLocationDescription: '5ª Linha', isLedger: false },
  { noteId: 'E5', solfege: 'Mi', letter: 'E', numberNotation: '5', octave: 5, yOffset: 10, staffLocationDescription: '4º Espaço', isLedger: false },
  { noteId: 'D5', solfege: 'Ré', letter: 'D', numberNotation: '4', octave: 5, yOffset: 20, staffLocationDescription: '4ª Linha', isLedger: false },
  { noteId: 'C5', solfege: 'Dó', letter: 'C', numberNotation: '3', octave: 5, yOffset: 30, staffLocationDescription: '3º Espaço', isLedger: false },
  { noteId: 'B4', solfege: 'Si', letter: 'B', numberNotation: '2', octave: 4, yOffset: 40, staffLocationDescription: '3ª Linha (Centro)', isLedger: false },
  { noteId: 'A4', solfege: 'Lá', letter: 'A', numberNotation: '1', octave: 4, yOffset: 50, staffLocationDescription: '2º Espaço', isLedger: false },
  { noteId: 'G4', solfege: 'Sol', letter: 'G', numberNotation: '7', octave: 4, yOffset: 60, staffLocationDescription: '2ª Linha (Clave de Sol)', isLedger: false },
  { noteId: 'F4', solfege: 'Fá', letter: 'F', numberNotation: '6', octave: 4, yOffset: 70, staffLocationDescription: '1º Espaço', isLedger: false },
  { noteId: 'E4', solfege: 'Mi', letter: 'E', numberNotation: '5', octave: 4, yOffset: 80, staffLocationDescription: '1ª Linha (Grave)', isLedger: false },
  { noteId: 'D4', solfege: 'Ré', letter: 'D', numberNotation: '4', octave: 4, yOffset: 90, staffLocationDescription: 'Espaço Abaixo da 1ª Linha', isLedger: false },
  { noteId: 'C4', solfege: 'Dó', letter: 'C', numberNotation: '3', octave: 4, yOffset: 100, staffLocationDescription: '1ª Linha Sup. Inferior (Dó Central)', isLedger: true, ledgerPositions: [100] },
  { noteId: 'B3', solfege: 'Si', letter: 'B', numberNotation: '2', octave: 3, yOffset: 110, staffLocationDescription: 'Espaço Abaixo da 1ª Sup. Inf.', isLedger: true, ledgerPositions: [100] },
  { noteId: 'A3', solfege: 'Lá', letter: 'A', numberNotation: '1', octave: 3, yOffset: 120, staffLocationDescription: '2ª Linha Sup. Inferior', isLedger: true, ledgerPositions: [100, 120] },
];

// Níveis para Clave de Fá (De E2 até C4)
export const BASS_STAFF_LEVELS: StaffPitchLevel[] = [
  { noteId: 'C4', solfege: 'Dó', letter: 'C', numberNotation: '3', octave: 4, yOffset: -20, staffLocationDescription: '1ª Linha Sup. Superior (Dó Central)', isLedger: true, ledgerPositions: [-20] },
  { noteId: 'B3', solfege: 'Si', letter: 'B', numberNotation: '2', octave: 3, yOffset: -10, staffLocationDescription: 'Espaço Acima da 5ª Linha', isLedger: false },
  { noteId: 'A3', solfege: 'Lá', letter: 'A', numberNotation: '1', octave: 3, yOffset: 0, staffLocationDescription: '5ª Linha', isLedger: false },
  { noteId: 'G3', solfege: 'Sol', letter: 'G', numberNotation: '7', octave: 3, yOffset: 10, staffLocationDescription: '4º Espaço', isLedger: false },
  { noteId: 'F3', solfege: 'Fá', letter: 'F', numberNotation: '6', octave: 3, yOffset: 20, staffLocationDescription: '4ª Linha (Clave de Fá)', isLedger: false },
  { noteId: 'E3', solfege: 'Mi', letter: 'E', numberNotation: '5', octave: 3, yOffset: 30, staffLocationDescription: '3º Espaço', isLedger: false },
  { noteId: 'D3', solfege: 'Ré', letter: 'D', numberNotation: '4', octave: 3, yOffset: 40, staffLocationDescription: '3ª Linha (Centro)', isLedger: false },
  { noteId: 'C3', solfege: 'Dó', letter: 'C', numberNotation: '3', octave: 3, yOffset: 50, staffLocationDescription: '2º Espaço', isLedger: false },
  { noteId: 'B2', solfege: 'Si', letter: 'B', numberNotation: '2', octave: 2, yOffset: 60, staffLocationDescription: '2ª Linha', isLedger: false },
  { noteId: 'A2', solfege: 'Lá', letter: 'A', numberNotation: '1', octave: 2, yOffset: 70, staffLocationDescription: '1º Espaço', isLedger: false },
  { noteId: 'G2', solfege: 'Sol', letter: 'G', numberNotation: '7', octave: 2, yOffset: 80, staffLocationDescription: '1ª Linha (Grave)', isLedger: false },
  { noteId: 'F2', solfege: 'Fá', letter: 'F', numberNotation: '6', octave: 2, yOffset: 90, staffLocationDescription: 'Espaço Abaixo da 1ª Linha', isLedger: false },
  { noteId: 'E2', solfege: 'Mi', letter: 'E', numberNotation: '5', octave: 2, yOffset: 100, staffLocationDescription: '1ª Linha Sup. Inferior', isLedger: true, ledgerPositions: [100] },
];

export const VisualStaffEditor: React.FC<VisualStaffEditorProps> = ({
  notes,
  onChangeNotes,
  timeSignature = '4/4',
  bpm = 90,
  clef = 'sol',
  onChangeClef,
  playbackInstrument = 'trompete',
  onPlayNoteDef,
}) => {
  // Paleta de Edição
  const [selectedFigure, setSelectedFigure] = useState<RhythmicFigure>('seminima');
  const [isRestMode, setIsRestMode] = useState<boolean>(false);
  const [isDottedMode, setIsDottedMode] = useState<boolean>(false);
  const [selectedAccidental, setSelectedAccidental] = useState<AccidentalType>('none');
  const [activeClef, setActiveClef] = useState<ClefType>(clef);

  // Seleção e Interação
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(null);
  const [hoveredPitch, setHoveredPitch] = useState<StaffPitchLevel | null>(null);

  // Playback
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const staffLevels = activeClef === 'sol' ? TREBLE_STAFF_LEVELS : BASS_STAFF_LEVELS;

  // Atualizar clave
  const handleToggleClef = (newClef: ClefType) => {
    setActiveClef(newClef);
    if (onChangeClef) onChangeClef(newClef);
  };

  // Calcular batidas da figura atual com ponto de aumento
  const getCurrentFigureBeats = (): number => {
    const fig = RHYTHMIC_FIGURES.find(f => f.type === selectedFigure) || RHYTHMIC_FIGURES[3];
    return isDottedMode ? fig.baseBeats * 1.5 : fig.baseBeats;
  };

  // Tocar som de teste
  const playSampleSound = (noteId: string) => {
    const noteDef = findNoteDefinition(noteId) || TRUMPET_NOTES.find(n => n.id === noteId);
    if (noteDef) {
      if (playbackInstrument === 'piano') {
        trumpetAudio.playPianoTone(noteDef, 0.5, 0.85);
      } else {
        trumpetAudio.playTrumpetTone(noteDef, 0.5);
      }
      if (onPlayNoteDef) onPlayNoteDef(noteDef);
    }
  };

  // Inserir nota ao clicar em uma linha/espaço do pentagrama
  const handleStaffLevelClick = (level: StaffPitchLevel) => {
    const beats = getCurrentFigureBeats();
    let finalNoteId = level.noteId;

    if (selectedAccidental === 'sharp') {
      finalNoteId = `${level.letter}#${level.octave}`;
    } else if (selectedAccidental === 'flat') {
      finalNoteId = `${level.letter}b${level.octave}`;
    }

    const newItem: StaffNoteItem = {
      id: `sn-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      noteId: isRestMode ? 'REST' : finalNoteId,
      isRest: isRestMode,
      figure: selectedFigure,
      beats,
      dotted: isDottedMode,
      accidental: selectedAccidental,
      customTip: isRestMode 
        ? `Pausa de ${RHYTHMIC_FIGURES.find(f => f.type === selectedFigure)?.name}`
        : `${level.solfege} [${level.numberNotation}] • ${level.staffLocationDescription}`,
    };

    if (selectedNoteIndex !== null && selectedNoteIndex < notes.length) {
      // Inserir após a nota selecionada
      const updated = [...notes];
      updated.splice(selectedNoteIndex + 1, 0, newItem);
      onChangeNotes(updated);
      setSelectedNoteIndex(selectedNoteIndex + 1);
    } else {
      // Adicionar ao final
      onChangeNotes([...notes, newItem]);
      setSelectedNoteIndex(notes.length);
    }

    if (!isRestMode) {
      playSampleSound(finalNoteId);
    }
  };

  // Remover nota selecionada
  const handleDeleteNote = (index: number) => {
    const updated = notes.filter((_, i) => i !== index);
    onChangeNotes(updated);
    if (selectedNoteIndex === index) {
      setSelectedNoteIndex(null);
    } else if (selectedNoteIndex !== null && selectedNoteIndex > index) {
      setSelectedNoteIndex(selectedNoteIndex - 1);
    }
  };

  // Limpar toda a pauta
  const handleClearAll = () => {
    onChangeNotes([]);
    setSelectedNoteIndex(null);
  };

  // Playback da partitura no pentagrama
  const handlePlayStaff = () => {
    if (notes.length === 0) return;
    if (isPlaying) {
      handleStopStaff();
      return;
    }

    setIsPlaying(true);
    const secondsPerBeat = 60 / bpm;

    // Converte itens para a sequência de áudio
    const sequence = notes.map((item) => {
      if (item.isRest) {
        // Pausa (silêncio)
        return {
          note: {
            id: 'REST',
            solfege: 'Pausa',
            letter: 'P',
            numberNotation: '0',
            frequency: 0,
            valvesBb: [false, false, false] as [boolean, boolean, boolean],
            fingerDescription: 'Pausa',
            octave: 0,
            midiNumber: 0,
            semitoneIndex: 0,
            difficulty: 'iniciante' as const,
          } as NoteDefinition,
          durationSeconds: item.beats * secondsPerBeat,
        };
      }
      const def = findNoteDefinition(item.noteId) || TRUMPET_NOTES.find(n => n.id === item.noteId) || TRUMPET_NOTES[6];
      return {
        note: def,
        durationSeconds: item.beats * secondsPerBeat,
      };
    });

    trumpetAudio.playScoreMelody(
      sequence,
      (highlightIdx) => {
        setPlayingIndex(highlightIdx);
      },
      () => {
        setIsPlaying(false);
        setPlayingIndex(null);
      }
    );
  };

  const handleStopStaff = () => {
    trumpetAudio.stopScoreMelody();
    setIsPlaying(false);
    setPlayingIndex(null);
  };

  // Obter detalhes de posição visual de uma nota no pentagrama
  const getPitchLevelForNote = (noteId: string): StaffPitchLevel => {
    // Normalizar letra base (remover acidentes para encontrar a linha do pentagrama)
    const baseLetter = noteId.charAt(0);
    const octave = parseInt(noteId.slice(-1), 10) || 4;
    const baseId = `${baseLetter}${octave}`;
    const found = staffLevels.find(l => l.noteId === baseId);
    return found || staffLevels[6]; // B4 por padrão
  };

  // Calcular compassos: 4/4 = 4 batidas por compasso, 3/4 = 3 batidas
  const beatsPerMeasure = timeSignature === '3/4' ? 3 : timeSignature === '2/4' ? 2 : timeSignature === '6/8' ? 3 : 4;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4">
      {/* CABEÇALHO DO PENTAGRAMA E SELEÇÃO DE CLAVE */}
      <div className="p-4 sm:p-5 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shadow-md">
            🎼
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Pentagrama Interativo
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase">
                Editor Visual
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Clique diretamente nas 5 linhas e 4 espaços do pentagrama para inserir figuras musicais com som real
            </p>
          </div>
        </div>

        {/* Alternador de Clave de Sol vs Clave de Fá */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-bold hidden sm:inline">Clave:</span>
          <div className="flex items-center bg-stone-800 p-1 rounded-xl border border-stone-700 text-xs font-bold">
            <button
              type="button"
              id="clef-treble-btn"
              onClick={() => handleToggleClef('sol')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeClef === 'sol'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <span className="text-sm">𝄞</span>
              <span>Clave de Sol</span>
            </button>
            <button
              type="button"
              id="clef-bass-btn"
              onClick={() => handleToggleClef('fa')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeClef === 'fa'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <span className="text-sm">𝄢</span>
              <span>Clave de Fá</span>
            </button>
          </div>

          {/* Botões de Ação Rápida de Reprodução */}
          <button
            type="button"
            id="play-staff-btn"
            onClick={handlePlayStaff}
            disabled={notes.length === 0}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Parar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Ouvir Pauta ({notes.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* PALETA DE FIGURAS RÍTMICAS (BREVE, SEMIBREVE, MÍNIMA, SEMÍNIMA, COLCHEIA, SEMICOLCHEIA E PAUSAS) */}
      <div className="px-4 sm:px-6 pt-2">
        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
          {/* Seletor das 6 Figuras Rítmicas */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-black uppercase text-stone-500 mr-1">
              Figura Musical:
            </span>
            {RHYTHMIC_FIGURES.map((fig) => {
              const isSel = selectedFigure === fig.type && !isRestMode;
              return (
                <button
                  key={fig.type}
                  type="button"
                  id={`fig-btn-${fig.type}`}
                  onClick={() => {
                    setSelectedFigure(fig.type);
                    setIsRestMode(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSel
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300 font-black'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                  title={`${fig.name} — ${fig.description}`}
                >
                  <span className="text-base leading-none">{fig.symbol}</span>
                  <span>{fig.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">[{fig.baseBeats}t]</span>
                </button>
              );
            })}
          </div>

          {/* Modificadores: Pausa, Ponto de Aumento, Sustenido, Bemol, Bequadro */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Modo Pausa */}
            <button
              type="button"
              id="staff-btn-rest-mode"
              onClick={() => setIsRestMode(!isRestMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                isRestMode
                  ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
              title="Inserir Pausa (Silêncio) com a duração selecionada"
            >
              <span>𝄽</span>
              <span>Pausa</span>
            </button>

            {/* Ponto de Aumento */}
            <button
              type="button"
              id="staff-btn-dotted-mode"
              onClick={() => setIsDottedMode(!isDottedMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                isDottedMode
                  ? 'bg-amber-500 text-stone-950 shadow-sm ring-2 ring-amber-300'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
              title="Ponto de Aumento: adiciona metade do valor da figura"
            >
              <span className="text-sm font-black">•</span>
              <span>Ponto (.)</span>
            </button>

            {/* Acidentes */}
            <div className="flex items-center bg-white p-0.5 rounded-xl border border-stone-200 text-xs font-bold">
              {[
                { type: 'none', symbol: '♮', label: 'Natural' },
                { type: 'sharp', symbol: '♯', label: 'Sustenido' },
                { type: 'flat', symbol: '♭', label: 'Bemol' },
              ].map((acc) => (
                <button
                  key={acc.type}
                  type="button"
                  onClick={() => setSelectedAccidental(acc.type as AccidentalType)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    selectedAccidental === acc.type
                      ? 'bg-amber-100 text-amber-950 font-black'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title={acc.label}
                >
                  <span className="font-serif">{acc.symbol}</span>
                </button>
              ))}
            </div>

            {/* Limpar pauta */}
            {notes.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors cursor-pointer"
                title="Limpar todas as notas do pentagrama"
              >
                Limpar Pauta
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DICA DA LINHA / ESPAÇO ATIVO SOB O CURSOR */}
      <div className="px-4 sm:px-6">
        <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-800 font-black">
              📍 Posicionador no Pentagrama:
            </span>
            {hoveredPitch ? (
              <span className="font-bold text-stone-800">
                {hoveredPitch.staffLocationDescription} ➔{' '}
                <strong className="text-amber-900">{hoveredPitch.solfege} ({hoveredPitch.letter}{hoveredPitch.octave})</strong>{' '}
                <span className="text-[11px] font-mono text-stone-500">[{hoveredPitch.numberNotation}]</span>
              </span>
            ) : (
              <span className="text-stone-500">
                Passe o mouse ou clique no pentagrama abaixo para posicionar a figura ({RHYTHMIC_FIGURES.find(f => f.type === selectedFigure)?.name})
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-900">
            Compasso {timeSignature} • {beatsPerMeasure} tempos por compasso
          </span>
        </div>
      </div>

      {/* PENTAGRAMA VETORIAL INTERATIVO COM LINHAS, ESPAÇOS E NOTAS ADICIONADAS */}
      <div className="px-4 sm:px-6 pb-6 overflow-x-auto">
        <div className="min-w-[840px] bg-[#FFFDF9] border border-amber-200/80 rounded-2xl p-6 shadow-inner relative select-none">
          {/* TÍTULO E CLAVE NA PAUTA */}
          <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-2 text-xs font-mono text-stone-500">
            <span className="font-bold text-stone-800 flex items-center gap-2">
              <span className="text-lg leading-none">{activeClef === 'sol' ? '𝄞' : '𝄢'}</span>
              <span>Pauta Musical — {activeClef === 'sol' ? 'Clave de Sol (2ª Linha)' : 'Clave de Fá (4ª Linha)'}</span>
            </span>
            <span>Total: {notes.length} notas ({notes.reduce((acc, n) => acc + n.beats, 0)} tempos)</span>
          </div>

          {/* SVG DA PAUTA COM AS LINHAS HORIZONTAIS */}
          <div className="relative py-8">
            <svg
              className="w-full h-44 overflow-visible"
              viewBox="0 0 1000 160"
              preserveAspectRatio="none"
            >
              {/* Áreas de clique invisíveis para cada altura (linha / espaço) */}
              {staffLevels.map((lvl) => {
                const y = lvl.yOffset + 30; // offset para centralizar
                return (
                  <rect
                    key={lvl.noteId}
                    x="80"
                    y={y - 5}
                    width="920"
                    height="10"
                    fill={hoveredPitch?.noteId === lvl.noteId ? 'rgba(245, 158, 11, 0.15)' : 'transparent'}
                    className="cursor-pointer transition-colors"
                    onMouseEnter={() => setHoveredPitch(lvl)}
                    onMouseLeave={() => setHoveredPitch(null)}
                    onClick={() => handleStaffLevelClick(lvl)}
                  />
                );
              })}

              {/* As 5 Linhas Mestras do Pentagrama (y: 30, 50, 70, 90, 110 correspondendo às 5ª, 4ª, 3ª, 2ª e 1ª linhas) */}
              {[30, 50, 70, 90, 110].map((y, idx) => (
                <line
                  key={y}
                  x1="20"
                  y1={y}
                  x2="980"
                  y2={y}
                  stroke="#1c1917"
                  strokeWidth="1.75"
                />
              ))}

              {/* Barra Inicial Dupla da Pauta */}
              <line x1="20" y1="30" x2="20" y2="110" stroke="#1c1917" strokeWidth="3" />
              <line x1="25" y1="30" x2="25" y2="110" stroke="#1c1917" strokeWidth="1.5" />

              {/* Clave de Sol ou Fá desenhada no início */}
              <text
                x="32"
                y={activeClef === 'sol' ? 95 : 75}
                fontSize={activeClef === 'sol' ? "68" : "54"}
                fontFamily="serif"
                fill="#1c1917"
                className="select-none pointer-events-none"
              >
                {activeClef === 'sol' ? '𝄞' : '𝄢'}
              </text>

              {/* Fórmula de Compasso (ex: 4/4) */}
              <text
                x="72"
                y="65"
                fontSize="32"
                fontWeight="900"
                fontFamily="sans-serif"
                fill="#1c1917"
                textAnchor="middle"
                className="select-none pointer-events-none"
              >
                {timeSignature.split('/')[0]}
              </text>
              <text
                x="72"
                y="102"
                fontSize="32"
                fontWeight="900"
                fontFamily="sans-serif"
                fill="#1c1917"
                textAnchor="middle"
                className="select-none pointer-events-none"
              >
                {timeSignature.split('/')[1] || '4'}
              </text>

              {/* Linha vertical final */}
              <line x1="980" y1="30" x2="980" y2="110" stroke="#1c1917" strokeWidth="3" />
            </svg>

            {/* NOTAS E PAUSAS RENDERIZADAS SOBRE O PENTAGRAMA */}
            <div className="absolute inset-0 pl-24 pr-8 flex items-center pointer-events-none">
              <div className="flex items-center gap-1 w-full overflow-x-auto py-4 pointer-events-auto">
                {notes.map((item, index) => {
                  const isPlayingThis = isPlaying && playingIndex === index;
                  const isSelected = selectedNoteIndex === index;
                  const pitchInfo = getPitchLevelForNote(item.noteId);
                  // y centralizado na pauta (30 é o topo da 5ª linha)
                  const noteY = pitchInfo.yOffset + 30;
                  const isStemUp = pitchInfo.yOffset >= 40; // Abaixo da 3ª linha haste sobe

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedNoteIndex(index);
                        if (!item.isRest) playSampleSound(item.noteId);
                      }}
                      className={`relative flex flex-col items-center justify-center cursor-pointer px-2 py-1 rounded-xl transition-all ${
                        isPlayingThis
                          ? 'bg-amber-500/20 ring-2 ring-amber-500 scale-105'
                          : isSelected
                          ? 'bg-sky-500/15 ring-2 ring-sky-400'
                          : 'hover:bg-stone-100/80'
                      }`}
                      style={{ minWidth: '46px', height: '140px' }}
                      title={`${item.isRest ? 'Pausa' : `${pitchInfo.solfege} (${pitchInfo.letter})`} - ${item.beats} tempos`}
                    >
                      {/* Desenho do símbolo musical exato posicionado verticalmente */}
                      <div
                        className="absolute flex items-center justify-center transition-transform"
                        style={{ top: `${Math.max(0, Math.min(115, noteY - 10))}px` }}
                      >
                        {/* Linhas suplementares se a nota for ledger */}
                        {pitchInfo.isLedger && (
                          <div
                            className="absolute w-7 h-0.5 bg-stone-900"
                            style={{ top: '8px' }}
                          />
                        )}

                        {item.isRest ? (
                          // Símbolo de Pausa
                          <div className="font-serif font-black text-xl text-stone-800">
                            {item.figure === 'semibreve' || item.figure === 'breve'
                              ? '𝄻'
                              : item.figure === 'minima'
                              ? '𝄼'
                              : item.figure === 'seminima'
                              ? '𝄽'
                              : item.figure === 'colcheia'
                              ? '𝄾'
                              : '𝄿'}
                          </div>
                        ) : (
                          // Cabeça de nota + haste + bandeirola
                          <div className="relative flex items-center">
                            {/* Acidente (♯ / ♭ / ♮) */}
                            {item.accidental !== 'none' && (
                              <span className="text-xs font-serif font-black mr-0.5 text-stone-800">
                                {item.accidental === 'sharp' ? '♯' : item.accidental === 'flat' ? '♭' : '♮'}
                              </span>
                            )}

                            {/* Cabeça da Nota */}
                            <div
                              className={`w-3.5 h-2.5 rounded-full rotate-[-20deg] border-2 border-stone-950 transition-colors ${
                                item.figure === 'semibreve' || item.figure === 'breve' || item.figure === 'minima'
                                  ? 'bg-white'
                                  : 'bg-stone-950'
                              } ${isPlayingThis ? '!bg-amber-500 !border-amber-600' : ''}`}
                            />

                            {/* Ponto de Aumento (.) */}
                            {item.dotted && (
                              <span className="text-xs font-black ml-1 text-stone-950">•</span>
                            )}

                            {/* Haste (Stem) se não for semibreve ou breve */}
                            {item.figure !== 'semibreve' && item.figure !== 'breve' && (
                              <div
                                className={`absolute w-0.5 bg-stone-950 ${
                                  isStemUp
                                    ? 'h-8 bottom-1 right-0'
                                    : 'h-8 top-1 left-0'
                                } ${isPlayingThis ? '!bg-amber-600' : ''}`}
                              >
                                {/* Bandeirola para Colcheia e Semicolcheia */}
                                {item.figure === 'colcheia' && (
                                  <div
                                    className={`absolute w-2 h-2.5 border-r-2 border-stone-950 ${
                                      isStemUp ? 'top-0 right-0 rounded-tr-full' : 'bottom-0 left-0 rounded-bl-full'
                                    }`}
                                  />
                                )}
                                {item.figure === 'semicolcheia' && (
                                  <div
                                    className={`absolute w-2.5 h-4 flex flex-col justify-between ${
                                      isStemUp ? 'top-0 right-0' : 'bottom-0 left-0'
                                    }`}
                                  >
                                    <span className="w-2 h-1 border-r-2 border-stone-950 block rounded-tr-full" />
                                    <span className="w-2 h-1 border-r-2 border-stone-950 block rounded-tr-full" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Rótulo inferior da nota com Solfejo e Cifra */}
                      <div className="absolute bottom-1 flex flex-col items-center leading-none text-center">
                        <span className="text-[10px] font-black text-stone-800">
                          {item.isRest ? 'Pausa' : pitchInfo.solfege}
                        </span>
                        <span className="text-[9px] font-mono text-stone-500">
                          {item.isRest ? `${item.beats}t` : `[${pitchInfo.numberNotation}]`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAINEL INFERIOR: NOTA SELECIONADA E CONTROLES DE EDIÇÃO */}
      {selectedNoteIndex !== null && selectedNoteIndex < notes.length && (
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm shadow-xs">
              {notes[selectedNoteIndex].isRest ? '𝄽' : notes[selectedNoteIndex].noteId}
            </div>
            <div>
              <span className="text-xs font-black text-stone-900 block">
                Nota #{selectedNoteIndex + 1}: {notes[selectedNoteIndex].isRest ? 'Pausa de Silêncio' : notes[selectedNoteIndex].noteId}
              </span>
              <span className="text-[11px] text-stone-500 block">
                Figura: {RHYTHMIC_FIGURES.find(f => f.type === notes[selectedNoteIndex].figure)?.name} • {notes[selectedNoteIndex].beats} tempos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!notes[selectedNoteIndex].isRest && (
              <button
                type="button"
                onClick={() => playSampleSound(notes[selectedNoteIndex].noteId)}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ouvir</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleDeleteNote(selectedNoteIndex)}
              className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remover da Pauta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
