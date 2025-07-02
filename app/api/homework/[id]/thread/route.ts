import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { taskId: string } }) {
  const { taskId } = params;
  const body = await req.json();
  const { userId, title, content } = body;

  try {
    const thread = await prisma.thread.create({
      data: {
        title,
        content,
        authorId: userId,
        task: {
          connect: { id: taskId }
        },
      },
    });

    await prisma.homeworkTask.update({
      where: { id: taskId },
      data: { threadId: thread.id },
    });

    return NextResponse.json(thread);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { taskId: string } }) {
  const { taskId } = params;

  try {
    const task = await prisma.homeworkTask.findUnique({
      where: { id: taskId },
      include: {
        thread: {
          include: {
            messages: {
              include: {
                user: true,
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (!task?.thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    return NextResponse.json(task.thread);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch thread' }, { status: 500 });
  }
}
