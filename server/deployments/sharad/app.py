from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch
import numpy as np
import os
import psutil
import time
from datetime import datetime

CORS(app)
app = Flask(__name__)

try:
    # Initialize sentiment analysis pipeline with a proven sentiment model
    model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    
    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model=model,
        tokenizer=tokenizer,
        device=-1  # Use CPU
    )
    
    print(f"Successfully loaded model: {model_name}")
    
except Exception as e:
    print(f"Error loading model: {str(e)}")
    raise

# Add these global variables at the top of the file
start_time = time.time()
request_count = 0
success_count = 0

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "model": model_name})

@app.route('/api/agents/<agent_name>/metrics', methods=['GET'])
def get_metrics(agent_name):
    try:
        # Get CPU usage
        cpu_percent = psutil.cpu_percent()
        
        # Get memory usage
        process = psutil.Process()
        memory_info = process.memory_info()
        memory_mb = memory_info.rss / 1024 / 1024  # Convert to MB
        
        # Calculate uptime
        uptime_seconds = time.time() - start_time
        hours = int(uptime_seconds // 3600)
        minutes = int((uptime_seconds % 3600) // 60)
        seconds = int(uptime_seconds % 60)
        uptime = f"{hours}:{minutes:02d}:{seconds:02d}"
        
        # Calculate success rate
        success_rate = (success_count / request_count * 100) if request_count > 0 else 100
        
        # Calculate requests per second
        requests_per_second = request_count / uptime_seconds if uptime_seconds > 0 else 0
        
        return jsonify({
            "cpu": round(cpu_percent, 2),
            "memory": round(memory_mb, 2),
            "uptime": uptime,
            "success_rate": round(success_rate, 2),
            "requests_per_second": round(requests_per_second, 2),
            "total_requests": request_count,
            "successful_requests": success_count
        })
        
    except Exception as e:
        print(f"Error getting metrics: {str(e)}")
        return jsonify({"error": "Failed to get metrics"}), 500

@app.route('/api/agents/<agent_name>', methods=['POST'])
def predict(agent_name):
    global request_count, success_count
    
    try:
        request_count += 1
        data = request.json
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400
            
        text = data['text']
        if not isinstance(text, str) or not text.strip():
            return jsonify({"error": "Invalid text input"}), 400

        # Get prediction
        result = sentiment_analyzer(text)[0]
        
        # Convert 1-5 star rating to binary sentiment
        rating = int(result['label'].split()[0])
        sentiment = 'positive' if rating > 3 else 'negative'
        
        # Normalize confidence scores
        if rating > 3:
            pos_score = (rating - 3) / 2  # Scale 4-5 to 0.5-1.0
            confidence = pos_score
        else:
            neg_score = (4 - rating) / 2  # Scale 1-3 to 1.0-0.5
            confidence = neg_score
            
        response = {
            "agent": agent_name,
            "sentiment": sentiment,
            "confidence": float(confidence),
            "scores": {
                "negative": float(1 - confidence),
                "positive": float(confidence)
            }
        }
        
        print(f"Input: {text}")
        print(f"Prediction: {response}")
        
        # If we get here, the request was successful
        success_count += 1
        return jsonify(response)
    
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({
            "error": "Failed to process text",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    print("Starting sentiment analysis service...")
    print(f"Model: {model_name}")
    app.run(host='0.0.0.0', port=5000) 