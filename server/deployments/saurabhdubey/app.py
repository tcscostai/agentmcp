from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np
import os

app = Flask(__name__)

# Load model and tokenizer
model_name = os.getenv('MODEL_NAME', 'bert-base-uncased')
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)  # For sentiment analysis

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
        
        # Tokenize and prepare input
        inputs = tokenizer(text, return_tensors="pt", truncation=True, 
                         max_length=int(os.getenv('MAX_LENGTH', 128)))
        
        # Make prediction
        with torch.no_grad():
            outputs = model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
            
        # Process results for sentiment analysis
        scores = predictions[0].tolist()
        sentiment = "positive" if scores[1] > scores[0] else "negative"
        confidence = float(max(scores))
        
        result = {
            "agent": agent_name,
            "sentiment": sentiment,
            "confidence": confidence,
            "scores": {
                "negative": scores[0],
                "positive": scores[1]
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Add startup message
    print(f"Starting BERT-Mini agent with model: {model_name}")
    print(f"Max length: {os.getenv('MAX_LENGTH', 128)}")
    print(f"Batch size: {os.getenv('BATCH_SIZE', 32)}")
    
    app.run(host='0.0.0.0', port=5000) 