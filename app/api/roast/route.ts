import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { profile, intensity, complimentSandwich } = await req.json();

    const safetyNote =
      "IMPORTANT: Do NOT mention race, ethnicity, religion, gender, sexuality, disability, medical conditions, trauma, violence, death, sexual content, or any discriminatory content. Focus only on harmless personal quirks, hobbies, apps, study habits, and career stereotypes.";

    const intensityDescription =
      intensity === "Mild"
        ? "light teasing, gentle and fun — like a friend poking fun"
        : intensity === "Medium"
        ? "sharper and more sarcastic, but still friendly and light-hearted"
        : "bold, savage, and cutting — but still safe, clean, and hilarious";

    const sandwichInstructions = complimentSandwich
      ? 'Also provide "complimentIntro" (a genuine opening compliment) and "complimentOutro" (an uplifting closing compliment) in the JSON.'
      : 'Set "complimentIntro" and "complimentOutro" to empty strings.';

    const profileLines = [
      profile.name ? `Name/Nickname: ${profile.name}` : "",
      profile.occupation ? `Occupation/Major: ${profile.occupation}` : "",
      profile.hobbies ? `Hobbies & Interests: ${profile.hobbies}` : "",
      profile.apps ? `Favorite Apps/Websites: ${profile.apps}` : "",
      profile.habits ? `Common Habits: ${profile.habits}` : "",
      profile.traits ? `Personality Traits: ${profile.traits}` : "",
      profile.embarrassingFact
        ? `Embarrassing Fact: ${profile.embarrassingFact}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `Generate a funny and clever roast for the following profile. Be creative, specific, and use the details provided.

PROFILE:
${profileLines}

INTENSITY: ${intensity} — ${intensityDescription}

REQUIREMENTS:
- Produce exactly 4 punchy roast lines, each a standalone joke.
- Make each line witty, self-deprecating humor style.
- Reference specific details from the profile whenever possible.
- End with one unforgettable mic-drop closing line.
- ${safetyNote}
- ${sandwichInstructions}

Respond ONLY with valid JSON in this exact format:
{
  "roastLines": ["line1", "line2", "line3", "line4"],
  "micDrop": "the mic drop closing line",
  "complimentIntro": "",
  "complimentOutro": ""
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.9,
      max_tokens: 800,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    const data = JSON.parse(content);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Roast API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate roast";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
