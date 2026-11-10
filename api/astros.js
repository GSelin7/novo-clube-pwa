import { supabaseAdmin, supabasePublic, handleCors, sendJson, handleError } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    if (req.method !== 'GET') {
      return sendJson(res, 405, { erro: 'Método não permitido' });
    }

    const { perfilId, profileId, mesAtual, currentMonth } = req.query;
    const idPerfil = perfilId || profileId;

    const { data: astros, error } = await supabasePublic
      .from('astros')
      .select('*')
      .order('pontos_necessarios', { ascending: true });

    if (error) return handleError(res, error);

    let perfil = null;
    if (idPerfil) {
      const { data } = await supabaseAdmin
        .from('perfis')
        .select('id, pontos_colecao')
        .eq('id', idPerfil)
        .single();
      perfil = data;
    }

    const nomeMes = mesAtual || currentMonth || 'Outubro';
    const ordemMeses = ['Outubro', 'Novembro', 'Dezembro'];
    const idxMesAtual = ordemMeses.indexOf(nomeMes);

    const astrosComStatus = astros.map((astro) => {
      const idxMesAstro = ordemMeses.indexOf(astro.mes_liberacao);
      const mesLiberado = idxMesAstro <= (idxMesAtual === -1 ? 0 : idxMesAtual);

      const pontosUsuario = perfil ? perfil.pontos_colecao : 0;
      const pontosAtingidos = pontosUsuario >= astro.pontos_necessarios;
      const desbloqueado = mesLiberado && (astro.pontos_necessarios === 0 || pontosAtingidos);

      return {
        ...astro,
        desbloqueado,
        mes_liberado: mesLiberado,
        pontos_usuario: pontosUsuario,
        pontos_restantes: Math.max(0, astro.pontos_necessarios - pontosUsuario)
      };
    });

    return sendJson(res, 200, { sucesso: true, astros: astrosComStatus });
  } catch (err) {
    return handleError(res, err);
  }
}
