import torch
from sentence_transformers import SentenceTransformer
import torch.nn.functional as F
import torch.nn as nn
import json

hobbies_model = None
occasions_model = None
user_relationship_model = None
products = None
sbert = None

# Define model
class SuitabilityModel(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Linear(256, 64),
            nn.ReLU(),
            nn.Linear(64, 1),
            nn.Sigmoid()  # output ∈ [0, 1]
        )
    
    def forward(self, x):
        return self.net(x)


def load_models():
    # Open porducts with embeds
    with open('prods_embeds_100k.json', 'r') as f:
        products = json.load(f)

    for product in products:
        product['embed'] = torch.tensor(product['embed'])

    # Load trained models
    checkpoint = torch.load('hobbies_model.pth')
    hobbies_model = SuitabilityModel(input_dim=checkpoint['input_dim'])
    hobbies_model.load_state_dict(checkpoint['model_state_dict'])
    hobbies_model.eval()

    checkpoint = torch.load('occasions_model.pth')
    occasions_model = SuitabilityModel(input_dim=checkpoint['input_dim'])
    occasions_model.load_state_dict(checkpoint['model_state_dict'])
    occasions_model.eval()

    checkpoint = torch.load('user_relationship_model.pth')
    user_relationship_model = SuitabilityModel(input_dim=checkpoint['input_dim'])
    user_relationship_model.load_state_dict(checkpoint['model_state_dict'])
    user_relationship_model.eval()

    # Load Sentence-BERT
    sbert = SentenceTransformer('all-MiniLM-L6-v2')
    return hobbies_model, occasions_model, user_relationship_model, products, sbert

# Embedding functions
# Normalize age to [0, 1] (assuming 1-100)
def normalize_age(age):
    return (age - 1) / 100

# Encode gender to one-hot
def encode_gender(gender):
    if gender == "male":
        return [1, 0, 0]
    elif gender == "female":
        return [0, 1, 0]
    else:
        return [0, 0, 1]

def embed_hobbies(data):
    return torch.tensor(sbert.encode(data['hobbies']))

def embed_occasion(data):
    return torch.tensor(sbert.encode([data['occasion']])[0])

def embed_user_relationship(data):
    age, gender, relationship = data['age'], data['gender'], data['relationship']
    age_embed = torch.tensor([normalize_age(age)], dtype=torch.float32)
    gender_embed = torch.tensor(encode_gender(gender), dtype=torch.float32)

    relationship_embed = torch.tensor(sbert.encode([relationship])[0])

    return torch.cat([age_embed, gender_embed, relationship_embed])

def get_user_embed(user_data, relationship, occasion):
    gender = ""
    if user_data['gender'] != 'other':
        gender = user_data['gender']
    intro = f"A gift for my {relationship.lower()}, a {user_data['age']}-year-old {gender}"

    hobbies_text = ""
    if user_data['hobbies'] != []:
        hobbies_text = f" who enjoys {', '.join(user_data['hobbies'])}"

    user_text = intro + hobbies_text + f". It's for {occasion.lower()}."
    return torch.tensor(sbert.encode([user_text])[0])


# Filter products with embeddings similarity to users
def filter(user_data, relationship, occasion, products, n=1000):
    user_embed = get_user_embed(user_data, relationship, occasion)
    scores = []
    for product in products:
        score = F.cosine_similarity(user_embed, product['embed'], dim=0).item()
        scores.append((score, product))
    sorted_scores = sorted(scores, key=lambda x: x[0], reverse=True)[:min(n, len(products))]
    return [tup[1] for tup in sorted_scores]


# Inference function (ranking products)
def rank_products(data, hobbies_m, occasions_m, user_relationship_m, prods, sb):
    global hobbies_model, occasions_model, user_relationship_model, products, sbert
    hobbies_model, occasions_model, user_relationship_model, products, sbert = hobbies_m, occasions_m, user_relationship_m, prods, sb

    filtered = filter(data, data['relationship'], data['occasion'], products)
    with torch.no_grad():
        scores = []
        hobbies = embed_hobbies(data)
        occasion = embed_occasion(data)
        user_relationship = embed_user_relationship(data)

        for product in filtered:
            product_embed = product['embed']

            hobbies_score = 0
            for hobby in hobbies:
                input_vector = torch.cat([hobby, product_embed])
                hobbies_score = max(hobbies_model(input_vector.unsqueeze(0)).item(), hobbies_score)
            
            input_vector = torch.cat([occasion, product_embed])
            occasion_score = occasions_model(input_vector.unsqueeze(0)).item()
            
            input_vector = torch.cat([user_relationship, product_embed])
            user_relationship_score = user_relationship_model(input_vector.unsqueeze(0)).item()
            
            score = hobbies_score*0.5 + occasion_score*0.2 + user_relationship_score*0.3
            scores.append((score, product))

        ranked_scores_and_prods = sorted(scores, key=lambda x: x[0], reverse=True)  
        return [sp[1] for sp in ranked_scores_and_prods]
