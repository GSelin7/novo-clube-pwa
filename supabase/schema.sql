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
    IF v_saldo_atual < v_beneficio.points THEN
        RAISE EXCEPTION 'Saldo insuficiente (% pts). O benefício requer % pts.', v_saldo_atual, v_beneficio.points;
    END IF;

    -- Código no padrão NOVO-XXXX-123
    v_codigo_voucher := 'NOVO-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)) || '-' || FLOOR(100 + RANDOM() * 900)::TEXT;

    -- Debita o saldo
    UPDATE public.perfis
    SET saldo_beneficios = saldo_beneficios - v_beneficio.points,
        atualizado_em = NOW()
    WHERE id = p_perfil_id;

    -- Registra o resgate
    INSERT INTO public.resgates (perfil_id, beneficio_id, titulo, parceiro, pontos, codigo_voucher)
    VALUES (p_perfil_id, v_beneficio.id, v_beneficio.titulo, v_beneficio.parceiro, v_beneficio.points, v_codigo_voucher)
    RETURNING id INTO v_resgate_id;

    -- Registra o débito no extrato
    INSERT INTO public.transacoes (perfil_id, tipo, titulo, subtitulo, pontos)
    VALUES (p_perfil_id, 'debito', 'Resgate: ' || v_beneficio.titulo, v_beneficio.parceiro, v_beneficio.points);

    RETURN json_build_object(
        'sucesso', true,
        'resgate_id', v_resgate_id,
        'codigo_voucher', v_codigo_voucher,
        'pontos_debitados', v_beneficio.points,
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
INSERT INTO public.astros (id, name, category, color_name, accent_color, required_points, release_month, requirement_label, image_3d, image_real, accessories, description) VALUES
('servicos', 'Astro Serviços', 'Serviços', 'Amarelo', '#FACC15', 0, 'Outubro', 'Ação cadastrada', 'assets/images/astros/astro-servicos.png?v=8', 'assets/images/astros-reais/astro-servicos-real.jpg?v=8', 'Camisa polo amarela com crachá do Novo Shopping e óculos redondos', 'Desbloqueado automaticamente no seu cadastro! Representa a praticidade de resolver tudo em um só lugar: bancos, lotérica, academia, clínica de saúde e serviços especializados.'),
('lazer', 'Astro Lazer', 'Lazer', 'Rosa', '#F472B6', 500, 'Outubro', '500 pontos', 'assets/images/astros/astro-lazer.png?v=8', 'assets/images/astros-reais/astro-lazer-real.jpg?v=8', 'Óculos 3D de cinema e balde de pipoca exclusivo do Novo Shopping', 'Representa os momentos inesquecíveis em família: sessões de cinema, praça de alimentação completa, parques infantis e eventos culturais no Novo Shopping.'),
('esportes', 'Astro Esportes', 'Saúde', 'Azul', '#38BDF8', 1000, 'Novembro', '1.000 pontos', 'assets/images/astros/astro-esportes.png?v=8', 'assets/images/astros-reais/astro-esportes-real.jpg?v=8', 'Faixa esportiva na cabeça e par de halteres de pelúcia', 'Representa a categoria de Saúde, bem-estar e vida ativa. Liberado na virada para Novembro para quem acumula 1.000 pontos na coleção.'),
('compras', 'Astro Compras', 'Varejo', 'Verde', '#4ADE80', 1500, 'Dezembro', '1.500 pontos', 'assets/images/astros/astro-compras.png?v=8', 'assets/images/astros-reais/astro-compras-real.jpg?v=8', 'Óculos escuros estilosos, casquinha de sorvete e sacolas de compras do Novo Shopping', 'O grande troféu da jornada! Representa a força do Varejo, moda e gastronomia do Novo Shopping Ribeirão Preto. Liberado em Dezembro ao atingir 1.500 pontos acumulados.')
ON CONFLICT (id) DO NOTHING;

-- Catálogo de Benefícios
INSERT INTO public.beneficios (id, mes, titulo, categoria, pontos, parceiro, localizacao, validade, imagem, descricao, regras, destaque) VALUES
('ben-out-1', 'Outubro', '20% de desconto em um ingresso de cinema.', 'Lazer', 25, 'Cinemark Novo Shopping', 'Piso Lazer — Próximo à Praça de Alimentação', 'Válido durante todo o mês de Outubro', 'assets/images/beneficios/cinema.jpg?v=15', 'Garanta 20% de desconto na compra de 1 ingresso de cinema no Cinemark do Novo Shopping Ribeirão Preto.', ARRAY['Apresente o voucher no guichê de atendimento ou digite o código no totem do Cinemark.', 'Válido para 1 ingresso por sessão em salas tradicionais (2D).', 'Não cumulativo com outras promoções ou meia-entrada legal.'], true),
('ben-out-2', 'Outubro', 'Casquinha de sorvete cortesia.', 'Alimentação', 25, 'Chiquinho Sorvetes & Quiosques', 'Praça Central e Corredores de Alimentação', 'Válido durante todo o mês de Outubro', 'assets/images/astros-reais/astro-servicos-real.jpg?v=15', 'Refresque seu passeio com 1 casquinha tradicional nos quiosques parceiros.', ARRAY['Válido para 1 casquinha simples nos quiosques participantes.', 'Apresente o código do voucher ao atendente antes da emissão da comanda.'], true),
('ben-out-3', 'Outubro', '10% de desconto em compras acima de R$ 80.', 'Compras', 50, 'Lojas de Varejo Participantes', 'Piso Térreo — Lojas Sinalizadas', 'Válido durante todo o mês de Outubro', 'assets/images/astros-reais/astro-compras-real.jpg?v=15', 'Economize 10% no total da sua compra acima de R$ 80,00 nas lojas parceiras.', ARRAY['Desconto não cumulativo com liquidações.', 'Apresente o cupom no caixa antes de fechar a compra.'], true),
('ben-out-4', 'Outubro', 'Obtenha isenção do seu estacionamento.', 'Geral', 25, 'Estacionamento Novo Shopping', 'Guichês de Pagamento e Totens de Autoatendimento', 'Válido durante todo o mês de Outubro', 'assets/images/beneficios/estacionamento.jpg?v=15', 'Obtenha a isenção do seu ticket de estacionamento no Novo Shopping Ribeirão Preto.', ARRAY['Apresente ou escaneie o código do voucher nos totens ou guichês.', 'Válido para 1 utilização de estacionamento no Novo Shopping.'], true),
('ben-out-5', 'Outubro', 'R$ 15,00 de desconto em lojas infantis.', 'Lazer', 50, 'Ri Happy & Lojas Infantis Participantes', 'Corredor Infantil & Lazer — Novo Shopping', 'Válido durante todo o mês de Outubro', 'assets/images/astros-reais/astro-lazer-real.jpg?v=15', 'Garanta R$ 15,00 de desconto em compras nas lojas infantis e de brinquedos participantes.', ARRAY['Desconto de R$ 15,00 válido nas lojas infantis parceiras.', 'Apresente o voucher no caixa antes de encerrar a compra.'], true),
('ben-nov-1', 'Novembro', 'R$ 20 de desconto em compras acima de R$ 100.', 'Compras', 25, 'Lojas Participantes — Novo Shopping', 'Varejo & Moda — Lojas Sinalizadas', 'Válido durante todo o mês de Novembro', 'assets/images/astros-reais/astro-compras-real.jpg?v=15', 'Desconto direto de R$ 20,00 em compras a partir de R$ 100,00 nas lojas participantes durante o mês da Black Friday.', ARRAY['Válido nas lojas sinalizadas da Black Friday Novo Shopping.'], true),
('ben-dez-15', 'Dezembro', 'Vale-compras de R$ 100 em lojas participantes.', 'Compras', 100, 'Lojas Participantes — Novo Shopping', 'Rede Oficial Novo Clube', 'Válido durante Dezembro e Janeiro', 'assets/images/astros-reais/astro-compras-real.jpg?v=15', 'O maior benefício de fim de ano! Vale-compras de R$ 100,00 para usar nas lojas participantes do Novo Shopping Ribeirão Preto.', ARRAY['Válido para compras natalinas no Novo Shopping.'], true)
ON CONFLICT (id) DO NOTHING;
