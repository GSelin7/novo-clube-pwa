import { supabaseAdmin, supabasePublic, handleCors, getAuthUser, sendJson, handleError } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    const { acao, action } = req.body || req.query || {};
    const acaoNormalizada = acao || action;

    // 1. CHECAGEM DE SESSÃO DO USUÁRIO
    if (req.method === 'GET' || acaoNormalizada === 'sessao' || acaoNormalizada === 'session') {
      const usuario = await getAuthUser(req);
      if (!usuario) {
        return sendJson(res, 401, { autenticado: false });
      }
      return sendJson(res, 200, { autenticado: true, usuario });
    }

    if (req.method !== 'POST') {
      return sendJson(res, 405, { erro: 'Método não permitido' });
    }

    const { email, senha, password, nome, name } = req.body || {};
    const emailLimpo = (email || '').trim().toLowerCase();
    const senhaFinal = senha || password;
    const nomeFinal = (nome || name || '').trim();

    // 2. CADASTRO DE NOVA CONTA FAMILIAR
    if (acaoNormalizada === 'cadastrar' || acaoNormalizada === 'register') {
      if (!emailLimpo || !senhaFinal || !nomeFinal) {
        return sendJson(res, 400, { sucesso: false, erro: 'Nome, e-mail e senha são obrigatórios' });
      }

      if (senhaFinal.length < 6) {
        return sendJson(res, 400, { sucesso: false, erro: 'A senha deve conter no mínimo 6 caracteres.' });
      }

      // 2.1 Verifica previamente se já existe perfil com este e-mail no banco
      const { data: perfilExistente } = await supabaseAdmin
        .from('perfis')
        .select('id, email')
        .ilike('email', emailLimpo)
        .limit(1)
        .maybeSingle();

      if (perfilExistente) {
        return sendJson(res, 409, {
          sucesso: false,
          erro: 'Este e-mail já está cadastrado no Novo Clube. Por favor, acesse a aba "Entrar na Conta" para fazer login.'
        });
      }

      // 2.2 Cria usuário no Supabase Auth
      const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
        email: emailLimpo,
        password: senhaFinal,
        email_confirm: true,
        user_metadata: { nome_completo: nomeFinal }
      });

      if (authErr) {
        const msg = (authErr.message || '').toLowerCase();
        if (msg.includes('already') || msg.includes('registered') || authErr.status === 422) {
          return sendJson(res, 409, {
            sucesso: false,
            erro: 'Este e-mail já está cadastrado no Novo Clube. Por favor, acesse a aba "Entrar na Conta" para fazer login.'
          });
        }
        if (msg.includes('at least 6 characters') || msg.includes('password')) {
          return sendJson(res, 400, {
            sucesso: false,
            erro: 'A senha deve conter no mínimo 6 caracteres.'
          });
        }
        return handleError(res, authErr, 'Falha ao registrar usuário');
      }

      const usuarioId = authData.user.id;
      const nomeCurto = nomeFinal.split(' ')[0] || nomeFinal;
      const iniciais = nomeFinal.substring(0, 2).toUpperCase();

      // Cria o perfil familiar titular
      const { data: perfil, error: perfilErr } = await supabaseAdmin
        .from('perfis')
        .insert({
          usuario_id: usuarioId,
          nome: nomeFinal,
          nome_curto: nomeCurto,
          iniciais: iniciais,
          papel: 'Titular • Família',
          email: emailLimpo,
          avatar_bg: '#B8D4F2',
          avatar_cor: '#1E40AF',
          pontos_colecao: 0,
          saldo_beneficios: 0,
          quantidade_notas: 0
        })
        .select()
        .single();

      if (perfilErr) {
        return handleError(res, perfilErr, 'Erro ao criar perfil titular');
      }

      // 1º Astro desbloqueado automaticamente (Astro Serviços)
      await supabaseAdmin.from('transacoes').insert({
        perfil_id: perfil.id,
        tipo: 'credito',
        titulo: 'Adesão Novo Clube — 1º Astro Desbloqueado!',
        subtitulo: 'Astro Serviços (Amarelo)',
        pontos: 0
      });

      // Retorna a sessão para login imediato
      const { data: sessaoData } = await supabasePublic.auth.signInWithPassword({
        email: emailLimpo,
        password: senhaFinal
      });

      return sendJson(res, 201, {
        sucesso: true,
        mensagem: 'Conta criada com sucesso!',
        sessao: sessaoData?.session,
        perfil
      });
    }

    // 3. LOGIN NA CONTA
    if (acaoNormalizada === 'login' || acaoNormalizada === 'entrar') {
      if (!emailLimpo || !senhaFinal) {
        return sendJson(res, 400, { sucesso: false, erro: 'E-mail e senha são obrigatórios' });
      }

      const { data, error } = await supabasePublic.auth.signInWithPassword({
        email: emailLimpo,
        password: senhaFinal
      });

      if (error) {
        return sendJson(res, 401, {
          sucesso: false,
          erro: 'E-mail ou senha incorretos. Verifique suas credenciais.'
        });
      }

      // Busca os perfis familiares vinculados à conta
      const { data: perfis } = await supabaseAdmin
        .from('perfis')
        .select('*')
        .eq('usuario_id', data.user.id)
        .order('criado_em', { ascending: true });

      return sendJson(res, 200, {
        sucesso: true,
        sessao: data.session,
        usuario: data.user,
        perfis: perfis || []
      });
    }

    return sendJson(res, 400, { erro: 'Ação não reconhecida (use "entrar" ou "cadastrar")' });
  } catch (err) {
    return handleError(res, err);
  }
}
