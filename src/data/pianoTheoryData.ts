import { TheoryTopic } from './musicTheoryData';

export const PIANO_THEORY_TOPICS: TheoryTopic[] = [
  // =========================================================================
  // NÍVEL INICIAL (PIANO - BÁSICO & FUNDAMENTOS)
  // =========================================================================
  {
    id: 'piano-topografia-teclado',
    level: 'inicial',
    levelLabel: 'Inicial / Básico',
    instrument: 'piano',
    order: 1,
    title: '1. O Teclado do Piano, Topografia e o Dó Central (C4 / 3)',
    subtitle: 'A organização das 88 teclas: grupos de 2 e 3 teclas pretas e o sistema ABC (1 a 7)',
    badge: 'Teclado & Topografia',
    estimatedReadMinutes: 5,
    summary: 'Aprenda a navegar com segurança pelo teclado do piano sem olhar para os dedos, memorizando o padrão geométrico das teclas pretas e a localização do Dó Central.',
    sections: [
      {
        heading: 'O Padrão Repetitivo de 2 e 3 Teclas Pretas',
        text: 'O teclado do piano moderno possui 88 teclas (52 brancas e 36 pretas), mas você não precisa memorizar 88 posições diferentes! O teclado inteiro é apenas a repetição contínua de um padrão de 12 notas (7 brancas e 5 pretas) distribuídas em grupos alternados de 2 e 3 teclas pretas.',
        bulletPoints: [
          'Grupo de 2 Teclas Pretas: Abraça as notas Dó (C), Ré (D) e Mi (E).',
          'Grupo de 3 Teclas Pretas: Abraça as notas Fá (F), Sol (G), Lá (A) e Si (B).',
          'Não existem teclas pretas entre Mi e Fá, nem entre Si e Dó! Esses são os semitons naturais da música ocidental.'
        ],
        visualType: 'piano_keys_topography'
      },
      {
        heading: 'Como Encontrar Qualquer Nota em Menos de 1 Segundo',
        text: 'Use os pontos de referência visuais e táteis:',
        bulletPoints: [
          'Dó (C / 3): Fica imediatamente à ESQUERDA do grupo de 2 teclas pretas.',
          'Ré (D / 4): Fica no MEIO exato das 2 teclas pretas (como um cachorro entre as duas orelhas).',
          'Mi (E / 5): Fica imediatamente à DIREITA do grupo de 2 teclas pretas.',
          'Fá (F / 6): Fica imediatamente à ESQUERDA do grupo de 3 teclas pretas.',
          'Sol (G / 7) e Lá (A / 1): Ficam nos dois vãos internos das 3 teclas pretas.',
          'Si (B / 2): Fica imediatamente à DIREITA do grupo de 3 teclas pretas.',
          'Dó Central (C4 / 3): É o Dó localizado exatamente no centro do piano, em frente à marca do fabricante (Steinway, Yamaha, etc.). É o ponto de encontro entre a mão esquerda e a mão direita!'
        ],
        proTip: 'Dica do Pianista: Feche os olhos e sinta o relevo das teclas pretas com as pontas dos dedos. Você consegue identificar o grupo de 2 e o grupo de 3 apenas pelo tato!',
        interactiveNoteIds: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
      }
    ],
    quiz: [
      {
        question: 'Onde se localiza a nota Dó (C / 3) no teclado do piano?',
        options: [
          'Imediatamente à esquerda do grupo de 2 teclas pretas',
          'No meio do grupo de 3 teclas pretas',
          'À direita do grupo de 3 teclas pretas',
          'Entre as notas Mi e Fá'
        ],
        correctIndex: 0,
        explanation: 'Exato! A nota Dó (C / 3) fica sempre à esquerda do par de duas teclas pretas.'
      },
      {
        question: 'Qual nota branca fica no meio exato entre as 2 teclas pretas?',
        options: ['Mi', 'Fá', 'Ré (D / 4)', 'Sol'],
        correctIndex: 2,
        explanation: 'Muito bem! A nota Ré (D / 4) fica no centro do par de duas teclas pretas.'
      }
    ]
  },

  {
    id: 'piano-postura-digitacao',
    level: 'inicial',
    levelLabel: 'Inicial / Básico',
    instrument: 'piano',
    order: 2,
    title: '2. Postura ao Piano e Numeração dos Dedos (1 a 5)',
    subtitle: 'A mecânica do corpo: dedos 1 a 5 espelhados, peso do braço e relaxamento do punho',
    badge: 'Postura & Técnica',
    estimatedReadMinutes: 5,
    summary: 'Descubra como posicionar as mãos, regular a altura do banco e usar a numeração universal dos dedos para tocar sem dor nem fadiga muscular.',
    sections: [
      {
        heading: 'A Numeração Universal dos Dedos (1 a 5)',
        text: 'Em toda a literatura mundial de piano, partituras e métodos clássicos ou populares, os dedos das mãos são identificados pelos números de 1 a 5. A numeração é SIMÉTRICA em relação ao centro do corpo:',
        bulletPoints: [
          'Dedo 1 = POLEGAR (em ambas as mãos, apontando para o centro do teclado).',
          'Dedo 2 = INDICADOR.',
          'Dedo 3 = MÉDIO (o dedo mais longo da mão).',
          'Dedo 4 = ANELAR (o dedo com menor independência natural, que requer paciência).',
          'Dedo 5 = MÍNIMO (o dedo menor, responsável pelas notas mais agudas na MD e mais graves na ME).'
        ],
        visualType: 'piano_finger_numbering'
      },
      {
        heading: 'A Posição Natural da Mão e Altura do Banco',
        text: 'A mão do pianista nunca deve ficar espalmada nem tensa como garras:',
        bulletPoints: [
          'Formato em Concha: Imagine que você está segurando uma maçã suave ou uma bola de tênis. As articulações dos dedos devem ficar ligeiramente arredondadas.',
          'Toque com a Polpa: Toque na almofadinha da ponta dos dedos, perto da unha (exceto o polegar, que toca com a lateral externa).',
          'Altura do Banco: Sente-se na metade da frente do banco com os pés apoiados no chão. Seus antebraços devem ficar rigorosamente paralelos ao teclado ou ligeiramente inclinados para baixo.',
          'Punho Flexível: O punho deve agir como o amortecedor de um carro de luxo. Se o punho travar, o som soa duro e metálico e o músico desenvolve tendinite.'
        ],
        proTip: 'Dica de Ouro: Deixe os braços caírem soltos ao lado do corpo enquanto estiver em pé. Observe a curvatura natural dos seus dedos: essa é a posição perfeita que você deve levar até as teclas!'
      }
    ],
    quiz: [
      {
        question: 'Qual número representa o dedo POLEGAR na convenção universal de piano para ambas as mãos?',
        options: ['Dedo 5', 'Dedo 1', 'Dedo 3', 'Dedo 2'],
        correctIndex: 1,
        explanation: 'Correto! O Polegar é sempre o Dedo 1 em ambas as mãos (Mão Direita e Mão Esquerda).'
      },
      {
        question: 'Como devem estar posicionados os dedos sobre o teclado do piano?',
        options: [
          'Completamente esticados e rígidos',
          'Arredondados naturalmente em concha, como segurando uma maçã',
          'Apertando as teclas com as unhas verticais',
          'Colados uns aos outros'
        ],
        correctIndex: 1,
        explanation: 'Exato! A curvatura natural dos dedos arredondados permite usar o peso do braço e dá agilidade aos tendões.'
      }
    ]
  },

  {
    id: 'piano-pauta-dupla-claves',
    level: 'inicial',
    levelLabel: 'Inicial / Básico',
    instrument: 'piano',
    order: 3,
    title: '3. A Pauta Dupla (Grand Staff) e as Claves de Sol e Fá',
    subtitle: 'O sistema de leitura simultânea: Clave de Sol na mão direita, Clave de Fá na mão esquerda',
    badge: 'Pauta Dupla (Grand Staff)',
    estimatedReadMinutes: 6,
    summary: 'Entenda como o piano conecta duas claves ao mesmo tempo e descubra como o Dó Central (C4) atua como a ponte de ouro entre as duas pautas.',
    sections: [
      {
        heading: 'O que é a Pauta Dupla (Grand Staff)?',
        text: 'Diferente de instrumentos monofônicos como trompete ou flauta que usam apenas uma pauta, o piano é um instrumento polifônico e orquestral de 88 notas. Por isso, a partitura de piano reúne duas pautas conectadas por uma chave ou colchete lateral chamada PAUTA DUPLA (Grand Staff):',
        bulletPoints: [
          'Pauta Superior (Clave de Sol): Lida pela MÃO DIREITA (MD). Registra notas médias, agudas e melodias.',
          'Pauta Inferior (Clave de Fá na 4ª linha): Lida pela MÃO ESQUERDA (ME). Registra notas médias, graves, linhas de baixo e harmonias.'
        ],
        visualType: 'grand_staff'
      },
      {
        heading: 'O Dó Central (C4) como Elo Dourado',
        text: 'O Dó Central (C4 / 3) não pertence exclusivamente a nenhuma das duas pautas: ele flutua exatamente no meio de ambas:',
        bulletPoints: [
          'Na Clave de Sol: É escrito na 1ª linha suplementar INFERIOR.',
          'Na Clave de Fá: É escrito na 1ª linha suplementar SUPERIOR.',
          'É exatamente a MESMA nota, a mesma tecla e a mesma frequência de 261.6 Hz!'
        ],
        interactiveNoteIds: ['C3', 'G3', 'C4', 'G4', 'C5'],
        proTip: 'Regra de Leitura Visual: Notas com hastes viradas para cima geralmente são tocadas pela Mão Direita; notas com hastes para baixo são tocadas pela Mão Esquerda!'
      }
    ],
    quiz: [
      {
        question: 'Qual clave é normalmente tocada pela MÃO ESQUERDA na pauta inferior do piano?',
        options: ['Clave de Dó', 'Clave de Fá na 4ª linha', 'Clave de Sol', 'Clave Rítmica'],
        correctIndex: 1,
        explanation: 'Perfeito! A Clave de Fá na 4ª linha rege os graves e médios, lidos habitualmente pela mão esquerda.'
      },
      {
        question: 'Onde se localiza o Dó Central (C4) na pauta dupla (Grand Staff)?',
        options: [
          'Na 3ª linha da Clave de Sol',
          'Na 1ª linha suplementar inferior da Clave de Sol e 1ª linha suplementar superior da Clave de Fá',
          'No 4º espaço da Clave de Fá',
          'Apenas na pauta do violoncelo'
        ],
        correctIndex: 1,
        explanation: 'Exato! O Dó Central é o ponto de encontro equidistante entre a Clave de Sol e a Clave de Fá.'
      }
    ]
  },

  {
    id: 'piano-primeiros-acordes-coordenacao',
    level: 'inicial',
    levelLabel: 'Inicial / Básico',
    instrument: 'piano',
    order: 4,
    title: '4. Primeiros Acordes e Coordenação das Duas Mãos',
    subtitle: 'A posição de 5 dedos, tríades fundamentais e a independência motora elementar',
    badge: 'Coordenação & Acordes',
    estimatedReadMinutes: 6,
    summary: 'Aprenda a tocar a posição de cinco dedos em Dó Maior, forme suas primeiras tríades com os dedos 1-3-5 e sincronize o baixo da mão esquerda com a melodia da mão direita.',
    sections: [
      {
        heading: 'A Posição Inicial de Cinco Dedos (Five-Finger Pattern)',
        text: 'Para começar a tocar sem saltar pelo teclado, posicionamos uma mão sobre cada oitava:',
        bulletPoints: [
          'Mão Direita (MD): Dedo 1 no Dó Central (C4), Dedo 2 no Ré, Dedo 3 no Mi, Dedo 4 no Fá, Dedo 5 no Sol.',
          'Mão Esquerda (ME): Dedo 5 no Dó Grave (C3), Dedo 4 no Ré, Dedo 3 no Mi, Dedo 2 no Fá, Dedo 1 no Sol.',
          'Note que os dedos são opostos: enquanto a MD sobe com 1-2-3-4-5, a ME sobe com 5-4-3-2-1!'
        ],
        visualType: 'piano_accompaniment'
      },
      {
        heading: 'Sua Primeira Tríade: Dó Maior (C)',
        text: 'Pressione três teclas ao mesmo tempo pulando uma tecla de intervalo (terças):',
        bulletPoints: [
          'Tríade de Dó Maior (C): Dó - Mi - Sol (C - E - G / 3 - 5 - 7).',
          'Digitação na Mão Direita: Dedos 1, 3 e 5.',
          'Digitação na Mão Esquerda: Dedos 5, 3 e 1.',
          'Baixo + Acorde: Toque a nota Dó no baixo com o dedo 5 da ME e a tríade completa na MD.'
        ],
        proTip: 'Para coordenar as mãos: primeiro toque apenas a mão direita contando em voz alta "1, 2, 3, 4". Depois apenas a mão esquerda. Só junte as duas quando cada uma estiver no piloto automático!',
        interactiveNoteIds: ['C4', 'E4', 'G4', 'C3', 'G3']
      }
    ],
    quiz: [
      {
        question: 'Quais dedos da Mão Direita são usados para tocar a tríade fundamental de Dó Maior (C - E - G)?',
        options: ['Dedos 1, 2 e 3', 'Dedos 1, 3 e 5', 'Dedos 2, 3 e 4', 'Dedos 3, 4 e 5'],
        correctIndex: 1,
        explanation: 'Correto! Os dedos 1 (Polegar), 3 (Médio) e 5 (Mínimo) tocam as três notas pulando uma tecla.'
      },
      {
        question: 'Por que a mão esquerda usa dedos 5-4-3-2-1 para subir de Dó a Sol, enquanto a mão direita usa 1-2-3-4-5?',
        options: [
          'Porque a mão esquerda é mais fraca',
          'Porque as duas mãos humanas são anatomicamente espelhadas com os polegares voltados para dentro',
          'Porque o piano foi inventado para canhotos',
          'Não há razão anatômica'
        ],
        correctIndex: 1,
        explanation: 'Exato! A simetria do corpo humano faz com que os dedos 1 (polegares) fiquem virados para o centro.'
      }
    ]
  },

  // =========================================================================
  // NÍVEL MÉDIO (PIANO - INTERMEDIÁRIO & ESTRUTURAS)
  // =========================================================================
  {
    id: 'piano-escalas-passagem-polegar',
    level: 'media',
    levelLabel: 'Médio / Intermediário',
    instrument: 'piano',
    order: 5,
    title: '5. Escalas ao Piano e a Técnica de Passagem do Polegar (Thumb-Under)',
    subtitle: 'Como tocar 8 notas com apenas 5 dedos: a rotação sutil do polegar e digitação canônica',
    badge: 'Escalas & Thumb-Under',
    estimatedReadMinutes: 6,
    summary: 'Aprenda a mecânica da passagem do polegar por baixo da palma da mão, dominando a escala de Dó Maior e as regras universais de digitação de escalas no piano.',
    sections: [
      {
        heading: 'O Desafio Matemático: 8 Notas e 5 Dedos',
        text: 'Uma escala diatônica completa de oitava a oitava possui 8 notas (ex: Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó). Como temos apenas 5 dedos em cada mão, os mestres do classicismo (Clementi, Czerny, Mozart) aperfeiçoaram a passagem do polegar (Thumb-Under):',
        bulletPoints: [
          'O polegar é o único dedo da mão humana dotado de articulação em sela capaz de deslizar por baixo da palma sem exigir que o braço pule ou quebre o legato sonoro.',
          'A passagem nunca é feita de supetão: assim que o dedo 2 toca, o polegar já começa a viajar suavemente por baixo da palma em direção à sua próxima tecla.'
        ],
        visualType: 'piano_scales_fingering'
      },
      {
        heading: 'Digitação Padrão de Dó Maior nas Duas Mãos',
        text: 'Memorize as fórmulas de ida e volta:',
        bulletPoints: [
          'Mão Direita (Subindo): 1 (C) - 2 (D) - 3 (E) ➔ [passa polegar] ➔ 1 (F) - 2 (G) - 3 (A) - 4 (B) - 5 (C).',
          'Mão Direita (Descendo): 5 (C) - 4 (B) - 3 (A) - 2 (G) - 1 (F) ➔ [cruza dedo 3 por cima] ➔ 3 (E) - 2 (D) - 1 (C).',
          'Mão Esquerda (Subindo): 5 (C) - 4 (D) - 3 (E) - 2 (F) - 1 (G) ➔ [cruza dedo 3 por cima] ➔ 3 (A) - 2 (B) - 1 (C).',
          'Mão Esquerda (Descendo): 1 (C) - 2 (B) - 3 (A) ➔ [passa polegar] ➔ 1 (G) - 2 (F) - 3 (E) - 4 (D) - 5 (C).'
        ],
        proTip: 'Regra de Ouro do Pianista: O polegar (1) e o dedo mínimo (5) NUNCA devem tocar teclas pretas em escalas padrão! As teclas pretas são reservadas para os dedos longos (2, 3 e 4).',
        interactiveNoteIds: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
      }
    ],
    quiz: [
      {
        question: 'Na subida da Escala de Dó Maior com a Mão Direita, após qual dedo o polegar (1) deve passar por baixo?',
        options: ['Após o dedo 5', 'Após o dedo 3 (na nota Mi para tocar Fá)', 'Após o dedo 2', 'Após o dedo 4'],
        correctIndex: 1,
        explanation: 'Muito bem! Na Mão Direita, tocamos 1-2-3 (Dó-Ré-Mi) e o polegar passa por baixo do dedo 3 para assumir o Fá (1-2-3-4-5).'
      },
      {
        question: 'Por que o polegar (1) e o dedo mínimo (5) evitam tocar teclas pretas em dedilhados padrão de escala?',
        options: [
          'Porque são os dedos mais curtos da mão e forçariam a mão a avançar desconfortavelmente para o fundo do teclado',
          'Porque quebram as teclas pretas',
          'Por superstição antiga',
          'Porque as teclas pretas são mais pesadas'
        ],
        correctIndex: 0,
        explanation: 'Exato! O polegar e o mínimo são curtos; colocar dedos curtos em teclas pretas desalinha o punho e causa tensão no antebraço.'
      }
    ]
  },

  {
    id: 'piano-inversoes-acordes',
    level: 'media',
    levelLabel: 'Médio / Intermediário',
    instrument: 'piano',
    order: 6,
    title: '6. Inversões de Acordes no Piano e Condução de Vozes (Voice Leading)',
    subtitle: 'Posição fundamental, 1ª e 2ª inversão: toque harmonias ricas com movimento mínimo dos dedos',
    badge: 'Harmonia & Inversões',
    estimatedReadMinutes: 6,
    summary: 'Compreenda como reorganizar a ordem das notas de um acorde para criar passagens suaves e fluidas, eliminando os saltos bruscos com a mão pelo teclado.',
    sections: [
      {
        heading: 'As 3 Posições de uma Tríade no Teclado',
        text: 'Qualquer tríade de 3 notas pode ser montada de 3 maneiras no piano, mudando qual nota fica na posição mais grave:',
        bulletPoints: [
          '1. Posição Fundamental (5/3): A fundamental fica no baixo. Exemplo em Dó Maior: C - E - G (Dó - Mi - Sol). Dedos MD: 1 - 3 - 5.',
          '2. Primeira Inversão (6/3): A terça fica no baixo. Exemplo: E - G - C (Mi - Sol - Dó / Cifra: C/E). Dedos MD: 1 - 2 - 5.',
          '3. Segunda Inversão (6/4): A quinta fica no baixo. Exemplo: G - C - E (Sol - Dó - Mi / Cifra: C/G). Dedos MD: 1 - 3 - 5 ou 1 - 2 - 4.'
        ],
        visualType: 'piano_chord_inversions'
      },
      {
        heading: 'A Lei da Condução Suave de Vozes (Voice Leading)',
        text: 'Tocar todos os acordes em posição fundamental faz o pianista parecer um robô que pula de bloco em bloco:',
        bulletPoints: [
          'Princípio da Nota Comum: Quando mudar de acorde, MANTENHA as notas que forem comuns entre eles com os mesmos dedos!',
          'Exemplo C ➔ F: Em vez de pular a mão inteira de C (Dó-Mi-Sol) para F (Fá-Lá-Dó), mantenha a nota Dó fixa no dedo 1 e mova apenas os dedos superiores para Fá (dedo 3) e Lá (dedo 5). Você tocou Fá Maior na 2ª inversão!',
          'Exemplo C ➔ G: Mantenha a nota Sol e mova Dó para Si e Mi para Ré. O acorde de Sol Maior foi alcançado na 1ª inversão sem sair do lugar!'
        ],
        proTip: 'Dica do Pianista Profissional: O público admira quem toca com economia de movimento. Quanto menos a sua mão pular, mais limpo, rápido e afinado soará o seu piano!',
        interactiveNoteIds: ['C4', 'E4', 'G4', 'E4', 'G4', 'C5', 'G4', 'C5', 'E5']
      }
    ],
    quiz: [
      {
        question: 'Qual é a ordem das notas de Dó Maior na PRIMEIRA INVERSÃO (C/E)?',
        options: ['Dó - Mi - Sol', 'Mi - Sol - Dó', 'Sol - Dó - Mi', 'Dó - Fá - Lá'],
        correctIndex: 1,
        explanation: 'Correto! Na 1ª inversão, a terça (Mi) vai para a base: Mi - Sol - Dó (C/E).'
      },
      {
        question: 'Qual é a principal vantagem de usar inversões na condução de acordes (Voice Leading)?',
        options: [
          'Permitir transições suaves mantendo notas comuns sem precisar saltar a mão pelo teclado',
          'Fazer o som ficar mais baixo',
          'Tocar mais devagar',
          'Eliminar a necessidade de pedais'
        ],
        correctIndex: 0,
        explanation: 'Exato! Inversões garantem condução suave de vozes com economia de energia e clareza acústica.'
      }
    ]
  },

  {
    id: 'piano-uso-dos-pedais',
    level: 'media',
    levelLabel: 'Médio / Intermediário',
    instrument: 'piano',
    order: 7,
    title: '7. O Uso dos 3 Pedais do Piano e a Arte do Pedal Sincopado',
    subtitle: 'Sustain (Damper), Una Corda e Sostenuto: o fôlego e a acústica mágica do piano',
    badge: 'Pedais & Acústica',
    estimatedReadMinutes: 6,
    summary: 'Descubra a função exata de cada um dos três pedais e domine a técnica do pedal sincopado para sustentar harmonias sem embaçar as trocas de acordes.',
    sections: [
      {
        heading: 'Os 3 Pedais do Piano de Cauda e Vertical',
        text: 'O pianista russo Anton Rubinstein afirmava: "O pedal é a alma do piano". Os três pedais modificam a mecânica interna do instrumento:',
        bulletPoints: [
          '1. Pedal de Sustentação (Damper / Forte / Sustain - Direito): É o pedal mais usado. Levanta TODOS os abafadores de feltro das cordas. O som continua vibrando livremente e as demais cordas vibram por ressonância simpática, criando um ambiente rico em harmônicos.',
          '2. Pedal Una Corda (Soft / Piano - Esquerdo): No piano de cauda, desloca todo o teclado alguns milímetros para a direita, fazendo os martelos ferirem 2 cordas em vez de 3 (ou ferirem uma parte mais macia do feltro). O som fica etéreo, aveludado e com timbre misterioso.',
          '3. Pedal Sostenuto (Central): No piano de cauda, sustenta APENAS as notas que estavam com as teclas abaixadas no exato milissegundo em que o pedal foi pisado! Todas as notas tocadas em seguida soam staccato normalmente. (Nos pianos verticais caseiros, o pedal central costuma ser a surdina de feltro para estudo silencioso).'
        ],
        visualType: 'piano_pedals'
      },
      {
        heading: 'A Técnica do Pedal Sincopado (Troca Limpa)',
        text: 'O erro mais comum do estudante iniciante é pisar no pedal no mesmo instante em que o dedo ataca a tecla, o que mistura o acorde anterior com o novo num borrão dissonante:',
        bulletPoints: [
          'Regra de Ouro: O pedal é trocado DEPOIS que o novo acorde soou nas cordas!',
          'Passo 1: Seus dedos atacam o novo acorde com clareza.',
          'Passo 2: No exato milésimo de segundo seguinte, seu pé levanta rapidamente (limpando o acorde velho) e desce imediatamente (capturando o novo som).',
          'Passo 3: Mantenha o calcanhar apoiado no chão o tempo todo, articulando apenas com a ponta do pé.'
        ],
        proTip: 'Pense no pedal como a respiração de um cantor: ele limpa o ar antes da próxima frase musical!'
      }
    ],
    quiz: [
      {
        question: 'Qual é o efeito mecânico do pedal de sustentação (Sustain / Damper - direito)?',
        options: [
          'Afrouxa as cordas do piano',
          'Levanta todos os abafadores de feltro, permitindo que as cordas continuem vibrando livremente',
          'Bloqueia as teclas pretas',
          'Muda o som para trompete'
        ],
        correctIndex: 1,
        explanation: 'Perfeito! O pedal direito levanta os abafadores de feltro, gerando sustentação e ressonância simpática.'
      },
      {
        question: 'Quando deve ser feita a troca do pedal sincopado durante a mudança de harmonia?',
        options: [
          'Antes de tocar o novo acorde',
          'Imediatamente DEPOIS que as novas notas foram tocadas pelos dedos (sobe e desce rápido)',
          'Nunca se deve soltar o pedal',
          'Apenas no final da música'
        ],
        correctIndex: 1,
        explanation: 'Exato! O pé sobe e desce imediatamente após o ataque dos dedos, limpando o som antigo sem deixar silêncio vazio.'
      }
    ]
  },

  {
    id: 'piano-padroes-acompanhamento-arpejos',
    level: 'media',
    levelLabel: 'Médio / Intermediário',
    instrument: 'piano',
    order: 8,
    title: '8. Padrões de Acompanhamento e Arpejos ao Piano',
    subtitle: 'Baixo Alberti, arpejos abertos de 10ª e levadas rítmicas para a mão esquerda',
    badge: 'Acompanhamento & Arpejos',
    estimatedReadMinutes: 6,
    summary: 'Aprenda como transformar acordes estáticos em texturas fluidas, aplicando o clássico Baixo Alberti e arpejos orquestrais modernos.',
    sections: [
      {
        heading: 'Como a Mão Esquerda Dá Vida à Música',
        text: 'No piano solo ou acompanhando um cantor ou trompetista, a mão esquerda não precisa apenas tocar blocos pesados. Existem padrões consagrados pela história:',
        bulletPoints: [
          '1. Baixo Alberti (Classicismo de Mozart e Haydn): Decompõe a tríade na ordem Baixo - Agudo - Médio - Agudo (Ex em Dó: C3 - G3 - E3 - G3 / 1 - 5 - 3 - 5). Produz um fluxo contínuo e elegante.',
          '2. Arpejo Aberto de 10ª (Balada, MPB e Pop): Toca a Fundamental no grave, a 5ª no meio e a 10ª (oitava + terça) no agudo (Ex: C2 - G2 - E3). Elimina o embolamento dos graves e soa com a amplitude de uma orquestra.',
          '3. Baixo com Acorde Pulsado (Valsa 3/4 e Marcha 4/4): O baixo forte na 1ª batida (dedo 5 da ME) seguido por acordes nas batidas seguintes.'
        ],
        visualType: 'piano_accompaniment'
      },
      {
        heading: 'Por que Evitar Terças Muito Graves?',
        text: 'Acusticamente, quanto mais grave a nota, mais próximos ficam seus harmônicos naturais:',
        bulletPoints: [
          'Se você tocar uma tríade fechada como Dó-Mi-Sol na oitava 1 ou 2 (muito grave), as frequências dos harmônicos colidem e produzem um som pastoso e sujo (efeito "lama acústica").',
          'Solução dos mestres: No grave (abaixo de C3), use apenas 8ªs ou 5ªs limpas. Reserve as terças e colorações para a região média e aguda (de C3 para cima)!'
        ],
        proTip: 'Para praticar o Baixo Alberti com perfeição: use rotação suave do antebraço (como girar a maçaneta de uma porta), nunca force os dedos isolados!'
      }
    ],
    quiz: [
      {
        question: 'Qual é a sequência de notas do clássico padrão de "Baixo Alberti" sobre a tríade de Dó Maior?',
        options: [
          'Todas as 3 notas juntas',
          'Baixo - Agudo - Médio - Agudo (Dó - Sol - Mi - Sol)',
          'Dó - Ré - Mi - Fá',
          'Apenas a nota Dó repetida'
        ],
        correctIndex: 1,
        explanation: 'Correto! O Baixo Alberti alterna Fundamental (Dó) - 5ª (Sol) - 3ª (Mi) - 5ª (Sol).'
      },
      {
        question: 'Por que se deve evitar tocar tríades com terças fechadas na região supergrave do piano?',
        options: [
          'Porque quebra as cordas',
          'Porque os harmônicos graves colidem acusticamente gerando uma sonoridade pastosa e embolada',
          'Porque as teclas graves são proibidas',
          'Não há problema algum'
        ],
        correctIndex: 1,
        explanation: 'Exato! No grave extremo os harmônicos colidem; por isso os mestres usam intervalos abertos de 8ª e 5ª no grave.'
      }
    ]
  },

  // =========================================================================
  // NÍVEL AVANÇADO (PIANO - HARMONIA SUPERIOR & VIRTUOSISMO)
  // =========================================================================
  {
    id: 'piano-tetrades-voicings-modernos',
    level: 'avancado',
    levelLabel: 'Avançado / Profissional',
    instrument: 'piano',
    order: 9,
    title: '9. Tétrades, Acordes com Sétima e Voicings Modernos no Teclado',
    subtitle: 'Maj7, m7, 7, m7(b5), aberturas Drop-2 e acordes sem fundamental (Rootless Voicings)',
    badge: 'Tétrades & Voicings',
    estimatedReadMinutes: 7,
    summary: 'Aprenda a construir os quatro tipos de acordes de 4 notas e domine as técnicas de distribuição harmônica utilizadas por pianistas de jazz, bossa nova e MPB.',
    sections: [
      {
        heading: 'As 4 Grandes Famílias de Tétrades',
        text: 'Acrescentando uma 3ª acima da 5ª do acorde, formamos a Sétima (7), criando acordes de quatro notas com riqueza psicológica superior:',
        bulletPoints: [
          '1. Cmaj7 (Dó com Sétima Maior): C - E - G - B (Dó - Mi - Sol - Si). Tríade maior + 7ª maior. Cor sonhadora, nobre e sofisticada.',
          '2. C7 (Dó Dominante): C - E - G - Bb. Tríade maior + 7ª menor. Contém o Trítono instável entre Mi e Si♭ que exige resolução em Fá.',
          '3. Cm7 (Dó Menor com Sétima): C - Eb - G - Bb. Tríade menor + 7ª menor. Elegância melancólica suave.',
          '4. Cm7(b5) (Dó Meio-Diminuto): C - Eb - Gb - Bb. Tríade diminuta + 7ª menor. O II grau característico das tonalidades menores.'
        ],
        visualType: 'piano_voicings'
      },
      {
        heading: 'Técnica de Voicings Drop-2 e Rootless Voicings',
        text: 'Pianistas avançados nunca tocam tétrades empilhadas em blocos compactos porque isso soa estreito e amador:',
        bulletPoints: [
          'Voicing Drop-2: Pega-se a segunda nota mais aguda de um acorde de 4 sons e joga-se uma oitava abaixo para a mão esquerda. O acorde ganha respiração, clareza e largura sonora!',
          'Rootless Voicings (Acordes sem Fundamental): Quando tocamos com baixista, o contrabaixo já garante a nota fundamental (C). A mão esquerda do pianista assume a 3ª e a 7ª (as notas-guia), liberando a mão direita para acrescentar extensões luxuosas como 9ª, 11ª aumentada (#11) e 13ª!'
        ],
        proTip: 'Memorize esta regra de ouro do jazz e da bossa nova: as duas notas mais importantes de qualquer acorde com sétima são sempre a TERÇA (que diz se é maior ou menor) e a SÉTIMA (que diz a função tonal)!'
      }
    ],
    quiz: [
      {
        question: 'Quais são as duas notas indispensáveis (Guide Tones) que definem a essência e função de qualquer acorde com sétima?',
        options: ['A 5ª e a Fundamental', 'A 3ª e a 7ª', 'A Fundamental e a 8ª', 'O pedal e a clave'],
        correctIndex: 1,
        explanation: 'Exato! A Terça e a Sétima são os pilares que definem o modo e a função harmônica do acorde.'
      },
      {
        question: 'O que caracteriza a técnica de distribuição de vozes "Drop-2" no teclado?',
        options: [
          'Deixar cair duas teclas no chão',
          'Rebaixar a 2ª voz superior de uma tétrade em 1 oitava para abrir o espaço acústico do acorde',
          'Tocar apenas 2 notas na música toda',
          'Eliminar a mão esquerda'
        ],
        correctIndex: 1,
        explanation: 'Correto! Drop-2 rebaixa a 2ª nota do topo para abrir o acorde, gerando clareza e riqueza harmônica orquestral.'
      }
    ]
  },

  {
    id: 'piano-polifonia-independencia-maos',
    level: 'avancado',
    levelLabel: 'Avançado / Profissional',
    instrument: 'piano',
    order: 10,
    title: '10. Polifonia e Independência Total das Mãos (Estudos de Bach)',
    subtitle: 'Contraponto a 2 e 3 vozes, toques contrastantes (legato vs staccato) e dinâmicas simultâneas',
    badge: 'Polifonia & Contraponto',
    estimatedReadMinutes: 7,
    summary: 'Aprenda a tocar como se fossem dois ou três músicos distintos ao mesmo tempo, aplicando o legado de Johann Sebastian Bach para controle cerebral absoluto.',
    sections: [
      {
        heading: 'O Que é a Verdadeira Polifonia Pianística?',
        text: 'Polifonia significa "muitas vozes". Diferente da música homofônica (onde a mão direita canta e a mão esquerda apenas acompanha), na música contrapontística cada mão é uma voz solista soberana:',
        bulletPoints: [
          'As Invenções a 2 Vozes e as Fugas do Cravo Bem Temperado de J. S. Bach são os maiores tratados mundiais de desenvolvimento da mente do pianista.',
          'Um tema melódico começa na mão direita; alguns compassos depois a mão esquerda imita exatamente o mesmo tema (fuga/imitação) enquanto a mão direita passa a tecer um contracanto complexo!'
        ],
        visualType: 'grand_staff'
      },
      {
        heading: 'Os Três Níveis de Independência Motora',
        text: 'Para alcançar o domínio supremo, treine estas três camadas de independência:',
        bulletPoints: [
          '1. Independência Rítmica: Uma mão toca tercinas (3 notas por pulso) enquanto a outra toca colcheias regulares (2 notas por pulso) — a célebre proporção 3 contra 2!',
          '2. Independência de Toque (Articulação): A mão direita toca um fraseado ultralegato enquanto a mão esquerda articula staccatos leves e crocantes.',
          '3. Independência de Dinâmica: A mão direita projeta em Forte (f) a voz principal enquanto a mão esquerda acompanha em Pianissimo (pp).'
        ],
        proTip: 'O método de estudo de Bach: estude cada mão separadamente até conseguir cantar uma mão enquanto toca a outra! Esse é o teste definitivo de independência cerebral.'
      }
    ],
    quiz: [
      {
        question: 'Qual compositor barroco é considerado o mestre supremo da polifonia e do contraponto para teclado (Invenções e Fugas)?',
        options: ['Wolfgang Amadeus Mozart', 'Johann Sebastian Bach', 'Ludwig van Beethoven', 'Frédéric Chopin'],
        correctIndex: 1,
        explanation: 'Muito bem! J. S. Bach é o ápice do contraponto e da polifonia para instrumentos de teclado.'
      },
      {
        question: 'O que significa independência de articulação entre as mãos no piano?',
        options: [
          'Tocar com os olhos vendados',
          'Uma mão tocar com toque legato sustentado enquanto a outra articula staccato simultaneamente',
          'Usar um metrônomo para cada mão',
          'Tocar em dois pianos diferentes'
        ],
        correctIndex: 1,
        explanation: 'Exato! Controlar toques contrastantes simultaneamente (legato numa mão e staccato na outra) é o ápice da independência motora.'
      }
    ]
  },

  {
    id: 'piano-harmonia-funcional-lead-sheet',
    level: 'avancado',
    levelLabel: 'Avançado / Profissional',
    instrument: 'piano',
    order: 11,
    title: '11. Harmonia Funcional ao Piano e Leitura de Cifras (Lead Sheet)',
    subtitle: 'Cadências II - V - I, rearmonização, acordes alterados e substituição de trítono ao piano',
    badge: 'Lead Sheet & Harmonia',
    estimatedReadMinutes: 8,
    summary: 'Aprenda como pianistas profissionais leem partituras de linha melódica e cifra (Fake Books), aplicando rearmonização rica e encadeamentos II-V-I sofisticados.',
    sections: [
      {
        heading: 'Como Ler Partituras de Linha Melódica (Lead Sheets)',
        text: 'Em 90% do mercado musical contemporâneo (estúdios, igrejas, bandas, MPB e jazz), o pianista não recebe partituras com as notas da mão esquerda escritas compasso por compasso. Ele recebe uma Lead Sheet contendo apenas a melodia principal na pauta e cifras acima dos compassos:',
        bulletPoints: [
          'O pianista é o orquestrador em tempo real: ele decide se toca o baixo puro na ME e acordes na MD, se faz arpejos ou se harmoniza a melodia em blocos (Drop-2).',
          'O segredo é dominar as Progressões Cadenciais Universais: II ➔ V ➔ I.'
        ],
        visualType: 'functional_harmony'
      },
      {
        heading: 'A Magia da Resolução do II - V - I no Teclado',
        text: 'Veja como as notas se movem por apenas meio tom na tonalidade de Dó Maior:',
        bulletPoints: [
          'Dm7 (II): Notas guia Fá (3ª) e Dó (7ª).',
          'G7 (V): A 7ª de Dm7 (Dó) desce MEIO TOM e torna-se Si (a 3ª de G7)! A outra nota (Fá) permanece como a 7ª de G7! As duas notas formam o Trítono tenso.',
          'Cmaj7 (I): A 7ª de G7 (Fá) desce MEIO TOM e torna-se Mi (a 3ª de Cmaj7)! Resolução gloriosa e reconfortante.',
          'Substituição de Trítono (SubV7): Em vez de tocar G7, toque Db7 (a um trítono de distância). O baixo desce cromaticamente: Ré ➔ Ré♭ ➔ Dó!'
        ],
        proTip: 'Com tensões elegantes: adicione a 9ª no acorde menor (Dm9), a 9ª bemol e 13ª bemol no dominante (G7b9b13) e a 9ª maior na tônica (Cmaj9). Seu piano soará como um disco gravado em Nova York!'
      }
    ],
    quiz: [
      {
        question: 'O que acontece com a nota Dó (7ª de Dm7) quando o acorde caminha para G7 na cadência II-V-I?',
        options: [
          'Ela sobe uma oitava inteira',
          'Ela desce meio tom e torna-se a nota Si (a 3ª de G7)',
          'Ela vira uma pausa silenciosa',
          'Ela muda de clave'
        ],
        correctIndex: 1,
        explanation: 'Perfeito! A 7ª do acorde II desce meio tom para formar a 3ª do acorde V (condução suave de vozes).'
      },
      {
        question: 'O que é a Substituição de Trítono (SubV7) aplicada ao acorde dominante G7 que resolve em C?',
        options: [
          'Substituir o G7 pelo acorde de Db7 (distante 3 tons inteiros), criando uma linha de baixo cromática descendente Ré - Réb - Dó',
          'Remover o piano da música',
          'Tocar 3 vezes mais rápido',
          'Tocar apenas a nota Sol'
        ],
        correctIndex: 0,
        explanation: 'Exato! Db7 compartilha o mesmo trítono de G7 (Fá e Si/Dób), gerando uma condução cromática no baixo belíssima.'
      }
    ]
  },

  {
    id: 'piano-articulacao-velocidade-virtuosismo',
    level: 'avancado',
    levelLabel: 'Avançado / Profissional',
    instrument: 'piano',
    order: 12,
    title: '12. Articulação Avançada, Técnica do Peso do Braço e Virtuosismo sem Lesão',
    subtitle: 'O método Taubman, princípios de Chopin e Liszt: velocidade, arpejos de 4 oitavas e controle de timbre',
    badge: 'Técnica Superior',
    estimatedReadMinutes: 8,
    summary: 'Aprenda os segredos da biomecânica pianística que permitem tocar passagens ultra-rápidas, oitavas e arpejos com sonoridade rica e relaxamento total.',
    sections: [
      {
        heading: 'A Gravidade e o Peso do Braço (Adeus à Força dos Dedos)',
        text: 'A escola russa e os grandes mestres do piano (Chopin, Liszt, Rachmaninoff) revolucionaram a técnica ao demonstrar que os pequenos músculos flexores dos dedos não foram projetados para bater nas teclas com força:',
        bulletPoints: [
          'A força vem do peso do braço e da gravidade canalizados através de um punho flexível até a ponta firme do dedo.',
          'Quando você usa o peso livre do braço, o som que sai do piano é profundo, redondo, rico em harmônicos ("canta" como uma voz humana). Quando você bate com a força dos tendões, o som soa estridente, duro e machuca a musculatura.'
        ],
        visualType: 'sound_properties'
      },
      {
        heading: 'Rotação do Antebraço e as 4 Articulações Nobres',
        text: 'Para tocar trêmulos, arpejos e escalas rápidas sem fadiga muscular:',
        bulletPoints: [
          'Rotação do Antebraço (Método Taubman): O antebraço faz micro-rotações axiais invisíveis (como girar a maçaneta de uma porta ou acenar adeus), distribuindo o impulso motor instantaneamente entre o polegar e o dedo mínimo.',
          'Legato Cantabile: O som de uma nota sobrepõe-se ligeiramente ao início da próxima, criando a ilusão perfeita de que o piano está cantando.',
          'Staccato de Pulso: Pequeno salto elástico originado no punho, como uma bola de borracha pingando no chão.',
          'Tenuto e Portato: Notas sustentadas com peso nobre e ligeira separação entre elas, ideal para temas expressivos.'
        ],
        proTip: 'Se você sentir qualquer dor ou queimação no antebraço ou punho, PARE IMEDIATAMENTE. O piano bem tocado não deve doer nunca: a dor é o alerta do corpo de que há tensão desnecessária bloqueando o movimento!'
      }
    ],
    quiz: [
      {
        question: 'De onde deve vir a força motora para produzir um som forte e encorpado ao piano sem causar lesões por esforço repetitivo (LER)?',
        options: [
          'Da força isolada dos tendões dos dedos batendo com agressividade',
          'Do peso livre do braço e antebraço canalizados através de um punho flexível',
          'Da rigidez dos ombros travados',
          'De apertar o banco com as pernas'
        ],
        correctIndex: 1,
        explanation: 'Exato! A gravidade e o peso do braço canalizados pelo punho relaxado produzem volume sem esforço muscular destrutivo.'
      },
      {
        question: 'O que orienta a célebre técnica de rotação do antebraço (Método Taubman) em passagens rápidas de piano?',
        options: [
          'Girar a cabeça para os lados',
          'Micro-rotações axiais do antebraço que transferem o peso de dedo em dedo como girar suavemente uma maçaneta',
          'Pular do banco a cada compasso',
          'Cruzar os braços o tempo todo'
        ],
        correctIndex: 1,
        explanation: 'Perfeito! A micro-rotação do antebraço distribui a inércia motora e liberta os dedos para velocidade extrema.'
      }
    ]
  }
];
