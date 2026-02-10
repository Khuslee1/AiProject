// export async function POST(req: Request) {
//   try {
//     const { description } = await req.json();

//     if (!description) {
//       return Response.json(
//         { error: "Description is required" },
//         { status: 400 },
//       );
//     }

//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//         },
//         method: "POST",
//         body: JSON.stringify({
//           inputs: `professional food photography, high quality, detailed: ${description}`,
//         }),
//       },
//     );

//     console.log("Response status:", response.status);
//     const contentType = response.headers.get("content-type");
//     console.log("Content-Type:", contentType);

//     if (contentType?.includes("application/json")) {
//       const json = await response.json();
//       console.log("JSON response:", json);

//       if (json.error) {
//         if (json.estimated_time) {
//           return Response.json(
//             {
//               error: "Model is loading",
//               estimated_time: Math.ceil(json.estimated_time),
//             },
//             { status: 503 },
//           );
//         }
//         return Response.json({ error: json.error }, { status: 500 });
//       }
//     }

//     if (!response.ok) {
//       return Response.json(
//         { error: `Failed with status ${response.status}` },
//         { status: response.status },
//       );
//     }
//     const arrayBuffer = await response.arrayBuffer();

//     if (arrayBuffer.byteLength === 0) {
//       return Response.json(
//         { error: "Empty response from API" },
//         { status: 500 },
//       );
//     }

//     const base64 = Buffer.from(arrayBuffer).toString("base64");

//     return Response.json({
//       image: `data:image/png;base64,${base64}`,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return Response.json(
//       {
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     );
//   }
// }
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
    const encodedPrompt = encodeURIComponent(prompt);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${Date.now()}`;

    return Response.json({
      image: imageUrl,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
