-- ==============================================================================
-- 🚀 NOVO CLUBE PWA — ESQUEMA COMPLETO EM PORTUGUÊS (SUPABASE POSTGRESQL)
-- ==============================================================================
-- Instruções:
-- 1. Acesse o painel do Supabase > SQL Editor > New query.
-- 2. Cole todo este arquivo e clique em "Run" (Ctrl + Enter).
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. TABELA: PERFIS (Perfis familiares estilo Netflix sob a mesma conta)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.perfis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    nome_curto TEXT NOT NULL,
    iniciais VARCHAR(4) NOT NULL,
    papel TEXT DEFAULT 'Titular • Família',
    email TEXT,
    telefone TEXT,
    avatar_bg VARCHAR(20) DEFAULT '#B8D4F2',
    avatar_cor VARCHAR(20) DEFAULT '#1E40AF',
    pontos_colecao INTEGER NOT NULL DEFAULT 0 CHECK (pontos_colecao >= 0),
    saldo_beneficios INTEGER NOT NULL DEFAULT 0 CHECK (saldo_beneficios >= 0),
    quantidade_notas INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_notas >= 0),
    data_ultima_nota TIMESTAMPTZ,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. TABELA: LOJAS (Lojas participantes do Novo Shopping)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lojas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cnpj VARCHAR(20) NOT NULL UNIQUE,
    categoria TEXT NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. TABELA: NOTAS_FISCAIS (Envio de notas fiscais com regras antifraude)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notas_fiscais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
    loja_nome TEXT NOT NULL,
    cnpj VARCHAR(20),
    categoria TEXT,
    valor NUMERIC(10, 2) NOT NULL CHECK (valor > 0),
    pontos INTEGER NOT NULL CHECK (pontos > 0),
    numero_nota VARCHAR(50),
    chave_acesso VARCHAR(44),
    data_emissao DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'aprovada' CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
    imagem_url TEXT,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Restrições de unicidade para evitar duplicidade de notas cadastradas
CREATE UNIQUE INDEX IF NOT EXISTS uq_notas_chave_acesso 
    ON public.notas_fiscais(chave_acesso) 
    WHERE chave_acesso IS NOT NULL AND chave_acesso != '';

CREATE UNIQUE INDEX IF NOT EXISTS uq_notas_cnpj_numero 
    ON public.notas_fiscais(cnpj, numero_nota) 
    WHERE numero_nota IS NOT NULL AND numero_nota != '';

-- ------------------------------------------------------------------------------
-- 4. TABELA: BENEFICIOS (Catálogo mensal de ofertas e vantagens)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.beneficios (
    id TEXT PRIMARY KEY,
    mes VARCHAR(20) NOT NULL,
    titulo TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    pontos INTEGER NOT NULL CHECK (pontos > 0),
    parceiro TEXT NOT NULL,
    localizacao TEXT,
    validade TEXT,
    imagem TEXT,
    descricao TEXT,
    regras TEXT[] DEFAULT '{}',
    destaque BOOLEAN NOT NULL DEFAULT FALSE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. TABELA: RESGATES (Cupons/vouchers gerados)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resgates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
    beneficio_id TEXT NOT NULL REFERENCES public.beneficios(id) ON DELETE RESTRICT,
    titulo TEXT NOT NULL,
    parceiro TEXT NOT NULL,
    pontos INTEGER NOT NULL CHECK (pontos > 0),
    codigo_voucher VARCHAR(30) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'utilizado', 'expirado')),
    resgatado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    utilizado_em TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 6. TABELA: TRANSACOES (Extrato detalhado de créditos e débitos)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('credito', 'debito')),
    titulo TEXT NOT NULL,
    subtitulo TEXT,
    pontos INTEGER NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. TABELA: ASTROS (Jornada dos 4 mascotes colecionáveis)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.astros (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    cor_nome TEXT,
    cor_destaque VARCHAR(10),
    pontos_necessarios INTEGER NOT NULL DEFAULT 0,
    mes_liberacao VARCHAR(20) NOT NULL,
    rotulo_requisito TEXT,
    imagem_3d TEXT,
    imagem_real TEXT,
    acessorios TEXT,
    descricao TEXT
);

-- ==============================================================================
-- 🚀 ÍNDICES DE PERFORMANCE (MELHORIA 4)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_perfis_usuario ON public.perfis(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notas_perfil ON public.notas_fiscais(perfil_id);
CREATE INDEX IF NOT EXISTS idx_notas_criado_em ON public.notas_fiscais(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_transacoes_perfil ON public.transacoes(perfil_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_criado_em ON public.transacoes(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_resgates_perfil ON public.resgates(perfil_id);
CREATE INDEX IF NOT EXISTS idx_resgates_codigo ON public.resgates(codigo_voucher);
CREATE INDEX IF NOT EXISTS idx_resgates_status ON public.resgates(status);
CREATE INDEX IF NOT EXISTS idx_beneficios_mes ON public.beneficios(mes);
CREATE INDEX IF NOT EXISTS idx_beneficios_categoria ON public.beneficios(categoria);
CREATE INDEX IF NOT EXISTS idx_lojas_categoria ON public.lojas(categoria);

-- ==============================================================================
-- 🔒 POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas_fiscais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resgates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astros ENABLE ROW LEVEL SECURITY;

-- Leitura pública para tabelas institucionais
CREATE POLICY "Lojas públicas para leitura" ON public.lojas FOR SELECT USING (true);
CREATE POLICY "Benefícios públicos para leitura" ON public.beneficios FOR SELECT USING (ativo = true);
CREATE POLICY "Astros públicos para leitura" ON public.astros FOR SELECT USING (true);

-- Perfis: Usuário logado só acessa seus próprios perfis
CREATE POLICY "Usuário acessa seus perfis" ON public.perfis
    FOR ALL USING (auth.uid() = usuario_id);

-- Notas fiscais: Usuário logado só acessa notas dos seus perfis
CREATE POLICY "Usuário acessa suas notas fiscais" ON public.notas_fiscais
    FOR ALL USING (
        perfil_id IN (SELECT id FROM public.perfis WHERE usuario_id = auth.uid())
    );

-- Resgates: Usuário logado só acessa resgates dos seus perfis
CREATE POLICY "Usuário acessa seus resgates" ON public.resgates
    FOR ALL USING (
        perfil_id IN (SELECT id FROM public.perfis WHERE usuario_id = auth.uid())
    );

-- Transações: Usuário logado só acessa extrato dos seus perfis
CREATE POLICY "Usuário acessa suas transações" ON public.transacoes
    FOR ALL USING (
        perfil_id IN (SELECT id FROM public.perfis WHERE usuario_id = auth.uid())
    );

-- ==============================================================================
-- ⚡ FUNÇÕES ATÔMICAS (STORED PROCEDURES)
-- ==============================================================================

-- 1. Cadastrar Nota Fiscal com validação antifraude e crédito atômico (MELHORIA 1)
CREATE OR REPLACE FUNCTION public.cadastrar_nota_fiscal(
    p_perfil_id UUID,
    p_loja_nome TEXT,
    p_cnpj TEXT,
    p_categoria TEXT,
    p_valor NUMERIC,
    p_numero_nota TEXT DEFAULT NULL,
    p_chave_acesso TEXT DEFAULT NULL,
    p_data_emissao DATE DEFAULT CURRENT_DATE,
    p_imagem_url TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_pontos INTEGER;
    v_nota_id UUID;
    v_perfil RECORD;
    v_chave_limpa TEXT;
    v_num_limpo TEXT;
    v_cnpj_limpo TEXT;
BEGIN
    IF p_valor <= 0 THEN
        RAISE EXCEPTION 'O valor da nota fiscal deve ser maior que zero.';
    END IF;

    -- Validação de prazo: até 30 dias de emissão
    IF p_data_emissao < (CURRENT_DATE - INTERVAL '30 days') THEN
        RAISE EXCEPTION 'A nota fiscal ultrapassou o prazo limite de 30 dias para cadastro.';
    END IF;

    IF p_data_emissao > (CURRENT_DATE + INTERVAL '1 day') THEN
        RAISE EXCEPTION 'A data de emissão informada não pode ser futura.';
    END IF;

    v_chave_limpa := NULLIF(TRIM(p_chave_acesso), '');
    v_num_limpo := NULLIF(TRIM(p_numero_nota), '');
    v_cnpj_limpo := NULLIF(TRIM(p_cnpj), '');

    -- Antifraude: verifica duplicidade de chave de acesso (44 dígitos)
    IF v_chave_limpa IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM public.notas_fiscais WHERE chave_acesso = v_chave_limpa) THEN
            RAISE EXCEPTION 'Esta nota fiscal (chave de acesso) já foi cadastrada anteriormente no Novo Clube.';
        END IF;
    END IF;

    -- Antifraude: verifica duplicidade de número de nota + CNPJ
    IF v_num_limpo IS NOT NULL AND v_cnpj_limpo IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM public.notas_fiscais WHERE cnpj = v_cnpj_limpo AND numero_nota = v_num_limpo) THEN
            RAISE EXCEPTION 'Esta nota fiscal (nº % do CNPJ %) já foi cadastrada anteriormente.', v_num_limpo, v_cnpj_limpo;
        END IF;
    END IF;

    -- Regra R$ 1,00 = 1 ponto (mínimo 1)
    v_pontos := GREATEST(1, ROUND(p_valor));

    -- Insere a nota fiscal
    INSERT INTO public.notas_fiscais (
        perfil_id, loja_nome, cnpj, categoria, valor, pontos,
        numero_nota, chave_acesso, data_emissao, imagem_url, status
    )
    VALUES (
        p_perfil_id, p_loja_nome, v_cnpj_limpo, p_categoria, p_valor, v_pontos,
        v_num_limpo, v_chave_limpa, p_data_emissao, p_imagem_url, 'aprovada'
    )
    RETURNING id INTO v_nota_id;

    -- Atualiza os contadores do perfil atomicamente
    UPDATE public.perfis
    SET pontos_colecao = pontos_colecao + v_pontos,
        saldo_beneficios = saldo_beneficios + v_pontos,
        quantidade_notas = quantidade_notas + 1,
        data_ultima_nota = NOW(),
        atualizado_em = NOW()
    WHERE id = p_perfil_id
    RETURNING * INTO v_perfil;

    -- Insere no extrato de transações
    INSERT INTO public.transacoes (perfil_id, tipo, titulo, subtitulo, pontos)
    VALUES (p_perfil_id, 'credito', 'Compra no Shopping', p_loja_nome, v_pontos);

    RETURN json_build_object(
        'sucesso', true,
        'nota_id', v_nota_id,
        'pontos_ganhos', v_pontos,
        'novo_pontos_colecao', v_perfil.pontos_colecao,
        'novo_saldo_beneficios', v_perfil.saldo_beneficios
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Resgatar Benefício com débito atômico e geração de voucher
CREATE OR REPLACE FUNCTION public.resgatar_beneficio(
    p_perfil_id UUID,
    p_beneficio_id TEXT
)
RETURNS JSON AS $$
DECLARE
    v_beneficio RECORD;
    v_saldo_atual INTEGER;
    v_codigo_voucher TEXT;
    v_resgate_id UUID;
BEGIN
    SELECT * INTO v_beneficio FROM public.beneficios WHERE id = p_beneficio_id AND ativo = true;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Benefício não encontrado ou inativo';
    END IF;

    SELECT saldo_beneficios INTO v_saldo_atual FROM public.perfis WHERE id = p_perfil_id;
    IF v_saldo_atual < v_beneficio.pontos THEN
        RAISE EXCEPTION 'Saldo insuficiente (% pts). O benefício requer % pts.', v_saldo_atual, v_beneficio.pontos;
    END IF;

    -- Código no padrão NOVO-XXXX-123
    v_codigo_voucher := 'NOVO-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)) || '-' || FLOOR(100 + RANDOM() * 900)::TEXT;

    -- Debita o saldo
    UPDATE public.perfis
    SET saldo_beneficios = saldo_beneficios - v_beneficio.pontos,
        atualizado_em = NOW()
    WHERE id = p_perfil_id;

    -- Registra o resgate
    INSERT INTO public.resgates (perfil_id, beneficio_id, titulo, parceiro, pontos, codigo_voucher)
    VALUES (p_perfil_id, v_beneficio.id, v_beneficio.titulo, v_beneficio.parceiro, v_beneficio.pontos, v_codigo_voucher)
    RETURNING id INTO v_resgate_id;

    -- Registra o débito no extrato
    INSERT INTO public.transacoes (perfil_id, tipo, titulo, subtitulo, pontos)
    VALUES (p_perfil_id, 'debito', 'Resgate: ' || v_beneficio.titulo, v_beneficio.parceiro, v_beneficio.pontos);

    RETURN json_build_object(
        'sucesso', true,
        'resgate_id', v_resgate_id,
        'codigo_voucher', v_codigo_voucher,
        'pontos_debitados', v_beneficio.pontos,
        'titulo_beneficio', v_beneficio.titulo,
        'parceiro', v_beneficio.parceiro
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Validar e Dar Baixa em Voucher pelo Lojista ou Totem (MELHORIA 2)
CREATE OR REPLACE FUNCTION public.validar_e_utilizar_voucher(
    p_codigo_voucher TEXT,
    p_parceiro TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_resgate RECORD;
    v_codigo_limpo TEXT;
BEGIN
    v_codigo_limpo := UPPER(TRIM(p_codigo_voucher));

    SELECT * INTO v_resgate
    FROM public.resgates
    WHERE UPPER(codigo_voucher) = v_codigo_limpo;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Voucher não encontrado. Verifique o código digitado.';
    END IF;

    IF v_resgate.status = 'utilizado' THEN
        RAISE EXCEPTION 'Este voucher já foi utilizado em % às %.',
            to_char(v_resgate.utilizado_em, 'DD/MM/YYYY'),
            to_char(v_resgate.utilizado_em, 'HH24:MI');
    END IF;

    IF v_resgate.status = 'expirado' THEN
        RAISE EXCEPTION 'Este voucher está expirado e não pode ser utilizado.';
    END IF;

    -- Se o nome do parceiro lojista for informado, valida correspondência
    IF p_parceiro IS NOT NULL AND TRIM(p_parceiro) != '' THEN
        IF LOWER(v_resgate.parceiro) NOT LIKE '%' || LOWER(TRIM(p_parceiro)) || '%' THEN
            RAISE EXCEPTION 'Este voucher pertence ao parceiro "%", não ao estabelecimento "%".', v_resgate.parceiro, p_parceiro;
        END IF;
    END IF;

    -- Marca como utilizado
    UPDATE public.resgates
    SET status = 'utilizado',
        utilizado_em = NOW()
    WHERE id = v_resgate.id;

    RETURN json_build_object(
        'sucesso', true,
        'mensagem', 'Voucher validado e baixado com sucesso!',
        'codigo_voucher', v_resgate.codigo_voucher,
        'titulo_beneficio', v_resgate.titulo,
        'parceiro', v_resgate.parceiro,
        'pontos', v_resgate.pontos,
        'utilizado_em', NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 📦 BUCKET DE ARMAZENAMENTO PARA NOTAS FISCAIS (MELHORIA 3)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('notas-fiscais', 'notas-fiscais', false)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 🌱 CARGA INICIAL DE DADOS (SEEDS DO FRONTEND DATA.JS)
-- ==============================================================================

-- Lojas Participantes
INSERT INTO public.lojas (nome, cnpj, categoria) VALUES
('Lojas Renner — Novo Shopping', '92.754.738/0001-62', 'Varejo'),
('Cinemark Novo Shopping', '00.779.721/0023-45', 'Lazer'),
('Savegnago Supermercados', '45.231.908/0001-11', 'Alimentação'),
('Centauro Esportes', '06.347.409/0001-35', 'Saúde'),
('Droga Raia — Novo Shopping', '61.585.865/0240-90', 'Saúde'),
('Outback Steakhouse', '17.261.661/0001-56', 'Alimentação'),
('Ri Happy Brinquedos', '58.731.662/0001-19', 'Varejo')
ON CONFLICT (cnpj) DO NOTHING;

-- Astros
INSERT INTO public.astros (id, nome, categoria, cor_nome, cor_destaque, pontos_necessarios, mes_liberacao, rotulo_requisito, imagem_3d, imagem_real, acessorios, descricao) VALUES
('servicos', 'Astro Serviços', 'Serviços', 'Amarelo', '#FACC15', 0, 'Outubro', 'Ação cadastrada', 'assets/images/astros/astro-servicos.png?v=8', 'assets/images/astros-reais/astro-servicos-real.jpg?v=8', 'Camisa polo amarela com crachá do Novo Shopping e óculos redondos', 'Desbloqueado automaticamente no seu cadastro! Representa a praticidade de resolver tudo em um só lugar: bancos, lotérica, academia, clínica de saúde e serviços especializados.'),
('lazer', 'Astro Lazer', 'Lazer', 'Rosa', '#F472B6', 500, 'Outubro', '500 pontos', 'assets/images/astros/astro-lazer.png?v=8', 'assets/images/astros-reais/astro-lazer-real.jpg?v=8', 'Óculos 3D de cinema e balde de pipoca exclusivo do Novo Shopping', 'Representa os momentos inesquecíveis em família: sessões de cinema, praça de alimentação completa, parques infantis e eventos culturais no Novo Shopping.'),
('esportes', 'Astro Esportes', 'Saúde', 'Azul', '#38BDF8', 1000, 'Novembro', '1.000 pontos', 'assets/images/astros/astro-esportes.png?v=8', 'assets/images/astros-reais/astro-esportes-real.jpg?v=8', 'Faixa esportiva na cabeça e par de halteres de pelúcia', 'Representa a categoria de Saúde, bem-estar e vida ativa. Liberado na virada para Novembro para quem acumula 1.000 pontos na coleção.'),
('compras', 'Astro Compras', 'Varejo', 'Verde', '#4ADE80', 1500, 'Dezembro', '1.500 pontos', 'assets/images/astros/astro-compras.png?v=8', 'assets/images/astros-reais/astro-compras-real.jpg?v=8', 'Óculos escuros estilosos, casquinha de sorvete e sacolas de compras do Novo Shopping', 'O grande troféu da jornada! Representa a força do Varejo, moda e gastronomia do Novo Shopping Ribeirão Preto. Liberado em Dezembro ao atingir 1.500 pontos acumulados.')
ON CONFLICT (id) DO NOTHING;

-- Catálogo de Benefícios (30 benefícios oficiais: Outubro, Novembro e Dezembro)
INSERT INTO public.beneficios (id, mes, titulo, categoria, pontos, parceiro, localizacao, validade, imagem, descricao, regras, destaque) VALUES
('ben-out-1', 'Outubro', '20% de desconto em um ingresso de cinema.', 'Lazer', 25, 'Cinemark Novo Shopping', 'Piso Lazer — Próximo à Praça de Alimentação', 'Válido durante todo o mês de Outubro', 'assets/images/beneficios/cinema.jpg?v=15', 'Garanta 20% de desconto na compra de 1 ingresso de cinema no Cinemark do Novo Shopping Ribeirão Preto.', ARRAY['Apresente o voucher gerado pelo Novo Clube na bilheteria ou insira o código no autoatendimento.', 'Desconto de 20% válido para 1 ingresso em sessões participantes.', 'O resgate utiliza apenas o seu Saldo de Benefícios; seus pontos da Coleção Astro continuam intactos!'], true),
('ben-out-2', 'Outubro', 'R$ 15 de desconto em compras acima de R$ 80.', 'Compras', 50, 'Lojas Participantes — Novo Shopping', 'Varejo & Moda — Lojas Sinalizadas', 'Válido durante todo o mês de Outubro', 'assets/images/astros-reais/astro-compras-real.jpg?v=15', 'Bônus de R$ 15,00 de desconto imediato em compras a partir de R$ 80,00 nas lojas participantes do Novo Shopping.', ARRAY['Válido para compras com valor mínimo de R$ 80,00 em uma única nota.', 'Informe o código do voucher no caixa antes da finalização do pagamento.', 'Seus pontos da Coleção Astro permanecem intactos após o resgate.'], true),
('ben-out-3', 'Outubro', '20% de desconto em acessórios fitness, limitado a R$ 100,00.', 'Esportes', 100, 'Centauro & Lojas Esportivas Novo Shopping', 'Corredor Central — Lojas de Esportes', 'Válido durante todo o mês de Outubro', 'assets/images/astros-reais/astro-esportes-real.jpg?v=15', 'Aproveite 20% de desconto na compra de acessórios fitness e esportivos, limitado a R$ 100,00 de desconto nas lojas participantes.', ARRAY['Desconto de 20% aplicável em acessórios fitness selecionados, limitado a R$ 100,00.', 'Apresente o código de resgate no balcão de pagamento da loja parceira.', 'O resgate desconta apenas do Saldo de Benefícios.'], true),
('ben-out-4', 'Outubro', 'Obtenha isenção do seu estacionamento.', 'Geral', 25, 'Estacionamento Novo Shopping', 'Guichês de Pagamento e Totens de Autoatendimento', 'Válido durante todo o mês de Outubro', 'assets/images/beneficios/estacionamento.jpg?v=15', 'Obtenha a isenção do seu ticket de estacionamento no Novo Shopping Ribeirão Preto utilizando seus pontos do Clube.', ARRAY['Apresente ou escaneie o código do voucher nos totens ou guichês de estacionamento antes da saída.', 'Válido para 1 utilização de estacionamento no Novo Shopping.', 'Seus pontos da Coleção Astro continuam intactos!'], true),
('ben-out-5', 'Outubro', 'R$ 15,00 de desconto em lojas infantis.', 'Lazer', 50, 'Ri Happy & Lojas Infantis Participantes', 'Corredor Infantil & Lazer — Novo Shopping', 'Válido durante todo o mês de Outubro', 'assets/images/astros-reais/astro-lazer-real.jpg?v=15', 'Garanta R$ 15,00 de desconto em compras nas lojas infantis e de brinquedos participantes do Novo Shopping.', ARRAY['Desconto de R$ 15,00 válido nas lojas infantis parceiras do Novo Clube.', 'Apresente o voucher no caixa antes de encerrar a compra.', 'Ideal para aproveitar o Mês das Crianças em família no Novo Shopping.'], true),
('ben-nov-1', 'Novembro', 'R$ 20 de desconto em compras acima de R$ 100.', 'Compras', 25, 'Lojas Participantes — Novo Shopping', 'Varejo & Moda — Lojas Sinalizadas', 'Válido durante todo o mês de Novembro', 'assets/images/astros-reais/astro-compras-real.jpg?v=15', 'Desconto direto de R$ 20,00 em compras a partir de R$ 100,00 nas lojas participantes durante o mês da Black Friday.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Lojas Participantes — Novo Shopping).', 'O valor de 25 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-nov-2', 'Novembro', '50% de desconto em um ingresso de cinema.', 'Lazer', 25, 'Cinemark Novo Shopping', 'Piso Lazer — Próximo à Praça de Alimentação', 'Válido durante todo o mês de Novembro', 'assets/images/beneficios/cinema.jpg?v=15', 'Garanta 50% de desconto na compra de 1 ingresso de cinema para curtir as estreias de novembro no Novo Shopping.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Cinemark Novo Shopping).', 'O valor de 25 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-nov-3', 'Novembro', 'Isente seu estacionamento.', 'Geral', 25, 'Estacionamento Novo Shopping', 'Guichês e Totens de Autoatendimento', 'Válido durante todo o mês de Novembro', 'assets/images/beneficios/estacionamento.jpg?v=15', 'Isente seu estacionamento no Novo Shopping Ribeirão Preto para aproveitar suas compras com total tranquilidade.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Estacionamento Novo Shopping).', 'O valor de 25 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-nov-4', 'Novembro', 'R$ 40 de desconto em tênis esportivo acima de R$ 250.', 'Esportes', 50, 'Centauro & Lojas de Calçados Esportivos', 'Corredor Esportivo — Novo Shopping', 'Válido durante todo o mês de Novembro', 'assets/images/astros-reais/astro-esportes-real.jpg?v=15', 'Bônus de R$ 40,00 de desconto na compra de tênis esportivo com valor a partir de R$ 250,00 nas lojas parceiras.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Centauro & Lojas de Calçados Esportivos).', 'O valor de 50 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-nov-5', 'Novembro', '25% de desconto na segunda peça de vestuário, limitado a R$ 50.', 'Compras', 50, 'Lojas de Moda & Vestuário — Novo Shopping', 'Corredores de Moda — Lojas Participantes', 'Válido durante todo o mês de Novembro', 'assets/images/astros-reais/astro-compras-real.jpg?v=15', 'Na compra de duas peças de vestuário nas lojas participantes, ganhe 25% de desconto na segunda peça (limitado a R$ 50,00).', ARRAY['Apresente o código de resgate diretamente na loja parceira (Lojas de Moda & Vestuário — Novo Shopping).', 'O valor de 50 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-nov-6', 'Novembro', 'R$ 40 de desconto em alimentação acima de R$ 120.', 'Geral', 50, 'Restaurantes & Praça de Alimentação Novo Shopping', 'Praça de Alimentação e Restaurantes', 'Válido durante todo o mês de Novembro', 'assets/images/beneficios/combo.jpg?v=15', 'Aproveite R$ 40,00 de desconto em refeições e consumos acima de R$ 120,00 nos restaurantes e lanchonetes participantes.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Restaurantes & Praça de Alimentação Novo Shopping).', 'O valor de 50 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-nov-7', 'Novembro', 'Dois ingressos de cinema pelo preço de um.', 'Lazer', 50, 'Cinemark Novo Shopping', 'Piso Lazer — Cinemark', 'Válido durante todo o mês de Novembro', 'assets/images/beneficios/cinema.jpg?v=15', 'Compre 1 ingresso de cinema e leve o 2º ingresso gratuitamente para assistir à mesma sessão com quem você gosta.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Cinemark Novo Shopping).', 'O valor de 50 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-nov-8', 'Novembro', 'R$ 50 de desconto em compras acima de R$ 250.', 'Compras', 100, 'Lojas Participantes — Novo Shopping', 'Lojas Sinalizadas do Novo Clube', 'Válido durante todo o mês de Novembro', 'assets/images/astros-reais/astro-compras-real.jpg?v=15', 'Desconto especial de R$ 50,00 para compras acima de R$ 250,00 nas lojas participantes da temporada de Black Friday.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Lojas Participantes — Novo Shopping).', 'O valor de 100 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-nov-9', 'Novembro', 'Um kit esportivo com toalha e squeeze, até R$ 50.', 'Esportes', 100, 'Lojas de Esportes & Espaço Novo Clube', 'Lojas Esportivas Participantes', 'Válido durante todo o mês de Novembro', 'assets/images/astros-reais/astro-esportes-real.jpg?v=15', 'Resgate um kit esportivo exclusivo contendo toalha fitness e squeeze (no valor de até R$ 50,00) para acompanhar seus treinos.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Lojas de Esportes & Espaço Novo Clube).', 'O valor de 100 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-nov-10', 'Novembro', 'Dois vouchers de R$ 30 para utilizar em visitas diferentes.', 'Geral', 100, 'Rede de Lojas Participantes Novo Clube', 'Todas as Lojas Parceiras do Novo Shopping', 'Válido em duas visitas distintas', 'assets/images/astros-reais/astro-servicos-real.jpg?v=15', 'Receba 2 vouchers de R$ 30,00 cada (totalizando R$ 60,00 em benefícios) para utilizar em duas visitas diferentes ao Novo Shopping.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Rede de Lojas Participantes Novo Clube).', 'O valor de 100 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-1', 'Dezembro', 'Embalagem especial de presente gratuita, até R$ 20.', 'Compras', 25, 'Espaço Natal & Lojas Participantes', 'Corredor Central — Novo Shopping', 'Válido durante todo o mês de Dezembro', 'assets/images/astros-reais/astro-compras-real.jpg?v=15', 'Deixe seus presentes de Natal ainda mais especiais com uma embalagem de presente gratuita no valor de até R$ 20,00.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Espaço Natal & Lojas Participantes).', 'O valor de 25 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-2', 'Dezembro', 'Pipoca pequena gratuita na compra de um ingresso de cinema.', 'Lazer', 25, 'Cinemark Novo Shopping', 'Piso Lazer — Bomboniere Cinemark', 'Válido durante todo o mês de Dezembro', 'assets/images/beneficios/cinema.jpg?v=15', 'Na compra de 1 ingresso de cinema, ganhe 1 pipoca salgada pequena gratuita para acompanhar sua sessão.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Cinemark Novo Shopping).', 'O valor de 25 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-3', 'Dezembro', 'R$ 15 de crédito em alimentação acima de R$ 50.', 'Geral', 25, 'Praça de Alimentação & Cafeterias', 'Praça de Alimentação — Novo Shopping', 'Válido durante todo o mês de Dezembro', 'assets/images/beneficios/cafe.jpg?v=15', 'Garanta R$ 15,00 de crédito imediato em consumos de alimentação a partir de R$ 50,00 nas operações participantes.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Praça de Alimentação & Cafeterias).', 'O valor de 25 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-4', 'Dezembro', 'R$ 30 de desconto em compras acima de R$ 150.', 'Compras', 50, 'Lojas Participantes — Novo Shopping', 'Varejo & Presentes de Natal', 'Válido durante todo o mês de Dezembro', 'assets/images/astros-reais/astro-compras-real.jpg?v=15', 'Economize R$ 30,00 nas suas compras de Natal com valor acima de R$ 150,00 nas lojas participantes.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Lojas Participantes — Novo Shopping).', 'O valor de 50 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-5', 'Dezembro', 'R$ 60 de desconto em artigos esportivos acima de R$ 300.', 'Esportes', 50, 'Centauro & Lojas Esportivas Novo Shopping', 'Corredor Esportivo — Novo Shopping', 'Válido durante todo o mês de Dezembro', 'assets/images/astros-reais/astro-esportes-real.jpg?v=15', 'Desconto de R$ 60,00 na compra de roupas, equipamentos e artigos esportivos acima de R$ 300,00.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Centauro & Lojas Esportivas Novo Shopping).', 'O valor de 50 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-6', 'Dezembro', 'R$ 30,00 de crédito em lojas infantis.', 'Lazer', 50, 'Ri Happy & Lojas Infantis Novo Shopping', 'Lojas de Brinquedos e Moda Infantil', 'Válido durante todo o mês de Dezembro', 'assets/images/astros-reais/astro-lazer-real.jpg?v=15', 'Resgate R$ 30,00 de crédito para comprar brinquedos, jogos e presentes nas lojas infantis participantes do Novo Shopping.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Ri Happy & Lojas Infantis Novo Shopping).', 'O valor de 50 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-7', 'Dezembro', 'R$ 40 de crédito para utilizar em dois estabelecimentos diferentes, sendo R$ 20 em cada.', 'Geral', 50, 'Lojas e Restaurantes Participantes', 'Todo o Novo Shopping Ribeirão Preto', 'Válido durante todo o mês de Dezembro', 'assets/images/astros-reais/astro-servicos-real.jpg?v=15', 'Receba R$ 40,00 em créditos divididos em 2 vouchers de R$ 20,00 para aproveitar em dois estabelecimentos diferentes do shopping.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Lojas e Restaurantes Participantes).', 'O valor de 50 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-8', 'Dezembro', 'R$ 60 de desconto em compras acima de R$ 300.', 'Compras', 50, 'Lojas Participantes — Novo Shopping', 'Moda, Calçados e Presentes', 'Válido durante todo o mês de Dezembro', 'assets/images/astros-reais/astro-compras-real.jpg?v=15', 'Aproveite R$ 60,00 de desconto em compras a partir de R$ 300,00 para garantir os presentes de toda a família.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Lojas Participantes — Novo Shopping).', 'O valor de 50 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-9', 'Dezembro', 'Um ingresso de cinema gratuito para sessão convencional.', 'Lazer', 50, 'Cinemark Novo Shopping', 'Piso Lazer — Cinemark', 'Válido durante todo o mês de Dezembro', 'assets/images/beneficios/cinema.jpg?v=15', 'Troque seus pontos por 1 ingresso de cinema 100% gratuito para qualquer sessão 2D convencional no Novo Shopping.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Cinemark Novo Shopping).', 'O valor de 50 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-10', 'Dezembro', 'Um voucher de R$ 40 para presentear outro membro do Clube.', 'Geral', 50, 'Novo Clube — Novo Shopping', 'Resgate Digital Transferível no App', 'Válido até Janeiro para o presenteado', 'assets/images/astros-reais/astro-servicos-real.jpg?v=15', 'Gere um vale-presente especial de R$ 40,00 para enviar a outro membro da família ou amigo cadastrado no Novo Clube.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Novo Clube — Novo Shopping).', 'O valor de 50 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-11', 'Dezembro', 'R$ 75 de desconto em calçados esportivos acima de R$ 350.', 'Esportes', 100, 'Centauro & Lojas de Calçados Esportivos', 'Corredor Esportivo — Novo Shopping', 'Válido durante todo o mês de Dezembro', 'assets/images/astros-reais/astro-esportes-real.jpg?v=15', 'Desconto especial de R$ 75,00 na compra de calçados esportivos de alta performance acima de R$ 350,00.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Centauro & Lojas de Calçados Esportivos).', 'O valor de 100 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-12', 'Dezembro', 'Vale-compras de R$ 75 em loja participante.', 'Compras', 100, 'Lojas Participantes — Novo Shopping', 'Lojas Parceiras do Novo Clube', 'Válido durante Dezembro e Janeiro', 'assets/images/astros-reais/astro-compras-real.jpg?v=15', 'Resgate um vale-compras de R$ 75,00 para utilizar diretamente em uma das lojas participantes do Novo Shopping.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Lojas Participantes — Novo Shopping).', 'O valor de 100 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-13', 'Dezembro', 'R$ 50 de crédito em atrações de lazer.', 'Lazer', 100, 'Parques, Boliche & Atrações de Lazer', 'Piso Lazer — Novo Shopping', 'Válido nas férias de Dezembro e Janeiro', 'assets/images/astros-reais/astro-lazer-real.jpg?v=15', 'Garanta R$ 50,00 em créditos para curtir as atrações de lazer e entretenimento em família no Novo Shopping.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Parques, Boliche & Atrações de Lazer).', 'O valor de 100 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-14', 'Dezembro', 'R$ 75 em alimentação, dividido em três vouchers de R$ 25.', 'Geral', 100, 'Praça de Alimentação & Restaurantes', 'Gastronomia — Novo Shopping', 'Válido durante Dezembro e Janeiro', 'assets/images/beneficios/combo.jpg?v=15', 'Receba R$ 75,00 em créditos gastronômicos divididos em 3 vouchers de R$ 25,00 para aproveitar em diferentes refeições.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Praça de Alimentação & Restaurantes).', 'O valor de 100 pontos é descontado apenas do seu Saldo de Benefícios.'], true),
('ben-dez-15', 'Dezembro', 'Vale-compras de R$ 100 em lojas participantes.', 'Compras', 100, 'Lojas Participantes — Novo Shopping', 'Rede Oficial Novo Clube', 'Válido durante Dezembro e Janeiro', 'assets/images/astros-reais/astro-compras-real.jpg?v=15', 'O maior benefício de fim de ano! Vale-compras de R$ 100,00 para usar nas lojas participantes do Novo Shopping Ribeirão Preto.', ARRAY['Apresente o código de resgate diretamente na loja parceira (Lojas Participantes — Novo Shopping).', 'O valor de 100 pontos é descontado apenas do seu Saldo de Benefícios.'], true)
ON CONFLICT (id) DO UPDATE SET
    mes = EXCLUDED.mes,
    titulo = EXCLUDED.titulo,
    categoria = EXCLUDED.categoria,
    pontos = EXCLUDED.pontos,
    parceiro = EXCLUDED.parceiro,
    localizacao = EXCLUDED.localizacao,
    validade = EXCLUDED.validade,
    imagem = EXCLUDED.imagem,
    descricao = EXCLUDED.descricao,
    regras = EXCLUDED.regras,
    destaque = EXCLUDED.destaque;
