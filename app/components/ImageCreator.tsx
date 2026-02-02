import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FiImage } from "react-icons/fi";
import { IoRefresh } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";

export const ImageCreator = () => {
  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <PiStarFourBold />
          <h1 className="font-semibold text-xl">Food image creator</h1>
        </div>
        <Button size="icon" variant={"outline"}>
          <IoRefresh />
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-[#71717A]">
          What food image do you want? Describe it briefly.
        </div>
        <Textarea />
        <div className="w-full flex justify-end">
          <Button>Generate</Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <FiImage />
            <h1 className="font-semibold text-xl">Result</h1>
          </div>
          <div className="text-sm text-[#71717A]">
            First, enter your text to generate an image.
          </div>
        </div>
      </div>
    </>
  );
};
