import React from 'react';
import { Volume2, Sparkles, Hand, Layers, Music, ArrowRight } from 'lucide-react';
import { findNoteDefinition } from '../data/pianoKeyboardMap';
import { trumpetAudio } from '../utils/audioEngine';

interface VisualProps {
  onPlayNote: (noteId: string) => void;
}

// 1. TOPOGRAFIA DO TECLADO: 2 E 3 TECLAS PRETAS E DÓ CENTRAL (C4)
export const PianoKeysTopographyVisual: React.FC<VisualProps> = ({ onPlayNote }) => {
  const keys = [
    { id: 'C4', name: 'Dó', letter: 'C', num: '3', isBlack: false, tag: 'Dó Central (C4)' },
    { id: 'Db4', name: 'Dó#', letter: 'C#', num: '3#', isBlack: true },
    { id: 'D4', name: 'Ré', letter: 'D', num: '4', isBlack: false, tag: 'Meio das 2 Pretas' },
    { id: 'Eb4', name: 'Ré#', letter: 'D#', num: '4#', isBlack: true },
    { id: 'E4', name: 'Mi', letter: 'E', num: '5', isBlack: false, tag: 'Direita das 2 Pretas' },
    { id: 'F4', name: 'Fá', letter: 'F', num: '6', isBlack: false, tag: 'Esquerda das 3 Pretas' },
    { id: 'Gb4', name: 'Fá#', letter: 'F#', num: '6#', isBlack: true },
    { id: 'G4', name: 'Sol', letter: 'G', num: '7', isBlack: false, tag: 'Entre as 3 Pretas' },
    { id: 'Ab4', name: 'Sol#', letter: 'G#', num: '7#', isBlack: true },
    { id: 'A4', name: 'Lá', letter: 'A', num: '1', isBlack: false, tag: 'Entre as 3 Pretas' },
    { id: 'Bb4', name: 'Lá#', letter: 'A#', num: '1#', isBlack: true },
    { id: 'B4', name: 'Si', letter: 'B', num: '2', isBlack: false, tag: 'Direita das 3 Pretas' },
    { id: 'C5', name: 'Dó', letter: 'C', num: '3', isBlack: false, tag: 'Dó Agudo' },
  ];

  return (
    <div className="p-4 bg-stone-900 text-white rounded-2xl border border-stone-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-amber-400" />
          Topografia: Padrão de 2 e 3 Teclas Pretas
        </span>
        <span className="text-[10px] text-stone-400 font-mono">Dó Central (C4 / 3)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300 font-black block">GRUPO 2 PRETAS</span>
          <span className="text-xs font-bold text-white block mt-0.5">Dó - Ré - Mi</span>
          <span className="text-[10px] text-stone-400 font-mono">C(3) - D(4) - E(5)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-center">
          <span className="text-[10px] text-sky-300 font-black block">SEMITOM NATURAL</span>
          <span className="text-xs font-bold text-white block mt-0.5">Mi ➔ Fá (Sem preta)</span>
          <span className="text-[10px] text-stone-400 font-mono">E(5) ➔ F(6)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center">
          <span className="text-[10px] text-emerald-300 font-black block">GRUPO 3 PRETAS</span>
          <span className="text-xs font-bold text-white block mt-0.5">Fá - Sol - Lá - Si</span>
          <span className="text-[10px] text-stone-400 font-mono">F(6) - G(7) - A(1) - B(2)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300 font-black block">SEMITOM NATURAL</span>
          <span className="text-xs font-bold text-white block mt-0.5">Si ➔ Dó (Sem preta)</span>
          <span className="text-[10px] text-stone-400 font-mono">B(2) ➔ C(3)</span>
        </div>
      </div>

      {/* Botões rápidos das notas fundamentais */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-800">
        {keys.filter(k => !k.isBlack).map(k => (
          <button
            key={k.id}
            type="button"
            onClick={() => onPlayNote(k.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              k.id === 'C4'
                ? 'bg-amber-500 text-stone-950 font-black ring-2 ring-amber-300'
                : 'bg-stone-800 hover:bg-stone-700 text-white'
            }`}
          >
            <Volume2 className="w-3 h-3 text-amber-400" />
            <span>{k.name} ({k.letter})</span>
            <span className="text-[10px] opacity-75 font-mono">[{k.num}]</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// 2. NUMERAÇÃO UNIVERSAL DOS DEDOS (1 A 5)
export const PianoFingerNumberingVisual: React.FC = () => {
  return (
    <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
      <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-amber-700" />
        Numeração Universal dos Dedos (Espelhada em Ambos os Lados)
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Mão Esquerda */}
        <div className="p-3.5 bg-white rounded-xl border border-amber-200">
          <span className="text-xs font-black text-amber-900 block mb-2">
            MÃO ESQUERDA (ME) — Graves & Clave de Fá
          </span>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-700">
            <span className="text-center"><strong className="block text-amber-600 text-base">5</strong>Mínimo</span>
            <span className="text-center"><strong className="block text-amber-600 text-base">4</strong>Anelar</span>
            <span className="text-center"><strong className="block text-amber-600 text-base">3</strong>Médio</span>
            <span className="text-center"><strong className="block text-amber-600 text-base">2</strong>Indicador</span>
            <span className="text-center"><strong className="block text-amber-900 text-base font-black">1</strong>Polegar</span>
          </div>
          <span className="text-[11px] text-stone-500 block mt-2 text-center">
            (Polegar 1 aponta para a direita / centro do teclado)
          </span>
        </div>

        {/* Mão Direita */}
        <div className="p-3.5 bg-white rounded-xl border border-amber-200">
          <span className="text-xs font-black text-amber-900 block mb-2">
            MÃO DIREITA (MD) — Agudos & Clave de Sol
          </span>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-700">
            <span className="text-center"><strong className="block text-amber-900 text-base font-black">1</strong>Polegar</span>
            <span className="text-center"><strong className="block text-amber-600 text-base">2</strong>Indicador</span>
            <span className="text-center"><strong className="block text-amber-600 text-base">3</strong>Médio</span>
            <span className="text-center"><strong className="block text-amber-600 text-base">4</strong>Anelar</span>
            <span className="text-center"><strong className="block text-amber-600 text-base">5</strong>Mínimo</span>
          </div>
          <span className="text-[11px] text-stone-500 block mt-2 text-center">
            (Polegar 1 aponta para a esquerda / centro do teclado)
          </span>
        </div>
      </div>
    </div>
  );
};

// 3. PAUTA DUPLA (GRAND STAFF) E CLAVES DE SOL E FÁ
export const GrandStaffVisual: React.FC<VisualProps> = ({ onPlayNote }) => {
  return (
    <div className="p-4 bg-stone-900 text-white rounded-2xl border border-stone-800 space-y-3">
      <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
        O Sistema de Pauta Dupla (Grand Staff) e o Dó Central
      </span>

      <div className="p-4 bg-stone-800 rounded-xl border border-stone-700 space-y-3">
        {/* Pauta Superior */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-900 border border-stone-800">
          <div>
            <span className="text-xs font-black text-amber-300 block">Pauta Superior: CLAVE DE SOL</span>
            <span className="text-[11px] text-stone-400">Mão Direita (MD) • Melodia e Harmonias Agudas</span>
          </div>
          <button
            type="button"
            onClick={() => onPlayNote('G4')}
            className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/30"
          >
            Ouvir Sol (G4)
          </button>
        </div>

        {/* ELO DOURADO - DÓ CENTRAL */}
        <div className="p-3 rounded-lg bg-amber-500/30 border border-amber-500/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-amber-200 block">
              ⭐ DÓ CENTRAL (C4 / 3) — O Elo Central Entre as Claves
            </span>
            <span className="text-[11px] text-amber-100">
              1ª linha suplementar inferior da Clave de Sol = 1ª linha suplementar superior da Clave de Fá!
            </span>
          </div>
          <button
            type="button"
            onClick={() => onPlayNote('C4')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-black text-xs hover:bg-amber-400 shadow-xs"
          >
            Tocar C4 (261.6 Hz)
          </button>
        </div>

        {/* Pauta Inferior */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-900 border border-stone-800">
          <div>
            <span className="text-xs font-black text-sky-300 block">Pauta Inferior: CLAVE DE FÁ (4ª Linha)</span>
            <span className="text-[11px] text-stone-400">Mão Esquerda (ME) • Linhas de Baixo e Fundamentais</span>
          </div>
          <button
            type="button"
            onClick={() => onPlayNote('F3')}
            className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 text-xs font-bold hover:bg-sky-500/30"
          >
            Ouvir Fá (F3)
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. PASSAGEM DO POLEGAR (THUMB-UNDER) E ESCALA
export const PianoScalesFingeringVisual: React.FC<VisualProps> = ({ onPlayNote }) => {
  return (
    <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs space-y-3">
      <span className="font-black text-sky-950 block text-xs uppercase tracking-wider">
        Mapeamento da Passagem do Polegar (Thumb-Under) em Dó Maior
      </span>

      <div className="p-3.5 bg-white rounded-xl border border-sky-100 space-y-2">
        <span className="text-xs font-black text-stone-900 block">
          Mão Direita (Subindo): 1 - 2 - 3 ➔ [passa polegar] ➔ 1 - 2 - 3 - 4 - 5
        </span>
        <div className="grid grid-cols-8 gap-1 text-center font-mono">
          {['C4 (1)', 'D4 (2)', 'E4 (3)', 'F4 (1★)', 'G4 (2)', 'A4 (3)', 'B4 (4)', 'C5 (5)'].map((step, i) => (
            <div
              key={i}
              className={`p-1.5 rounded-lg ${
                i === 3
                  ? 'bg-amber-400 text-stone-950 font-black ring-2 ring-amber-300'
                  : 'bg-stone-100 text-stone-700 font-bold'
              }`}
            >
              <span className="text-[10px] block">{step.split(' ')[0]}</span>
              <span className="text-[9px] font-black">{step.split(' ')[1]}</span>
            </div>
          ))}
        </div>
        <span className="text-[11px] text-sky-900 font-medium block mt-1">
          ★ O dedo 1 (polegar) desliza por baixo do dedo 3 exatamente na nota Fá (F4 / 6), mantendo o legato perfeito.
        </span>
      </div>
    </div>
  );
};

// 5. INVERSÕES DE ACORDES NO PIANO
export const PianoChordInversionsVisual: React.FC<VisualProps> = ({ onPlayNote }) => {
  return (
    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
      <span className="text-xs font-black text-amber-950 uppercase tracking-wider block">
        As Três Posições da Tríade de Dó Maior no Teclado
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-3 bg-white rounded-xl border border-amber-200 text-center">
          <span className="text-xs font-black text-amber-900 block">Posição Fundamental (5/3)</span>
          <span className="text-sm font-black font-mono text-stone-900 block my-1">C = Dó - Mi - Sol</span>
          <span className="text-[10px] text-stone-500 block">Dedos MD: 1 - 3 - 5</span>
          <button
            type="button"
            onClick={() => {
              onPlayNote('C4');
              setTimeout(() => onPlayNote('E4'), 80);
              setTimeout(() => onPlayNote('G4'), 160);
            }}
            className="mt-2 w-full py-1 rounded bg-amber-500 text-stone-950 text-[10px] font-black hover:bg-amber-600 cursor-pointer"
          >
            Tocar Fundamental
          </button>
        </div>

        <div className="p-3 bg-white rounded-xl border border-amber-200 text-center">
          <span className="text-xs font-black text-amber-900 block">1ª Inversão (6/3)</span>
          <span className="text-sm font-black font-mono text-stone-900 block my-1">C/E = Mi - Sol - Dó</span>
          <span className="text-[10px] text-stone-500 block">Dedos MD: 1 - 2 - 5</span>
          <button
            type="button"
            onClick={() => {
              onPlayNote('E4');
              setTimeout(() => onPlayNote('G4'), 80);
              setTimeout(() => onPlayNote('C5'), 160);
            }}
            className="mt-2 w-full py-1 rounded bg-amber-500 text-stone-950 text-[10px] font-black hover:bg-amber-600 cursor-pointer"
          >
            Tocar 1ª Inversão
          </button>
        </div>

        <div className="p-3 bg-white rounded-xl border border-amber-200 text-center">
          <span className="text-xs font-black text-amber-900 block">2ª Inversão (6/4)</span>
          <span className="text-sm font-black font-mono text-stone-900 block my-1">C/G = Sol - Dó - Mi</span>
          <span className="text-[10px] text-stone-500 block">Dedos MD: 1 - 3 - 5 ou 1-2-4</span>
          <button
            type="button"
            onClick={() => {
              onPlayNote('G4');
              setTimeout(() => onPlayNote('C5'), 80);
              setTimeout(() => onPlayNote('E5'), 160);
            }}
            className="mt-2 w-full py-1 rounded bg-amber-500 text-stone-950 text-[10px] font-black hover:bg-amber-600 cursor-pointer"
          >
            Tocar 2ª Inversão
          </button>
        </div>
      </div>
    </div>
  );
};

// 6. OS 3 PEDAIS E O PEDAL SINCOPADO
export const PianoPedalsVisual: React.FC = () => {
  return (
    <div className="p-4 bg-stone-900 text-white rounded-2xl border border-stone-800 space-y-3">
      <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
        Os 3 Pedais do Piano e a Técnica de Troca Sincopada
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
          <span className="text-xs font-black text-sky-400 block">1. UNA CORDA (Esquerdo)</span>
          <span className="text-[11px] text-stone-300 block mt-1 leading-snug">
            Desloca o teclado para suavizar a dinâmica e mudar o timbre para aveludado e misterioso.
          </span>
        </div>
        <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
          <span className="text-xs font-black text-amber-400 block">2. SOSTENUTO (Central)</span>
          <span className="text-[11px] text-stone-300 block mt-1 leading-snug">
            Sustenta seletivamente apenas as notas que estavam abaixadas no instante exato do acionamento.
          </span>
        </div>
        <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
          <span className="text-xs font-black text-emerald-400 block">3. SUSTAIN / FORTE (Direito)</span>
          <span className="text-[11px] text-stone-300 block mt-1 leading-snug">
            Levanta todos os abafadores, gerando sustentação total e ressonância simpática.
          </span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
        <strong>Regra do Pedal Sincopado:</strong> Os dedos tocam o novo acorde ➔ no milissegundo seguinte o pé sobe e desce rápido. O calcanhar fica sempre fixo no assoalho!
      </div>
    </div>
  );
};

// 7. VOICINGS E TÉTRADES
export const PianoVoicingsVisual: React.FC = () => {
  return (
    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
      <span className="text-xs font-black text-emerald-950 uppercase tracking-wider block">
        Tétrades Modernas e Notas-Guia (Guide Tones)
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="p-3 bg-white rounded-xl border border-emerald-100">
          <span className="text-xs font-black text-stone-900 block">Notas-Guia (Guide Tones)</span>
          <span className="text-[11px] text-stone-600 block mt-1">
            As duas notas indispensáveis de qualquer acorde com sétima são sempre a <strong>3ª</strong> (define o modo maior ou menor) e a <strong>7ª</strong> (define a função tonal).
          </span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-emerald-100">
          <span className="text-xs font-black text-stone-900 block">Abertura Drop-2</span>
          <span className="text-[11px] text-stone-600 block mt-1">
            Rebaixa a 2ª voz do topo em 1 oitava para a mão esquerda, eliminando a densidade embolada nos médios-graves.
          </span>
        </div>
      </div>
    </div>
  );
};

// 8. PADRÕES DE ACOMPANHAMENTO (BAIXO ALBERTI E 10ªS)
export const PianoAccompanimentVisual: React.FC<VisualProps> = ({ onPlayNote }) => {
  return (
    <div className="p-4 bg-stone-900 text-white rounded-2xl border border-stone-800 space-y-3">
      <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
        Padrões Clássicos de Acompanhamento para Mão Esquerda
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 bg-stone-800 rounded-xl border border-stone-700">
          <span className="text-xs font-black text-amber-300 block">1. Baixo Alberti (Clássico)</span>
          <span className="text-sm font-mono text-white block my-1">Baixo ➔ Agudo ➔ Médio ➔ Agudo</span>
          <span className="text-[11px] text-stone-400 block">
            Em Dó Maior: C3 - G3 - E3 - G3 tocados em colcheias fluidas com rotação do antebraço.
          </span>
        </div>
        <div className="p-3.5 bg-stone-800 rounded-xl border border-stone-700">
          <span className="text-xs font-black text-sky-300 block">2. Arpejos Abertos em 10ª (Moderno / MPB)</span>
          <span className="text-sm font-mono text-white block my-1">Fundamental ➔ 5ª ➔ 10ª</span>
          <span className="text-[11px] text-stone-400 block">
            Em Dó: C2 (baixo) ➔ G2 (5ª justa) ➔ E3 (10ª aberta). Cria amplitude orquestral magnífica.
          </span>
        </div>
      </div>
    </div>
  );
};
