import { useRef, useState } from 'react'
import './App.css'
import { FaLongArrowAltRight } from "react-icons/fa";
import englishLogo from "./assets/english_communication.png"
import tabletLogo from "./assets/tablet_shrunk.png"
import sentences from "./assets/sentences.json"

import { IoSend } from "react-icons/io5";


import { AnimatePresence, motion } from "motion/react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { IoIosArrowDropdown } from "react-icons/io";

import { ScrollArea } from "@/components/ui/scroll-area"
import { MdOutlineContentCopy } from "react-icons/md";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Skeleton } from './components/ui/skeleton';

function App() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [resultBoxState, setResultBoxState] = useState<"prompt"|"fetching"|"answer">("prompt")
  const [resultBoxText, setResultBoxText] = useState<string>()
  const akkadianTextArea = useRef<HTMLTextAreaElement>(null);

  async function fetchTranslation() {
    let fetchAkkadianURL = import.meta.env.VITE_AKKADIAN_URL
    let akkadianText = akkadianTextArea.current!.value;
    setResultBoxState('fetching')
    try {
        const response = await fetch(fetchAkkadianURL, { // Use the URL from .env
          method: 'POST', // Change to POST request
          headers: {
            'Content-Type': 'application/json', // Specify that we're sending JSON data
          },
          body: JSON.stringify({ text: akkadianText }), // Send the Akkadian text in the request body
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching translation:", errorData);
          setResultBoxState("prompt");
          return;
        }

        let data = await response.json(); // Wait for the JSON data
        console.log(data);
        // Assuming your backend returns the translation in the 'message' field
        // You might need to adjust this based on your backend's response structure
        // For example, if the translation is directly in 'data', you'd use data
        if (data && data.message) {
          // Update your UI with the translated text (assuming you have a state or variable for this)
          // Example: setTranslationResult(data.message);
          setResultBoxState("answer");
          setResultBoxText(data.message);
        } else {
          console.error("Unexpected response structure:", data);
          setResultBoxState("prompt");
        }
      } catch (error) {
        setResultBoxState("prompt");
        console.error("Error fetching translation:", error);
      }
  }

  return <main className='bg-purple-500 w-full h-screen flex flex-col'>
    <nav className='bg-gray-200 flex items-center justify-between gap-2 p-4'>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger className='cursor-pointer '>
          <button className='cursor-pointer px-4 py-2 bg-gray-300 rounded-md font-bold inline-flex items-center'>
            Example Sentences
            <IoIosArrowDropdown className='ml-2' />
          </button>
        </DialogTrigger>
        <DialogContent className='bg-gray-50 w-70rem'>
          <DialogHeader>
            <DialogTitle>Search through some example sentences, copy them and put them in the translator!</DialogTitle>
            <DialogDescription>
                <ScrollArea className=" h-[20rem] rounded-md p-4">
                  {sentences.map((akkEnPair) => 
                    <>
                    <AkkadianSentence text={akkEnPair.akk} />
                    <div className='w-full h-[1px] bg-black/40 mt-2'></div>
                  </>
                  )}
                </ScrollArea>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className=' flex items-center justify-center gap-2'>
        <img src={tabletLogo} alt="" className='w-4' />
        <h1 className='font-bold text-gray-700'>Akkadian</h1>
        <FaLongArrowAltRight className='text-gray-800' />
        <h1 className='font-bold text-gray-700'>English</h1>
        <img src={englishLogo} alt="" className='w-4' />
      </div>
      {/* <div className='w-36 h-10'></div> */}
        <button 
        onClick={() => toast("Not available yet.")}
        className='hidden md:inline-flex px-4 py-2 bg-gray-300 rounded-md font-bold items-center text-gray-500'>
          Search Corpus
          <IoIosArrowDropdown className='ml-2'  />
        </button>
    </nav>
    <section className='flex-1 grid grid-rows-2 gap-4 p-4 md:gap-8 md:p-8 grid-cols-1 md:grid-cols-2 md:grid-rows-1 '>
      <div className=' flex items-center justify-center ' >
        <div className=' bg-gray-200 w-full h-full rounded-2xl p-4 shadow-lg shadow-black/20'>
          <textarea ref={akkadianTextArea} placeholder='Enter Akkadian Text' name="inp" id="" className='w-full h-full resize-none outline-0'></textarea>
        </div>
      </div>
      <div className=' flex items-center justify-center  ' >
        <div className=' bg-gray-200 w-full h-full rounded-2xl p-4 shadow-lg shadow-black/20'>
          {/* <TranslationSkeleton /> */}
          <AnimatePresence>
            <>
              { resultBoxState == "prompt" && <h1 className='text-gray-400 italic'>Translation will go here</h1>}
              { resultBoxState == "fetching" && <TranslationSkeleton />}
              { resultBoxState == "answer" && <h1 className='text-gray-600'>{resultBoxText}</h1>}
            </>
          </AnimatePresence>
        </div>
      </div>
    </section>
    <section className='bg-gray-200 flex items-center justify-between p-4'>
      {/* <a href="#">Guide</a> */}
        <Dialog>
          <DialogTrigger className='cursor-pointer w-20 h-10 rounded-lg font-bold bg-gray-300 inline-flex items-center justify-center'>Guide</DialogTrigger>
          <DialogContent className='bg-white'>
            <DialogHeader>
              <DialogTitle>Guide</DialogTitle>
              <DialogDescription>
                  <p>
                  If you hit Example Sentences, a pop-up will appear with a bunch of transliterated Akkadian Sentences.
                  </p>
                  <p>
                  Either manually copy or click the copy button to copy the sentence to your clipboard, paste it into to the input and translate!
                  </p>
                  <p>
                  If you want to find different sentences, I'd recommend at this time going to the CDLI website, and searching through the corpus.
                  I want to add a tool that searches through and gives images too, but that will take time a double-check over licensing, this is a demo host. 
                  </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      <button className={`bg-purple-600 text-white inline-flex items-center font-bold
        px-4 py-3 rounded-lg cursor-pointer shadow-purple-900 
        transition-all
        shadow-[0rem_0.5rem_0rem]
        hover:shadow-[0rem_0.4rem_0rem]
        hover:translate-y-[0.1rem]
        active:shadow-[0rem_0rem_0rem]
        active:translate-y-[0.5rem]
        `}
        
        onClick={() => fetchTranslation()}
        >
          Translate 
          <IoSend className='text-white w-4 ml-2' />

        </button>
        <Dialog>
          <DialogTrigger className='cursor-pointer w-20 h-10 rounded-lg font-bold bg-gray-300 inline-flex items-center justify-center'>About</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>

              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
    </section>
    <Toaster />
  </main>
}

function AkkadianSentence({text}: {text: string}) {
  return <div className='grid grid-cols-[auto_2rem] '>
    <h1 className=' font-bold text-sm'>{text}</h1>
    <button className='flex items-center' onClick={() => {toast("Copied!"); copyToClipboard(text)}}>
      <MdOutlineContentCopy className='ml-auto' size={20} />
    </button>
  </div>
}

function TranslationSkeleton() {

  return <motion.div 
        className='flex flex-col gap-2'
        initial={{ translateY: 20, opacity: 0}}
        animate={{ translateY: 0, opacity: 1}}
        exit={{ translateY: 20, opacity: 0}}
        transition={{ ease: 'easeInOut', staggerChildren: 0.3}}
        >
        <Skeleton className="h-[1.5rem] w-[30%] rounded-xl bg-gray-400" />
        <Skeleton className="h-[1.5rem] w-[40%] rounded-xl bg-gray-400" />
        <Skeleton className="h-[1.5rem] w-[80%] rounded-xl bg-gray-400" />
        <Skeleton className="h-[1.5rem] w-[60%] rounded-xl bg-gray-400" />
        <Skeleton className="h-[1.5rem] w-[20%] rounded-xl bg-gray-400" />
      </motion.div>
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard successfully!');
    return true; // Indicate success
  } catch (err) {
    console.error('Failed to copy text to clipboard: ', err);
    return false; // Indicate failure
  }
}

export default App
