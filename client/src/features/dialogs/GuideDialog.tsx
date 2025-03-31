// src/components/GuideDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Adjust path

export function GuideDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='w-20 h-10 rounded-lg font-bold bg-gray-300 inline-flex items-center justify-center text-gray-800 hover:bg-gray-400 transition-colors'>
            Guide
        </button>
      </DialogTrigger>
      <DialogContent className='bg-white'>
        <DialogHeader>
          <DialogTitle>How to Use the Translator</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 text-gray-700"> {/* Add spacing and consistent text color */}
              <p>
                Click <span className="font-semibold">Example Sentences</span> to view a list of transliterated Akkadian sentences.
              </p>
              <p>
                Use the copy icon (<span className="inline-block align-middle mx-1">📄</span>) next to a sentence to copy it to your clipboard.
              </p>
               <p>
                Paste the copied sentence (or type your own transliterated Akkadian) into the left input box.
              </p>
               <p>
                Click the <span className="font-semibold text-purple-600">Translate</span> button. The English translation will appear in the right box.
              </p>
              <p>
                To find more sentences or explore the original texts, consider visiting the Cuneiform Digital Library Initiative (CDLI) website. <span className=" line-through text-gray-500"> Future updates might include direct corpus searching. </span> <span className=" text-green-600">Corpus search has been added!</span> Go to <span className=" font-semibold">Search Corpus</span> and type in a search term, this can be a ruler, place name, story etc.
              </p>
              <p>
                The server scrapes the CDLI page with that term (for Akkadian with transliteration only), then cleans the text to remove translations/metadata. It splits the text into different parts. For example, a tablet might have a front(obverse) and back(reverse) side, or might have broken lines. This splitting to a decent extent ensures the input is a continuous passage.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}