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
    const senhaFinal = senha || password;
    const nomeFinal = (nome || name || '').trim();

    // 2. CADASTRO DE NOVA CONTA FAMILIAR
    if (acaoNormalizada === 'cadastrar' || acaoNormalizada === 'register') {
      if (!email || !senhaFinal || !nomeFinal) {
        return sendJson(res, 400, { erro: 'Nome, e-mail e senha são obrigatórios' });
      }

      // Cria usuário no Supabase Auth
      const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: senhaFinal,
        email_confirm: true,
        user_metadata: { nome_completo: nomeFinal }
      });

      if (authErr) {
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
          email: email,
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
        email,
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
      if (!email || !senhaFinal) {
        return sendJson(res, 400, { erro: 'E-mail e senha são obrigatórios' });
      }

      const { data, error } = await supabasePublic.auth.signInWithPassword({
        email,
        password: senhaFinal
      });

      if (error) {
        return sendJson(res, 401, { sucesso: false, erro: 'Credenciais inválidas: ' + error.message });
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
