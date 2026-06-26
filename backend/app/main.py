from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router

app = FastAPI(
    title="Smart Study Assistant & Uyghur Translator API",
    description="Backend API for uploading and processing Quranic Arabic study materials.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "Smart Study Assistant & Uyghur Translator API is running."
    }