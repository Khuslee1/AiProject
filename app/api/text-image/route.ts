export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description) {
      return Response.json(
        { error: "Description is required" },
        { status: 400 },
      );
    }

    const prompt = `high quality food photography: ${description}, professional, detailed`;
    const encodedPrompt = encodeURIComponent(prompt.trim());

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    const imageRes = await fetch(imageUrl);

    if (!imageRes.ok) {
      return new Response("Failed to generate image", { status: 500 });
    } else {
      return new Response(imageRes.body, {
        headers: { "Content-Type": "image/png" },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
