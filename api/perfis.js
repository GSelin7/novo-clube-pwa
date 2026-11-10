import { supabaseAdmin, handleCors, getAuthUser, sendJson, handleError } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    const usuario = await getAuthUser(req);
    if (!usuario) {
      return sendJson(res, 401, { erro: 'Não autorizado. Envie o cabeçalho Authorization: Bearer <token>' });
    }

    // 1. LISTAR PERFIS FAMILIARES DA CONTA
    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin
        .from('perfis')
        .select('*')
        .eq('usuario_id', usuario.id)
        .order('criado_em', { ascending: true });

      if (error) return handleError(res, error);
      return sendJson(res, 200, { sucesso: true, perfis: data });
    }

    // 2. CRIAR NOVO PERFIL FAMILIAR (ESTILO NETFLIX)
    if (req.method === 'POST') {
      const { nome, papel, telefone, avatarBg, avatarCor } = req.body || {};
      if (!nome || !nome.trim()) {
        return sendJson(res, 400, { erro: 'O nome do perfil é obrigatório' });
      }

      const nomeLimpo = nome.trim();
      const nomeCurto = nomeLimpo.split(' ')[0] || nomeLimpo;
      const iniciais = nomeLimpo.substring(0, 2).toUpperCase();

      const { data: novoPerfil, error } = await supabaseAdmin
        .from('perfis')
        .insert({
          usuario_id: usuario.id,
          nome: nomeLimpo,
          nome_curto: nomeCurto,
          iniciais: iniciais,
          papel: papel || 'Perfil • Família',
          email: usuario.email,
          telefone: telefone || '',
          avatar_bg: avatarBg || '#FDE68A',
          avatar_cor: avatarCor || '#92400E',
          pontos_colecao: 0,
          saldo_beneficios: 0,
          quantidade_notas: 0
        })
        .select()
        .single();

      if (error) return handleError(res, error);

      // Desbloqueia 1º Astro para o novo perfil
      await supabaseAdmin.from('transacoes').insert({
        perfil_id: novoPerfil.id,
        tipo: 'credito',
        titulo: 'Novo Perfil — 1º Astro Desbloqueado!',
        subtitulo: 'Astro Serviços (Amarelo)',
        pontos: 0
      });

      return sendJson(res, 201, { sucesso: true, perfil: novoPerfil });
    }

    // 3. ATUALIZAR CONFIGURAÇÕES DO PERFIL
    if (req.method === 'PUT') {
      const { id, nome, telefone, papel, avatarBg, avatarCor } = req.body || {};
      if (!id) return sendJson(res, 400, { erro: 'O ID do perfil é obrigatório' });

      const atualizacoes = { atualizado_em: new Date().toISOString() };
      if (nome) {
        atualizacoes.nome = nome.trim();
        atualizacoes.nome_curto = nome.trim().split(' ')[0];
        atualizacoes.iniciais = nome.trim().substring(0, 2).toUpperCase();
      }
      if (telefone !== undefined) atualizacoes.telefone = telefone;
      if (papel !== undefined) atualizacoes.papel = papel;
      if (avatarBg) atualizacoes.avatar_bg = avatarBg;
      if (avatarCor) atualizacoes.avatar_cor = avatarCor;

      const { data, error } = await supabaseAdmin
        .from('perfis')
        .update(atualizacoes)
        .eq('id', id)
        .eq('usuario_id', usuario.id)
        .select()
        .single();

      if (error) return handleError(res, error);
      return sendJson(res, 200, { sucesso: true, perfil: data });
    }

    return sendJson(res, 405, { erro: 'Método não permitido' });
  } catch (err) {
    return handleError(res, err);
  }
}
