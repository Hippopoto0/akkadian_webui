import { AnimatePresence, motion } from "motion/react";
import type { TranslationState } from "@/types";
import { TranslationSkeleton } from "./TranslationSkeleton";

interface TranslationOutputProps {
  resultBoxState: TranslationState;
  resultBoxText: string | undefined;
}

export function TranslationOutput({ resultBoxState, resultBoxText }: TranslationOutputProps) {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='bg-gray-100 w-full h-full rounded-xl p-4 shadow-inner border border-gray-300 overflow-y-auto'> {/* Adjusted style, added scroll */}
         <AnimatePresence mode="wait">
            {resultBoxState === 'prompt' && (
                 <motion.p
                    key="prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='text-gray-400 italic text-lg'
                  >
                   Translation will appear here.
                 </motion.p>
            )}
            {resultBoxState === 'fetching' && (
                 <motion.div key="fetching">
                     <TranslationSkeleton />
                 </motion.div>
            )}
            {resultBoxState === 'answer' && (
                <motion.p
                    key="answer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='text-gray-700 text-lg leading-relaxed whitespace-pre-wrap'
                 >
                   {resultBoxText || "Translation result is empty."}
                </motion.p>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}