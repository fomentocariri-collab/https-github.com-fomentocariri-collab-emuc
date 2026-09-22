import React, { useState } from 'react';
import { Volume2, Sparkles, Layers, Play, Check, BookOpen, Music, ChevronRight } from 'lucide-react';
import { trumpetAudio } from '../utils/audioEngine';
import { findNoteDefinition } from '../data/pianoKeyboardMap';
import { NoteDefinition } from '../types';

interface ChordFormula {
  name: string;
  suffix: string;
  category: 'Tríades Básicas' | 'Acordes com Sétima (Tétrades)' | 'Inversões de Piano';
  semitones: number[];
  formula: string;
  description: string;
  exampleC: string[];
  fingeringMD: string;
  fingeringME: string;
}

const PIANO_CHORD_FORMULAS: ChordFormula[] = [
  {
    name: 'Maior',
    suffix: '',
    category: 'Tríades Básicas',
    semitones: [0, 4, 7],
    formula: '1 — 3ªM — 5ªJ (Tônica + 4st + 3st)',
    description: 'Sonoridade brilhante, afirmativa e solar. Base da harmonia tonal.',
    exampleC: ['C4', 'E4', 'G4'],
    fingeringMD: '1 - 3 - 5',
    fingeringME: '5 - 3 - 1',
  },
  {
    name: 'Menor',
    suffix: 'm',
    category: 'Tríades Básicas',
    semitones: [0, 3, 7],
    formula: '1 — 3ªm — 5ªJ (Tônica + 3st + 4st)',
    description: 'Sonoridade introspectiva, melancólica e profunda.',
    exampleC: ['C4', 'Eb4', 'G4'],
    fingeringMD: '1 - 3 - 5',
    fingeringME: '5 - 3 - 1',
  },
  {
    name: '1ª Inversão (Terça no Baixo)',
    suffix: '/3',
    category: 'Inversões de Piano',
    semitones: [4, 7, 12],
    formula: '3ªM — 5ªJ — 8ª (Terça no baixo, ex: C/E)',
    description: 'Movimento suave de baixo que caminha por graus conjuntos.',
    exampleC: ['E4', 'G4', 'C5'],
    fingeringMD: '1 - 2 - 5',
    fingeringME: '5 - 3 - 1',
  },
  {
    name: '2ª Inversão (Quinta no Baixo)',
    suffix: '/5',
    category: 'Inversões de Piano',
    semitones: [7, 12, 16],
    formula: '5ªJ — 8ª — 10ª (Quinta no baixo, ex: C/G)',
    description: 'Estabilidade orquestral e suspensão cadencial clássica (I 6/4).',
    exampleC: ['G4', 'C5', 'E5'],
    fingeringMD: '1 - 3 - 5 ou 1 - 2 - 4',
    fingeringME: '5 - 2 - 1',
  },
  {
    name: 'Sétima Maior',
    suffix: 'maj7',
    category: 'Acordes com Sétima (Tétrades)',
    semitones: [0, 4, 7, 11],
    formula: '1 — 3ªM — 5ªJ — 7ªM (Bossa nova, balada e jazz)',
    description: 'Sonoridade sonhadora, suave e luxuosa.',
    exampleC: ['C4', 'E4', 'G4', 'B4'],
    fingeringMD: '1 - 2 - 3 - 5',
    fingeringME: '5 - 3 - 2 - 1',
  },
  {
    name: 'Sétima da Dominante',
    suffix: '7',
    category: 'Acordes com Sétima (Tétrades)',
    semitones: [0, 4, 7, 10],
    formula: '1 — 3ªM — 5ªJ — 7ªm (Trítono resolutivo entre 3ª e 7ª)',
    description: 'Tensão máxima que prepara e atrai a resolução na tônica.',
    exampleC: ['C4', 'E4', 'G4', 'Bb4'],
    fingeringMD: '1 - 2 - 3 - 5',
    fingeringME: '5 - 3 - 2 - 1',
  },
  {
    name: 'Menor com Sétima',
    suffix: 'm7',
    category: 'Acordes com Sétima (Tétrades)',
    semitones: [0, 3, 7, 10],
    formula: '1 — 3ªm — 5ªJ — 7ªm (Acorde II clássico)',
    description: 'Elegância aveludada, base para sambas e baladas pop.',
    exampleC: ['C4', 'Eb4', 'G4', 'Bb4'],
    fingeringMD: '1 - 2 - 3 - 5',
    fingeringME: '5 - 3 - 2 - 1',
  },
  {
    name: 'Meio-Diminuto',
    suffix: 'm7(b5)',
    category: 'Acordes com Sétima (Tétrades)',
    semitones: [0, 3, 6, 10],
    formula: '1 — 3ªm — 5ªdim — 7ªm',
    description: 'Tensão dramática, clássico II grau em tonalidades menores.',
    exampleC: ['C4', 'Eb4', 'Gb4', 'Bb4'],
    fingeringMD: '1 - 2 - 3 - 5',
    fingeringME: '5 - 3 - 2 - 1',
  },
];

const ROOT_KEYS = [
  { name: 'C', solfege: 'Dó', num: '3', noteId: 'C4' },
  { name: 'D', solfege: 'Ré', num: '4', noteId: 'D4' },
  { name: 'E', solfege: 'Mi', num: '5', noteId: 'E4' },
  { name: 'F', solfege: 'Fá', num: '6', noteId: 'F4' },
  { name: 'G', solfege: 'Sol', num: '7', noteId: 'G4' },
  { name: 'A', solfege: 'Lá', num: '1', noteId: 'A4' },
  { name: 'B', solfege: 'Si', num: '2', noteId: 'B4' },
  { name: 'Bb', solfege: 'Si♭', num: '2b', noteId: 'Bb4' },
  { name: 'Eb', solfege: 'Mi♭', num: '5b', noteId: 'Eb4' },
  { name: 'F#', solfege: 'Fá♯', num: '6#', noteId: 'F#4' },
];

export interface PianoHarmonyViewProps {
  onSelectNote?: (note: NoteDefinition) => void;
}

export const PianoHarmonyView: React.FC<PianoHarmonyViewProps> = ({ onSelectNote }) => {
  const [selectedRoot, setSelectedRoot] = useState(ROOT_KEYS[0]);
  const [selectedChord, setSelectedChord] = useState<ChordFormula>(PIANO_CHORD_FORMULAS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Tocar acorde em bloco (todas as notas juntas)
  const playBlockChord = () => {
    selectedChord.exampleC.forEach((noteId) => {
      const noteDef = findNoteDefinition(noteId);
      if (noteDef) {
        trumpetAudio.playPianoTone(noteDef, 2.2, 0.75);
      }
    });
  };

  // Tocar acorde arpejado (nota por nota com delay suave)
  const playArpeggiatedChord = () => {
    selectedChord.exampleC.forEach((noteId, index) => {
      window.setTimeout(() => {
        const noteDef = findNoteDefinition(noteId);
        if (noteDef) {
          trumpetAudio.playPianoTone(noteDef, 2.0, 0.8);
        }
      }, index * 120);
    });
  };

  const categories = ['Todos', 'Tríades Básicas', 'Inversões de Piano', 'Acordes com Sétima (Tétrades)'];

  const filteredChords = selectedCategory === 'Todos'
    ? PIANO_CHORD_FORMULAS
    : PIANO_CHORD_FORMULAS.filter((c) => c.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* CABEÇALHO */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black mb-2">
          <span>🎹</span>
          <span>Harmonia & Dicionário de Acordes para Piano</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Dicionário de Acordes, Inversões e Digitação de Dedos
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
          Visualize a posição exata de cada nota no teclado do piano, conheça o dedilhado recomendado para a mão direita (MD) e mão esquerda (ME), e escute os acordes em bloco ou arpejados.
        </p>

        {/* SELETOR DE TONALIDADE RAIZ */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
            Escolha a Tonalidade / Nota Fundamental:
          </span>
          <div className="flex flex-wrap gap-2">
            {ROOT_KEYS.map((rk) => {
              const isSelected = selectedRoot.name === rk.name;
              return (
                <button
                  key={rk.name}
                  type="button"
                  onClick={() => setSelectedRoot(rk)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs scale-105'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                  }`}
                >
                  <span>{rk.name}</span>
                  <span className={`text-[10px] ml-1 font-bold ${isSelected ? 'text-amber-100' : 'text-amber-800'}`}>
                    ({rk.solfege})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SELETOR DE CATEGORIA E CARDS DE ACORDES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LISTA LATERAL DE ACORDES */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs">
            {/* Abas de Categorias */}
            <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b border-stone-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-100 text-amber-950 font-black'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredChords.map((chord) => {
                const isSelected = selectedChord.name === chord.name;
                return (
                  <button
                    key={chord.name}
                    type="button"
                    onClick={() => setSelectedChord(chord)}
                    className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm ring-2 ring-amber-300 font-black'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200 font-bold'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black">
                          {selectedRoot.name}{chord.suffix}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${
                          isSelected ? 'bg-stone-950 text-amber-300' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {chord.name}
                        </span>
                      </div>
                      <span className={`text-[11px] font-mono mt-0.5 block ${isSelected ? 'text-stone-900' : 'text-stone-500'}`}>
                        {chord.formula}
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-stone-950' : 'text-stone-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* DETALHES DO ACORDE SELECIONADO E TECLADO VISUAL */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
            {/* Título do Acorde */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                    {selectedRoot.name}{selectedChord.suffix}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900">
                    {selectedChord.name}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Tonalidade de {selectedRoot.solfege} • {selectedChord.formula}
                </p>
              </div>

              {/* Botões de Áudio do Piano */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={playBlockChord}
                  className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Tocar em Bloco</span>
                </button>
                <button
                  type="button"
                  onClick={playArpeggiatedChord}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-amber-700" />
                  <span>Arpejar</span>
                </button>
              </div>
            </div>

            {/* Descrição e Caráter Emocional */}
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100">
              {selectedChord.description}
            </p>

            {/* TECLADO VISUAL ESQUEMÁTICO */}
            <div className="p-4 bg-stone-900 rounded-2xl text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Distribuição das Notas no Teclado
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {selectedChord.exampleC.join(' — ')}
                </span>
              </div>

              {/* Mini Teclado Demonstrativo */}
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700 flex items-center justify-center">
                <div className="flex items-end gap-1 overflow-x-auto py-1">
                  {['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'].map((keyId) => {
                    const isPartOfChord = selectedChord.exampleC.includes(keyId);
                    const noteDef = findNoteDefinition(keyId);
                    return (
                      <div
                        key={keyId}
                        className={`w-9 h-28 rounded-b-lg flex flex-col justify-end items-center pb-2 transition-all border ${
                          isPartOfChord
                            ? 'bg-amber-400 text-stone-950 border-amber-500 font-black shadow-lg scale-105 z-10'
                            : 'bg-stone-100 text-stone-600 border-stone-300'
                        }`}
                      >
                        <span className="text-[10px] font-black">{noteDef.solfege}</span>
                        <span className="text-[9px] font-mono opacity-80">{noteDef.letter}</span>
                        {isPartOfChord && (
                          <span className="w-2 h-2 rounded-full bg-stone-950 mt-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DIGITAÇÃO RECOMENDADA DE DEDOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Mão Direita (MD):
                </span>
                <span className="text-lg font-black font-mono text-amber-900 block">
                  {selectedChord.fingeringMD}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Dedos sugeridos para posição limpa e sem tensão muscular.
                </span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Mão Esquerda (ME):
                </span>
                <span className="text-lg font-black font-mono text-amber-900 block">
                  {selectedChord.fingeringME}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Dedos para sustentação na pauta de Clave de Fá.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
