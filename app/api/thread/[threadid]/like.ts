import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { threadid: string } }) {
  const { threadid } = params;
  const { userId } = await req.json();
  try {
    const like = await prisma.message.create({
      data: { threadId: threadid, userId },
    });
    return NextResponse.json(like);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to like thread' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { threadid: string } }) {
  const { threadid } = params;
  const { userId } = await req.json();
  try {
    await prisma.message.deleteMany({ where: { threadId: threadid, userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to unlike thread' }, { status: 500 });
  }
} 