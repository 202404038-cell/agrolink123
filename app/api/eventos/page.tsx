'use client';
import { useEffect, useState } from 'react';

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    fetch('/api/eventos')
      .then(res => res.json())
      .then(data => {
        if (data && data.eventos) {
          setEventos(data.eventos);
        }
      })
      .catch(err => console.error("Error cargando eventos", err));
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#00ff88' }}>Eventos en Acapulco</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {eventos.length > 0 ? eventos.map((ev: any, i: number) => (
          <div key={i} style={{ border: '1px solid #00ff88', padding: '15px', borderRadius: '10px' }}>
            <h2 style={{ color: '#00ff88' }}>{ev.nombre}</h2>
            <p>📍 {ev.lugar}</p>
            <p>📅 {ev.fecha}</p>
          </div>
        )) : (
          <p style={{ textAlign: 'center', width: '100%' }}>Buscando eventos...</p>
        )}
      </div>
    </div>
  );
}