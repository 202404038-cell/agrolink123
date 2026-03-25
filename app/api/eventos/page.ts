import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Consumiendo la API de Acapulco con tu API KEY
    const res = await fetch('https://acapulco-api-m9yu.vercel.app/api/eventos?apiKey=ak_live_grPNRbnqwFY7JOmFl4o23uTc', {
      cache: 'no-store' // Esto obliga a traer datos frescos siempre
    });

    if (!res.ok) {
      throw new Error('Error al obtener datos de la API externa');
    }

    const data = await res.json();

    // Retornamos los datos a tu servidor de Render
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API Eventos:", error);
    return NextResponse.json({ error: 'Fallo al cargar eventos' }, { status: 500 });
  }
}