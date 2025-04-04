import { useRef, useState } from 'react';
import './App.css';

// API and Types
import { fetchAkkadianTranslation } from './api/translation'; 
import type { TranslationState } from './types';

// UI Components
import { NavBar } from './components/NavBar';
import { TranslationInput } from './features/translation/TranslationInput';
import { TranslationOutput } from './features/translation/TranslationOutput';
import { ActionFooter } from './components/ActionFooter';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"

function App() {
  const [resultBoxState, setResultBoxState] = useState<TranslationState>("prompt");
  const [resultBoxText, setResultBoxText] = useState<string | undefined>(undefined);

  const akkadianTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTranslate = async () => {
    const akkadianText = akkadianTextAreaRef.current?.value;

    if (!akkadianText || akkadianText.trim() === '') {
        toast.warning("Input Required", { description: "Please enter some Akkadian text to translate." });
        setResultBoxState("prompt");
        setResultBoxText(undefined);
        return;
    }

    setResultBoxState('fetching');
    setResultBoxText(undefined);

    try {
      const translation = await fetchAkkadianTranslation(akkadianText);
      setResultBoxText(translation);
      setResultBoxState('answer');
    } catch (error) {
      console.error("Translation failed:", error);
      toast.error("Translation Failed", {
          description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
      setResultBoxState('prompt');
    }
  };

  return (
    <main className='bg-purple-50 w-full fixed h-full flex flex-col'>
      <NavBar />

      <section className='flex-1 grid grid-rows-2 gap-4 p-4 md:gap-8 md:p-8 grid-cols-1 md:grid-cols-2 md:grid-rows-1 overflow-hidden'> {/* Prevent layout shifts */}
          <TranslationInput akkadianTextRef={akkadianTextAreaRef} />

          <TranslationOutput
            resultBoxState={resultBoxState}
            resultBoxText={resultBoxText}
          />
      </section>

      <ActionFooter
          onTranslate={handleTranslate}
          isTranslating={resultBoxState === 'fetching'}
        />

      <Toaster position="top-right" richColors />
    </main>
  );
}

export default App;