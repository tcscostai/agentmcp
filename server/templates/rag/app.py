from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import chromadb
from pinecone import Pinecone
import openai

app = Flask(__name__)
CORS(app)

# Load configuration
with open('/app/data/config.json', 'r') as f:
    config = json.load(f)

# Initialize OpenAI client
openai.api_key = os.getenv('OPENAI_API_KEY')

# Initialize vector DB client based on config
vector_db_type = config['vectorDBType']
if vector_db_type == 'chroma':
    vector_db = chromadb.Client()
elif vector_db_type == 'pinecone':
    vector_db = Pinecone(api_key=config['config']['apiKey'])

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/query', methods=['POST'])
def query():
    try:
        data = request.json
        query_text = data['query']
        
        # Generate query embedding
        response = openai.embeddings.create(
            model="text-embedding-ada-002",
            input=query_text
        )
        query_embedding = response.data[0].embedding

        # Search vector DB
        results = search_vector_db(query_embedding)

        # Generate answer
        answer = generate_answer(query_text, results)

        return jsonify({
            "answer": answer,
            "sources": results
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def search_vector_db(query_embedding):
    try:
        if vector_db_type == 'chroma':
            collection = vector_db.get_collection('documents')
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=3
            )
            return [
                {
                    'content': doc,
                    'metadata': meta,
                    'score': 1 - dist  # Convert distance to similarity score
                }
                for doc, meta, dist in zip(
                    results['documents'][0],
                    results['metadatas'][0],
                    results['distances'][0]
                )
            ]
        elif vector_db_type == 'pinecone':
            index = vector_db.Index('documents')
            results = index.query(
                vector=query_embedding,
                top_k=3,
                include_metadata=True
            )
            return [
                {
                    'content': match.metadata['content'],
                    'metadata': match.metadata,
                    'score': match.score
                }
                for match in results.matches
            ]
    except Exception as e:
        print(f"Error searching vector DB: {str(e)}")
        raise

def generate_answer(query, context):
    try:
        # Sort by relevance and take top 3 chunks
        sorted_context = sorted(context, key=lambda x: x['score'], reverse=True)[:3]
        context_text = "\n\n".join([r['content'] for r in sorted_context])
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that answers questions based on the provided context. If the answer cannot be found in the context, say so."
                },
                {
                    "role": "user",
                    "content": f"Context:\n{context_text}\n\nQuestion: {query}"
                }
            ],
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message['content']
    except Exception as e:
        print(f"Error generating answer: {str(e)}")
        raise

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 