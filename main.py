from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import List, Tuple
from ranking_model import load_models, rank_products

# Load models once on startup
hobbies_model = None
occasions_model = None
user_relationship_model = None
products = None
sbert = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global hobbies_model, occasions_model, user_relationship_model, products, sbert

    # Call your model loading function
    hobbies_model, occasions_model, user_relationship_model, products, sbert = load_models()

    yield  # App runs after this line

    # Optional cleanup here (runs at shutdown)

# Initialize FastAPI with lifespan
app = FastAPI(lifespan=lifespan)

# Pydantic model for incoming request
class UserProfile(BaseModel):
    age: int
    gender: str
    hobbies: List[str]
    relationship: str
    occasion: str
    budget: Tuple[float, float]     # (min_cost, max_cost)

@app.post("/rank")
def get_ranked_products(profile: UserProfile):
    try:
        prof = profile.model_dump()
        ranked = rank_products(prof, hobbies_model, occasions_model, user_relationship_model, products, sbert)
        return ranked
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)