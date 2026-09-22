import React from 'react';
import {
  Mic,
  Music,
  BookOpen,
  Sliders,
  Edit3,
  Clock,
  Layers,
  Award,
  ChevronRight,
  Sparkles,
  Volume2,
  X,
  Keyboard,
  User,
  GraduationCap
} from 'lucide-react';
import { UserProfile } from '../types';

export type AppModule = 'trompete' | 'piano';

export interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  badge?: string;
}

interface SidebarNavProps {
  activeModule: AppModule;
  onSelectModule: (module: AppModule) => void;
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  userProfile: UserProfile;
  onOpenProfileModal: () => void;
  isMetronomeActive?: boolean;
  onToggleMetronome?: () => void;
  soundTransposition?: 'concert' | 'trumpet_bb';
  onToggleTransposition?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeModule,
  onSelectModule,
  currentTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  userProfile,
  onOpenProfileModal,
  isMetronomeActive,
  onToggleMetronome,
  soundTransposition,
  onToggleTransposition,
}) => {
  const trumpetNavItems: NavItem[] = [
    {
      id: 't_afinador',
      label: 'Afinador & Pistões',
      shortLabel: 'Afinador',
      icon: <Mic className="w-4 h-4 text-amber-500" />,
      badge: 'Ao Vivo',
    },
    {
      id: 't_trompete',
      label: 'Trompete Mecânico',
      shortLabel: 'Trompete',
      icon: <Sliders className="w-4 h-4 text-amber-600" />,
      badge: 'Atalhos PC',
    },
    {
      id: 't_teoria',
      label: 'Teoria do Trompete',
      shortLabel: 'Teoria',
      icon: <BookOpen className="w-4 h-4 text-sky-500" />,
      badge: '3 Níveis',
    },
    {
      id: 't_exercicios',
      label: 'Exercícios (Da Capo & Arban)',
      shortLabel: 'Exercícios',
      icon: <Music className="w-4 h-4 text-emerald-500" />,
      badge: '90+ Lições',
    },
    {
      id: 't_editor',
      label: 'Editor de Partituras',
      shortLabel: 'Partituras',
      icon: <Edit3 className="w-4 h-4 text-purple-500" />,
    },
    {
      id: 't_metronomo',
      label: 'Metrônomo do Trompete',
      shortLabel: 'Metrônomo',
      icon: <Clock className="w-4 h-4 text-rose-500" />,
    },
    {
      id: 't_mapa',
      label: 'Sistema ABC (A=1)',
      shortLabel: 'Sistema ABC',
      icon: <Layers className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 't_metricas',
      label: 'Métricas & Nível',
      shortLabel: 'Métricas',
      icon: <Award className="w-4 h-4 text-amber-500" />,
    },
  ];

  const pianoNavItems: NavItem[] = [
    {
      id: 'p_teclado',
      label: 'Teclado de Piano Completo',
      shortLabel: 'Teclado',
      icon: <Keyboard className="w-4 h-4 text-amber-500" />,
      badge: 'Dó -1 a Si +3',
    },
    {
      id: 'p_teoria',
      label: 'Teoria Musical do Piano',
      shortLabel: 'Teoria',
      icon: <BookOpen className="w-4 h-4 text-sky-500" />,
      badge: '3 Níveis',
    },
    {
      id: 'p_harmonia',
      label: 'Dicionário de Acordes',
      shortLabel: 'Harmonia',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      badge: 'Inversões',
    },
    {
      id: 'p_exercicios',
      label: 'Prática & Dedilhado',
      shortLabel: 'Exercícios',
      icon: <Music className="w-4 h-4 text-emerald-500" />,
      badge: 'MD & ME',
    },
    {
      id: 'p_editor',
      label: 'Editor de Partituras',
      shortLabel: 'Partituras',
      icon: <Edit3 className="w-4 h-4 text-purple-500" />,
    },
    {
      id: 'p_metronomo',
      label: 'Metrônomo do Pianista',
      shortLabel: 'Metrônomo',
      icon: <Clock className="w-4 h-4 text-rose-500" />,
    },
    {
      id: 'p_mapa',
      label: 'Sistema ABC no Teclado',
      shortLabel: 'Sistema ABC',
      icon: <Layers className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'p_metricas',
      label: 'Métricas do Pianista',
      shortLabel: 'Métricas',
      icon: <Award className="w-4 h-4 text-amber-500" />,
    },
  ];

  const currentNavItems = activeModule === 'trompete' ? trumpetNavItems : pianoNavItems;

  return (
    <>
      {/* Backdrop para mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Barra lateral de navegação */}
      <aside
        id="app-sidebar-nav"
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-72 bg-stone-900 text-stone-200 flex flex-col border-r border-stone-800 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* CABEÇALHO DO MENU LATERAL */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md font-black text-xl">
              🎺
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-white">EMUC-EAD</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Cariri
                </span>
              </div>
              <span className="text-[10px] text-stone-400 block font-medium">
                Escola de Música do Cariri
              </span>
            </div>
          </div>

          {/* Fechar botão no mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SELETOR DE MÓDULOS DISTINTOS: TROMPETE VS PIANO */}
        <div className="p-3 border-b border-stone-800/80 bg-stone-950/40">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 px-2 block mb-2">
            Módulos de Ensino:
          </span>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-900/80 rounded-2xl border border-stone-800">
            <button
              type="button"
              id="btn-module-trompete"
              onClick={() => {
                onSelectModule('trompete');
                // Se a aba atual era de piano, mudar para correspondente de trompete
                if (currentTab.startsWith('p_')) {
                  if (currentTab === 'p_teoria') onSelectTab('t_teoria');
                  else if (currentTab === 'p_exercicios') onSelectTab('t_exercicios');
                  else if (currentTab === 'p_editor') onSelectTab('t_editor');
                  else if (currentTab === 'p_metronomo') onSelectTab('t_metronomo');
                  else if (currentTab === 'p_mapa') onSelectTab('t_mapa');
                  else if (currentTab === 'p_metricas') onSelectTab('t_metricas');
                  else onSelectTab('t_afinador');
                }
              }}
              className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                activeModule === 'trompete'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <span className="text-base">🎺</span>
              <span className="leading-none text-[11px]">Trompete</span>
              <span className={`text-[9px] font-medium leading-none ${activeModule === 'trompete' ? 'text-amber-100' : 'text-stone-500'}`}>
                Pistões & Si♭
              </span>
            </button>

            <button
              type="button"
              id="btn-module-piano"
              onClick={() => {
                onSelectModule('piano');
                // Se a aba atual era de trompete, mudar para correspondente de piano
                if (currentTab.startsWith('t_')) {
                  if (currentTab === 't_teoria') onSelectTab('p_teoria');
                  else if (currentTab === 't_exercicios') onSelectTab('p_exercicios');
                  else if (currentTab === 't_editor') onSelectTab('p_editor');
                  else if (currentTab === 't_metronomo') onSelectTab('p_metronomo');
                  else if (currentTab === 't_mapa') onSelectTab('p_mapa');
                  else if (currentTab === 't_metricas') onSelectTab('p_metricas');
                  else onSelectTab('p_teclado');
                }
              }}
              className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                activeModule === 'piano'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <span className="text-base">🎹</span>
              <span className="leading-none text-[11px]">Piano</span>
              <span className={`text-[9px] font-medium leading-none ${activeModule === 'piano' ? 'text-amber-100' : 'text-stone-500'}`}>
                Teclado & Harmonia
              </span>
            </button>
          </div>
        </div>

        {/* LISTA DE NAVEGAÇÃO DO MÓDULO ATIVO */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
              {activeModule === 'trompete' ? 'Ferramentas do Trompete' : 'Ferramentas do Piano'}
            </span>
            <span className="text-[10px] font-bold text-amber-500 font-mono">
              {currentNavItems.length} Seções
            </span>
          </div>

          {currentNavItems.map((item) => {
            const isSelected = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-black'
                    : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-xl ${
                      isSelected ? 'bg-stone-950/20 text-stone-950' : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold shrink-0 ml-1.5 ${
                      isSelected
                        ? 'bg-stone-950 text-amber-300'
                        : 'bg-stone-800 text-amber-400/90 border border-stone-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* RODAPÉ DO MENU LATERAL */}
        <div className="p-3 border-t border-stone-800 bg-stone-950/60 space-y-2">
          {/* Chave de Transposição rápida para Trompete */}
          {activeModule === 'trompete' && onToggleTransposition && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-900 border border-stone-800 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-stone-300">Som do Trompete:</span>
              </div>
              <button
                type="button"
                onClick={onToggleTransposition}
                className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-black cursor-pointer text-[10px]"
              >
                {soundTransposition === 'concert' ? 'Dó (Som Real)' : 'Si♭ (Escrito)'}
              </button>
            </div>
          )}

          {/* Metrônomo Rápido */}
          {onToggleMetronome && (
            <button
              type="button"
              onClick={onToggleMetronome}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                isMetronomeActive
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border-stone-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Metrônomo Rápido</span>
              </div>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isMetronomeActive ? 'bg-rose-500 text-white' : 'bg-stone-800 text-stone-400'}`}>
                {isMetronomeActive ? 'LIGADO' : 'OFF'}
              </span>
            </button>
          )}

          {/* Cartão de Aluno / Perfil */}
          <button
            type="button"
            onClick={onOpenProfileModal}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl ${userProfile.avatarBg || 'bg-amber-600'} flex items-center justify-center font-black text-white text-xs shrink-0`}>
                {userProfile.avatar || '🎺'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-white truncate block">
                  {userProfile.name}
                </span>
                <span className="text-[10px] text-amber-400 font-bold block">
                  Nível {userProfile.currentLevel} • {userProfile.stars} ⭐
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
          </button>
        </div>
      </aside>
    </>
  );
};
