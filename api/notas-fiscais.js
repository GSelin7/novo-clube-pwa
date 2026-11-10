import { supabaseAdmin, handleCors, getAuthUser, sendJson, handleError } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    const usuario = await getAuthUser(req);
    if (!usuario) {
      return sendJson(res, 401, { erro: 'Não autorizado' });
    }

    // 1. LISTAR NOTAS FISCAIS DO PERFIL
    if (req.method === 'GET') {
      const { perfilId, profileId } = req.query;
      const idPerfil = perfilId || profileId;

      if (!idPerfil) return sendJson(res, 400, { erro: 'perfilId é obrigatório' });

      // Validação de titularidade do perfil
      const { data: perfil } = await supabaseAdmin
        .from('perfis')
        .select('id')
        .eq('id', idPerfil)
        .eq('usuario_id', usuario.id)
        .single();

      if (!perfil) return sendJson(res, 403, { erro: 'Perfil não pertence ao usuário autenticado' });

      const { data: notas, error } = await supabaseAdmin
        .from('notas_fiscais')
        .select('*')
        .eq('perfil_id', idPerfil)
        .order('criado_em', { ascending: false });

      if (error) return handleError(res, error);
      return sendJson(res, 200, { sucesso: true, notas_fiscais: notas });
    }

    // 2. ENVIAR NOTA FISCAL (CÁLCULO ATÔMICO DE PONTOS + VALIDAÇÃO ANTIFRAUDE)
    if (req.method === 'POST') {
      const {
        perfilId,
        profileId,
        lojaNome,
        storeName,
        cnpj,
        categoria,
        category,
        valor,
        value,
        numeroNota,
        numero_nota,
        chaveAcesso,
        chave_acesso,
        dataEmissao,
        data_emissao,
        imagemUrl,
        imageUrl
      } = req.body || {};

      const idPerfil = perfilId || profileId;
      const nomeLoja = lojaNome || storeName;
      const valorFinal = parseFloat(valor !== undefined ? valor : value);
      const urlImagem = imagemUrl || imageUrl || null;
      const numNota = numeroNota || numero_nota || null;
      const chave = chaveAcesso || chave_acesso || null;
      const emissao = dataEmissao || data_emissao || new Date().toISOString().split('T')[0];

      if (!idPerfil || !nomeLoja || isNaN(valorFinal) || valorFinal <= 0) {
        return sendJson(res, 400, { erro: 'perfilId, lojaNome e valor válido (> 0) são obrigatórios' });
      }

      // Validação de acesso ao perfil
      const { data: perfil } = await supabaseAdmin
        .from('perfis')
        .select('id')
        .eq('id', idPerfil)
        .eq('usuario_id', usuario.id)
        .single();

      if (!perfil) return sendJson(res, 403, { erro: 'Acesso negado ao perfil selecionado' });

      // Chama a função atômica PostgreSQL: cadastrar_nota_fiscal
      const { data: resultado, error } = await supabaseAdmin.rpc('cadastrar_nota_fiscal', {
        p_perfil_id: idPerfil,
        p_loja_nome: nomeLoja,
        p_cnpj: cnpj || null,
        p_categoria: categoria || category || 'Geral',
        p_valor: valorFinal,
        p_numero_nota: numNota,
        p_chave_acesso: chave,
        p_data_emissao: emissao,
        p_imagem_url: urlImagem
      });

      if (error) {
        return handleError(res, error, 'Falha ao processar nota fiscal: ' + error.message);
      }

      return sendJson(res, 201, {
        sucesso: true,
        mensagem: 'Nota fiscal cadastrada e pontuação creditada com sucesso!',
        dados: resultado
      });
    }

    return sendJson(res, 405, { erro: 'Método não permitido' });
  } catch (err) {
    return handleError(res, err);
  }
}
