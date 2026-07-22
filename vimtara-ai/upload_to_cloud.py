import os
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone, ServerlessSpec

# --- CONFIGURATION ---
os.environ["PINECONE_API_KEY"] = "pcsk_4R7qLx_NzHqRR74L1Fj7F3f8YB28i387ZmwzTkSmCjCiBFJzVK7cv6VRU68g8brPfUv5aj"
INDEX_NAME = "vimtara-knowledge-base"
KB_DIR = "./knowledge_base"

print("☁️ Connecting to Pinecone Cloud...")
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

if INDEX_NAME not in pc.list_indexes().names():
    print(f"Creating new cloud index: {INDEX_NAME}...")
    pc.create_index(
        name=INDEX_NAME,
        dimension=384, 
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )

index = pc.Index(INDEX_NAME)

print(f"📂 Scanning {KB_DIR} for documents...")
documents = []
for root, dirs, files in os.walk(KB_DIR):
    for file in files:
        file_path = os.path.join(root, file)
        try:
            if file.endswith(".txt"):
                documents.extend(TextLoader(file_path, encoding='utf-8').load())
            elif file.endswith(".pdf"):
                documents.extend(PyPDFLoader(file_path).load())
        except Exception as e:
            print(f"Failed to load {file}: {e}")

print("✂️ Chunking documents...")
texts = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50).split_documents(documents)

print("🚀 Generating Mathematical Embeddings... (This takes a moment)")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Embed all text chunks
text_contents = [doc.page_content for doc in texts]
embedded_vectors = embeddings.embed_documents(text_contents)

print("☁️ Uploading vectors to Pinecone...")
# Format for Pinecone
vectors_to_upsert = []
for i, (text_content, emb) in enumerate(zip(text_contents, embedded_vectors)):
    vectors_to_upsert.append({
        "id": f"doc_chunk_{i}",
        "values": emb,
        "metadata": {"text": text_content}
    })

# Batch upload to Pinecone (100 at a time)
batch_size = 100
for i in range(0, len(vectors_to_upsert), batch_size):
    batch = vectors_to_upsert[i:i + batch_size]
    index.upsert(vectors=batch)

print("✅ Upload Complete! Your knowledge base is now live in the cloud.")