import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Award,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Volume2,
  Play,
  RotateCcw,
  Search,
  Sliders,
  Layers,
  Zap,
  Music,
  ArrowRight,
  ShieldCheck,
  Check,
  Compass,
  FileText
} from 'lucide-react';
import {
  MUSIC_THEORY_TOPICS,
  TheoryTopic,
  TheoryLevel,
  THEORY_LEVEL_DESCRIPTIONS,
  InstrumentScope,
} from '../data/musicTheoryData';
import { NoteDefinition } from '../types';
import { trumpetAudio } from '../utils/audioEngine';
import { findNoteDefinition } from '../data/pianoKeyboardMap';
import { TRUMPET_VALVE_COMBINATIONS } from '../data/trumpetValveMap';
import {
  PianoKeysTopographyVisual,
  PianoFingerNumberingVisual,
  GrandStaffVisual,
  PianoScalesFingeringVisual,
  PianoChordInversionsVisual,
  PianoPedalsVisual,
  PianoVoicingsVisual,
  PianoAccompanimentVisual,
} from './PianoTheoryVisuals';

interface MusicTheoryViewProps {
  onSelectTargetNote?: (note: NoteDefinition) => void;
  onNavigateToTab?: (tabId: string) => void;
  initialInstrumentScope?: 'geral' | 'trompete' | 'piano' | 'all';
}

export const MusicTheoryView: React.FC<MusicTheoryViewProps> = ({
  onSelectTargetNote,
  onNavigateToTab,
  initialInstrumentScope = 'all',
}) => {
  const [selectedLevel, setSelectedLevel] = useState<TheoryLevel>('inicial');
  const [instrumentFilter, setInstrumentFilter] = useState<'all' | 'trompete' | 'piano'>(
    initialInstrumentScope === 'piano' ? 'piano' : initialInstrumentScope === 'trompete' ? 'trompete' : 'all'
  );
  const [activeTopicId, setActiveTopicId] = useState<string>(() => {
    if (initialInstrumentScope === 'piano') {
      const firstPiano = MUSIC_THEORY_TOPICS.find((t) => t.instrument === 'piano');
      if (firstPiano) return firstPiano.id;
    }
    return MUSIC_THEORY_TOPICS[0].id;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playbackTimbre, setPlaybackTimbre] = useState<'auto' | 'piano' | 'trompete'>('auto');

  // Estados dos Quizzes interativos
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  // Filtrar tópicos pelo nível, escopo do instrumento e busca
  const filteredTopics = MUSIC_THEORY_TOPICS.filter((topic) => {
    const matchesLevel = topic.level === selectedLevel;
    const matchesInstrument =
      instrumentFilter === 'all'
        ? true
        : instrumentFilter === 'piano'
        ? topic.instrument === 'piano' || topic.instrument === 'geral'
        : topic.instrument === 'trompete' || topic.instrument === 'geral';

    if (!matchesInstrument) return false;
    if (!searchQuery.trim()) return matchesLevel;
    const query = searchQuery.toLowerCase();
    return (
      (matchesLevel || query.length > 2) &&
      (topic.title.toLowerCase().includes(query) ||
        topic.summary.toLowerCase().includes(query) ||
        topic.subtitle.toLowerCase().includes(query))
    );
  });

  const activeTopic =
    MUSIC_THEORY_TOPICS.find((t) => t.id === activeTopicId) ||
    filteredTopics[0] ||
    MUSIC_THEORY_TOPICS[0];

  // Tocar nota com áudio do instrumento correspondente
  const handlePlayNote = (noteId: string) => {
    const noteDef = findNoteDefinition(noteId);
    if (noteDef) {
      const usePiano = playbackTimbre === 'piano' || (playbackTimbre === 'auto' && activeTopic.instrument === 'piano');
      if (usePiano) {
        trumpetAudio.playPianoTone(noteDef, 1.8, 0.85);
      } else {
        trumpetAudio.playTrumpetTone(noteDef, 1.6);
      }
      if (onSelectTargetNote) {
        onSelectTargetNote(noteDef);
      }
    }
  };

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    const key = `${activeTopic.id}-${questionIndex}`;
    setQuizAnswers((prev) => ({ ...prev, [key]: optionIndex }));
  };

  const handleSubmitQuizQuestion = (questionIndex: number) => {
    const key = `${activeTopic.id}-${questionIndex}`;
    setQuizSubmitted((prev) => ({ ...prev, [key]: true }));
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted({});
  };

  // Cores dinâmicas para o nível selecionado
  const levelTheme = {
    inicial: {
      bgLight: 'bg-amber-50',
      border: 'border-amber-300',
      badgeBg: 'bg-amber-100 text-amber-900',
      tabActive: 'bg-amber-600 text-white shadow-md',
      ring: 'ring-amber-400',
      accentText: 'text-amber-800',
    },
    media: {
      bgLight: 'bg-sky-50',
      border: 'border-sky-300',
      badgeBg: 'bg-sky-100 text-sky-900',
      tabActive: 'bg-sky-600 text-white shadow-md',
      ring: 'ring-sky-400',
      accentText: 'text-sky-800',
    },
    avancado: {
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-300',
      badgeBg: 'bg-emerald-100 text-emerald-900',
      tabActive: 'bg-emerald-700 text-white shadow-md',
      ring: 'ring-emerald-400',
      accentText: 'text-emerald-800',
    },
  }[selectedLevel];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* CABEÇALHO PRINCIPAL DA TEORIA */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-stone-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Currículo Completo de Teoria Musical & Trompete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Teoria Musical: Inicial, Média e Avançada
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
              Domine os fundamentos desde o primeiro som até a harmonia superior, conectando a partitura tradicional ao sistema ABC (A=1), à mecânica natural dos pistões e à física acústica da 8ª e 16ª acima.
            </p>
          </div>

          {/* Barra de Busca de Tópicos */}
          <div className="relative min-w-[240px] max-w-xs">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="theory-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conceito ou termo..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>
        </div>

        {/* SELETOR DE INSTRUMENTO: TROMPETE VS PIANO VS GERAL */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Filtrar Conteúdo por:
            </span>
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                id="theory-filter-all"
                onClick={() => setInstrumentFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  instrumentFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🎼 Todos os Cursos
              </button>
              <button
                type="button"
                id="theory-filter-trompete"
                onClick={() => {
                  setInstrumentFilter('trompete');
                  const firstOfTrompete = MUSIC_THEORY_TOPICS.find((t) => t.level === selectedLevel && (t.instrument === 'trompete' || t.instrument === 'geral'));
                  if (firstOfTrompete) setActiveTopicId(firstOfTrompete.id);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  instrumentFilter === 'trompete'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🎺 Trompete & Metais
              </button>
              <button
                type="button"
                id="theory-filter-piano"
                onClick={() => {
                  setInstrumentFilter('piano');
                  const firstOfPiano = MUSIC_THEORY_TOPICS.find((t) => t.level === selectedLevel && (t.instrument === 'piano' || t.instrument === 'geral'));
                  if (firstOfPiano) setActiveTopicId(firstOfPiano.id);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  instrumentFilter === 'piano'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🎹 Piano & Teclado
              </button>
            </div>
          </div>

          {/* Timbre do Áudio */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <span>Timbre de Estudo:</span>
            <button
              type="button"
              onClick={() => setPlaybackTimbre(playbackTimbre === 'piano' ? 'trompete' : 'piano')}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>{playbackTimbre === 'piano' ? '🎹 Piano' : playbackTimbre === 'trompete' ? '🎺 Trompete' : '⚡ Automático'}</span>
            </button>
          </div>
        </div>

        {/* SELETOR DOS 3 NÍVEIS DE TEORIA: INICIAL, MÉDIA E AVANÇADA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-stone-100">
          {(['inicial', 'media', 'avancado'] as TheoryLevel[]).map((lvl) => {
            const info = THEORY_LEVEL_DESCRIPTIONS[lvl];
            const isSelected = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                type="button"
                id={`btn-theory-level-${lvl}`}
                onClick={() => {
                  setSelectedLevel(lvl);
                  const firstOfLevel = MUSIC_THEORY_TOPICS.find((t) => t.level === lvl);
                  if (firstOfLevel) setActiveTopicId(firstOfLevel.id);
                }}
                className={`p-4 rounded-2xl text-left transition-all border relative cursor-pointer ${
                  isSelected
                    ? `${levelTheme.bgLight} ${levelTheme.border} ring-2 ${levelTheme.ring} shadow-xs`
                    : 'bg-stone-50/70 hover:bg-stone-100/80 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      lvl === 'inicial'
                        ? 'bg-amber-100 text-amber-900'
                        : lvl === 'media'
                        ? 'bg-sky-100 text-sky-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {lvl === 'inicial' ? 'Nível 1' : lvl === 'media' ? 'Nível 2' : 'Nível 3'}
                  </span>
                  <span className="text-[10px] font-bold text-stone-500 font-mono">
                    {info.topicsCount} lições
                  </span>
                </div>
                <h3 className="text-sm font-black text-stone-900 leading-snug">{info.title}</h3>
                <p className="text-[11px] text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {info.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* CORPO DO MÓDULO: NAVEGADOR DE LIÇÕES + CONTEÚDO ATIVO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA ESQUERDA: LISTA DE LIÇÕES DO NÍVEL (LG: 4 COLUNAS) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-100">
              <span className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                Lições ({filteredTopics.length})
              </span>
              <span className="text-[10px] text-stone-500 font-bold">
                {THEORY_LEVEL_DESCRIPTIONS[selectedLevel].title.split(' ')[1]}
              </span>
            </div>

            <div className="space-y-1.5">
              {filteredTopics.map((topic) => {
                const isActive = topic.id === activeTopic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    id={`theory-topic-nav-${topic.id}`}
                    onClick={() => setActiveTopicId(topic.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all border flex items-start justify-between gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm ring-2 ring-amber-300 font-black'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200 font-bold'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded font-black ${
                          isActive ? 'bg-stone-950 text-amber-300' : 'bg-stone-200 text-stone-700'
                        }`}>
                          #{topic.order}
                        </span>
                        <span className="text-xs font-black">{topic.title.replace(/^\d+\.\s*/, '')}</span>
                      </div>
                      <p className={`text-[11px] line-clamp-1 font-normal ${isActive ? 'text-stone-900' : 'text-stone-500'}`}>
                        {topic.subtitle}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* DICA DE INTEGRAÇÃO COM AFINADOR E ATALHOS PC */}
          <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-3xl border border-amber-200 text-xs text-amber-950">
            <span className="font-black block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Teoria Prática & Interativa
            </span>
            <p className="text-[11px] text-stone-700 leading-relaxed">
              Cada lição possui botões sonoros com áudio real do trompete e demonstrações das posições dos pistões. Ao clicar numa nota, você pode testá-la no afinador ou no teclado de atalhos PC!
            </p>
          </div>
        </div>

        {/* COLUNA DIREITA: CONTEÚDO DA LIÇÃO ATIVA (LG: 8 COLUNAS) */}
        <div className="lg:col-span-8 space-y-5">
          <article className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            {/* Cabeçalho da Lição */}
            <div className="border-b border-stone-100 pb-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900">
                  {activeTopic.levelLabel}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700">
                  Lição #{activeTopic.order}
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  ⏱ ~{activeTopic.estimatedReadMinutes} min de leitura
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">{activeTopic.title}</h2>
              <p className="text-sm font-semibold text-stone-600 mt-1">{activeTopic.subtitle}</p>
              <div className="mt-3 p-3 bg-stone-50 rounded-2xl text-xs text-stone-700 border border-stone-200">
                <span className="font-bold text-stone-900">Resumo da Lição: </span>
                {activeTopic.summary}
              </div>
            </div>

            {/* SEÇÕES DE CONTEÚDO DIDÁTICO */}
            <div className="space-y-6">
              {activeTopic.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {section.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{section.text}</p>

                  {/* Pontos chave / tópicos da seção */}
                  {section.bulletPoints && (
                    <ul className="space-y-1.5 pl-2">
                      {section.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx} className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                          <span className="text-amber-600 font-bold mt-0.5">•</span>
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* VISUALIZADORES E INTERATORES ESPECÍFICOS */}
                  {section.visualType === 'sound_properties' && (
                    <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      {[
                        { label: 'Altura', desc: 'Grave vs Agudo (Hz)', icon: '🎵' },
                        { label: 'Duração', desc: 'Tempo / Figuras', icon: '⏱' },
                        { label: 'Intensidade', desc: 'Volume / Dinâmica (p / f)', icon: '🔊' },
                        { label: 'Timbre', desc: 'Cor do Instrumento', icon: '🎺' },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-amber-100 shadow-xs">
                          <span className="text-xl block mb-1">{item.icon}</span>
                          <span className="font-black text-xs text-stone-900 block">{item.label}</span>
                          <span className="text-[10px] text-stone-500">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.visualType === 'abc_table' && (
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="text-[10px] uppercase font-black bg-stone-200/60 text-stone-700">
                          <tr>
                            <th className="p-2">Letra (Cifra)</th>
                            <th className="p-2">Nome Cantado</th>
                            <th className="p-2">Número Vinculado</th>
                            <th className="p-2">Trompete (Si♭)</th>
                            <th className="p-2">Ouvir</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 font-medium">
                          {[
                            { letter: 'A', name: 'Lá', num: '1', note: 'A4', valves: '1 e 2' },
                            { letter: 'B', name: 'Si', num: '2', note: 'B4', valves: '2' },
                            { letter: 'C', name: 'Dó', num: '3', note: 'C4', valves: '0 (Aberto)' },
                            { letter: 'D', name: 'Ré', num: '4', note: 'D4', valves: '1 e 3 (com gatilho)' },
                            { letter: 'E', name: 'Mi', num: '5', note: 'E4', valves: '1 e 2' },
                            { letter: 'F', name: 'Fá', num: '6', note: 'F4', valves: '1' },
                            { letter: 'G', name: 'Sol', num: '7', note: 'G4', valves: '0 (Aberto)' },
                          ].map((row) => (
                            <tr key={row.letter} className="hover:bg-amber-50/50 transition-colors">
                              <td className="p-2 font-black text-amber-900">{row.letter}</td>
                              <td className="p-2 font-bold">{row.name}</td>
                              <td className="p-2 font-mono font-black text-amber-700">[{row.num}]</td>
                              <td className="p-2 font-mono text-[11px]">{row.valves}</td>
                              <td className="p-2">
                                <button
                                  type="button"
                                  onClick={() => handlePlayNote(row.note)}
                                  className="p-1 px-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[10px] flex items-center gap-1 transition-all"
                                >
                                  <Volume2 className="w-3 h-3" />
                                  <span>Tocar</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {section.visualType === 'valves_natural' && (
                    <div className="p-4 bg-stone-900 text-white rounded-2xl border border-stone-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-amber-400" />
                          A Ordem Natural Numérica dos 7 Circuitos de Tubagem
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">0 a 123</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                        {TRUMPET_VALVE_COMBINATIONS.map((combo, idx) => {
                          const drops = ['0 st (fundamental)', '-2 st (1 tom)', '-3 st (1½ tom)', '-1 st (½ tom)', '-4 st (2 tons)', '-5 st (2½ tons)', '-6 st (trítono)'];
                          return (
                            <div key={combo.id} className="bg-stone-800 p-2.5 rounded-xl border border-stone-700 text-center">
                              <span className="text-[10px] text-amber-400 font-bold block">#{idx + 1}</span>
                              <span className="text-sm font-mono font-black text-white block my-0.5">
                                {combo.displayFormula.split(' ')[0]}
                              </span>
                              <span className="text-[9px] text-stone-300 block">{drops[idx]}</span>
                              <span className="text-[9px] text-stone-400 block mt-1 line-clamp-1">{combo.tubeLengthDescription}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {section.visualType === 'octave_logic' && (
                    <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs space-y-2">
                      <span className="font-black text-sky-950 block text-xs uppercase tracking-wider">
                        Comparativo de Simplificação na 8ª Acima (8va):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="p-3 bg-white rounded-xl border border-sky-100">
                          <span className="font-black text-stone-900 block">Ré grave (D4) ➔ Ré agudo (D5)</span>
                          <span className="text-[11px] text-stone-600 block mt-0.5">
                            No grave: <strong>13 (com pompa)</strong><br />
                            Na 8ª acima: <strong className="text-sky-800">Apenas Pistão 1</strong>
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-sky-100">
                          <span className="font-black text-stone-900 block">Dó# grave (C#4) ➔ Dó# agudo (C#5)</span>
                          <span className="text-[11px] text-stone-600 block mt-0.5">
                            No grave: <strong>123 (com pompa)</strong><br />
                            Na 8ª acima: <strong className="text-sky-800">Pistões 1 e 2 (12)</strong>
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-sky-100">
                          <span className="font-black text-stone-900 block">Mi médio (E4) ➔ Mi agudo (E5)</span>
                          <span className="text-[11px] text-stone-600 block mt-0.5">
                            No médio: <strong>1 e 2 (12)</strong><br />
                            Na 8ª acima: <strong className="text-sky-800">0 (Solto / Aberto!)</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.visualType === 'piano_keys_topography' && (
                    <PianoKeysTopographyVisual onPlayNote={handlePlayNote} />
                  )}

                  {section.visualType === 'piano_finger_numbering' && (
                    <PianoFingerNumberingVisual />
                  )}

                  {section.visualType === 'grand_staff' && (
                    <GrandStaffVisual onPlayNote={handlePlayNote} />
                  )}

                  {section.visualType === 'piano_scales_fingering' && (
                    <PianoScalesFingeringVisual onPlayNote={handlePlayNote} />
                  )}

                  {section.visualType === 'piano_chord_inversions' && (
                    <PianoChordInversionsVisual onPlayNote={handlePlayNote} />
                  )}

                  {section.visualType === 'piano_pedals' && (
                    <PianoPedalsVisual />
                  )}

                  {section.visualType === 'piano_voicings' && (
                    <PianoVoicingsVisual />
                  )}

                  {section.visualType === 'piano_accompaniment' && (
                    <PianoAccompanimentVisual onPlayNote={handlePlayNote} />
                  )}

                  {/* Botões de notas interativas com áudio da lição */}
                  {section.interactiveNoteIds && section.interactiveNoteIds.length > 0 && (
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                      <span className="text-[11px] font-bold text-stone-600 block mb-2">
                        Toque e ouça os exemplos desta lição no trompete:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {section.interactiveNoteIds.map((noteId) => {
                          const noteDef = findNoteDefinition(noteId);
                          return (
                            <button
                              key={noteId}
                              type="button"
                              onClick={() => handlePlayNote(noteId)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-stone-800 border border-stone-200 hover:border-amber-300 shadow-xs flex items-center gap-1.5 transition-all text-xs font-black cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                              <span>{noteDef.solfege}</span>
                              <span className="text-amber-800 font-mono text-[10px]">[{noteDef.numberNotation}]</span>
                              <span className="text-stone-400 font-mono text-[10px]">({noteDef.fingerDescription})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dica de Mestre */}
                  {section.proTip && (
                    <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-amber-900">Dica Prática: </span>
                        <span>{section.proTip}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* AÇÕES DE INTEGRAÇÃO COM OUTROS MÓDULOS */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {onNavigateToTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('trompete')}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>🎺</span>
                    <span>Testar no Painel de Trompete</span>
                  </button>
                )}
                {onNavigateToTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('piano')}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>🎹</span>
                    <span>Visualizar no Piano</span>
                  </button>
                )}
              </div>

              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => onNavigateToTab('afinador')}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Afinar com Microfone</span>
                </button>
              )}
            </div>
          </article>

          {/* QUIZ INTERATIVO DE FIXAÇÃO DA LIÇÃO */}
          {activeTopic.quiz && activeTopic.quiz.length > 0 && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-stone-900">
                      Quiz de Fixação: {activeTopic.title}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Teste seus conhecimentos teóricos para fixar o aprendizado deste módulo.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold flex items-center gap-1 transition-all"
                  title="Reiniciar respostas"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpar</span>
                </button>
              </div>

              <div className="space-y-4">
                {activeTopic.quiz.map((q, qIdx) => {
                  const key = `${activeTopic.id}-${qIdx}`;
                  const selectedOpt = quizAnswers[key];
                  const isSubmitted = quizSubmitted[key];
                  const isCorrect = selectedOpt === q.correctIndex;

                  return (
                    <div key={qIdx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <span className="text-xs sm:text-sm font-black text-stone-900 block">
                        {qIdx + 1}. {q.question}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selectedOpt === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => {
                                handleSelectAnswer(qIdx, optIdx);
                                handleSubmitQuizQuestion(qIdx);
                              }}
                              className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between gap-2 cursor-pointer ${
                                isSubmitted
                                  ? optIdx === q.correctIndex
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-2 ring-emerald-400'
                                    : isOptionSelected
                                    ? 'bg-rose-100 text-rose-900 border-rose-300'
                                    : 'bg-white text-stone-600 border-stone-200 opacity-60'
                                  : isOptionSelected
                                  ? 'bg-amber-100 text-amber-950 border-amber-300 ring-2 ring-amber-400'
                                  : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
                              }`}
                            >
                              <span>{opt}</span>
                              {isSubmitted && optIdx === q.correctIndex && (
                                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isSubmitted && (
                        <div
                          className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                              : 'bg-rose-50 text-rose-950 border border-rose-200'
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          ) : (
                            <HelpCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-black block mb-0.5">
                              {isCorrect ? '🎉 Parabéns! Resposta Exata.' : '💡 Quase lá! Veja a explicação:'}
                            </span>
                            <span className="leading-relaxed">{q.explanation}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
