import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  console.log("OpenAI key exists:", !!process.env.GROQ_API_KEY);

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: "You are a helpful assistant.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
