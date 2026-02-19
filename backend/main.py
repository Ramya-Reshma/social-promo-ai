from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random

app = FastAPI(title="Social-Promo-AI Backend")

# In-memory history
promo_history: List[str] = []

# Request model for generating promo
class PromoRequest(BaseModel):
    brand_name: str
    content_type: str  # e.g., post, story, video
    tone: str = "friendly"  # default tone
    hashtags: List[str] = []  # optional hashtags
    cta: str = ""  # optional call-to-action

# Home route
@app.get("/")
async def home():
    return {"message": "Social-Promo-AI backend is running!"}

# Function to generate AI-like promo
def generate_mock_promo(brand, content_type, tone, hashtags, cta):
    phrases = {
        "fun": ["Check this out!", "You’ll love it!", "Don’t miss this!"],
        "friendly": ["Hey friends,", "Exciting news!", "Look what’s new!"],
        "professional": ["Boost your business with", "Introducing", "Enhance your brand:"]
    }
    phrase = random.choice(phrases.get(tone, ["Promo for"]))
    hashtag_text = " ".join(f"#{tag}" for tag in hashtags)
    promo_text = f"{phrase} {brand} ({content_type}) {cta} {hashtag_text}".strip()
    return promo_text

# Generate promo endpoint
@app.post("/generate-promo")
async def generate_promo(request: PromoRequest):
    promo = generate_mock_promo(
        request.brand_name,
        request.content_type,
        request.tone,
        request.hashtags,
        request.cta
    )
    promo_history.append(promo)
    return {"promo": promo}

# Get history endpoint
@app.get("/history")
async def get_history():
    return {"history": promo_history}
@app.get("/demo-promo")
async def demo_promo():
    # Fixed sample promo
    sample = {
        "brand_name": "CoolBrand",
        "content_type": "post",
        "tone": "fun",
        "hashtags": ["sale", "discount"],
        "cta": "Buy Now!"
    }
    promo = generate_mock_promo(
        sample["brand_name"],
        sample["content_type"],
        sample["tone"],
        sample["hashtags"],
        sample["cta"]
    )
    promo_history.append(promo)
    return {"promo": promo}