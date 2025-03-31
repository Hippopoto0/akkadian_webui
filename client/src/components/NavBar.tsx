// src/components/NavBar.tsx
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import { toast } from "sonner";
import englishLogo from "../assets/english_communication.png"; // Adjust path
import tabletLogo from "../assets/tablet_shrunk.png"; // Adjust path
import { ExampleSentencesDialog } from "./ExampleSentencesDialog"; // Adjust path

export function NavBar() {
  const handleSearchCorpusClick = () => {
    toast("Search Corpus feature is not available yet.");
  };

  return (
    <nav className='bg-gray-200 flex items-center justify-between gap-2 p-4 border-b border-gray-300'> {/* Added border */}
      <ExampleSentencesDialog />

      <div className='flex items-center justify-center gap-2'>
        <img src={tabletLogo} alt="Tablet icon" className='w-4 h-4 object-contain' /> {/* Added h-4, alt text */}
        <h1 className='font-bold text-gray-700 text-sm sm:text-base'>Akkadian</h1> {/* Responsive text */}
        <FaLongArrowAltRight className='text-gray-800' />
        <h1 className='font-bold text-gray-700 text-sm sm:text-base'>English</h1> {/* Responsive text */}
        <img src={englishLogo} alt="English language icon" className='w-4 h-4 object-contain' /> {/* Added h-4, alt text */}
      </div>

      {/* Placeholder or actual component for Search Corpus */}
       <button
        onClick={handleSearchCorpusClick}
        className='hidden md:inline-flex px-4 py-2 bg-gray-300 rounded-md font-bold items-center text-gray-500 cursor-not-allowed' // Indicate disabled state
        aria-disabled="true" // Accessibility
      >
        Search Corpus
        <IoIosArrowDropdown className='ml-2' />
      </button>
       {/* Mobile placeholder to balance layout if needed */}
       <div className="md:hidden w-[calc(theme(spacing.4)*2+theme(spacing.2)+8rem)]"></div> {/* Adjust width to match Example Sentences button approx */}
    </nav>
  );
}