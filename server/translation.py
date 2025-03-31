# translation.py
from transformers import AutoModelForSeq2SeqLM, MarianTokenizer
import torch
import logging

class AkkadianTranslator:
    """
    A class for translating Akkadian text to English using a MarianMT model.
    """
    def __init__(self, model_checkpoint: str, tokenizer_source: str, device: str = "cpu"):
        """
        Initializes the AkkadianTranslator.

        Args:
            model_checkpoint (str): The checkpoint for the Akkadian MarianMT model.
            tokenizer_source (str): The source for the Marian tokenizer (e.g., Arabic-to-English).
            device (str): The device to use for the model (e.g., "cuda" or "cpu").
        """
        self.device = device
        logging.info(f"Loading model from checkpoint: {model_checkpoint}")
        try:
            self.model = AutoModelForSeq2SeqLM.from_pretrained(model_checkpoint).to(self.device)
            logging.info(f"Model loaded to {self.device}.")
        except Exception as e:
            logging.error(f"Error loading model: {e}")
            raise

        logging.info(f"Loading tokenizer from source: {tokenizer_source}")
        try:
            self.tokenizer = MarianTokenizer.from_pretrained(tokenizer_source)
            logging.info("Tokenizer loaded.")
        except Exception as e:
            logging.error(f"Error loading tokenizer: {e}")
            raise

    def translate(self, akkadian_text: str) -> str:
        """
        Translates Akkadian text to English.

        Args:
            akkadian_text (str): The Akkadian text to translate.

        Returns:
            str: The English translation of the Akkadian text.
        """
        try:
            full_prompt = ">>en<<" + akkadian_text
            inputs = self.tokenizer(
                full_prompt,
                max_length=128,
                truncation=True,
                return_tensors="pt"
            ).to(self.device)

            with torch.no_grad():
                generated_tokens = self.model.generate(
                    **inputs,
                    max_length=128
                )
            predicted_translation = self.tokenizer.decode(generated_tokens[0], skip_special_tokens=True)
            return predicted_translation
        except Exception as e:
            logging.error(f"Translation failed for text '{akkadian_text}': {e}")
            raise