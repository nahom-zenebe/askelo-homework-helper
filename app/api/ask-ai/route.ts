import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { userId, extractedText = "", reason = "" } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const inputText = extractedText.trim() || reason.trim();
  if (!inputText) {
    return NextResponse.json({ error: "No input provided to AI" }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Explain the following:\n${extractedText}\n\nAdditional context or reason: ${reason || "None"}`;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
    });

    const aiText = result.response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, no response generated.";

    const task = await prisma.homeworkTask.create({
      data: {
        userId,
        extractedText: extractedText || reason, // Save at least one input
        explanation: aiText,
        aiUsedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, task });
  } catch (err) {
    console.error("AI generation error:", err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
