import React, { useState } from 'react';
import { UserProfile, ExerciseLevel } from '../types';
import { userStorage } from '../utils/userStorage';
import { 
  User, UserPlus, Check, Award, Star, BookOpen, Music, 
  ChevronRight, LogOut, Trash2, X, Sparkles, ShieldCheck
} from 'lucide-react';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSelectUser: (user: UserProfile) => void;
}

const AVATAR_OPTIONS = ['🎺', '🎵', '⭐', '👑', '🦁', '🚀', '🎼', '🔥', '🎷', '🏆'];
const COLOR_OPTIONS = [
  { name: 'Âmbar Dourado', bg: 'bg-amber-600', ring: 'ring-amber-500' },
  { name: 'Esmeralda', bg: 'bg-emerald-600', ring: 'ring-emerald-500' },
  { name: 'Azul Real', bg: 'bg-blue-600', ring: 'ring-blue-500' },
  { name: 'Púrpura', bg: 'bg-purple-600', ring: 'ring-purple-500' },
  { name: 'Rubi', bg: 'bg-rose-600', ring: 'ring-rose-500' },
];

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'select' | 'register'>('select');
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => userStorage.getAllUsers());

  // Formulário de Cadastro
  const [newName, setNewName] = useState('');
  const [newTurma, setNewTurma] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAvatar, setNewAvatar] = useState('🎺');
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0].bg);
  const [newLevel, setNewLevel] = useState<ExerciseLevel>('Iniciante');
  const [newIsBb, setNewIsBb] = useState(true);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const refreshUsers = () => {
    setAllUsers(userStorage.getAllUsers());
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setFormError('Por favor, informe o nome do estudante.');
      return;
    }

    const created = userStorage.createUser({
      name: newName,
      turmaOrSchool: newTurma,
      emailOrId: newEmail,
      avatar: newAvatar,
      avatarBg: newColor,
      level: newLevel,
      isTrumpetBb: newIsBb,
    });

    refreshUsers();
    onSelectUser(created);
    onClose();

    // Reset
    setNewName('');
    setNewTurma('');
    setNewEmail('');
    setFormError('');
  };

  const handleDeleteUser = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja realmente remover o perfil deste estudante e seus dados de progresso?')) {
      userStorage.deleteUser(userId);
      const updated = userStorage.getAllUsers();
      setAllUsers(updated);
      if (currentUser?.id === userId) {
        if (updated.length > 0) {
          onSelectUser(updated[0]);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="student-login-modal"
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Cabeçalho do Modal */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
                🎺
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Identificação do Estudante
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Registro de Avanço & Login
                </h2>
              </div>
            </div>

            {currentUser && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-xs sm:text-sm text-amber-100/90 mt-2">
            Cada aluno possui seu próprio histórico de afinação, estrelas acumuladas e progresso no 
            <strong className="text-amber-200 ml-1">Método Da Capo (Intermediário)</strong> e 
            <strong className="text-amber-200 ml-1">Método Arban (Avançado)</strong>.
          </p>

          {/* Abas: Escolher Aluno vs Novo Cadastro */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15">
            <button
              id="tab-login-select-user"
              onClick={() => { setActiveTab('select'); setFormError(''); }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'select'
                  ? 'bg-white text-stone-900 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Estudantes Cadastrados ({allUsers.length})</span>
            </button>

            <button
              id="tab-login-new-user"
              onClick={() => { setActiveTab('register'); setFormError(''); }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-stone-900 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Cadastrar Novo Estudante</span>
            </button>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'select' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
                <span>Selecione seu perfil para registrar seu progresso:</span>
                <span className="text-[11px] text-amber-700">Clique para entrar</span>
              </div>

              <div className="grid gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {allUsers.map((user) => {
                  const isCurrent = currentUser?.id === user.id;
                  const daCapoCompleted = user.completedExerciseIds.filter(id => id.startsWith('dacapo-') || id.startsWith('int-')).length;
                  const arbanCompleted = user.completedExerciseIds.filter(id => id.startsWith('arban-') || id.startsWith('av-')).length;

                  return (
                    <div
                      key={user.id}
                      onClick={() => {
                        onSelectUser(user);
                        onClose();
                      }}
                      className={`group p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-1 ring-amber-400'
                          : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-12 h-12 rounded-2xl ${user.avatarBg} text-white flex items-center justify-center text-xl shadow-sm shrink-0`}>
                          {user.avatar}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-stone-900 text-sm truncate">
                              {user.name}
                            </h4>
                            {isCurrent && (
                              <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                Ativo
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                            <span className="truncate">{user.turmaOrSchool || 'Individual'}</span>
                            <span>•</span>
                            <span className="font-semibold text-amber-800">
                              {user.currentLevel === 'Intermediário'
                                ? 'Método Da Capo'
                                : user.currentLevel === 'Avançado'
                                ? 'Método Arban'
                                : 'Iniciante'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-stone-600 mt-1 font-medium">
                            <span className="flex items-center gap-0.5 text-amber-700 font-bold">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {user.stars} estrelas
                            </span>
                            <span>
                              {user.completedExerciseIds.length} exercícios feitos
                            </span>
                            {daCapoCompleted > 0 && (
                              <span className="text-amber-800 font-bold bg-amber-100/80 px-1.5 py-0.2 rounded">
                                Da Capo: {daCapoCompleted}
                              </span>
                            )}
                            {arbanCompleted > 0 && (
                              <span className="text-emerald-800 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded">
                                Arban: {arbanCompleted}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {allUsers.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteUser(user.id, e)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                            title="Excluir este perfil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center text-stone-500 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botão de Criação Rápida */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Adicionar outro estudante</span>
                </button>

                {currentUser && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors"
                  >
                    Continuar como {currentUser.name.split(' ')[0]}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateUser} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Nome */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nome do Estudante / Trompetista *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pedro Alcantara, Sofia Rocha..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Turma / Escola / Banda */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Banda, Turma ou Conservatório
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Banda Jovem, Turma A"
                    value={newTurma}
                    onChange={(e) => setNewTurma(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    E-mail ou Matrícula (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: aluno@musica.org"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Nível Musical Inicial */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Módulo Inicial de Estudo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewLevel('Iniciante')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      newLevel === 'Iniciante'
                        ? 'border-blue-600 bg-blue-50/80 ring-1 ring-blue-500'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-xs font-black text-stone-900">Iniciante</span>
                    <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">
                      Fundamentos & Sistema 1 a 7
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewLevel('Intermediário')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      newLevel === 'Intermediário'
                        ? 'border-amber-600 bg-amber-50/80 ring-1 ring-amber-500'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-xs font-black text-amber-900">Intermediário</span>
                    <span className="text-[10px] text-amber-700 font-bold block leading-tight mt-0.5">
                      Método Da Capo
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewLevel('Avançado')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      newLevel === 'Avançado'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-500'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-xs font-black text-emerald-900">Avançado</span>
                    <span className="text-[10px] text-emerald-700 font-bold block leading-tight mt-0.5">
                      Método Arban
                    </span>
                  </button>
                </div>
              </div>

              {/* Escolha do Avatar e Cor */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Ícone e Cor do Perfil
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  {AVATAR_OPTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setNewAvatar(item)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-transform ${
                        newAvatar === item
                          ? 'border-amber-600 bg-amber-100 scale-110 shadow-sm'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setNewColor(c.bg)}
                      className={`w-7 h-7 rounded-full ${c.bg} transition-all ${
                        newColor === c.bg ? 'ring-2 ring-offset-2 ' + c.ring : 'opacity-70 hover:opacity-100'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Transposição */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Afinação do Instrumento</span>
                  <span className="text-[11px] text-stone-500">
                    {newIsBb ? 'Trompete em Si♭ (notação tradicional)' : 'Som Real / Dó de Concerto (Piano)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNewIsBb(!newIsBb)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    newIsBb
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {newIsBb ? 'Si♭ (Trompete)' : 'Dó (Som Real)'}
                </button>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('select')}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-100"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  id="btn-save-new-student"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Cadastrar e Começar a Praticar</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
