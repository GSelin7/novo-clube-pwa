import { supabasePublic, handleCors, sendJson, handleError } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    if (req.method !== 'GET') {
      return sendJson(res, 405, { erro: 'Método não permitido' });
    }

    const { mes, month, categoria, category, destaque, featured } = req.query;
    const filtroMes = mes || month;
    const filtroCategoria = categoria || category;
    const filtroDestaque = destaque !== undefined ? destaque : featured;

    let query = supabasePublic
      .from('beneficios')
      .select('*')
      .eq('ativo', true)
      .order('pontos', { ascending: true });

    if (filtroMes) query = query.eq('mes', filtroMes);
    if (filtroCategoria && filtroCategoria !== 'Todas') query = query.eq('categoria', filtroCategoria);
    if (filtroDestaque === 'true') query = query.eq('destaque', true);

    const { data, error } = await query;
    if (error) return handleError(res, error);

    return sendJson(res, 200, { sucesso: true, quantidade: data.length, beneficios: data });
  } catch (err) {
    return handleError(res, err);
  }
}
