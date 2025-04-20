from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import io
import numpy as np
import os
import tensorflow as tf  
import joblib
from datetime import datetime
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from ultralytics import YOLO
import cv2

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH
app.config['RESULTS_FOLDER'] = RESULTS_FOLDER

# Create folders if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# ==============================================
# Plant Disease Model
# ==============================================
try:
    plant_disease_model = tf.keras.models.load_model('plant_disease_model.h5')
    PLANT_DISEASE_CLASSES = [
        'Apple Scab', 'Apple Black Rot', 'Apple Cedar Rust', 'Apple Healthy',
        'Blueberry Healthy', 'Cherry Powdery Mildew', 'Cherry Healthy',
        'Corn Gray Leaf Spot', 'Corn Common Rust', 'Corn Healthy',
        'Grape Black Rot', 'Grape Black Measles', 'Grape Leaf Blight', 'Grape Healthy'
    ]
    print("✅ Plant disease model loaded successfully")
except Exception as e:
    print(f"❌ Error loading plant disease model: {str(e)}")
    plant_disease_model = None

# ==============================================
# Price Prediction Model
# ==============================================
try:
    price_predictor = joblib.load('price_predictor.joblib')
    print("✅ Price predictor loaded successfully")
except Exception as e:
    print(f"❌ Error loading price predictor: {str(e)}")
    try:
        from price_predictor import PricePredictor
        price_predictor = PricePredictor()
        price_predictor.train()
        joblib.dump(price_predictor, 'price_predictor.joblib')
        print("✅ Created and saved new price predictor")
    except Exception as e:
        print(f"❌ Failed to create price predictor: {str(e)}")
        price_predictor = None

# ==============================================
# Soil Quality Model
# ==============================================
try:
    soil_model = load_model('my_model.h5')
    SOIL_CLASSES = {
        0: 'Alluvial',
        1: 'Black',
        2: 'Clay', 
        3: 'Red'
    }
    print("✅ Soil model loaded successfully")
except Exception as e:
    print(f"❌ Error loading soil model: {e}")
    soil_model = None

# ==============================================
# Medicine Prediction Model
# ==============================================
MEDICINE_MODEL_PATH = 'best_3.pt'
MEDICINE_MIN_CONFIDENCE = 0.3
try:
    medicine_model = YOLO(MEDICINE_MODEL_PATH)
    print(f"✅ Medicine model '{MEDICINE_MODEL_PATH}' loaded successfully")
except Exception as e:
    print(f"❌ Error loading medicine model: {str(e)}")
    medicine_model = None

# ==============================================
# Helper Functions
# ==============================================
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_image(file_stream):
    try:
        img = Image.open(file_stream)
        img.verify()
        file_stream.seek(0)
        return True
    except Exception:
        return False

def preprocess_image_for_model(img_path, target_size=(256, 256), model_type='plant'):
    """Preprocess image to match model training"""
    try:
        img = image.load_img(img_path, target_size=target_size)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        
        if model_type == 'plant':
            img_array /= 255.0
        elif model_type == 'soil':
            img_array /= 255.0
            
        return img_array
    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {str(e)}")

# ==============================================
# Routes
# ==============================================

@app.route('/predict_plant_disease', methods=['POST'])
def predict_plant_disease():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded', 'status': 'error'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file', 'status': 'error'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Allowed file types: PNG, JPG, JPEG', 'status': 'error'}), 400

    if not plant_disease_model:
        return jsonify({'error': 'Plant disease model not loaded', 'status': 'error'}), 500

    try:
        # Save temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Preprocess and predict
        processed_image = preprocess_image_for_model(filepath, target_size=(256, 256), model_type='plant')
        predictions = plant_disease_model.predict(processed_image)
        
        # Validate prediction
        if predictions.size == 0 or np.isnan(predictions).any():
            raise ValueError("Model returned invalid predictions")
        
        predicted_class_idx = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))
        
        # Get class name
        class_name = PLANT_DISEASE_CLASSES[predicted_class_idx] if predicted_class_idx < len(PLANT_DISEASE_CLASSES) else f"Class {predicted_class_idx}"
        
        # Validate confidence
        if confidence < 0.5: 
            return jsonify({
                'error': 'Low confidence prediction - may not be a plant image',
                'predicted_class': predicted_class_idx,
                'confidence': confidence,
                'class_name': class_name,
                'status': 'low_confidence'
            }), 200

        # Clean up
        os.remove(filepath)
        
        return jsonify({
            'predicted_class': predicted_class_idx,
            'confidence': confidence,
            'class_name': class_name,
            'status': 'success'
        })

    except Exception as e:
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({
            'error': f'Image processing error: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/predict_price', methods=['POST'])
def predict_price():
    if not price_predictor:
        return jsonify({'error': 'Price predictor not loaded', 'status': 'error'}), 500
        
    data = request.json
    prediction = price_predictor.predict(
        product=data.get('product', 'Rice'),
        season=data.get('season', 'Winter'),
        demand=data.get('demand', 1500),
        supply=data.get('supply', 1200)
    )
    
    if not prediction:
        return jsonify({'error': 'Product not found'}), 404
    
    def format_price(price):
        return f"₹{price:,.2f} per quintal (₹{price/100:,.2f} per kg)"
    
    return jsonify({
        'product': prediction['product'],
        'avg_price': format_price(prediction['avg_price']),
        'min_price': format_price(prediction['min_price']),
        'max_price': format_price(prediction['max_price']),
        'trend_up': prediction['trend_up'],
        'trend_down': prediction['trend_down'],
        'status': 'success'
    })

@app.route('/products', methods=['GET'])
def get_products():
    return jsonify({
        'products': ['Rice', 'Wheat', 'Corn', 'Potato'],
        'status': 'success'
    })

@app.route('/predict_soil', methods=['POST'])
def predict_soil():
    if not soil_model:
        return jsonify({'error': 'Soil model not loaded', 'status': 'error'}), 500
    
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded', 'status': 'error'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file', 'status': 'error'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({
            'error': 'Invalid file type. Only JPG, JPEG, PNG allowed (max 5MB)',
            'status': 'error'
        }), 400
    
    if not validate_image(file.stream):
        return jsonify({'error': 'Invalid or corrupted image file', 'status': 'error'}), 400
    
    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        processed_image = preprocess_image_for_model(filepath, target_size=(150, 150), model_type='soil')
        predictions = soil_model.predict(processed_image)
        
        if predictions.size == 0 or np.isnan(predictions).any():
            raise ValueError("Model returned invalid predictions")
        
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        class_name = SOIL_CLASSES.get(predicted_class_idx, "Unknown")
        
        if not 0 <= confidence <= 1:
            confidence = 0.0
        
        os.remove(filepath)
        
        return jsonify({
            'class': class_name,
            'confidence': confidence,
            'status': 'success'
        })
        
    except Exception as e:
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({
            'error': f"Prediction failed: {str(e)}",
            'status': 'error'
        }), 500

@app.route('/predict_medicine', methods=['POST'])
def predict_medicine():
    if not medicine_model:
        return jsonify({'error': 'Medicine model not loaded', 'status': 'error'}), 500
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded', 'status': 'error'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file', 'status': 'error'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Allowed file types: PNG, JPG, JPEG', 'status': 'error'}), 400

    try:
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes))
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        results = medicine_model(img)
        
        if not results[0].boxes or len(results[0].boxes) == 0:
            return jsonify({
                'error': 'No plants detected - please upload a clear plant image',
                'status': 'no_detection'
            }), 200
        
        boxes = results[0].boxes
        valid_boxes = [box for box in boxes if box.conf >= MEDICINE_MIN_CONFIDENCE]
        
        if not valid_boxes:
            return jsonify({
                'error': f'No confident detections (confidence < {MEDICINE_MIN_CONFIDENCE})',
                'status': 'low_confidence'
            }), 200
        
        best_box = max(valid_boxes, key=lambda box: box.conf)
        class_id = int(best_box.cls)
        class_name = medicine_model.names[class_id]
        confidence = float(best_box.conf)
        
        output_img = results[0].plot()
        output_img = Image.fromarray(output_img[..., ::-1])  
        
        output_filename = secure_filename(file.filename)
        output_path = os.path.join(app.config['RESULTS_FOLDER'], output_filename)
        output_img.save(output_path)
        
        response = {
            'plant_name': class_name,
            'confidence': confidence,
            'image_url': f'/results/{output_filename}',
            'status': 'success'
        }
        
        return jsonify(response)
    
    except Exception as e:
        app.logger.error(f"Error during prediction: {str(e)}")
        return jsonify({
            'error': 'Failed to process image',
            'status': 'error',
            'details': str(e)
        }), 500

@app.route('/results/<filename>')
def serve_result(filename):
    return send_from_directory(app.config['RESULTS_FOLDER'], filename)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'models_loaded': {
            'plant_disease': bool(plant_disease_model),
            'price_predictor': bool(price_predictor),
            'soil': bool(soil_model),
            'medicine': bool(medicine_model)
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)