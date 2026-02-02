import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BsFileEarmarkText } from "react-icons/bs";
import { IoRefresh } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";

export const ImageAnalysis = () => {
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
      <Input />
      <div className="w-full flex justify-end">
        <Button>Generate</Button>
      </div>
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
