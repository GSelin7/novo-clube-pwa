import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

/**
 * Cliente público (respeita RLS e permissões de usuário)
 */
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Cliente administrativo com service_role (usado em funções do servidor com privilégio total)
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

/**
 * Headers padrão de CORS para requisições da Vercel
 */
export function handleCors(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

/**
 * Helper para obter usuário autenticado a partir do Bearer Token
 */
export async function getAuthUser(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return null;

  const { data: { user }, error } = await supabasePublic.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

/**
 * Helper para resposta JSON padronizada
 */
export function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

/**
 * Helper para tratamento padronizado de erro
 */
export function handleError(res, error, defaultMessage = 'Erro interno do servidor') {
  console.error('[API Error]:', error);
  const status = error.status || 500;
  const message = error.message || defaultMessage;
  res.status(status).json({ success: false, error: message });
}
