import os
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_ollama import ChatOllama
from pinecone import Pinecone

app = FastAPI(title="Vimtara Cloud Vector AI Engine")

# --- CONFIGURATION ---
os.environ["PINECONE_API_KEY"] = "pcsk_4R7qLx_NzHqRR74L1Fj7F3f8YB28i387ZmwzTkSmCjCiBFJzVK7cv6VRU68g8brPfUv5aj"
INDEX_NAME = "vimtara-knowledge-base"

class QueryRequest(BaseModel):
    prompt: str

# Global state
pc_index = None
embeddings = None
llm = None

def connect_to_cloud_brain():
    global pc_index, embeddings, llm
    print("☁️ Connecting to Pinecone Cloud Knowledge Base...")
    
    try:
        pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
        pc_index = pc.Index(INDEX_NAME)
        
        print("🧠 Loading Embedding Model...")
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        print("🤖 Connecting to Local Ollama LLM...")
        llm = ChatOllama(model="llama3.2", temperature=0.1)
        
        print("✅ Vimtara RAG Engine Fully Operational!")
    except Exception as e:
        print(f"⚠️ Failed to connect: {e}")

@app.on_event("startup")
async def startup_event():
    connect_to_cloud_brain()

@app.post("/api/ai/query")
async def query_ai(request: QueryRequest):
    global pc_index, embeddings, llm
    
    if pc_index is None or embeddings is None or llm is None:
        return {"response": "AI Engine is still booting up. Please try again in a moment."}
    
    try:
        # 1. Convert user prompt to a mathematical vector
        query_vector = embeddings.embed_query(request.prompt)
        
        # 2. Search Pinecone for the 3 most relevant document chunks
        search_results = pc_index.query(
            vector=query_vector, 
            top_k=3, 
            include_metadata=True
        )
        
        # 3. Extract the text from the search results
        context_chunks = []
        for match in search_results.get("matches", []):
            if "metadata" in match and "text" in match["metadata"]:
                context_chunks.append(match["metadata"]["text"])
                
        context_string = "\n\n".join(context_chunks)
        
       # 4. Construct a strict, modern Markdown prompt for Ollama
        system_prompt = (
            "You are Vimtara Statutory AI, an expert Indian corporate compliance assistant.\n"
            "Format your response using professional, clean Markdown:\n"
            "- Use clear Section Headings (### Heading)\n"
            "- Use Bullet Points (*) or Numbered Lists (1.) for step-by-step instructions\n"
            "- Use **Bold Text** for key terms, deadlines, and portal names\n"
            "- Convert all web addresses into standard Markdown hyperlinks: [Link Text](URL)\n"
            "- Keep paragraphs short and scannable\n\n"
            "Use ONLY the following context to answer the user's question:\n"
            f"Context:\n{context_string}\n\n"
            f"User Question: {request.prompt}"
        )
        
        # 5. Ask the local Ollama LLM
        res = llm.invoke(system_prompt)
        response_text = res.content if hasattr(res, 'content') else str(res)
        
        return {"response": response_text}
        
    except Exception as e:
        return {"response": f"AI Processing Error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)