import { createClient } from '@supabase/supabase-js';

// A chave service_role IGNORA o RLS de propósito.
// Por isso ela SÓ pode existir aqui no servidor, nunca no navegador.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
