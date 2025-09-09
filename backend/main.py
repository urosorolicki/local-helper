from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import json
import random
from typing import Optional
import os

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IDEAS_PATH = os.path.join(os.path.dirname(__file__), "ideas.json")
with open(IDEAS_PATH, encoding="utf-8") as f:
    ideas = json.load(f)

@app.get("/ideas")
def get_ideas(
    weather: Optional[str] = Query(None, description="Weather filter: sunny, rainy, any"),
    city: Optional[str] = Query(None, description="City filter (default: Beograd)"),
    type: Optional[str] = Query(None, description="Type filter (outdoor, indoor, food, family, culture)")
):
    filtered = ideas
    if city:
        filtered = [i for i in filtered if i.get("city", "Beograd").lower() == city.lower()]
    if weather:
        filtered = [i for i in filtered if i["weather"] == weather or i["weather"] == "any"]
    if type:
        filtered = [i for i in filtered if i["type"] == type]
    if len(filtered) <= 3:
        return filtered
    return random.sample(filtered, 3)

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
def get_ideas(
    weather: Optional[str] = Query(None, description="Weather filter: sunny, rainy, any"),
    city: Optional[str] = Query(None, description="City filter (default: Beograd)"),
    type: Optional[str] = Query(None, description="Type filter (outdoor, indoor, food, family, culture)")
):
    filtered = ideas
    if city:
        filtered = [i for i in filtered if i.get("city", "Beograd").lower() == city.lower()]
    if weather:
        filtered = [i for i in filtered if i["weather"] == weather or i["weather"] == "any"]
    if type:
        filtered = [i for i in filtered if i["type"] == type]
    if len(filtered) <= 3:
        return filtered
    return random.sample(filtered, 3)
