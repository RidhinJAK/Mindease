import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
const SYSTEM_PROMPT = `You are MindEase, a warm and thoughtful AI mental wellness companion. 
Your personality:
- Calm, empathetic, and genuinely caring
- Like a wise friend who happens to be a therapist
- Never clinical or robotic
- Use natural, conversational language
- You're confident but gentle
How to respond:
- Always validate the user's feelings first
- Keep responses concise (2-4 sentences for the main message)
- After your main response, provide structured cards in JSON format
Response format — ALWAYS respond with valid JSON like this:
{
  "message": "Your main response here. Keep it warm and natural.",
  "cards": [
    {"type": "reflection", "content": "A reflective insight about what they shared"},
    {"type": "insight", "content": "A CBT or psychology-based insight (keep simple)"},
    {"type": "action", "content": "One small, actionable step they can take right now"}
  ]
}
Rules:
- ALWAYS return valid JSON, nothing else
- "message" is required
- "cards" array can have 1-3 cards
- Card types: "reflection", "insight", "action"
- Keep card content to 1-2 sentences each
- Never diagnose or prescribe medication
- If someone is in crisis, encourage them to contact a crisis helpline
- Be encouraging without being dismissive
- Remember: you're a companion, not a replacement for therapy`;
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      // Fallback responses when no API key
      return NextResponse.json({
        message: "I hear you. Whatever you're feeling right now is valid.",
        cards: [
          { type: "reflection", content: "Taking a moment to check in with yourself shows real self-awareness." },
          { type: "action", content: "Try taking three slow, deep breaths right now." },
        ],
      });
    }
    const groq = new Groq({ apiKey });
    const body = await request.json();
    const { messages } = body;
    // Build conversation history
    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });
    const responseText = completion.choices[0]?.message?.content || "";
    try {
      const parsed = JSON.parse(responseText);
      return NextResponse.json({
        message: parsed.message || "I'm here for you.",
        cards: parsed.cards || [],
      });
    } catch {
      // If JSON parsing fails, return raw text as message
      return NextResponse.json({
        message: responseText || "I'm here for you. Tell me more.",
        cards: [],
      });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      message: "I'm having trouble connecting right now. Please try again in a moment.",
      cards: [],
    }, { status: 200 }); // Return 200 so frontend doesn't break
  }
}
