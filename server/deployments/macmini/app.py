from flask import Flask, request, jsonify
from transformers import pipeline
import torch
import numpy as np
import os

app = Flask(__name__)

# Initialize sentiment analysis pipeline with a model specifically trained for sentiment
model_name = os.getenv('MODEL_NAME', 'finiteautomata/bertweet-base-sentiment-analysis')
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model=model_name,
    tokenizer=model_name,
    return_all_scores=True
)

# Sentiment label mapping
SENTIMENT_MAPPING = {
    'NEG': 'negative',
    'POS': 'positive',
    'NEU': 'neutral'
}

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/agents/<agent_name>', methods=['POST'])
def predict(agent_name):
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        # Get sentiment prediction
        sentiment_scores = sentiment_analyzer(text)[0]
        
        # Convert scores to the expected format with proper mapping
        scores = {
            SENTIMENT_MAPPING.get(score['label'], score['label'].lower()): score['score']
            for score in sentiment_scores
        }
        
        # Determine sentiment based on scores
        sentiment = max(scores.items(), key=lambda x: x[1])[0]
        confidence = max(scores.values())
        
        # Normalize scores for positive/negative only
        total = scores.get('positive', 0) + scores.get('negative', 0)
        if total > 0:
            normalized_scores = {
                'positive': scores.get('positive', 0) / total,
                'negative': scores.get('negative', 0) / total
            }
        else:
            normalized_scores = {'positive': 0.5, 'negative': 0.5}
        
        result = {
            "agent": agent_name,
            "sentiment": sentiment,
            "confidence": float(confidence),
            "scores": {
                "negative": float(normalized_scores['negative']),
                "positive": float(normalized_scores['positive'])
            },
            "raw_scores": {k: float(v) for k, v in scores.items()}
        }
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print(f"Starting sentiment analysis agent with model: {model_name}")
    print(f"Max length: {os.getenv('MAX_LENGTH', 128)}")
    print(f"Batch size: {os.getenv('BATCH_SIZE', 32)}")
    app.run(host='0.0.0.0', port=5000) 