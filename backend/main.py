# backend/main.py
from fastapi import FastAPI
from fastapi.responses import FileResponse

# --- App Initialization ---
app = FastAPI()

# --- Default Commands ---
DEFAULT_COMMANDS = {
    "top": "Iya!",
    "bottom": "Tidak!",
    "top_right": "Aku Lapar!",
    "top_left": "Aku Haus!",
    "center": "",
    "right": "Tolong!",
    "left": "Terimakasih!",
    "bottom_right": "Aku perlu toilet!",
    "bottom_left": "Aku merasa sakit!",
}

# --- API Endpoints ---
@app.get("/")
async def read_index():
    """
    Serves the main frontend application file.
    This uses FileResponse to send the app.html file when the root URL is accessed.
    """
    return FileResponse('frontend/app.html')

@app.get("/load_commands")
async def load_commands():
    """Provides the initial set of hardcoded commands to the frontend."""
    return DEFAULT_COMMANDS
