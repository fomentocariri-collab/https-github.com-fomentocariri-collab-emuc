import React from 'react';
import { 
  Award, Star, Flame, Target, Clock, CheckCircle2, Music, Lightbulb, 
  User, ShieldCheck, ChevronRight, BookOpen, Sparkles
} from 'lucide-react';
import { PracticeSessionMetric, UserProfile } from '../types';
import { INICIANTED_EXERCISES, DA_CAPO_EXERCISES, ARBAN_EXERCISES } from '../data/exerciseLibrary';

interface StudentMetricsProps {
  metrics: PracticeSessionMetric;
  masteredNotes: Set<string>;
  currentUser: UserProfile | null;
  onOpenLoginModal: () => void;
}

export const StudentMetrics: React.FC<StudentMetricsProps> = ({
  metrics,
  masteredNotes,
  currentUser,
  onOpenLoginModal,
}) => {
  const allFundamentalNotes = [
    { letter: 'A', solfege: 'Lá', num: '1', noteId: 'A4' },
    { letter: 'B', solfege: 'Si', num: '2', noteId: 'B4' },
    { letter: 'C', solfege: 'Dó', num: '3', noteId: 'C4' },
    { letter: 'D', solfege: 'Ré', num: '4', noteId: 'D4' },
    { letter: 'E', solfege: 'Mi', num: '5', noteId: 'E4' },
    { letter: 'F', solfege: 'Fá', num: '6', noteId: 'F4' },
    { letter: 'G', solfege: 'Sol', num: '7', noteId: 'G4' },
  ];

  // Cálculo de progresso por método pedagógico
  const userCompleted = currentUser?.completedExerciseIds || [];

  const completedInicianteCount = INICIANTED_EXERCISES.filter(ex => userCompleted.includes(ex.id)).length;
  const iniciantePercent = Math.round((completedInicianteCount / INICIANTED_EXERCISES.length) * 100);

  const completedDaCapoCount = DA_CAPO_EXERCISES.filter(ex => userCompleted.includes(ex.id)).length;
  const daCapoPercent = Math.round((completedDaCapoCount / DA_CAPO_EXERCISES.length) * 100);

  const completedArbanCount = ARBAN_EXERCISES.filter(ex => userCompleted.includes(ex.id)).length;
  const arbanPercent = Math.round((completedArbanCount / ARBAN_EXERCISES.length) * 100);

  const pedagogyTips = [
    {
      source: 'Método Da Capo (Intermediário)',
      title: 'Fraseado e Forma Da Capo (D.C. al Fine)',
      desc: 'No Método Da Capo, pense em frases completas de 4 compassos antes de respirar. Ao encontrar a indicação "D.C. al Fine", volte ao início sem perder o andamento.',
    },
    {
      source: 'Método Arban (Avançado)',
      title: 'O Ataque com a Sílaba "TU"',
      desc: 'Como ensina Jean-Baptiste Arban, a língua deve tocar suavemente atrás dos dentes superiores como uma válvula que solta a pressão do ar sem esforço na garganta.',
    },
    {
      source: 'Método Arban (Avançado)',
      title: 'Flexibilidade de Lábios (Lip Slurs)',
      desc: 'Nunca aperte o bocal contra os lábios nos saltos de oitava. Mude de harmônico arqueando a língua (posição de "A" para o grave e "I" para o agudo).',
    },
    {
      source: 'Sistema Didático ABC',
      title: 'Mapeamento Cifrado A=1 a G=7',
      desc: 'A=Lá=1, B=Si=2, C=Dó=3, D=Ré=4, E=Mi=5, F=Fá=6, G=Sol=7. Memorize os números dos pistões para leitura à primeira vista.',
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 p-5 sm:p-7 max-w-4xl mx-auto w-full space-y-6">
      {/* CARTÃO DO ALUNO LOGADO */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className={`w-14 h-14 rounded-2xl ${currentUser?.avatarBg || 'bg-amber-600'} text-white flex items-center justify-center text-2xl shadow-inner border border-white/20 shrink-0`}>
            {currentUser?.avatar || '🎺'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                Estudante Ativo
              </span>
              <span className="text-xs text-stone-300">
                {currentUser?.turmaOrSchool || 'Estudo Individual'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {currentUser?.name || 'Estudante de Trompete'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-amber-200 font-semibold mt-0.5">
              <span>Nível Atual: </span>
              <span className="font-bold underline decoration-amber-400">
                {currentUser?.currentLevel === 'Intermediário'
                  ? 'Módulo Intermediário (Método Da Capo)'
                  : currentUser?.currentLevel === 'Avançado'
                  ? 'Módulo Avançado (Método Arban)'
                  : 'Módulo Iniciante (Fundamentos)'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 border-white/15 pt-2 sm:pt-0">
          <button
            type="button"
            id="btn-switch-student-metrics"
            onClick={onOpenLoginModal}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Trocar Aluno / Login</span>
          </button>
          <span className="text-[11px] text-stone-300">
            {currentUser?.streakDays || 1} dias de prática seguidos 🔥
          </span>
        </div>
      </div>

      {/* PAINEL DE MÉTODOS PEDAGÓGICOS: DA CAPO & ARBAN */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-stone-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-700" />
            Progresso nos Métodos Oficiais
          </h3>
          <span className="text-xs text-stone-500 font-semibold">
            {userCompleted.length} exercícios concluídos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CARTÃO MÉTODO DA CAPO (INTERMEDIÁRIO) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                  Módulo Intermediário
                </span>
                <span className="text-xs font-black text-amber-900 font-mono">
                  {completedDaCapoCount} / {DA_CAPO_EXERCISES.length} lições
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-stone-900 mt-2">
                Método Da Capo
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Metodologia para bandas e instrumentos de metal. Fraseado, ligaduras, dinâmicas e forma D.C. al Fine.
              </p>
            </div>

            {/* Barra de progresso Da Capo */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-amber-900">
                <span>Evolução no Da Capo</span>
                <span>{daCapoPercent}%</span>
              </div>
              <div className="w-full h-3 bg-amber-200/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-700 transition-all duration-500"
                  style={{ width: `${daCapoPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800 font-bold">
              <span>{completedDaCapoCount >= 10 ? '⭐ Nível Da Capo Ativo' : 'Pratique as lições 1 a 32'}</span>
              <span>{daCapoPercent === 100 ? '🏆 Certificado Da Capo!' : 'Em andamento'}</span>
            </div>
          </div>

          {/* CARTÃO MÉTODO ARBAN (AVANÇADO) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                  Módulo Avançado
                </span>
                <span className="text-xs font-black text-emerald-900 font-mono">
                  {completedArbanCount} / {ARBAN_EXERCISES.length} estudos
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-stone-900 mt-2">
                Grande Método Arban
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                A "Bíblia do Trompete" de J.B. Arban. Síncopes, flexibilidade labial, escala cromática, arpejos, golpe duplo/triplo e Carnaval de Veneza.
              </p>
            </div>

            {/* Barra de progresso Arban */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-emerald-900">
                <span>Evolução no Método Arban</span>
                <span>{arbanPercent}%</span>
              </div>
              <div className="w-full h-3 bg-emerald-200/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-500"
                  style={{ width: `${arbanPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800 font-bold">
              <span>{completedArbanCount >= 10 ? '👑 Nível Arban Virtuoso' : 'Pratique os estudos de Arban'}</span>
              <span>{arbanPercent === 100 ? '🏆 Virtuoso Arban!' : 'Em andamento'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cartões com os Principais Indicadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Precisão Média de Afinação */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Precisão de Afinação</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-600">
              {currentUser?.correctNotesCount && currentUser?.totalNotesAttempted
                ? Math.min(100, Math.round((currentUser.correctNotesCount / currentUser.totalNotesAttempted) * 100))
                : metrics.averageAccuracy}%
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            Estabilidade do som na zona verde.
          </p>
        </div>

        {/* Sustentação Mais Longa */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Maior Sustentação</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-amber-600">
              {(currentUser?.longestHoldSeconds || metrics.longestHoldSeconds || 0).toFixed(1)}s
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            Capacidade pulmonar e controle da coluna de ar.
          </p>
        </div>

        {/* Total de Notas */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Notas Tocadas</span>
            <Music className="w-4 h-4 text-blue-600" />
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-blue-600">
              {currentUser?.correctNotesCount || metrics.correctNotesCount}
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            Notas afinadas e validadas nos estudos.
          </p>
        </div>

        {/* Estrelas Acumuladas */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Estrelas de Ouro</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-amber-600">
              {currentUser?.stars ?? metrics.stars}
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            Conquistadas nas lições dos módulos.
          </p>
        </div>
      </div>

      {/* Notas Fundamentais Dominadas (Sistema ABC: 1 a 7) */}
      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-800">
              Notas Fundamentais Dominadas (A=1 a G=7)
            </h3>
            <p className="text-xs text-stone-500">
              As 7 notas base do sistema de ensino de trompete cifrado.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800">
            {(currentUser?.masteredNotes || Array.from(masteredNotes)).length} notas catalogadas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
          {allFundamentalNotes.map((item) => {
            const currentMasteredList = currentUser?.masteredNotes || Array.from(masteredNotes);
            const isMastered = currentMasteredList.includes(item.noteId);

            return (
              <div
                key={item.noteId}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  isMastered
                    ? 'bg-white border-emerald-400 shadow-sm ring-1 ring-emerald-200'
                    : 'bg-stone-100/70 border-dashed border-stone-300 opacity-60'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-lg font-black text-stone-900">{item.letter}</span>
                  <span className="text-xs font-bold text-amber-800">[{item.num}]</span>
                </div>
                <span className="text-xs font-medium text-stone-600">{item.solfege}</span>
                <div className="mt-2">
                  {isMastered ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Dominada
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-600">A praticar</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dicas Pedagógicas de Trompete */}
      <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-700" />
          <h3 className="text-sm font-black uppercase tracking-wider text-amber-900">
            Dicas Pedagógicas dos Mestres do Trompete
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {pedagogyTips.map((tip, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white border border-amber-100 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {tip.source}
                </span>
              </div>
              <h4 className="font-bold text-stone-900 pt-0.5">{tip.title}</h4>
              <p className="text-stone-600 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
