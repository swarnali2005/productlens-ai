from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import base64, requests
from PIL import Image
import io

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

import os
API_KEY = os.environ.get("OPENROUTER_API_KEY")

SYSTEM_PROMPT = "You are an expert product analyst. Describe the product, answer the question, list 3 Pros and 3 Cons, suggest who it is for, and suggest 2-3 alternatives."

@app.post("/analyze")
async def analyze_product(image: UploadFile = File(...), query: str = Form(...)):
    try:
        img = Image.open(io.BytesIO(await image.read())).convert("RGB")
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        encoded = base64.b64encode(buf.getvalue()).decode("utf-8")

        res = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
            json={
                "model": "openrouter/free",
                "messages": [{
                    "role": "user",
                    "content": [
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded}"}},
                        {"type": "text", "text": SYSTEM_PROMPT + "\n\nQuestion: " + query}
                    ]
                }]
            }
        )
        data = res.json()
        print("RESPONSE:", data)
        result = data["choices"][0]["message"]["content"]
        return JSONResponse({"result": result, "status": "success"})
    except Exception as e:
        print("ERROR:", str(e))
        return JSONResponse({"error": str(e), "status": "error"}, status_code=500)

@app.get("/")
def root():
    return {"message": "running"}