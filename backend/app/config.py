from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:password@localhost:5432/sentinal_ai"
    gemini_api_key: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
