
import { NextResponse ,NextRequest} from 'next/server';
import { prisma } from '@/lib/prisma'
import { GoogleGenAI } from '@google/genai';


export async function POST(request:NextRequest){
    const{userId,extractedText, reason}=await request.json()

    if(!userId||!extractedText){
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });


    }

    try{
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const gemini = ai.getGenerativeModel({
          model: "gemini-2.5-flash",
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1024,
        });

        const prompt=`Explain this homework problem:\n${extractedText}\nReason: ${reason || 'None'}`;
        const res=await gemini.generateContent(prompt)
        const aiText=res.response.text();

        const task=await prisma.homeworkTask.create({
            data:{
                userId,
                extractedText,
                explanation:aiText,
                aiUsedAt:new Date()
            }
        })
        return NextResponse.json({ success: true, task });
    }

   catch(err){
    console.error(err);
    return NextResponse.json({ 'AI generation failed' }, { status: 500 });
   }

}

