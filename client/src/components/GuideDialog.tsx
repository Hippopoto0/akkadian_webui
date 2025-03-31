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
          <DialogDescription>
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
                To find more sentences or explore the original texts, consider visiting the Cuneiform Digital Library Initiative (CDLI) website. Future updates might include direct corpus searching.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}