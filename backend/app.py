from flask import Flask, request, jsonify
import cv2
import numpy as np

app = Flask(__name__)

@app.route('/upload-document', methods=['POST'])
def upload_document():
    if 'document' not in request.files:
        return jsonify({'error': 'No document file found'}), 400
    
    document_file = request.files['document']
    
    # Save the document file
    document_file.save('document.jpg')

    return jsonify({'message': 'Document uploaded successfully'}), 200

@app.route('/capture-live-image', methods=['POST'])
def capture_live_image():
    # Access the camera and capture a live image
    # You can use OpenCV or any other library to capture the image
    # Here's a basic example using OpenCV
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()

    if ret:
        # Save the captured image
        cv2.imwrite('live_image.jpg', frame)
        return jsonify({'message': 'Live image captured successfully'}), 200
    else:
        return jsonify({'error': 'Failed to capture live image'}), 500

@app.route('/compare-images', methods=['POST'])
def compare_images():
    # Load the uploaded document and live image
    document_img = cv2.imread('document.jpg')
    live_img = cv2.imread('live_image.jpg')

    # Convert images to grayscale for comparison
    document_gray = cv2.cvtColor(document_img, cv2.COLOR_BGR2GRAY)
    live_gray = cv2.cvtColor(live_img, cv2.COLOR_BGR2GRAY)

    # Perform image comparison using OpenCV's template matching or any other method
    # Here's a basic example using template matching
    res = cv2.matchTemplate(live_gray, document_gray, cv2.TM_CCOEFF_NORMED)
    similarity = np.max(res)

    # Set a threshold for similarity
    threshold = 0.8
    if similarity > threshold:
        return jsonify({'match_percentage': similarity}), 200
    else:
        return jsonify({'match_percentage': similarity}), 404

if __name__ == '__main__':
    app.run(debug=True)
