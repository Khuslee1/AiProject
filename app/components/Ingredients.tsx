import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BsFileEarmarkText } from "react-icons/bs";
import { IoRefresh } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";
import { pipeline } from "@huggingface/transformers";
import { useRef, useState } from "react";

export const Ingredient = () => {
  const captionref = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const Handlecaptioning = async () => {
    setLoading(true);
    setResult("");
    try {
      if (!captionref.current) {
        captionref.current = await pipeline(
          "text-generation",
          "HuggingFaceTB/SmolLM2-135M-Instruct",
        );
      }

      const prompt = `
You are a helpful assistant that extracts ingredients from food descriptions. 
Read the description below and return a list of unique ingredients. 
Do not include any duplicates. 

Return only the ingredients as a comma-separated list.

Food description:
${preview}
`;
      const messages = [
        { role: "system", content: "You are helpful assistant" },
        { role: "user", content: prompt },
      ];
      const output = await captionref.current(messages, {
        max_new_tokens: 1000,
      });

      const text = Array.isArray(output)
        ? output[0]?.generated_text
        : output.generated_text;

      setResult(text);
      console.log(text);
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
          <h1 className="font-semibold text-xl">Ingredient recognition</h1>
        </div>
        <Button
          size="icon"
          variant={"outline"}
          onClick={() => {
            setPreview("");
            setResult("");
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
              Handlecaptioning();
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
          {/* <div className="text-sm text-[#71717A]">
            First, enter your text to recognize an ingredients.
          </div> */}
          <div
            className={`text-sm ${result ? "text-black" : "text-[#71717A]"} p-2 ${preview && "border border-[#E4E4E7] rounded-md"}`}
          >
            {result && !loading
              ? result
              : loading
                ? "Working..."
                : "First, enter your text to recognize an ingredients."}
          </div>
        </div>
      </div>
    </>
  );
};
