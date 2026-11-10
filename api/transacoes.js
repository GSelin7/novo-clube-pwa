import { supabaseAdmin, handleCors, getAuthUser, sendJson, handleError } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    if (req.method !== 'GET') {
      return sendJson(res, 405, { erro: 'Método não permitido' });
    }

    const usuario = await getAuthUser(req);
    if (!usuario) {
      return sendJson(res, 401, { erro: 'Não autorizado' });
    }

    const { perfilId, profileId } = req.query;
    const idPerfil = perfilId || profileId;

    if (!idPerfil) return sendJson(res, 400, { erro: 'perfilId é obrigatório' });

    // Validação de acesso ao perfil
    const { data: perfil } = await supabaseAdmin
      .from('perfis')
      .select('id')
      .eq('id', idPerfil)
      .eq('usuario_id', usuario.id)
      .single();

    if (!perfil) return sendJson(res, 403, { erro: 'Acesso negado ao perfil' });

    const { data: transacoes, error } = await supabaseAdmin
      .from('transacoes')
      .select('*')
      .eq('perfil_id', idPerfil)
      .order('criado_em', { ascending: false });

    if (error) return handleError(res, error);
    return sendJson(res, 200, { sucesso: true, transacoes });
  } catch (err) {
    return handleError(res, err);
  }
}
