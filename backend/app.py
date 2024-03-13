from flask import Flask, request, jsonify
from PIL import Image
import face_recognition

app = Flask(__name__)

@app.route('/match-faces', methods=['POST'])
def match_faces():
    if 'image1' not in request.files or 'image2' not in request.files:
        return jsonify({'error': 'Images not found in request'}), 400

    image1 = request.files['image1']
    image2 = request.files['image2']

    # Load images using PIL
    pil_image1 = Image.open(image1)
    pil_image2 = Image.open(image2)

    # Convert images to face_recognition format
    face_image1 = face_recognition.load_image_file(pil_image1)
    face_image2 = face_recognition.load_image_file(pil_image2)

    # Find face encodings
    face_encoding1 = face_recognition.face_encodings(face_image1)
    face_encoding2 = face_recognition.face_encodings(face_image2)

    if not face_encoding1 or not face_encoding2:
        return jsonify({'error': 'No faces found in one or both images'}), 400

    # Compare face encodings
    match_results = face_recognition.compare_faces([face_encoding1[0]], face_encoding2[0])

    # Determine match percentage
    match_percentage = 0 if not match_results else 100 if match_results[0] else 0

    return jsonify({'match_percentage': match_percentage})

if __name__ == '__main__':
    app.run(debug=True)
