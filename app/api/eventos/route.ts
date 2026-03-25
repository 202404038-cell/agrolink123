import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Asegúrate de que esta URL esté exactamente así, sin espacios ocultos
    const url = 'https://acapulco-api-m9yu.vercel.app/api/eventos?api_key=ak_live_grPNRbnqwFY7JOmFl4o23uTc';
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ 
        error: 'API externa respondió con error', 
        detalles: data 
      }, { status: res.status });
    }

    return NextResponse.json(data);
    
  } catch (error: any) {
    return NextResponse.json({ error: 'Error de servidor', mensaje: error.message }, { status: 500 });
  }
}

// versión final sin errores