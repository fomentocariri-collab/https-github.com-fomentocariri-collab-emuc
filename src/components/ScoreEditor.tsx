import React, { useState, useEffect } from 'react';
import { 
  Play, Square, Save, Plus, Trash2, ArrowLeft, ArrowRight, Download, 
  Upload, Copy, Music, Sparkles, BookOpen, AlertCircle, CheckCircle, RefreshCw, Keyboard
} from 'lucide-react';
import { NoteDefinition, SavedScore, SongExercise, ExerciseNote, ExerciseLevel } from '../types';
import { TRUMPET_NOTES, CHROMATIC_12_NOTES } from '../data/trumpetData';
import { trumpetAudio } from '../utils/audioEngine';
import { TrumpetValves } from './TrumpetValves';
import { PianoKeyboardPanel } from './PianoKeyboardPanel';
import { TrumpetKeyboardPanel } from './TrumpetKeyboardPanel';
import { VisualStaffEditor, StaffNoteItem, RhythmicFigure, ClefType } from './VisualStaffEditor';

interface ScoreEditorProps {
  onPracticeCustomScore?: (exercise: SongExercise) => void;
}

const LOCAL_STORAGE_KEY = 'trumpet_master_user_scores_v1';

export const ScoreEditor: React.FC<ScoreEditorProps> = ({ onPracticeCustomScore }) => {
  // Estado da partitura atual
  const [currentScoreId, setCurrentScoreId] = useState<string>('');
  const [title, setTitle] = useState<string>('Meu Novo Estudo de Trompete');
  const [author, setAuthor] = useState<string>('Estudante');
  const [level, setLevel] = useState<ExerciseLevel>('Iniciante');
  const [bpm, setBpm] = useState<number>(90);
  const [timeSignature, setTimeSignature] = useState<string>('4/4');

  // Modo do Editor: 'staff' (Pentagrama Interativo com figuras rítmicas), 'keyboard' (Atalhos PC), 'form' (Lista/Manual)
  const [editorMode, setEditorMode] = useState<'staff' | 'keyboard' | 'form'>('staff');
  const [activeClef, setActiveClef] = useState<ClefType>('sol');

  // Conversão de ExerciseNote para item do pentagrama
  const exerciseNoteToStaffItem = (n: ExerciseNote, idx: number): StaffNoteItem => {
    const isRest = n.noteId === 'REST';
    const dur = n.duration;
    let figure: RhythmicFigure = 'seminima';
    let dotted = false;

    if (dur >= 8) {
      figure = 'breve';
    } else if (dur >= 6) {
      figure = 'semibreve';
      dotted = true;
    } else if (dur >= 4) {
      figure = 'semibreve';
    } else if (dur >= 3) {
      figure = 'minima';
      dotted = true;
    } else if (dur >= 2) {
      figure = 'minima';
    } else if (dur >= 1.5) {
      figure = 'seminima';
      dotted = true;
    } else if (dur >= 1) {
      figure = 'seminima';
    } else if (dur >= 0.75) {
      figure = 'colcheia';
      dotted = true;
    } else if (dur >= 0.5) {
      figure = 'colcheia';
    } else {
      figure = 'semicolcheia';
    }

    const isSharp = n.noteId.includes('#');
    const isFlat = n.noteId.includes('b');
    const accidental = isSharp ? 'sharp' : isFlat ? 'flat' : 'none';

    return {
      id: `sn-${idx}-${n.noteId}-${Math.random().toString(36).substr(2, 4)}`,
      noteId: n.noteId,
      isRest,
      figure,
      beats: n.duration,
      dotted,
      accidental,
      customTip: n.lyricOrTip,
    };
  };

  const initialNotes: ExerciseNote[] = [
    { noteId: 'C4', duration: 2, lyricOrTip: 'Dó [3] - Aberto' },
    { noteId: 'D4', duration: 2, lyricOrTip: 'Ré [4] - Pistões 1 e 3' },
    { noteId: 'E4', duration: 2, lyricOrTip: 'Mi [5] - Pistões 1 e 2' },
    { noteId: 'C4', duration: 4, lyricOrTip: 'Dó [3] - Final' },
  ];

  const [notes, setNotes] = useState<ExerciseNote[]>(initialNotes);
  const [staffNotes, setStaffNotes] = useState<StaffNoteItem[]>(() =>
    initialNotes.map(exerciseNoteToStaffItem)
  );

  // Sincronizar alterações originadas no Pentagrama
  const handleStaffNotesChange = (updatedStaff: StaffNoteItem[]) => {
    setStaffNotes(updatedStaff);
    const updatedNotes: ExerciseNote[] = updatedStaff.map((s) => ({
      noteId: s.isRest ? 'REST' : s.noteId,
      duration: s.beats,
      lyricOrTip: s.customTip || (s.isRest ? 'Pausa' : s.noteId),
    }));
    setNotes(updatedNotes);
  };

  // Helper para atualizar notas em ambos os estados
  const applyNotesUpdate = (newNotes: ExerciseNote[]) => {
    setNotes(newNotes);
    setStaffNotes(newNotes.map(exerciseNoteToStaffItem));
  };

  // Seletor de inserção
  const [selectedNoteId, setSelectedNoteId] = useState<string>('C4');
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [noteTipInput, setNoteTipInput] = useState<string>('');

  // Reprodução
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // Lista de partituras salvas
  const [savedScores, setSavedScores] = useState<SavedScore[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [showKeyboardHelper, setShowKeyboardHelper] = useState<boolean>(true);
  const [keyboardHelperType, setKeyboardHelperType] = useState<'trumpet' | 'piano'>('trumpet');

  // Carregar partituras salvas do localStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setSavedScores(parsed);
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar partituras:', e);
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const getNoteDef = (id: string): NoteDefinition => {
    return TRUMPET_NOTES.find((n) => n.id === id) || TRUMPET_NOTES[6]; // C4 fallback
  };

  // Adicionar nota à partitura
  const handleAddNote = () => {
    const noteDef = getNoteDef(selectedNoteId);
    const defaultTip = `${noteDef.solfege} [${noteDef.numberNotation}] - ${noteDef.fingerDescription}`;
    const newNote: ExerciseNote = {
      noteId: selectedNoteId,
      duration: selectedDuration,
      lyricOrTip: noteTipInput.trim() || defaultTip,
    };
    applyNotesUpdate([...notes, newNote]);
    setNoteTipInput('');

    // Tocar a nota selecionada para feedback imediato do aluno
    trumpetAudio.playTrumpetTone(noteDef, 0.4);
  };

  // Inserir nota vinda do Teclado de Piano ou Atalhos PC
  const handleInsertNoteFromPiano = (noteDef: NoteDefinition, duration: number) => {
    const defaultTip = `${noteDef.solfege} [${noteDef.numberNotation}] - ${noteDef.fingerDescription}`;
    const newNote: ExerciseNote = {
      noteId: noteDef.id,
      duration: duration || selectedDuration,
      lyricOrTip: defaultTip,
    };
    applyNotesUpdate([...notes, newNote]);
    setSelectedNoteId(noteDef.id);
    showNotification(`Nota ${noteDef.solfege} [${noteDef.numberNotation}] adicionada!`, 'success');
  };

  // Remover nota
  const handleRemoveNote = (index: number) => {
    applyNotesUpdate(notes.filter((_, i) => i !== index));
  };

  // Mover nota na timeline
  const handleMoveNote = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= notes.length) return;

    const updated = [...notes];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    applyNotesUpdate(updated);
  };

  // Salvar no localStorage
  const handleSaveScore = () => {
    if (!title.trim()) {
      showNotification('Digite um título para a partitura', 'info');
      return;
    }
    if (notes.length === 0) {
      showNotification('Adicione pelo menos uma nota na partitura', 'info');
      return;
    }

    const scoreId = currentScoreId || `score-${Date.now()}`;
    const newScore: SavedScore = {
      id: scoreId,
      title: title.trim(),
      author: author.trim() || 'Estudante',
      level,
      bpm,
      timeSignature,
      createdAt: currentScoreId ? savedScores.find(s => s.id === currentScoreId)?.createdAt || Date.now() : Date.now(),
      updatedAt: Date.now(),
      notes,
    };

    const existingIndex = savedScores.findIndex((s) => s.id === scoreId);
    let updatedList: SavedScore[];
    if (existingIndex >= 0) {
      updatedList = [...savedScores];
      updatedList[existingIndex] = newScore;
    } else {
      updatedList = [newScore, ...savedScores];
    }

    setSavedScores(updatedList);
    setCurrentScoreId(scoreId);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
      showNotification(`Partitura "${newScore.title}" salva com sucesso!`);
    } catch (e) {
      console.error('Erro ao salvar partitura:', e);
    }
  };

  // Carregar partitura salva
  const handleLoadScore = (score: SavedScore) => {
    handleStopPlayback();
    setCurrentScoreId(score.id);
    setTitle(score.title);
    setAuthor(score.author || 'Estudante');
    setLevel(score.level);
    setBpm(score.bpm || 90);
    setTimeSignature(score.timeSignature || '4/4');
    applyNotesUpdate(score.notes);
    showNotification(`Partitura "${score.title}" carregada!`, 'info');
  };

  // Excluir partitura salva
  const handleDeleteSavedScore = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedScores.filter((s) => s.id !== id);
    setSavedScores(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      if (currentScoreId === id) {
        setCurrentScoreId('');
      }
      showNotification('Partitura excluída da biblioteca.', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  // Nova partitura limpa
  const handleNewScore = () => {
    handleStopPlayback();
    setCurrentScoreId('');
    setTitle('Nova Composição de Trompete');
    setAuthor('Estudante');
    setLevel('Iniciante');
    setBpm(90);
    setTimeSignature('4/4');
    applyNotesUpdate([]);
    showNotification('Nova partitura criada em branco.', 'info');
  };

  // Reproduzir com o sintetizador de trompete
  const handlePlayScore = () => {
    if (notes.length === 0) return;

    if (isPlaying) {
      handleStopPlayback();
      return;
    }

    setIsPlaying(true);
    const secondsPerBeat = 60 / bpm;

    const sequence = notes.map((n) => ({
      note: getNoteDef(n.noteId),
      durationSeconds: n.duration * secondsPerBeat,
    }));

    trumpetAudio.playScoreMelody(
      sequence,
      (highlightIdx) => {
        setPlayingIndex(highlightIdx);
      },
      () => {
        setIsPlaying(false);
        setPlayingIndex(null);
      }
    );
  };

  const handleStopPlayback = () => {
    trumpetAudio.stopScoreMelody();
    setIsPlaying(false);
    setPlayingIndex(null);
  };

  // Exportar partitura para arquivo JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({
        title,
        author,
        level,
        bpm,
        timeSignature,
        notes,
        exportedAt: new Date().toISOString(),
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${title.replace(/\s+/g, '_')}_trompete.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Arquivo de partitura baixado com sucesso!');
  };

  // Importar partitura de arquivo JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.notes && Array.isArray(imported.notes)) {
          setTitle(imported.title || 'Partitura Importada');
          setAuthor(imported.author || 'Autor Desconhecido');
          setLevel(imported.level || 'Iniciante');
          setBpm(imported.bpm || 90);
          setTimeSignature(imported.timeSignature || '4/4');
          applyNotesUpdate(imported.notes);
          setCurrentScoreId('');
          showNotification('Partitura importada com sucesso!');
        } else {
          showNotification('Formato de arquivo inválido.', 'info');
        }
      } catch (err) {
        showNotification('Erro ao ler arquivo JSON.', 'info');
      }
    };
    reader.readAsText(file);
  };

  // Praticar partitura criada
  const handlePracticeCurrent = () => {
    if (notes.length === 0) {
      showNotification('Adicione notas antes de praticar.', 'info');
      return;
    }
    if (onPracticeCustomScore) {
      const customExercise: SongExercise = {
        id: currentScoreId || `custom-${Date.now()}`,
        title: title || 'Minha Partitura',
        difficulty: level,
        level,
        category: 'Partitura Autoral',
        description: `Criado por ${author}. Cifras ABC com indicação de pistões.`,
        notes,
        bpm,
        timeSignature,
      };
      onPracticeCustomScore(customExercise);
    }
  };

  // Modelos prontos da internet para inspiração rápida
  const loadTemplate = (templateName: string) => {
    handleStopPlayback();
    if (templateName === 'escala') {
      setTitle('Escala de Dó Maior Completa (3 a 3)');
      setLevel('Iniciante');
      setBpm(80);
      applyNotesUpdate([
        { noteId: 'C4', duration: 1, lyricOrTip: 'Dó [3] (0)' },
        { noteId: 'D4', duration: 1, lyricOrTip: 'Ré [4] (1,3)' },
        { noteId: 'E4', duration: 1, lyricOrTip: 'Mi [5] (1,2)' },
        { noteId: 'F4', duration: 1, lyricOrTip: 'Fá [6] (1)' },
        { noteId: 'G4', duration: 1, lyricOrTip: 'Sol [7] (0)' },
        { noteId: 'A4', duration: 1, lyricOrTip: 'Lá [1] (1,2)' },
        { noteId: 'B4', duration: 1, lyricOrTip: 'Si [2] (2)' },
        { noteId: 'C5', duration: 2, lyricOrTip: 'Dó Agudo [3] (0)!' },
      ]);
    } else if (templateName === 'arban') {
      setTitle('Arban: Fanfarra de Abertura');
      setLevel('Intermediário');
      setBpm(104);
      applyNotesUpdate([
        { noteId: 'C4', duration: 1, lyricOrTip: 'Dó [3]' },
        { noteId: 'E4', duration: 1, lyricOrTip: 'Mi [5]' },
        { noteId: 'G4', duration: 2, lyricOrTip: 'Sol [7]' },
        { noteId: 'C5', duration: 1, lyricOrTip: 'Dó [3]' },
        { noteId: 'G4', duration: 1, lyricOrTip: 'Sol [7]' },
        { noteId: 'C5', duration: 3, lyricOrTip: 'Dó [3] Triunfal' },
      ]);
    } else if (templateName === 'asa-branca') {
      setTitle('Asa Branca (Tema Simplificado)');
      setLevel('Iniciante');
      setBpm(96);
      applyNotesUpdate([
        { noteId: 'G4', duration: 1, lyricOrTip: 'Quan- [7]' },
        { noteId: 'A4', duration: 1, lyricOrTip: 'doi- [1]' },
        { noteId: 'B4', duration: 1, lyricOrTip: 'lhei [2]' },
        { noteId: 'D5', duration: 2, lyricOrTip: 'a terra [4]' },
        { noteId: 'B4', duration: 1, lyricOrTip: 'ar- [2]' },
        { noteId: 'C5', duration: 3, lyricOrTip: 'dendo [3]' },
      ]);
    }
    showNotification(`Modelo "${templateName}" carregado no editor!`, 'info');
  };

  const selectedNoteDef = getNoteDef(selectedNoteId);

  return (
    <div id="score-editor-root" className="space-y-6">
      {/* Notificação Flutuante */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between text-sm shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Cabeçalho do Editor */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800">
                Criador & Editor
              </span>
              <h2 className="text-xl font-bold text-slate-900">Editor de Partituras para Trompete</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Escreva partituras com cifras ABC (A=1 a G=7), posições de pistões, execute o som em tempo real e salve seus exercícios.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="new-score-btn"
              onClick={handleNewScore}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Novo
            </button>

            <button
              id="save-score-btn"
              onClick={handleSaveScore}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Partitura
            </button>

            <button
              id="export-score-btn"
              onClick={handleExportJSON}
              className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              title="Baixar arquivo JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <label className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer" title="Importar arquivo JSON">
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>

        {/* Metadados da Partitura */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Título da Obra / Exercício</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Hino Triunfal em Dó"
              className="w-full px-3 py-2 text-sm font-semibold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Autor / Compositor</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex: Seu Nome"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nível Sugerido</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as ExerciseLevel)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Andamento (BPM)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="40"
                max="220"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-xs text-slate-500 font-semibold">BPM</span>
            </div>
          </div>
        </div>

        {/* Modelos Prontos para Carregar Rápido */}
        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 flex-wrap text-xs">
          <span className="font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Modelos de Inspiração:
          </span>
          <button
            onClick={() => loadTemplate('escala')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-semibold border border-amber-200 transition-colors"
          >
            Escala Completa
          </button>
          <button
            onClick={() => loadTemplate('arban')}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-semibold border border-blue-200 transition-colors"
          >
            Arban Fanfarra
          </button>
          <button
            onClick={() => loadTemplate('asa-branca')}
            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-semibold border border-emerald-200 transition-colors"
          >
            Asa Branca
          </button>
        </div>
      </div>

      {/* SELETOR PRINCIPAL DE MODO DO EDITOR */}
      <div className="bg-white border border-stone-200 rounded-2xl p-2 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            id="editor-mode-staff-btn"
            onClick={() => setEditorMode('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              editorMode === 'staff'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <span className="text-base leading-none">🎼</span>
            <span>Pentagrama Visual (Breve, Semibreve, Mínima, Colcheia...)</span>
          </button>

          <button
            type="button"
            id="editor-mode-keyboard-btn"
            onClick={() => setEditorMode('keyboard')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              editorMode === 'keyboard'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Teclado Interativo com Atalhos PC</span>
          </button>

          <button
            type="button"
            id="editor-mode-form-btn"
            onClick={() => setEditorMode('form')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              editorMode === 'form'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Inserção Manual</span>
          </button>
        </div>

        <div className="text-xs font-bold text-stone-500 px-2 hidden md:inline">
          {notes.length} {notes.length === 1 ? 'nota' : 'notas'} na partitura
        </div>
      </div>

      {/* 1. MODO PENTAGRAMA VISUAL (Pauta com 5 linhas, 4 espaços, Claves, Breve, Semibreve, Mínima, Semínima, Colcheia, Pausas) */}
      {editorMode === 'staff' && (
        <VisualStaffEditor
          notes={staffNotes}
          onChangeNotes={handleStaffNotesChange}
          timeSignature={timeSignature}
          bpm={bpm}
          clef={activeClef}
          onChangeClef={setActiveClef}
          playbackInstrument="trompete"
        />
      )}

      {/* 2. MODO TECLADO DE TROMPETE / PIANO COM ATALHOS PC */}
      {editorMode === 'keyboard' && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <Keyboard className="w-4 h-4 text-amber-600" />
                Composição com Atalhos de PC (QWERT / ASDFG / ZXCVB)
              </span>
              <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs font-bold">
                <button
                  type="button"
                  id="score-helper-type-trumpet"
                  onClick={() => setKeyboardHelperType('trumpet')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    keyboardHelperType === 'trumpet'
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>🎺</span>
                  <span>Trompete</span>
                </button>
                <button
                  type="button"
                  id="score-helper-type-piano"
                  onClick={() => setKeyboardHelperType('piano')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    keyboardHelperType === 'piano'
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>🎹</span>
                  <span>Piano</span>
                </button>
              </div>
            </div>
          </div>

          {keyboardHelperType === 'trumpet' ? (
            <TrumpetKeyboardPanel
              scoreEditorActive={true}
              targetNoteId={selectedNoteId}
              onSelectTargetNote={(n) => setSelectedNoteId(n.id)}
              onInsertNoteToScore={handleInsertNoteFromPiano}
              activeContext="score"
            />
          ) : (
            <PianoKeyboardPanel
              scoreEditorActive={true}
              targetNoteId={selectedNoteId}
              onSelectTargetNote={(n) => setSelectedNoteId(n.id)}
              onInsertNoteToScore={handleInsertNoteFromPiano}
              activeContext="score"
            />
          )}
        </div>
      )}

      {/* 3. MODO INSERÇÃO MANUAL POR FORMULÁRIO */}
      {editorMode === 'form' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-600" />
            Inserir Nota na Partitura
          </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Seletor de Nota do Trompete */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Nota & Cifra ABC (A=1 a G=7)
            </label>
            <select
              value={selectedNoteId}
              onChange={(e) => {
                setSelectedNoteId(e.target.value);
                const n = getNoteDef(e.target.value);
                trumpetAudio.playTrumpetTone(n, 0.3);
              }}
              className="w-full px-3 py-2.5 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {TRUMPET_NOTES.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.solfege} ({n.letter}) • Cifra [{n.numberNotation}] • Pistões: {n.fingerDescription}
                </option>
              ))}
            </select>
          </div>

          {/* Duração da Nota */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Duração (Tempos)</label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { val: 0.5, label: '1/2 t (Colcheia)' },
                { val: 1, label: '1 t (Semínima)' },
                { val: 2, label: '2 t (Mínima)' },
                { val: 4, label: '4 t (Semibreve)' },
              ].map((dur) => (
                <button
                  key={dur.val}
                  type="button"
                  onClick={() => setSelectedDuration(dur.val)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                    selectedDuration === dur.val
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dur.val}t
                </button>
              ))}
            </div>
          </div>

          {/* Dica Didática / Letra */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Dica Didática / Letra (Opcional)</label>
            <input
              type="text"
              value={noteTipInput}
              onChange={(e) => setNoteTipInput(e.target.value)}
              placeholder="Ex: Aperte firme pistão 1"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Botão Adicionar */}
          <div className="md:col-span-2">
            <button
              id="add-note-to-score-btn"
              type="button"
              onClick={handleAddNote}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>
        </div>

        {/* Visualização da Nota Selecionada Atual (Pistões e Cifra) */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 p-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black text-lg flex items-center justify-center shadow-md">
              {selectedNoteDef.numberNotation}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">
                {selectedNoteDef.solfege} ({selectedNoteDef.letter}) • Oitava {selectedNoteDef.octave}
              </div>
              <div className="text-xs text-slate-500">
                Pistões: <strong className="text-amber-700">{selectedNoteDef.fingerDescription}</strong>
              </div>
            </div>
          </div>

          <div className="scale-75 origin-right">
            <TrumpetValves valves={selectedNoteDef.valvesBb} size="sm" />
          </div>
        </div>
      </div>
      )}

      {/* Linha do Tempo da Partitura (Visual e Interativa) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Pauta da Música ({notes.length} notas)
            </h3>
            <p className="text-xs text-slate-500">
              Acompanhe as notas criadas, reordene, ouça o playback e pratique no trompete.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão de Playback */}
            <button
              id="play-score-btn"
              onClick={handlePlayScore}
              disabled={notes.length === 0}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95 ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 disabled:opacity-40'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  Parar Execução
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Ouvir Partitura
                </>
              )}
            </button>

            {/* Praticar Esta Partitura */}
            <button
              id="practice-custom-score-btn"
              onClick={handlePracticeCurrent}
              disabled={notes.length === 0}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Music className="w-4 h-4 text-amber-400" />
              Praticar no Trompete
            </button>
          </div>
        </div>

        {/* Lista de Notas em Blocos Musicais */}
        {notes.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Music className="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-2" />
            <p className="text-sm font-medium">Nenhuma nota adicionada ainda.</p>
            <p className="text-xs text-slate-400 mt-1">
              Use o formulário acima ou selecione um modelo para começar sua partitura.
            </p>
          </div>
        ) : (
          <div className="pt-6 overflow-x-auto pb-4">
            <div className="flex items-stretch gap-2.5 min-w-max">
              {notes.map((item, index) => {
                const noteDef = getNoteDef(item.noteId);
                const isCurrentlyPlaying = isPlaying && playingIndex === index;

                return (
                  <div
                    key={index}
                    className={`relative w-28 rounded-2xl p-3 border flex flex-col justify-between transition-all duration-150 ${
                      isCurrentlyPlaying
                        ? 'bg-amber-500 text-white border-amber-600 scale-105 shadow-xl ring-4 ring-amber-300 z-10'
                        : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200 shadow-sm'
                    }`}
                  >
                    {/* Topo do bloco: Cifra e Duração */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm ${
                            isCurrentlyPlaying ? 'bg-white text-amber-600' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {noteDef.numberNotation}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isCurrentlyPlaying ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.duration}t
                        </span>
                      </div>

                      <div className="mt-2 text-center">
                        <div className="font-extrabold text-base leading-tight">{noteDef.solfege}</div>
                        <div
                          className={`text-[11px] font-semibold ${
                            isCurrentlyPlaying ? 'text-amber-100' : 'text-slate-400'
                          }`}
                        >
                          {noteDef.id}
                        </div>
                      </div>
                    </div>

                    {/* Dica / Letra */}
                    <div
                      className={`text-[10px] my-2 text-center line-clamp-2 px-1 ${
                        isCurrentlyPlaying ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {item.lyricOrTip || noteDef.fingerDescription}
                    </div>

                    {/* Controles do Bloco (Mover e Excluir) */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 mt-1">
                      <button
                        onClick={() => handleMoveNote(index, 'left')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-slate-200/60 disabled:opacity-20 text-slate-600"
                        title="Mover para esquerda"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleRemoveNote(index)}
                        className="p-1 rounded hover:bg-red-100 text-red-500"
                        title="Remover nota"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleMoveNote(index, 'right')}
                        disabled={index === notes.length - 1}
                        className="p-1 rounded hover:bg-slate-200/60 disabled:opacity-20 text-slate-600"
                        title="Mover para direita"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Biblioteca de Partituras Salvas */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-600" />
          Minhas Partituras e Exercícios Salvos ({savedScores.length})
        </h3>

        {savedScores.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            Nenhuma partitura salva localmente ainda. Crie uma partitura acima e clique em "Salvar Partitura".
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {savedScores.map((score) => (
              <div
                key={score.id}
                onClick={() => handleLoadScore(score)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  currentScoreId === score.id
                    ? 'border-amber-400 bg-amber-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{score.title}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {score.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {score.author} • {score.notes.length} notas • {score.bpm} BPM
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    {new Date(score.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDeleteSavedScore(score.id, e)}
                      className="p-1 rounded hover:bg-red-50 text-red-500"
                      title="Excluir partitura salva"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
