import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormEvent, useState, useRef } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { SearchItemThumbnail } from "./SearchItemThumbnail";
import { SearchResults } from "@/types";

export function SearchCorpusDialog() {
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isFormFocused, setIsFormFocused] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleFormFocus = () => {
        setIsFormFocused(true);
    };

    const handleFormBlur = () => {
        setIsFormFocused(false);
    };

    async function submitSearch(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setSearchResults(null);
        setError(null);

        const form = e.currentTarget as HTMLFormElement;
        const inputElement = form.elements.namedItem('cdli-search') as HTMLInputElement | null;
        const searchTerm = inputElement?.value;

        if (searchTerm) {
            try {
                let searchURL = import.meta.env.VITE_CDLI_SEARCH_URL
                const response = await fetch(searchURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: searchTerm }),
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
                }

                const data: SearchResults = await response.json();
                console.log(data);
                setSearchResults(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            setError("Please enter a search term.");
        }
    }

    const dialogContentClass = `bg-gray-50 w-full max-w-2xl transition-transform duration-200 ${isFormFocused && (!searchResults || searchResults.length === 0) ? '-translate-y-52' : ''}`;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className='cursor-pointer px-4 py-2 bg-gray-300 rounded-md font-bold inline-flex items-center text-gray-800 hover:bg-gray-400 transition-colors'>
                    Search Corpus
                    <IoIosArrowDropdown className='ml-2' />
                </button>
            </DialogTrigger>
            <DialogContent className={dialogContentClass} aria-describedby="Dialog showing search options">
                <DialogHeader>
                    <DialogTitle>Search the CDLI Corpus</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <form
                                ref={formRef}
                                onSubmit={submitSearch}
                                method="post"
                                autoComplete="off"
                                className="w-full h-12 flex flex-row items-center justify-between border-1 rounded-md p-2"
                                onFocus={handleFormFocus}
                                onBlur={handleFormBlur}
                            >
                                <input type="text" name="cdli-search" id="" placeholder="Search (cyrus, gilgamesh etc.)" className="flex-1 outline-0 h-10 text-md sm:text-lg w-32 md:w-auto" />
                                <button type="submit" className="bg-purple-500 text-white font-bold px-3 py-2 rounded-md ml-auto hover:bg-purple-600 active:bg-purple-700 whitespace-nowrap overflow-hidden cursor-pointer">Search CDLI</button>
                            </form>
                            {loading && (
                                <div className=" w-full flex items-center justify-center mt-4">
                                    <div className="loader scale-75 w-10"></div>
                                </div>
                            )}
                            {error && (
                                <div className="mt-2 text-red-500">
                                    Error: {error}
                                </div>
                            )}
                            {(searchResults && searchResults.length > 0) && (
                                <ScrollArea className="h-[60vh] max-h-[400px] rounded-md border p-4 mt-2 bg-white">
                                    {searchResults.map((searchResult, index) => ( // Added index for key
                                        <SearchItemThumbnail key={index} searchResult={searchResult} />
                                    ))}
                                </ScrollArea>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}