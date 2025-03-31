// src/components/TranslationOutput.tsx
import { AnimatePresence, motion } from "motion/react"; // Assuming framer-motion or similar
import type { TranslationState } from "@/types"; // Adjust path
import { TranslationSkeleton } from "./TranslationSkeleton"; // Adjust path

interface TranslationOutputProps {
  resultBoxState: TranslationState;
  resultBoxText: string | undefined;
}

export function TranslationOutput({ resultBoxState, resultBoxText }: TranslationOutputProps) {
  return (
    <div className='flex items-center justify-center h-full'> {/* Ensure parent controls height */}
      <div className='bg-gray-100 w-full h-full rounded-xl p-4 shadow-inner border border-gray-300 overflow-y-auto'> {/* Adjusted style, added scroll */}
        {/* AnimatePresence requires direct children to have a key and support motion props */}
         <AnimatePresence mode="wait"> {/* Use mode="wait" for smoother transitions */}
            {resultBoxState === 'prompt' && (
                 <motion.p // Use motion component for animation
                    key="prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='text-gray-400 italic text-lg' // Style adjustments
                  >
                   Translation will appear here.
                 </motion.p>
            )}
            {resultBoxState === 'fetching' && (
                 <motion.div key="fetching"> {/* Wrap skeleton for key and motion */}
                     <TranslationSkeleton />
                 </motion.div>
            )}
            {resultBoxState === 'answer' && (
                <motion.p // Use motion component for animation
                    key="answer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='text-gray-700 text-lg leading-relaxed whitespace-pre-wrap' // Style adjustments, preserve whitespace
                 >
                   {resultBoxText || "Translation result is empty."} {/* Handle potentially empty result */}
                </motion.p>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}