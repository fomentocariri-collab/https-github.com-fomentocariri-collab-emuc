import React, { useState, useEffect, useRef } from 'react';
import { SongExercise, PitchDetectionResult, NoteDefinition, ExerciseLevel, UserProfile } from '../types';
import { ALL_EXERCISES } from '../data/exerciseLibrary';
import { TRUMPET_NOTES } from '../data/trumpetData';
import { TrumpetValves } from './TrumpetValves';
import { 
  Volume2, Play, CheckCircle2, RotateCcw, Award, Sparkles, Mic, MicOff, 
  HelpCircle, ChevronRight, Music, Filter, ThumbsUp, Radio, BookOpen
} from 'lucide-react';
import { trumpetAudio } from '../utils/audioEngine';
import confetti from 'canvas-confetti';

interface PracticeSongModeProps {
  currentPitch: PitchDetectionResult;
  isListening: boolean;
  onToggleMic: () => void;
  onSessionComplete: (accuracy: number, totalNotes: number, stars: number) => void;
  customExercise?: SongExercise | null;
  currentUser?: UserProfile | null;
  onExerciseCompletedWithUser?: (exerciseId: string, accuracy: number, stars: number, totalNotes: number) => void;
}

export const PracticeSongMode: React.FC<PracticeSongModeProps> = ({
  currentPitch,
  isListening,
  onToggleMic,
  onSessionComplete,
  customExercise,
  currentUser,
  onExerciseCompletedWithUser,
}) => {
  // Lista de exercícios ativos
  const [selectedLevel, setSelectedLevel] = useState<ExerciseLevel | 'Todos'>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  
  // Lista combinada (incluindo exercício customizado se houver)
  const fullExerciseList = React.useMemo(() => {
    if (customExercise) {
      return [customExercise, ...ALL_EXERCISES];
    }
    return ALL_EXERCISES;
  }, [customExercise]);

  // Exercícios filtrados
  const filteredExercises = React.useMemo(() => {
    return fullExerciseList.filter((ex) => {
      const matchLevel = selectedLevel === 'Todos' || ex.level === selectedLevel;
      const matchCat = selectedCategory === 'Todas' || ex.category === selectedCategory;
      return matchLevel && matchCat;
    });
  }, [fullExerciseList, selectedLevel, selectedCategory]);

  // Lista de categorias únicas para o filtro
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    fullExerciseList.forEach((e) => set.add(e.category));
    return ['Todas', ...Array.from(set)];
  }, [fullExerciseList]);

  const [selectedSongIndex, setSelectedSongIndex] = useState(0);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctHitsCount, setCorrectHitsCount] = useState(0);
  const [holdTimer, setHoldTimer] = useState(0);

  // Modo Manual (Permite usar o aplicativo 100% mesmo SEM microfone)
  const [manualMode, setManualMode] = useState<boolean>(!isListening);
  
  // Pistões virtuais para teste no modo manual
  const [interactiveValves, setInteractiveValves] = useState<[boolean, boolean, boolean]>([false, false, false]);

  const currentExercise = filteredExercises[selectedSongIndex] || filteredExercises[0] || ALL_EXERCISES[0];
  const currentStep = currentExercise.notes[currentNoteIndex];
  const targetNote = TRUMPET_NOTES.find((n) => n.id === currentStep?.noteId) || TRUMPET_NOTES[6];

  // Escuta contínua do microfone para validar se a nota tocada é a correta
  const validationRef = useRef<{ noteId: string; startTime: number }>({ noteId: '', startTime: 0 });

  useEffect(() => {
    if (!isListening || manualMode || isCompleted || !targetNote) return;

    const detectedNote = currentPitch.closestNote;
    const isMatching = detectedNote?.id === targetNote.id;
    const isInTune = isMatching && Math.abs(currentPitch.cents) <= 15 && currentPitch.frequency > 0;

    const REQUIRED_HOLD_MS = 1100; // 1.1s sustentando afinado

    if (isInTune) {
      if (validationRef.current.noteId !== targetNote.id) {
        validationRef.current = { noteId: targetNote.id, startTime: performance.now() };
      } else {
        const elapsed = performance.now() - validationRef.current.startTime;
        setHoldTimer(Math.min(100, Math.round((elapsed / REQUIRED_HOLD_MS) * 100)));

        if (elapsed >= REQUIRED_HOLD_MS) {
          advanceToNextNote();
        }
      }
    } else {
      validationRef.current = { noteId: '', startTime: 0 };
      setHoldTimer(0);
    }
  }, [currentPitch, isListening, manualMode, isCompleted, targetNote]);

  const advanceToNextNote = () => {
    setCorrectHitsCount((prev) => prev + 1);
    setHoldTimer(0);
    validationRef.current = { noteId: '', startTime: 0 };

    if (currentNoteIndex + 1 < currentExercise.notes.length) {
      setCurrentNoteIndex((prev) => prev + 1);
    } else {
      // Exercício finalizado!
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }

      const total = currentExercise.notes.length;
      const acc = Math.round(((correctHitsCount + 1) / total) * 100);
      const starsEarned = acc >= 90 ? 3 : acc >= 70 ? 2 : 1;
      onSessionComplete(acc, total, starsEarned);
      if (onExerciseCompletedWithUser && currentExercise?.id) {
        onExerciseCompletedWithUser(currentExercise.id, acc, starsEarned, total);
      }
    }
  };

  const restartSong = () => {
    setCurrentNoteIndex(0);
    setIsCompleted(false);
    setCorrectHitsCount(0);
    setHoldTimer(0);
    validationRef.current = { noteId: '', startTime: 0 };
    setInteractiveValves([false, false, false]);
  };

  const playReferenceTone = () => {
    if (targetNote) {
      trumpetAudio.playTrumpetTone(targetNote, 1.6);
    }
  };

  // No modo manual, o estudante pode simular a nota ou validar ao pressionar
  const handleManualHitNote = () => {
    if (targetNote) {
      trumpetAudio.playTrumpetTone(targetNote, 0.8);
    }
    setHoldTimer(100);
    setTimeout(() => {
      advanceToNextNote();
    }, 250);
  };

  // Alternar pistão virtual 1, 2 ou 3
  const toggleValve = (valveIdx: 0 | 1 | 2) => {
    const updated: [boolean, boolean, boolean] = [...interactiveValves];
    updated[valveIdx] = !updated[valveIdx];
    setInteractiveValves(updated);

    // Checar se a combinação corresponde à nota esperada
    if (
      updated[0] === targetNote.valvesBb[0] &&
      updated[1] === targetNote.valvesBb[1] &&
      updated[2] === targetNote.valvesBb[2]
    ) {
      // Pistões corretos! Toca a nota
      trumpetAudio.playTrumpetTone(targetNote, 1.0);
    }
  };

  return (
    <div id="practice-song-mode-root" className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 sm:p-7 max-w-4xl mx-auto w-full space-y-6">
      {/* Cabeçalho e Controles de Modo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Treino Prático • {currentExercise.level}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {filteredExercises.length} exercícios disponíveis
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {currentExercise.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{currentExercise.description}</p>
        </div>

        {/* Alternador de Modo: Microfone vs Manual */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-practice-mode-btn"
            onClick={() => setManualMode(!manualMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              manualMode
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            {manualMode ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{manualMode ? 'Modo Manual (Sem Mic)' : 'Modo Microfone'}</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros de Nível e Categoria */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          {/* Nível */}
          <div className="sm:col-span-5 flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-500 mr-1">Módulo:</span>
            {[
              { id: 'Todos', label: 'Todos' },
              { id: 'Iniciante', label: 'Iniciante (1-7)' },
              { id: 'Intermediário', label: 'Intermediário (Da Capo)' },
              { id: 'Avançado', label: 'Avançado (Arban)' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => {
                  setSelectedLevel(lvl.id as ExerciseLevel | 'Todos');
                  setSelectedSongIndex(0);
                  setCurrentNoteIndex(0);
                  setIsCompleted(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  selectedLevel === lvl.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* Categoria */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <span className="font-bold text-slate-500">Tema:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSongIndex(0);
                setCurrentNoteIndex(0);
                setIsCompleted(false);
              }}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Seletor do Exercício Específico */}
          <div className="sm:col-span-4 flex items-center gap-2">
            <span className="font-bold text-slate-500">Exercício:</span>
            <select
              value={selectedSongIndex}
              onChange={(e) => {
                setSelectedSongIndex(Number(e.target.value));
                setCurrentNoteIndex(0);
                setIsCompleted(false);
                setHoldTimer(0);
              }}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-800 focus:outline-none truncate"
            >
              {filteredExercises.map((s, idx) => {
                const isDone = currentUser?.completedExerciseIds?.includes(s.id);
                const score = currentUser?.exerciseScores?.[s.id];
                const mark = isDone ? `[✓ ${score ? '★'.repeat(score.stars) : 'Feito'}] ` : '';
                return (
                  <option key={s.id} value={idx}>
                    {mark}{s.title}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Banner Pedagógico do Método */}
        {currentExercise.level === 'Intermediário' && (
          <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/90 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                DC
              </span>
              <div>
                <span className="font-black text-amber-950 block">
                  Módulo Intermediário: Método Da Capo (Joel Barbosa)
                </span>
                <span className="text-amber-800 text-[11px]">
                  Foco em fraseado musical, ligaduras, respiração diafragmática, afinação harmônica e forma Da Capo (D.C. al Fine).
                </span>
              </div>
            </div>
            {currentExercise.methodRef && (
              <span className="text-[10px] bg-amber-200/90 text-amber-900 font-bold px-2 py-0.5 rounded-full shrink-0">
                {currentExercise.methodRef}
              </span>
            )}
          </div>
        )}

        {currentExercise.level === 'Avançado' && (
          <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/90 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-900 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                AR
              </span>
              <div>
                <span className="font-black text-emerald-950 block">
                  Módulo Avançado: Grande Método Completo Arban (J.B. Arban)
                </span>
                <span className="text-emerald-800 text-[11px]">
                  A Bíblia do Trompete: articulação precisa com a sílaba "TU", flexibilidade labial sem pressão, escalas cromáticas e virtuosidade.
                </span>
              </div>
            </div>
            {currentExercise.methodRef && (
              <span className="text-[10px] bg-emerald-200/90 text-emerald-900 font-bold px-2 py-0.5 rounded-full shrink-0">
                {currentExercise.methodRef}
              </span>
            )}
          </div>
        )}
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Barra de Progresso da Canção */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600">
              <span>Nota {currentNoteIndex + 1} de {currentExercise.notes.length}</span>
              <span className="text-amber-700">
                {Math.round(((currentNoteIndex) / currentExercise.notes.length) * 100)}% concluído
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${((currentNoteIndex) / currentExercise.notes.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Fita Horizontal de Notas do Exercício */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {currentExercise.notes.map((step, idx) => {
              const n = TRUMPET_NOTES.find((item) => item.id === step.noteId) || TRUMPET_NOTES[6];
              const isCurrent = idx === currentNoteIndex;
              const isPast = idx < currentNoteIndex;

              return (
                <div
                  key={idx}
                  className={`shrink-0 w-20 sm:w-24 p-2.5 rounded-2xl border-2 text-center transition-all ${
                    isCurrent
                      ? 'bg-amber-100 border-amber-500 shadow-md scale-105 ring-2 ring-amber-400'
                      : isPast
                      ? 'bg-emerald-50 border-emerald-300 opacity-80'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-slate-500 block truncate">
                    {step.lyricOrTip?.split(' ')[0] || `Nota ${idx + 1}`}
                  </span>
                  <div className="text-2xl font-black font-mono text-slate-900 my-0.5">
                    {n.letter}
                  </div>
                  <div className="text-xs font-bold text-amber-800">
                    {n.solfege} [{n.numberNotation}]
                  </div>
                  {isPast && (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center justify-center gap-0.5 mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Acertou
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Card Central da Nota Atual */}
          <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 rounded-3xl p-6 border-2 border-amber-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-black mb-2">
                <span>Toque agora no Trompete</span>
              </div>

              <div className="flex items-baseline gap-3 my-1">
                <span className="text-5xl sm:text-6xl font-black font-mono text-slate-900">
                  {targetNote.letter}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-700">
                  {targetNote.solfege}
                </span>
                <span className="px-3 py-1 bg-amber-600 text-white rounded-xl text-lg font-black shadow-sm">
                  Nota {targetNote.numberNotation}
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-700 mt-2">
                {currentStep.lyricOrTip || `Sopre a nota ${targetNote.solfege} de forma limpa e contínua.`}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Pistões Recomendados: <strong className="text-amber-900 font-bold">{targetNote.fingerDescription}</strong>
              </p>

              {/* Botões de Ação Imediata */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={playReferenceTone}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Ouvir Exemplo</span>
                </button>

                {manualMode ? (
                  <button
                    id="manual-validate-note-btn"
                    type="button"
                    onClick={handleManualHitNote}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Toquei / Validar Nota (Manual)</span>
                  </button>
                ) : (
                  !isListening && (
                    <button
                      type="button"
                      onClick={onToggleMic}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Ligar Microfone</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Visual dos Pistões do Trompete */}
            <div className="flex flex-col items-center">
              <TrumpetValves 
                valves={targetNote.valvesBb} 
                size="sm" 
                noteLabel={`${targetNote.solfege} (${targetNote.letter}=${targetNote.numberNotation})`} 
              />
            </div>
          </div>

          {/* Seção Interativa para Prática SEM Microfone (Pistões Virtuais Clicáveis) */}
          {manualMode && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-amber-600" />
                  Prática Manual Interativa
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Clique nos pistões abaixo para simular a digitação ou clique em "Validar Nota" para avançar:
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3].map((valNum) => {
                  const idx = (valNum - 1) as 0 | 1 | 2;
                  const isPressed = interactiveValves[idx];
                  const shouldBePressed = targetNote.valvesBb[idx];

                  return (
                    <button
                      key={valNum}
                      type="button"
                      onClick={() => toggleValve(idx)}
                      className={`w-11 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-xs transition-all border shadow-sm ${
                        isPressed
                          ? shouldBePressed
                            ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-emerald-500/30'
                            : 'bg-amber-600 text-white border-amber-700 scale-105'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span>Pistão</span>
                      <span className="text-sm font-black">{valNum}</span>
                    </button>
                  );
                })}

                <button
                  onClick={handleManualHitNote}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  Avançar →
                </button>
              </div>
            </div>
          )}

          {/* Feedback em Tempo Real do Microfone (quando em modo mic) */}
          {!manualMode && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-800">
                    {isListening
                      ? currentPitch.closestNote?.id === targetNote.id
                        ? Math.abs(currentPitch.cents) <= 15
                          ? 'Afinação perfeita! Segure a nota firme...'
                          : currentPitch.cents < 0
                          ? 'Nota correta, mas está BAIXA (Bemol ♭). Aumente o ar!'
                          : 'Nota correta, mas está ALTA (Sustenido ♯). Relaxe a boca!'
                        : 'Ouvindo o microfone... Toque a nota solicitada!'
                      : 'Ative o microfone ou use o Modo Manual para avançar.'}
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    Detectado: <strong>{currentPitch.closestNote?.solfege || '--'} ({currentPitch.closestNote?.letter || '--'}={currentPitch.closestNote?.numberNotation || '--'})</strong> • {currentPitch.frequency > 0 ? `${currentPitch.frequency}Hz` : 'Silêncio'}
                  </p>
                </div>
              </div>

              {/* Barra de Sustentação de Sucesso */}
              <div className="w-full sm:w-48 flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>Validação</span>
                  <span className="text-amber-800">{holdTimer}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-100"
                    style={{ width: `${holdTimer}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* TELA DE CONCLUSÃO */
        <div className="text-center py-8 px-4 space-y-5">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            Parabéns! Exercício Concluído! 🎉
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Você completou <strong>"{currentExercise.title}"</strong> ({currentExercise.level}) praticando com as cifras ABC (A=1 a G=7) e posições de pistões!
          </p>

          <div className="inline-flex flex-col items-center gap-1.5 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 font-bold text-sm">
            <span className="text-base font-black">⭐⭐⭐ Exercício Registrado!</span>
            {currentUser && (
              <span className="text-xs text-stone-600 font-medium">
                Progresso e pontuação salvos no perfil de <strong className="text-stone-900">{currentUser.name}</strong>.
              </span>
            )}
            {currentExercise.level === 'Intermediário' && (
              <span className="text-[11px] text-amber-800 font-bold bg-amber-100/90 px-2 py-0.5 rounded-full">
                Método Da Capo • Lição Validada!
              </span>
            )}
            {currentExercise.level === 'Avançado' && (
              <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100/90 px-2 py-0.5 rounded-full">
                Método Arban • Estudo Virtuoso Validado!
              </span>
            )}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={restartSong}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tocar Novamente</span>
            </button>

            {selectedSongIndex + 1 < filteredExercises.length && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSongIndex((prev) => prev + 1);
                  restartSong();
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Próximo Exercício</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

