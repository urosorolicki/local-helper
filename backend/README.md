# Local Helper – Backend

Ovaj backend koristi FastAPI i služi za generisanje dnevnih ideja za aktivnosti u Beogradu (ili drugom gradu).

## Pokretanje lokalno

1. Instaliraj zavisnosti:

   ```bash
   pip install -r requirements.txt
   ```

2. Pokreni server:

   ```bash
   uvicorn main:app --reload
   ```

3. API endpoint:
   - `GET /ideas` – vraća 3 nasumične ideje
   - Query parametar `weather` (opciono): `sunny`, `rainy`, `any`

## Deploy na Vercel

1. Deployuj ceo `/backend` folder na Vercel kao Python (FastAPI) serverless funkciju.
2. Postavi javni URL u frontend aplikaciji.

## Struktura
- `main.py` – FastAPI aplikacija
- `ideas.json` – baza ideja
- `requirements.txt` – zavisnosti
