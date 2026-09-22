import { UserProfile, ExerciseLevel } from '../types';

const USERS_STORAGE_KEY = 'trumpet_users_database_v2';
const ACTIVE_USER_ID_KEY = 'trumpet_active_user_id_v2';

// Perfis padrão iniciais para o professor/aluno experimentar imediatamente
export const DEFAULT_SAMPLE_USERS: UserProfile[] = [
  {
    id: 'user-lucas-dacapo',
    name: 'Lucas Trompetista',
    emailOrId: 'lucas.trompete@escola.mus.br',
    turmaOrSchool: 'Banda Jovem • Turma B',
    avatar: '🎺',
    avatarBg: 'bg-amber-600',
    currentLevel: 'Intermediário',
    isTrumpetBb: true,
    completedExerciseIds: ['dacapo-01-emissao', 'dacapo-02-intervalos-3a', 'dacapo-03-coral-do-maior'],
    exerciseScores: {
      'dacapo-01-emissao': { stars: 3, accuracy: 96, completedAt: Date.now() - 86400000 },
      'dacapo-02-intervalos-3a': { stars: 3, accuracy: 92, completedAt: Date.now() - 43200000 },
      'dacapo-03-coral-do-maior': { stars: 2, accuracy: 88, completedAt: Date.now() - 10000000 },
    },
    masteredNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'F#4'],
    totalNotesAttempted: 145,
    correctNotesCount: 132,
    longestHoldSeconds: 6.8,
    totalScore: 420,
    stars: 8,
    practiceMinutes: 75,
    streakDays: 4,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 604800000,
  },
  {
    id: 'user-mariana-arban',
    name: 'Mariana Silva',
    emailOrId: 'mariana.sopros@conservatorio.org',
    turmaOrSchool: 'Conservatório de Música',
    avatar: '⭐',
    avatarBg: 'bg-emerald-600',
    currentLevel: 'Avançado',
    isTrumpetBb: true,
    completedExerciseIds: [
      'arban-01-ataque-estudo1',
      'arban-02-subdivisao-estudo11',
      'arban-03-sincope-estudo1',
      'arban-05-flexibilidade-estudo1',
    ],
    exerciseScores: {
      'arban-01-ataque-estudo1': { stars: 3, accuracy: 98, completedAt: Date.now() - 120000000 },
      'arban-02-subdivisao-estudo11': { stars: 3, accuracy: 95, completedAt: Date.now() - 90000000 },
      'arban-03-sincope-estudo1': { stars: 3, accuracy: 94, completedAt: Date.now() - 50000000 },
      'arban-05-flexibilidade-estudo1': { stars: 3, accuracy: 91, completedAt: Date.now() - 20000000 },
    },
    masteredNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'G5', 'F#4', 'Bb4'],
    totalNotesAttempted: 320,
    correctNotesCount: 304,
    longestHoldSeconds: 9.4,
    totalScore: 1150,
    stars: 22,
    practiceMinutes: 180,
    streakDays: 9,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 1209600000,
  },
  {
    id: 'user-joao-iniciante',
    name: 'João Pedro',
    emailOrId: 'joao.iniciante@musica.com',
    turmaOrSchool: 'Iniciação Musical',
    avatar: '🎵',
    avatarBg: 'bg-blue-600',
    currentLevel: 'Iniciante',
    isTrumpetBb: true,
    completedExerciseIds: ['ini-01-c4', 'ini-02-d4'],
    exerciseScores: {
      'ini-01-c4': { stars: 3, accuracy: 94, completedAt: Date.now() - 3600000 },
      'ini-02-d4': { stars: 2, accuracy: 82, completedAt: Date.now() - 1800000 },
    },
    masteredNotes: ['C4', 'D4', 'E4'],
    totalNotesAttempted: 48,
    correctNotesCount: 41,
    longestHoldSeconds: 4.2,
    totalScore: 120,
    stars: 5,
    practiceMinutes: 25,
    streakDays: 2,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 172800000,
  },
];

export const userStorage = {
  // Carregar todos os usuários salvos
  getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler usuários:', e);
    }

    // Inicializar com usuários de exemplo
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_USERS));
    } catch (e) {
      // Ignorar fallback
    }
    return DEFAULT_SAMPLE_USERS;
  },

  // Obter usuário ativo atualmente
  getActiveUser(): UserProfile | null {
    try {
      const activeId = localStorage.getItem(ACTIVE_USER_ID_KEY);
      const allUsers = this.getAllUsers();
      if (activeId) {
        const found = allUsers.find((u) => u.id === activeId);
        if (found) return found;
      }
      // Se não houver ID selecionado, retorna o primeiro usuário de exemplo
      if (allUsers.length > 0) {
        return allUsers[0];
      }
    } catch (e) {
      console.error('Erro ao recuperar usuário ativo:', e);
    }
    return null;
  },

  // Definir qual usuário está logado
  setActiveUserId(userId: string): void {
    try {
      localStorage.setItem(ACTIVE_USER_ID_KEY, userId);
    } catch (e) {
      console.error('Erro ao salvar usuário ativo:', e);
    }
  },

  setActiveUser(userId: string): void {
    this.setActiveUserId(userId);
  },

  // Salvar ou atualizar um perfil de usuário
  saveUser(user: UserProfile): void {
    try {
      const allUsers = this.getAllUsers();
      const existingIdx = allUsers.findIndex((u) => u.id === user.id);
      if (existingIdx >= 0) {
        allUsers[existingIdx] = user;
      } else {
        allUsers.push(user);
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
      this.setActiveUserId(user.id);
    } catch (e) {
      console.error('Erro ao salvar usuário:', e);
    }
  },

  // Criar um novo perfil de estudante
  createUser(params: {
    name: string;
    turmaOrSchool?: string;
    avatar?: string;
    avatarBg?: string;
    level?: ExerciseLevel;
    isTrumpetBb?: boolean;
    emailOrId?: string;
  }): UserProfile {
    const newUser: UserProfile = {
      id: `student-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: params.name.trim() || 'Estudante de Trompete',
      turmaOrSchool: params.turmaOrSchool?.trim() || 'Estudo Individual',
      emailOrId: params.emailOrId?.trim() || '',
      avatar: params.avatar || '🎺',
      avatarBg: params.avatarBg || 'bg-amber-600',
      currentLevel: params.level || 'Iniciante',
      isTrumpetBb: params.isTrumpetBb ?? true,
      completedExerciseIds: [],
      exerciseScores: {},
      masteredNotes: ['C4'],
      totalNotesAttempted: 0,
      correctNotesCount: 0,
      longestHoldSeconds: 0,
      totalScore: 0,
      stars: 0,
      practiceMinutes: 0,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    };

    this.saveUser(newUser);
    return newUser;
  },

  // Registrar conclusão de exercício para o usuário ativo
  recordExerciseCompletion(
    userId: string,
    exerciseId: string,
    accuracy: number,
    stars: number,
    notesCount: number
  ): UserProfile | null {
    const allUsers = this.getAllUsers();
    const user = allUsers.find((u) => u.id === userId);
    if (!user) return null;

    const previousScore = user.exerciseScores[exerciseId];
    const isFirstTime = !user.completedExerciseIds.includes(exerciseId);

    // Atualiza lista de IDs concluídos
    if (isFirstTime) {
      user.completedExerciseIds.push(exerciseId);
    }

    // Atualiza pontuação do exercício (mantém a melhor)
    const bestStars = Math.max(previousScore?.stars || 0, stars);
    const bestAccuracy = Math.max(previousScore?.accuracy || 0, accuracy);

    user.exerciseScores[exerciseId] = {
      stars: bestStars,
      accuracy: bestAccuracy,
      completedAt: Date.now(),
    };

    // Atualiza métricas globais do aluno
    user.totalNotesAttempted += notesCount;
    user.correctNotesCount += Math.round((notesCount * accuracy) / 100);
    user.totalScore += Math.round(accuracy * 1.5) + stars * 20;

    // Recalcula total de estrelas
    user.stars = Object.values(user.exerciseScores).reduce((acc, curr) => acc + curr.stars, 0);

    // Atualiza tempo de prática (estimativa: 2 min por exercício concluído)
    user.practiceMinutes += 2;

    // Atualiza streak
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate !== today) {
      user.streakDays += 1;
      user.lastActiveDate = today;
    }

    this.saveUser(user);
    return user;
  },

  // Registrar nota dominada
  recordMasteredNote(userId: string, noteId: string, holdSeconds: number): UserProfile | null {
    const allUsers = this.getAllUsers();
    const user = allUsers.find((u) => u.id === userId);
    if (!user) return null;

    if (!user.masteredNotes.includes(noteId)) {
      user.masteredNotes.push(noteId);
    }

    user.longestHoldSeconds = Math.max(user.longestHoldSeconds, holdSeconds);
    user.totalNotesAttempted += 1;
    user.correctNotesCount += 1;
    user.totalScore += 10;

    this.saveUser(user);
    return user;
  },

  // Excluir perfil de usuário
  deleteUser(userId: string): void {
    const allUsers = this.getAllUsers().filter((u) => u.id !== userId);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
      const activeId = localStorage.getItem(ACTIVE_USER_ID_KEY);
      if (activeId === userId) {
        if (allUsers.length > 0) {
          this.setActiveUserId(allUsers[0].id);
        } else {
          localStorage.removeItem(ACTIVE_USER_ID_KEY);
        }
      }
    } catch (e) {
      console.error('Erro ao deletar usuário:', e);
    }
  },
};
