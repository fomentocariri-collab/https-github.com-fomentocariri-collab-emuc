import { NoteDefinition } from '../types';
import { TRUMPET_NOTES } from './trumpetData';

export type KeyRowType = 'sharp' | 'natural' | 'flat';

export interface PianoKeyMapping {
  pcKey: string;
  displayKey: string;
  rowType: KeyRowType;
  rowLabel: string;
  targetNoteId: string;
  solfege: string;
  letter: string;
  abcNumber: string;
  accidental: 'natural' | 'sharp' | 'flat';
  valves: string;
  octave: number;
  octaveRelative: '-1' | '0' | '+1' | '+2' | '+3';
  isShift?: boolean;
}

/**
 * Mapeamento Completo de Teclado de Computador (PC / Notebook)
 * Cobrindo a abrangência tonal de Dó -1 até Si +3:
 * - Oitava -1: Linha ZXCVBNM (Naturais) e 1-5 (Sustenidos)
 * - Oitava 0: Linha ASDFG (Naturais) e QWERT (Sustenidos)
 * - Oitava +1: K, L, Ç e continuação com Shift (Shift+F, Shift+G, Shift+H, Shift+J)
 * - Oitavas +2 e +3: Linha com Shift (Shift+A a Shift+Ç para naturais; Shift+Q a Shift+P para sustenidos)
 */
export const PC_KEYBOARD_MAPPINGS: Record<string, PianoKeyMapping> = {
  // =========================================================================
  // 1. OITAVA -1 (DÓ -1 ATÉ SI -1) - LINHA ZXCVB E NÚMEROS 1-5
  // =========================================================================
  z: { pcKey: 'z', displayKey: 'Z', rowType: 'natural', rowLabel: 'Oitava -1 (Grave)', targetNoteId: 'C3', solfege: 'Dó -1', letter: 'C3', abcNumber: '3', accidental: 'natural', valves: '0', octave: 3, octaveRelative: '-1' },
  x: { pcKey: 'x', displayKey: 'X', rowType: 'natural', rowLabel: 'Oitava -1 (Grave)', targetNoteId: 'D3', solfege: 'Ré -1', letter: 'D3', abcNumber: '4', accidental: 'natural', valves: '1-3', octave: 3, octaveRelative: '-1' },
  c: { pcKey: 'c', displayKey: 'C', rowType: 'natural', rowLabel: 'Oitava -1 (Grave)', targetNoteId: 'E3', solfege: 'Mi -1', letter: 'E3', abcNumber: '5', accidental: 'natural', valves: '1-2', octave: 3, octaveRelative: '-1' },
  v: { pcKey: 'v', displayKey: 'V', rowType: 'natural', rowLabel: 'Oitava -1 (Grave)', targetNoteId: 'F3', solfege: 'Fá -1', letter: 'F3', abcNumber: '6', accidental: 'natural', valves: '1', octave: 3, octaveRelative: '-1' },
  b: { pcKey: 'b', displayKey: 'B', rowType: 'natural', rowLabel: 'Oitava -1 (Grave)', targetNoteId: 'G3', solfege: 'Sol -1', letter: 'G3', abcNumber: '7', accidental: 'natural', valves: '0', octave: 3, octaveRelative: '-1' },
  n: { pcKey: 'n', displayKey: 'N', rowType: 'natural', rowLabel: 'Oitava -1 (Grave)', targetNoteId: 'A3', solfege: 'Lá -1', letter: 'A3', abcNumber: '1', accidental: 'natural', valves: '1-2', octave: 3, octaveRelative: '-1' },
  m: { pcKey: 'm', displayKey: 'M', rowType: 'natural', rowLabel: 'Oitava -1 (Grave)', targetNoteId: 'B3', solfege: 'Si -1', letter: 'B3', abcNumber: '2', accidental: 'natural', valves: '2', octave: 3, octaveRelative: '-1' },

  // Sustenidos Oitava -1 (Teclas numéricas 1 a 5)
  '1': { pcKey: '1', displayKey: '1', rowType: 'sharp', rowLabel: 'Oitava -1 (Sustenidos)', targetNoteId: 'C#3', solfege: 'Dó♯ -1', letter: 'C#3', abcNumber: '3#', accidental: 'sharp', valves: '1-2-3', octave: 3, octaveRelative: '-1' },
  '2': { pcKey: '2', displayKey: '2', rowType: 'sharp', rowLabel: 'Oitava -1 (Sustenidos)', targetNoteId: 'D#3', solfege: 'Ré♯ -1', letter: 'D#3', abcNumber: '4#', accidental: 'sharp', valves: '2-3', octave: 3, octaveRelative: '-1' },
  '3': { pcKey: '3', displayKey: '3', rowType: 'sharp', rowLabel: 'Oitava -1 (Sustenidos)', targetNoteId: 'F#3', solfege: 'Fá♯ -1', letter: 'F#3', abcNumber: '6#', accidental: 'sharp', valves: '2', octave: 3, octaveRelative: '-1' },
  '4': { pcKey: '4', displayKey: '4', rowType: 'sharp', rowLabel: 'Oitava -1 (Sustenidos)', targetNoteId: 'G#3', solfege: 'Sol♯ -1', letter: 'G#3', abcNumber: '7#', accidental: 'sharp', valves: '2-3', octave: 3, octaveRelative: '-1' },
  '5': { pcKey: '5', displayKey: '5', rowType: 'sharp', rowLabel: 'Oitava -1 (Sustenidos)', targetNoteId: 'Bb3', solfege: 'Lá♯ -1', letter: 'A#3', abcNumber: '1#', accidental: 'sharp', valves: '1', octave: 3, octaveRelative: '-1' },

  // =========================================================================
  // 2. OITAVA 0 (DÓ 0 ATÉ SI 0 - CENTRAL) - LINHAS ASDFG E QWERT
  // =========================================================================
  a: { pcKey: 'a', displayKey: 'A', rowType: 'natural', rowLabel: 'Oitava 0 (Central)', targetNoteId: 'C4', solfege: 'Dó', letter: 'C4', abcNumber: '3', accidental: 'natural', valves: '0', octave: 4, octaveRelative: '0' },
  s: { pcKey: 's', displayKey: 'S', rowType: 'natural', rowLabel: 'Oitava 0 (Central)', targetNoteId: 'D4', solfege: 'Ré', letter: 'D4', abcNumber: '4', accidental: 'natural', valves: '1-3', octave: 4, octaveRelative: '0' },
  d: { pcKey: 'd', displayKey: 'D', rowType: 'natural', rowLabel: 'Oitava 0 (Central)', targetNoteId: 'E4', solfege: 'Mi', letter: 'E4', abcNumber: '5', accidental: 'natural', valves: '1-2', octave: 4, octaveRelative: '0' },
  f: { pcKey: 'f', displayKey: 'F', rowType: 'natural', rowLabel: 'Oitava 0 (Central)', targetNoteId: 'F4', solfege: 'Fá', letter: 'F4', abcNumber: '6', accidental: 'natural', valves: '1', octave: 4, octaveRelative: '0' },
  g: { pcKey: 'g', displayKey: 'G', rowType: 'natural', rowLabel: 'Oitava 0 (Central)', targetNoteId: 'G4', solfege: 'Sol', letter: 'G4', abcNumber: '7', accidental: 'natural', valves: '0', octave: 4, octaveRelative: '0' },
  h: { pcKey: 'h', displayKey: 'H', rowType: 'natural', rowLabel: 'Oitava 0 (Central)', targetNoteId: 'A4', solfege: 'Lá', letter: 'A4', abcNumber: '1', accidental: 'natural', valves: '1-2', octave: 4, octaveRelative: '0' },
  j: { pcKey: 'j', displayKey: 'J', rowType: 'natural', rowLabel: 'Oitava 0 (Central)', targetNoteId: 'B4', solfege: 'Si', letter: 'B4', abcNumber: '2', accidental: 'natural', valves: '2', octave: 4, octaveRelative: '0' },

  // Sustenidos Oitava 0 (Linha QWERT)
  q: { pcKey: 'q', displayKey: 'Q', rowType: 'sharp', rowLabel: 'Oitava 0 (Sustenidos)', targetNoteId: 'C#4', solfege: 'Dó♯', letter: 'C#4', abcNumber: '3#', accidental: 'sharp', valves: '1-2-3', octave: 4, octaveRelative: '0' },
  w: { pcKey: 'w', displayKey: 'W', rowType: 'sharp', rowLabel: 'Oitava 0 (Sustenidos)', targetNoteId: 'D#4', solfege: 'Ré♯', letter: 'D#4', abcNumber: '4#', accidental: 'sharp', valves: '2-3', octave: 4, octaveRelative: '0' },
  e: { pcKey: 'e', displayKey: 'E', rowType: 'sharp', rowLabel: 'Oitava 0 (Sustenidos)', targetNoteId: 'F#4', solfege: 'Fá♯', letter: 'F#4', abcNumber: '6#', accidental: 'sharp', valves: '2', octave: 4, octaveRelative: '0' },
  r: { pcKey: 'r', displayKey: 'R', rowType: 'sharp', rowLabel: 'Oitava 0 (Sustenidos)', targetNoteId: 'G#4', solfege: 'Sol♯', letter: 'G#4', abcNumber: '7#', accidental: 'sharp', valves: '2-3', octave: 4, octaveRelative: '0' },
  t: { pcKey: 't', displayKey: 'T', rowType: 'sharp', rowLabel: 'Oitava 0 (Sustenidos)', targetNoteId: 'Bb4', solfege: 'Lá♯', letter: 'A#4', abcNumber: '1#', accidental: 'sharp', valves: '1', octave: 4, octaveRelative: '0' },

  // =========================================================================
  // 3. OITAVA +1 (DÓ +1 ATÉ SI +1 - AGUDO / 8va)
  // Notas até o Ç e continuação imediata (Shift+F, Shift+G, etc. ou teclas adjacentes)
  // =========================================================================
  k: { pcKey: 'k', displayKey: 'K', rowType: 'natural', rowLabel: 'Oitava +1 (Agudo)', targetNoteId: 'C5', solfege: 'Dó +1', letter: 'C5', abcNumber: '3', accidental: 'natural', valves: '0', octave: 5, octaveRelative: '+1' },
  l: { pcKey: 'l', displayKey: 'L', rowType: 'natural', rowLabel: 'Oitava +1 (Agudo)', targetNoteId: 'D5', solfege: 'Ré +1', letter: 'D5', abcNumber: '4', accidental: 'natural', valves: '1', octave: 5, octaveRelative: '+1' },
  ç: { pcKey: 'ç', displayKey: 'Ç', rowType: 'natural', rowLabel: 'Oitava +1 (Agudo)', targetNoteId: 'E5', solfege: 'Mi +1', letter: 'E5', abcNumber: '5', accidental: 'natural', valves: '0', octave: 5, octaveRelative: '+1' },
  ';': { pcKey: ';', displayKey: ';', rowType: 'natural', rowLabel: 'Oitava +1 (Agudo)', targetNoteId: 'E5', solfege: 'Mi +1', letter: 'E5', abcNumber: '5', accidental: 'natural', valves: '0', octave: 5, octaveRelative: '+1' },
  // Teclas adjacentes ao Ç no teclado físico:
  '~': { pcKey: '~', displayKey: '~', rowType: 'natural', rowLabel: 'Oitava +1 (Agudo)', targetNoteId: 'F5', solfege: 'Fá +1', letter: 'F5', abcNumber: '6', accidental: 'natural', valves: '1', octave: 5, octaveRelative: '+1' },
  "'": { pcKey: "'", displayKey: "'", rowType: 'natural', rowLabel: 'Oitava +1 (Agudo)', targetNoteId: 'F5', solfege: 'Fá +1', letter: 'F5', abcNumber: '6', accidental: 'natural', valves: '1', octave: 5, octaveRelative: '+1' },
  ']': { pcKey: ']', displayKey: ']', rowType: 'natural', rowLabel: 'Oitava +1 (Agudo)', targetNoteId: 'G5', solfege: 'Sol +1', letter: 'G5', abcNumber: '7', accidental: 'natural', valves: '0', octave: 5, octaveRelative: '+1' },
  '[': { pcKey: '[', displayKey: '[', rowType: 'natural', rowLabel: 'Oitava +1 (Agudo)', targetNoteId: 'G5', solfege: 'Sol +1', letter: 'G5', abcNumber: '7', accidental: 'natural', valves: '0', octave: 5, octaveRelative: '+1' },
  '\\': { pcKey: '\\', displayKey: '\\', rowType: 'natural', rowLabel: 'Oitava +1 (Agudo)', targetNoteId: 'A5', solfege: 'Lá +1', letter: 'A5', abcNumber: '1', accidental: 'natural', valves: '1-2', octave: 5, octaveRelative: '+1' },

  // Sustenidos Oitava +1 (Segunda metade da linha QWERT)
  y: { pcKey: 'y', displayKey: 'Y', rowType: 'sharp', rowLabel: 'Oitava +1 (Sustenidos)', targetNoteId: 'C#5', solfege: 'Dó♯ +1', letter: 'C#5', abcNumber: '3#', accidental: 'sharp', valves: '1-2', octave: 5, octaveRelative: '+1' },
  u: { pcKey: 'u', displayKey: 'U', rowType: 'sharp', rowLabel: 'Oitava +1 (Sustenidos)', targetNoteId: 'D#5', solfege: 'Ré♯ +1', letter: 'D#5', abcNumber: '4#', accidental: 'sharp', valves: '2', octave: 5, octaveRelative: '+1' },
  i: { pcKey: 'i', displayKey: 'I', rowType: 'sharp', rowLabel: 'Oitava +1 (Sustenidos)', targetNoteId: 'F#5', solfege: 'Fá♯ +1', letter: 'F#5', abcNumber: '6#', accidental: 'sharp', valves: '2', octave: 5, octaveRelative: '+1' },
  o: { pcKey: 'o', displayKey: 'O', rowType: 'sharp', rowLabel: 'Oitava +1 (Sustenidos)', targetNoteId: 'G#5', solfege: 'Sol♯ +1', letter: 'G#5', abcNumber: '7#', accidental: 'sharp', valves: '2-3', octave: 5, octaveRelative: '+1' },
  p: { pcKey: 'p', displayKey: 'P', rowType: 'sharp', rowLabel: 'Oitava +1 (Sustenidos)', targetNoteId: 'Bb5', solfege: 'Lá♯ +1', letter: 'A#5', abcNumber: '1#', accidental: 'sharp', valves: '1', octave: 5, octaveRelative: '+1' },

  // =========================================================================
  // 4. ATALHOS COM SHIFT (CONTINUAÇÃO DIRETA E OITAVAS SUPERIORES +1 / +2 / +3)
  // "continue com Shift+a, +b, etc e o mesmo para # sustenido"
  // =========================================================================

  // Continuação natural onde acabava no "ç" (Mi +1) usando Shift:
  'shift+f': { pcKey: 'shift+f', displayKey: 'Shift+F', rowType: 'natural', rowLabel: 'Oitava +1 (Continuação do Ç)', targetNoteId: 'F5', solfege: 'Fá +1', letter: 'F5', abcNumber: '6', accidental: 'natural', valves: '1', octave: 5, octaveRelative: '+1', isShift: true },
  'shift+g': { pcKey: 'shift+g', displayKey: 'Shift+G', rowType: 'natural', rowLabel: 'Oitava +1 (Continuação do Ç)', targetNoteId: 'G5', solfege: 'Sol +1', letter: 'G5', abcNumber: '7', accidental: 'natural', valves: '0', octave: 5, octaveRelative: '+1', isShift: true },
  'shift+h': { pcKey: 'shift+h', displayKey: 'Shift+H', rowType: 'natural', rowLabel: 'Oitava +1 (Continuação do Ç)', targetNoteId: 'A5', solfege: 'Lá +1', letter: 'A5', abcNumber: '1', accidental: 'natural', valves: '1-2', octave: 5, octaveRelative: '+1', isShift: true },
  'shift+j': { pcKey: 'shift+j', displayKey: 'Shift+J', rowType: 'natural', rowLabel: 'Oitava +1 (Continuação do Ç)', targetNoteId: 'B5', solfege: 'Si +1', letter: 'B5', abcNumber: '2', accidental: 'natural', valves: '2', octave: 5, octaveRelative: '+1', isShift: true },

  // Shift nas letras musicais ABC diretas:
  'shift+a': { pcKey: 'shift+a', displayKey: 'Shift+A', rowType: 'natural', rowLabel: 'Nota Lá (8ª / 16ª)', targetNoteId: 'A5', solfege: 'Lá +1', letter: 'A5', abcNumber: '1', accidental: 'natural', valves: '1-2', octave: 5, octaveRelative: '+1', isShift: true },
  'shift+b': { pcKey: 'shift+b', displayKey: 'Shift+B', rowType: 'natural', rowLabel: 'Nota Si (8ª / 16ª)', targetNoteId: 'B5', solfege: 'Si +1', letter: 'B5', abcNumber: '2', accidental: 'natural', valves: '2', octave: 5, octaveRelative: '+1', isShift: true },
  'shift+c': { pcKey: 'shift+c', displayKey: 'Shift+C', rowType: 'natural', rowLabel: 'Oitava +2 (Superagudo)', targetNoteId: 'C6', solfege: 'Dó +2', letter: 'C6', abcNumber: '3', accidental: 'natural', valves: '0', octave: 6, octaveRelative: '+2', isShift: true },
  'shift+d': { pcKey: 'shift+d', displayKey: 'Shift+D', rowType: 'natural', rowLabel: 'Oitava +2 (Superagudo)', targetNoteId: 'D6', solfege: 'Ré +2', letter: 'D6', abcNumber: '4', accidental: 'natural', valves: '1', octave: 6, octaveRelative: '+2', isShift: true },
  'shift+e': { pcKey: 'shift+e', displayKey: 'Shift+E', rowType: 'natural', rowLabel: 'Oitava +2 (Superagudo)', targetNoteId: 'E6', solfege: 'Mi +2', letter: 'E6', abcNumber: '5', accidental: 'natural', valves: '0', octave: 6, octaveRelative: '+2', isShift: true },

  // Linha ASDFG com Shift para Oitava +2 (Superagudo C6 a E6):
  'shift+k': { pcKey: 'shift+k', displayKey: 'Shift+K', rowType: 'natural', rowLabel: 'Oitava +2 (Superagudo)', targetNoteId: 'C6', solfege: 'Dó +2', letter: 'C6', abcNumber: '3', accidental: 'natural', valves: '0', octave: 6, octaveRelative: '+2', isShift: true },
  'shift+l': { pcKey: 'shift+l', displayKey: 'Shift+L', rowType: 'natural', rowLabel: 'Oitava +2 (Superagudo)', targetNoteId: 'D6', solfege: 'Ré +2', letter: 'D6', abcNumber: '4', accidental: 'natural', valves: '1', octave: 6, octaveRelative: '+2', isShift: true },
  'shift+ç': { pcKey: 'shift+ç', displayKey: 'Shift+Ç', rowType: 'natural', rowLabel: 'Oitava +2 (Superagudo)', targetNoteId: 'E6', solfege: 'Mi +2', letter: 'E6', abcNumber: '5', accidental: 'natural', valves: '0', octave: 6, octaveRelative: '+2', isShift: true },

  // Sustenidos (#) com SHIFT ("e o mesmo para # sustenido"):
  'shift+q': { pcKey: 'shift+q', displayKey: 'Shift+Q', rowType: 'sharp', rowLabel: 'Oitava +2 (Sustenidos)', targetNoteId: 'C#6', solfege: 'Dó♯ +2', letter: 'C#6', abcNumber: '3#', accidental: 'sharp', valves: '1-2', octave: 6, octaveRelative: '+2', isShift: true },
  'shift+w': { pcKey: 'shift+w', displayKey: 'Shift+W', rowType: 'sharp', rowLabel: 'Oitava +2 (Sustenidos)', targetNoteId: 'D#6', solfege: 'Ré♯ +2', letter: 'D#6', abcNumber: '4#', accidental: 'sharp', valves: '2', octave: 6, octaveRelative: '+2', isShift: true },
  'shift+i': { pcKey: 'shift+i', displayKey: 'Shift+I', rowType: 'sharp', rowLabel: 'Oitava +2 (Sustenidos)', targetNoteId: 'F#6', solfege: 'Fá♯ +2', letter: 'F#6', abcNumber: '6#', accidental: 'sharp', valves: '2', octave: 6, octaveRelative: '+2', isShift: true },
  'shift+o': { pcKey: 'shift+o', displayKey: 'Shift+O', rowType: 'sharp', rowLabel: 'Oitava +2 (Sustenidos)', targetNoteId: 'G#6', solfege: 'Sol♯ +2', letter: 'G#6', abcNumber: '7#', accidental: 'sharp', valves: '2-3', octave: 6, octaveRelative: '+2', isShift: true },
  'shift+p': { pcKey: 'shift+p', displayKey: 'Shift+P', rowType: 'sharp', rowLabel: 'Oitava +2 (Sustenidos)', targetNoteId: 'Bb6', solfege: 'Lá♯ +2', letter: 'A#6', abcNumber: '1#', accidental: 'sharp', valves: '1', octave: 6, octaveRelative: '+2', isShift: true },

  // Oitava +3 Sustenidos e Extremos (Shift + Y, U, etc.):
  'shift+y': { pcKey: 'shift+y', displayKey: 'Shift+Y', rowType: 'sharp', rowLabel: 'Oitava +3 (Ultra-Agudo)', targetNoteId: 'C#7', solfege: 'Dó♯ +3', letter: 'C#7', abcNumber: '3#', accidental: 'sharp', valves: '1-2', octave: 7, octaveRelative: '+3', isShift: true },
  'shift+u': { pcKey: 'shift+u', displayKey: 'Shift+U', rowType: 'sharp', rowLabel: 'Oitava +3 (Ultra-Agudo)', targetNoteId: 'D#7', solfege: 'Ré♯ +3', letter: 'D#7', abcNumber: '4#', accidental: 'sharp', valves: '2', octave: 7, octaveRelative: '+3', isShift: true },

  // Teclas numéricas com Shift para notas do Superagudo (+2 / +3):
  'shift+1': { pcKey: 'shift+1', displayKey: 'Shift+1', rowType: 'natural', rowLabel: 'Oitava +2 (Superagudo)', targetNoteId: 'F6', solfege: 'Fá +2', letter: 'F6', abcNumber: '6', accidental: 'natural', valves: '1', octave: 6, octaveRelative: '+2', isShift: true },
  'shift+2': { pcKey: 'shift+2', displayKey: 'Shift+2', rowType: 'natural', rowLabel: 'Oitava +2 (Superagudo)', targetNoteId: 'G6', solfege: 'Sol +2', letter: 'G6', abcNumber: '7', accidental: 'natural', valves: '0', octave: 6, octaveRelative: '+2', isShift: true },
  'shift+3': { pcKey: 'shift+3', displayKey: 'Shift+3', rowType: 'natural', rowLabel: 'Oitava +2 (Superagudo)', targetNoteId: 'A6', solfege: 'Lá +2', letter: 'A6', abcNumber: '1', accidental: 'natural', valves: '1-2', octave: 6, octaveRelative: '+2', isShift: true },
  'shift+4': { pcKey: 'shift+4', displayKey: 'Shift+4', rowType: 'natural', rowLabel: 'Oitava +2 (Superagudo)', targetNoteId: 'B6', solfege: 'Si +2', letter: 'B6', abcNumber: '2', accidental: 'natural', valves: '2', octave: 6, octaveRelative: '+2', isShift: true },
  'shift+5': { pcKey: 'shift+5', displayKey: 'Shift+5', rowType: 'natural', rowLabel: 'Oitava +3 (Ultra-Agudo)', targetNoteId: 'C7', solfege: 'Dó +3', letter: 'C7', abcNumber: '3', accidental: 'natural', valves: '0', octave: 7, octaveRelative: '+3', isShift: true },
  'shift+6': { pcKey: 'shift+6', displayKey: 'Shift+6', rowType: 'natural', rowLabel: 'Oitava +3 (Ultra-Agudo)', targetNoteId: 'D7', solfege: 'Ré +3', letter: 'D7', abcNumber: '4', accidental: 'natural', valves: '1', octave: 7, octaveRelative: '+3', isShift: true },
  'shift+7': { pcKey: 'shift+7', displayKey: 'Shift+7', rowType: 'natural', rowLabel: 'Oitava +3 (Ultra-Agudo)', targetNoteId: 'E7', solfege: 'Mi +3', letter: 'E7', abcNumber: '5', accidental: 'natural', valves: '0', octave: 7, octaveRelative: '+3', isShift: true },
  'shift+8': { pcKey: 'shift+8', displayKey: 'Shift+8', rowType: 'natural', rowLabel: 'Oitava +3 (Ultra-Agudo)', targetNoteId: 'F7', solfege: 'Fá +3', letter: 'F7', abcNumber: '6', accidental: 'natural', valves: '1', octave: 7, octaveRelative: '+3', isShift: true },
  'shift+9': { pcKey: 'shift+9', displayKey: 'Shift+9', rowType: 'natural', rowLabel: 'Oitava +3 (Ultra-Agudo)', targetNoteId: 'G7', solfege: 'Sol +3', letter: 'G7', abcNumber: '7', accidental: 'natural', valves: '0', octave: 7, octaveRelative: '+3', isShift: true },
  'shift+0': { pcKey: 'shift+0', displayKey: 'Shift+0', rowType: 'natural', rowLabel: 'Oitava +3 (Ultra-Agudo)', targetNoteId: 'A7', solfege: 'Lá +3', letter: 'A7', abcNumber: '1', accidental: 'natural', valves: '1-2', octave: 7, octaveRelative: '+3', isShift: true },
};

/**
 * Resolve o evento de teclado para a tecla correspondente
 */
export function resolveKeyboardShortcut(e: KeyboardEvent): PianoKeyMapping | null {
  const rawKey = e.key.toLowerCase();

  // 1. Se Shift estiver pressionado
  if (e.shiftKey) {
    const shiftKey = `shift+${rawKey}`;
    if (PC_KEYBOARD_MAPPINGS[shiftKey]) {
      return PC_KEYBOARD_MAPPINGS[shiftKey];
    }
    // Suporte a código da tecla (ex: KeyF -> shift+f)
    if (e.code.startsWith('Key')) {
      const codeKey = `shift+${e.code.replace('Key', '').toLowerCase()}`;
      if (PC_KEYBOARD_MAPPINGS[codeKey]) {
        return PC_KEYBOARD_MAPPINGS[codeKey];
      }
    }
    if (e.code.startsWith('Digit')) {
      const digitKey = `shift+${e.code.replace('Digit', '')}`;
      if (PC_KEYBOARD_MAPPINGS[digitKey]) {
        return PC_KEYBOARD_MAPPINGS[digitKey];
      }
    }
  }

  // 2. Tecla normal sem Shift
  if (PC_KEYBOARD_MAPPINGS[rawKey]) {
    return PC_KEYBOARD_MAPPINGS[rawKey];
  }

  // Fallback por code
  if (e.code.startsWith('Key')) {
    const codeLetter = e.code.replace('Key', '').toLowerCase();
    if (PC_KEYBOARD_MAPPINGS[codeLetter]) {
      return PC_KEYBOARD_MAPPINGS[codeLetter];
    }
  }

  return null;
}

export interface PianoVisualKey {
  noteId: string;
  isBlack: boolean;
  solfege: string;
  letter: string;
  abcNumber: string;
  shortcutSharp?: string;
  shortcutNatural?: string;
  shortcutFlat?: string;
  valves: string;
  octave: number;
  octaveRelative: '-1' | '0' | '+1' | '+2' | '+3';
  freq: number;
  orderInOctave: number; // 0 a 11
}

/**
 * TECLAS DO PIANO DIDÁTICO: ABRANGÊNCIA TOTAL DE DÓ -1 ATÉ SI +3
 * (5 Oitavas completas: C3 a B7 = 60 teclas, 35 brancas e 25 pretas)
 */
export const PIANO_VISUAL_KEYS: PianoVisualKey[] = [
  // =========================================================================
  // OITAVA -1: DÓ -1 ATÉ SI -1 (C3 a B3)
  // =========================================================================
  { noteId: 'C3', isBlack: false, solfege: 'Dó -1', letter: 'C', abcNumber: '3', shortcutNatural: 'Z', valves: '0', octave: 3, octaveRelative: '-1', freq: 116.54, orderInOctave: 0 },
  { noteId: 'C#3', isBlack: true, solfege: 'Dó♯-1 / Ré♭-1', letter: 'C#/Db', abcNumber: '3#/4b', shortcutSharp: '1', valves: '1-2-3', octave: 3, octaveRelative: '-1', freq: 123.47, orderInOctave: 1 },
  { noteId: 'D3', isBlack: false, solfege: 'Ré -1', letter: 'D', abcNumber: '4', shortcutNatural: 'X', valves: '1-3', octave: 3, octaveRelative: '-1', freq: 130.81, orderInOctave: 2 },
  { noteId: 'D#3', isBlack: true, solfege: 'Ré♯-1 / Mi♭-1', letter: 'D#/Eb', abcNumber: '4#/5b', shortcutSharp: '2', valves: '2-3', octave: 3, octaveRelative: '-1', freq: 138.59, orderInOctave: 3 },
  { noteId: 'E3', isBlack: false, solfege: 'Mi -1', letter: 'E', abcNumber: '5', shortcutNatural: 'C', valves: '1-2', octave: 3, octaveRelative: '-1', freq: 146.83, orderInOctave: 4 },
  { noteId: 'F3', isBlack: false, solfege: 'Fá -1', letter: 'F', abcNumber: '6', shortcutNatural: 'V', valves: '1', octave: 3, octaveRelative: '-1', freq: 155.56, orderInOctave: 5 },
  { noteId: 'F#3', isBlack: true, solfege: 'Fá♯-1 / Sol♭-1', letter: 'F#/Gb', abcNumber: '6#/7b', shortcutSharp: '3', valves: '2', octave: 3, octaveRelative: '-1', freq: 164.81, orderInOctave: 6 },
  { noteId: 'G3', isBlack: false, solfege: 'Sol -1', letter: 'G', abcNumber: '7', shortcutNatural: 'B', valves: '0', octave: 3, octaveRelative: '-1', freq: 174.61, orderInOctave: 7 },
  { noteId: 'G#3', isBlack: true, solfege: 'Sol♯-1 / Lá♭-1', letter: 'G#/Ab', abcNumber: '7#/1b', shortcutSharp: '4', valves: '2-3', octave: 3, octaveRelative: '-1', freq: 185.00, orderInOctave: 8 },
  { noteId: 'A3', isBlack: false, solfege: 'Lá -1', letter: 'A', abcNumber: '1', shortcutNatural: 'N', valves: '1-2', octave: 3, octaveRelative: '-1', freq: 196.00, orderInOctave: 9 },
  { noteId: 'Bb3', isBlack: true, solfege: 'Lá♯-1 / Si♭-1', letter: 'A#/Bb', abcNumber: '1#/2b', shortcutSharp: '5', valves: '1', octave: 3, octaveRelative: '-1', freq: 207.65, orderInOctave: 10 },
  { noteId: 'B3', isBlack: false, solfege: 'Si -1', letter: 'B', abcNumber: '2', shortcutNatural: 'M', valves: '2', octave: 3, octaveRelative: '-1', freq: 220.00, orderInOctave: 11 },

  // =========================================================================
  // OITAVA 0: DÓ 0 ATÉ SI 0 (C4 a B4 - CENTRAL)
  // =========================================================================
  { noteId: 'C4', isBlack: false, solfege: 'Dó 0', letter: 'C', abcNumber: '3', shortcutNatural: 'A', valves: '0', octave: 4, octaveRelative: '0', freq: 233.08, orderInOctave: 0 },
  { noteId: 'C#4', isBlack: true, solfege: 'Dó♯ / Ré♭', letter: 'C#/Db', abcNumber: '3#/4b', shortcutSharp: 'Q', valves: '1-2-3', octave: 4, octaveRelative: '0', freq: 246.94, orderInOctave: 1 },
  { noteId: 'D4', isBlack: false, solfege: 'Ré 0', letter: 'D', abcNumber: '4', shortcutNatural: 'S', valves: '1-3', octave: 4, octaveRelative: '0', freq: 261.63, orderInOctave: 2 },
  { noteId: 'D#4', isBlack: true, solfege: 'Ré♯ / Mi♭', letter: 'D#/Eb', abcNumber: '4#/5b', shortcutSharp: 'W', valves: '2-3', octave: 4, octaveRelative: '0', freq: 277.18, orderInOctave: 3 },
  { noteId: 'E4', isBlack: false, solfege: 'Mi 0', letter: 'E', abcNumber: '5', shortcutNatural: 'D', valves: '1-2', octave: 4, octaveRelative: '0', freq: 293.66, orderInOctave: 4 },
  { noteId: 'F4', isBlack: false, solfege: 'Fá 0', letter: 'F', abcNumber: '6', shortcutNatural: 'F', valves: '1', octave: 4, octaveRelative: '0', freq: 311.13, orderInOctave: 5 },
  { noteId: 'F#4', isBlack: true, solfege: 'Fá♯ / Sol♭', letter: 'F#/Gb', abcNumber: '6#/7b', shortcutSharp: 'E', valves: '2', octave: 4, octaveRelative: '0', freq: 329.63, orderInOctave: 6 },
  { noteId: 'G4', isBlack: false, solfege: 'Sol 0', letter: 'G', abcNumber: '7', shortcutNatural: 'G', valves: '0', octave: 4, octaveRelative: '0', freq: 349.23, orderInOctave: 7 },
  { noteId: 'G#4', isBlack: true, solfege: 'Sol♯ / Lá♭', letter: 'G#/Ab', abcNumber: '7#/1b', shortcutSharp: 'R', valves: '2-3', octave: 4, octaveRelative: '0', freq: 369.99, orderInOctave: 8 },
  { noteId: 'A4', isBlack: false, solfege: 'Lá 0', letter: 'A', abcNumber: '1', shortcutNatural: 'H', valves: '1-2', octave: 4, octaveRelative: '0', freq: 392.00, orderInOctave: 9 },
  { noteId: 'Bb4', isBlack: true, solfege: 'Lá♯ / Si♭', letter: 'A#/Bb', abcNumber: '1#/2b', shortcutSharp: 'T', valves: '1', octave: 4, octaveRelative: '0', freq: 415.30, orderInOctave: 10 },
  { noteId: 'B4', isBlack: false, solfege: 'Si 0', letter: 'B', abcNumber: '2', shortcutNatural: 'J', valves: '2', octave: 4, octaveRelative: '0', freq: 440.00, orderInOctave: 11 },

  // =========================================================================
  // OITAVA +1: DÓ +1 ATÉ SI +1 (C5 a B5 - AGUDO / 8va)
  // =========================================================================
  { noteId: 'C5', isBlack: false, solfege: 'Dó +1', letter: 'C', abcNumber: '3', shortcutNatural: 'K', valves: '0', octave: 5, octaveRelative: '+1', freq: 466.16, orderInOctave: 0 },
  { noteId: 'C#5', isBlack: true, solfege: 'Dó♯ +1', letter: 'C#/Db', abcNumber: '3#/4b', shortcutSharp: 'Y', valves: '12', octave: 5, octaveRelative: '+1', freq: 493.88, orderInOctave: 1 },
  { noteId: 'D5', isBlack: false, solfege: 'Ré +1', letter: 'D', abcNumber: '4', shortcutNatural: 'L', valves: '1', octave: 5, octaveRelative: '+1', freq: 523.25, orderInOctave: 2 },
  { noteId: 'D#5', isBlack: true, solfege: 'Ré♯ +1', letter: 'D#/Eb', abcNumber: '4#/5b', shortcutSharp: 'U', valves: '2', octave: 5, octaveRelative: '+1', freq: 554.37, orderInOctave: 3 },
  { noteId: 'E5', isBlack: false, solfege: 'Mi +1', letter: 'E', abcNumber: '5', shortcutNatural: 'Ç', valves: '0', octave: 5, octaveRelative: '+1', freq: 587.33, orderInOctave: 4 },
  { noteId: 'F5', isBlack: false, solfege: 'Fá +1', letter: 'F', abcNumber: '6', shortcutNatural: '⇧F', valves: '1', octave: 5, octaveRelative: '+1', freq: 622.25, orderInOctave: 5 },
  { noteId: 'F#5', isBlack: true, solfege: 'Fá♯ +1', letter: 'F#/Gb', abcNumber: '6#/7b', shortcutSharp: 'I', valves: '2', octave: 5, octaveRelative: '+1', freq: 659.26, orderInOctave: 6 },
  { noteId: 'G5', isBlack: false, solfege: 'Sol +1', letter: 'G', abcNumber: '7', shortcutNatural: '⇧G', valves: '0', octave: 5, octaveRelative: '+1', freq: 698.46, orderInOctave: 7 },
  { noteId: 'G#5', isBlack: true, solfege: 'Sol♯ +1', letter: 'G#/Ab', abcNumber: '7#/1b', shortcutSharp: 'O', valves: '23', octave: 5, octaveRelative: '+1', freq: 739.99, orderInOctave: 8 },
  { noteId: 'A5', isBlack: false, solfege: 'Lá +1', letter: 'A', abcNumber: '1', shortcutNatural: '⇧H', valves: '12', octave: 5, octaveRelative: '+1', freq: 783.99, orderInOctave: 9 },
  { noteId: 'Bb5', isBlack: true, solfege: 'Lá♯ +1 / Si♭ +1', letter: 'A#/Bb', abcNumber: '1#/2b', shortcutSharp: 'P', valves: '1', octave: 5, octaveRelative: '+1', freq: 830.61, orderInOctave: 10 },
  { noteId: 'B5', isBlack: false, solfege: 'Si +1', letter: 'B', abcNumber: '2', shortcutNatural: '⇧J', valves: '2', octave: 5, octaveRelative: '+1', freq: 880.00, orderInOctave: 11 },

  // =========================================================================
  // OITAVA +2: DÓ +2 ATÉ SI +2 (C6 a B6 - SUPERAGUDO / 16va)
  // =========================================================================
  { noteId: 'C6', isBlack: false, solfege: 'Dó +2', letter: 'C', abcNumber: '3', shortcutNatural: '⇧K', valves: '0', octave: 6, octaveRelative: '+2', freq: 932.33, orderInOctave: 0 },
  { noteId: 'C#6', isBlack: true, solfege: 'Dó♯ +2', letter: 'C#/Db', abcNumber: '3#/4b', shortcutSharp: '⇧Q', valves: '12', octave: 6, octaveRelative: '+2', freq: 987.77, orderInOctave: 1 },
  { noteId: 'D6', isBlack: false, solfege: 'Ré +2', letter: 'D', abcNumber: '4', shortcutNatural: '⇧L', valves: '1', octave: 6, octaveRelative: '+2', freq: 1046.50, orderInOctave: 2 },
  { noteId: 'D#6', isBlack: true, solfege: 'Ré♯ +2', letter: 'D#/Eb', abcNumber: '4#/5b', shortcutSharp: '⇧W', valves: '2', octave: 6, octaveRelative: '+2', freq: 1108.73, orderInOctave: 3 },
  { noteId: 'E6', isBlack: false, solfege: 'Mi +2', letter: 'E', abcNumber: '5', shortcutNatural: '⇧Ç', valves: '0', octave: 6, octaveRelative: '+2', freq: 1174.66, orderInOctave: 4 },
  { noteId: 'F6', isBlack: false, solfege: 'Fá +2', letter: 'F', abcNumber: '6', shortcutNatural: '⇧1', valves: '1', octave: 6, octaveRelative: '+2', freq: 1244.51, orderInOctave: 5 },
  { noteId: 'F#6', isBlack: true, solfege: 'Fá♯ +2', letter: 'F#/Gb', abcNumber: '6#/7b', shortcutSharp: '⇧I', valves: '2', octave: 6, octaveRelative: '+2', freq: 1318.51, orderInOctave: 6 },
  { noteId: 'G6', isBlack: false, solfege: 'Sol +2', letter: 'G', abcNumber: '7', shortcutNatural: '⇧2', valves: '0', octave: 6, octaveRelative: '+2', freq: 1396.91, orderInOctave: 7 },
  { noteId: 'G#6', isBlack: true, solfege: 'Sol♯ +2', letter: 'G#/Ab', abcNumber: '7#/1b', shortcutSharp: '⇧O', valves: '23', octave: 6, octaveRelative: '+2', freq: 1479.98, orderInOctave: 8 },
  { noteId: 'A6', isBlack: false, solfege: 'Lá +2', letter: 'A', abcNumber: '1', shortcutNatural: '⇧3', valves: '12', octave: 6, octaveRelative: '+2', freq: 1567.98, orderInOctave: 9 },
  { noteId: 'Bb6', isBlack: true, solfege: 'Lá♯ +2 / Si♭ +2', letter: 'A#/Bb', abcNumber: '1#/2b', shortcutSharp: '⇧P', valves: '1', octave: 6, octaveRelative: '+2', freq: 1661.22, orderInOctave: 10 },
  { noteId: 'B6', isBlack: false, solfege: 'Si +2', letter: 'B', abcNumber: '2', shortcutNatural: '⇧4', valves: '2', octave: 6, octaveRelative: '+2', freq: 1760.00, orderInOctave: 11 },

  // =========================================================================
  // OITAVA +3: DÓ +3 ATÉ SI +3 (C7 a B7 - ULTRA-AGUDO / 24va)
  // =========================================================================
  { noteId: 'C7', isBlack: false, solfege: 'Dó +3', letter: 'C', abcNumber: '3', shortcutNatural: '⇧5', valves: '0', octave: 7, octaveRelative: '+3', freq: 1864.66, orderInOctave: 0 },
  { noteId: 'C#7', isBlack: true, solfege: 'Dó♯ +3', letter: 'C#/Db', abcNumber: '3#/4b', shortcutSharp: '⇧Y', valves: '12', octave: 7, octaveRelative: '+3', freq: 1975.53, orderInOctave: 1 },
  { noteId: 'D7', isBlack: false, solfege: 'Ré +3', letter: 'D', abcNumber: '4', shortcutNatural: '⇧6', valves: '1', octave: 7, octaveRelative: '+3', freq: 2093.00, orderInOctave: 2 },
  { noteId: 'D#7', isBlack: true, solfege: 'Ré♯ +3', letter: 'D#/Eb', abcNumber: '4#/5b', shortcutSharp: '⇧U', valves: '2', octave: 7, octaveRelative: '+3', freq: 2217.46, orderInOctave: 3 },
  { noteId: 'E7', isBlack: false, solfege: 'Mi +3', letter: 'E', abcNumber: '5', shortcutNatural: '⇧7', valves: '0', octave: 7, octaveRelative: '+3', freq: 2349.32, orderInOctave: 4 },
  { noteId: 'F7', isBlack: false, solfege: 'Fá +3', letter: 'F', abcNumber: '6', shortcutNatural: '⇧8', valves: '1', octave: 7, octaveRelative: '+3', freq: 2489.02, orderInOctave: 5 },
  { noteId: 'F#7', isBlack: true, solfege: 'Fá♯ +3', letter: 'F#/Gb', abcNumber: '6#/7b', shortcutSharp: 'F#7', valves: '2', octave: 7, octaveRelative: '+3', freq: 2637.02, orderInOctave: 6 },
  { noteId: 'G7', isBlack: false, solfege: 'Sol +3', letter: 'G', abcNumber: '7', shortcutNatural: '⇧9', valves: '0', octave: 7, octaveRelative: '+3', freq: 2793.83, orderInOctave: 7 },
  { noteId: 'G#7', isBlack: true, solfege: 'Sol♯ +3', letter: 'G#/Ab', abcNumber: '7#/1b', shortcutSharp: 'G#7', valves: '23', octave: 7, octaveRelative: '+3', freq: 2959.96, orderInOctave: 8 },
  { noteId: 'A7', isBlack: false, solfege: 'Lá +3', letter: 'A', abcNumber: '1', shortcutNatural: '⇧0', valves: '12', octave: 7, octaveRelative: '+3', freq: 3135.96, orderInOctave: 9 },
  { noteId: 'Bb7', isBlack: true, solfege: 'Lá♯ +3 / Si♭ +3', letter: 'A#/Bb', abcNumber: '1#/2b', shortcutSharp: 'Bb7', valves: '1', octave: 7, octaveRelative: '+3', freq: 3322.44, orderInOctave: 10 },
  { noteId: 'B7', isBlack: false, solfege: 'Si +3', letter: 'B', abcNumber: '2', shortcutNatural: 'Si+3', valves: '2', octave: 7, octaveRelative: '+3', freq: 3520.00, orderInOctave: 11 },
];

export interface HarmonyChord {
  id: string;
  name: string;
  type: string;
  rootSolfege: string;
  abcFormula: string;
  noteIds: string[];
  description: string;
}

/**
 * Acordes fundamentais para estudo de Harmonia e Afinação com Trompete
 */
export const HARMONY_CHORDS: HarmonyChord[] = [
  {
    id: 'chord-c-maj',
    name: 'Dó Maior (C)',
    type: 'Maior',
    rootSolfege: 'Dó',
    abcFormula: '[3] + [5] + [7]',
    noteIds: ['C4', 'E4', 'G4'],
    description: 'Tríade brilhante e consonante. Afine o Dó [3] fundamental e a Quinta Sol [7].',
  },
  {
    id: 'chord-d-min',
    name: 'Ré Menor (Dm)',
    type: 'Menor',
    rootSolfege: 'Ré',
    abcFormula: '[4] + [6] + [1]',
    noteIds: ['D4', 'F4', 'A4'],
    description: 'Som nostálgico e expressivo. Excelente para estudos melancólicos e lentos.',
  },
  {
    id: 'chord-e-min',
    name: 'Mi Menor (Em)',
    type: 'Menor',
    rootSolfege: 'Mi',
    abcFormula: '[5] + [7] + [2]',
    noteIds: ['E4', 'G4', 'B4'],
    description: 'Acorde com textura aveludada. Pratique afinar a terça menor (Sol [7]).',
  },
  {
    id: 'chord-f-maj',
    name: 'Fá Maior (F)',
    type: 'Maior',
    rootSolfege: 'Fá',
    abcFormula: '[6] + [1] + [3]',
    noteIds: ['F4', 'A4', 'C5'],
    description: 'Subdominante clássico. Proporciona sensação de abertura harmônica.',
  },
  {
    id: 'chord-g-maj',
    name: 'Sol Maior (G)',
    type: 'Maior',
    rootSolfege: 'Sol',
    abcFormula: '[7] + [2] + [4]',
    noteIds: ['G4', 'B4', 'D5'],
    description: 'Dominante principal! Tensão harmônica que resolve com força no Dó Maior.',
  },
  {
    id: 'chord-a-min',
    name: 'Lá Menor (Am)',
    type: 'Menor',
    rootSolfege: 'Lá',
    abcFormula: '[1] + [3] + [5]',
    noteIds: ['A4', 'C5', 'E5'],
    description: 'Relativa menor natural. Nota 1 (Lá) como tônica de repouso.',
  },
  {
    id: 'chord-bb-maj',
    name: 'Si♭ Maior (Bb)',
    type: 'Maior',
    rootSolfege: 'Si♭',
    abcFormula: '[2b] + [4] + [6]',
    noteIds: ['Bb4', 'D5', 'F5'],
    description: 'Tonalidade nativa do trompete em Si♭! Ressonância acústica máxima do tubo aberto.',
  },
  {
    id: 'chord-g-7',
    name: 'Sol com Sétima (G7)',
    type: 'Dominante',
    rootSolfege: 'Sol',
    abcFormula: '[7] + [2] + [4] + [6]',
    noteIds: ['G4', 'B4', 'D5', 'F5'],
    description: 'Acorde com trítono gerando atração para a resolução harmônica.',
  },
];

export function findNoteDefinition(noteId: string): NoteDefinition {
  const found = TRUMPET_NOTES.find((n) => n.id === noteId);
  if (found) return found;

  // Fallback seguro se não encontrado diretamente
  return TRUMPET_NOTES[12] || TRUMPET_NOTES[0];
}
