'use client'

// imports 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { TextIcon, ImageIcon, VideoIcon } from "lucide-react";
import TextAreaAutosize from "react-textarea-autosize";


export default function GodFlow() {

    const [contentType, setContentType] = useState("text")

    return (
      <div>

        {/* Entire god Flow Component */}
        <div className="flex flex-col gap-4 absolute right-8 top-8 bg-slate-900 rounded-2xl p-4 border border-slate-800 min-w-[500px]">

          {/* content type title // icon selector */}
            <div className="flex items-center justify-between">
              <p className='text-slate-400 text-sm'>Content Type:</p>
              <Tabs defaultValue="text" className="flex">
                  <TabsList className='bg-slate-900 border border-slate-800 rounded-lg px-2 gap-8'>
                    <TabsTrigger 
                      value="text" 
                      className={`${contentType === 'text' ? 'bg-slate-800 border border-slate-700' : ''} cursor-pointer rounded-md px-2 transition-all duration-300`}
                      onClick={() => setContentType('text')}
                    >
                        <TextIcon />
                    </TabsTrigger>
                    <TabsTrigger 
                      value="image" 
                      className={`${contentType === 'image' ? 'bg-slate-800 border border-slate-700' : ''} cursor-pointer rounded-md px-2 transition-all duration-300`}
                      onClick={() => setContentType('image')}
                    >
                        <ImageIcon />
                    </TabsTrigger>
                    <TabsTrigger 
                      value="video" 
                      className={`${contentType === 'video' ? 'bg-slate-800 border border-slate-700' : ''} cursor-pointer rounded-md px-2 transition-all duration-300`}
                      onClick={() => setContentType('video')}
                    >
                        <VideoIcon />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
            </div>

          {/* input box */}
          <TextAreaAutosize
            className="relative resize-none w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-400 focus:outline-none focus:ring focus:ring-indigo-600"
            placeholder="Ex. Write a press release addressing a new product I am releasing in Christmas. Make it fun but formal."
            minRows={16}
            maxRows={16}
          />

          {/* bubble suggestions */}

          {/* settings bar */}

        </div>

      </div>
    );
}