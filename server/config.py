# config.py
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    """
    Configuration settings for the Akkadian Translation API.
    """
    model_checkpoint: str = "Hippopoto0/akkadian-marianMT"
    tokenizer_source: str = "Helsinki-NLP/opus-mt-ar-en"
    cors_origins: list[str] = ["*"]
    device: str = "cuda" if os.getenv("CUDA_AVAILABLE") else "cpu" # Automatically use CUDA if available

    class Config:
        env_file = ".env" # Load environment variables from .env file