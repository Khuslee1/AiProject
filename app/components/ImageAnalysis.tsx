"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { BsFileEarmarkText } from "react-icons/bs";
import { IoRefresh } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";
import { RiDeleteBin7Line } from "react-icons/ri";
import { pipeline } from "@huggingface/transformers";

export const ImageAnalysis = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const captionref = useRef<any>(null);
  const ingredientRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const processIngredients = (text: string): string => {
    const rawIngredients = text.split(",") ?? [];

    const uniqueIngredients: string[] = [
      ...new Set(rawIngredients.map((item) => item.trim()).filter(Boolean)),
    ];

    return uniqueIngredients.join(", ");
  };

  const HandleGenerate = async () => {
    setLoading(true);

    try {
      if (!captionref.current) {
        captionref.current = await pipeline(
          "image-classification",
          "Xenova/vit-base-patch16-224",
        );
      }

      const captionOutput: { label: string; score: number }[] =
        await captionref.current(preview);

      console.log(captionOutput, "captionOutput");

      const caption = captionOutput
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);

      if (!ingredientRef.current) {
        ingredientRef.current = await pipeline(
          "text2text-generation",
          "Xenova/flan-t5-base",
        );
      }

      const ingredientPrompt = `
 Extract only the food ingredients from this text as a comma-separated list. Only list ingredient names, nothing else. Text:
          ${caption.map((ele: { label: string; score: number }) => ele.label)}
          `;

      const ingredientOutput = await ingredientRef.current(ingredientPrompt, {
        max_new_tokens: 200,
      });

      const ingredients = Array.isArray(ingredientOutput)
        ? ingredientOutput[0]?.generated_text
        : ingredientOutput?.generated_text;

      setResult(processIngredients(ingredients));
      console.log(ingredients);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <PiStarFourBold />
          <h1 className="font-semibold text-xl">Image analysis</h1>
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
      <div className="text-sm text-[#71717A]">
        Upload a food photo, and AI will detect the ingredients.
      </div>
      <Input
        type="file"
        placeholder="JPG or PNG"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setPreview(URL.createObjectURL(file));
          }
        }}
      />
      <div className="w-full flex justify-end">
        <Button onClick={() => HandleGenerate()}>Generate</Button>
      </div>
      {preview && (
        <div className="relative w-40 h-40">
          <img
            src={preview}
            alt="preview"
            className="w-40 h-40 object-cover rounded-lg"
          />
          <Button
            size="icon"
            variant={"outline"}
            className="absolute bottom-2 right-2"
            onClick={() => {
              setPreview(null);
              setResult(null);
            }}
          >
            <RiDeleteBin7Line />
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <BsFileEarmarkText />
            <h1 className="font-semibold text-xl">Here is the summary</h1>
          </div>
          <div
            className={`text-sm ${result ? "text-black" : "text-[#71717A]"} p-2 ${preview && "border border-[#E4E4E7] rounded-md"}`}
          >
            {result && !loading
              ? result
              : loading
                ? "Working..."
                : "Upload a food photo, and AI will detect the ingredients."}
          </div>
        </div>
      </div>
    </>
  );
};
