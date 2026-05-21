import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!process.env.XAI_API_KEY) {
      return NextResponse.json({ error: "xAI API key not configured" }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: "https://api.x.ai/v1",
    });

    const response = await openai.chat.completions.create({
      model: "grok-4-latest",
      messages: [
        {
          role: "system",
          content: "You are a coastal hotel expert in India. Return a JSON array of 5 real premium hotels based on the user's query. Each object must have: id, name, location, region, price (in INR), rating (1-5), and a relevant Unsplash image URL. Focus on the Indian coastline. Wrap the result in a 'hotels' key."
        },
        {
          role: "user",
          content: `Find coastal hotels matching: ${query}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content);
    const hotels = content.hotels || content;

    return NextResponse.json({ ok: true, hotels });
  } catch (error) {
    console.error("xAI Search Error:", error);
    const isQuota = error.message?.toLowerCase().includes("quota") || 
                    error.message?.toLowerCase().includes("credits") ||
                    error.message?.toLowerCase().includes("licenses") ||
                    error.status === 429 || error.status === 403;
    
    return NextResponse.json({ 
      ok: false,
      error: isQuota ? "xAI Account Issue" : "xAI Search Failed", 
      details: error.message,
      fallback: true
    }, { status: 200 });
  }
}
