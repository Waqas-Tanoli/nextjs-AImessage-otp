import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by ' || '. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    const result = await streamText({
      model: openai("gpt-4o"),
      system:
        "You are a helpful assistant that generates creative, engaging, and inclusive questions for an anonymous messaging app.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
        ...(messages || []),
      ],
      maxTokens: 400,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
