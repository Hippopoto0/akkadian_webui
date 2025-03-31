import React, { useState } from 'react';
import { FaRegPaste } from "react-icons/fa6";
import { MdClear } from "react-icons/md";

interface TranslationInputProps {
  akkadianTextRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function TranslationInput({ akkadianTextRef }: TranslationInputProps) {
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const currentText = akkadianTextRef.current?.value || '';
      // Append clipboard text and enforce 1000 characters max.
      const combinedText = (currentText + clipboardText).slice(0, 1000);
      if (akkadianTextRef.current) {
        akkadianTextRef.current.value = combinedText;
        setCharCount(combinedText.length);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents:', err);
    }
  };

  const handleClear = () => {
    if (akkadianTextRef.current) {
      akkadianTextRef.current.value = '';
      setCharCount(0);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-gray-100 w-full h-full rounded-xl p-4 shadow-inner border border-gray-300 flex flex-col">
        <textarea
          ref={akkadianTextRef}
          placeholder="Enter transliterated Akkadian text here..."
          name="akkadian-input"
          id="akkadian-input"
          maxLength={1000}
          onChange={handleTextChange}
          className="w-full flex-grow resize-none outline-none bg-transparent text-gray-800 text-lg leading-relaxed"
          aria-label="Akkadian input text area"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600">{charCount}/1000</span>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handlePaste}
              className="p-2 rounded hover:bg-blue-100"
              aria-label="Paste"
            >
              {/* Clipboard icon */}
              <FaRegPaste className='text-gray-500 size-5' />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded hover:bg-red-100"
              aria-label="Clear"
            >
              {/* Clear icon */}
              <MdClear className='text-gray-500 size-6' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
