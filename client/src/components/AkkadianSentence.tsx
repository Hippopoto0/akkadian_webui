// src/components/AkkadianSentence.tsx
import { MdOutlineContentCopy } from "react-icons/md";
import { copyToClipboard } from "@/lib/clipboard"; // Adjust path

interface AkkadianSentenceProps {
  text: string;
}

export function AkkadianSentence({ text }: AkkadianSentenceProps) {
  const handleCopy = () => {
    copyToClipboard(text); // Feedback is handled within copyToClipboard
  };

  return (
    <div className='grid grid-cols-[1fr_auto] items-center gap-2 py-1'> {/* Use 1fr for text */}
      <p className='font-medium text-sm text-gray-700 break-words'>{text}</p> {/* Use p, adjust font */}
      <button
        className='flex items-center justify-center p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500'
        onClick={handleCopy}
        aria-label="Copy sentence" // Accessibility
      >
        <MdOutlineContentCopy className='text-gray-600' size={18} /> {/* Slightly smaller icon */}
      </button>
    </div>
  );
}