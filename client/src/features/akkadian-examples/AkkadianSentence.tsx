import { MdOutlineContentCopy } from "react-icons/md";
import { copyToClipboard } from "@/lib/clipboard"; 

interface AkkadianSentenceProps {
  text: string;
}

export function AkkadianSentence({ text }: AkkadianSentenceProps) {
  const handleCopy = () => {
    copyToClipboard(text); 
  };

  return (
    <div className='grid grid-cols-[1fr_auto] items-center gap-2 py-1'>
      <p className='font-medium text-sm text-gray-700 break-words max-h-52 overflow-y-auto'>{text}</p>
      <button
        className='flex items-center justify-center p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 -translate-x-1 focus:ring-purple-500 cursor-pointer'
        onClick={handleCopy}
        aria-label="Copy sentence"
      >
        <MdOutlineContentCopy className='text-gray-600' size={18} />
      </button>
    </div>
  );
}