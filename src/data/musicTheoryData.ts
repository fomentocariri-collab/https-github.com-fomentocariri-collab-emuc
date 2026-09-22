import { NoteDefinition } from '../types';
import { PIANO_THEORY_TOPICS } from './pianoTheoryData';

export type TheoryLevel = 'inicial' | 'media' | 'avancado';
export type InstrumentScope = 'geral' | 'trompete' | 'piano';

export interface TheoryQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type TheoryVisualType =
  | 'sound_properties'
  | 'abc_table'
  | 'staff'
  | 'rhythm'
  | 'valves_natural'
  | 'accidentals'
  | 'major_scale'
  | 'circle_fifths'
  | 'intervals'
  | 'octave_logic'
  | 'chords'
  | 'harmonic_series'
  | 'super_octave'
  | 'minor_scales'
  | 'modes'
  | 'functional_harmony'
  | 'piano_keys_topography'
  | 'piano_finger_numbering'
  | 'grand_staff'
  | 'piano_scales_fingering'
  | 'piano_chord_inversions'
  | 'piano_pedals'
  | 'piano_voicings'
  | 'piano_accompaniment';

export interface TheorySectionContent {
  heading: string;
  text: string;
  bulletPoints?: string[];
  proTip?: string;
  interactiveNoteIds?: string[];
  visualType?: TheoryVisualType;
}

export interface TheoryTopic {
  id: string;
  level: TheoryLevel;
  levelLabel: string;
  instrument?: InstrumentScope;
  order: number;
  title: string;
  subtitle: string;
  badge: string;
  estimatedReadMinutes: number;
  summary: string;
  sections: TheorySectionContent[];
  quiz: TheoryQuizQuestion[];
}

export const BASE_THEORY_TOPICS: TheoryTopic[] = [
  // =========================================================================
  // NÍVEL INICIAL (BÁSICO / FUNDAMENTAL)
  // =========================================================================
  {
    id: 'propriedades-do-som',
    level: 'inicial',
    levelLabel: 'Inicial / Básico',
    order: 1,
    title: '1. O Som e as 4 Propriedades Musicais',
    subtitle: 'A matéria-prima da música: Altura, Duração, Intensidade e Timbre',
    badge: 'Fundamentos',
    estimatedReadMinutes: 4,
    summary: 'Aprenda o que é o som musical e compreenda as 4 características que todo trompetista e instrumentista precisa controlar conscientemente.',
    sections: [
      {
        heading: 'O que é o Som Musical?',
        text: 'O som é uma onda mecânica provocada pela vibração de um corpo sonoro que se propaga pelo ar. No trompete, a vibração começa no tecido elástico dos lábios do músico (embocadura), que é amplificada pela coluna de ar dentro do tubo de latão.',
        bulletPoints: [
          'Som musical regular: possui vibração periódica estável e afinada (ex: a nota Dó de um trompete).',
          'Ruído: vibração irregular e aperiódica sem frequência definida (ex: vento solto, palmas, pratos sem afinação).'
        ],
        visualType: 'sound_properties'
      },
      {
        heading: 'As 4 Propriedades Fundamentais',
        text: 'Qualquer nota musical que ouvimos ou tocamos possui simultaneamente 4 propriedades inseparáveis:',
        bulletPoints: [
          '1. Altura (Frequência): É o que define se a nota é GRAVE (frequência baixa, em Hz) ou AGUDA (frequência alta). No trompete, notas graves vibram mais lento e notas agudas vibram centenas de vezes por segundo.',
          '2. Duração: É o tempo de sustentação do som no tempo cronológico (definido pelas figuras musicais: semibreve, mínima, semínima, colcheia).',
          '3. Intensidade (Dinâmica): É a amplitude da onda sonoro (volume). Classificado como pianissimo (pp), piano (p), mezzo-forte (mf), forte (f) ou fortissimo (ff). É controlado pela pressão e fluxo de ar dos pulmões.',
          '4. Timbre: É a "personalidade" ou cor do som. É o que permite ao nosso cérebro reconhecer imediatamente que um som foi produzido por um trompete e não por um piano ou violino, mesmo que estejam na exata mesma nota e volume.'
        ],
        proTip: 'Dica do Mestre: No trompete, a altura NUNCA deve ser controlada apertando o bocal contra os dentes. A altura é controlada pela velocidade da coluna de ar e a tensão focada dos cantos da boca!',
        interactiveNoteIds: ['C4', 'G4', 'C5']
      }
    ],
    quiz: [
      {
        question: 'Qual das 4 propriedades do som define se uma nota é mais GRAVE ou mais AGUDA?',
        options: ['Intensidade', 'Altura', 'Timbre', 'Duração'],
        correctIndex: 1,
        explanation: 'Correto! Altura refere-se à frequência da vibração (grave vs agudo). Intensidade refere-se ao volume!'
      },
      {
        question: 'O que diferencia o som de um trompete e de um violino tocando a mesma nota na mesma intensidade?',
        options: ['O Timbre', 'A Altura', 'O Compasso', 'A Clave'],
        correctIndex: 0,
        explanation: 'Exato! O Timbre é a cor do som, determinada pelos harmônicos gerados pelo instrumento.'
      }
    ]
  },

  {
    id: 'sistema-abc-e-numeros',
    level: 'inicial',
    levelLabel: 'Inicial / Básico',
    order: 2,
    title: '2. O Sistema ABC de Cifras e Números (1 a 7)',
    subtitle: 'Como o alfabeto musical internacional A, B, C... se conecta aos números e nomes',
    badge: 'Cifras & Alfabeto',
    estimatedReadMinutes: 5,
    summary: 'Domine a notação de cifras universais e entenda como vincular as letras A a G às notas Lá, Si, Dó... e aos números de 1 a 7.',
    sections: [
      {
        heading: 'A Origem do Alfabeto Musical (A a G)',
        text: 'Muito antes de existirem os nomes Dó, Ré, Mi (criados pelo monge Guido d\'Arezzo no século XI), a música ocidental usava as primeiras letras do alfabeto latino (A, B, C, D, E, F, G). Na Grécia e Roma antigas, a escala de referência começava na nota Lá (A).',
        bulletPoints: [
          'A = 1 = LÁ (Nota fundamental do afinador e diapasão, A4 = 440 Hz)',
          'B = 2 = SI',
          'C = 3 = DÓ (Nota central do piano e início da escala modelo de Dó Maior)',
          'D = 4 = RÉ',
          'E = 5 = MI',
          'F = 6 = FÁ',
          'G = 7 = SOL'
        ],
        visualType: 'abc_table',
        interactiveNoteIds: ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4']
      },
      {
        heading: 'Por que usar Números de 1 a 7?',
        text: 'Ao associar cada letra ao seu número natural (A=1, B=2, C=3...), o estudante desenvolve uma agilidade mental enorme: fica muito mais fácil enxergar graus de escalas, intervalos sonoros e funções harmônicas sem se perder nas nomenclaturas tradicionais.',
        bulletPoints: [
          'Notas Sustenidas recebem o símbolo #: C# = 3#, D# = 4#, F# = 6#, G# = 7#, A# = 1#',
          'Notas Bemóis recebem o símbolo b: Db = 4b, Eb = 5b, Gb = 7b, Ab = 1b, Bb = 2b'
        ],
        proTip: 'Memorize o par inseparável: C é sempre 3 (Dó). A é sempre 1 (Lá). Onde você ver C em qualquer partitura ou cifra mundial, leia mentalmente Dó!'
      }
    ],
    quiz: [
      {
        question: 'No sistema internacional ABC e na regra numérica, a qual nota e número a letra C corresponde?',
        options: ['Dó = Nota 3', 'Lá = Nota 1', 'Fá = Nota 6', 'Sol = Nota 7'],
        correctIndex: 0,
        explanation: 'Muito bem! C é a 3ª letra do alfabeto, vinculada à nota Dó (C = Dó = 3).'
      },
      {
        question: 'Se A = Lá = 1 e B = Si = 2, qual nota corresponde à letra F e ao número 6?',
        options: ['Mi', 'Sol', 'Fá', 'Ré'],
        correctIndex: 2,
        explanation: 'Perfeito! F é a 6ª letra, logo F = Fá = 6!'
      }
    ]
  },

  {
    id: 'pentagrama-clave-e-notas',
    level: 'inicial',
    levelLabel: 'Inicial / Básico',
    order: 3,
    title: '3. Pentagrama, Clave de Sol e Posição das Notas',
    subtitle: 'A pauta de 5 linhas e 4 espaços onde a música é desenhada',
    badge: 'Leitura de Partitura',
    estimatedReadMinutes: 5,
    summary: 'Aprenda a ler partituras na Clave de Sol do trompete, memorizando as notas nas linhas, nos espaços e nas linhas suplementares.',
    sections: [
      {
        heading: 'A Pauta ou Pentagrama',
        text: 'O pentagrama é o conjunto de 5 linhas horizontais paralelas e 4 espaços entre elas, contados SEMPRE de baixo para cima (1ª linha embaixo, 5ª linha no topo).',
        bulletPoints: [
          'Linhas: 1ª (inferior), 2ª, 3ª, 4ª, 5ª (superior).',
          'Espaços: 1º espaço, 2º espaço, 3º espaço, 4º espaço.'
        ],
        visualType: 'staff'
      },
      {
        heading: 'A Clave de Sol',
        text: 'Sem clave, as linhas e espaços não têm nome de nota. A Clave de Sol é utilizada pelo trompete, violino, flauta e mão direita do piano. Ela nasce desenhada em volta da 2ª linha, estabelecendo que a nota na 2ª linha se chama SOL (G / 7).',
        bulletPoints: [
          'Notas nas Linhas (de baixo para cima): Mi (1ª), Sol (2ª), Si (3ª), Ré (4ª), Fá (5ª). Mnemônica: "Mi Sol Si Ré Fá".',
          'Notas nos Espaços (de baixo para cima): Fá (1º), Lá (2º), Dó (3º), Mi (4º). Mnemônica: "Fá Lá Dó Mi".',
          'Linhas Suplementares Inferiores: Dó central (C4 / 3) fica na 1ª linha suplementar abaixo da pauta com um traço no meio!'
        ],
        proTip: 'Para o trompetista, o Dó central (C4) abaixo da pauta é o ponto de partida do instrumento: tubo aberto (0 pistões), sopro estável e relaxado!',
        interactiveNoteIds: ['C4', 'E4', 'G4', 'B4', 'D5', 'F5']
      }
    ],
    quiz: [
      {
        question: 'Onde se localiza a nota SOL (G) na pauta com Clave de Sol?',
        options: ['Na 1ª linha', 'Na 2ª linha', 'No 2º espaço', 'Na 3ª linha'],
        correctIndex: 1,
        explanation: 'Exato! A Clave de Sol nasce na 2ª linha e dá seu nome a essa linha (Sol = G = 7).'
      },
      {
        question: 'Quais são as notas dos 4 espaços da Clave de Sol, de baixo para cima?',
        options: ['Mi, Sol, Si, Ré', 'Fá, Lá, Dó, Mi', 'Dó, Ré, Mi, Fá', 'Lá, Si, Dó, Ré'],
        correctIndex: 1,
        explanation: 'Correto! Os quatro espaços formam "Fá, Lá, Dó, Mi"!'
      }
    ]
  },

  {
    id: 'ritmo-figuras-compasso',
    level: 'inicial',
    levelLabel: 'Inicial / Básico',
    order: 4,
    title: '4. Ritmo, Figuras Musicais e Compassos',
    subtitle: 'A organização do tempo: Semibreve, Mínima, Semínima e Fórmulas de Compasso',
    badge: 'Métrica & Ritmo',
    estimatedReadMinutes: 6,
    summary: 'Compreenda a duração das notas, o papel das pausas e como o compasso (4/4, 3/4, 2/4) organiza a pulsação musical.',
    sections: [
      {
        heading: 'Figuras de Duração e seus Valores Relativos',
        text: 'Na música, o tempo não é fixo em segundos absolutos, mas em proporções matemáticas relativas guiadas pelo andamento (BPM - Batidas Por Minuto):',
        bulletPoints: [
          'Semibreve (O): Vale 4 tempos num compasso quaternário (a figura de maior duração comum).',
          'Mínima: Vale 2 tempos (metade da semibreve).',
          'Semínima: Vale 1 tempo (metade da mínima, a unidade de tempo mais comum).',
          'Colcheia: Vale 1/2 tempo (metade da semínima; duas colcheias completam 1 tempo).',
          'Semicolcheia: Vale 1/4 de tempo (quatro semicolcheias completam 1 tempo).'
        ],
        visualType: 'rhythm'
      },
      {
        heading: 'Fórmulas de Compasso',
        text: 'O compasso divide a música em porções regulares através de barras de compasso verticais. A fórmula de compasso fica no início da partitura logo após a clave:',
        bulletPoints: [
          '4/4 (Quaternário): 4 tempos por compasso. É o mais comum da música popular e sacra.',
          '3/4 (Ternário): 3 tempos por compasso. Ritmo típico de valsas e minuetos.',
          '2/4 (Binário): 2 tempos por compasso. Ritmo típico de marchas militares, frevo e samba.',
          'O número de cima indica quantos tempos cabem no compasso; o de baixo indica qual figura representa 1 tempo (4 = Semínima).'
        ],
        proTip: 'Pratique sempre com metrônomo! O trompete precisa de precisão cirúrgica de ataque (articulação de língua no tempo 1 de cada compasso).'
      }
    ],
    quiz: [
      {
        question: 'Num compasso 4/4, quantas semínimas (1 tempo cada) são necessárias para preencher uma Semibreve?',
        options: ['2 semínimas', '4 semínimas', '8 semínimas', '3 semínimas'],
        correctIndex: 1,
        explanation: 'Correto! A Semibreve vale 4 tempos, correspondendo a 4 semínimas de 1 tempo cada.'
      },
      {
        question: 'Qual fórmula de compasso é característica de marchas e possui 2 tempos por compasso?',
        options: ['3/4', '4/4', '2/4', '6/8'],
        correctIndex: 2,
        explanation: 'Exato! O compasso 2/4 (binário) possui 2 tempos por compasso.'
      }
    ]
  },

  {
    id: 'ordem-natural-pistoes-trompete',
    level: 'inicial',
    levelLabel: 'Inicial / Básico',
    order: 5,
    title: '5. O Trompete em Si♭ & A Ordem Natural Numérica dos Pistões',
    subtitle: 'A regra mecânica e acústica: 0 solto, 1, 12, 2, 13, 23, 123',
    badge: 'Mecânica do Trompete',
    estimatedReadMinutes: 6,
    summary: 'Aprenda exatamente como cada pistão altera o comprimento do tubo de latão e por que as digitações seguem a ordem natural numérica.',
    sections: [
      {
        heading: 'O que faz cada Pistão do Trompete?',
        text: 'O trompete possui aproximadamente 1,48 metro de tubo quando todos os pistões estão soltos. Ao apertar um pistão, uma válvula interna desvia a passagem do ar para tubos adicionais (pompas), aumentando o comprimento do instrumento e rebaixando o som:',
        bulletPoints: [
          'Pistão 1 (mais próximo da boca): Adiciona um circuito de tubo que abaixa o som em 1 tom inteiro (-2 semitons).',
          'Pistão 2 (do meio): Adiciona o circuito mais curto do trompete, que abaixa o som em 1/2 tom (-1 semitono).',
          'Pistão 3 (mais próximo da campana): Adiciona um circuito longo que abaixa o som em 1 tom e meio (-3 semitons).'
        ],
        visualType: 'valves_natural'
      },
      {
        heading: 'A Sequência Natural Numérica dos 7 Circuitos',
        text: 'Ao combinar os 3 pistões, o trompetista dispõe de 7 posições acústicas fundamentais que cobrem toda a escala cromática:',
        bulletPoints: [
          '0 (Solto / Aberto): Tubo padrão livre (Dó central, Sol médio, Dó agudo).',
          '1: Rebaixa 1 tom (Si♭, Fá, Ré agudo).',
          '12: Rebaixa 1 tom e meio (Lá, Mi grave, Dó# agudo).',
          '2: Rebaixa 1/2 tom (Si, Fá#, Ré# agudo).',
          '13: Rebaixa 2 tons (Sol grave, Ré grave — requer pompa do 3º pistão estendida!).',
          '23: Rebaixa 2 tons e meio (Sol# / Lá♭).',
          '123: Rebaixa 3 tons / trítono máximo (Dó# / Ré♭ grave — requer pompa do 3º pistão estendida!).'
        ],
        proTip: 'Memorize a ordem numérica dos tubos: 0 → 1 → 12 → 2 → 13 → 23 → 123. Ela representa a física acústica do instrumento em ordem de rebaixamento tonal!',
        interactiveNoteIds: ['C4', 'B3', 'Bb3', 'A3', 'Ab3', 'G3', 'F#3']
      }
    ],
    quiz: [
      {
        question: 'Quantos tons o Pistão 1 rebaixa o som do trompete ao ser pressionado individualmente?',
        options: ['Meio tom (1 semitono)', '1 tom inteiro (2 semitons)', '2 tons inteiros', 'Nenhum tom'],
        correctIndex: 1,
        explanation: 'Correto! O Pistão 1 abaixa o som exatamente em 1 tom inteiro (2 semitons).'
      },
      {
        question: 'Qual é a digitação necessária para rebaixar o trompete ao máximo (3 tons inteiros / trítono)?',
        options: ['1 e 2', '2 e 3', '1, 2 e 3 (123)', '0 (Solto)'],
        correctIndex: 2,
        explanation: 'Perfeito! Pressionar 1-2-3 aciona todos os circuitos somados, rebaixando 3 tons inteiros.'
      }
    ]
  },

  // =========================================================================
  // NÍVEL MÉDIO (INTERMEDIÁRIO / ESTRUTURAS E HARMONIA PRÁTICA)
  // =========================================================================
  {
    id: 'semitons-tons-acidentes',
    level: 'media',
    levelLabel: 'Médio / Intermediário',
    order: 6,
    title: '6. Semitons, Tons, Acidentes e Enarmonia',
    subtitle: 'A menor distância da música ocidental e o poder dos acidentes (♯, ♭, ♮)',
    badge: 'Escalas & Tons',
    estimatedReadMinutes: 5,
    summary: 'Entenda como o semitom constrói toda a música moderna, conheça a função de cada acidente e domine o conceito de notas enarmônicas.',
    sections: [
      {
        heading: 'Tom e Semitom',
        text: 'O semitom (ou meio-tom) é a menor distância de altura entre duas notas no sistema musical temperado ocidental (ex: entre Dó e Dó#, ou entre Mi e Fá). Dois semitons somados formam 1 Tom inteiro (ex: Dó para Ré).',
        bulletPoints: [
          'Semitom Natural: Ocorre naturalmente na escala diatônica entre MI e FÁ (5 e 6), e entre SI e DÓ (2 e 3). Não há tecla preta entre eles no piano!',
          'Tom Inteiro: Ocorre quando há duas notas com 1 tecla intermediária (ex: Dó para Ré, Fá para Sol).'
        ],
        visualType: 'accidentals'
      },
      {
        heading: 'Os Acidentes Musicais e Enarmonia',
        text: 'Os acidentes são símbolos colocados antes de uma nota para modificar sua altura:',
        bulletPoints: [
          'Sustenido (♯): Eleva a altura da nota em 1 semitono (meio-tom acima).',
          'Bemol (♭): Abaixa a altura da nota em 1 semitono (meio-tom abaixo).',
          'Bequadro (♮): Anula qualquer acidente prévio, devolvendo a nota ao seu estado natural.',
          'Dobrado Sustenido (𝄪): Eleva a nota em 1 tom inteiro (2 semitons).',
          'Dobrado Bemol (𝄫): Abaixa a nota em 1 tom inteiro (2 semitons).',
          'Enarmonia: É o fenômeno de duas notas terem nomes diferentes, mas a mesma frequência e som real (ex: Dó♯ é exatamente o mesmo som e digitação de Ré♭; Fá♯ = Sol♭; Lá♯ = Si♭).'
        ],
        proTip: 'No trompete, C# e Db usam a mesma posição de pistões: 123 no grave (C#4) ou 12 na oitava acima (C#5)!'
      }
    ],
    quiz: [
      {
        question: 'Entre quais pares de notas naturais existe naturalmente apenas MEIO TOM (semitom natural)?',
        options: ['Dó e Ré / Sol e Lá', 'Mi e Fá / Si e Dó', 'Fá e Sol / Lá e Si', 'Ré e Mi / Fá e Sol'],
        correctIndex: 1,
        explanation: 'Exato! As notas Mi-Fá e Si-Dó não têm sustenidos naturais intermediários; a distância entre elas é de apenas 1 semitono.'
      },
      {
        question: 'O que significa o termo "Enarmonia"?',
        options: ['Tocar duas notas juntas', 'Notas com nomes diferentes mas o mesmo som e frequência', 'Tocar sem usar os pistões', 'Uma pausa longa'],
        correctIndex: 1,
        explanation: 'Correto! Enarmonia é o caso de C# e Db: nomes diferentes, mesmo som!'
      }
    ]
  },

  {
    id: 'escala-maior-formula',
    level: 'media',
    levelLabel: 'Médio / Intermediário',
    order: 7,
    title: '7. A Escala Maior Natural e a Fórmula dos Intervalos',
    subtitle: 'A fórmula mãe da música ocidental: Tom - Tom - Semitom - Tom - Tom - Tom - Semitom',
    badge: 'Escalas Maiores',
    estimatedReadMinutes: 6,
    summary: 'Compreenda a estrutura que dá origem a todas as melodias alegres e afirmativas da música clássica, hinos e canções populares.',
    sections: [
      {
        heading: 'A Fórmula Universal da Escala Maior',
        text: 'Qualquer escala maior, seja iniciando em Dó, Sol, Ré ou Si♭, é construída aplicando rigorosamente a mesma sequência de intervalos:',
        bulletPoints: [
          'T — T — st — T — T — T — st',
          'Tom, Tom, Semitom, Tom, Tom, Tom, Semitom',
          'Os semitons ocorrem sempre entre os graus III - IV (3º e 4º graus) e entre VII - VIII (7º e 8º graus).'
        ],
        visualType: 'major_scale',
        interactiveNoteIds: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
      },
      {
        heading: 'Os Graus da Escala',
        text: 'Cada degrau da escala tem um nome técnico que indica sua função e importância no discurso musical:',
        bulletPoints: [
          'I Grau: TÔNICA (o centro tonal, traz repouso absoluto).',
          'II Grau: Supertônica.',
          'III Grau: Mediante (determina se a escala soa maior ou menor).',
          'IV Grau: SUBDOMINANTE (gera movimento e afastamento).',
          'V Grau: DOMINANTE (o grau de maior tensão, que pede resolução na Tônica).',
          'VI Grau: Sobredominante (origem da relativa menor).',
          'VII Grau: SENSÍVEL (fica a meio tom da tônica e atrai fortemente a nota de repouso).',
          'VIII Grau: Tônica na Oitava Superior.'
        ],
        proTip: 'No trompete, estude a Escala de Dó Maior (C D E F G A B C) e depois a Escala de Si♭ Maior (Bb C D Eb F G A Bb). São os dois pilares fundamentais do método Da Capo!'
      }
    ],
    quiz: [
      {
        question: 'Onde ocorrem os dois semitons na fórmula da Escala Maior?',
        options: ['Entre os graus I-II e IV-V', 'Entre os graus III-IV e VII-VIII', 'Entre os graus II-III e V-VI', 'Não existem semitons'],
        correctIndex: 1,
        explanation: 'Muito bem! Na Escala Maior, os semitons ficam sempre entre o 3º-4º graus e o 7º-8º graus.'
      },
      {
        question: 'Qual é o nome técnico do 5º grau (V) de uma escala, responsável pela maior tensão harmônica?',
        options: ['Subdominante', 'Dominante', 'Sensível', 'Tônica'],
        correctIndex: 1,
        explanation: 'Correto! O 5º grau é a Dominante!'
      }
    ]
  },

  {
    id: 'armadura-clave-circulo-quintas',
    level: 'media',
    levelLabel: 'Médio / Intermediário',
    order: 8,
    title: '8. Armadura de Clave e o Círculo de Quintas',
    subtitle: 'Como descobrir a tonalidade da música em 2 segundos através dos acidentes',
    badge: 'Tonalidades',
    estimatedReadMinutes: 6,
    summary: 'Aprenda a ordem fixa dos sustenidos e bemóis na armadura de clave e use os macetes práticos dos mestres para identificar o tom.',
    sections: [
      {
        heading: 'O que é a Armadura de Clave?',
        text: 'Para não precisar escrever um sustenido ou bemol em cada nota da música, o compositor os coloca no início da pauta, logo após a clave. Esses acidentes valem para toda a partitura, em todas as oitavas!',
        bulletPoints: [
          'Ordem dos Sustenidos (por 5ªs ascendentes): FÁ♯, DÓ♯, SOL♯, RÉ♯, LÁ♯, MI♯, SI♯. (Mnemônica: "Fá Dó Sol Ré Lá Mi Si").',
          'Ordem dos Bemóis (por 4ªs ascendentes / 5ªs descendentes): SI♭, MI♭, LÁ♭, RÉ♭, SOL♭, DÓ♭, FÁ♭. É exatamente o inverso dos sustenidos!'
        ],
        visualType: 'circle_fifths'
      },
      {
        heading: 'Macetes Práticos para Identificar a Tonalidade',
        text: 'Você não precisa decorar todas as armaduras, basta aplicar duas regras simples:',
        bulletPoints: [
          'Regra dos Sustenidos: Olhe para o ÚLTIMO sustenido da armadura e suba MEIO TOM. Essa é a tonalidade maior! Exemplo: se o último for Dó♯, a tonalidade é Ré Maior.',
          'Regra dos Bemóis: Olhe para o PENÚLTIMO bemol da armadura. Ele dá o próprio nome do tom! Exemplo: se houver Si♭ e Mi♭, o penúltimo é Si♭, logo o tom é Si♭ Maior. (A única exceção é Fá Maior, que tem apenas 1 bemol: Si♭).'
        ],
        proTip: 'Para o trompetista, quando a partitura em Si♭ tem 2 sustenidos (Fá# e Dó#), o tom do trompete é Ré Maior, o que soa como Dó Maior real de concerto!'
      }
    ],
    quiz: [
      {
        question: 'Qual é a ordem fixa dos primeiros 4 sustenidos na armadura de clave?',
        options: ['Fá#, Dó#, Sol#, Ré#', 'Si#, Mi#, Lá#, Ré#', 'Dó#, Ré#, Mi#, Fá#', 'Sol#, Lá#, Si#, Dó#'],
        correctIndex: 0,
        explanation: 'Exato! A ordem dos sustenidos começa sempre por Fá#, Dó#, Sol#, Ré#...'
      },
      {
        question: 'Se uma partitura apresenta 3 bemóis na armadura (Si♭, Mi♭, Lá♭), qual é a tonalidade maior da música?',
        options: ['Si♭ Maior', 'Mi♭ Maior', 'Lá♭ Maior', 'Fá Maior'],
        correctIndex: 1,
        explanation: 'Perfeito! Pela regra do penúltimo bemol, o penúltimo é Mi♭, logo a tonalidade é Mi♭ Maior!'
      }
    ]
  },

  {
    id: 'intervalos-musicais',
    level: 'media',
    levelLabel: 'Médio / Intermediário',
    order: 9,
    title: '9. Intervalos Musicais: Nomes, Distâncias e Efeitos Sonoros',
    subtitle: 'A distância entre dois sons: 2ªs, 3ªs, 4ªs, 5ªs, 6ªs, 7ªs e 8ªs',
    badge: 'Percepção & Teoria',
    estimatedReadMinutes: 6,
    summary: 'Aprenda a medir distâncias entre notas, classificar intervalos consonantes e dissonantes e treinar o ouvido para afinação precisa.',
    sections: [
      {
        heading: 'O que é um Intervalo?',
        text: 'Intervalo é a distância de altura entre dois sons musicais. Podem ser Melódicos (quando as notas soam uma após a outra) ou Harmônicos (quando duas notas soam ao mesmo tempo).',
        bulletPoints: [
          'Uníssono: Mesma nota e mesma altura (0 semitons).',
          '2ª Menor: 1 semitono (muito dissonante, sensação de suspense, ex: tema de Tubarão).',
          '2ª Maior: 2 semitons / 1 tom (passo natural de escala).',
          '3ª Menor: 3 semitons (sonoridade melancólica, base do acorde menor).',
          '3ª Maior: 4 semitons (sonoridade brilhante e alegre, base do acorde maior).',
          '4ª Justa: 5 semitons (consonância aberta e firme, ex: hino nacional).',
          'Trítono (4ª Aumentada / 5ª Diminuta): 6 semitons / 3 tons inteiros (tensão máxima da música).',
          '5ª Justa: 7 semitons (consonância perfeita, base da afinação dos metais).',
          '6ª Maior: 9 semitons (doce e expressiva).',
          '7ª Maior: 11 semitons (tensão elegante que pede resolução na oitava).',
          '8ª Justa: 12 semitons (duplicação perfeita da frequência fundamental).'
        ],
        visualType: 'intervals'
      },
      {
        heading: 'Consonância e Dissonância',
        text: 'Intervalos consonantes produzem sensação de estabilidade e repouso (3ªs, 5ªs, 6ªs, 8ªs). Intervalos dissonantes produzem fricção acústica e necessidade de movimento (2ªs, 7ªs e o Trítono).',
        proTip: 'No trompete, o estudo diário de intervalos de 3ª e 5ª no método Arban desenvolve a memória muscular dos lábios para nunca errar a nota alvo!'
      }
    ],
    quiz: [
      {
        question: 'Quantos semitons possui uma 5ª Justa (ex: de Dó para Sol)?',
        options: ['5 semitons', '6 semitons', '7 semitons', '8 semitons'],
        correctIndex: 2,
        explanation: 'Correto! Uma 5ª Justa possui exatamente 7 semitons.'
      },
      {
        question: 'Qual intervalo possui exatamente 6 semitons (3 tons inteiros) e é conhecido por sua tensão marcante?',
        options: ['4ª Justa', 'Trítono', '8ª Justa', '3ª Maior'],
        correctIndex: 1,
        explanation: 'Exato! O Trítono (3 tons) divide a oitava ao meio e gera forte tensão harmônica.'
      }
    ]
  },

  {
    id: 'logica-oitava-acima-8va',
    level: 'media',
    levelLabel: 'Médio / Intermediário',
    order: 10,
    title: '10. A Lógica dos Pistões na 8ª Acima (8va)',
    subtitle: 'Por que digitações pesadas como 123 e 13 simplificam para 12 e 1 no registro agudo',
    badge: 'Trompete Intermediário',
    estimatedReadMinutes: 5,
    summary: 'Descubra o segredo acústico pelo qual o trompetista deixa de usar combinações longas e passa a usar digitações naturais e compactas.',
    sections: [
      {
        heading: 'O Fenômeno da Proximidade Harmônica',
        text: 'No registro grave do trompete (abaixo de C4), os harmônicos naturais do tubo estão muito afastados entre si (intervalos de 5ª e 4ª). Por isso, para alcançar as notas cromáticas graves, o músico é forçado a acionar combinações longas de tubos (13 para Ré grave, 123 para Dó# grave).',
        bulletPoints: [
          'No registro médio-agudo (C5 a C6 / 8ª acima), a distância entre os harmônicos encurta para 3ªs e 2ªs.',
          'Consequentemente, tubos longos deixam de ser necessários: uma válvula curta é suficiente para alcançar a próxima nota!'
        ],
        visualType: 'octave_logic'
      },
      {
        heading: 'Quadro de Simplificação da 8ª Acima',
        text: 'Veja como as digitações se transformam na ordem natural:',
        bulletPoints: [
          'Dó#4 (123 com pompa) ➔ C#5 torna-se 12 (muito mais afinado e ágil nos dedos).',
          'Ré4 (13 com pompa) ➔ D5 torna-se 1 (dispensa qualquer correção mecânica de pompa).',
          'Ré#4 (23) ➔ D#5 torna-se 2 (apenas o pistão central!).',
          'Mi4 (12) ➔ E5 torna-se 0 (Aberto! Tocado sem apertar nenhum pistão, como harmônico puro).'
        ],
        proTip: 'Sempre que você tocar acima do pentagrama, confie na ordem natural dos pistões: 0, 1, 12, 2. Seus dedos ficarão muito mais rápidos nas passagens virtuosas!'
      }
    ],
    quiz: [
      {
        question: 'Qual é a digitação padrão recomendada para a nota RÉ agudo (D5, 4ª linha da pauta)?',
        options: ['1 e 3 (13)', 'Apenas Pistão 1 (1)', 'Pistões 1, 2 e 3 (123)', 'Pistão 2'],
        correctIndex: 1,
        explanation: 'Exato! Enquanto o Ré grave exige 13, o Ré agudo (D5) simplifica para apenas o Pistão 1.'
      },
      {
        question: 'Como é tocada a nota MI agudo (E5, 4º espaço da pauta) no trompete?',
        options: ['Pistões 1 e 2', 'Aberto / Solto (0 pistões)', 'Pistão 2 e 3', 'Pistão 1'],
        correctIndex: 1,
        explanation: 'Muito bem! O Mi agudo (E5) é um harmônico natural aberto (0 pistões).'
      }
    ]
  },

  {
    id: 'triades-e-acordes',
    level: 'media',
    levelLabel: 'Médio / Intermediário',
    order: 11,
    title: '11. Tríades e Formação de Acordes',
    subtitle: 'A harmonia em blocos: Tríades Maiores, Menores e Acordes de Sétima',
    badge: 'Harmonia Prática',
    estimatedReadMinutes: 6,
    summary: 'Aprenda como as notas se empilham em terças para construir os acordes que acompanham o trompete em orquestras, bandas e big bands.',
    sections: [
      {
        heading: 'O que é uma Tríade?',
        text: 'Uma tríade é um acorde formado por 3 notas empilhadas em intervalos de terça a partir de uma nota base chamada FUNDAMENTAL:',
        bulletPoints: [
          'Fundamental (1º grau do acorde): Dá o nome ao acorde (ex: C).',
          'Terça (3º grau): Define a qualidade emocional (Maior = brilhante; Menor = melancólico).',
          'Quinta (5º grau): Dá peso, estabilidade e sustentação acústica.'
        ],
        visualType: 'chords'
      },
      {
        heading: 'Os Tipos de Tríades Básicas',
        text: 'Analisando as distâncias em semitons:',
        bulletPoints: [
          'Tríade Maior (Ex: C = Dó - Mi - Sol / 3 - 5 - 7): Fundamental + 3ª Maior (4st) + 5ª Justa (7st).',
          'Tríade Menor (Ex: Am = Lá - Dó - Mi / 1 - 3 - 5): Fundamental + 3ª Menor (3st) + 5ª Justa (7st).',
          'Tríade Diminuta (Ex: Bdim = Si - Ré - Fá / 2 - 4 - 6): Fundamental + 3ª Menor (3st) + 5ª Diminuta (6st).',
          'Acorde com 7ª da Dominante (Ex: G7 = Sol - Si - Ré - Fá / 7 - 2 - 4 - 6): Tríade Maior + 7ª menor. O acorde clássico de preparação!'
        ],
        proTip: 'Praticar arpejos de tríades no trompete (tocar as notas do acorde sucessivamente: Dó-Mi-Sol-Dó) é o exercício número 1 para afinação de embocadura!'
      }
    ],
    quiz: [
      {
        question: 'Quais são as 3 notas que compõem a Tríade de Dó Maior (C)?',
        options: ['Dó, Mi, Sol (3, 5, 7)', 'Dó, Fá, Lá (3, 6, 1)', 'Dó, Ré, Mi (3, 4, 5)', 'Sol, Si, Ré (7, 2, 4)'],
        correctIndex: 0,
        explanation: 'Correto! A Tríade de C é formada pela Fundamental Dó, 3ª Maior Mi e 5ª Justa Sol.'
      },
      {
        question: 'Qual intervalo define se uma tríade é MAIOR ou MENOR?',
        options: ['O intervalo de 5ª', 'O intervalo de 3ª', 'O intervalo de 8ª', 'O compasso'],
        correctIndex: 1,
        explanation: 'Exato! A terça (3ª Maior ou 3ª Menor) é quem define se o acorde soa alegre ou triste.'
      }
    ]
  },

  // =========================================================================
  // NÍVEL AVANÇADO (HARMONIA SUPERIOR, ACÚSTICA & SUPERAGUDOS)
  // =========================================================================
  {
    id: 'serie-harmonica-completa',
    level: 'avancado',
    levelLabel: 'Avançado / Profissional',
    order: 12,
    title: '12. A Série Harmônica Completa e a Física dos Metais',
    subtitle: 'A acústica profunda da coluna de ar: nós harmônicos, desvios de afinação e o gatilho da 3ª pompa',
    badge: 'Acústica & Física',
    estimatedReadMinutes: 7,
    summary: 'Descubra a matemática física por trás da produção sonora nos instrumentos de latão e entenda a necessidade imperativa do gatilho de afinação.',
    sections: [
      {
        heading: 'A Lei dos Múltiplos Inteiros de Frequência',
        text: 'Quando uma coluna de ar vibra dentro do trompete em uma dada digitação (ex: tubo aberto 0), ela não vibra apenas no seu comprimento total, mas subdivide-se espontaneamente em metades, terços, quartos, quintos e frações menores:',
        bulletPoints: [
          'Harmônico 1 (Fundamental / Som pedal): C3 (frequência f, vibração em toda a extensão do tubo).',
          'Harmônico 2: C4 (frequência 2f, 1 oitava acima).',
          'Harmônico 3: G4 (frequência 3f, 5ª justa acima).',
          'Harmônico 4: C5 (frequência 4f, 2 oitavas acima).',
          'Harmônico 5: E5 (frequência 5f, 3ª maior natural — 14 cents mais baixa que o temperamento igual!).',
          'Harmônico 6: G5 (frequência 6f, 5ª justa acima).',
          'Harmônico 7: Bb5 (frequência 7f, 31 cents mais baixa! Tão desafinada que é evitada como nota padrão).',
          'Harmônico 8: C6 (frequência 8f, 3 oitavas acima da fundamental).'
        ],
        visualType: 'harmonic_series'
      },
      {
        heading: 'Por que o Ré e Dó# Graves Exigem o Gatilho da 3ª Pompa?',
        text: 'A física acústica ensina que, para rebaixar uma nota afinadamente, o comprimento do tubo precisa aumentar em porcentagem do tamanho total do instrumento, não em centímetros absolutos.',
        bulletPoints: [
          'Quando você pressiona o Pistão 1 e o Pistão 3 juntos (digitação 13 para Ré grave), os dois tubos somados são curtos demais para a nova coluna de ar total expandida.',
          'O resultado físico é que o Ré4 (13) e o Dó#4 (123) ficam insuportavelmente ALTOS (sustenidos) por natureza.',
          'Solução dos mestres: O trompetista empurra o anel da 3ª pompa com o dedo anelar esquerdo cerca de 1,5 a 2,5 cm para fora, corrigindo a afinação perfeitamente!'
        ],
        proTip: 'Nos métodos avançados de Arban e Clarke, o uso do gatilho móvel da 3ª pompa é obrigatório em toda nota longa ou cadência que repouse em Ré grave ou Dó# grave!'
      }
    ],
    quiz: [
      {
        question: 'Por que o Ré grave (D4 / 13) e o Dó# grave (C#4 / 123) são naturalmente sustenidos (altos) no trompete?',
        options: [
          'Porque o instrumentista sopra com ar frio',
          'Porque a soma física dos tubos 1+3 é menor que a porcentagem necessária para o comprimento total expandido',
          'Porque o bocal está solto',
          'Eles são perfeitamente afinados por padrão'
        ],
        correctIndex: 1,
        explanation: 'Exato! A lei acústica de tubos compostos faz com que circuitos somados fiquem curtos em porcentagem, exigindo a extensão mecânica da pompa.'
      },
      {
        question: 'Qual harmônico da série natural é 31 cents mais baixo que a escala temperada e por isso não é usado como nota padrão?',
        options: ['O 3º harmônico', 'O 4º harmônico', 'O 7º harmônico', 'O 8º harmônico'],
        correctIndex: 2,
        explanation: 'Correto! O 7º harmônico natural é acusticamente muito baixo (-31 cents).'
      }
    ]
  },

  {
    id: 'logica-16va-superagudo',
    level: 'avancado',
    levelLabel: 'Avançado / Profissional',
    order: 13,
    title: '13. A Lógica na 16ª Acima (16va - Superagudo)',
    subtitle: 'O território extremo acima de C6: harmônicos contínuos, compressão de ar e digitações alternativas',
    badge: 'Superagudos & Virtuosismo',
    estimatedReadMinutes: 7,
    summary: 'Aprenda como dominar o registro superagudo do trompete sem força física, entendendo a proximidade microscópica dos nós harmônicos.',
    sections: [
      {
        heading: 'O Que Acontece Acima do C6 (Dó Agudo)?',
        text: 'Acima da 16ª harmônica, os harmônicos naturais do tubo estão a distâncias microscópicas uns dos outros (separados por apenas 1 semitono ou microtons).',
        bulletPoints: [
          'Nesse registro extremo, quase todas as notas podem ser emitidas em múltiplas digitações diferentes (digitações alternativas ou false fingerings).',
          'A digitação dos dedos torna-se secundária (apenas 10% do trabalho): 90% do controle é a velocidade supersônica do ar e o arco da língua!'
        ],
        visualType: 'super_octave'
      },
      {
        heading: 'A Mecânica da Embocadura e Arco Lingual',
        text: 'Muitos músicos erram tentando empurrar o bocal contra os lábios, o que esmaga os vasos sanguíneos e destrói o som.',
        bulletPoints: [
          'Vogais de ressonância: No grave a cavidade bucal pronuncia "TAH" ou "TOH" (língua baixa, garganta relaxada). No agudo a língua sobe para a posição "TEE" ou "HEE" (arco lingual alto, canalizando o jato de ar como na ponta de uma mangueira de jardim).',
          'Apoio Abdominal: A pressão não vem da garganta nem dos braços, mas do apoio do diafragma e músculos intercostais que comprimem o ar com firmeza.'
        ],
        proTip: 'Para tocar C6, D6, E6 e G6, estude flexibilidade labial de Arban sem usar pistões, apenas alternando harmônicos com a velocidade do ar!'
      }
    ],
    quiz: [
      {
        question: 'O que acontece com os nós da série harmônica no registro superagudo (16ª acima)?',
        options: [
          'Eles desaparecem por completo',
          'Ficam a distâncias microscópicas (quase um semitono entre si), permitindo digitações alternativas',
          'Ficam mais distantes que no grave',
          'Exigem apertar todos os 3 pistões com força'
        ],
        correctIndex: 1,
        explanation: 'Perfeito! No superagudo os harmônicos são tão próximos que várias digitações produzem a mesma nota.'
      },
      {
        question: 'Qual posição da língua (arco lingual) é utilizada pelos grandes trompetistas para notas agudas e superagudas?',
        options: ['Língua baixa ("TAH")', 'Língua em arco alto ("TEE" / "HEE")', 'Língua para fora dos dentes', 'Língua relaxada no fundo'],
        correctIndex: 1,
        explanation: 'Correto! A posição "TEE" diminui o espaço na boca e acelera a velocidade da coluna de ar.'
      }
    ]
  },

  {
    id: 'escalas-menores-relativas',
    level: 'avancado',
    levelLabel: 'Avançado / Profissional',
    order: 14,
    title: '14. Escalas Menores: Natural, Harmônica e Melódica',
    subtitle: 'As 3 formas da escala menor e o papel dramático da Sensível',
    badge: 'Escalas Menores',
    estimatedReadMinutes: 6,
    summary: 'Compreenda as três faces do modo menor e saiba exatamente quando usar cada uma na interpretação e na composição.',
    sections: [
      {
        heading: 'A Relativa Menor e a Escala Menor Natural',
        text: 'Toda escala maior possui uma "irmã gêmea" menor chamada Relativa Menor, que compartilha a exata mesma armadura de clave. Para encontrá-la, basta descer 1 tom e meio (3 semitons) a partir da tônica maior:',
        bulletPoints: [
          'Exemplo: Dó Maior (C) ➔ descendo 3 semitons chegamos a Lá menor (Am).',
          'Escala Menor Natural (Modo Eólio): T — st — T — T — st — T — T. Não possui sensível a meio tom da tônica (tem subtônica a 1 tom inteiro).'
        ],
        visualType: 'minor_scales'
      },
      {
        heading: 'Escala Menor Harmônica e Melódica',
        text: 'Para corrigir a falta de tensão conclusiva do 7º grau, os mestres criaram duas variantes:',
        bulletPoints: [
          '1. Menor Harmônica: Eleva artificialmente o 7º grau em meio tom (cria uma Sensível e um intervalo exótico de 2ª Aumentada de 1 tom e meio entre o 6º e 7º graus).',
          '2. Menor Melódica (Escala Bachiana): Eleva o 6º e o 7º graus ao subir (facilitando o canto melódico) e desce na forma Menor Natural!'
        ],
        proTip: 'No trompete, a Escala Menor Harmônica é o segredo para tocar música oriental, cigana, espanhola e trechos barrocos de Johann Sebastian Bach!'
      }
    ],
    quiz: [
      {
        question: 'Qual alteração é feita na Escala Menor Natural para transformá-la em Menor HARMÔNICA?',
        options: ['Abaixa-se o 3º grau', 'Eleva-se o 7º grau em meio tom', 'Dobra-se o 5º grau', 'Retira-se o 2º grau'],
        correctIndex: 1,
        explanation: 'Exato! A Menor Harmônica eleva o 7º grau para criar a Sensível resolutiva.'
      },
      {
        question: 'Qual é a escala relativa menor de Dó Maior (C)?',
        options: ['Ré menor', 'Mi menor', 'Lá menor (Am)', 'Sol menor'],
        correctIndex: 2,
        explanation: 'Perfeito! Descendo 3 semitons de Dó chegamos à nota Lá (Lá menor / Am).'
      }
    ]
  },

  {
    id: 'modos-gregos-trompete',
    level: 'avancado',
    levelLabel: 'Avançado / Profissional',
    order: 15,
    title: '15. Modos Gregos e Aplicação na Improvisação',
    subtitle: 'Jônio, Dórico, Frígio, Lídio, Mixolídio, Eólio e Lócrio',
    badge: 'Modalismo & Jazz',
    estimatedReadMinutes: 7,
    summary: 'Aprenda como os 7 modos eclesiásticos geram cores emocionais únicas e como os trompetistas de jazz e música erudita os aplicam.',
    sections: [
      {
        heading: 'O Conceito de Modo',
        text: 'Os modos gregos são escalas formadas utilizando as mesmas notas de uma escala maior, porém iniciando e repousando em graus diferentes:',
        bulletPoints: [
          '1. JÔNIO (1º grau): É a própria Escala Maior (alegre, nobre, afirmativo).',
          '2. DÓRICO (2º grau): Menor com 6ª Maior (o modo clássico do jazz e Miles Davis em "So What", cor moderna e sofisticada).',
          '3. FRÍGIO (3º grau): Menor com 2ª menor (cor espanhola, flamenco, tensão misteriosa).',
          '4. LÍDIO (4º grau): Maior com 4ª aumentada (cor mágica, espacial, trilhas de cinema de John Williams).',
          '5. MIXOLÍDIO (5º grau): Maior com 7ª menor (o modo do blues, baião nordestino e rock).',
          '6. EÓLIO (6º grau): É a Escala Menor Natural (melancólico, introspectivo).',
          '7. LÓCRIO (7º grau): Modo diminuto com 5ª diminuta (tensão instável e obscura).'
        ],
        visualType: 'modes'
      },
      {
        heading: 'Aplicação Prática no Trompete',
        text: 'Em vez de memorizar 7 escalas novas, pense no centro tonal:',
        bulletPoints: [
          'Para tocar Ré Dórico, toque as notas da escala de Dó Maior repousando na nota Ré (D)!',
          'Para tocar Sol Mixolídio, toque as notas de Dó Maior enfatizando a nota Sol (G) com Fá natural!'
        ],
        proTip: 'O lendário álbum "Kind of Blue" de Miles Davis é todo construído sobre o trompete modal Dórico e Mixolídio!'
      }
    ],
    quiz: [
      {
        question: 'Qual modo grego possui uma 4ª Aumentada característica e é amplamente usado em trilhas sonoras para evocar magia e mistério?',
        options: ['Modo Dórico', 'Modo Lídio', 'Modo Lócrio', 'Modo Jônio'],
        correctIndex: 1,
        explanation: 'Correto! O Modo Lídio destaca-se pela sua 4ª Aumentada luminosa e sonhadora.'
      },
      {
        question: 'Qual modo maior com 7ª menor é o alicerce do Blues, do Baião e do Rock clássico?',
        options: ['Mixolídio', 'Frígio', 'Eólio', 'Lócrio'],
        correctIndex: 0,
        explanation: 'Exato! O modo Mixolídio (5º grau) é a essência do blues e da música regional nordestina.'
      }
    ]
  },

  {
    id: 'harmonia-funcional-cadencias',
    level: 'avancado',
    levelLabel: 'Avançado / Profissional',
    order: 16,
    title: '16. Harmonia Funcional, Cadências e Condução de Vozes',
    subtitle: 'Tônica, Subdominante e Dominante: a arquitetura do II - V - I e articulação virtuosa',
    badge: 'Harmonia & Performance',
    estimatedReadMinutes: 8,
    summary: 'Domine as funções harmônicas universais, aprenda a ouvir cadências e aperfeiçoe a articulação dupla e tripla no trompete.',
    sections: [
      {
        heading: 'Os 3 Polos Funcionais da Harmonia',
        text: 'Toda a música ocidental é uma viagem contínua entre Repouso, Afastamento e Tensão:',
        bulletPoints: [
          '1. Função Tônica (T): Traz repouso, estabilidade e conclusão. Acordes principais: I (Tônica) e VI (Relativa menor).',
          '2. Função Subdominante (S): Traz afastamento moderado, transição e frescor. Acordes principais: IV e II.',
          '3. Função Dominante (D): Traz tensão máxima, instabilidade e necessidade urgente de resolução na tônica. Acordes principais: V7 e VII°.'
        ],
        visualType: 'functional_harmony'
      },
      {
        heading: 'A Progressão Suprema: II — V — I',
        text: 'É a fórmula harmônica mais importante da história da música popular, clássica e jazz:',
        bulletPoints: [
          'Em Dó Maior: Dm7 (II, Subdominante) ➔ G7 (V, Dominante com trítono tenso) ➔ Cmaj7 (I, Resolução relaxante e gloriosa).',
          'O trompetista aprende a mirar notas-guia: a 7ª do acorde anterior desce meio tom para virar a 3ª do próximo acorde!'
        ]
      },
      {
        heading: 'Articulação Avançada no Trompete (Golpe Duplo e Triplo)',
        text: 'Em andamentos rápidos (acima de 120 BPM), a língua simples (Tu-Tu-Tu) não consegue acompanhar a velocidade:',
        bulletPoints: [
          'Golpe Duplo (Double Tonguing): Alterna a ponta da língua no palato com o fundo da língua na garganta: "Tu-Ku Tu-Ku" (ou "Ta-Ka Ta-Ka").',
          'Golpe Triplo (Triple Tonguing): Usado em tercinas rápidas: "Tu-Ku-Tu Tu-Ku-Tu" ou "Tu-Tu-Ku Tu-Tu-Ku" (método Arban).',
          'Flexibilidade Labial: Troca de harmônicos sem articulação de língua (slur puro), guiado pela contração muscular abdominal.'
        ],
        proTip: 'Pratique o "Ku" isoladamente todo dia. A sílaba "Ku" é mais fraca que a "Tu" por natureza, então você deve fortalecê-la até soarem idênticas!'
      }
    ],
    quiz: [
      {
        question: 'Qual das opções representa a célebre progressão cadencial II - V - I em Dó Maior?',
        options: ['Em - F - C', 'Dm - G7 - C', 'Am - Dm - G', 'F - G - C'],
        correctIndex: 1,
        explanation: 'Correto! Em Dó Maior, o II grau é Dm, o V grau é G7 e o I grau é C.'
      },
      {
        question: 'Qual combinação de sílabas fonéticas é usada no golpe duplo (Double Tonguing) de trompete?',
        options: ['La-La La-La', 'Tu-Ku Tu-Ku', 'Po-Po Po-Po', 'Mi-Fa Mi-Fa'],
        correctIndex: 1,
        explanation: 'Perfeito! "Tu-Ku Tu-Ku" (ou "Ta-Ka Ta-Ka") permite dobrar a velocidade de articulação do trompete.'
      }
    ]
  }
];

// Combinação de todas as lições de teoria (Trompete, Piano e Teoria Geral)
export const MUSIC_THEORY_TOPICS: TheoryTopic[] = [
  ...BASE_THEORY_TOPICS.map((topic) => ({
    ...topic,
    instrument: topic.instrument || (
      topic.id.includes('trompete') || topic.id.includes('pistao') || topic.id.includes('pompa') || topic.id.includes('serie-harmonica') || topic.id.includes('16va') || topic.id.includes('8va')
        ? ('trompete' as InstrumentScope)
        : ('geral' as InstrumentScope)
    ),
  })),
  ...PIANO_THEORY_TOPICS,
];

export const THEORY_LEVEL_DESCRIPTIONS = {
  inicial: {
    title: 'Teoria Inicial (Básico & Fundamentos)',
    subtitle: 'Para quem está começando do zero ou quer solidificar os alicerces',
    description: 'Propriedades do som, sistema ABC (A=Lá=1), pentagrama, claves de Sol e Fá, pauta dupla (Grand Staff), topografia das teclas do piano, postura e dedos 1-5, figuras de tempo e ordem dos pistões.',
    color: 'amber',
    topicsCount: 9
  },
  media: {
    title: 'Teoria Média (Intermediário & Estruturas)',
    subtitle: 'Para quem já lê partituras e quer dominar escalas, harmonia e técnica',
    description: 'Semitons, tons, acidentes, escala maior, passagem do polegar (Thumb-Under), inversões de acordes no piano, os 3 pedais, armadura de clave, círculo de quintas, intervalos e simplificação na 8ª acima.',
    color: 'sky',
    topicsCount: 10
  },
  avancado: {
    title: 'Teoria Avançada (Harmonia Superior, Acústica & Virtuosismo)',
    subtitle: 'Para trompetistas, pianistas e músicos que buscam virtuosismo e domínio profundo',
    description: 'Tétrades e voicings modernos, Drop-2, polifonia e Bach, lead sheets e cadências II-V-I ao piano, peso do braço e rotação do antebraço, série harmônica, gatilho da 3ª pompa, superagudos (16va) e modos.',
    color: 'emerald',
    topicsCount: 9
  }
};

