import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { SearchResult } from "@/types";
import { AkkadianSentence } from "../akkadian-examples/AkkadianSentence";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface SearchItemThumbnailProps {
    searchResult: SearchResult;
}

export function SearchItemThumbnail({ searchResult }: SearchItemThumbnailProps) {
    const [isItemDialogOpen, setItemDialogOpen] = useState(false);

    return (
        <div className="w-full h-40 border-1 rounded-lg mt-2 flex flex-row items-center">
            <div className="flex-1 flex flex-col p-2 items-start justify-evenly h-full text-left">
                <h1 className=" text-md font-bold">{searchResult.metadata.title}</h1>
                <h2 className=" text-xs">{searchResult.metadata.Period}</h2>
                <h2 className="bold text-gray-500 hidden md:flex">{searchResult.metadata.Material}</h2>
                <Dialog open={isItemDialogOpen} onOpenChange={setItemDialogOpen}>
                    <DialogTrigger asChild>
                        <button className=" bg-purple-500 px-2 py-2 rounded-md text-white font-bold">View {searchResult.transliteration.length} text sections</button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-50 w-full max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                <SearchResultTitle title={searchResult.metadata.title} period={searchResult.metadata.Period} imageUrl={searchResult.image_url} />
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription asChild>
                            <SearchResultDetails searchResult={searchResult} />
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="w-20 md:w-40 h-full p-2 overflow-hidden">
                <img src={searchResult.image_url} alt={"image of " + searchResult.metadata.title} className="object-cover" />
            </div>
        </div>
    );
}

interface SearchResultTitleProps {
    title: string;
    period: string;
    imageUrl: string;
}

function SearchResultTitle({ title, period, imageUrl }: SearchResultTitleProps) {
    return (
        <div className=" flex flex-row items-center justify-between">
            <div>
                <h1>
                    {title.split("(P")[0]}
                </h1>
                <h2 className="text-gray-600 text-sm mt-1">
                    {period}
                </h2>
            </div>
            <div className="w-20 h-20 overflow-hidden mr-4">
                <img className=" object-cover" src={imageUrl} alt={"image of " + title} />
            </div>
        </div>
    );
}

function SearchResultDetails({ searchResult }: {searchResult: SearchResult}) {

    return (
        <>
            <p>This was fetched from the CDLI project, you can find this object
                {" "}<span>
                    <a href={searchResult.metadata.artifact_link} target="_blank" className="text-blue-400">here</a>
                </span>
            </p>
            <ScrollArea className="h-[60vh] max-h-[400px] rounded-md border p-4 mt-2 gap-4 bg-white">
                {searchResult.transliteration.map((text, index) => (
                    <div key={index}>
                        <AkkadianSentence text={text} />
                        <div className="h-[1px] bg-gray-300 my-2"></div>
                    </div>
                ))}
            </ScrollArea>
        </>
    );
}