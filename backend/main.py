from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import json
import random
from typing import Optional

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("ideas.json", encoding="utf-8") as f:
    ideas = json.load(f)

@app.get("/ideas")
def get_ideas(weather: Optional[str] = Query(None, description="Weather filter: sunny, rainy, any")):
    filtered = ideas
    if weather:
        filtered = [i for i in ideas if i["weather"] == weather or i["weather"] == "any"]
    if len(filtered) <= 3:
        return filtered
    return random.sample(filtered, 3)
