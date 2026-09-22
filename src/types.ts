/**
 * Tipos e Definições para o Ensino Musical e Afinação de Trompete
 * Sistema ABC (A=Lá=1) e Escala Cromática
 */

export interface NoteDefinition {
  id: string;                // e.g. "A4", "C4"
  letter: string;            // Cifra clássica: "A", "B", "C", "D", "E", "F", "G", com # ou b
  solfege: string;           // Nome cantado: "Lá", "Si", "Dó", "Ré", "Mi", "Fá", "Sol"
  numberNotation: string;    // Sistema solicitado: A=1, B=2, C=3, D=4, E=5, F=6, G=7 (ex: "1", "3#", "4b")
  semitoneIndex: number;     // 0 a 11 (0=A/1, 1=A#/1#, 2=B/2, 3=C/3, 4=C#/3#, 5=D/4, 6=D#/4#, 7=E/5, 8=F/6, 9=F#/6#, 10=G/7, 11=G#/7#)
  octave: number;            // Ex: 3, 4, 5
  frequency: number;         // Frequência padrão A4=440Hz (em Hz)
  valvesBb: [boolean, boolean, boolean]; // Pistões 1, 2, 3 (Pistão 1 = mais perto da boca)
  valvesAlternative?: [boolean, boolean, boolean];
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  description?: string;
  fingerDescription: string; // Ex: "Aberto (0)", "1 e 2", "1 e 3"
}

export type TuningState = 'idle' | 'listening' | 'perfect' | 'sharp' | 'flat' | 'too_quiet';

export interface PitchDetectionResult {
  frequency: number;         // Hz
  closestNote: NoteDefinition;
  cents: number;             // -50 a +50 cents
  tuningState: TuningState;
  volume: number;            // 0 a 100 RMS
  clarity: number;           // 0 a 1 probabilidade de pitch
  isStable: boolean;
  stabilityDuration: number; // Segundos que a nota foi mantida com precisão
}

export interface PracticeSessionMetric {
  id: string;
  timestamp: number;
  totalNotesAttempted: number;
  correctNotesCount: number;
  averageAccuracy: number;    // 0 a 100%
  longestHoldSeconds: number; // Maior tempo sustentando nota afinada
  notesMastered: string[];    // IDs de notas afinadas com sucesso
  score: number;
  stars: number;              // 1 a 3
}

export interface LessonStep {
  targetNoteId: string;      // ID da nota requerida (ex: "C4")
  minHoldDuration: number;   // Tempo em segundos para validar a nota (ex: 1.5s)
  guidanceText: string;      // Instrução didática (ex: "Pressione os pistões indicados e sopre suavemente")
}

export type ExerciseLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface ExerciseNote {
  noteId: string;
  duration: number; // Em batidas (ex: 1, 2, 4, 0.5)
  lyricOrTip?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  emailOrId?: string;
  turmaOrSchool?: string;
  avatar: string;
  avatarBg: string;
  currentLevel: ExerciseLevel;
  isTrumpetBb: boolean;
  completedExerciseIds: string[];
  exerciseScores: Record<string, { stars: number; accuracy: number; completedAt: number }>;
  masteredNotes: string[];
  totalNotesAttempted: number;
  correctNotesCount: number;
  longestHoldSeconds: number;
  totalScore: number;
  stars: number;
  practiceMinutes: number;
  streakDays: number;
  lastActiveDate: string;
  createdAt: number;
}

export interface SongExercise {
  id: string;
  title: string;
  difficulty: 'Fácil' | 'Médio' | 'Clássico' | ExerciseLevel;
  level: ExerciseLevel;
  category: string; // Ex: 'Método Da Capo', 'Método Arban', 'Notas Longas'
  methodOrigin?: 'Da Capo' | 'Arban' | 'Fundamentos' | 'Personalizado';
  methodRef?: string; // Ex: 'Da Capo Lição 14', 'Arban Estudo 1'
  description: string;
  notes: ExerciseNote[];
  bpm?: number;
  timeSignature?: string; // ex: '4/4', '3/4'
}

export interface SavedScore {
  id: string;
  title: string;
  author?: string;
  level: ExerciseLevel;
  bpm: number;
  timeSignature: string;
  createdAt: number;
  updatedAt: number;
  notes: ExerciseNote[];
}

export interface MetronomeSettings {
  bpm: number;
  beatsPerMeasure: number; // 2, 3, 4, 6
  subdivision: 1 | 2 | 4;   // 1 = semínima, 2 = colcheia, 4 = semicolcheia
  sound: 'wood' | 'beep' | 'drum';
  volume: number;          // 0 a 100
}
