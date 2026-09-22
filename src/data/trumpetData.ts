import { NoteDefinition, SongExercise } from '../types';

/**
 * Escala Cromática de Referência e mapeamento ABC (A=Lá=1)
 *
 * Mapeamento Solicitado:
 * A  = Lá  = 1
 * A# = Lá# = 1# (ou Sib = 2b)
 * B  = Si  = 2
 * C  = Dó  = 3
 * C# = Dó# = 3# (ou Réb = 4b)
 * D  = Ré  = 4
 * D# = Ré# = 4# (ou Mib = 5b)
 * E  = Mi  = 5
 * F  = Fá  = 6
 * F# = Fá# = 6# (ou Solb = 7b)
 * G  = Sol = 7
 * G# = Sol# = 7# (ou Láb = 1b)
 */

export interface ChromaticBase {
  letter: string;
  solfege: string;
  numberNotation: string;
  altLetter?: string;
  altSolfege?: string;
  altNumber?: string;
  semitoneIndex: number;
}

export const CHROMATIC_12_NOTES: ChromaticBase[] = [
  { letter: 'A', solfege: 'Lá', numberNotation: '1', semitoneIndex: 0 },
  { letter: 'A#', solfege: 'Lá#', numberNotation: '1#', altLetter: 'Bb', altSolfege: 'Sib', altNumber: '2b', semitoneIndex: 1 },
  { letter: 'B', solfege: 'Si', numberNotation: '2', semitoneIndex: 2 },
  { letter: 'C', solfege: 'Dó', numberNotation: '3', semitoneIndex: 3 },
  { letter: 'C#', solfege: 'Dó#', numberNotation: '3#', altLetter: 'Db', altSolfege: 'Réb', altNumber: '4b', semitoneIndex: 4 },
  { letter: 'D', solfege: 'Ré', numberNotation: '4', semitoneIndex: 5 },
  { letter: 'D#', solfege: 'Ré#', numberNotation: '4#', altLetter: 'Eb', altSolfege: 'Mib', altNumber: '5b', semitoneIndex: 6 },
  { letter: 'E', solfege: 'Mi', numberNotation: '5', semitoneIndex: 7 },
  { letter: 'F', solfege: 'Fá', numberNotation: '6', semitoneIndex: 8 },
  { letter: 'F#', solfege: 'Fá#', numberNotation: '6#', altLetter: 'Gb', altSolfege: 'Solb', altNumber: '7b', semitoneIndex: 9 },
  { letter: 'G', solfege: 'Sol', numberNotation: '7', semitoneIndex: 10 },
  { letter: 'G#', solfege: 'Sol#', numberNotation: '7#', altLetter: 'Ab', altSolfege: 'Láb', altNumber: '1b', semitoneIndex: 11 },
];

/**
 * Tabela de Notas Didáticas para Trompete em Si♭ (Escrita padrão de trompete)
 * Frequências calculadas com base na afinação padrão A4 = 440Hz
 * Nota: No trompete Bb, a nota escrita C4 soa como Bb3 no som de concerto (233.08 Hz).
 */
export const TRUMPET_NOTES: NoteDefinition[] = [
  {
    id: 'C3',
    letter: 'C',
    solfege: 'Dó',
    numberNotation: '3',
    semitoneIndex: 3,
    octave: 3,
    frequency: 116.54, // Som real Bb2 (Dó -1 pedal)
    valvesBb: [false, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Aberto (0 pistões)',
    description: 'Dó -1 (Fundamental Pedal). Embocadura solta e grande volume de ar quente.',
  },
  {
    id: 'C#3',
    letter: 'C#',
    solfege: 'Dó#',
    numberNotation: '3#',
    semitoneIndex: 4,
    octave: 3,
    frequency: 123.47, // Som real B2
    valvesBb: [true, true, true],
    difficulty: 'avancado',
    fingerDescription: '1, 2 e 3 (todos)',
    description: 'Dó# -1 / Réb -1. Todos os 3 pistões apertados.',
  },
  {
    id: 'D3',
    letter: 'D',
    solfege: 'Ré',
    numberNotation: '4',
    semitoneIndex: 5,
    octave: 3,
    frequency: 130.81, // Som real C3
    valvesBb: [true, false, true],
    difficulty: 'avancado',
    fingerDescription: '1 e 3',
    description: 'Ré -1. Pistões 1 e 3 com gatilho de afinação aberto.',
  },
  {
    id: 'D#3',
    letter: 'D#',
    solfege: 'Ré#',
    numberNotation: '4#',
    semitoneIndex: 6,
    octave: 3,
    frequency: 138.59, // Som real C#3
    valvesBb: [false, true, true],
    difficulty: 'avancado',
    fingerDescription: '2 e 3',
    description: 'Ré# -1 / Mib -1. Pistões 2 e 3.',
  },
  {
    id: 'E3',
    letter: 'E',
    solfege: 'Mi',
    numberNotation: '5',
    semitoneIndex: 7,
    octave: 3,
    frequency: 146.83, // Som real D3
    valvesBb: [true, true, false],
    difficulty: 'avancado',
    fingerDescription: '1 e 2',
    description: 'Mi -1. Pistões 1 e 2 no registro grave pedal.',
  },
  {
    id: 'F3',
    letter: 'F',
    solfege: 'Fá',
    numberNotation: '6',
    semitoneIndex: 8,
    octave: 3,
    frequency: 155.56, // Som real Eb3
    valvesBb: [true, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Fá -1. Apenas pistão 1 com coluna de ar profunda.',
  },
  {
    id: 'F#3',
    letter: 'F#',
    solfege: 'Fá#',
    numberNotation: '6#',
    semitoneIndex: 9,
    octave: 3,
    frequency: 164.81, // Som real E3
    valvesBb: [true, true, true],
    difficulty: 'avancado',
    fingerDescription: '1, 2 e 3 (todos)',
    description: 'A nota mais grave comum da extensão padrão. Embocadura bem relaxada.'
  },
  {
    id: 'G3',
    letter: 'G',
    solfege: 'Sol',
    numberNotation: '7',
    semitoneIndex: 10,
    octave: 3,
    frequency: 174.61, // Som real F3
    valvesBb: [true, false, true],
    difficulty: 'avancado',
    fingerDescription: '1 e 3',
    description: 'Grave e encorpado. Requer ar quente e contínuo.'
  },
  {
    id: 'G#3',
    letter: 'G#',
    solfege: 'Sol#',
    numberNotation: '7#',
    semitoneIndex: 11,
    octave: 3,
    frequency: 185.00, // Som real F#3
    valvesBb: [false, true, true],
    difficulty: 'intermediario',
    fingerDescription: '2 e 3',
    description: 'Pistões do meio e da ponta pressionados.'
  },
  {
    id: 'A3',
    letter: 'A',
    solfege: 'Lá',
    numberNotation: '1',
    semitoneIndex: 0,
    octave: 3,
    frequency: 196.00, // Som real G3
    valvesBb: [true, true, false],
    difficulty: 'iniciante',
    fingerDescription: '1 e 2',
    description: 'Nota 1 (Lá) do registro grave. Excelente para aquecer o som.'
  },
  {
    id: 'Bb3',
    letter: 'Bb',
    solfege: 'Sib',
    numberNotation: '2b',
    semitoneIndex: 1,
    octave: 3,
    frequency: 207.65, // Som real Ab3
    valvesBb: [true, false, false],
    difficulty: 'iniciante',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Apenas o indicador da mão direita apertando o 1º pistão.'
  },
  {
    id: 'B3',
    letter: 'B',
    solfege: 'Si',
    numberNotation: '2',
    semitoneIndex: 2,
    octave: 3,
    frequency: 220.00, // Som real A3
    valvesBb: [false, true, false],
    difficulty: 'iniciante',
    fingerDescription: 'Apenas Pistão 2',
    description: 'Nota 2 (Si). Dedo médio no segundo pistão.'
  },
  {
    id: 'C4',
    letter: 'C',
    solfege: 'Dó',
    numberNotation: '3',
    semitoneIndex: 3,
    octave: 4,
    frequency: 233.08, // Som real Bb3
    valvesBb: [false, false, false],
    difficulty: 'iniciante',
    fingerDescription: 'Aberto (0 pistões)',
    description: 'A grande porta de entrada! Nota 3 (Dó central). Nenhum pistão apertado.'
  },
  {
    id: 'C#4',
    letter: 'C#',
    solfege: 'Dó#',
    numberNotation: '3#',
    semitoneIndex: 4,
    octave: 4,
    frequency: 246.94, // Som real B3
    valvesBb: [true, true, true],
    difficulty: 'intermediario',
    fingerDescription: '1, 2 e 3 (todos)',
    description: 'Dó sustenido. Costuma soar ligeiramente alta; mantenha a coluna de ar estável.'
  },
  {
    id: 'D4',
    letter: 'D',
    solfege: 'Ré',
    numberNotation: '4',
    semitoneIndex: 5,
    octave: 4,
    frequency: 261.63, // Som real C4
    valvesBb: [true, false, true],
    difficulty: 'iniciante',
    fingerDescription: '1 e 3',
    description: 'Nota 4 (Ré). Dedo indicador e dedo anelar pressionados.'
  },
  {
    id: 'D#4',
    letter: 'D#',
    solfege: 'Ré#',
    numberNotation: '4#',
    semitoneIndex: 6,
    octave: 4,
    frequency: 277.18, // Som real C#4
    valvesBb: [false, true, true],
    difficulty: 'intermediario',
    fingerDescription: '2 e 3',
    description: 'Ré sustenido ou Mi bemol (5b).'
  },
  {
    id: 'E4',
    letter: 'E',
    solfege: 'Mi',
    numberNotation: '5',
    semitoneIndex: 7,
    octave: 4,
    frequency: 293.66, // Som real D4
    valvesBb: [true, true, false],
    difficulty: 'iniciante',
    fingerDescription: '1 e 2',
    description: 'Nota 5 (Mi). Dedo 1 e dedo 2. Muito comum em canções iniciais.'
  },
  {
    id: 'F4',
    letter: 'F',
    solfege: 'Fá',
    numberNotation: '6',
    semitoneIndex: 8,
    octave: 4,
    frequency: 311.13, // Som real Eb4
    valvesBb: [true, false, false],
    difficulty: 'iniciante',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Nota 6 (Fá). Apenas o primeiro pistão.'
  },
  {
    id: 'F#4',
    letter: 'F#',
    solfege: 'Fá#',
    numberNotation: '6#',
    semitoneIndex: 9,
    octave: 4,
    frequency: 329.63, // Som real E4
    valvesBb: [false, true, false],
    difficulty: 'intermediario',
    fingerDescription: 'Apenas Pistão 2',
    description: 'Fá sustenido. Dedo 2 pressionado.'
  },
  {
    id: 'G4',
    letter: 'G',
    solfege: 'Sol',
    numberNotation: '7',
    semitoneIndex: 10,
    octave: 4,
    frequency: 349.23, // Som real F4
    valvesBb: [false, false, false],
    difficulty: 'iniciante',
    fingerDescription: 'Aberto (0 pistões)',
    description: 'Nota 7 (Sol). Aberto! O segundo harmônico natural do trompete.'
  },
  {
    id: 'G#4',
    letter: 'G#',
    solfege: 'Sol#',
    numberNotation: '7#',
    semitoneIndex: 11,
    octave: 4,
    frequency: 369.99, // Som real F#4
    valvesBb: [false, true, true],
    difficulty: 'intermediario',
    fingerDescription: '2 e 3',
    description: 'Sol sustenido ou Lá bemol (1b).'
  },
  {
    id: 'A4',
    letter: 'A',
    solfege: 'Lá',
    numberNotation: '1',
    semitoneIndex: 0,
    octave: 4,
    frequency: 392.00, // Som real G4
    valvesBb: [true, true, false],
    difficulty: 'iniciante',
    fingerDescription: '1 e 2',
    description: 'Nota 1 (Lá) na 2ª oitava. Firmeza nos lábios e fluxo de ar focado.'
  },
  {
    id: 'Bb4',
    letter: 'Bb',
    solfege: 'Sib',
    numberNotation: '2b',
    semitoneIndex: 1,
    octave: 4,
    frequency: 415.30, // Som real Ab4
    valvesBb: [true, false, false],
    difficulty: 'iniciante',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Si bemol agudo. Pistão 1 pressionado.'
  },
  {
    id: 'B4',
    letter: 'B',
    solfege: 'Si',
    numberNotation: '2',
    semitoneIndex: 2,
    octave: 4,
    frequency: 440.00, // Som real A4 (440Hz exato!)
    valvesBb: [false, true, false],
    difficulty: 'iniciante',
    fingerDescription: 'Apenas Pistão 2',
    description: 'Nota 2 (Si). Quando soa, produz exatamente 440Hz de concerto no diapasão mundial!'
  },
  {
    id: 'C5',
    letter: 'C',
    solfege: 'Dó',
    numberNotation: '3',
    semitoneIndex: 3,
    octave: 5,
    frequency: 466.16, // Som real Bb4
    valvesBb: [false, false, false],
    difficulty: 'iniciante',
    fingerDescription: 'Aberto (0 pistões)',
    description: 'Dó Agudo (3). Aberto! Fechando a primeira oitava clássica.'
  },
  {
    id: 'C#5',
    letter: 'C#',
    solfege: 'Dó#',
    numberNotation: '3#',
    semitoneIndex: 4,
    octave: 5,
    frequency: 493.88, // Som real B4
    valvesBb: [true, true, false],
    difficulty: 'intermediario',
    fingerDescription: '1 e 2 (12)',
    description: 'Dó# na 8ª acima. Na ordem natural numérica simplifica para os pistões 1 e 2 (ao invés de 1-2-3 do grave)!'
  },
  {
    id: 'D5',
    letter: 'D',
    solfege: 'Ré',
    numberNotation: '4',
    semitoneIndex: 5,
    octave: 5,
    frequency: 523.25, // Som real C5
    valvesBb: [true, false, false],
    difficulty: 'intermediario',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Nota 4 (Ré) na 8ª acima. Ordem natural: toca-se com o Pistão 1 (ao invés de 1-3 do grave).'
  },
  {
    id: 'D#5',
    letter: 'D#',
    solfege: 'Ré#',
    numberNotation: '4#',
    semitoneIndex: 6,
    octave: 5,
    frequency: 554.37, // Som real C#5
    valvesBb: [false, true, false],
    difficulty: 'intermediario',
    fingerDescription: 'Apenas Pistão 2',
    description: 'Ré# / Mib na 8ª acima. Ordem natural: toca-se com o Pistão 2 (ao invés de 2-3 do grave).'
  },
  {
    id: 'E5',
    letter: 'E',
    solfege: 'Mi',
    numberNotation: '5',
    semitoneIndex: 7,
    octave: 5,
    frequency: 587.33, // Som real D5
    valvesBb: [false, false, false],
    difficulty: 'intermediario',
    fingerDescription: 'Aberto (0 pistões)',
    description: 'Nota 5 (Mi) na 8ª acima. Toca-se aberto (0) ou alternativamente com pistões 1 e 2 (12).'
  },
  {
    id: 'F5',
    letter: 'F',
    solfege: 'Fá',
    numberNotation: '6',
    semitoneIndex: 8,
    octave: 5,
    frequency: 622.25, // Som real Eb5
    valvesBb: [true, false, false],
    difficulty: 'intermediario',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Nota 6 (Fá) na 8ª acima. Mantém rigorosamente o Pistão 1 com coluna de ar focada.'
  },
  {
    id: 'F#5',
    letter: 'F#',
    solfege: 'Fá#',
    numberNotation: '6#',
    semitoneIndex: 9,
    octave: 5,
    frequency: 659.26, // Som real E5
    valvesBb: [false, true, false],
    difficulty: 'intermediario',
    fingerDescription: 'Apenas Pistão 2',
    description: 'Fá# / Solb na 8ª acima. Pistão 2 com excelente centro tonal.'
  },
  {
    id: 'G5',
    letter: 'G',
    solfege: 'Sol',
    numberNotation: '7',
    semitoneIndex: 10,
    octave: 5,
    frequency: 698.46, // Som real F5
    valvesBb: [false, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Aberto (0 pistões)',
    description: 'Nota 7 (Sol) na 8ª acima. Aberto (0)! Brilho potente da série harmônica.'
  },
  {
    id: 'G#5',
    letter: 'G#',
    solfege: 'Sol#',
    numberNotation: '7#',
    semitoneIndex: 11,
    octave: 5,
    frequency: 739.99, // Som real F#5
    valvesBb: [false, true, true],
    difficulty: 'avancado',
    fingerDescription: '2 e 3 (23)',
    description: 'Sol# / Láb na 8ª acima. Pistões 2 e 3 (23) com embocadura firme nos cantos.'
  },
  {
    id: 'A5',
    letter: 'A',
    solfege: 'Lá',
    numberNotation: '1',
    semitoneIndex: 0,
    octave: 5,
    frequency: 783.99, // Som real G5
    valvesBb: [true, true, false],
    difficulty: 'avancado',
    fingerDescription: '1 e 2 (12)',
    description: 'Nota 1 (Lá) na 8ª acima. Pistões 1 e 2 (12) ou alternativamente 1 nos superagudos.'
  },
  {
    id: 'Bb5',
    letter: 'Bb',
    solfege: 'Sib',
    numberNotation: '2b',
    semitoneIndex: 1,
    octave: 5,
    frequency: 830.61, // Som real Ab5
    valvesBb: [true, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Si bemol na 8ª acima. Apenas Pistão 1 com pressão de ar controlada.'
  },
  {
    id: 'B5',
    letter: 'B',
    solfege: 'Si',
    numberNotation: '2',
    semitoneIndex: 2,
    octave: 5,
    frequency: 880.00, // Som real A5
    valvesBb: [false, true, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 2',
    description: 'Nota 2 (Si) na 8ª acima. Apenas Pistão 2.'
  },
  {
    id: 'C6',
    letter: 'C',
    solfege: 'Dó',
    numberNotation: '3',
    semitoneIndex: 3,
    octave: 6,
    frequency: 932.33, // Som real Bb5
    valvesBb: [false, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Aberto (0 pistões)',
    description: 'Dó Superagudo (16ª acima). Aberto (0)! O 8º harmônico da ressonância.'
  },
  {
    id: 'C#6',
    letter: 'C#',
    solfege: 'Dó#',
    numberNotation: '3#',
    semitoneIndex: 4,
    octave: 6,
    frequency: 987.77, // Som real B5
    valvesBb: [true, true, false],
    difficulty: 'avancado',
    fingerDescription: '1 e 2 (12)',
    description: 'Dó# na 16ª acima. Ordem natural: Pistões 1 e 2 (12).'
  },
  {
    id: 'D6',
    letter: 'D',
    solfege: 'Ré',
    numberNotation: '4',
    semitoneIndex: 5,
    octave: 6,
    frequency: 1046.50, // Som real C6
    valvesBb: [true, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Ré na 16ª acima. Ordem natural: Pistão 1.'
  },
  {
    id: 'D#6',
    letter: 'D#',
    solfege: 'Ré#',
    numberNotation: '4#',
    semitoneIndex: 6,
    octave: 6,
    frequency: 1108.73, // Som real C#6
    valvesBb: [false, true, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 2',
    description: 'Ré# na 16ª acima. Ordem natural: Pistão 2.'
  },
  {
    id: 'E6',
    letter: 'E',
    solfege: 'Mi',
    numberNotation: '5',
    semitoneIndex: 7,
    octave: 6,
    frequency: 1174.66, // Som real D6
    valvesBb: [false, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Aberto (0 pistões)',
    description: 'Mi na 16ª acima. Aberto (0) ou pistões 1 e 2 (12).'
  },
  {
    id: 'F6',
    letter: 'F',
    solfege: 'Fá',
    numberNotation: '6',
    semitoneIndex: 8,
    octave: 6,
    frequency: 1244.51, // Som real Eb6
    valvesBb: [true, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Fá na 16ª acima. Pistão 1.'
  },
  {
    id: 'F#6',
    letter: 'F#',
    solfege: 'Fá#',
    numberNotation: '6#',
    semitoneIndex: 9,
    octave: 6,
    frequency: 1318.51, // Som real E6
    valvesBb: [false, true, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 2',
    description: 'Fá# na 16ª acima (Dó +2). Pistão 2 com velocidade extrema de ar.',
  },
  {
    id: 'G6',
    letter: 'G',
    solfege: 'Sol',
    numberNotation: '7',
    semitoneIndex: 10,
    octave: 6,
    frequency: 1396.91, // Som real F6
    valvesBb: [false, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Aberto (0 pistões)',
    description: 'Sol na 16ª acima (Dó +2). Aberto (0).',
  },
  {
    id: 'G#6',
    letter: 'G#',
    solfege: 'Sol#',
    numberNotation: '7#',
    semitoneIndex: 11,
    octave: 6,
    frequency: 1479.98, // Som real F#6
    valvesBb: [false, true, true],
    difficulty: 'avancado',
    fingerDescription: '2 e 3 (ou 1)',
    description: 'Sol# na 16ª acima (Dó +2). Pistões 2 e 3 ou pistão 1.',
  },
  {
    id: 'A6',
    letter: 'A',
    solfege: 'Lá',
    numberNotation: '1',
    semitoneIndex: 0,
    octave: 6,
    frequency: 1567.98, // Som real G6
    valvesBb: [true, true, false],
    difficulty: 'avancado',
    fingerDescription: '1 e 2 (ou 1)',
    description: 'Lá na 16ª acima (Dó +2). Pistões 1 e 2.',
  },
  {
    id: 'Bb6',
    letter: 'Bb',
    solfege: 'Sib',
    numberNotation: '2b',
    semitoneIndex: 1,
    octave: 6,
    frequency: 1661.22, // Som real Ab6
    valvesBb: [true, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Si♭ na 16ª acima (Dó +2). Pistão 1.',
  },
  {
    id: 'B6',
    letter: 'B',
    solfege: 'Si',
    numberNotation: '2',
    semitoneIndex: 2,
    octave: 6,
    frequency: 1760.00, // Som real A6 (1760 Hz)
    valvesBb: [false, true, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 2',
    description: 'Si na 16ª acima (Dó +2). Pistão 2.',
  },
  // OITAVA 7 (Dó +3 a Si +3 - Ultra-Agudo / 24ª acima)
  {
    id: 'C7',
    letter: 'C',
    solfege: 'Dó',
    numberNotation: '3',
    semitoneIndex: 3,
    octave: 7,
    frequency: 1864.66, // Som real Bb6
    valvesBb: [false, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Aberto (0 pistões)',
    description: 'Dó +3 (Super Dó - Dupla Oitava Acima). Aberto (0)! Pico técnico do trompete.',
  },
  {
    id: 'C#7',
    letter: 'C#',
    solfege: 'Dó#',
    numberNotation: '3#',
    semitoneIndex: 4,
    octave: 7,
    frequency: 1975.53, // Som real B6
    valvesBb: [true, true, false],
    difficulty: 'avancado',
    fingerDescription: '1 e 2 (ou 0)',
    description: 'Dó# +3 / Ré♭ +3. Ordem natural: pistões 1 e 2.',
  },
  {
    id: 'D7',
    letter: 'D',
    solfege: 'Ré',
    numberNotation: '4',
    semitoneIndex: 5,
    octave: 7,
    frequency: 2093.00, // Som real C7
    valvesBb: [true, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Ré +3. Pistão 1.',
  },
  {
    id: 'D#7',
    letter: 'D#',
    solfege: 'Ré#',
    numberNotation: '4#',
    semitoneIndex: 6,
    octave: 7,
    frequency: 2217.46, // Som real C#7
    valvesBb: [false, true, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 2',
    description: 'Ré# +3 / Mi♭ +3. Pistão 2.',
  },
  {
    id: 'E7',
    letter: 'E',
    solfege: 'Mi',
    numberNotation: '5',
    semitoneIndex: 7,
    octave: 7,
    frequency: 2349.32, // Som real D7
    valvesBb: [false, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Aberto (0 pistões)',
    description: 'Mi +3. Aberto (0).',
  },
  {
    id: 'F7',
    letter: 'F',
    solfege: 'Fá',
    numberNotation: '6',
    semitoneIndex: 8,
    octave: 7,
    frequency: 2489.02, // Som real Eb7
    valvesBb: [true, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Fá +3. Pistão 1.',
  },
  {
    id: 'F#7',
    letter: 'F#',
    solfege: 'Fá#',
    numberNotation: '6#',
    semitoneIndex: 9,
    octave: 7,
    frequency: 2637.02, // Som real E7
    valvesBb: [false, true, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 2',
    description: 'Fá# +3. Pistão 2.',
  },
  {
    id: 'G7',
    letter: 'G',
    solfege: 'Sol',
    numberNotation: '7',
    semitoneIndex: 10,
    octave: 7,
    frequency: 2793.83, // Som real F7
    valvesBb: [false, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Aberto (0 pistões)',
    description: 'Sol +3. Aberto (0).',
  },
  {
    id: 'G#7',
    letter: 'G#',
    solfege: 'Sol#',
    numberNotation: '7#',
    semitoneIndex: 11,
    octave: 7,
    frequency: 2959.96, // Som real F#7
    valvesBb: [false, true, true],
    difficulty: 'avancado',
    fingerDescription: '2 e 3',
    description: 'Sol# +3. Pistões 2 e 3.',
  },
  {
    id: 'A7',
    letter: 'A',
    solfege: 'Lá',
    numberNotation: '1',
    semitoneIndex: 0,
    octave: 7,
    frequency: 3135.96, // Som real G7
    valvesBb: [true, true, false],
    difficulty: 'avancado',
    fingerDescription: '1 e 2',
    description: 'Lá +3. Pistões 1 e 2.',
  },
  {
    id: 'Bb7',
    letter: 'Bb',
    solfege: 'Sib',
    numberNotation: '2b',
    semitoneIndex: 1,
    octave: 7,
    frequency: 3322.44, // Som real Ab7
    valvesBb: [true, false, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 1',
    description: 'Si♭ +3. Pistão 1.',
  },
  {
    id: 'B7',
    letter: 'B',
    solfege: 'Si',
    numberNotation: '2',
    semitoneIndex: 2,
    octave: 7,
    frequency: 3520.00, // Som real A7 (3520 Hz)
    valvesBb: [false, true, false],
    difficulty: 'avancado',
    fingerDescription: 'Apenas Pistão 2',
    description: 'Si +3. Pistão 2. Fechamento da oitava +3.',
  },
];

/**
 * Exercícios e Canções Adaptadas com o Sistema ABC (A=1 ... G=7)
 */
export const BEGINNER_SONGS: SongExercise[] = [
  {
    id: 'primeiras-notas',
    title: 'Exercício 1: Três Primeiras Notas (Dó, Ré, Mi)',
    difficulty: 'Fácil',
    level: 'Iniciante',
    category: 'Aquecimento e Notas Longas',
    description: 'A base essencial do trompete com as notas 3, 4 e 5. Toque cada nota e segure até o aplicativo confirmar!',
    notes: [
      { noteId: 'C4', duration: 3, lyricOrTip: 'Dó (3) - Aberto [0]' },
      { noteId: 'D4', duration: 3, lyricOrTip: 'Ré (4) - Pistões [1, 3]' },
      { noteId: 'E4', duration: 3, lyricOrTip: 'Mi (5) - Pistões [1, 2]' },
      { noteId: 'D4', duration: 3, lyricOrTip: 'Ré (4) - Retornando [1, 3]' },
      { noteId: 'C4', duration: 4, lyricOrTip: 'Dó (3) - Finalize firme e afinado [0]' },
    ]
  },
  {
    id: 'escala-maior',
    title: 'A Escala Completa (Dó Maior / 3 a 3)',
    difficulty: 'Fácil',
    level: 'Iniciante',
    category: 'Escalas e Intervalos',
    description: 'Pratique a sequência do sistema 1 a 7: Dó(3) Ré(4) Mi(5) Fá(6) Sol(7) Lá(1) Si(2) Dó(3)',
    notes: [
      { noteId: 'C4', duration: 2, lyricOrTip: 'Dó [3] - Aberto' },
      { noteId: 'D4', duration: 2, lyricOrTip: 'Ré [4] - Pistões 1 e 3' },
      { noteId: 'E4', duration: 2, lyricOrTip: 'Mi [5] - Pistões 1 e 2' },
      { noteId: 'F4', duration: 2, lyricOrTip: 'Fá [6] - Pistão 1' },
      { noteId: 'G4', duration: 2, lyricOrTip: 'Sol [7] - Aberto' },
      { noteId: 'A4', duration: 2, lyricOrTip: 'Lá [1] - Pistões 1 e 2' },
      { noteId: 'B4', duration: 2, lyricOrTip: 'Si [2] - Pistão 2' },
      { noteId: 'C5', duration: 3, lyricOrTip: 'Dó Agudo [3] - Aberto!' },
    ]
  },
  {
    id: 'ode-alegria',
    title: 'Hino da Alegria (Beethoven)',
    difficulty: 'Fácil',
    level: 'Iniciante',
    category: 'Repertório e Músicas Famosas',
    description: 'Tema clássico mundial perfeito para desenvolver coordenação de pistões e afinação contínua.',
    notes: [
      { noteId: 'E4', duration: 2, lyricOrTip: 'Mi (5)' },
      { noteId: 'E4', duration: 2, lyricOrTip: 'Mi (5)' },
      { noteId: 'F4', duration: 2, lyricOrTip: 'Fá (6)' },
      { noteId: 'G4', duration: 2, lyricOrTip: 'Sol (7)' },
      { noteId: 'G4', duration: 2, lyricOrTip: 'Sol (7)' },
      { noteId: 'F4', duration: 2, lyricOrTip: 'Fá (6)' },
      { noteId: 'E4', duration: 2, lyricOrTip: 'Mi (5)' },
      { noteId: 'D4', duration: 2, lyricOrTip: 'Ré (4)' },
      { noteId: 'C4', duration: 2, lyricOrTip: 'Dó (3)' },
      { noteId: 'C4', duration: 2, lyricOrTip: 'Dó (3)' },
      { noteId: 'D4', duration: 2, lyricOrTip: 'Ré (4)' },
      { noteId: 'E4', duration: 3, lyricOrTip: 'Mi (5)' },
      { noteId: 'D4', duration: 2, lyricOrTip: 'Ré (4)' },
      { noteId: 'C4', duration: 4, lyricOrTip: 'Dó (3)' },
    ]
  },
  {
    id: 'asa-branca',
    title: 'Asa Branca (Luiz Gonzaga)',
    difficulty: 'Médio',
    level: 'Intermediário',
    category: 'Repertório e Músicas Famosas',
    description: 'O clássico mais emblemático do Brasil com cifras no sistema A=1 até G=7 e pistões dinâmicos.',
    notes: [
      { noteId: 'G4', duration: 2, lyricOrTip: 'Quan- (Sol / 7)' },
      { noteId: 'A4', duration: 2, lyricOrTip: 'doio- (Lá / 1)' },
      { noteId: 'B4', duration: 2, lyricOrTip: 'lhei a (Si / 2)' },
      { noteId: 'D5', duration: 2, lyricOrTip: 'ter- (Ré / 4)' },
      { noteId: 'D5', duration: 2, lyricOrTip: 'raar- (Ré / 4)' },
      { noteId: 'B4', duration: 2, lyricOrTip: 'den- (Si / 2)' },
      { noteId: 'C5', duration: 2, lyricOrTip: 'do (Dó / 3)' },
      { noteId: 'C5', duration: 3, lyricOrTip: 'Qual (Dó / 3)' },
      { noteId: 'G4', duration: 2, lyricOrTip: 'fo- (Sol / 7)' },
      { noteId: 'A4', duration: 2, lyricOrTip: 'guei- (Lá / 1)' },
      { noteId: 'B4', duration: 2, lyricOrTip: 'ra de (Si / 2)' },
      { noteId: 'D5', duration: 2, lyricOrTip: 'São (Ré / 4)' },
      { noteId: 'D5', duration: 2, lyricOrTip: 'Jo- (Ré / 4)' },
      { noteId: 'C5', duration: 4, lyricOrTip: 'ão... (Dó / 3)' },
    ]
  },
  {
    id: 'brilha-brilha',
    title: 'Brilha, Brilha Estrelinha',
    difficulty: 'Fácil',
    level: 'Iniciante',
    category: 'Repertório e Músicas Famosas',
    description: 'Melodia infantil ideal para crianças e iniciantes praticarem saltos de 5ª com o trompete.',
    notes: [
      { noteId: 'C4', duration: 2, lyricOrTip: 'Bri- (Dó / 3)' },
      { noteId: 'C4', duration: 2, lyricOrTip: 'lha (Dó / 3)' },
      { noteId: 'G4', duration: 2, lyricOrTip: 'bri- (Sol / 7)' },
      { noteId: 'G4', duration: 2, lyricOrTip: 'lha (Sol / 7)' },
      { noteId: 'A4', duration: 2, lyricOrTip: 'es- (Lá / 1)' },
      { noteId: 'A4', duration: 2, lyricOrTip: 'tre- (Lá / 1)' },
      { noteId: 'G4', duration: 3, lyricOrTip: 'linha (Sol / 7)' },
      { noteId: 'F4', duration: 2, lyricOrTip: 'que- (Fá / 6)' },
      { noteId: 'F4', duration: 2, lyricOrTip: 'ro (Fá / 6)' },
      { noteId: 'E4', duration: 2, lyricOrTip: 'ver (Mi / 5)' },
      { noteId: 'E4', duration: 2, lyricOrTip: 'vo- (Mi / 5)' },
      { noteId: 'D4', duration: 2, lyricOrTip: 'cê (Ré / 4)' },
      { noteId: 'D4', duration: 2, lyricOrTip: 'bri- (Ré / 4)' },
      { noteId: 'C4', duration: 4, lyricOrTip: 'lhar (Dó / 3)' },
    ]
  }
];
