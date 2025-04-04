import React, { useState } from 'react';
import { FaRegPaste } from "react-icons/fa6";
import { MdClear } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Switch } from '@/components/ui/switch';
import { translitToCuneiform } from '@/lib/transliteration/tranlitToCuneiform';


interface TranslationInputProps {
  akkadianTextRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function TranslationInput({ akkadianTextRef }: TranslationInputProps) {
  const [charCount, setCharCount] = useState(0);
  const [isShowCuneiformChecked, setShowCuneiformChecked] = useState<boolean>(false)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    setShowCuneiformChecked(false)
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      
      if (clipboardText == "") toast("Clipboard is empty.")

      const currentText = akkadianTextRef.current?.value || '';
      const combinedText = (currentText + clipboardText).slice(0, 1000);
      if (akkadianTextRef.current) {
        akkadianTextRef.current.value = combinedText;
        setCharCount(combinedText.length);
        setShowCuneiformChecked(true)
      }
    } catch (err) {
      console.error('Failed to read clipboard contents:', err);
    }
  };

  const handleClear = () => {
    if (akkadianTextRef.current) {
      akkadianTextRef.current.value = '';
      setCharCount(0);
      setShowCuneiformChecked(false)
    }
  };

  const handleSwitch = () => {
    if (isShowCuneiformChecked) {
      setShowCuneiformChecked(false)
    } else {
      if (akkadianTextRef.current && akkadianTextRef.current.value == "") {
        toast.warning("Put some text in before switching to Cuneiform view.", { description: "Go to Search Corpus and find some!"})
      } else {
        setShowCuneiformChecked(true)
      }
    }
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-gray-100 w-full h-full rounded-xl p-4 shadow-inner border border-gray-300 flex flex-col">
        <div className='w-full flex-grow relative' id='container-cuneiform-latin-textareas'>
          <textarea
            ref={akkadianTextRef}
            placeholder="Enter transliterated Akkadian text here..."
            name="akkadian-input"
            id="akkadian-input"
            maxLength={1000}
            onChange={handleTextChange}
            className="absolute w-full h-full resize-none outline-none bg-transparent text-gray-800 text-lg leading-relaxed"
            aria-label="Akkadian input text area"
          />
          {/* show cuneiform translation if switch is checked */}
          {isShowCuneiformChecked &&
            <div className='absolute w-full h-full bg-gray-100 overflow-auto text-gray-800'>
              {translitToCuneiform(akkadianTextRef.current?.value)}
            </div>
          }
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className='flex items-center justify-center gap-4'>
            <span className="text-sm text-gray-400 font-bold w-16">{charCount}/1000</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                    <Switch checked={isShowCuneiformChecked} onClick={() => handleSwitch()} className='bg-gray-300 scale-125' />
                </TooltipTrigger>
                <TooltipContent className='border-1 -translate-y-1 bg-gray-100'>
                  <p>Show Cuneiform</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="relative" style={{ width: '3rem', height: '2rem' }}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    type="button"
                    onClick={handlePaste}
                    className="p-2 rounded hover:bg-blue-100 absolute bottom-[0.075rem]"
                    aria-label="Paste"
                    // When clear is present, shift left by 30px, else at x: 0.
                    animate={charCount > 0 ? { x: -30 } : { x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaRegPaste className="text-gray-500 text-2xl" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent className='border-1 -translate-y-1 bg-gray-100'>
                  <p>Paste</p>
                </TooltipContent>
              </Tooltip>
                  <AnimatePresence>
                    {charCount > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                      <motion.button
                        key="clear-button"
                        type="button"
                        onClick={handleClear}
                        className="p-2 rounded hover:bg-red-100 absolute right-0 bottom-[0.075rem]"
                        aria-label="Clear"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <MdClear className="text-gray-500 text-2xl" />
                      </motion.button>
                      </TooltipTrigger>
                      <TooltipContent className='border-1 -translate-y-1 bg-gray-100'>
                        <p>Clear</p>
                      </TooltipContent>
                    </Tooltip>
                    )}
                  </AnimatePresence>

            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
