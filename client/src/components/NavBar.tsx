import { useState } from "react";
import { FaLongArrowAltRight, FaBars, FaTimes } from "react-icons/fa";
import englishLogo from "../assets/english_communication.png";
import tabletLogo from "../assets/tablet_shrunk.png";
import { ExampleSentencesDialog } from "../features/akkadian-examples/ExampleSentencesDialog";
import { SearchCorpusDialog } from "@/features/akkadian-searching/SearchCorpusDialog";

export function NavBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="bg-gray-200 flex items-center justify-between p-4 border-b border-gray-300 relative z-30">
        <div className="hidden md:flex w-full items-center justify-between">
          <div>
            <ExampleSentencesDialog />
          </div>
          {/* Center: Language Info */}
          <div className="flex items-center gap-2 -translate-x-0 md:-translate-x-7">
            <img
              src={tabletLogo}
              alt="Tablet icon"
              className="w-4 h-4 object-contain"
            />
            <h1 className="font-bold text-gray-700 text-sm sm:text-base">
              Akkadian
            </h1>
            <FaLongArrowAltRight className="text-gray-800" />
            <h1 className="font-bold text-gray-700 text-sm sm:text-base">
              English
            </h1>
            <img
              src={englishLogo}
              alt="English language icon"
              className="w-4 h-4 object-contain"
            />
          </div>
          {/* Right Side: Search Corpus */}
          <div>
            <SearchCorpusDialog />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={tabletLogo}
              alt="Tablet icon"
              className="w-4 h-4 object-contain"
            />
            <h1 className="font-bold text-gray-700 text-sm sm:text-base">
              Akkadian
            </h1>
            <FaLongArrowAltRight className="text-gray-800" />
            <h1 className="font-bold text-gray-700 text-sm sm:text-base">
              English
            </h1>
            <img
              src={englishLogo}
              alt="English language icon"
              className="w-4 h-4 object-contain"
            />
          </div>
          <button onClick={toggleSidebar} aria-label="Open sidebar">
            <FaBars className="text-gray-800 w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Translucent Backdrop with fade transition */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/40 z-20 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Mobile Sidebar (using absolute positioning) */}
      <div
        className={`md:hidden absolute top-0 left-0 h-full w-64 p-4 bg-gray-100 border-r border-gray-300 transform transition-transform duration-300 z-30 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end">
          <button onClick={toggleSidebar} aria-label="Close sidebar">
            <FaTimes className="text-gray-800 w-6 h-6" />
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <ExampleSentencesDialog />
          <SearchCorpusDialog />
        </div>
      </div>
    </>
  );
}
