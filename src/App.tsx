import React, { useState, useEffect, useCallback } from 'react';
import { NoteDefinition, PitchDetectionResult, PracticeSessionMetric, SongExercise, UserProfile } from './types';
import { TRUMPET_NOTES } from './data/trumpetData';
import { trumpetAudio } from './utils/audioEngine';
import { userStorage } from './utils/userStorage';
import { TunerGauge } from './components/TunerGauge';
import { TrumpetValves } from './components/TrumpetValves';
import { AbcChromaticChart } from './components/AbcChromaticChart';
import { PracticeSongMode } from './components/PracticeSongMode';
import { StudentMetrics } from './components/StudentMetrics';
import { Metronome } from './components/Metronome';
import { ScoreEditor } from './components/ScoreEditor';
import { StudentAuthModal } from './components/StudentAuthModal';
import { PianoKeyboardPanel } from './components/PianoKeyboardPanel';
import { TrumpetKeyboardPanel } from './components/TrumpetKeyboardPanel';
import { MusicTheoryView } from './components/MusicTheoryView';
import { PianoHarmonyView } from './components/PianoHarmonyView';
import { PianoExercisesView } from './components/PianoExercisesView';
import { SidebarNav, AppModule } from './components/SidebarNav';
import {
  Volume2,
  Mic,
  MicOff,
  Music,
  BookOpen,
  PlayCircle,
  BarChart3,
  Sparkles,
  AlertCircle,
  Sliders,
  Edit3,
  Clock,
  User,
  ShieldCheck,
  Award,
  Keyboard,
  GraduationCap,
  Menu,
} from 'lucide-react';

export default function App() {
  // Perfil do Estudante & Login
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return userStorage.getActiveUser();
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    return !userStorage.getActiveUser();
  });

  // Estado do microfone e motor de áudio
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  // Resultado da detecção em tempo real
  const [pitch, setPitch] = useState<PitchDetectionResult>({
    frequency: 0,
    closestNote: TRUMPET_NOTES[6], // Dó central (C4)
    cents: 0,
    tuningState: 'too_quiet',
    volume: 0,
    clarity: 0,
    isStable: false,
    stabilityDuration: 0,
  });

  // Nota alvo selecionada para estudo
  const [targetNote, setTargetNote] = useState<NoteDefinition>(TRUMPET_NOTES[6]);

  // Transposição: Trompete em Si♭ (padrão de trompetistas) vs Som Real / Piano
  const [isTrumpetBbMode, setIsTrumpetBbMode] = useState<boolean>(true);

  // Módulo Ativo: Trompete vs Piano
  const [activeModule, setActiveModule] = useState<AppModule>('trompete');

  // Navegação por abas com suporte aos prefixos t_ e p_
  const [currentTab, setCurrentTab] = useState<string>('t_afinador');

  // Estado da barra lateral no celular
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Exercício customizado gerado no editor para praticar
  const [customExerciseToPractice, setCustomExerciseToPractice] = useState<SongExercise | null>(null);

  // Mostrar mini metrônomo flutuante persistente durante os estudos
  const [showFloatingMetronome, setShowFloatingMetronome] = useState<boolean>(false);

  // Mostrar painel de teclado de trompete com atalhos PC
  const [showFloatingTrumpet, setShowFloatingTrumpet] = useState<boolean>(false);

  // Mostrar painel de teclado de piano flutuante rápido
  const [showFloatingPiano, setShowFloatingPiano] = useState<boolean>(false);

  // Conjunto de notas dominadas pelo estudante
  const [masteredNotes, setMasteredNotes] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('trumpet_mastered_notes');
      return saved ? new Set(JSON.parse(saved)) : new Set(['C4']);
    } catch {
      return new Set(['C4']);
    }
  });

  // Métricas acumuladas do estudante
  const [metrics, setMetrics] = useState<PracticeSessionMetric>(() => {
    try {
      const saved = localStorage.getItem('trumpet_student_metrics');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback padrão
    }
    return {
      id: 'session-1',
      timestamp: Date.now(),
      totalNotesAttempted: 0,
      correctNotesCount: 0,
      averageAccuracy: 100,
      longestHoldSeconds: 0,
      notesMastered: ['C4'],
      score: 50,
      stars: 1,
    };
  });

  // Salvar métricas no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trumpet_student_metrics', JSON.stringify(metrics));
      localStorage.setItem('trumpet_mastered_notes', JSON.stringify(Array.from(masteredNotes)));
    } catch {
      // Ignorar caso armazenamento esteja desabilitado
    }
  }, [metrics, masteredNotes]);

  // Atualizar modo de transposição no motor de áudio
  useEffect(() => {
    trumpetAudio.isTrumpetBbMode = isTrumpetBbMode;
  }, [isTrumpetBbMode]);

  // Callback ao detectar notas estáveis e atualizar estatísticas
  const handlePitchUpdate = useCallback((res: PitchDetectionResult) => {
    setPitch(res);

    // Se o estudante segurar uma nota afinada por 1.8 segundos ou mais no afinador
    if (res.isStable && res.stabilityDuration >= 1.8 && res.closestNote) {
      const noteId = res.closestNote.id;

      setMasteredNotes((prev) => {
        if (!prev.has(noteId)) {
          const next = new Set(prev);
          next.add(noteId);
          return next;
        }
        return prev;
      });

      setMetrics((prev) => ({
        ...prev,
        totalNotesAttempted: prev.totalNotesAttempted + 1,
        correctNotesCount: prev.correctNotesCount + 1,
        score: prev.score + 15,
        longestHoldSeconds: Math.max(prev.longestHoldSeconds, res.stabilityDuration),
        averageAccuracy: Math.min(
          100,
          Math.round(((prev.correctNotesCount + 1) / (prev.totalNotesAttempted + 1)) * 100)
        ),
      }));
    }
  }, []);

  // Ligar / Desligar microfone
  const toggleMicrophone = async () => {
    setMicError(null);
    if (isListening) {
      trumpetAudio.stop();
      setIsListening(false);
      setPitch((prev) => ({
        ...prev,
        frequency: 0,
        tuningState: 'too_quiet',
        isStable: false,
        stabilityDuration: 0,
      }));
    } else {
      try {
        await trumpetAudio.start(handlePitchUpdate);
        setIsListening(true);
      } catch (err: unknown) {
        setIsListening(false);
        setMicError(
          'Não foi possível acessar o microfone. O aplicativo continuará funcionando perfeitamente no Modo Manual (Sem Microfone) para que você possa continuar estudando!'
        );
      }
    }
  };

  // Parar microfone ao desmontar
  useEffect(() => {
    return () => {
      trumpetAudio.stop();
    };
  }, []);

  // Selecionar nova nota de estudo
  const handleSelectNote = (note: NoteDefinition) => {
    setTargetNote(note);
    trumpetAudio.playTrumpetTone(note, 1.4);
  };

  // Conclusão de exercício na aba de músicas
  const handleSessionComplete = (acc: number, total: number, starsEarned: number) => {
    setMetrics((prev) => ({
      ...prev,
      totalNotesAttempted: prev.totalNotesAttempted + total,
      correctNotesCount: prev.correctNotesCount + Math.round((acc / 100) * total),
      score: prev.score + 100 * starsEarned,
      stars: prev.stars + starsEarned,
      averageAccuracy: Math.round((prev.averageAccuracy + acc) / 2),
    }));
  };

  const handleSelectUser = (user: UserProfile) => {
    userStorage.setActiveUser(user.id);
    setCurrentUser(user);
    setIsTrumpetBbMode(user.isTrumpetBb);
  };

  const handleExerciseCompletedForUser = (
    exerciseId: string,
    accuracy: number,
    stars: number,
    totalNotes: number
  ) => {
    if (currentUser) {
      const updated = userStorage.recordExerciseCompletion(currentUser.id, exerciseId, accuracy, stars, totalNotes);
      if (updated) {
        setCurrentUser(updated);
      }
    }
  };

  // Praticar partitura criada no editor
  const handlePracticeCustomScore = (exercise: SongExercise) => {
    setCustomExerciseToPractice(exercise);
    setCurrentTab(activeModule === 'piano' ? 'p_exercicios' : 't_exercicios');
  };

  const handleSelectModule = (mod: AppModule) => {
    setActiveModule(mod);
    if (mod === 'trompete') {
      setCurrentTab('t_afinador');
    } else {
      setCurrentTab('p_teclado');
    }
  };

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    if (tabId.startsWith('t_')) {
      setActiveModule('trompete');
    } else if (tabId.startsWith('p_')) {
      setActiveModule('piano');
    }
    setIsMobileSidebarOpen(false);
  };

  // Título e subtítulo da seção atual
  const getSectionInfo = () => {
    switch (currentTab) {
      case 't_afinador':
      case 'afinador':
        return { title: 'Afinador em Tempo Real', subtitle: 'Escuta a campana do trompete e indica digitação exata dos pistões 1, 2 e 3' };
      case 't_trompete':
      case 'trompete':
        return { title: 'Trompete Mecânico & Pistões', subtitle: 'Simulação interativa da mecânica de válvulas e atalhos de digitação no teclado' };
      case 't_teoria':
        return { title: 'Teoria Musical do Trompete', subtitle: 'Currículo nos 3 níveis (Inicial, Média, Avançada) com acústica dos harmônicos' };
      case 't_exercicios':
      case 'exercicios':
        return { title: 'Caderno de Exercícios (Da Capo & Arban)', subtitle: 'Mais de 90 lições graduadas para embocadura, flexibilidade e leitura' };
      case 'p_teclado':
      case 'piano':
        return { title: 'Teclado de Piano Completo', subtitle: 'Extensão de Dó -1 a Si +3 (5 oitavas completas) com atalhos de PC e Shift após Ç' };
      case 'p_teoria':
        return { title: 'Teoria Musical para Piano', subtitle: 'Currículo nos 3 níveis (Inicial, Média, Avançada): pauta dupla, dedilhados e harmonia' };
      case 'p_harmonia':
        return { title: 'Dicionário de Acordes & Inversões', subtitle: 'Harmonia prática no teclado: tríades, tétrades e inversões com som de piano' };
      case 'p_exercicios':
        return { title: 'Prática & Dedilhados de Piano', subtitle: 'Exercícios práticos para Mão Direita (MD) e Mão Esquerda (ME) com áudio e metrônomo' };
      case 't_editor':
      case 'p_editor':
      case 'editor':
        return { title: 'Editor de Partituras & Exercícios', subtitle: 'Componha suas próprias lições no sistema ABC (A=1) e pratique na hora' };
      case 't_metronomo':
      case 'p_metronomo':
      case 'metronomo':
        return { title: 'Metrônomo Interativo', subtitle: 'Treinamento rítmico com subdivisões e batidas acentuadas' };
      case 't_mapa':
      case 'p_mapa':
      case 'mapa':
        return { title: 'Sistema ABC (A=Lá=1) & Mapa Cromático', subtitle: 'A correlação direta entre cifras, graus numéricos e notas solfejadas' };
      case 't_metricas':
      case 'p_metricas':
      case 'metricas':
        return { title: 'Métricas & Nível do Aluno', subtitle: 'Histórico de precisão, estrelas conquistadas e notas dominadas' };
      default:
        return { title: 'EMUC-EAD', subtitle: 'Escola de Música do Cariri' };
    }
  };

  const sectionInfo = getSectionInfo();

  return (
    <div className="min-h-screen flex bg-[#FDFBF7] text-stone-800 antialiased">
      {/* MENU LATERAL ESQUERDO */}
      <SidebarNav
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        userProfile={
          currentUser || {
            id: 'aluno-emuc',
            name: 'Estudante EMUC',
            avatar: '🎓',
            avatarBg: 'bg-amber-600',
            currentLevel: 'Iniciante',
            isTrumpetBb: isTrumpetBbMode,
            completedExerciseIds: [],
            exerciseScores: {},
            masteredNotes: [],
            totalNotesAttempted: 0,
            correctNotesCount: 0,
            longestHoldSeconds: 0,
            totalScore: 0,
            stars: 0,
            practiceMinutes: 0,
            streakDays: 1,
            lastActiveDate: new Date().toISOString().split('T')[0],
            createdAt: Date.now(),
          }
        }
        onOpenProfileModal={() => setIsAuthModalOpen(true)}
        isMetronomeActive={showFloatingMetronome}
        onToggleMetronome={() => setShowFloatingMetronome(!showFloatingMetronome)}
        soundTransposition={isTrumpetBbMode ? 'trumpet_bb' : 'concert'}
        onToggleTransposition={() => setIsTrumpetBbMode(!isTrumpetBbMode)}
      />

      {/* ÁREA DE CONTEÚDO PRINCIPAL COM BARRA DE TOPO */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* BARRA SUPERIOR DO CONTEÚDO */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 shadow-2xs">
          {/* Lado Esquerdo: Botão Mobile + Indicador do Módulo + Título da Seção */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Botão para abrir menu no celular */}
            <button
              type="button"
              id="btn-open-sidebar-mobile"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors"
              aria-label="Abrir Menu Lateral"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Módulo Ativo e Título */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    activeModule === 'trompete'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-sky-100 text-sky-900 border border-sky-200'
                  }`}
                >
                  <span>{activeModule === 'trompete' ? '🎺 MÓDULO TROMPETE' : '🎹 MÓDULO PIANO'}</span>
                </span>
                <span className="text-[11px] text-stone-400 hidden sm:inline">•</span>
                <span className="text-xs font-black text-stone-800 hidden sm:inline truncate">
                  {sectionInfo.title}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate hidden md:block">
                {sectionInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Lado Direito: Ações Rápidas de Estudo */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Chave de Transposição (visível no módulo de trompete) */}
            {activeModule === 'trompete' && (
              <div className="hidden lg:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-bold">
                <button
                  type="button"
                  id="header-btn-transpose-bb"
                  onClick={() => setIsTrumpetBbMode(true)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    isTrumpetBbMode
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Partitura e digitação padrão do trompete em Si♭"
                >
                  Trompete (Si♭)
                </button>
                <button
                  type="button"
                  id="header-btn-transpose-c"
                  onClick={() => setIsTrumpetBbMode(false)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    !isTrumpetBbMode
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Som real de concerto (piano, teclado)"
                >
                  Som Real (Dó)
                </button>
              </div>
            )}

            {/* Mini Metrônomo Rápido */}
            <button
              type="button"
              id="topbar-toggle-metronome"
              onClick={() => setShowFloatingMetronome(!showFloatingMetronome)}
              className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                showFloatingMetronome
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
              title="Mini Metrônomo Flutuante"
            >
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="hidden xl:inline text-xs">Metrônomo</span>
            </button>

            {/* Microfone */}
            <button
              type="button"
              id="topbar-toggle-mic"
              onClick={toggleMicrophone}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-black transition-all shadow-2xs cursor-pointer ${
                isListening
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pausar Mic</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Microfone</span>
                </>
              )}
            </button>

            {/* Perfil do Aluno */}
            <button
              type="button"
              id="topbar-user-profile-btn"
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 transition-colors shadow-2xs cursor-pointer"
              title="Perfil do Estudante / Trocar Aluno"
            >
              <div
                className={`w-7 h-7 rounded-lg ${
                  currentUser?.avatarBg || 'bg-amber-600'
                } text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs`}
              >
                {currentUser?.avatar || '🎓'}
              </div>
              <div className="hidden xl:flex flex-col text-left leading-tight">
                <span className="text-xs font-black text-stone-900 truncate max-w-[90px]">
                  {currentUser?.name || 'Aluno'}
                </span>
                <span className="text-[10px] text-amber-800 font-bold truncate">
                  ⭐ {currentUser?.stars || 0}
                </span>
              </div>
            </button>
          </div>
        </header>

      {/* Mini Metrônomo Flutuante Rápido (Quando ativado) */}
      {showFloatingMetronome && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          <Metronome compact initialBpm={100} />
        </div>
      )}

      {/* Painel Rápido de Trompete com Atalhos PC (Quando ativado via cabeçalho) */}
      {showFloatingTrumpet && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <span>🎺</span>
              <span>Painel de Trompete & Pistões Mecânicos (Atalhos PC)</span>
            </span>
            <button
              type="button"
              onClick={() => setShowFloatingTrumpet(false)}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 underline"
            >
              Fechar Painel Flutuante
            </button>
          </div>
          <TrumpetKeyboardPanel
            targetNoteId={targetNote.id}
            onSelectTargetNote={handleSelectNote}
            activeContext="tuner"
          />
        </div>
      )}

      {/* Teclado de Piano Rápido com Atalhos PC (Quando ativado via cabeçalho) */}
      {showFloatingPiano && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-amber-600" />
              Painel Rápido de Piano & Atalhos de Teclado (QWERT/ASDFG/ZXCVB)
            </span>
            <button
              type="button"
              onClick={() => setShowFloatingPiano(false)}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 underline"
            >
              Fechar Painel Flutuante
            </button>
          </div>
          <PianoKeyboardPanel
            targetNoteId={targetNote.id}
            onSelectTargetNote={handleSelectNote}
            activeContext="tuner"
          />
        </div>
      )}

      {/* AVISO DE ERRO DE PERMISSÃO DO MICROFONE SE HOUVER */}
      {micError && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs sm:text-sm shadow-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Modo Sem Microfone Disponível</strong>
              <p className="mt-0.5">{micError}</p>
            </div>
          </div>
        </div>
      )}

      {/* ÁREA PRINCIPAL DO CONTEÚDO */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ABA 1: AFINADOR EM TEMPO REAL E DIGITAÇÃO DE PISTÕES */}
        {(currentTab === 't_afinador' || currentTab === 'afinador') && (
          <div className="space-y-6">
            {/* Banner de Boas-Vindas Didático */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/50 rounded-full text-xs font-bold mb-2 text-amber-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Feedback em Tempo Real pelo Microfone ou Modo Manual</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black leading-tight">
                  Toque qualquer nota no trompete. O afinador corrige na hora!
                </h2>
                <p className="text-xs sm:text-sm text-amber-100 mt-2 leading-relaxed">
                  O aplicativo escuta o som da campana, mostra a frequência em Hz, desvio em cents (bemol/sustenido) e orienta os pistões 1, 2 e 3 no sistema <strong>ABC (A=Lá=1)</strong>.
                </p>
              </div>
            </div>

            {/* Grid com Afinador e Visualizador de Pistões */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Coluna Esquerda: Medidor de Afinação em Tempo Real */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <TunerGauge
                  pitch={pitch}
                  isListening={isListening}
                  onToggleMic={toggleMicrophone}
                  targetNote={targetNote}
                  isTrumpetBbMode={isTrumpetBbMode}
                />
              </div>

              {/* Coluna Direita: Caixa Mecânica dos Pistões do Trompete e Teclado Didático */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 p-5 sm:p-6 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-stone-100">
                    <div>
                      <h3 className="text-base font-black text-stone-900">
                        Pistões do Trompete
                      </h3>
                      <p className="text-xs text-stone-500">
                        Válvulas correspondentes à nota atual
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => trumpetAudio.playTrumpetTone(targetNote, 1.4)}
                      className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Tocar áudio de exemplo"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="hidden xs:inline">Ouvir</span>
                    </button>
                  </div>

                  {/* Componente Gráfico dos Pistões */}
                  <TrumpetValves
                    valves={
                      pitch.frequency > 0 && pitch.closestNote
                        ? pitch.closestNote.valvesBb
                        : targetNote.valvesBb
                    }
                    size="md"
                    noteLabel={`${
                      pitch.frequency > 0 && pitch.closestNote
                        ? pitch.closestNote.solfege
                        : targetNote.solfege
                    } (${
                      pitch.frequency > 0 && pitch.closestNote
                        ? pitch.closestNote.letter
                        : targetNote.letter
                    }=${
                      pitch.frequency > 0 && pitch.closestNote
                        ? pitch.closestNote.numberNotation
                        : targetNote.numberNotation
                    })`}
                  />

                  {/* Atalhos Rápidos das Notas Essenciais para o Estudante Selecionar */}
                  <div className="w-full mt-4 pt-3 border-t border-stone-100">
                    <span className="text-[11px] font-bold text-stone-500 block mb-2 text-center uppercase tracking-wider">
                      Escolha uma nota para praticar no afinador:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                      {[
                        { letter: 'C', num: '3', id: 'C4', name: 'Dó' },
                        { letter: 'D', num: '4', id: 'D4', name: 'Ré' },
                        { letter: 'E', num: '5', id: 'E4', name: 'Mi' },
                        { letter: 'F', num: '6', id: 'F4', name: 'Fá' },
                        { letter: 'G', num: '7', id: 'G4', name: 'Sol' },
                        { letter: 'A', num: '1', id: 'A4', name: 'Lá' },
                        { letter: 'B', num: '2', id: 'B4', name: 'Si' },
                      ].map((item) => {
                        const noteDef = TRUMPET_NOTES.find((n) => n.id === item.id) || TRUMPET_NOTES[6];
                        const isCurrentTarget = targetNote.id === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectNote(noteDef)}
                            className={`p-2 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                              isCurrentTarget
                                ? 'bg-amber-600 text-white border-amber-600 shadow-sm scale-105'
                                : 'bg-stone-50 border-stone-200 text-stone-800 hover:border-amber-400 hover:bg-white'
                            }`}
                          >
                            <span className="text-base font-black font-mono leading-none">
                              {item.letter}
                            </span>
                            <span className={`text-[10px] font-extrabold mt-0.5 ${isCurrentTarget ? 'text-amber-100' : 'text-amber-800'}`}>
                              {item.name} ({item.num})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: PAINEL DE TROMPETE, PISTÕES MECÂNICOS E ATALHOS PC */}
        {(currentTab === 't_trompete' || currentTab === 'trompete') && (
          <div className="space-y-6">
            <TrumpetKeyboardPanel
              targetNoteId={targetNote.id}
              onSelectTargetNote={handleSelectNote}
              activeContext="standalone"
            />
          </div>
        )}

        {/* ABA: TECLADO DE PIANO COMPLETO (Dó -1 a Si +3 com atalhos PC e Shift) */}
        {(currentTab === 'p_teclado' || currentTab === 'piano') && (
          <div className="space-y-6">
            <PianoKeyboardPanel
              targetNoteId={targetNote.id}
              onSelectTargetNote={handleSelectNote}
              activeContext="standalone"
            />
          </div>
        )}

        {/* ABA: TEORIA MUSICAL DO TROMPETE */}
        {currentTab === 't_teoria' && (
          <MusicTheoryView
            initialInstrumentScope="trompete"
            onSelectTargetNote={handleSelectNote}
            onNavigateToTab={handleSelectTab}
          />
        )}

        {/* ABA: TEORIA MUSICAL DO PIANO (3 NÍVEIS) */}
        {currentTab === 'p_teoria' && (
          <MusicTheoryView
            initialInstrumentScope="piano"
            onSelectTargetNote={handleSelectNote}
            onNavigateToTab={handleSelectTab}
          />
        )}

        {/* ABA: TEORIA MUSICAL GERAL */}
        {currentTab === 'teoria' && (
          <MusicTheoryView
            initialInstrumentScope={activeModule}
            onSelectTargetNote={handleSelectNote}
            onNavigateToTab={handleSelectTab}
          />
        )}

        {/* ABA: HARMONIA DO PIANO & DICIONÁRIO DE ACORDES */}
        {currentTab === 'p_harmonia' && (
          <PianoHarmonyView onSelectNote={handleSelectNote} />
        )}

        {/* ABA: PRÁTICA & DEDILHADOS DE PIANO */}
        {currentTab === 'p_exercicios' && (
          <PianoExercisesView onSelectNote={handleSelectNote} />
        )}

        {/* ABA 2: 90+ EXERCÍCIOS E MÚSICAS PRÁTICAS DO TROMPETE (DA CAPO & ARBAN) */}
        {(currentTab === 't_exercicios' || currentTab === 'exercicios') && (
          <PracticeSongMode
            currentPitch={pitch}
            isListening={isListening}
            onToggleMic={toggleMicrophone}
            onSessionComplete={handleSessionComplete}
            customExercise={customExerciseToPractice}
            currentUser={currentUser}
            onExerciseCompletedWithUser={handleExerciseCompletedForUser}
          />
        )}

        {/* ABA 3: EDITOR DE PARTITURAS E CRIAÇÃO DE EXERCÍCIOS */}
        {(currentTab === 't_editor' || currentTab === 'p_editor' || currentTab === 'editor') && (
          <ScoreEditor onPracticeCustomScore={handlePracticeCustomScore} />
        )}

        {/* ABA 4: METRÔNOMO */}
        {(currentTab === 't_metronomo' || currentTab === 'p_metronomo' || currentTab === 'metronomo') && (
          <div className="max-w-2xl mx-auto">
            <Metronome initialBpm={100} />
          </div>
        )}

        {/* ABA 5: MAPA EDUCATIVO ABC (A=Lá=1) E ESCALA CROMÁTICA */}
        {(currentTab === 't_mapa' || currentTab === 'p_mapa' || currentTab === 'mapa') && (
          <AbcChromaticChart
            onSelectNote={handleSelectNote}
            selectedNoteId={targetNote.id}
          />
        )}

        {/* ABA 6: MÉTRICAS DE DESEMPENHO PARA ESTUDANTES */}
        {(currentTab === 't_metricas' || currentTab === 'p_metricas' || currentTab === 'metricas') && (
          <StudentMetrics
            metrics={metrics}
            masteredNotes={masteredNotes}
            currentUser={currentUser}
            onOpenLoginModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* RODAPÉ INFORMATIVO E ACESSÍVEL */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">EMUC-EAD (Escola de Música do Cariri)</span>
            <span>•</span>
            <span>Sistema Vinculado: A = Lá = 1 até G = Sol = 7</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amber-800 font-semibold">
              {activeModule === 'trompete'
                ? isTrumpetBbMode
                  ? 'Módulo Trompete (Si♭ Ativo)'
                  : 'Módulo Trompete (Som Real Ativo)'
                : 'Módulo Piano (5 Oitavas Ativo)'}
            </span>
            <span>•</span>
            <span>Desenvolvido para crianças, jovens e adultos de todas as idades</span>
          </div>
        </div>
      </footer>

      {/* MODAL DE LOGIN / REGISTRO DE AVANÇO DO ESTUDANTE */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
      />
    </div>
  </div>
  );
}

