import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest, { params }: { params: { id: string | string[] } }) {
  try {
    // Ensure id is a string
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Delete related records to avoid foreign key constraint errors
    await prisma.verification.deleteMany({ where: { userId: id } });
    await prisma.homeworkTask.deleteMany({ where: { userId: id } });

    // Now delete the user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string | string[] } }) {
  try {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, email } = body;

    // Only update fields that are provided
    const updateData: { name?: string; email?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}