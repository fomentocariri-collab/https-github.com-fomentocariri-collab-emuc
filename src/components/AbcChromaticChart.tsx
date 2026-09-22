import React, { useState } from 'react';
import { CHROMATIC_12_NOTES, TRUMPET_NOTES } from '../data/trumpetData';
import { NoteDefinition } from '../types';
import { Volume2, Music2, BookOpen, Sparkles, Check, HelpCircle } from 'lucide-react';
import { trumpetAudio } from '../utils/audioEngine';

interface AbcChromaticChartProps {
  onSelectNote: (note: NoteDefinition) => void;
  selectedNoteId?: string;
}

export const AbcChromaticChart: React.FC<AbcChromaticChartProps> = ({
  onSelectNote,
  selectedNoteId,
}) => {
  const [activeTab, setActiveTab] = useState<'tabela' | 'cromatica' | 'jogo'>('tabela');
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswerFeedback, setQuizAnswerFeedback] = useState<string | null>(null);

  // Cores alegres e consistentes para cada nota no sistema 1 a 7
  const noteColors: Record<string, { bg: string; text: string; border: string }> = {
    '1': { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-400' },
    '2': { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-400' },
    '3': { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-400' },
    '4': { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-400' },
    '5': { bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-400' },
    '6': { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-400' },
    '7': { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-400' },
  };

  const playNote = (note: NoteDefinition) => {
    trumpetAudio.playTrumpetTone(note, 1.4);
    onSelectNote(note);
  };

  // Perguntas rápidas e divertidas para fixação infantil e adulta
  const quizQuestions = [
    {
      question: 'No sistema vinculado ABC, qual é a letra e o nome da NOTA 1?',
      options: ['A = Lá', 'C = Dó', 'F = Fá', 'E = Mi'],
      correct: 0,
      explanation: 'Exato! A é a 1ª letra do alfabeto, vinculada à nota Lá (A = Lá = 1).'
    },
    {
      question: 'Qual é o número correspondente à nota DÓ (C)?',
      options: ['Nota 1', 'Nota 3', 'Nota 5', 'Nota 7'],
      correct: 1,
      explanation: 'Correto! C é a 3ª letra, logo C = Dó = 3!'
    },
    {
      question: 'No trompete em Si♭, como se toca a nota Dó central (C4 / 3)?',
      options: ['Aberto (nenhum pistão apertado)', 'Pistões 1 e 2', 'Apenas Pistão 1', 'Todos os 3 pistões'],
      correct: 0,
      explanation: 'Muito bem! O Dó central (3) é tocado com o trompete aberto (0 pistões)!'
    },
    {
      question: 'Se A = Lá = 1 e B = Si = 2, qual é a nota 4 (letra D)?',
      options: ['Sol', 'Fá', 'Ré', 'Mi'],
      correct: 2,
      explanation: 'Perfeito! D = Ré = 4!'
    },
  ];

  const handleQuizAnswer = (optionIdx: number) => {
    const q = quizQuestions[quizQuestionIndex];
    if (optionIdx === q.correct) {
      setQuizScore((prev) => prev + 10);
      setQuizAnswerFeedback(`🎉 Acertou! ${q.explanation}`);
    } else {
      setQuizAnswerFeedback(`💡 Quase lá! A resposta correta era "${q.options[q.correct]}". ${q.explanation}`);
    }
  };

  const nextQuizQuestion = () => {
    setQuizAnswerFeedback(null);
    setQuizQuestionIndex((prev) => (prev + 1) % quizQuestions.length);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 p-5 sm:p-7 max-w-4xl mx-auto w-full">
      {/* Cabeçalho Didático com Abas */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Método Didático: ABC + Cifras + Escala Cromática</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            Mapeamento Musical (A = Lá = 1)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Aprenda a ler cifras e partituras relacionando letras, nomes e números aos pistões do trompete.
          </p>
        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('tabela')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tabela' ? 'bg-white text-amber-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Regra 1 a 7 (ABC)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cromatica')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'cromatica' ? 'bg-white text-amber-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Escala Cromática (12 Notas)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jogo')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'jogo' ? 'bg-white text-amber-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Quiz Rápido 🎯
          </button>
        </div>
      </div>

      {/* CONTEÚDO DA ABA 1: TABELA ABC (A=Lá=1) */}
      {activeTab === 'tabela' && (
        <div className="space-y-6">
          {/* Card explicativo amigável para todas as idades */}
          <div className="bg-amber-500/10 border-2 border-amber-300 rounded-2xl p-4 sm:p-5">
            <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Como funciona o Sistema de Cifras Vinculado?
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
              No método musical, as letras do alfabeto <strong>A, B, C, D, E, F, G</strong> iniciam tradicionalmente na nota <strong>Lá</strong>.
              Para facilitar o aprendizado de crianças e iniciantes, vinculamos cada nota a um número de <strong>1 a 7</strong>.
              Assim, ao ver uma cifra ou tocar trompete, você memoriza com o triplo de facilidade!
            </p>
          </div>

          {/* Os 7 Cards das Notas Fundamentais (A=1 a G=7) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {[
              { letter: 'A', solfege: 'Lá', num: '1', trumpetFingering: '1 e 2', noteId: 'A4', desc: '440Hz Padrão' },
              { letter: 'B', solfege: 'Si', num: '2', trumpetFingering: 'Pistão 2', noteId: 'B4', desc: 'Dedo Médio' },
              { letter: 'C', solfege: 'Dó', num: '3', trumpetFingering: 'Aberto (0)', noteId: 'C4', desc: 'Nota Fundamental' },
              { letter: 'D', solfege: 'Ré', num: '4', trumpetFingering: '1 e 3', noteId: 'D4', desc: 'Indicador e Anelar' },
              { letter: 'E', solfege: 'Mi', num: '5', trumpetFingering: '1 e 2', noteId: 'E4', desc: 'Dois Primeiros' },
              { letter: 'F', solfege: 'Fá', num: '6', trumpetFingering: 'Pistão 1', noteId: 'F4', desc: 'Apenas Indicador' },
              { letter: 'G', solfege: 'Sol', num: '7', trumpetFingering: 'Aberto (0)', noteId: 'G4', desc: 'Aberto Natural' },
            ].map((item) => {
              const matchedNote = TRUMPET_NOTES.find((n) => n.id === item.noteId) || TRUMPET_NOTES[6];
              const isSelected = selectedNoteId === item.noteId;

              return (
                <div
                  key={item.letter}
                  className={`group relative rounded-2xl p-3 sm:p-4 border-2 transition-all flex flex-col items-center justify-between ${
                    isSelected
                      ? 'bg-amber-100/80 border-amber-500 shadow-md ring-2 ring-amber-400'
                      : 'bg-stone-50/70 border-stone-200 hover:border-amber-400 hover:bg-white'
                  }`}
                >
                  {/* Número grande no topo */}
                  <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                    {item.num}
                  </div>

                  {/* Letra e Solfejo */}
                  <div className="my-2 text-center">
                    <span className="text-3xl font-black font-mono text-stone-900 block leading-none">
                      {item.letter}
                    </span>
                    <span className="text-sm font-extrabold text-amber-700 block mt-1">
                      {item.solfege}
                    </span>
                  </div>

                  {/* Pistões do trompete */}
                  <div className="text-center w-full pt-2 border-t border-stone-200/60 text-[11px] text-stone-600">
                    <span className="block font-bold text-stone-800">Pistões:</span>
                    <span className="text-[10px] text-amber-800 font-semibold">{item.trumpetFingering}</span>
                  </div>

                  {/* Botões de Ação */}
                  <div className="mt-3 flex items-center gap-1.5 w-full">
                    <button
                      type="button"
                      onClick={() => playNote(matchedNote)}
                      className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
                      title="Ouvir som"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Ouvir</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dica de Memorização Musical */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3 text-xs text-stone-600">
            <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs">
              💡
            </div>
            <div>
              <p className="font-semibold text-stone-800">
                Regra Prática para Crianças e Adultos:
              </p>
              <p className="mt-0.5 leading-relaxed">
                Quando você ler uma cifra musical como <strong>C</strong>, lembre-se: é a nota <strong>Dó</strong> e o número <strong>3</strong>!
                Ao tocar no trompete, nenhuma válvula precisa ser pressionada (Aberto / 0). É a nota de partida dos maiores trompetistas!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: ESCALA CROMÁTICA COMPLETA (12 SEMITONS) */}
      {activeTab === 'cromatica' && (
        <div className="space-y-5">
          <div className="p-3.5 bg-cyan-50 border border-cyan-200 rounded-2xl text-xs text-cyan-900 leading-relaxed">
            <strong>O que é a Escala Cromática?</strong> É a reunião de todos os 12 sons da música ocidental divididos em semitons (meio tom).
            Inclui as notas naturais e as alterações com <strong>Sustenido (#)</strong> [sobe meio tom] e <strong>Bemol (b)</strong> [desce meio tom].
          </div>

          {/* Grade com os 12 semitons cromáticos com os números vinculados */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CHROMATIC_12_NOTES.map((chroma) => {
              // Buscar nota correspondente no trompete (ex: oitava 4)
              const matchedTrumpetNote =
                TRUMPET_NOTES.find((n) => n.letter === chroma.letter && n.octave === 4) ||
                TRUMPET_NOTES.find((n) => n.letter === chroma.letter) ||
                TRUMPET_NOTES[0];

              const isSelected = selectedNoteId === matchedTrumpetNote.id;

              return (
                <div
                  key={chroma.letter}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400'
                      : 'bg-stone-50/80 border-stone-200 hover:border-amber-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-black">
                      Nº {chroma.numberNotation}
                      {chroma.altNumber ? ` / ${chroma.altNumber}` : ''}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      Semitom {chroma.semitoneIndex}
                    </span>
                  </div>

                  <div className="my-2 text-center">
                    <h4 className="text-2xl font-black font-mono text-stone-900">
                      {chroma.letter}
                      {chroma.altLetter ? <span className="text-sm font-normal text-stone-500"> / {chroma.altLetter}</span> : null}
                    </h4>
                    <p className="text-xs font-bold text-amber-800 mt-0.5">
                      {chroma.solfege}
                      {chroma.altSolfege ? ` ou ${chroma.altSolfege}` : ''}
                    </p>
                  </div>

                  <div className="text-[11px] text-stone-600 bg-white/70 p-2 rounded-xl border border-stone-200/60 mb-2 text-center">
                    <span className="font-semibold text-stone-800">Pistões: </span>
                    <span className="text-amber-800 font-bold">{matchedTrumpetNote.fingerDescription}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => playNote(matchedTrumpetNote)}
                    className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ouvir e Selecionar</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 3: QUIZ RÁPIDO PARA CRIANÇAS E INICIANTES */}
      {activeTab === 'jogo' && (
        <div className="max-w-xl mx-auto space-y-5 py-2">
          <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-200">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Jogo de Memorização</span>
              <h3 className="text-base font-black text-amber-950">Pergunta {quizQuestionIndex + 1} de {quizQuestions.length}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-stone-600">Pontuação</span>
              <div className="text-xl font-black text-amber-700">{quizScore} pts ⭐</div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border-2 border-stone-200 shadow-sm">
            <h4 className="text-base font-bold text-stone-900 mb-4 leading-snug">
              {quizQuestions[quizQuestionIndex].question}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quizQuestions[quizQuestionIndex].options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuizAnswer(i)}
                  disabled={quizAnswerFeedback !== null}
                  className="p-3 rounded-xl border-2 border-stone-200 hover:border-amber-500 hover:bg-amber-50 font-bold text-stone-800 text-left text-sm transition-all active:scale-98 disabled:opacity-80"
                >
                  <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-stone-100 text-xs font-black mr-2 text-stone-600">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {quizAnswerFeedback && (
              <div className="mt-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium text-stone-800 animate-fadeIn">
                <p>{quizAnswerFeedback}</p>
                <button
                  type="button"
                  onClick={nextQuizQuestion}
                  className="mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Próxima Pergunta</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
