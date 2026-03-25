import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://acapulco-api-m9yu.vercel.app/api/eventos?apiKey=ak_live_grPNRbnqwFY7JOmFl4o23uTc');
  const data = await res.json();

  return NextResponse.json(data);
}