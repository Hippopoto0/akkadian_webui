// src/components/ActionFooter.tsx
import { IoSend } from "react-icons/io5";
import { GuideDialog } from "./GuideDialog"; // Adjust path
import { AboutDialog } from "./AboutDialog"; // Adjust path

interface ActionFooterProps {
  onTranslate: () => void;
  isTranslating: boolean; // To disable button during fetch
}

export function ActionFooter({ onTranslate, isTranslating }: ActionFooterProps) {
  return (
    <section className='bg-gray-200 flex items-center justify-between p-4 border-t border-gray-300'> {/* Added border */}
      <GuideDialog />

      <button
        className={`bg-purple-600 text-white inline-flex items-center font-bold
          px-4 py-3 rounded-lg cursor-pointer shadow-purple-900
          transition-all
          shadow-[0rem_0.5rem_0rem]
          hover:shadow-[0rem_0.4rem_0rem]
          hover:translate-y-[0.1rem]
          active:shadow-[0rem_0rem_0rem]
          active:translate-y-[0.5rem]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-[0rem_0.5rem_0rem] disabled:translate-y-0`} // Disabled styles
        onClick={onTranslate}
        disabled={isTranslating} // Disable when fetching
      >
        {isTranslating ? 'Translating...' : 'Translate'}
        {!isTranslating && <IoSend className='text-white w-4 ml-2' />}
      </button>

      <AboutDialog />
    </section>
  );
}