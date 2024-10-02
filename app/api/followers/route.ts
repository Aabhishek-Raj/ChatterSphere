import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('hsi');
  const followers = await db.profile.findMany({});
  console.log(followers);
  if (!followers) {
    return new NextResponse('No members found', { status: 400 });
  }
  return NextResponse.json(followers);
}
