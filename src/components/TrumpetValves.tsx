import React from 'react';

interface TrumpetValvesProps {
  valves: [boolean, boolean, boolean]; // [Pistão 1, Pistão 2, Pistão 3]
  onChange?: (valves: [boolean, boolean, boolean]) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  noteLabel?: string;
}

export const TrumpetValves: React.FC<TrumpetValvesProps> = ({
  valves,
  onChange,
  interactive = false,
  size = 'md',
  noteLabel,
}) => {
  const toggleValve = (index: number) => {
    if (!interactive || !onChange) return;
    const newV: [boolean, boolean, boolean] = [...valves];
    newV[index] = !newV[index];
    onChange(newV);
  };

  const scaleClasses = {
    sm: 'scale-75 origin-center',
    md: 'scale-90 sm:scale-100',
    lg: 'scale-100 sm:scale-110',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center p-3 ${scaleClasses}`}>
      {/* Visual da Caixa de Pistões do Trompete */}
      <div className="relative bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 p-4 rounded-2xl shadow-xl border-4 border-amber-500/80 w-72 max-w-full">
        {/* Cano principal e campana estilizada de fundo */}
        <div className="absolute -top-3 left-4 right-4 h-2 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 rounded-full shadow-sm" />
        <div className="absolute -bottom-3 left-4 right-4 h-2 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 rounded-full shadow-sm" />

        {/* Cabeçalho explicativo dos dedos */}
        <div className="flex justify-between items-center px-4 mb-2 text-amber-100 text-xs font-semibold tracking-wider uppercase">
          <span className="text-center w-16">Pistão 1<br/><span className="text-[10px] text-amber-300 font-normal">Indicador</span></span>
          <span className="text-center w-16">Pistão 2<br/><span className="text-[10px] text-amber-300 font-normal">Médio</span></span>
          <span className="text-center w-16">Pistão 3<br/><span className="text-[10px] text-amber-300 font-normal">Anelar</span></span>
        </div>

        {/* Os 3 Pistões Mecânicos */}
        <div className="flex justify-around items-center gap-3 py-2 px-1 bg-amber-950/40 rounded-xl border border-amber-500/40">
          {[0, 1, 2].map((idx) => {
            const isPressed = valves[idx];
            return (
              <button
                key={idx}
                type="button"
                id={`trumpet-valve-${idx + 1}`}
                onClick={() => toggleValve(idx)}
                disabled={!interactive}
                className={`group flex flex-col items-center focus:outline-none transition-all duration-200 ${
                  interactive ? 'cursor-pointer' : 'cursor-default'
                }`}
                title={`Pistão ${idx + 1} (${isPressed ? 'Pressionado' : 'Solto'})`}
              >
                {/* Haste superior do pistão */}
                <div
                  className={`w-3.5 rounded-t-sm transition-all duration-200 ${
                    isPressed
                      ? 'h-3 bg-amber-200 shadow-inner'
                      : 'h-8 bg-gradient-to-b from-amber-100 to-amber-300 shadow-md'
                  }`}
                />

                {/* Botão pérola onde o dedo aperta */}
                <div
                  className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-bold transition-all duration-200 shadow-lg border-2 ${
                    isPressed
                      ? 'bg-gradient-to-tr from-emerald-500 to-emerald-400 text-white border-emerald-300 scale-95 ring-4 ring-emerald-400/40'
                      : 'bg-gradient-to-tr from-stone-100 via-amber-50 to-stone-200 text-stone-700 border-amber-300/80 hover:border-amber-400'
                  }`}
                >
                  <span className="text-lg leading-none font-black font-mono">
                    {idx + 1}
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-tighter ${isPressed ? 'text-emerald-100' : 'text-stone-500'}`}>
                    {isPressed ? 'Apertado' : 'Solto'}
                  </span>
                </div>

                {/* Tubo inferior da camisa do pistão */}
                <div className="w-10 h-7 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 rounded-b-md border-t border-amber-900 mt-1 flex items-center justify-center shadow-inner">
                  <div className={`w-2 h-2 rounded-full ${isPressed ? 'bg-emerald-400 animate-pulse' : 'bg-amber-800'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Resumo escrito da digitação */}
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-900/60 rounded-full border border-amber-400/30 text-amber-100 text-xs font-medium">
            <span>Posição:</span>
            <span className="font-bold text-amber-200">
              {!valves[0] && !valves[1] && !valves[2]
                ? '0 (Aberto - Nenhum pistão apertado)'
                : [
                    valves[0] ? '1' : null,
                    valves[1] ? '2' : null,
                    valves[2] ? '3' : null,
                  ]
                    .filter(Boolean)
                    .join(' + ')}
            </span>
          </div>
        </div>
      </div>

      {noteLabel && (
        <p className="text-xs text-stone-500 mt-2 font-medium">
          Digitação para: <strong className="text-stone-800">{noteLabel}</strong>
        </p>
      )}
    </div>
  );
};
