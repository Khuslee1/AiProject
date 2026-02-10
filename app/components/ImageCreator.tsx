"use client";

import { useState } from "react";
import Image from "next/image";
import { PiStarFourBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { IoRefresh } from "react-icons/io5";
import { FileImage } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function ImageCreator() {
  const [description, setDescription] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    if (!description) return;

    setLoading(true);
    setGeneratedImage("");
    setError("");

    try {
      const response = await fetch("/api/text-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setGeneratedImage(data.image);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <PiStarFourBold />
          <h1 className="font-semibold text-xl">Food image creator</h1>
        </div>
        <Button
          size="icon"
          variant={"outline"}
          onClick={() => {
            setDescription("");
            setGeneratedImage("");
            setError("");
          }}
        >
          <IoRefresh />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-[#71717A]">
          What food image do you want? Describe it briefly.
        </div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-lg "
          rows={4}
          placeholder="Хоолны тайлбар"
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="w-full flex justify-end">
          <Button
            onClick={generateImage}
            disabled={!description || loading}
            className="px-6 py-3 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Image"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <FileImage />
            <h1 className="font-semibold text-xl">Result</h1>
          </div>

          {loading && (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-gray-500">Generating your food image...</div>
            </div>
          )}

          {generatedImage && !loading && (
            <div className="border rounded-lg p-4 bg-white">
              <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={generatedImage}
                  alt="Generated food"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              {/* <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = generatedImage;
                  link.download = "generated-food.png";
                  link.click();
                }}
                variant="outline"
                className="mt-3 w-full"
              >
                Download Image
              </Button> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
