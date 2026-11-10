import { supabaseAdmin, handleCors, getAuthUser, sendJson, handleError } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { erro: 'Método não permitido' });
    }

    const usuario = await getAuthUser(req);
    if (!usuario) {
      return sendJson(res, 401, { erro: 'Não autorizado. Envie o cabeçalho Authorization: Bearer <token>' });
    }

    const { perfilId, profileId, nomeArquivo, fileName } = req.body || {};
    const idPerfil = perfilId || profileId;
    const nomeOriginal = nomeArquivo || fileName || 'nota.jpg';

    if (!idPerfil) {
      return sendJson(res, 400, { erro: 'perfilId é obrigatório' });
    }

    // Validação de acesso ao perfil
    const { data: perfil } = await supabaseAdmin
      .from('perfis')
      .select('id')
      .eq('id', idPerfil)
      .eq('usuario_id', usuario.id)
      .single();

    if (!perfil) {
      return sendJson(res, 403, { erro: 'Acesso negado ao perfil informado' });
    }

    // Extrai e valida a extensão do arquivo
    const extensao = (nomeOriginal.split('.').pop() || 'jpg').toLowerCase();
    const extensoesValidas = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
    if (!extensoesValidas.includes(extensao)) {
      return sendJson(res, 400, {
        erro: `Extensão inválida (.${extensao}). Permitidas: ${extensoesValidas.join(', ')}`
      });
    }

    // Caminho seguro isolado por usuário e perfil no bucket privado
    const caminhoArquivo = `${usuario.id}/${idPerfil}/${Date.now()}_nota.${extensao}`;

    // Cria a Signed Upload URL no Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('notas-fiscais')
      .createSignedUploadUrl(caminhoArquivo);

    if (error) {
      return handleError(res, error, 'Erro ao gerar URL de upload no Supabase Storage');
    }

    // Cria também a Signed URL de leitura (para visualização segura no painel)
    const { data: leituraData } = await supabaseAdmin.storage
      .from('notas-fiscais')
      .createSignedUrl(caminhoArquivo, 60 * 60 * 24 * 365); // 1 ano

    return sendJson(res, 200, {
      sucesso: true,
      uploadUrl: data.signedUrl,
      token: data.token,
      caminho: caminhoArquivo,
      urlLeitura: leituraData?.signedUrl || null
    });
  } catch (err) {
    return handleError(res, err);
  }
}
