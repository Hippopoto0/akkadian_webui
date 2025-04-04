import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IoIosArrowDropdown } from "react-icons/io";
import { AkkadianSentence } from "./AkkadianSentence";
import type { SentencePair } from "@/types";
import sentencesData from "@/assets/sentences.json";

const isValidSentenceData = (data: any): data is SentencePair[] => {
  return Array.isArray(data) && data.every(item => typeof item?.akk === 'string');
};

const sentences: SentencePair[] = isValidSentenceData(sentencesData) ? sentencesData : [];
if (!isValidSentenceData(sentencesData)) {
    console.warn("Sentences data is not in the expected format:", sentencesData);
}


export function ExampleSentencesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='cursor-pointer px-4 py-2 bg-gray-300 rounded-md font-bold inline-flex items-center text-gray-800 hover:bg-gray-400 transition-colors'>
          Example Sentences
          <IoIosArrowDropdown className='ml-2' />
        </button>
      </DialogTrigger>
      <DialogContent className='bg-gray-50 w-full max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Example Akkadian Sentences</DialogTitle>
          <DialogDescription asChild>
             <div>
                <p className="mb-4 text-sm text-gray-600">Click the copy icon to copy a sentence, then paste it into the translator.</p>
                <ScrollArea className="h-[60vh] max-h-[400px] rounded-md border p-4 bg-white">
                {sentences.length > 0 ? (
                    sentences.map((akkEnPair, index) => (
                    <div key={index}>
                        <AkkadianSentence text={akkEnPair.akk} />
                        {index < sentences.length - 1 && ( /* Don't add divider after last item */
                         <div className='w-full h-[1px] bg-black/20 my-2'></div>
                        )}
                    </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No example sentences loaded.</p>
                )}
                </ScrollArea>
             </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}