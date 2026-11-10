import { supabaseAdmin, handleCors, getAuthUser, sendJson, handleError } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    const usuario = await getAuthUser(req);
    if (!usuario) {
      return sendJson(res, 401, { erro: 'Não autorizado' });
    }

    // 1. LISTAR VOUCHERS RESGATADOS PELO PERFIL
    if (req.method === 'GET') {
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

      if (!perfil) return sendJson(res, 403, { erro: 'Acesso negado ao perfil informado' });

      const { data: resgates, error } = await supabaseAdmin
        .from('resgates')
        .select('*')
        .eq('perfil_id', idPerfil)
        .order('resgatado_em', { ascending: false });

      if (error) return handleError(res, error);
      return sendJson(res, 200, { sucesso: true, vouchers: resgates });
    }

    // 2. EFETUAR RESGATE DE BENEFÍCIO (DÉBITO ATÔMICO E GERAÇÃO DO VOUCHER)
    if (req.method === 'POST') {
      const { perfilId, profileId, beneficioId, benefitId } = req.body || {};
      const idPerfil = perfilId || profileId;
      const idBeneficio = beneficioId || benefitId;

      if (!idPerfil || !idBeneficio) {
        return sendJson(res, 400, { erro: 'perfilId e beneficioId são obrigatórios' });
      }

      // Validação de acesso ao perfil
      const { data: perfil } = await supabaseAdmin
        .from('perfis')
        .select('id, saldo_beneficios')
        .eq('id', idPerfil)
        .eq('usuario_id', usuario.id)
        .single();

      if (!perfil) return sendJson(res, 403, { erro: 'Acesso negado ao perfil selecionado' });

      // Chama a função atômica PostgreSQL: resgatar_beneficio
      const { data: resultado, error } = await supabaseAdmin.rpc('resgatar_beneficio', {
        p_perfil_id: idPerfil,
        p_beneficio_id: idBeneficio
      });

      if (error) {
        return handleError(res, error, 'Não foi possível concluir o resgate do benefício');
      }

      return sendJson(res, 200, {
        sucesso: true,
        mensagem: 'Benefício resgatado com sucesso!',
        dados: resultado
      });
    }

    return sendJson(res, 405, { erro: 'Método não permitido' });
  } catch (err) {
    return handleError(res, err);
  }
}
