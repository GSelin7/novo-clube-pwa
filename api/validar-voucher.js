import { supabaseAdmin, handleCors, sendJson, handleError } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    // 1. CONSULTAR VOUCHER SEM BAIXAR (PREVIEW NO TOTEM / CAIXA DA LOJA)
    if (req.method === 'GET') {
      const { codigo, code } = req.query;
      const codigoVoucher = (codigo || code || '').trim().toUpperCase();

      if (!codigoVoucher) {
        return sendJson(res, 400, { erro: 'O código do voucher é obrigatório' });
      }

      const { data: voucher, error } = await supabaseAdmin
        .from('resgates')
        .select('id, titulo, parceiro, pontos, codigo_voucher, status, resgatado_em, utilizado_em')
        .eq('codigo_voucher', codigoVoucher)
        .single();

      if (error || !voucher) {
        return sendJson(res, 404, { valido: false, erro: 'Voucher não encontrado.' });
      }

      const isDisponivel = voucher.status === 'disponivel';

      return sendJson(res, 200, {
        valido: isDisponivel,
        status: voucher.status,
        voucher
      });
    }

    // 2. DAR BAIXA DEFINITIVA NO VOUCHER (LOJISTA CONFIRMA O USO)
    if (req.method === 'POST') {
      const { codigo, code, codigoVoucher, parceiro, partner } = req.body || {};
      const codFinal = (codigo || code || codigoVoucher || '').trim().toUpperCase();
      const nomeParceiro = parceiro || partner || null;

      if (!codFinal) {
        return sendJson(res, 400, { erro: 'O código do voucher é obrigatório' });
      }

      // Executa a procedure atômica validar_e_utilizar_voucher
      const { data: resultado, error } = await supabaseAdmin.rpc('validar_e_utilizar_voucher', {
        p_codigo_voucher: codFinal,
        p_parceiro: nomeParceiro
      });

      if (error) {
        return handleError(res, error, 'Falha ao validar voucher: ' + error.message);
      }

      return sendJson(res, 200, {
        sucesso: true,
        mensagem: 'Voucher baixado com sucesso!',
        dados: resultado
      });
    }

    return sendJson(res, 405, { erro: 'Método não permitido' });
  } catch (err) {
    return handleError(res, err);
  }
}
