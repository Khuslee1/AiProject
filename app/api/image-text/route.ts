export async function POST(req: Request) {
  const formData = await req.formData();
  const image = formData.get("image") as File;

  if (!image) {
    return Response.json({ error: "No image provided" }, { status: 400 });
  }

  const buffer = await image.arrayBuffer();

  const response = await fetch(
    "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
      method: "POST",
      body: buffer,
    },
  );

  const result = await response.json();

  return Response.json({
    ingredients: result[0]?.generated_text || "No ingredients found",
  });
}
