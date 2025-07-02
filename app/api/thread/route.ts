import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const threads = await prisma.thread.findMany({
      include: {
        author: true,
        messages: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(threads);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch threads' }, { status: 500 });
  }
} 