from fastapi import FastAPI, HTTPException, Body
from typing import Dict
import logging

from transformers import AutoModelForSeq2SeqLM, MarianTokenizer
from fastapi.middleware.cors import CORSMiddleware
from config import Settings
from translation import AkkadianTranslator
from search import CDLICorpusSearcher

# Initialize logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load settings from config.py
settings = Settings()

# Initialize FastAPI application
app = FastAPI(title="Akkadian Translation API", version="0.1.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Akkadian translator
try:
    translator = AkkadianTranslator(
        model_checkpoint=settings.model_checkpoint,
        tokenizer_source=settings.tokenizer_source,
        device=settings.device
    )
    logging.info("Akkadian translator initialized successfully.")
except Exception as e:
    logging.error("Error initializing translator: %s", e)
    translator = None  # Mark translator as unavailable

# Initialize the CDLI Corpus Searcher
searcher = CDLICorpusSearcher()

@app.get("/", summary="Read root", description="Returns a default translation for testing.")
async def read_root():
    """
    Returns a default Akkadian translation for the root endpoint.
    """
    if translator is None:
        raise HTTPException(status_code=503, detail="Translation service unavailable.")
    try:
        output = translator.translate(
            "un-gal_-_nibru-ki gaszan_ szur-bu-tu _gaszan_-ia szi-pir szu-a-tu ha-disz lip-pa-lis-ma a-mat _sig5_-ti-ia lisz-szA-kin szap-tusz-szA _tin ud-mesz su-mesz_ sze-bé-e lit-tu-u-tu _dug_-ub _uzu_ u hu-ud lib-bi li-szim szi-ma-a-ti"
        )
        return {"message": output}
    except Exception as e:
        logging.error("Error during default translation: %s", e)
        raise HTTPException(status_code=500, detail=f"Translation error: {e}")

@app.post("/translate/", summary="Translate Akkadian text", description="Receives Akkadian text and returns the English translation.")
async def translate_akkadian(request_body: Dict = Body(..., example={"text": "example akkadian text"})):
    """
    Receives Akkadian text in the request body, splits it into groups of 20 words,
    translates each chunk, and returns the concatenated English translation.
    """
    if translator is None:
        raise HTTPException(status_code=503, detail="Translation service unavailable.")
    try:
        akkadian_text = request_body.get("text")
        if not akkadian_text:
            raise HTTPException(status_code=400, detail="Missing 'text' in the request body")

        # Split the text into words and create chunks of 20 words each
        words = akkadian_text.split()
        chunk_size = 20
        translated_chunks = []
        for i in range(0, len(words), chunk_size):
            chunk = " ".join(words[i:i + chunk_size])
            translation_chunk = translator.translate(chunk)
            translated_chunks.append(translation_chunk)
        
        # Concatenate the translated chunks with a space
        full_translation = " ".join(translated_chunks)
        return {"message": full_translation}
    except HTTPException:
        raise
    except Exception as e:
        logging.error("Translation error for input '%s': %s", akkadian_text, e)
        raise HTTPException(status_code=500, detail=f"Translation error: {e}")

@app.post("/search/", summary="Search CDLI Corpus", description="Searches the CDLI corpus for Akkadian texts with transliteration.")
async def search(request_body: Dict = Body(..., example={"text": "example search term"})):
    """
    Searches the CDLI corpus using the given search term.
    Returns a list of results with image URLs, metadata, and filtered transliteration text.
    """
    search_term = request_body.get("text")
    if not search_term:
        raise HTTPException(status_code=400, detail="Missing 'text' in the request body")
    try:
        results = searcher.search(search_term=search_term)
        return results
    except Exception as e:
        logging.error("Error during corpus search for term '%s': %s", search_term, e)
        raise HTTPException(status_code=500, detail=f"Search error: {e}")

@app.get("/items/{item_id}", summary="Read item", description="Returns an item by its ID.")
async def read_item(item_id: int, q: str = None):
    """
    Returns an item based on its ID and an optional query parameter.
    """
    return {"item_id": item_id, "q": q}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
