import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Award, CheckCircle2, Music, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { trumpetAudio } from '../utils/audioEngine';
import { findNoteDefinition } from '../data/pianoKeyboardMap';
import { NoteDefinition } from '../types';

interface PianoExerciseItem {
  id: string;
  title: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  category: string;
  description: string;
  tempoBpm: number;
  notes: { noteId: string; fingerMD?: number; fingerME?: number; duration: number }[];
  proTip: string;
}

const PIANO_EXERCISES: PianoExerciseItem[] = [
  {
    id: 'p-ex-1',
    title: 'Estudo dos 5 Dedos em Dó Maior (Five-Finger Pattern)',
    level: 'Iniciante',
    category: 'Coordenação & Força',
    description: 'Articule cada dedo independentemente de 1 a 5 sem mexer o braço nem levantar o punho.',
    tempoBpm: 72,
    proTip: 'Toque em legato cantabile: cada dedo só sobe quando o próximo descer na tecla.',
    notes: [
      { noteId: 'C4', fingerMD: 1, fingerME: 5, duration: 1 },
      { noteId: 'D4', fingerMD: 2, fingerME: 4, duration: 1 },
      { noteId: 'E4', fingerMD: 3, fingerME: 3, duration: 1 },
      { noteId: 'F4', fingerMD: 4, fingerME: 2, duration: 1 },
      { noteId: 'G4', fingerMD: 5, fingerME: 1, duration: 2 },
      { noteId: 'F4', fingerMD: 4, fingerME: 2, duration: 1 },
      { noteId: 'E4', fingerMD: 3, fingerME: 3, duration: 1 },
      { noteId: 'D4', fingerMD: 2, fingerME: 4, duration: 1 },
      { noteId: 'C4', fingerMD: 1, fingerME: 5, duration: 2 },
    ]
  },
  {
    id: 'p-ex-2',
    title: 'Escala de Dó Maior com Passagem do Polegar (Thumb-Under)',
    level: 'Intermediário',
    category: 'Escalas & Agilidade',
    description: 'Treine a rotação flexível do polegar que desliza suavemente por baixo do dedo 3 na subida.',
    tempoBpm: 84,
    proTip: 'Não levante o cotovelo durante a passagem; deixe o polegar viajar por baixo da palma naturalmente.',
    notes: [
      { noteId: 'C4', fingerMD: 1, duration: 1 },
      { noteId: 'D4', fingerMD: 2, duration: 1 },
      { noteId: 'E4', fingerMD: 3, duration: 1 },
      { noteId: 'F4', fingerMD: 1, duration: 1 },
      { noteId: 'G4', fingerMD: 2, duration: 1 },
      { noteId: 'A4', fingerMD: 3, duration: 1 },
      { noteId: 'B4', fingerMD: 4, duration: 1 },
      { noteId: 'C5', fingerMD: 5, duration: 2 },
      { noteId: 'B4', fingerMD: 4, duration: 1 },
      { noteId: 'A4', fingerMD: 3, duration: 1 },
      { noteId: 'G4', fingerMD: 2, duration: 1 },
      { noteId: 'F4', fingerMD: 1, duration: 1 },
      { noteId: 'E4', fingerMD: 3, duration: 1 },
      { noteId: 'D4', fingerMD: 2, duration: 1 },
      { noteId: 'C4', fingerMD: 1, duration: 2 },
    ]
  },
  {
    id: 'p-ex-3',
    title: 'Ciclo de Inversões de Tríades: C ➔ F/A ➔ G/B ➔ C',
    level: 'Intermediário',
    category: 'Harmonia & Condução de Vozes',
    description: 'Aplique o princípio da economia de movimentos mantendo as notas comuns com os mesmos dedos.',
    tempoBpm: 66,
    proTip: 'Observe como a nota Dó se mantém como âncora fixa na transição entre C e Fá Maior.',
    notes: [
      { noteId: 'C4', duration: 1 },
      { noteId: 'E4', duration: 1 },
      { noteId: 'G4', duration: 2 },
      { noteId: 'C4', duration: 1 },
      { noteId: 'F4', duration: 1 },
      { noteId: 'A4', duration: 2 },
      { noteId: 'B3', duration: 1 },
      { noteId: 'D4', duration: 1 },
      { noteId: 'G4', duration: 2 },
      { noteId: 'C4', duration: 2 },
      { noteId: 'E4', duration: 2 },
      { noteId: 'G4', duration: 3 },
    ]
  },
  {
    id: 'p-ex-4',
    title: 'Baixo Alberti Clássico (Estilo Mozart Sonata em C)',
    level: 'Avançado',
    category: 'Polifonia & Acompanhamento',
    description: 'Faça a mão esquerda pulsar no fluxo Baixo - Agudo - Médio - Agudo com rotação suave do antebraço.',
    tempoBpm: 96,
    proTip: 'Use a inércia rotacional do antebraço em vez de forçar os dedos individuais.',
    notes: [
      { noteId: 'C3', duration: 0.5 },
      { noteId: 'G3', duration: 0.5 },
      { noteId: 'E3', duration: 0.5 },
      { noteId: 'G3', duration: 0.5 },
      { noteId: 'C3', duration: 0.5 },
      { noteId: 'G3', duration: 0.5 },
      { noteId: 'E3', duration: 0.5 },
      { noteId: 'G3', duration: 0.5 },
      { noteId: 'F3', duration: 0.5 },
      { noteId: 'C4', duration: 0.5 },
      { noteId: 'A3', duration: 0.5 },
      { noteId: 'C4', duration: 0.5 },
      { noteId: 'G3', duration: 0.5 },
      { noteId: 'D4', duration: 0.5 },
      { noteId: 'B3', duration: 0.5 },
      { noteId: 'D4', duration: 0.5 },
      { noteId: 'C3', duration: 2 },
    ]
  }
];

export interface PianoExercisesViewProps {
  onSelectNote?: (note: NoteDefinition) => void;
}

export const PianoExercisesView: React.FC<PianoExercisesViewProps> = ({ onSelectNote }) => {
  const [selectedEx, setSelectedEx] = useState<PianoExerciseItem>(PIANO_EXERCISES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIdx, setCurrentNoteIdx] = useState<number>(-1);

  const handlePlayExercise = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentNoteIdx(-1);
      return;
    }

    setIsPlaying(true);
    let noteIndex = 0;
    const beatMs = (60 / selectedEx.tempoBpm) * 1000;

    const playNext = () => {
      if (noteIndex >= selectedEx.notes.length) {
        setIsPlaying(false);
        setCurrentNoteIdx(-1);
        return;
      }

      const note = selectedEx.notes[noteIndex];
      setCurrentNoteIdx(noteIndex);
      const noteDef = findNoteDefinition(note.noteId);
      if (noteDef) {
        trumpetAudio.playPianoTone(noteDef, note.duration * 1.5, 0.85);
      }

      noteIndex++;
      const durationMs = note.duration * beatMs;
      window.setTimeout(playNext, durationMs);
    };

    playNext();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* CABEÇALHO */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black mb-2">
          <span>🎹</span>
          <span>Prática & Exercícios Técnicos de Piano</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Treinos Práticos de Dedilhado, Escalas e Independência
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
          Exercícios progressivos guiados com numeração de dedos (1 a 5) para Mão Direita e Mão Esquerda, reprodução com áudio estéreo de piano e dicas de biomecânica.
        </p>

        {/* LISTA DE EXERCÍCIOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-100">
          {PIANO_EXERCISES.map((ex) => {
            const isSelected = selectedEx.id === ex.id;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => {
                  setSelectedEx(ex);
                  setIsPlaying(false);
                  setCurrentNoteIdx(-1);
                }}
                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                }`}
              >
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  ex.level === 'Iniciante' ? 'bg-amber-100 text-amber-900' : ex.level === 'Intermediário' ? 'bg-sky-100 text-sky-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {ex.level}
                </span>
                <h3 className="text-xs font-black text-stone-900 mt-2 line-clamp-2 leading-snug">
                  {ex.title}
                </h3>
                <span className="text-[11px] text-stone-500 font-medium block mt-1">
                  {ex.category} • {ex.tempoBpm} BPM
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PAINEL DO EXERCÍCIO ATIVO */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-700">
              {selectedEx.category} • Nível {selectedEx.level}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
              {selectedEx.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              {selectedEx.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePlayExercise}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-stone-900 hover:bg-black text-amber-300'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pausar Estudo' : 'Ouvir no Piano'}</span>
            </button>
          </div>
        </div>

        {/* NOTAS E DIGITAÇÃO (MD e ME) */}
        <div>
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-3">
            Sequência de Notas e Digitação de Dedos (1 Polegar ... 5 Mínimo):
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedEx.notes.map((item, idx) => {
              const noteDef = findNoteDefinition(item.noteId);
              const isCurrent = currentNoteIdx === idx;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-center transition-all min-w-[70px] ${
                    isCurrent
                      ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-md scale-110 font-black ring-2 ring-amber-300'
                      : 'bg-stone-50 text-stone-800 border-stone-200'
                  }`}
                >
                  <span className="text-sm font-black block">{noteDef.solfege}</span>
                  <span className="text-[10px] font-mono opacity-80 block">{noteDef.letter}</span>
                  {item.fingerMD && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                      MD: {item.fingerMD}
                    </span>
                  )}
                  {item.fingerME && (
                    <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                      ME: {item.fingerME}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* DICA DE BIOMECÂNICA */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-black text-amber-950 block">
              Dica de Ouro de Execução:
            </span>
            <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
              {selectedEx.proTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
