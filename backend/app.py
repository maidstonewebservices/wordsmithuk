from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

class EbookRequest(BaseModel):
    niche: str
    audience: str
    tone: str = "British English"
    word_count: int = 3000

@app.post("/generate-ebook")
async def generate_ebook(req: EbookRequest):
    try:
        prompt = (
            f"You are an expert UK writer. Create a non-fiction ebook for the following niche: {req.niche}. "
            f"Target audience: {req.audience}. Use a {req.tone} tone. Include title, outline, and approximately {req.word_count} words of content."
        )

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful British writing assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4000
        )

        content = response.choices[0].message.content
        return {"ebook": content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
