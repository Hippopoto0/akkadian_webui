// src/components/ExampleSentencesDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"; // Adjust path
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormEvent, useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { AkkadianSentence } from "../akkadian-examples/AkkadianSentence";

interface Metadata {
  title: string;
  artifact_link: string;
  'Witness to composite(s)': string;
  'Primary Publication': string;
  Collection: string;
  'Museum no.': string;
  Provenience: string;
  Period: string;
  'Object Type': string;
  Material: string;
  Date: string;
}

interface SearchResult {
  image_url: string;
  metadata: Metadata;
  transliteration: string[];
}

type SearchResults = SearchResult[];

export function SearchCorpusDialog() {
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    async function submitSearch(e: FormEvent) {
        e.preventDefault(); // Prevent default form submission
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

                const data = await response.json();
                console.log(data)
                setSearchResults(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            // Optionally set an error if the search term is empty
            setError("Please enter a search term.");
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className='cursor-pointer px-4 py-2 bg-gray-300 rounded-md font-bold inline-flex items-center text-gray-800 hover:bg-gray-400 transition-colors'>
                    Search Corpus
                    <IoIosArrowDropdown className='ml-2' />
                </button>
            </DialogTrigger>
            <DialogContent className='bg-gray-50 w-full max-w-2xl'> {/* Responsive width */}
                <DialogHeader>
                    <DialogTitle>Search the CDLI Corpus</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <form onSubmit={submitSearch} method="post" className="w-full h-12 flex flex-row items-center justify-between border-1 rounded-md p-2">
                                <input type="text" name="cdli-search" id="" className="flex-1 outline-0 h-10 text-xl" />
                                <button type="submit" className="bg-purple-500 text-white font-bold px-3 py-2 rounded-md ml-auto hover:bg-purple-600 active:bg-purple-700">Search CDLI</button>
                            </form>
                            {loading && (
                                <div className="mt-2 text-center">
                                    Loading...
                                </div>
                            )}
                            {error && (
                                <div className="mt-2 text-red-500">
                                    Error: {error}
                                </div>
                            )}
                            {searchResults && (
                            <ScrollArea className="h-[60vh] max-h-[400px] rounded-md border p-4 mt-2 bg-white"> {/* Added border & bg */}
                                {searchResults.map((searchResult: SearchResult, _: number) => ( // Added index for key
                                    <SearchItemThumbnail searchResult={searchResult} />
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

function SearchItemThumbnail({ searchResult }: { searchResult: SearchResult}) {
    const [isItemDialogOpen, setItemDialogOpen] = useState(false)

    return <div className="w-full h-40 border-1 rounded-lg mt-2 flex flex-row items-center">
        <div className="flex-1 flex flex-col p-2">
            <h1 className=" text-md font-bold">{searchResult.metadata.title}</h1>
            <h2>{searchResult.metadata.Period}</h2>
            <h2 className="bold text-gray-500">{searchResult.metadata.Material}</h2>
            <Dialog open={isItemDialogOpen} onOpenChange={setItemDialogOpen}>
                <DialogTrigger asChild>
                    <button className=" bg-purple-500 px-2 py-2 rounded-md text-white font-bold">View {searchResult.transliteration.length} text sections</button>
                </DialogTrigger>
                <DialogContent className="bg-gray-50 w-full max-w-2xl">
                    <DialogTitle>
                        <div className=" flex flex-row items-center justify-between">
                            <div>
                                <h1>
                                    {searchResult.metadata.title.split("(P")[0]}
                                </h1>
                                <h2 className="text-gray-600 text-sm mt-1">
                                    {searchResult.metadata.Period}
                                </h2>
                            </div>
                            <div className="w-20 h-20 overflow-hidden mr-4">
                                <img className=" object-cover" src={searchResult.image_url} alt={"image of " + searchResult.metadata.title} />
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <>
                            <p>This was fetched from the CDLI project, you can find this object 
                                {" "}<span>
                                    <a href={searchResult.metadata.artifact_link} target="_blank" className="text-blue-400">here</a>
                                </span>
                            </p>
                            {/* <p>
                                This tablet has {searchResult.transliteration.length} different sections, sometimes this corresponds to different sides of the tablet (obverse, reverse), sometimes a section happens from broken lines.
                            </p>
                            <p>
                                The scraping isn't perfect, but was done in such away to group together text that should flow, and therefore give decent translations
                            </p> */}

                            <ScrollArea className="h-[60vh] max-h-[400px] rounded-md border p-4 mt-2 bg-white"> {/* Added border & bg */}
                                {searchResult.transliteration.map((text) =>
                                    <AkkadianSentence text={text} />
                                )}
                            </ScrollArea>
                        </>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
        <div className="  w-40 h-full p-2 overflow-hidden">
            <img src={searchResult.image_url} alt={ "image of " + searchResult.metadata.title} className="object-cover"  />
        </div>
    </div>
}