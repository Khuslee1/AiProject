"use clients";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BsFileEarmarkText } from "react-icons/bs";
import { IoRefresh } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";
import { pipeline } from "@huggingface/transformers";
import { useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export const Ingredient = () => {
  const captionref = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const processIngredients = (text: string): string => {
    const rawIngredients = text.split(",") ?? [];

    const uniqueIngredients: string[] = [
      ...new Set(rawIngredients.map((item) => item.trim()).filter(Boolean)),
    ];

    return uniqueIngredients.join(", ");
  };

  const Handlecaptioning = async () => {
    setLoading(true);
    setResult("");
    try {
      if (!captionref.current) {
        captionref.current = await pipeline(
          "text2text-generation",
          "Xenova/flan-t5-base",
        );
      }
      const prompt = `Extract only the food ingredients from this text as a comma-separated list. Only list ingredient names, nothing else. Text: ${preview} Ingredients:`;
      const output = await captionref.current(`${prompt}`, {
        max_new_tokens: 100,
      });

      const text = Array.isArray(output)
        ? output[0]?.generated_text
        : output.generated_text;

      try {
        setResult(processIngredients(text));
        console.log(text);
      } catch {
        console.error("Failed to parse ingredients", text);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  //   const { messages, sendMessage } = useChat({
  //   transport: new DefaultChatTransport({
  //     api: "/api/chat",
  //   }),
  // });
  const handleSubmit = async (preview: string | null) => {
    setLoading(true);

    try {
      const response = await fetch("/api/get-ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preview }),
      });

      const data = await response.json();
      console.log("Full response:", data);
      if (data.ingredients) {
        setResult(data.ingredients);
      } else {
        console.error("No ingredients in response");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <PiStarFourBold />
          <h1 className="font-semibold text-xl">Ingredient recognition</h1>
        </div>
        <Button
          size="icon"
          variant={"outline"}
          onClick={() => {
            setPreview(null);
            setResult(null);
          }}
        >
          <IoRefresh />
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-[#71717A]">
          Describe the food, and AI will detect the ingredients.
        </div>
        <Textarea
          placeholder="Орц тодорхойлох"
          onChange={(e) => {
            setPreview(e.target.value);
          }}
        />
        <div className="w-full flex justify-end">
          <Button
            onClick={() => {
              handleSubmit(preview);
            }}
          >
            Generate
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <BsFileEarmarkText />
            <h1 className="font-semibold text-xl">Identified Ingredients</h1>
          </div>
          <div
            className={`text-sm ${result ? "text-black" : "text-[#71717A]"} p-2 ${preview && "border border-[#E4E4E7] rounded-md"} whitespace-pre-line`}
          >
            {result && !loading
              ? `Here are the ingredients:\n${result.split(",").join("\n")}`
              : loading
                ? "Working..."
                : "First, enter your text to recognize an ingredients."}
          </div>
        </div>
      </div>
    </>
  );
};
