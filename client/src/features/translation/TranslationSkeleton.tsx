import { motion } from "motion/react";
import { Skeleton } from '@/components/ui/skeleton';

export function TranslationSkeleton() {
  return (
    <motion.div
      className='flex flex-col gap-2'
      initial={{ translateY: 20, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      exit={{ translateY: 20, opacity: 0 }}
      transition={{ ease: 'easeInOut', staggerChildren: 0.1 }}
    >
      <Skeleton className="h-[1.5rem] w-[30%] rounded-xl bg-gray-400" />
      <Skeleton className="h-[1.5rem] w-[40%] rounded-xl bg-gray-400" />
      <Skeleton className="h-[1.5rem] w-[80%] rounded-xl bg-gray-400" />
      <Skeleton className="h-[1.5rem] w-[60%] rounded-xl bg-gray-400" />
      <Skeleton className="h-[1.5rem] w-[20%] rounded-xl bg-gray-400" />
    </motion.div>
  );
}