import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://acapulco-api-m9yu.vercel.app/api/eventos?apiKey=ak_live_grPNRbnqwFY7JOmFl4o23uTc', {
      cache: 'no-store'
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Error en la API externa' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    return NextResponse.json({ error: 'Error interno', message: error.message }, { status: 500 });
  }
}