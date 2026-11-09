window.NOVO_CLUBE_DEFAULT_DATA = {
  accountEmail: 'teste@email.com',
  currentMonth: 'Outubro',
  monthsOrder: ['Outubro', 'Novembro', 'Dezembro'],
  monthsMeta: {
    Outubro: {
      count: 5,
      title: 'Outubro — 5 benefícios',
      focus: 'Incentivar os primeiros resgates e apresentar vantagens acessíveis do Clube.'
    },
    Novembro: {
      count: 10,
      title: 'Novembro — 10 benefícios',
      focus: 'Black Friday, aumento do consumo, circulação entre lojas e incentivo às próximas visitas.'
    },
    Dezembro: {
      count: 15,
      title: 'Dezembro — 15 benefícios',
      focus: 'Compras natalinas, presentes, alimentação, lazer em família e incentivo ao retorno após as festas.'
    }
  },
  activeProfileId: 'mariana',
  isAuthenticated: false,
  profileSelected: false,

  astros: [
    {
      id: 'servicos',
      name: 'Astro Serviços',
      category: 'Serviços',
      colorName: 'Amarelo',
      accentColor: '#FACC15',
      requiredPoints: 0,
      releaseMonth: 'Outubro',
      requirementLabel: 'Ação cadastrada',
      image3d: 'assets/images/astros/astro-servicos.png?v=8',
      imageReal: 'assets/images/astros-reais/astro-servicos-real.jpg?v=8',
      accessories: 'Camisa polo amarela com crachá do Novo Shopping e óculos redondos',
      description: 'Desbloqueado automaticamente no seu cadastro! Representa a praticidade de resolver tudo em um só lugar: bancos, lotérica, academia, clínica de saúde e serviços especializados.'
    },
    {
      id: 'lazer',
      name: 'Astro Lazer',
      category: 'Lazer',
      colorName: 'Rosa',
      accentColor: '#F472B6',
      requiredPoints: 500,
      releaseMonth: 'Outubro',
      requirementLabel: '500 pontos',
      image3d: 'assets/images/astros/astro-lazer.png?v=8',
      imageReal: 'assets/images/astros-reais/astro-lazer-real.jpg?v=8',
      accessories: 'Óculos 3D de cinema e balde de pipoca exclusivo do Novo Shopping',
      description: 'Representa os momentos inesquecíveis em família: sessões de cinema, praça de alimentação completa, parques infantis e eventos culturais no Novo Shopping.'
    },
    {
      id: 'esportes',
      name: 'Astro Esportes',
      category: 'Saúde',
      colorName: 'Azul',
      accentColor: '#38BDF8',
      requiredPoints: 1000,
      releaseMonth: 'Novembro',
      requirementLabel: '1.000 pontos',
      image3d: 'assets/images/astros/astro-esportes.png?v=8',
      imageReal: 'assets/images/astros-reais/astro-esportes-real.jpg?v=8',
      accessories: 'Faixa esportiva na cabeça e par de halteres de pelúcia',
      description: 'Representa a categoria de Saúde, bem-estar e vida ativa. Liberado na virada para Novembro para quem acumula 1.000 pontos na coleção.'
    },
    {
      id: 'compras',
      name: 'Astro Compras',
      category: 'Varejo',
      colorName: 'Verde',
      accentColor: '#4ADE80',
      requiredPoints: 1500,
      releaseMonth: 'Dezembro',
      requirementLabel: '1.500 pontos',
      image3d: 'assets/images/astros/astro-compras.png?v=8',
      imageReal: 'assets/images/astros-reais/astro-compras-real.jpg?v=8',
      accessories: 'Óculos escuros estilosos, casquinha de sorvete e sacolas de compras do Novo Shopping',
      description: 'O grande troféu da jornada! Representa a força do Varejo, moda e gastronomia do Novo Shopping Ribeirão Preto. Liberado em Dezembro ao atingir 1.500 pontos acumulados.'
    }
  ],

  benefits: [
    // =========================================================
    // OUTUBRO — 5 BENEFÍCIOS
    // Foco: incentivar os primeiros resgates e apresentar vantagens acessíveis do Clube.
    // =========================================================
    {
      id: 'ben-out-1',
      month: 'Outubro',
      title: '20% de desconto em um ingresso de cinema.',
      category: 'Lazer',
      points: 50,
      partner: 'Cinemark Novo Shopping',
      location: 'Piso Lazer — Próximo à Praça de Alimentação',
      validity: 'Válido durante todo o mês de Outubro',
      image: 'assets/images/beneficios/cinema.jpg?v=14',
      description: 'Garanta 20% de desconto na compra de 1 ingresso de cinema no Cinemark do Novo Shopping Ribeirão Preto.',
      rules: [
        'Apresente o voucher gerado pelo Novo Clube na bilheteria ou insira o código no autoatendimento.',
        'Desconto de 20% válido para 1 ingresso em sessões participantes.',
        'O resgate utiliza apenas o seu Saldo de Benefícios; seus pontos da Coleção Astro continuam intactos!'
      ],
      featured: true
    },
    {
      id: 'ben-out-2',
      month: 'Outubro',
      title: 'R$ 15 de desconto em compras acima de R$ 80.',
      category: 'Compras',
      points: 100,
      partner: 'Lojas Participantes — Novo Shopping',
      location: 'Varejo & Moda — Lojas Sinalizadas',
      validity: 'Válido durante todo o mês de Outubro',
      image: 'assets/images/astros-reais/astro-compras-real.jpg?v=14',
      description: 'Bônus de R$ 15,00 de desconto imediato em compras a partir de R$ 80,00 nas lojas participantes do Novo Shopping.',
      rules: [
        'Válido para compras com valor mínimo de R$ 80,00 em uma única nota.',
        'Informe o código do voucher no caixa antes da finalização do pagamento.',
        'Seus pontos da Coleção Astro permanecem intactos após o resgate.'
      ],
      featured: true
    },
    {
      id: 'ben-out-3',
      month: 'Outubro',
      title: '20% de desconto em acessórios fitness, limitado a R$ 100,00.',
      category: 'Esportes',
      points: 175,
      partner: 'Centauro & Lojas Esportivas Novo Shopping',
      location: 'Corredor Central — Lojas de Esportes',
      validity: 'Válido durante todo o mês de Outubro',
      image: 'assets/images/astros-reais/astro-esportes-real.jpg?v=14',
      description: 'Aproveite 20% de desconto na compra de acessórios fitness e esportivos, limitado a R$ 100,00 de desconto nas lojas participantes.',
      rules: [
        'Desconto de 20% aplicável em acessórios fitness selecionados, limitado a R$ 100,00.',
        'Apresente o código de resgate no balcão de pagamento da loja parceira.',
        'O resgate desconta apenas do Saldo de Benefícios.'
      ],
      featured: true
    },
    {
      id: 'ben-out-4',
      month: 'Outubro',
      title: 'Obtenha isenção do seu estacionamento.',
      category: 'Geral',
      points: 100,
      partner: 'Estacionamento Novo Shopping',
      location: 'Guichês de Pagamento e Totens de Autoatendimento',
      validity: 'Válido durante todo o mês de Outubro',
      image: 'assets/images/beneficios/estacionamento.jpg?v=14',
      description: 'Obtenha a isenção do seu ticket de estacionamento no Novo Shopping Ribeirão Preto utilizando seus pontos do Clube.',
      rules: [
        'Apresente ou escaneie o código do voucher nos totens ou guichês de estacionamento antes da saída.',
        'Válido para 1 utilização de estacionamento no Novo Shopping.',
        'Seus pontos da Coleção Astro continuam intactos!'
      ],
      featured: true
    },
    {
      id: 'ben-out-5',
      month: 'Outubro',
      title: 'R$ 15,00 de desconto em lojas infantis.',
      category: 'Lazer',
      points: 100,
      partner: 'Ri Happy & Lojas Infantis Participantes',
      location: 'Corredor Infantil & Lazer — Novo Shopping',
      validity: 'Válido durante todo o mês de Outubro',
      image: 'assets/images/astros-reais/astro-lazer-real.jpg?v=14',
      description: 'Garanta R$ 15,00 de desconto em compras nas lojas infantis e de brinquedos participantes do Novo Shopping.',
      rules: [
        'Desconto de R$ 15,00 válido nas lojas infantis parceiras do Novo Clube.',
        'Apresente o voucher no caixa antes de encerrar a compra.',
        'Ideal para aproveitar o Mês das Crianças em família no Novo Shopping.'
      ],
      featured: true
    },

    // =========================================================
    // NOVEMBRO — 10 BENEFÍCIOS
    // Foco: Black Friday, aumento do consumo, circulação entre lojas e incentivo às próximas visitas.
    // =========================================================
    {
      id: 'ben-nov-1',
      month: 'Novembro',
      title: 'R$ 20 de desconto em compras acima de R$ 100.',
      category: 'Compras',
      points: 150,
      partner: 'Lojas Participantes — Novo Shopping',
      location: 'Varejo & Moda — Lojas Sinalizadas',
      validity: 'Válido durante todo o mês de Novembro',
      image: 'assets/images/astros-reais/astro-compras-real.jpg?v=14',
      description: 'Desconto direto de R$ 20,00 em compras a partir de R$ 100,00 nas lojas participantes durante o mês da Black Friday.',
      featured: true
    },
    {
      id: 'ben-nov-2',
      month: 'Novembro',
      title: '50% de desconto em um ingresso de cinema.',
      category: 'Lazer',
      points: 200,
      partner: 'Cinemark Novo Shopping',
      location: 'Piso Lazer — Próximo à Praça de Alimentação',
      validity: 'Válido durante todo o mês de Novembro',
      image: 'assets/images/beneficios/cinema.jpg?v=14',
      description: 'Garanta 50% de desconto na compra de 1 ingresso de cinema para curtir as estreias de novembro no Novo Shopping.',
      featured: true
    },
    {
      id: 'ben-nov-3',
      month: 'Novembro',
      title: 'Isente seu estacionamento.',
      category: 'Geral',
      points: 200,
      partner: 'Estacionamento Novo Shopping',
      location: 'Guichês e Totens de Autoatendimento',
      validity: 'Válido durante todo o mês de Novembro',
      image: 'assets/images/beneficios/estacionamento.jpg?v=14',
      description: 'Isente seu estacionamento no Novo Shopping Ribeirão Preto para aproveitar suas compras com total tranquilidade.',
      featured: true
    },
    {
      id: 'ben-nov-4',
      month: 'Novembro',
      title: 'R$ 40 de desconto em tênis esportivo acima de R$ 250.',
      category: 'Esportes',
      points: 250,
      partner: 'Centauro & Lojas de Calçados Esportivos',
      location: 'Corredor Esportivo — Novo Shopping',
      validity: 'Válido durante todo o mês de Novembro',
      image: 'assets/images/astros-reais/astro-esportes-real.jpg?v=14',
      description: 'Bônus de R$ 40,00 de desconto na compra de tênis esportivo com valor a partir de R$ 250,00 nas lojas parceiras.',
      featured: true
    },
    {
      id: 'ben-nov-5',
      month: 'Novembro',
      title: '25% de desconto na segunda peça de vestuário, limitado a R$ 50.',
      category: 'Compras',
      points: 275,
      partner: 'Lojas de Moda & Vestuário — Novo Shopping',
      location: 'Corredores de Moda — Lojas Participantes',
      validity: 'Válido durante todo o mês de Novembro',
      image: 'assets/images/astros-reais/astro-compras-real.jpg?v=14',
      description: 'Na compra de duas peças de vestuário nas lojas participantes, ganhe 25% de desconto na segunda peça (limitado a R$ 50,00).',
      featured: true
    },
    {
      id: 'ben-nov-6',
      month: 'Novembro',
      title: 'R$ 40 de desconto em alimentação acima de R$ 120.',
      category: 'Geral',
      points: 300,
      partner: 'Restaurantes & Praça de Alimentação Novo Shopping',
      location: 'Praça de Alimentação e Restaurantes',
      validity: 'Válido durante todo o mês de Novembro',
      image: 'assets/images/beneficios/combo.jpg?v=14',
      description: 'Aproveite R$ 40,00 de desconto em refeições e consumos acima de R$ 120,00 nos restaurantes e lanchonetes participantes.',
      featured: true
    },
    {
      id: 'ben-nov-7',
      month: 'Novembro',
      title: 'Dois ingressos de cinema pelo preço de um.',
      category: 'Lazer',
      points: 250,
      partner: 'Cinemark Novo Shopping',
      location: 'Piso Lazer — Cinemark',
      validity: 'Válido durante todo o mês de Novembro',
      image: 'assets/images/beneficios/cinema.jpg?v=14',
      description: 'Compre 1 ingresso de cinema e leve o 2º ingresso gratuitamente para assistir à mesma sessão com quem você gosta.',
      featured: true
    },
    {
      id: 'ben-nov-8',
      month: 'Novembro',
      title: 'R$ 50 de desconto em compras acima de R$ 250.',
      category: 'Compras',
      points: 300,
      partner: 'Lojas Participantes — Novo Shopping',
      location: 'Lojas Sinalizadas do Novo Clube',
      validity: 'Válido durante todo o mês de Novembro',
      image: 'assets/images/astros-reais/astro-compras-real.jpg?v=14',
      description: 'Desconto especial de R$ 50,00 para compras acima de R$ 250,00 nas lojas participantes da temporada de Black Friday.',
      featured: true
    },
    {
      id: 'ben-nov-9',
      month: 'Novembro',
      title: 'Um kit esportivo com toalha e squeeze, até R$ 50.',
      category: 'Esportes',
      points: 350,
      partner: 'Lojas de Esportes & Espaço Novo Clube',
      location: 'Lojas Esportivas Participantes',
      validity: 'Válido durante todo o mês de Novembro',
      image: 'assets/images/astros-reais/astro-esportes-real.jpg?v=14',
      description: 'Resgate um kit esportivo exclusivo contendo toalha fitness e squeeze (no valor de até R$ 50,00) para acompanhar seus treinos.',
      featured: true
    },
    {
      id: 'ben-nov-10',
      month: 'Novembro',
      title: 'Dois vouchers de R$ 30 para utilizar em visitas diferentes.',
      category: 'Geral',
      points: 475,
      partner: 'Rede de Lojas Participantes Novo Clube',
      location: 'Todas as Lojas Parceiras do Novo Shopping',
      validity: 'Válido em duas visitas distintas',
      image: 'assets/images/astros-reais/astro-servicos-real.jpg?v=14',
      description: 'Receba 2 vouchers de R$ 30,00 cada (totalizando R$ 60,00 em benefícios) para utilizar em duas visitas diferentes ao Novo Shopping.',
      featured: true
    },

    // =========================================================
    // DEZEMBRO — 15 BENEFÍCIOS
    // Foco: compras natalinas, presentes, alimentação, lazer em família e incentivo ao retorno após as festas.
    // =========================================================
    {
      id: 'ben-dez-1',
      month: 'Dezembro',
      title: 'Embalagem especial de presente gratuita, até R$ 20.',
      category: 'Compras',
      points: 175,
      partner: 'Espaço Natal & Lojas Participantes',
      location: 'Corredor Central — Novo Shopping',
      validity: 'Válido durante todo o mês de Dezembro',
      image: 'assets/images/astros-reais/astro-compras-real.jpg?v=14',
      description: 'Deixe seus presentes de Natal ainda mais especiais com uma embalagem de presente gratuita no valor de até R$ 20,00.',
      featured: true
    },
    {
      id: 'ben-dez-2',
      month: 'Dezembro',
      title: 'Pipoca pequena gratuita na compra de um ingresso de cinema.',
      category: 'Lazer',
      points: 75,
      partner: 'Cinemark Novo Shopping',
      location: 'Piso Lazer — Bomboniere Cinemark',
      validity: 'Válido durante todo o mês de Dezembro',
      image: 'assets/images/beneficios/cinema.jpg?v=14',
      description: 'Na compra de 1 ingresso de cinema, ganhe 1 pipoca salgada pequena gratuita para acompanhar sua sessão.',
      featured: true
    },
    {
      id: 'ben-dez-3',
      month: 'Dezembro',
      title: 'R$ 15 de crédito em alimentação acima de R$ 50.',
      category: 'Geral',
      points: 125,
      partner: 'Praça de Alimentação & Cafeterias',
      location: 'Praça de Alimentação — Novo Shopping',
      validity: 'Válido durante todo o mês de Dezembro',
      image: 'assets/images/beneficios/cafe.jpg?v=14',
      description: 'Garanta R$ 15,00 de crédito imediato em consumos de alimentação a partir de R$ 50,00 nas operações participantes.',
      featured: true
    },
    {
      id: 'ben-dez-4',
      month: 'Dezembro',
      title: 'R$ 30 de desconto em compras acima de R$ 150.',
      category: 'Compras',
      points: 225,
      partner: 'Lojas Participantes — Novo Shopping',
      location: 'Varejo & Presentes de Natal',
      validity: 'Válido durante todo o mês de Dezembro',
      image: 'assets/images/astros-reais/astro-compras-real.jpg?v=14',
      description: 'Economize R$ 30,00 nas suas compras de Natal com valor acima de R$ 150,00 nas lojas participantes.',
      featured: true
    },
    {
      id: 'ben-dez-5',
      month: 'Dezembro',
      title: 'R$ 60 de desconto em artigos esportivos acima de R$ 300.',
      category: 'Esportes',
      points: 400,
      partner: 'Centauro & Lojas Esportivas Novo Shopping',
      location: 'Corredor Esportivo — Novo Shopping',
      validity: 'Válido durante todo o mês de Dezembro',
      image: 'assets/images/astros-reais/astro-esportes-real.jpg?v=14',
      description: 'Desconto de R$ 60,00 na compra de roupas, equipamentos e artigos esportivos acima de R$ 300,00.',
      featured: true
    },
    {
      id: 'ben-dez-6',
      month: 'Dezembro',
      title: 'R$ 30,00 de crédito em lojas infantis.',
      category: 'Lazer',
      points: 275,
      partner: 'Ri Happy & Lojas Infantis Novo Shopping',
      location: 'Lojas de Brinquedos e Moda Infantil',
      validity: 'Válido durante todo o mês de Dezembro',
      image: 'assets/images/astros-reais/astro-lazer-real.jpg?v=14',
      description: 'Resgate R$ 30,00 de crédito para comprar brinquedos, jogos e presentes nas lojas infantis participantes do Novo Shopping.',
      featured: true
    },
    {
      id: 'ben-dez-7',
      month: 'Dezembro',
      title: 'R$ 40 de crédito para utilizar em dois estabelecimentos diferentes, sendo R$ 20 em cada.',
      category: 'Geral',
      points: 400,
      partner: 'Lojas e Restaurantes Participantes',
      location: 'Todo o Novo Shopping Ribeirão Preto',
      validity: 'Válido durante todo o mês de Dezembro',
      image: 'assets/images/astros-reais/astro-servicos-real.jpg?v=14',
      description: 'Receba R$ 40,00 em créditos divididos em 2 vouchers de R$ 20,00 para aproveitar em dois estabelecimentos diferentes do shopping.',
      featured: true
    },
    {
      id: 'ben-dez-8',
      month: 'Dezembro',
      title: 'R$ 60 de desconto em compras acima de R$ 300.',
      category: 'Compras',
      points: 400,
      partner: 'Lojas Participantes — Novo Shopping',
      location: 'Moda, Calçados e Presentes',
      validity: 'Válido durante todo o mês de Dezembro',
      image: 'assets/images/astros-reais/astro-compras-real.jpg?v=14',
      description: 'Aproveite R$ 60,00 de desconto em compras a partir de R$ 300,00 para garantir os presentes de toda a família.',
      featured: true
    },
    {
      id: 'ben-dez-9',
      month: 'Dezembro',
      title: 'Um ingresso de cinema gratuito para sessão convencional.',
      category: 'Lazer',
      points: 400,
      partner: 'Cinemark Novo Shopping',
      location: 'Piso Lazer — Cinemark',
      validity: 'Válido durante todo o mês de Dezembro',
      image: 'assets/images/beneficios/cinema.jpg?v=14',
      description: 'Troque seus pontos por 1 ingresso de cinema 100% gratuito para qualquer sessão 2D convencional no Novo Shopping.',
      featured: true
    },
    {
      id: 'ben-dez-10',
      month: 'Dezembro',
      title: 'Um voucher de R$ 40 para presentear outro membro do Clube.',
      category: 'Geral',
      points: 375,
      partner: 'Novo Clube — Novo Shopping',
      location: 'Resgate Digital Transferível no App',
      validity: 'Válido até Janeiro para o presenteado',
      image: 'assets/images/astros-reais/astro-servicos-real.jpg?v=14',
      description: 'Gere um vale-presente especial de R$ 40,00 para enviar a outro membro da família ou amigo cadastrado no Novo Clube.',
      featured: true
    },
    {
      id: 'ben-dez-11',
      month: 'Dezembro',
      title: 'R$ 75 de desconto em calçados esportivos acima de R$ 350.',
      category: 'Esportes',
      points: 500,
      partner: 'Centauro & Lojas de Calçados Esportivos',
      location: 'Corredor Esportivo — Novo Shopping',
      validity: 'Válido durante todo o mês de Dezembro',
      image: 'assets/images/astros-reais/astro-esportes-real.jpg?v=14',
      description: 'Desconto especial de R$ 75,00 na compra de calçados esportivos de alta performance acima de R$ 350,00.',
      featured: true
    },
    {
      id: 'ben-dez-12',
      month: 'Dezembro',
      title: 'Vale-compras de R$ 75 em loja participante.',
      category: 'Compras',
      points: 550,
      partner: 'Lojas Participantes — Novo Shopping',
      location: 'Lojas Parceiras do Novo Clube',
      validity: 'Válido durante Dezembro e Janeiro',
      image: 'assets/images/astros-reais/astro-compras-real.jpg?v=14',
      description: 'Resgate um vale-compras de R$ 75,00 para utilizar diretamente em uma das lojas participantes do Novo Shopping.',
      featured: true
    },
    {
      id: 'ben-dez-13',
      month: 'Dezembro',
      title: 'R$ 50 de crédito em atrações de lazer.',
      category: 'Lazer',
      points: 500,
      partner: 'Parques, Boliche & Atrações de Lazer',
      location: 'Piso Lazer — Novo Shopping',
      validity: 'Válido nas férias de Dezembro e Janeiro',
      image: 'assets/images/astros-reais/astro-lazer-real.jpg?v=14',
      description: 'Garanta R$ 50,00 em créditos para curtir as atrações de lazer e entretenimento em família no Novo Shopping.',
      featured: true
    },
    {
      id: 'ben-dez-14',
      month: 'Dezembro',
      title: 'R$ 75 em alimentação, dividido em três vouchers de R$ 25.',
      category: 'Geral',
      points: 575,
      partner: 'Praça de Alimentação & Restaurantes',
      location: 'Gastronomia — Novo Shopping',
      validity: 'Válido durante Dezembro e Janeiro',
      image: 'assets/images/beneficios/combo.jpg?v=14',
      description: 'Receba R$ 75,00 em créditos gastronômicos divididos em 3 vouchers de R$ 25,00 para aproveitar em diferentes refeições.',
      featured: true
    },
    {
      id: 'ben-dez-15',
      month: 'Dezembro',
      title: 'Vale-compras de R$ 100 em lojas participantes.',
      category: 'Compras',
      points: 700,
      partner: 'Lojas Participantes — Novo Shopping',
      location: 'Rede Oficial Novo Clube',
      validity: 'Válido durante Dezembro e Janeiro',
      image: 'assets/images/astros-reais/astro-compras-real.jpg?v=14',
      description: 'O maior benefício de fim de ano! Vale-compras de R$ 100,00 para usar nas lojas participantes do Novo Shopping Ribeirão Preto.',
      featured: true
    }
  ],

  profiles: [
    {
      id: 'mariana',
      name: 'Teste 1',
      shortName: 'Teste',
      initials: 'T1',
      role: 'Titular • Família',
      email: 'teste@email.com',
      phone: '(16) 99123-4567',
      avatarBg: '#B8D4F2',
      avatarColor: '#1E40AF',
      collectionPoints: 350,
      benefitBalance: 325,
      invoicesCount: 12,
      lastInvoiceDate: '05/10/2026',
      redeemedBenefits: [
        {
          id: 'red-1',
          title: '20% de desconto em um ingresso de cinema.',
          partner: 'Cinemark Novo Shopping',
          points: 50,
          date: '01/10/2026',
          code: 'NOVO-CINE-8841'
        },
        {
          id: 'red-2',
          title: 'Obtenha isenção do seu estacionamento.',
          partner: 'Estacionamento Novo Shopping',
          points: 100,
          date: '25/09/2026',
          code: 'NOVO-ESTAC-3190'
        },
        {
          id: 'red-3',
          title: 'R$ 15,00 de desconto em lojas infantis.',
          partner: 'Ri Happy & Lojas Infantis Participantes',
          points: 100,
          date: '20/09/2026',
          code: 'NOVO-KIDS-5521'
        }
      ],
      invoices: [
        { id: 'nf-12', store: 'Lojas Renner — Novo Shopping', cnpj: '92.754.738/0001-62', value: 120.00, points: 120, date: '05/10/2026', category: 'Varejo' },
        { id: 'nf-11', store: 'Savegnago Supermercados', cnpj: '45.231.908/0001-11', value: 85.00, points: 85, date: '02/10/2026', category: 'Alimentação' },
        { id: 'nf-10', store: 'Centauro Esportes', cnpj: '06.347.409/0001-35', value: 145.00, points: 145, date: '28/09/2026', category: 'Saúde' }
      ],
      transactions: [
        { id: 'tx-1', type: 'credit', title: 'Compra no Shopping', subtitle: 'Lojas Renner', points: 120, date: '05/10/2026' },
        { id: 'tx-2', type: 'credit', title: 'Compra no Shopping', subtitle: 'Savegnago Supermercados', points: 85, date: '02/10/2026' },
        { id: 'tx-3', type: 'debit', title: 'Resgate: 50% no cinema', subtitle: 'Cinemark Novo Shopping', points: 25, date: '01/10/2026' }
      ]
    },
    {
      id: 'carlos',
      name: 'Teste 2',
      shortName: 'Teste 2',
      initials: 'T2',
      role: 'Perfil • Família',
      email: 'teste@email.com',
      phone: '(16) 99123-8899',
      avatarBg: '#FDE68A',
      avatarColor: '#92400E',
      collectionPoints: 540,
      benefitBalance: 210,
      invoicesCount: 7,
      lastInvoiceDate: '04/10/2026',
      redeemedBenefits: [
        {
          id: 'red-c1',
          title: 'Combo exclusivo',
          partner: 'Burger Novo Grill',
          points: 40,
          date: '03/10/2026',
          code: 'NOVO-COMBO-7712'
        }
      ],
      invoices: [
        { id: 'nf-c1', store: 'Kalunga Papelaria & Informática', cnpj: '43.283.811/0001-50', value: 240.00, points: 240, date: '04/10/2026', category: 'Varejo' },
        { id: 'nf-c2', store: 'Outback Steakhouse Novo Shopping', cnpj: '17.261.661/0001-56', value: 300.00, points: 300, date: '29/09/2026', category: 'Lazer' }
      ],
      transactions: [
        { id: 'tx-c1', type: 'credit', title: 'Compra no Shopping', subtitle: 'Kalunga', points: 240, date: '04/10/2026' },
        { id: 'tx-c2', type: 'debit', title: 'Resgate: Combo exclusivo', subtitle: 'Burger Novo Grill', points: 40, date: '03/10/2026' },
        { id: 'tx-c3', type: 'credit', title: 'Compra no Shopping', subtitle: 'Outback Steakhouse', points: 300, date: '29/09/2026' }
      ]
    },
    {
      id: 'lucas',
      name: 'Teste 3',
      shortName: 'Teste 3',
      initials: 'T3',
      role: 'Perfil • Família',
      email: 'teste@email.com',
      phone: '(16) 99123-4567',
      avatarBg: '#FBCFE8',
      avatarColor: '#9D174D',
      collectionPoints: 120,
      benefitBalance: 95,
      invoicesCount: 3,
      lastInvoiceDate: '01/10/2026',
      redeemedBenefits: [
        {
          id: 'red-l1',
          title: '50% no ingresso do cinema',
          partner: 'Cinemark Novo Shopping',
          points: 25,
          date: '01/10/2026',
          code: 'NOVO-CINE-1029'
        }
      ],
      invoices: [
        { id: 'nf-l1', store: 'Ri Happy Brinquedos', cnpj: '58.731.662/0001-19', value: 120.00, points: 120, date: '01/10/2026', category: 'Lazer' }
      ],
      transactions: [
        { id: 'tx-l1', type: 'credit', title: 'Compra no Shopping', subtitle: 'Ri Happy Brinquedos', points: 120, date: '01/10/2026' },
        { id: 'tx-l2', type: 'debit', title: 'Resgate: 50% no cinema', subtitle: 'Cinemark Novo Shopping', points: 25, date: '01/10/2026' }
      ]
    }
  ],

  partnerStores: [
    { name: 'Lojas Renner — Novo Shopping', cnpj: '92.754.738/0001-62', category: 'Varejo' },
    { name: 'Cinemark Novo Shopping', cnpj: '00.779.721/0023-45', category: 'Lazer' },
    { name: 'Savegnago Supermercados', cnpj: '45.231.908/0001-11', category: 'Alimentação' },
    { name: 'Centauro Esportes', cnpj: '06.347.409/0001-35', category: 'Saúde' },
    { name: 'Droga Raia — Novo Shopping', cnpj: '61.585.865/0240-90', category: 'Saúde' },
    { name: 'Outback Steakhouse', cnpj: '17.261.661/0001-56', category: 'Alimentação' },
    { name: 'Ri Happy Brinquedos', cnpj: '58.731.662/0001-19', category: 'Varejo' }
  ],

  faqs: [
    {
      q: 'Como funciona a diferença entre Pontos de Coleção e Saldo de Benefícios?',
      a: 'Cada R$ 1 em notas fiscais cadastradas gera 1 ponto que vai simultaneamente para os dois contadores! Os Pontos de Coleção são acumulativos e nunca diminuem (servem para desbloquear os 4 Astros). Já o Saldo de Benefícios funciona como uma carteira: sobe quando você cadastra notas e desce quando você resgata descontos e lanches.'
    },
    {
      q: 'Como ganho o primeiro Astro colecionável?',
      a: 'O 1º Astro (Astro Serviços — Amarelo) é desbloqueado gratuitamente assim que você conclui o cadastro do seu perfil no Novo Clube!'
    },
    {
      q: 'Por que alguns Astros aparecem bloqueados mesmo se eu tiver muitos pontos?',
      a: 'Além da meta de pontuação (500, 1.000 e 1.500 pontos), os Astros têm liberação mensal progressiva: em Outubro estão liberados o Astro Serviços e o Astro Lazer; em Novembro libera o Astro Esportes; e em Dezembro libera o Astro Compras.'
    },
    {
      q: 'Minha família inteira pode usar a mesma conta?',
      a: 'Sim! Com os Perfis Família (estilo Netflix), um único login permite criar perfis individuais para pais, filhos e avós. Cada perfil acumula seus próprios pontos e conquista sua própria coleção de Astros.'
    }
  ]
};



