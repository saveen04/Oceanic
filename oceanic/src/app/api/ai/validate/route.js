import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";

export async function POST(req) {
  try {
    const { text, context } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided for validation" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a Maritime Intelligence Officer. Validate and summarize the following maritime data. Provide a tactical perspective on climate, fisherman lifestyle, and coastal risk. Output in professional, high-fidelity tone. Keep it concise (max 3 sentences)."
        },
        {
          role: "user",
          content: `Data Category: ${context}\n\nContent: ${text}`
        }
      ],
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json({ 
      insight: completion.choices[0]?.message?.content || "No tactical insight generated." 
    });
  } catch (error) {
    console.error("GROQ AI Error:", error);
    return NextResponse.json({ error: "Neural link failure" }, { status: 500 });
  }
}
