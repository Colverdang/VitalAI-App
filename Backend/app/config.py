"""
Application configuration using pydantic-settings.

Clean modern settings for MySQL or SQLite fallback.
Everything loads from environment variables if provided, otherwise uses defaults.
"""

from functools import lru_cache
from pydantic import Field, validator
from pydantic_settings import BaseSettings
from typing import List
from urllib.parse import urlparse


class Settings(BaseSettings):
    # ---------------------------------------------------------
    # GENERAL APP SETTINGS
    # ---------------------------------------------------------
    app_name: str = Field(default="VitalAI")
    env: str = Field(default="development")
    port: int = Field(default=8000)
    debug: bool = Field(default=False)
    tz: str = Field(default="Africa/Johannesburg")

    # ---------------------------------------------------------
    # DATABASE SETTINGS
    # ---------------------------------------------------------
    mysql_url: str = Field(default="mysql+mysqlconnector://root:Omphilemodiba1!@127.0.0.1:3306/vitalai_db")
    sqlite_url: str = Field(default="sqlite:///./vitalai.db")

    database_url: str = Field(default="")  # Will be auto-set by validator
    database_pool_size: int = Field(default=10)
    database_max_overflow: int = Field(default=20)

    # ---------------------------------------------------------
    # CORS
    # ---------------------------------------------------------
    allowed_origins: str = Field(default="http://localhost:3000,http://127.0.0.1:3000")
    cors_origins: List[str] = Field(default_factory=list)

    # ---------------------------------------------------------
    # SECURITY (JWT)
    # ---------------------------------------------------------
    jwt_secret: str = Field(default="change_me_in_production_vitalai_2024")
    jwt_algorithm: str = Field(default="HS256")
    jwt_expire_minutes: int = Field(default=60 * 24 * 7)  # 7 days

    # ---------------------------------------------------------
    # FILE UPLOADS
    # ---------------------------------------------------------
    max_upload_size: int = Field(default=10 * 1024 * 1024)  # 10MB
    allowed_file_types: List[str] = Field(default=["jpg", "jpeg", "png", "pdf", "txt"])
    upload_dir: str = Field(default="./uploads")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "allow"

    # ---------------------------------------------------------
    # Validators
    # ---------------------------------------------------------
    @validator("database_url", pre=True, always=True)
    def set_database_url(cls, v, values):
        """
        Ensure we always have a valid database URL.
        MySQL takes priority; fallback to SQLite.
        """
        if values.get("mysql_url"):
            return values["mysql_url"]
        return values.get("sqlite_url")

    @validator("cors_origins", pre=True, always=True)
    def parse_cors(cls, v, values):
        origins_str = values.get("allowed_origins", "")
        if not origins_str:
            return ["http://localhost:3000"]
        return [origin.strip() for origin in origins_str.split(",")]

    @validator("debug", pre=True, always=True)
    def auto_debug(cls, v, values):
        return values.get("env") == "development"

    # ---------------------------------------------------------
    # Helper properties
    # ---------------------------------------------------------
    @property
    def is_mysql(self) -> bool:
        return self.database_url.startswith("mysql")

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")

    def get_mysql_config(self):
        """
        Parse MySQL URL into host, user, password, port, db.
        """
        url = urlparse(self.database_url)
        return {
            "host": url.hostname or "localhost",
            "port": url.port or 3306,
            "user": url.username or "root",
            "password": url.password or "",
            "database": url.path.replace("/", "") or "vitalai_db",
        }

    def get_database_config(self):
        return {
            "url": self.database_url,
            "pool_size": self.database_pool_size,
            "max_overflow": self.database_max_overflow,
        }
    # In config.py - Add this property to the Settings class
    @property
    def sqlite_path(self) -> str:
        """Get SQLite file path from sqlite_url"""
        if self.sqlite_url.startswith("sqlite:///"):
            return self.sqlite_url.replace("sqlite:///", "")
        return "./vitalai.db"
    


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
