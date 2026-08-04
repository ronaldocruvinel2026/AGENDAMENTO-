'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function AgendarPage() {
  const { slug } = useParams();
  const [barber, setBarber] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [datetime, setDatetime] = useState('');
  const [status, setStatus] = useState(''); // '', 'enviando', 'ok', 'erro'
  const [errorMsg, setErrorMsg] = useState('');

  // Carrega barbeiro + serviços ao abrir a página
  useEffect(() => {
    fetch(`/api/barber/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setBarber(data.barber);
        setServices(data.services || []);
      });
  }, [slug]);

  async function handleSubmit() {
    if (!selectedService || !name || !phone || !datetime) {
      setErrorMsg('Preencha tudo, por favor.');
      return;
    }
    setStatus('enviando');
    setErrorMsg('');

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barber_id: barber.id,
        service_id: selectedService,
        client_name: name,
        client_phone: phone,
        scheduled_at: datetime,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('ok');
    } else {
      setStatus('erro');
      setErrorMsg(data.error || 'Algo deu errado.');
    }
  }

  if (!barber) return <p style={{ padding: 24 }}>Carregando...</p>;

  if (status === 'ok') {
    return (
      <div style={{ padding: 24, maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
        <h2>Agendamento confirmado! ✅</h2>
        <p>
          {name}, seu horário com {barber.name} está reservado.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 22 }}>Agendar com {barber.name}</h1>

      <label style={{ display: 'block', marginTop: 16, fontWeight: 600 }}>Serviço</label>
      {services.map((s) => (
        <button
          key={s.id}
          onClick={() => setSelectedService(s.id)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: 12,
            marginTop: 8,
            borderRadius: 10,
            cursor: 'pointer',
            border: selectedService === s.id ? '2px solid #111' : '1px solid #ccc',
            background: selectedService === s.id ? '#f4f4f4' : '#fff',
          }}
        >
          {s.name} — R$ {Number(s.price).toFixed(2)} ({s.duration_minutes} min)
        </button>
      ))}

      <label style={{ display: 'block', marginTop: 16, fontWeight: 600 }}>Seu nome</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
        placeholder="Nome completo"
      />

      <label style={{ display: 'block', marginTop: 12, fontWeight: 600 }}>WhatsApp</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={inputStyle}
        placeholder="(34) 99999-9999"
      />

      <label style={{ display: 'block', marginTop: 12, fontWeight: 600 }}>Data e hora</label>
      <input
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        style={inputStyle}
      />

      {errorMsg && <p style={{ color: '#c00', marginTop: 12 }}>{errorMsg}</p>}

      <button
        onClick={handleSubmit}
        disabled={status === 'enviando'}
        style={{
          width: '100%',
          padding: 14,
          marginTop: 20,
          borderRadius: 10,
          border: 'none',
          background: '#111',
          color: '#fff',
          fontSize: 16,
          cursor: 'pointer',
        }}
      >
        {status === 'enviando' ? 'Agendando...' : 'Confirmar agendamento'}
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: 12,
  marginTop: 6,
  borderRadius: 10,
  border: '1px solid #ccc',
  fontSize: 16,
  boxSizing: 'border-box',
};
