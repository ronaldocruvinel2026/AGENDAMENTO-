import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { barber_id, service_id, client_name, client_phone, scheduled_at } = body;

  // Validação mínima — nunca confie no que vem do navegador
  if (!barber_id || !service_id || !client_name || !client_phone || !scheduled_at) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  // Cria (ou reusa) o cliente
  const { data: client, error: clientError } = await supabaseAdmin
    .from('clients')
    .insert({ barber_id, name: client_name, phone: client_phone })
    .select('id')
    .single();

  if (clientError) {
    return NextResponse.json({ error: 'Erro ao salvar cliente' }, { status: 500 });
  }

  // Cria o agendamento
  const { data: appointment, error } = await supabaseAdmin
    .from('appointments')
    .insert({ barber_id, client_id: client.id, service_id, scheduled_at })
    .select()
    .single();

  // AQUI a trava do banco entra em ação: se o horário já existe,
  // o Postgres recusa com erro de unicidade (código 23505)
  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Esse horário já foi reservado' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Erro ao agendar' }, { status: 500 });
  }

  return NextResponse.json({ success: true, appointment });
}
