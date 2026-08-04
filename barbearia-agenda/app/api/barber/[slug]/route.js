import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { slug } = params;

  // Acha o barbeiro pelo slug do link (ex: /agendar/joao-barbearia)
  const { data: barber, error } = await supabaseAdmin
    .from('barbers')
    .select('id, name, slug')
    .eq('slug', slug)
    .single();

  if (error || !barber) {
    return NextResponse.json(
      { error: 'Barbeiro não encontrado' },
      { status: 404 }
    );
  }

  // Pega os serviços ativos desse barbeiro
  const { data: services } = await supabaseAdmin
    .from('services')
    .select('id, name, price, duration_minutes')
    .eq('barber_id', barber.id)
    .eq('active', true);

  return NextResponse.json({ barber, services: services || [] });
}
