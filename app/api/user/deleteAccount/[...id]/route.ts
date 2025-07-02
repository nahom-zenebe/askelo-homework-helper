import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function DELETE(request:NextRequest,{params}:{params:{id:string}}){

    try{
        const {id}=params;

        if(!id){
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id },
          });
      
          return NextResponse.json({ success: true, message: `User ${id} deleted` });
    }
    catch(error){
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }

}



export async function PUT(request:NextRequest,{params}:{params:{id:string}}){

    try{
        const {id}=params;

        if(!id){
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const {name,email}=await request.json();

        if(!name||!email){
            return NextResponse.json({ error: 'Missing name or info' }, { status: 400 });
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
              name,
              email,
            },
          });
          return NextResponse.json({
            success: true,
            message: `User ${id} updated`,
            data: updatedUser,
          });
    }
    catch(error){
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }

}