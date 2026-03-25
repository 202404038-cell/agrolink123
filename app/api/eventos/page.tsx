'use client';
import { useEffect, useState } from 'react';

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    // Consumimos tu propia API que ya arreglamos
    fetch('/api/eventos')
      .then(res => res.json())
      .then(data => {
        if (data.eventos) setEventos(data.eventos);
      });
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#111', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ textAlign: 'center', color: '#00ff88' }}>Eventos en Acapulco</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {eventos.map((evento: any, index) => (
          <div key={index} style={{ border: '1px solid #333', padding: '15px', borderRadius: '10px', backgroundColor: '#222' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{evento.nombre}</h2>
            <p>📍 {evento.lugar}</p>
            <p>📅 {evento.fecha}</p>
            <button style={{ marginTop: '10px', padding: '8px', width: '100%', backgroundColor: '#00ff88', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Ver detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}