import { NextResponse } from 'next/server';
import { reportCache } from '@/lib/reportCache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const data = reportCache.get(id);
  if (!data) return NextResponse.json({ error: 'Report data not found or expired' }, { status: 404 });

  return NextResponse.json(data);
}
