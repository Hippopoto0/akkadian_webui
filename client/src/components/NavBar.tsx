import { FaLongArrowAltRight } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import { toast } from "sonner";
import englishLogo from "../assets/english_communication.png";
import tabletLogo from "../assets/tablet_shrunk.png";
import { ExampleSentencesDialog } from "../features/akkadian-searching/ExampleSentencesDialog"; // Adjust path

export function NavBar() {
  const handleSearchCorpusClick = () => {
    toast("Search Corpus feature is not available yet.");
  };

  return (
    <nav className='bg-gray-200 flex items-center justify-between gap-2 p-4 border-b border-gray-300'>
      <ExampleSentencesDialog />

      <div className='flex items-center justify-center gap-2'>
        <img src={tabletLogo} alt="Tablet icon" className='w-4 h-4 object-contain' />
        <h1 className='font-bold text-gray-700 text-sm sm:text-base'>Akkadian</h1>
        <FaLongArrowAltRight className='text-gray-800' />
        <h1 className='font-bold text-gray-700 text-sm sm:text-base'>English</h1>
        <img src={englishLogo} alt="English language icon" className='w-4 h-4 object-contain' />
      </div>

       <button
        onClick={handleSearchCorpusClick}
        className='hidden md:inline-flex px-4 py-2 bg-gray-300 rounded-md font-bold items-center text-gray-500 cursor-not-allowed'
        aria-disabled="true"
      >
        Search Corpus
        <IoIosArrowDropdown className='ml-2' />
      </button>
       <div className="md:hidden w-[calc(theme(spacing.4)*2+theme(spacing.2)+8rem)]"></div>
    </nav>
  );
}