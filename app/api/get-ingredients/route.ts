import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  const { preview }: { preview: string } = await req.json();

  if (!preview) {
    return new Response(JSON.stringify({ error: "Description is required" }), {
      status: 400,
    });
  }

  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    system:
      "You are a helpful assistant that extracts ingredients from food descriptions. Return only a comma-separated list of unique ingredients.",
    prompt: preview,
  });

  console.log("Result:", result.text);

  return new Response(
    JSON.stringify({
      ingredients: result.text,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
