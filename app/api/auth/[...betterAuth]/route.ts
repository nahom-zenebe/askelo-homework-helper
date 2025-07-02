import { auth } from "@/app/lib/auth"; 
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
 
export const { POST, GET } = toNextJsHandler(auth);

// Debug: log errors for social login
export async function middleware(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log("[AUTH POST] Request body:", body);
    } catch (e) {
      console.log("[AUTH POST] Could not parse body");
    }
  }
  return NextResponse.next();
}