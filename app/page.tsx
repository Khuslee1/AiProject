"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "./components/Header";
import { ImageAnalysis } from "./components/ImageAnalysis";
import { Ingredient } from "./components/Ingredients";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoChatbubbleOutline, IoCloseOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { BsSend } from "react-icons/bs";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ImageCreator from "./components/ImageCreator";

export default function Home() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  console.log({ messages });

  const [input, setInput] = useState<string>("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
  return (
    <div className="flex flex-col gap-5 items-center relative h-screen">
      <Header />
      <Tabs defaultValue="Image analysis" className="w-145 gap-6">
        <TabsList>
          <TabsTrigger value="Image analysis">Image analysis</TabsTrigger>
          <TabsTrigger value="Ingredient recognition">
            Ingredient recognition
          </TabsTrigger>
          <TabsTrigger value="Image creator">Image creator</TabsTrigger>
        </TabsList>
        <TabsContent value="Image analysis" className="flex flex-col gap-2">
          <ImageAnalysis />
        </TabsContent>
        <TabsContent value="Ingredient recognition">
          <Ingredient />
        </TabsContent>
        <TabsContent value="Image creator">
          <ImageCreator />
        </TabsContent>
      </Tabs>
      <Dialog modal={false}>
        <DialogTrigger asChild>
          <Button className="rounded-full fixed bottom-10 right-10">
            <IoChatbubbleOutline />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="border border-[#E4E4E7] w-95 p-0 gap-0 top-[77%] left-[90%] shadow-sm "
          showCloseButton={false}
        >
          <DialogHeader className="border border-[#E4E4E7] py-2 px-4 rounded-t-lg">
            <DialogTitle className="flex justify-between items-center">
              Chat assistant{" "}
              <DialogClose asChild>
                <Button size={"icon"} variant={"outline"}>
                  {" "}
                  <IoCloseOutline />
                </Button>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-92 border border-[#E4E4E7] overflow-scroll flex flex-col gap-3 px-4 py-3">
            <div>
              <div
                className={`flex rounded-[10px] w-fit py-px px-2 text-sm  text-black bg-[#F4F4F5CC] justify-self-end`}
              >
                Hello, how can I help you today?
              </div>
            </div>
            {messages.map((message, index) => (
              <div key={index}>
                {message.parts.map((part) => {
                  if (part.type === "text") {
                    return (
                      <div
                        className={`rounded-[10px] w-fit py-px px-2 text-sm flex ${message.role == "assistant" ? "text-black bg-[#F4F4F5CC] justify-self-end" : "text-white bg-black"}`}
                        key={`${message.id}-text`}
                      >
                        {part.text}
                      </div>
                    );
                  }
                })}
              </div>
            ))}
            <div ref={bottomRef} />
          </ScrollArea>
          <DialogFooter className="border border-[#E4E4E7] py-2 px-4 rounded-b-lg">
            <Input
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              onKeyDown={async (event) => {
                if (event.key === "Enter") {
                  sendMessage({
                    parts: [{ type: "text", text: input }],
                  });
                  setInput("");
                }
              }}
            />
            <Button
              size={"icon"}
              className="rounded-full"
              onClick={() => {
                sendMessage({
                  parts: [{ type: "text", text: input }],
                });
                setInput("");
              }}
            >
              <BsSend />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
