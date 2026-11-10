import { supabasePublic, handleCors, sendJson, handleError } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    if (req.method !== 'GET') {
      return sendJson(res, 405, { erro: 'Método não permitido' });
    }

    const { categoria, category } = req.query;
    const filtroCategoria = categoria || category;

    let query = supabasePublic
      .from('lojas')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true });

    if (filtroCategoria && filtroCategoria !== 'Todas') {
      query = query.eq('categoria', filtroCategoria);
    }

    const { data, error } = await query;
    if (error) return handleError(res, error);

    return sendJson(res, 200, { sucesso: true, quantidade: data.length, lojas: data });
  } catch (err) {
    return handleError(res, err);
  }
}
