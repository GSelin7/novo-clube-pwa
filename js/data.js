window.NOVO_CLUBE_DEFAULT_DATA = {
  accountEmail: 'teste@email.com',
  currentMonth: 'Outubro',
  monthsOrder: ['Outubro', 'Novembro', 'Dezembro'],
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
    // OUTUBRO - 4 Principais idênticos ao Mockup
    {
      id: 'ben-out-1',
      month: 'Outubro',
      title: '50% no ingresso do cinema',
      category: 'Lazer',
      points: 25,
      partner: 'Cinemark Novo Shopping',
      location: 'Piso Lazer — Próximo à Praça de Alimentação',
      validity: 'Válido até 31 de Outubro • Seg a Qui (2D e 3D)',
      image: 'assets/images/beneficios/cinema.jpg?v=8',
      description: 'Garanta 50% de desconto na compra de 1 ingresso inteiro para qualquer sessão 2D ou 3D de segunda a quinta-feira no Cinemark do Novo Shopping Ribeirão Preto.',
      rules: [
        'Apresente o voucher gerado pelo Novo Clube na bilheteria ou insira o código no totem de autoatendimento.',
        'Desconto de 50% calculado sobre o valor do ingresso inteiro da sessão escolhida.',
        'O resgate utiliza apenas o seu Saldo de Benefícios; seus pontos da Coleção Astro continuam intactos!'
      ],
      featured: true
    },
    {
      id: 'ben-out-2',
      month: 'Outubro',
      title: 'Café especial',
      category: 'Alimentação',
      points: 30,
      partner: 'Cafeteria Grão do Novo',
      location: 'Corredor Central — Entrada Principal',
      validity: 'Válido todos os dias das 10h às 22h',
      image: 'assets/images/beneficios/cafe.jpg?v=8',
      description: 'Um café espresso médio cremoso ou cappuccino tradicional preparado na hora com grãos selecionados nas cafeterias participantes do Novo Shopping.',
      rules: [
        'Válido para 1 unidade de Café Espresso Especial (120ml) ou Cappuccino Tradicional (180ml).',
        'Basta informar o código do cupom no caixa antes do pagamento.',
        'Acompanha 1 mini biscoito amanteigado cortesia para clientes Novo Clube.'
      ],
      featured: true
    },
    {
      id: 'ben-out-3',
      month: 'Outubro',
      title: 'Combo exclusivo',
      category: 'Alimentação',
      points: 40,
      partner: 'Burger Novo Grill',
      location: 'Praça de Alimentação — Loja 204',
      validity: 'Válido todos os dias em Outubro',
      image: 'assets/images/beneficios/combo.jpg?v=8',
      description: 'Hambúrguer artesanal grelhado no fogo com queijo cheddar derretido, alface crocante, tomate fresco e molho especial no pão com gergelim + batata frita média.',
      rules: [
        'Inclui 1 Cheeseburger Artesanal + 1 porção média de batatas fritas crocantes.',
        'Apresente o código de resgate no balcão da loja participante na Praça de Alimentação.',
        'Pode ser consumido no local ou embalado para viagem.'
      ],
      featured: true
    },
    {
      id: 'ben-out-4',
      month: 'Outubro',
      title: 'Sobremesa em dobro',
      category: 'Alimentação',
      points: 30,
      partner: 'Gelateria & Sorvetes',
      location: 'Praça de Alimentação — Quiosque Central',
      validity: 'Válido todos os dias para compartilhar em família',
      image: 'assets/images/beneficios/sobremesa.jpg?v=8',
      description: 'Na compra de uma taça de sorvete artesanal de morango com calda especial da fruta, ganhe outra taça igual na hora para aproveitar com a família!',
      rules: [
        'Compre 1 taça de 2 bolas e leve a 2ª taça gratuitamente apresentando seu voucher.',
        'Disponível nos sabores Morango com Calda, Chocolate Belga, Creme e Doce de Leite.',
        'Ideal para curtir o passeio em família no Novo Shopping.'
      ],
      featured: true
    },
    {
      id: 'ben-out-5',
      month: 'Outubro',
      title: 'Isenção de 2h no Estacionamento',
      category: 'Serviços',
      points: 20,
      partner: 'Estacionamento Novo Shopping',
      image: 'assets/images/beneficios/estacionamento.jpg?v=8',
      description: 'Valide seu ticket de estacionamento com 2 horas gratuitas em qualquer dia da semana diretamente pelo aplicativo.',
      featured: false
    },
    {
      id: 'ben-out-6',
      month: 'Outubro',
      title: 'Vale R$ 30 em Moda & Varejo',
      category: 'Serviços',
      points: 45,
      partner: 'Lojas Participantes do Novo',
      image: 'assets/images/astros-reais/astro-compras-real.jpg?v=8',
      description: 'Bônus de R$ 30 de desconto em compras acima de R$ 120 nas lojas de vestuário, calçados e acessórios participantes.',
      featured: false
    },

    // NOVEMBRO
    {
      id: 'ben-nov-1',
      month: 'Novembro',
      title: 'Combo Pipoca + Refrigerante Mega',
      category: 'Lazer',
      points: 35,
      partner: 'Cinemark Novo Shopping',
      image: 'assets/images/beneficios/cinema.jpg?v=8',
      description: '1 Balde de pipoca amanteigada + 1 bebida grande para aproveitar os lançamentos de novembro no cinema.',
      featured: true
    },
    {
      id: 'ben-nov-2',
      month: 'Novembro',
      title: '2x1 Cappuccino Gelado',
      category: 'Alimentação',
      points: 25,
      partner: 'Cafeteria Grão do Novo',
      image: 'assets/images/beneficios/cafe.jpg?v=8',
      description: 'Dois cappuccinos gelados pelo preço de um para refrescar a tarde de compras em Ribeirão Preto.',
      featured: true
    },
    {
      id: 'ben-nov-3',
      month: 'Novembro',
      title: 'Check-up Bioimpedância + Day Use',
      category: 'Serviços',
      points: 35,
      partner: 'Academia & Saúde Novo',
      image: 'assets/images/astros-reais/astro-esportes-real.jpg?v=8',
      description: 'Avaliação física completa e 3 dias de acesso livre à academia para celebrar a chegada do Astro Esportes.',
      featured: true
    },
    {
      id: 'ben-nov-4',
      month: 'Novembro',
      title: 'Casquinha Recheada Grátis',
      category: 'Alimentação',
      points: 15,
      partner: 'Gelateria & Sorvetes',
      image: 'assets/images/beneficios/sobremesa-bowl.jpg?v=8',
      description: 'Troque apenas 15 pontos do seu saldo por uma casquinha crocante recheada com creme de avelã.',
      featured: true
    },

    // DEZEMBRO
    {
      id: 'ben-dez-1',
      month: 'Dezembro',
      title: 'Ingresso VIP + Pipoca de Natal',
      category: 'Lazer',
      points: 45,
      partner: 'Cinemark Novo Shopping',
      image: 'assets/images/beneficios/cinema.jpg?v=8',
      description: 'Sessão especial de férias em família com ingresso + pipoca média inclusa.',
      featured: true
    },
    {
      id: 'ben-dez-2',
      month: 'Dezembro',
      title: 'Combo Família 4 Burgers',
      category: 'Alimentação',
      points: 60,
      partner: 'Burger Novo Grill',
      image: 'assets/images/beneficios/combo.jpg?v=8',
      description: 'Desconto especial de 40% no combo familiar com 4 lanches artesanais e porção grande de fritas.',
      featured: true
    },
    {
      id: 'ben-dez-3',
      month: 'Dezembro',
      title: 'Embalagem Presente + VIP Lounge',
      category: 'Serviços',
      points: 20,
      partner: 'Espaço Cliente Novo Clube',
      image: 'assets/images/astros-reais/astro-compras-real.jpg?v=8',
      description: 'Embalagem especial para seus presentes de fim de ano + café cortesia no lounge do Novo Clube.',
      featured: true
    },
    {
      id: 'ben-dez-4',
      month: 'Dezembro',
      title: 'Taça Especial de Fim de Ano',
      category: 'Alimentação',
      points: 30,
      partner: 'Gelateria & Sorvetes',
      image: 'assets/images/beneficios/sobremesa.jpg?v=8',
      description: 'Taça artesanal com 3 bolas, calda quente e castanhas.',
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
          title: '50% no ingresso do cinema',
          partner: 'Cinemark Novo Shopping',
          points: 25,
          date: '01/10/2026',
          code: 'NOVO-CINE-8841'
        },
        {
          id: 'red-2',
          title: 'Café especial',
          partner: 'Cafeteria Grão do Novo',
          points: 30,
          date: '25/09/2026',
          code: 'NOVO-CAFE-3190'
        },
        {
          id: 'red-3',
          title: 'Sobremesa em dobro',
          partner: 'Gelateria & Sorvetes',
          points: 30,
          date: '20/09/2026',
          code: 'NOVO-DOCE-5521'
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



