// src/components/AboutDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Adjust path

export function AboutDialog() {
  return (
    <Dialog>
       <DialogTrigger asChild>
            <button className='w-20 h-10 rounded-lg font-bold bg-gray-300 inline-flex items-center justify-center text-gray-800 hover:bg-gray-400 transition-colors'>
                About
            </button>
       </DialogTrigger>
      <DialogContent className='bg-white'>
        <DialogHeader>
          <DialogTitle>About This Translator</DialogTitle>
          <DialogDescription asChild>
             <div className="space-y-3 text-gray-700">
                <p>
                    This tool provides a translator from transliterated Akkadian to English.
                </p>
                <p>
                  This was made as part of my Dissertation, evaluating different transformer models in their ability to translate Akkadian. This model is trained from MarianMT, and was one of the top performers.
                </p>
                <p>
                    Accuracy may vary, and it's intended as a helpful aid rather than a definitive scholarly resource.
                </p>
                <p>
                    The example sentences are sourced from publicly available corpora.
                </p>
                 {/* Add more details: version, acknowledgements, links, etc. */}
                <p className="text-xs text-gray-500 pt-2">Version: Demo</p>
             </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}