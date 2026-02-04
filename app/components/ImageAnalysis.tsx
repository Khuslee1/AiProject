"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BsFileEarmarkText } from "react-icons/bs";
import { IoRefresh } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";
import { RiDeleteBin7Line } from "react-icons/ri";

export const ImageAnalysis = () => {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <PiStarFourBold />
          <h1 className="font-semibold text-xl">Image analysis</h1>
        </div>
        <Button size="icon" variant={"outline"}>
          <IoRefresh />
        </Button>
      </div>
      <div className="text-sm text-[#71717A]">
        Upload a food photo, and AI will detect the ingredients.
      </div>
      <Input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setPreview(URL.createObjectURL(file));
          }
        }}
      />
      <div className="w-full flex justify-end">
        <Button>Generate</Button>
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
          <div className="text-sm text-[#71717A]">
            Upload a food photo, and AI will detect the ingredients.
          </div>
        </div>
      </div>
    </>
  );
};
