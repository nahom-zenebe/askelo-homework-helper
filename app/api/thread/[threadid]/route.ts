import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { threadid: string } }) {
  const { threadid } = params;
  const body = await req.json();
  const { title, content } = body;

  try {
    const thread = await prisma.thread.update({
      where: { id: threadid },
      data: { title, content },
    });
    return NextResponse.json(thread);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update thread' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { threadid: string } }) {
  const { threadid } = params;
  try {
    await prisma.thread.delete({ where: { id: threadid } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete thread' }, { status: 500 });
  }
} 