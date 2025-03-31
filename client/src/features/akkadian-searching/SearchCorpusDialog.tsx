// src/components/ExampleSentencesDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Adjust path
import { IoIosArrowDropdown } from "react-icons/io";


export function SearchCorpusDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='cursor-pointer px-4 py-2 bg-gray-300 rounded-md font-bold inline-flex items-center text-gray-800 hover:bg-gray-400 transition-colors'>
          Search Corpus
          <IoIosArrowDropdown className='ml-2' />
        </button>
      </DialogTrigger>
      <DialogContent className='bg-gray-50 w-full max-w-2xl'> {/* Responsive width */}
        <DialogHeader>
          <DialogTitle>Search the CDLI Corpus</DialogTitle>
          <DialogDescription asChild>
             <div> {/* Add a wrapping div if needed */}
                {/* <p className="mb-4 text-sm text-gray-600">Click the copy icon to copy a sentence, then paste it into the translator.</p>
                <ScrollArea className="h-[60vh] max-h-[400px] rounded-md border p-4 bg-white">
                {sentences.length > 0 ? (
                    sentences.map((akkEnPair, index) => (
                    <div key={index}>
                    </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No example sentences loaded.</p>
                )}
                </ScrollArea> */}
             </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}