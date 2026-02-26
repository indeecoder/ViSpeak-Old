from pathlib import Path
import time
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


# --- Konfigurasi Path ---
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

# Serve folder static (config.js, logic.js, gambar, dll)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Setup Template Engine untuk membaca HTML
templates = Jinja2Templates(directory=APP_PAGES_DIR)


@app.get("/", include_in_schema=False)
async def Home(request: Request):
    # Cache Busting: Kirim timestamp saat ini sebagai versi
    # Setiap refresh, 'v' akan unik, memaksa browser memuat JS terbaru.
    return templates.TemplateResponse(
        "index.html", 
        {
            "request": request, 
            "v": int(time.time())
        }
    )