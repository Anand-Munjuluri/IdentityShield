from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import cv2
import os
import face_recognition

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

from skimage import measure, morphology
from skimage.color import label2rgb
from skimage.measure import regionprops
import numpy as np
import numpy as np

app = Flask(__name__)
CORS(app)
CORS(app)

# Define the upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Configure upload folder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Define allowed extensions for upload
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

id_encodings = {}
model_name = 'backend\id_model.keras'
model_path=os.path.join(os.getcwd(),model_name)
model = load_model(model_path)

# Function to check if the file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route for the homepage
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle image uploads and compare faces
@app.route('/compare', methods=['POST'])
def compare_faces():
    # Check if files were uploaded in the request
    if 'selfie' not in request.files or 'id' not in request.files:
        return jsonify({"error": "Please upload both selfie and ID images."}), 400

    selfie = request.files['selfie']
    id_image = request.files['id']

    # Check if the files have valid extensions
    if selfie.filename == '' or id_image.filename == '':
        return jsonify({"error": "Please upload both selfie and ID images."}), 400
    if not allowed_file(selfie.filename) or not allowed_file(id_image.filename):
        return jsonify({"error": "Invalid file format. Please upload images in PNG, JPG, or JPEG format."}), 400

    # Save the uploaded images
    selfie_path = os.path.join(app.config['UPLOAD_FOLDER'], 'selfie.png')
    id_path = os.path.join(app.config['UPLOAD_FOLDER'], 'id.png')
    selfie.save(selfie_path)
    id_image.save(id_path)

    match = fcr_compare_faces(id_path,selfie_path)

    del_id_enc(id_path)
    
    if match is not None:
        if str(match) == "ID Not Valid":
            return jsonify({"error": "Invalid ID"})
        else:
            return jsonify({"match": str(match[0])})
    else:
        return jsonify({"error": "No faces detected in one or both images."}), 400

# Function to extract signature from an image
def extract_signature(image_path):
    # Load the image
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    # Apply thresholding to binarize the image
    _, binary_image = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Find contours of the signature
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Find the largest contour (assumed to be the signature)
    max_contour = max(contours, key=cv2.contourArea)

    # Create a mask for the signature
    mask = np.zeros_like(image)
    cv2.drawContours(mask, [max_contour], -1, (255, 255, 255), thickness=cv2.FILLED)

    # Extract the signature using the mask
    extracted_signature = cv2.bitwise_and(image, mask)

    return extracted_signature

# Route to handle signature extraction
@app.route('/extract_signature', methods=['POST'])
def handle_extract_signature():
    # Check if an image was uploaded
    if 'image' not in request.files:
        return jsonify({"error": "Please upload an image."}), 400

    image_file = request.files['image']

    # Check if the file has a valid extension
    if image_file.filename == '' or not allowed_file(image_file.filename):
        return jsonify({"error": "Invalid file format. Please upload an image in PNG, JPG, or JPEG format."}), 400

    # Save the uploaded image
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'signature.png')
    image_file.save(image_path)

    # Extract the signature
    extracted_signature = extract_signature(image_path)

    # Save the extracted signature
    extracted_signature_path = os.path.join(app.config['UPLOAD_FOLDER'], 'extracted_signature.png')
    cv2.imwrite(extracted_signature_path, extracted_signature)

    # Return the path to the extracted signature
    return send_file(extracted_signature_path, mimetype='image/png')


def pre_encode_id(id_path):
    print(predict_ID(id_path)[0,0])
    if predict_ID(id_path)[0,0]==0:
        id_image = face_recognition.load_image_file(id_path)
        id_enc = face_recognition.face_encodings(id_image,num_jitters=4, model="large")[0]
        id_encodings[str(id_path)] = id_enc
    else:
        raise Exception()

def fcr_compare_faces(id_path,selfie_path):
    try:
        unknown_image = face_recognition.load_image_file(selfie_path)

        if id_path not in id_encodings.keys():
            try:
                pre_encode_id(id_path)
            except Exception:
                return "ID Not Valid"

        id_encoding = id_encodings[id_path]
        unknown_encoding = face_recognition.face_encodings(unknown_image,num_jitters=2, model="large")[0]

        results = face_recognition.compare_faces([id_encoding], unknown_encoding)
        return results
    except IndexError:
        return None

def del_id_enc(id_path):
    id_encodings.pop(id_path, 'No Key found')

# Function to preprocess an image for prediction
def preprocess_ID_Image(image_path):
    img = image.load_img(image_path, target_size=(224, 224))  # Assuming your model expects input images of size 224x224
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Expand dimensions to create batch dimension
    return img_array

# Function to make predictions on a single image
def predict_ID(image_path):
    img_array = preprocess_ID_Image(image_path)
    predictions = model.predict(img_array)
    return predictions


# Function to extract signature from an image
def extract_signature(image_path):
    # Load the image
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    # Apply thresholding to binarize the image
    _, binary_image = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Find contours of the signature
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Find the largest contour (assumed to be the signature)
    max_contour = max(contours, key=cv2.contourArea)

    # Create a mask for the signature
    mask = np.zeros_like(image)
    cv2.drawContours(mask, [max_contour], -1, (255, 255, 255), thickness=cv2.FILLED)

    # Extract the signature using the mask
    extracted_signature = cv2.bitwise_and(image, mask)

    return extracted_signature

# Route to handle signature extraction
@app.route('/extract_signature', methods=['POST'])
def handle_extract_signature():
    # Check if an image was uploaded
    if 'image' not in request.files:
        return jsonify({"error": "Please upload an image."}), 400

    image_file = request.files['image']

    # Check if the file has a valid extension
    if image_file.filename == '' or not allowed_file(image_file.filename):
        return jsonify({"error": "Invalid file format. Please upload an image in PNG, JPG, or JPEG format."}), 400

    # Save the uploaded image
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'signature.png')
    image_file.save(image_path)

    # Extract the signature
    extracted_signature = extract_signature(image_path)

    # Save the extracted signature
    extracted_signature_path = os.path.join(app.config['UPLOAD_FOLDER'], 'extracted_signature.png')
    cv2.imwrite(extracted_signature_path, extracted_signature)

    # Return the path to the extracted signature
    return send_file(extracted_signature_path, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
