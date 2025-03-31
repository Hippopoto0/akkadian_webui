# main.py
from fastapi import FastAPI, HTTPException, Body
from typing import Dict

from transformers import AutoModelForSeq2SeqLM, MarianTokenizer
from fastapi.middleware.cors import CORSMiddleware
import logging
from config import Settings
from translation import AkkadianTranslator
from search import search_corpus

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
    logging.error(f"Error initializing translator: {e}")
    # It's crucial to handle initialization errors, potentially by exiting or setting a flag
    translator = None  # Ensure translator is None if initialization fails


@app.get("/", summary="Read root", description="Returns a default translation for testing.")
async def read_root():
    """
    Returns a default Akkadian translation for the root endpoint.
    """
    if translator is None:
        raise HTTPException(status_code=503, detail="Translation service unavailable.")
    try:
        output = translator.translate("un-gal_-_nibru-ki gaszan_ szur-bu-tu _gaszan_-ia szi-pir szu-a-tu ha-disz lip-pa-lis-ma a-mat _sig5_-ti-ia lisz-szA-kin szap-tusz-szA _tin ud-mesz su-mesz_ sze-bé-e lit-tu-u-tu _dug_-ub _uzu_ u hu-ud lib-bi li-szim szi-ma-a-ti")
        return {"message": output}
    except Exception as e:
        logging.error(f"Error during default translation: {e}")
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

@app.post("/translate/", summary="Translate Akkadian text", description="Receives Akkadian text and returns the English translation.")
# async def translate_akkadian(request_body: Dict = Body(..., example={"text": "example akkadian text"})):
#     """
#     Receives Akkadian text in the request body and returns the English translation.
#     """
#     if translator is None:
#         raise HTTPException(status_code=503, detail="Translation service unavailable.")
#     try:
#         akkadian_text = request_body.get("text")
#         if not akkadian_text:
#             raise HTTPException(status_code=400, detail="Missing 'text' in the request body")

#         translation_output = translator.translate(akkadian_text)
#         return {"message": translation_output}
#     except HTTPException:
#         raise
#     except Exception as e:
#         logging.error(f"Translation error for input '{akkadian_text}': {e}")
#         raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")
async def translate_akkadian(request_body: Dict = Body(..., example={"text": "example akkadian text"})):
    """
    Receives Akkadian text in the request body and returns the English translation.
    The text is split into groups of 20 words to improve translation performance.
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
            chunk = " ".join(words[i:i+chunk_size])
            translation_chunk = translator.translate(chunk)
            translated_chunks.append(translation_chunk)
        
        # Concatenate the translated chunks with a space
        full_translation = " ".join(translated_chunks)
        return {"message": full_translation}
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Translation error for input '{akkadian_text}': {e}")
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")


@app.post("/search/")
async def search(request_body: Dict = Body(..., example={"text": "example search term"})):
    search_term = request_body.get("text")

    res = search_corpus(search_term=search_term)
    print(res)
    return res

@app.get("/items/{item_id}", summary="Read item", description="Returns an item by its ID.")
async def read_item(item_id: int, q: str = None):
    """
    Returns an item based on its ID and an optional query parameter.
    """
    return {"item_id": item_id, "q": q}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)