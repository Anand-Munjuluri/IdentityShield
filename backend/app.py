from flask import Flask, render_template, request, jsonify
import cv2
from skimage.metrics import structural_similarity as ssim
import os

app = Flask(__name__)

# Define the upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Configure upload folder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Define allowed extensions for upload
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

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

    # Load images
    image1 = cv2.imread(selfie_path)
    image2 = cv2.imread(id_path)

    # Convert images to grayscale
    gray_image1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
    gray_image2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)

    # Detect faces in both images
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces1 = face_cascade.detectMultiScale(gray_image1, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    faces2 = face_cascade.detectMultiScale(gray_image2, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Extract the first detected face from each image (assuming only one face is detected)
    if len(faces1) > 0 and len(faces2) > 0:
        (x1, y1, w1, h1) = faces1[0]
        (x2, y2, w2, h2) = faces2[0]

        # Crop the detected faces
        face1 = gray_image1[y1:y1+h1, x1:x1+w1]
        face2 = gray_image2[y2:y2+h2, x2:x2+w2]

        # Resize the faces to have the same dimensions for comparison
        face1_resized = cv2.resize(face1, (face2.shape[1], face2.shape[0]))

        # Calculate SSIM (Structural Similarity Index)
        ssim_value = ssim(face1_resized, face2)

        # Convert SSIM value to percentage
        match_percentage = ssim_value * 100
        match_percentage = round(match_percentage, 2)  # Round to 2 decimal places

        return jsonify({"match_percentage": match_percentage})
    else:
        return jsonify({"error": "No faces detected in one or both images."}), 400

if __name__ == '__main__':
    app.run(debug=True)
