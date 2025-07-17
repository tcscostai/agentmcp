from flask import Flask, request, jsonify
from transformers import pipeline
import torch
import numpy as np
import os

app = Flask(__name__)

# Initialize sentiment analysis pipeline with a better pre-trained model
model_name = os.getenv('MODEL_NAME', 'distilbert-base-uncased-finetuned-sst-2-english')
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model=model_name,
    tokenizer=model_name
)

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
        result = sentiment_analyzer(text)[0]
        
        # Map sentiment labels
        sentiment = 'positive' if result['label'] == 'POSITIVE' else 'negative'
        confidence = float(result['score'])
        
        # Calculate complementary score
        neg_score = 1 - confidence if sentiment == 'positive' else confidence
        pos_score = confidence if sentiment == 'positive' else 1 - confidence
        
        response = {
            "agent": agent_name,
            "sentiment": sentiment,
            "confidence": confidence,
            "scores": {
                "negative": float(neg_score),
                "positive": float(pos_score)
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print(f"Starting sentiment analysis agent with model: {model_name}")
    app.run(host='0.0.0.0', port=5000) 