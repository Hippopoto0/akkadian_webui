// src/components/TranslationInput.tsx
import React from 'react';

interface TranslationInputProps {
  akkadianTextRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function TranslationInput({ akkadianTextRef }: TranslationInputProps) {
  return (
    <div className='flex items-center justify-center h-full'> {/* Ensure parent controls height */}
      <div className='bg-gray-100 w-full h-full rounded-xl p-4 shadow-inner border border-gray-300'> {/* Adjusted style */}
        <textarea
          ref={akkadianTextRef}
          placeholder='Enter transliterated Akkadian text here...' // More descriptive placeholder
          name="akkadian-input"
          id="akkadian-input"
          className='w-full h-full resize-none outline-none bg-transparent text-gray-800 text-lg leading-relaxed' // Style adjustments
          aria-label="Akkadian input text area" // Accessibility
        />
      </div>
    </div>
  );
}