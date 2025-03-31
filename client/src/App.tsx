// src/App.tsx
import { useRef, useState } from 'react';
import './App.css'; // Keep global styles if needed

// API and Types
import { fetchAkkadianTranslation } from './api/translation'; // Adjust path
import type { TranslationState } from './types'; // Adjust path

// UI Components
import { NavBar } from './components/NavBar'; // Adjust path
import { TranslationInput } from './features/translation/TranslationInput'; // Adjust path
import { TranslationOutput } from './features/translation/TranslationOutput'; // Adjust path
import { ActionFooter } from './components/ActionFooter'; // Adjust path
import { Toaster } from "@/components/ui/sonner"; // Adjust path
import { toast } from "sonner"

function App() {
  const [resultBoxState, setResultBoxState] = useState<TranslationState>("prompt");
  const [resultBoxText, setResultBoxText] = useState<string | undefined>(undefined);

  const akkadianTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTranslate = async () => {
    const akkadianText = akkadianTextAreaRef.current?.value;

    if (!akkadianText || akkadianText.trim() === '') {
        toast.warning("Input Required", { description: "Please enter some Akkadian text to translate." });
        setResultBoxState("prompt"); // Reset state if it was fetching/answered
        setResultBoxText(undefined);
        return;
    }

    setResultBoxState('fetching');
    setResultBoxText(undefined); // Clear previous results

    try {
      const translation = await fetchAkkadianTranslation(akkadianText);
      setResultBoxText(translation);
      setResultBoxState('answer');
    } catch (error) {
      console.error("Translation failed:", error);
      // Show user-friendly error message
      toast.error("Translation Failed", {
          description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
      setResultBoxState('prompt'); // Reset to prompt state on error
    }
  };

  // --- Render ---
  return (
    <main className='bg-purple-50 w-full fixed h-full flex flex-col'> {/* Lighter background? */}
      <NavBar />

      <section className='flex-1 grid grid-rows-2 gap-4 p-4 md:gap-8 md:p-8 grid-cols-1 md:grid-cols-2 md:grid-rows-1 overflow-hidden'> {/* Prevent layout shifts */}
          {/* Input Area */}
          <TranslationInput akkadianTextRef={akkadianTextAreaRef} />

          {/* Output Area */}
          <TranslationOutput
            resultBoxState={resultBoxState}
            resultBoxText={resultBoxText}
          />
      </section>

      <ActionFooter
          onTranslate={handleTranslate}
          isTranslating={resultBoxState === 'fetching'}
        />

      <Toaster position="top-right" richColors /> {/* Configure Toaster */}
    </main>
  );
}

export default App;