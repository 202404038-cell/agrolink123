import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // URL completa con la API KEY pegada al final
    const url = 'https://acapulco-api-m9yu.vercel.app/api/eventos?apiKey=ak_live_grPNRbnqwFY7JOmFl4o23uTc';
    
    const res = await fetch(url, {
      cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
      // Esto nos dirá qué dice exactamente la API de Acapulco
      return NextResponse.json({ 
        error: 'API externa respondió con error', 
        detalles: data 
      }, { status: res.status });
    }

    return NextResponse.json(data);
    
  } catch (error: any) {
    return NextResponse.json({ error: 'Error de conexión', mensaje: error.message }, { status: 500 });
  }
}