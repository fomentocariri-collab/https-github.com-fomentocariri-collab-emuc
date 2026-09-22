import { NoteDefinition } from '../types';
import { TRUMPET_NOTES } from './trumpetData';
import { PC_KEYBOARD_MAPPINGS, PianoKeyMapping } from './pianoKeyboardMap';

export interface HarmonicSeriesLevel {
  harmonicNumber: number; // 2nd, 3rd, 4th, 5th, 6th, 8th
  noteId: string;
  solfege: string;
  letter: string;
  abcNumber: string;
  registerName: 'Grave (Pedal/Fundamental)' | 'Grave' | 'Médio' | 'Agudo' | 'Superagudo';
  lipTension: string;
  airSpeed: string;
  pitchTendency: 'afinada' | 'ligeiramente baixa' | 'ligeiramente alta';
}

export interface ValveCombinationGroup {
  id: string;
  valves: [boolean, boolean, boolean];
  displayFormula: string;
  tubeLengthDescription: string;
  fundamentalNote: string;
  harmonics: HarmonicSeriesLevel[];
  tuningTip?: string;
  requiresTriggerSlide?: boolean;
}

/**
 * As 7 posições acústicas fundamentais do trompete em Si♭
 * Ordenadas segundo a Ordem Natural Numérica das Digitações:
 * 0 (Solto), 1, 12 (1-2), 2, 13 (1-3), 23 (2-3) e 123 (1-2-3)
 * Demonstrando a lógica harmônica para o registro fundamental, 8ª acima e 16ª acima.
 */
export const TRUMPET_VALVE_COMBINATIONS: ValveCombinationGroup[] = [
  {
    id: 'valves-0',
    valves: [false, false, false],
    displayFormula: '0 (Solto / Aberto)',
    tubeLengthDescription: 'Tubo aberto total (1,48 m) - Ressonância pura da campana',
    fundamentalNote: 'C4 (Dó [3])',
    harmonics: [
      { harmonicNumber: 2, noteId: 'C4', solfege: 'Dó', letter: 'C', abcNumber: '3', registerName: 'Grave', lipTension: 'Relaxada / Aberta', airSpeed: 'Ar quente e amplo', pitchTendency: 'afinada' },
      { harmonicNumber: 3, noteId: 'G4', solfege: 'Sol', letter: 'G', abcNumber: '7', registerName: 'Médio', lipTension: 'Firme nos cantos', airSpeed: 'Fluxo médio veloz', pitchTendency: 'afinada' },
      { harmonicNumber: 4, noteId: 'C5', solfege: 'Dó', letter: 'C', abcNumber: '3', registerName: 'Médio', lipTension: 'Firme, centro livre', airSpeed: 'Velocidade constante', pitchTendency: 'afinada' },
      { harmonicNumber: 5, noteId: 'E5', solfege: 'Mi', letter: 'E', abcNumber: '5', registerName: 'Agudo', lipTension: 'Cantos firmes, abertura menor', airSpeed: 'Ar rápido focalizado (8ª acima)', pitchTendency: 'ligeiramente baixa' },
      { harmonicNumber: 6, noteId: 'G5', solfege: 'Sol', letter: 'G', abcNumber: '7', registerName: 'Agudo', lipTension: 'Pressão labial calibrada', airSpeed: 'Jato de ar fino e veloz (8ª acima)', pitchTendency: 'afinada' },
      { harmonicNumber: 8, noteId: 'C6', solfege: 'Dó', letter: 'C', abcNumber: '3', registerName: 'Superagudo', lipTension: 'Máxima sustentação muscular', airSpeed: 'Pressão diafragmática alta (16ª acima)', pitchTendency: 'afinada' },
    ],
    tuningTip: 'Posição 0 (Solto): Padrão de referência acústica. Produz Dó, Mi, Sol tanto no médio quanto na 8ª e 16ª acima.',
    requiresTriggerSlide: false,
  },
  {
    id: 'valves-1',
    valves: [true, false, false],
    displayFormula: '1 (1º Pistão)',
    tubeLengthDescription: 'Acrescenta 1 tom inteiro de tubo (+15 cm)',
    fundamentalNote: 'Bb3 (Lá# [1#] / Sib [2b])',
    harmonics: [
      { harmonicNumber: 2, noteId: 'Bb3', solfege: 'Lá♯ / Si♭', letter: 'A#/Bb', abcNumber: '1#/2b', registerName: 'Grave', lipTension: 'Relaxada', airSpeed: 'Ar quente', pitchTendency: 'afinada' },
      { harmonicNumber: 3, noteId: 'F4', solfege: 'Fá', letter: 'F', abcNumber: '6', registerName: 'Médio', lipTension: 'Firme', airSpeed: 'Médio', pitchTendency: 'afinada' },
      { harmonicNumber: 4, noteId: 'Bb4', solfege: 'Lá♯ / Si♭', letter: 'A#/Bb', abcNumber: '1#/2b', registerName: 'Médio', lipTension: 'Firme', airSpeed: 'Constante', pitchTendency: 'afinada' },
      { harmonicNumber: 5, noteId: 'D5', solfege: 'Ré', letter: 'D', abcNumber: '4', registerName: 'Agudo', lipTension: 'Firme e focalizada', airSpeed: 'Rápido (8ª acima: Ré5 = Pistão 1!)', pitchTendency: 'ligeiramente baixa' },
      { harmonicNumber: 6, noteId: 'F5', solfege: 'Fá', letter: 'F', abcNumber: '6', registerName: 'Agudo', lipTension: 'Alta precisão', airSpeed: 'Rápido (8ª acima: Fá5 = Pistão 1)', pitchTendency: 'afinada' },
      { harmonicNumber: 8, noteId: 'Bb5', solfege: 'Lá♯ / Si♭', letter: 'A#/Bb', abcNumber: '1#/2b', registerName: 'Superagudo', lipTension: 'Máxima', airSpeed: 'Alta pressão (8ª acima)', pitchTendency: 'afinada' },
      { harmonicNumber: 10, noteId: 'D6', solfege: 'Ré', letter: 'D', abcNumber: '4', registerName: 'Superagudo', lipTension: 'Extrema', airSpeed: 'Pressão alta (16ª acima: Ré6 = Pistão 1!)', pitchTendency: 'afinada' },
    ],
    tuningTip: 'Posição 1: Na 8ª acima (D5) e na 16ª acima (D6), o Ré passa a ser tocado com o Pistão 1 (ao invés de 1-3 do grave).',
    requiresTriggerSlide: false,
  },
  {
    id: 'valves-1-2',
    valves: [true, true, false],
    displayFormula: '12 (1-2 / Pistões 1 e 2)',
    tubeLengthDescription: 'Acrescenta 1 tom e meio de tubo (+23 cm)',
    fundamentalNote: 'A3 (Lá [1])',
    harmonics: [
      { harmonicNumber: 2, noteId: 'A3', solfege: 'Lá', letter: 'A', abcNumber: '1', registerName: 'Grave', lipTension: 'Relaxada', airSpeed: 'Ar amplo', pitchTendency: 'afinada' },
      { harmonicNumber: 3, noteId: 'E4', solfege: 'Mi', letter: 'E', abcNumber: '5', registerName: 'Médio', lipTension: 'Firme', airSpeed: 'Médio', pitchTendency: 'afinada' },
      { harmonicNumber: 4, noteId: 'A4', solfege: 'Lá', letter: 'A', abcNumber: '1', registerName: 'Médio', lipTension: 'Firme', airSpeed: 'Constante', pitchTendency: 'afinada' },
      { harmonicNumber: 5, noteId: 'C#5', solfege: 'Dó♯ / Ré♭', letter: 'C#/Db', abcNumber: '3#/4b', registerName: 'Agudo', lipTension: 'Firme', airSpeed: 'Rápido (8ª acima: Dó♯5 = Pistões 12!)', pitchTendency: 'ligeiramente baixa' },
      { harmonicNumber: 6, noteId: 'E5', solfege: 'Mi', letter: 'E', abcNumber: '5', registerName: 'Agudo', lipTension: 'Firme', airSpeed: 'Rápido', pitchTendency: 'afinada' },
      { harmonicNumber: 8, noteId: 'A5', solfege: 'Lá', letter: 'A', abcNumber: '1', registerName: 'Superagudo', lipTension: 'Máxima', airSpeed: 'Alta pressão (8ª acima: Lá5 = Pistões 12)', pitchTendency: 'afinada' },
      { harmonicNumber: 10, noteId: 'C#6', solfege: 'Dó♯ / Ré♭', letter: 'C#/Db', abcNumber: '3#/4b', registerName: 'Superagudo', lipTension: 'Extrema', airSpeed: 'Ar veloz (16ª acima: Dó♯6 = Pistões 12!)', pitchTendency: 'afinada' },
    ],
    tuningTip: 'Posição 12 (1-2): Na 8ª acima (C#5) e na 16ª acima (C#6), o Dó# passa a ser tocado com 1-2 (em vez de 1-2-3 do grave).',
    requiresTriggerSlide: false,
  },
  {
    id: 'valves-2',
    valves: [false, true, false],
    displayFormula: '2 (2º Pistão)',
    tubeLengthDescription: 'Acrescenta 1 semitom de tubo (+7,5 cm)',
    fundamentalNote: 'B3 (Si [2])',
    harmonics: [
      { harmonicNumber: 2, noteId: 'B3', solfege: 'Si', letter: 'B', abcNumber: '2', registerName: 'Grave', lipTension: 'Relaxada', airSpeed: 'Ar quente', pitchTendency: 'afinada' },
      { harmonicNumber: 3, noteId: 'F#4', solfege: 'Fá♯ / Sol♭', letter: 'F#/Gb', abcNumber: '6#/7b', registerName: 'Médio', lipTension: 'Firme', airSpeed: 'Médio', pitchTendency: 'afinada' },
      { harmonicNumber: 4, noteId: 'B4', solfege: 'Si', letter: 'B', abcNumber: '2', registerName: 'Médio', lipTension: 'Firme', airSpeed: 'Constante', pitchTendency: 'afinada' },
      { harmonicNumber: 5, noteId: 'D#5', solfege: 'Ré♯ / Mi♭', letter: 'D#/Eb', abcNumber: '4#/5b', registerName: 'Agudo', lipTension: 'Firme e focalizada', airSpeed: 'Rápido (8ª acima: Ré#5 = Pistão 2!)', pitchTendency: 'ligeiramente baixa' },
      { harmonicNumber: 6, noteId: 'F#5', solfege: 'Fá♯ / Sol♭', letter: 'F#/Gb', abcNumber: '6#/7b', registerName: 'Agudo', lipTension: 'Alta precisão', airSpeed: 'Rápido (8ª acima: Fá#5 = Pistão 2)', pitchTendency: 'afinada' },
      { harmonicNumber: 8, noteId: 'B5', solfege: 'Si', letter: 'B', abcNumber: '2', registerName: 'Superagudo', lipTension: 'Máxima', airSpeed: 'Alta pressão (8ª acima: Si5 = Pistão 2)', pitchTendency: 'afinada' },
      { harmonicNumber: 10, noteId: 'D#6', solfege: 'Ré♯ / Mi♭', letter: 'D#/Eb', abcNumber: '4#/5b', registerName: 'Superagudo', lipTension: 'Extrema', airSpeed: 'Pressão alta (16ª acima: Ré#6 = Pistão 2!)', pitchTendency: 'afinada' },
    ],
    tuningTip: 'Posição 2: Na 8ª acima (D#5) e na 16ª acima (D#6), o Ré# passa a ser tocado com o Pistão 2 (ao invés de 2-3 do grave).',
    requiresTriggerSlide: false,
  },
  {
    id: 'valves-1-3',
    valves: [true, false, true],
    displayFormula: '13 (1-3 / Pistões 1 e 3)',
    tubeLengthDescription: 'Acrescenta 2 tons e meio de tubo (+40 cm)',
    fundamentalNote: 'G3 (Sol [7])',
    harmonics: [
      { harmonicNumber: 2, noteId: 'G3', solfege: 'Sol', letter: 'G', abcNumber: '7', registerName: 'Grave', lipTension: 'Relaxada', airSpeed: 'Ar quente', pitchTendency: 'afinada' },
      { harmonicNumber: 3, noteId: 'D4', solfege: 'Ré', letter: 'D', abcNumber: '4', registerName: 'Médio', lipTension: 'Firme', airSpeed: 'Médio (Grave: Ré4 = 1-3)', pitchTendency: 'ligeiramente alta' },
      { harmonicNumber: 4, noteId: 'G4', solfege: 'Sol', letter: 'G', abcNumber: '7', registerName: 'Médio', lipTension: 'Firme', airSpeed: 'Constante', pitchTendency: 'afinada' },
      { harmonicNumber: 5, noteId: 'B4', solfege: 'Si', letter: 'B', abcNumber: '2', registerName: 'Agudo', lipTension: 'Firme', airSpeed: 'Rápido', pitchTendency: 'ligeiramente baixa' },
      { harmonicNumber: 6, noteId: 'D5', solfege: 'Ré', letter: 'D', abcNumber: '4', registerName: 'Agudo', lipTension: 'Firme', airSpeed: 'Rápido (alternativa)', pitchTendency: 'afinada' },
    ],
    tuningTip: 'Posição 13 (1-3): Usada no Ré4 grave (requer gatilho de afinação). Na 8ª acima (Ré5) e 16ª acima (Ré6), simplifica para o Pistão 1!',
    requiresTriggerSlide: true,
  },
  {
    id: 'valves-2-3',
    valves: [false, true, true],
    displayFormula: '23 (2-3 / Pistões 2 e 3)',
    tubeLengthDescription: 'Acrescenta 2 tons inteiros de tubo (+31 cm)',
    fundamentalNote: 'G#3 (Sol# [7#] / Láb [1b])',
    harmonics: [
      { harmonicNumber: 2, noteId: 'G#3', solfege: 'Sol♯ / Lá♭', letter: 'G#/Ab', abcNumber: '7#/1b', registerName: 'Grave', lipTension: 'Relaxada', airSpeed: 'Ar quente', pitchTendency: 'afinada' },
      { harmonicNumber: 3, noteId: 'D#4', solfege: 'Ré♯ / Mi♭', letter: 'D#/Eb', abcNumber: '4#/5b', registerName: 'Médio', lipTension: 'Firme', airSpeed: 'Médio (Grave: Ré#4 = 2-3)', pitchTendency: 'afinada' },
      { harmonicNumber: 4, noteId: 'G#4', solfege: 'Sol♯ / Lá♭', letter: 'G#/Ab', abcNumber: '7#/1b', registerName: 'Médio', lipTension: 'Firme', airSpeed: 'Constante', pitchTendency: 'afinada' },
      { harmonicNumber: 5, noteId: 'C5', solfege: 'Dó', letter: 'C', abcNumber: '3', registerName: 'Agudo', lipTension: 'Firme', airSpeed: 'Rápido', pitchTendency: 'ligeiramente baixa' },
      { harmonicNumber: 6, noteId: 'D#5', solfege: 'Ré♯ / Mi♭', letter: 'D#/Eb', abcNumber: '4#/5b', registerName: 'Agudo', lipTension: 'Firme', airSpeed: 'Rápido (alternativa)', pitchTendency: 'afinada' },
      { harmonicNumber: 8, noteId: 'G#5', solfege: 'Sol♯ / Lá♭', letter: 'G#/Ab', abcNumber: '7#/1b', registerName: 'Superagudo', lipTension: 'Máxima', airSpeed: 'Alta pressão (8ª acima: Sol#5 = 23)', pitchTendency: 'afinada' },
    ],
    tuningTip: 'Posição 23 (2-3): Posição do Sol# e Ré# no grave. Na 8ª acima, Ré#5 simplifica para Pistão 2, e Sol#5 permanece em 2-3.',
    requiresTriggerSlide: false,
  },
  {
    id: 'valves-1-2-3',
    valves: [true, true, true],
    displayFormula: '123 (1-2-3 / Todos)',
    tubeLengthDescription: 'Extensão máxima do tubo (+49 cm) - Circuito mais longo',
    fundamentalNote: 'F#3 (Fá# [6#])',
    harmonics: [
      { harmonicNumber: 2, noteId: 'F#3', solfege: 'Fá♯ / Sol♭', letter: 'F#/Gb', abcNumber: '6#/7b', registerName: 'Grave', lipTension: 'Muito relaxada', airSpeed: 'Ar quente e abundante', pitchTendency: 'afinada' },
      { harmonicNumber: 3, noteId: 'C#4', solfege: 'Dó♯ / Ré♭', letter: 'C#/Db', abcNumber: '3#/4b', registerName: 'Médio', lipTension: 'Relaxada/firme', airSpeed: 'Médio (Grave: Dó#4 = 1-2-3)', pitchTendency: 'ligeiramente alta' },
      { harmonicNumber: 4, noteId: 'F#4', solfege: 'Fá♯ / Sol♭', letter: 'F#/Gb', abcNumber: '6#/7b', registerName: 'Médio', lipTension: 'Firme', airSpeed: 'Constante', pitchTendency: 'afinada' },
      { harmonicNumber: 6, noteId: 'C#5', solfege: 'Dó♯ / Ré♭', letter: 'C#/Db', abcNumber: '3#/4b', registerName: 'Agudo', lipTension: 'Firme', airSpeed: 'Rápido (alternativa)', pitchTendency: 'afinada' },
    ],
    tuningTip: 'Posição 123 (1-2-3): Usada no Dó#4 grave (requer gatilho de afinação). Na 8ª acima (C#5) e 16ª acima (C#6), simplifica para 1-2 (12)!',
    requiresTriggerSlide: true,
  },
];

export function getValveGroupById(id: string): ValveCombinationGroup {
  return TRUMPET_VALVE_COMBINATIONS.find((v) => v.id === id) || TRUMPET_VALVE_COMBINATIONS[0];
}

export function getValveGroupByArray(valves: [boolean, boolean, boolean]): ValveCombinationGroup {
  return (
    TRUMPET_VALVE_COMBINATIONS.find(
      (v) => v.valves[0] === valves[0] && v.valves[1] === valves[1] && v.valves[2] === valves[2]
    ) || TRUMPET_VALVE_COMBINATIONS[0]
  );
}

export interface OctaveFingeringComparison {
  noteLabel: string;
  solfege: string;
  abcNumber: string;
  letter: string;
  // Registro Fundamental / Médio
  graveNoteId: string;
  graveFingering: string; // Ex: '0', '123', '13', '23', '12', '1', '2'
  graveValves: [boolean, boolean, boolean];
  // 8ª Acima (8va)
  octave8NoteId: string;
  octave8Fingering: string; // Ex: '0', '12', '1', '2', '0', '1', '2'
  octave8Valves: [boolean, boolean, boolean];
  // 16ª Acima (16va - Superagudo)
  octave16NoteId: string;
  octave16Fingering: string; // Ex: '0', '12', '1', '2', '0', '1', '2'
  octave16Valves: [boolean, boolean, boolean];
  // Análise Didática da Ordem Numérica
  didacticRule: string;
}

/**
 * Tabela Comparativa Didática da Ordem Natural Numérica dos Pistões
 * Mostra a transição de combinações longas (13, 123) no grave para
 * as combinações naturais compactas (0, 1, 12, 2, 23) na 8ª e 16ª acima.
 */
export const OCTAVE_FINGERING_COMPARISONS: OctaveFingeringComparison[] = [
  {
    noteLabel: 'Dó',
    solfege: 'Dó',
    abcNumber: '3',
    letter: 'C',
    graveNoteId: 'C4',
    graveFingering: '0 (Solto)',
    graveValves: [false, false, false],
    octave8NoteId: 'C5',
    octave8Fingering: '0 (Solto)',
    octave8Valves: [false, false, false],
    octave16NoteId: 'C6',
    octave16Fingering: '0 (Solto)',
    octave16Valves: [false, false, false],
    didacticRule: 'Dó é sempre 0 (Solto) em todas as oitavas (Grave, 8ª e 16ª acima).',
  },
  {
    noteLabel: 'Dó♯ / Ré♭',
    solfege: 'Dó♯',
    abcNumber: '3#',
    letter: 'C#/Db',
    graveNoteId: 'C#4',
    graveFingering: '123 (1-2-3)',
    graveValves: [true, true, true],
    octave8NoteId: 'C#5',
    octave8Fingering: '12 (1-2)',
    octave8Valves: [true, true, false],
    octave16NoteId: 'C#6',
    octave16Fingering: '12 (1-2)',
    octave16Valves: [true, true, false],
    didacticRule: 'No grave é 123 (requer pompa). Na 8ª e 16ª acima simplifica para a ordem natural 12!',
  },
  {
    noteLabel: 'Ré',
    solfege: 'Ré',
    abcNumber: '4',
    letter: 'D',
    graveNoteId: 'D4',
    graveFingering: '13 (1-3)',
    graveValves: [true, false, true],
    octave8NoteId: 'D5',
    octave8Fingering: '1 (Pistão 1)',
    octave8Valves: [true, false, false],
    octave16NoteId: 'D6',
    octave16Fingering: '1 (Pistão 1)',
    octave16Valves: [true, false, false],
    didacticRule: 'No grave é 13 (requer pompa). Na 8ª e 16ª acima simplifica para a ordem natural 1!',
  },
  {
    noteLabel: 'Ré♯ / Mi♭',
    solfege: 'Ré♯',
    abcNumber: '4#',
    letter: 'D#/Eb',
    graveNoteId: 'D#4',
    graveFingering: '23 (2-3)',
    graveValves: [false, true, true],
    octave8NoteId: 'D#5',
    octave8Fingering: '2 (Pistão 2)',
    octave8Valves: [false, true, false],
    octave16NoteId: 'D#6',
    octave16Fingering: '2 (Pistão 2)',
    octave16Valves: [false, true, false],
    didacticRule: 'No grave é 23. Na 8ª e 16ª acima simplifica diretamente para a ordem natural 2!',
  },
  {
    noteLabel: 'Mi',
    solfege: 'Mi',
    abcNumber: '5',
    letter: 'E',
    graveNoteId: 'E4',
    graveFingering: '12 (1-2)',
    graveValves: [true, true, false],
    octave8NoteId: 'E5',
    octave8Fingering: '0 (Solto / Aberto)',
    octave8Valves: [false, false, false],
    octave16NoteId: 'E6',
    octave16Fingering: '0 (Solto / Aberto)',
    octave16Valves: [false, false, false],
    didacticRule: 'No grave é 12. Na 8ª e 16ª acima torna-se 0 (Solto), harmonizando com o Dó fundamental!',
  },
  {
    noteLabel: 'Fá',
    solfege: 'Fá',
    abcNumber: '6',
    letter: 'F',
    graveNoteId: 'F4',
    graveFingering: '1 (Pistão 1)',
    graveValves: [true, false, false],
    octave8NoteId: 'F5',
    octave8Fingering: '1 (Pistão 1)',
    octave8Valves: [true, false, false],
    octave16NoteId: 'F6',
    octave16Fingering: '1 (Pistão 1)',
    octave16Valves: [true, false, false],
    didacticRule: 'Fá permanece rigorosamente no Pistão 1 no registro médio, na 8ª e na 16ª acima.',
  },
  {
    noteLabel: 'Fá♯ / Sol♭',
    solfege: 'Fá♯',
    abcNumber: '6#',
    letter: 'F#/Gb',
    graveNoteId: 'F#4',
    graveFingering: '2 (Pistão 2)',
    graveValves: [false, true, false],
    octave8NoteId: 'F#5',
    octave8Fingering: '2 (Pistão 2)',
    octave8Valves: [false, true, false],
    octave16NoteId: 'F#6',
    octave16Fingering: '2 (Pistão 2)',
    octave16Valves: [false, true, false],
    didacticRule: 'Fá# permanece no Pistão 2 no registro médio, na 8ª e na 16ª acima.',
  },
  {
    noteLabel: 'Sol',
    solfege: 'Sol',
    abcNumber: '7',
    letter: 'G',
    graveNoteId: 'G4',
    graveFingering: '0 (Solto)',
    graveValves: [false, false, false],
    octave8NoteId: 'G5',
    octave8Fingering: '0 (Solto)',
    octave8Valves: [false, false, false],
    octave16NoteId: 'G6',
    octave16Fingering: '0 (Solto)',
    octave16Valves: [false, false, false],
    didacticRule: 'Sol é 0 (Solto) tanto no médio (G4) quanto na 8ª (G5) e na 16ª acima (G6).',
  },
  {
    noteLabel: 'Sol♯ / Lá♭',
    solfege: 'Sol♯',
    abcNumber: '7#',
    letter: 'G#/Ab',
    graveNoteId: 'G#4',
    graveFingering: '23 (2-3)',
    graveValves: [false, true, true],
    octave8NoteId: 'G#5',
    octave8Fingering: '23 (2-3)',
    octave8Valves: [false, true, true],
    octave16NoteId: 'G#6',
    octave16Fingering: '23 (ou 1)',
    octave16Valves: [false, true, true],
    didacticRule: 'Sol# mantém a digitação 23 (ou Pistão 1 nos superagudos) com afinação estável.',
  },
  {
    noteLabel: 'Lá',
    solfege: 'Lá',
    abcNumber: '1',
    letter: 'A',
    graveNoteId: 'A4',
    graveFingering: '12 (1-2)',
    graveValves: [true, true, false],
    octave8NoteId: 'A5',
    octave8Fingering: '12 (1-2)',
    octave8Valves: [true, true, false],
    octave16NoteId: 'A6',
    octave16Fingering: '12 (ou 1)',
    octave16Valves: [true, true, false],
    didacticRule: 'Lá (Nota 1 do sistema) é tocado com 12 no médio e na 8ª acima (ou 1 no superagudo).',
  },
  {
    noteLabel: 'Lá♯ / Si♭',
    solfege: 'Si♭',
    abcNumber: '1# / 2b',
    letter: 'A#/Bb',
    graveNoteId: 'Bb4',
    graveFingering: '1 (Pistão 1)',
    graveValves: [true, false, false],
    octave8NoteId: 'Bb5',
    octave8Fingering: '1 (Pistão 1)',
    octave8Valves: [true, false, false],
    octave16NoteId: 'Bb6',
    octave16Fingering: '1 (ou 0)',
    octave16Valves: [true, false, false],
    didacticRule: 'Sib é tocado com o Pistão 1 no médio e na 8ª acima.',
  },
  {
    noteLabel: 'Si',
    solfege: 'Si',
    abcNumber: '2',
    letter: 'B',
    graveNoteId: 'B4',
    graveFingering: '2 (Pistão 2)',
    graveValves: [false, true, false],
    octave8NoteId: 'B5',
    octave8Fingering: '2 (Pistão 2)',
    octave8Valves: [false, true, false],
    octave16NoteId: 'B6',
    octave16Fingering: '2 (Pistão 2)',
    octave16Valves: [false, true, false],
    didacticRule: 'Si (Nota 2 do sistema) é tocado com o Pistão 2 em todos os registros.',
  },
];
