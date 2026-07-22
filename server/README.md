# Backend del chatbot — MEGA UNIFORMES

API FastAPI que responde consultas del asistente conectada al inventario (`inventario.db`, SQLite) y a
un modelo de IA vía OpenRouter. La app móvil la consume con `EXPO_PUBLIC_CHATBOT_API_URL`.

## Endpoints

- `GET /` — estado del servicio.
- `GET /colegios` — `{ total, colegios: [...] }`.
- `POST /chat` — cuerpo `{ "message": string, "history": [{ "role": "user"|"assistant", "content": string }] }`
  → `{ "response": string, "productos": [...] }`.

CORS está abierto (`*`).

## Correr en local

```bash
cd server
python -m venv venv
# Windows: venv\Scripts\activate   ·   macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # y pega tu OPENROUTER_API_KEY (¡genera una nueva!)
uvicorn main:app --reload --port 8000
```

Prueba: `http://localhost:8000/` y `POST http://localhost:8000/chat`.

> En el emulador Android, `localhost` del backend es `http://10.0.2.2:8000`.

## Desplegar en Render (gratis)

1. Sube este repositorio a GitHub.
2. En [Render](https://render.com): **New → Blueprint** y selecciona el repo (usa el `render.yaml`,
   `rootDir = server`). O bien **New → Web Service** con:
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. En **Environment** define `OPENROUTER_API_KEY` (una clave **nueva** de
   https://openrouter.ai/keys) y opcionalmente `OPENROUTER_MODEL`.
4. Copia la URL pública (p.ej. `https://megauniformes-api.onrender.com`) y ponla en el `.env` de la
   app como `EXPO_PUBLIC_CHATBOT_API_URL`.

> ⚠️ La clave de OpenRouter del proyecto web original quedó **expuesta**: revócala en OpenRouter y usa
> una nueva aquí. Nunca la subas a git (`.env` está ignorado).

## Notas del inventario

`inventario.db` trae colegios/prendas/géneros/tallas reales, pero **stock y precio están en 0**. El
backend, por diseño, no inventa precios: guía al cliente a WhatsApp para confirmar precio y
disponibilidad. Para cargar stock/precios reales, actualiza la base (o re-importa el Excel con
`importar_inventario.py`).
