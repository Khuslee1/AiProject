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

  const HandleGenerate = async () => {
    setLoading(true);

    try {
      if (!captionref.current) {
        captionref.current = await pipeline(
          "image-classification",
          // "Xenova/vit-gpt2-image-captioning",
          "Xenova/vit-base-patch16-224",
          { device: "webgpu" },
        );
      }

      const captionOutput = await captionref.current(preview);

      console.log(captionOutput, "captionOutput");

      const caption = Array.isArray(captionOutput)
        ? captionOutput.filter((ele) => ele.score > 0.5)?.push()
        : (captionOutput as { generated_text: string })?.generated_text;

      if (!ingredientRef.current) {
        ingredientRef.current = await pipeline(
          "text-generation",
          "HuggingFaceTB/SmolLM2-135M-Instruct",
        );
      }

      const ingredientPrompt = `
      Extract a unique list of ingredients from the following food description.
      Do not repeat ingredients. Return a comma-separated list.

      Description:
      ${caption}
      `;
      const messages = [
        { role: "system", content: "You are helpful assistant" },
        { role: "user", content: ingredientPrompt },
      ];

      const ingredientOutput = await ingredientRef.current(messages, {
        max_new_tokens: 80,
      });

      const ingredients = Array.isArray(ingredientOutput)
        ? ingredientOutput[2]?.content
        : ingredientOutput?.content;

      setResult(ingredients);
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
