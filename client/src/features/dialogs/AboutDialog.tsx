import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AboutDialog() {
  return (
    <Dialog>
       <DialogTrigger asChild>
            <button className='w-20 h-10 rounded-lg font-bold bg-gray-300 inline-flex items-center justify-center text-gray-800 hover:bg-gray-400 transition-colors cursor-pointer'>
                About
            </button>
       </DialogTrigger>
      <DialogContent className='bg-white'>
        <DialogHeader>
          <DialogTitle>About This Translator</DialogTitle>
          <DialogDescription asChild>
             <ScrollArea className="space-y-3 text-gray-700 max-h-64 relative">
                <p>
                    This tool provides a translator from transliterated Akkadian to English. Made by Daniel Jones.
                </p>
                <p>
                  This was made as part of my Dissertation, evaluating different transformer models in their ability to translate Akkadian. This model is trained from MarianMT, it's small so I can run it on a cheap server.
                </p>
                <p>
                    Accuracy may vary, and it's intended as a helpful aid rather than a definitive scholarly resource.
                </p>
                <p>
                    The example sentences are sourced from the CDLI publicly available corpora.
                </p>
                <p>
                  Due to the model being lightweight, it only translates ~20 words at a time, and context is lost outside that window, because of this translations can seem jarring, but you can usually gather the jist.
                </p>
                <p className="text-xs text-gray-500 pt-2">Version: Demo</p>

                <div className="h-10"></div>
                <div className="absolute bottom-0 w-full h-10 bg-gradient-to-b from-transparent to-white"></div>
             </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}