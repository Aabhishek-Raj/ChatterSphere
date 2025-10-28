import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const followers = await db.profile.findMany({});
  if (!followers) {
    return new NextResponse('No members found', { status: 400 });
  }
  return NextResponse.json(followers);
}
