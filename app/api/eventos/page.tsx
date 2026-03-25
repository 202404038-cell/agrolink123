'use client';
import { useEffect, useState } from 'react';

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/eventos')
      .then(res => res.json())
      .then(data => {
        if (data.eventos) setEventos(data.eventos);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Cargando eventos de Acapulco...</div>;

  return (
    <div style={{ padding: '40px', backgroundColor: '#000', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#00ff88', fontSize: '2.5rem', marginBottom: '40px' }}>
        Próximos Eventos en Acapulco
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {eventos.length > 0 ? eventos.map((ev: any, i) => (
          <div key={i} style={{ backgroundColor: '#111', border: '1px solid #00ff88', padding: '20px', borderRadius: '15px' }}>
            <h2 style={{ color: '#00ff88', marginTop: '0' }}>{ev.nombre}</h2>
            <p><strong>📍 Lugar:</strong> {ev.lugar}</p>
            <p><strong>📅 Fecha:</strong> {ev.fecha}</p>
            <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{ev.descripcion}</p>
            <button style={{ backgroundColor: '#00ff88', color: 'black', border: 'none', padding: '10px', borderRadius: '5px', width: '100%', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              Reservar Lugar
            </button>
          </div>
        )) : (
          <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>No se encontraron eventos disponibles por ahora.</p>
        )}
      </div>
    </div>
  );
}