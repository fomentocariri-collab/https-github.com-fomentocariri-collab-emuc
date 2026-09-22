import React from 'react';
import { PitchDetectionResult, NoteDefinition } from '../types';
import { Volume2, Mic, MicOff, CheckCircle2, ArrowDown, ArrowUp, Sparkles } from 'lucide-react';
import { trumpetAudio } from '../utils/audioEngine';

interface TunerGaugeProps {
  pitch: PitchDetectionResult;
  isListening: boolean;
  onToggleMic: () => void;
  targetNote?: NoteDefinition | null;
  onSelectTargetNote?: (note: NoteDefinition) => void;
  isTrumpetBbMode: boolean;
}

export const TunerGauge: React.FC<TunerGaugeProps> = ({
  pitch,
  isListening,
  onToggleMic,
  targetNote,
  isTrumpetBbMode,
}) => {
  const activeNote = targetNote || pitch.closestNote;
  const cents = pitch.cents;
  const isTooQuiet = pitch.tuningState === 'too_quiet';
  const isInTune = pitch.tuningState === 'perfect' && !isTooQuiet && pitch.frequency > 0;
  const isSharp = pitch.tuningState === 'sharp' && !isTooQuiet;
  const isFlat = pitch.tuningState === 'flat' && !isTooQuiet;

  // Ângulo da agulha no velocímetro (-50 cents = -45 graus, +50 cents = +45 graus)
  const needleAngle = Math.max(-50, Math.min(50, cents)) * 0.9;

  const handlePlayReference = () => {
    if (activeNote) {
      trumpetAudio.playTrumpetTone(activeNote, 1.8);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 p-5 sm:p-7 flex flex-col items-center max-w-xl mx-auto w-full transition-all">
      {/* Barra de Status e Modo */}
      <div className="w-full flex items-center justify-between gap-2 pb-3 mb-2 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isListening ? (isTooQuiet ? 'bg-amber-400 animate-ping' : 'bg-emerald-500 animate-pulse') : 'bg-stone-300'}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            {isListening
              ? isTooQuiet
                ? 'Microfone Ouvindo... (Toque seu Trompete)'
                : 'Detectando Som em Tempo Real'
              : 'Microfone Desligado'}
          </span>
        </div>

        <button
          type="button"
          id="btn-toggle-mic-main"
          onClick={onToggleMic}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            isListening
              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-300'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>Ativar Microfone</span>
            </>
          )}
        </button>
      </div>

      {/* Visor Central de Afinação com Agulha de Alta Precisão */}
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center my-2">
        {/* Arco de Cents */}
        <div className="relative w-64 h-32 overflow-hidden flex items-end justify-center">
          {/* Fundo do arco com faixas de afinação */}
          <div className="absolute top-0 w-64 h-64 rounded-full border-[18px] border-stone-100 box-border" />

          {/* Zona Perfeita (Verde no Centro) */}
          <div className="absolute top-0 w-64 h-64 rounded-full border-[18px] border-emerald-500/90 box-border [clip-path:polygon(42%_0%,58%_0%,55%_50%,45%_50%)]" />

          {/* Zona Bemol (Laranja à esquerda) */}
          <div className="absolute top-0 w-64 h-64 rounded-full border-[18px] border-amber-400/80 box-border [clip-path:polygon(10%_0%,42%_0%,45%_50%,20%_50%)]" />

          {/* Zona Sustenido (Laranja à direita) */}
          <div className="absolute top-0 w-64 h-64 rounded-full border-[18px] border-amber-400/80 box-border [clip-path:polygon(58%_0%,90%_0%,80%_50%,55%_50%)]" />

          {/* Marcadores de graduação (-50, -25, 0, +25, +50) */}
          <div className="absolute bottom-2 left-6 text-[10px] font-bold text-amber-600">-50♭</div>
          <div className="absolute bottom-6 left-16 text-[10px] font-bold text-stone-400">-20</div>
          <div className="absolute top-1 text-xs font-black text-emerald-700">0¢ AFINADO</div>
          <div className="absolute bottom-6 right-16 text-[10px] font-bold text-stone-400">+20</div>
          <div className="absolute bottom-2 right-6 text-[10px] font-bold text-amber-600">+50♯</div>

          {/* Agulha Indicadora Física */}
          <div
            className="absolute bottom-0 w-1.5 h-28 bg-gradient-to-t from-stone-900 to-rose-500 rounded-t-full origin-bottom transition-transform duration-100 ease-out shadow-lg"
            style={{
              transform: `rotate(${isListening && pitch.frequency > 0 ? needleAngle : 0}deg)`,
            }}
          >
            <div className="w-3.5 h-3.5 bg-stone-900 rounded-full -ml-1 mt-24 border-2 border-white shadow" />
          </div>
        </div>

        {/* Cents Numérico */}
        <div className="mt-1 flex items-center gap-1.5 font-mono text-xs font-semibold text-stone-500">
          <span>Desvio:</span>
          <span
            className={`px-2 py-0.5 rounded-md font-bold text-sm ${
              isInTune
                ? 'bg-emerald-100 text-emerald-800'
                : isSharp || isFlat
                ? 'bg-amber-100 text-amber-800'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {isListening && pitch.frequency > 0 ? (cents > 0 ? `+${cents} ¢` : `${cents} ¢`) : '-- ¢'}
          </span>
          <span className="text-[11px] text-stone-400">
            {isListening && pitch.frequency > 0 ? `(${pitch.frequency} Hz)` : ''}
          </span>
        </div>
      </div>

      {/* Caixa de Destaque da Nota no Sistema Solicitado (ABC + Lá-Si-Dó + 1 a 7) */}
      <div className="w-full bg-gradient-to-br from-amber-500/10 via-amber-100/40 to-yellow-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-300/80 my-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Bloco Central da Nota */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-600 to-amber-500 text-white rounded-2xl flex flex-col items-center justify-center shadow-md shadow-amber-600/20 border-2 border-amber-300">
            <span className="text-3xl font-black font-mono leading-none tracking-tight">
              {activeNote.letter}
            </span>
            <span className="text-xs font-bold text-amber-100 uppercase mt-0.5">
              {activeNote.solfege}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-900/70">
                Sistema ABC & Cifras
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-xs">
                Nota {activeNote.numberNotation}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-stone-800 flex items-center gap-2">
              <span>{activeNote.solfege}</span>
              <span className="text-amber-600 font-mono text-lg">({activeNote.letter})</span>
              <span className="text-sm font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg border border-amber-200">
                Nº {activeNote.numberNotation}
              </span>
            </h3>

            <p className="text-xs text-stone-600 mt-0.5">
              Pistões no Trompete: <strong className="text-amber-800">{activeNote.fingerDescription}</strong>
            </p>
          </div>
        </div>

        {/* Botão para ouvir a nota */}
        <button
          type="button"
          id="btn-play-reference-tone"
          onClick={handlePlayReference}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          title="Tocar som de trompete para treinar o ouvido"
        >
          <Volume2 className="w-4 h-4" />
          <span>Ouvir Trompete</span>
        </button>
      </div>

      {/* Mensagem e Dica Didática de Feedback em Tempo Real */}
      <div className="w-full mt-2">
        {isListening ? (
          isTooQuiet ? (
            <div className="flex items-center justify-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Aguardando som... Sopre no bocal do trompete com firmeza.</span>
            </div>
          ) : isInTune ? (
            <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-semibold animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Perfeito! Afinação exata na nota {activeNote.solfege} ({activeNote.letter}={activeNote.numberNotation})! Mantenha a coluna de ar estável.</span>
            </div>
          ) : isFlat ? (
            <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs font-semibold">
              <ArrowUp className="w-4 h-4 text-amber-600 animate-bounce" />
              <span>Afinação Baixa (Bemol ♭): Acelere a velocidade do sopro e firme levemente os cantos dos lábios.</span>
            </div>
          ) : isSharp ? (
            <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs font-semibold">
              <ArrowDown className="w-4 h-4 text-amber-600 animate-bounce" />
              <span>Afinação Alta (Sustenido ♯): Relaxe um pouco a pressão da embocadura e puxe suavemente a pompa geral.</span>
            </div>
          ) : null
        ) : (
          <div className="text-center p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-amber-900 text-xs">
            Toque em <strong>"Ativar Microfone"</strong> para que o app ouça e corrija o seu trompete em tempo real!
          </div>
        )}
      </div>

      {/* Medidor de Estabilidade da Nota Sustentada */}
      {isListening && pitch.frequency > 0 && (
        <div className="w-full mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-semibold text-stone-700">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Sustentação Estável da Nota
            </span>
            <span className="font-mono text-amber-800 font-bold">
              {pitch.stabilityDuration > 0 ? `${pitch.stabilityDuration}s` : '0.0s'}
            </span>
          </div>

          <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                pitch.stabilityDuration >= 2
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (pitch.stabilityDuration / 3) * 100)}%` }}
            />
          </div>

          {pitch.stabilityDuration >= 2 && (
            <p className="text-[11px] text-emerald-700 font-bold text-center mt-0.5">
              Excelente embocadura! Nota sustentada com afinação perfeita! ⭐
            </p>
          )}
        </div>
      )}

      {/* Indicador de Transposição do Instrumento */}
      <div className="mt-3 text-center">
        <span className="text-[11px] text-stone-600 font-medium">
          Configurado para: <strong>{isTrumpetBbMode ? 'Trompete em Si♭ (Partitura padrão)' : 'Som Real / Piano (Concerto em C)'}</strong>
        </span>
      </div>
    </div>
  );
};
