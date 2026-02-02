import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BsFileEarmarkText } from "react-icons/bs";
import { IoRefresh } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";

export const Ingredient = () => {
  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <PiStarFourBold />
          <h1 className="font-semibold text-xl">Ingredient recognition</h1>
        </div>
        <Button size="icon" variant={"outline"}>
          <IoRefresh />
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-[#71717A]">
          Describe the food, and AI will detect the ingredients.
        </div>
        <Textarea />
        <div className="w-full flex justify-end">
          <Button>Generate</Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <BsFileEarmarkText />
            <h1 className="font-semibold text-xl">Identified Ingredients</h1>
          </div>
          <div className="text-sm text-[#71717A]">
            First, enter your text to recognize an ingredients.
          </div>
        </div>
      </div>
    </>
  );
};
