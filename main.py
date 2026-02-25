from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles


# --- Global Path Configuration ---
BASE_DIR = Path(__file__).resolve().parent
APP_PAGES_DIR = BASE_DIR / "app_pages"
STATIC_DIR = BASE_DIR / "static"


app = FastAPI(
    title="ViSpeak",
    description="ViSpeak API",
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
)


# Serve folder static (config.js, logic.js, favicon.ico)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/", include_in_schema=False)
async def Home():
    return FileResponse(APP_PAGES_DIR / "index.html")