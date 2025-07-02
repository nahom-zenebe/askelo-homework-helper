import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { threadId: string } }) {
  const { threadId } = params;
  const body = await req.json();
  const { userId, content } = body;

  try {
    const message = await prisma.message.create({
      data: {
        threadId,
        userId,
        content,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
