# Testovi za backend (FastAPI)

import json
from fastapi.testclient import TestClient
from main import app

def test_ideas_basic():
    client = TestClient(app)
    r = client.get("/ideas")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert 1 <= len(data) <= 3
    assert all("title" in i for i in data)

def test_ideas_weather():
    client = TestClient(app)
    r = client.get("/ideas?weather=sunny")
    assert r.status_code == 200
    data = r.json()
    for i in data:
        assert i["weather"] == "sunny" or i["weather"] == "any"

def test_ideas_city():
    client = TestClient(app)
    r = client.get("/ideas?city=Novi%20Sad")
    assert r.status_code == 200
    data = r.json()
    for i in data:
        assert i["city"].lower() == "novi sad"

def test_ideas_type():
    client = TestClient(app)
    r = client.get("/ideas?type=food")
    assert r.status_code == 200
    data = r.json()
    for i in data:
        assert i["type"] == "food"
