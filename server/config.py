# config.py
from pydantic_settings import BaseSettings
import os
import json

class Settings(BaseSettings):
    """
    Configuration settings for the Akkadian Translation API.
    """
    model_checkpoint: str = "Hippopoto0/akkadian-marianMT"
    tokenizer_source: str = "Helsinki-NLP/opus-mt-ar-en"
    cors_origins: list[str] = ["*"]
    device: str = "cuda" if os.getenv("CUDA_AVAILABLE") else "cpu" # Automatically use CUDA if available

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

        @classmethod
        def customise_sources(
            cls,
            init_settings,
            env_settings,
            file_secret_settings,
        ):
            # Check if CORS_ORIGINS is already set as an environment variable
            cors_origins_env = os.getenv("CORS_ORIGINS")
            if cors_origins_env:
                try:
                    cors_origins_list = json.loads(cors_origins_env)
                    env_settings.cors_origins = cors_origins_list
                except json.JSONDecodeError:
                    print("Warning: Could not parse CORS_ORIGINS environment variable as a JSON list.")
            return (
                init_settings,
                env_settings,
                file_secret_settings,
            )