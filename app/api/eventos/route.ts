import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // CAMBIO: Se usa api_key con guion bajo (_)
    const url = 'https://acapulco-api-m9yu.vercel.app/api/eventos?api_key=ak_live_grPNRbnqwFY7JOmFl4o23uTc';
    
    const res = await fetch(url, {
      cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ 
        error: 'API externa respondió con error', 
        detalles: data 
      }, { status: res.status });
    }

    return NextResponse.json(data); // Si todo sale bien, aquí verás los eventos
    
  } catch (error: any) {
    return NextResponse.json({ error: 'Error de conexión', mensaje: error.message }, { status: 500 });
  }
}