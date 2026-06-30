\# 🔍 ProductLens AI — Multimodal Product Reviewer



Upload any product image, ask questions, and get AI-powered reviews using a multimodal Vision LLM.



🌐 \*\*Live App:\*\* https://productlens-ai-sooty.vercel.app



⚙️ \*\*Backend API:\*\* https://productlens-backend.onrender.com



\---



\## 🗂️ Project Structure



\- `productlens-ai/`

&#x20; - `backend/`

&#x20;   - `main.py` — FastAPI server

&#x20;   - `requirements.txt`

&#x20; - `frontend/`

&#x20;   - `src/`

&#x20;     - `App.jsx` — React UI

&#x20; - `README.md`



\---



\## ✨ Features



\- 📷 Upload any product image (JPG, PNG, WEBP)

\- 💬 Ask custom questions or use quick prompts

\- 🤖 AI describes the product, answers your query, and gives Pros/Cons

\- 📜 Chat history for follow-up questions on the same image

\- 🌙 Clean dark UI



\---



\## 🛠️ Tech Stack



\*\*Frontend:\*\* React, Vite



\*\*Backend:\*\* FastAPI, Python



\*\*AI Model:\*\* Vision-capable LLM via OpenRouter



\*\*Deployment:\*\* Vercel (frontend) + Render (backend)



\---



\## ⚙️ Local Setup



\### 1. Get an OpenRouter API Key (Free)

👉 https://openrouter.ai/keys



\### 2. Backend Setup



```

cd backend

pip install -r requirements.txt

uvicorn main:app --reload

```



Create a `.env` file in the `backend` folder with:

```

OPENROUTER\_API\_KEY=your\_key\_here

```



Backend runs at: http://localhost:8000



\### 3. Frontend Setup



```

cd frontend

npm install

npm run dev

```



Frontend runs at: http://localhost:5173



\---



\## 🔮 Future Enhancements



\- \[ ] Compare two products side by side

\- \[ ] Price range estimator

\- \[ ] Export review as PDF

\- \[ ] Voice query input



\---



\## 👩‍💻 Author



Built by \*\*Swarnali Ghosh\*\*



🔗 \[GitHub Repository](https://github.com/swarnali2005/productlens-ai)

