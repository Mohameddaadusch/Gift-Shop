# Gift Shop - Personalized Gift Recommendation System

## Project Structure

### Frontend/
Contains the React-based web application with TypeScript:
- **src/pages/**: Main application pages including advanced search, user profiles, and gift browsing
- **src/components/**: Reusable UI components for authentication, gift cards, and hobby selection
- **src/context/**: Application state management and authentication context
- **src/services/**: API communication services
- **public/Data/**: Static data files including product catalogs, hobbies, occassions, and category mappings
- **Configuration files**: Package.json, Vite config, Tailwind CSS, and TypeScript configurations

### Backend/
Contains the Python-based machine learning recommendation engine:
- **main.py**: Main API server that handles recommendation requests
- **ranking_model.py**: Core machine learning model for gift ranking and recommendation
- **data_synthesis_training.ipynb**: Jupyter notebook for model training and data analysis
- **Model files**: Pre-trained models for hobbies, occasions, and user relationships (.pth files)
- **prods_embeds_100k.json**: Product embeddings database for similarity calculations

## How to Run the Project

### Prerequisites
- Node.js (version 14 or higher)
- Python (version 3.8 or higher)
- npm package manager

### Step 1: Setup and Run Frontend
1. Navigate to the Frontend directory:
   cd Frontend

2. Install all required npm packages:
   npm install

3. Paste .env file into the Frontend folder. (link for download https://drive.google.com/drive/folders/1ISPAGXQWcFL0kNK3vUcVCjrbYV-b8-xr?usp=sharing)

4. Start the development server:
   npm run dev

5. The frontend will be available at: http://localhost:5173

### Step 2: Setup and Run Backend
1. Navigate to the Backend directory:
   cd Backend

2. Install required Python packages:
   pip install fastapi uvicorn torch sentence-transformers pydantic

3. Paste prods_embeds_100k.json file into the Backend folder. (link for download https://drive.google.com/drive/folders/1ISPAGXQWcFL0kNK3vUcVCjrbYV-b8-xr?usp=sharing)

4. Run the main API server:
   python main.py

5. The backend API will be available at: http://127.0.0.1:8000

### Step 3: Using the Application
1. Ensure both frontend and backend are running simultaneously
2. Open your web browser and go to the frontend URL
3. Use the advanced search feature to get personalized gift recommendations
4. The frontend communicates with the backend API to process recommendations using machine learning models
5. Run out of money because you got addicted to buying gifts

## Troubleshooting
- If the frontend fails to start, ensure all npm packages are installed correctly
- If the backend fails to start, check that all Python dependencies are installed
- Make sure the frontned port is running at 5173
- Make sure both services are running on different ports to avoid conflicts
- Check browser console for any CORS errors if frontend cannot communicate with backend
