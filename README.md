# IdentityShield

Welcome to IdentityShield, a comprehensive identity verification system designed to ensure secure transactions and protect against identity theft. This documentation provides guidance on setting up the project locally, outlines the technologies utilized, describes the user flow, and highlights key features.

Our product is also suitable for Physically Challenged, it is accessible, and outputs the speech of AI responses which is very comfortable for people who have hearing impairment.
Our website is tailored for the people worldwide, it supports more than 50 languages(multi-lingual support).
## Video Demo


https://github.com/Anand-Munjuluri/IdentityShield/assets/69068704/1c2ffa52-4a9c-43c2-bc08-f1c606966aba

for better video quality -> <a href="https://drive.google.com/file/d/1-oe8YR1uPeTyld9kgx0mjEaBotaChl0o/view">View Here</a>
## How to Setup Locally

To set up IdentityShield locally, follow these steps:

For backend:
1. *Clone the Repository*: 
   ```bash
   git clone https://github.com/Anand-Munjuluri/IdentityShield.git
   ```

2. Install Dependencies:

   ```bash
      cd IdentityShield/backend
      pip install -r requirements.txt
   ```
3. Run the Application:

   ```bash
   python app.py
   ```
      
4. Access the Application:
   
      Open a web browser and navigate to http://localhost:5000.

for frontend:

1. Install Dependencies:

   ```bash
      npm install
   ```
2. Run the Application:

   ```bash
   npm start
   ```
      
3. Access the Application:
   
      Open a web browser and navigate to localhost

## Technologies Used
  
          **Flask**: Python web framework for backend development.  
          **OpenCV**: Library for computer vision tasks such as face detection and image processing.  
          **Skimage**: Library for facial comparison.  
          **HTML/CSS/JavaScript**: Frontend technologies for building the user interface.  
  
    
## User Flow
      
   <img width="893" alt="image" src="https://github.com/Anand-Munjuluri/IdentityShield/assets/100225249/9d956754-358f-4c56-8571-98d4d18dd319">

          **Homepage**: Users are directed to the homepage upon accessing the application.  
          **Filling Basic Details**: Users are prompted to fill the basic details before the verification starts.  
          **Image Upload**: Users upload their selfie and ID image.  
          **Face Matching**: The system compares the uploaded selfie with the ID image to verify identity.  
          <img width="1319" alt="image" src="https://github.com/Anand-Munjuluri/IdentityShield/assets/100225249/0ca1bf50-c28b-40d0-87e4-a8fe88a3fe27">

          **Signature Extraction**: Users can capture their signature and the backend extracts the signature from image.
          <img width="625" alt="image" src="https://github.com/Anand-Munjuluri/IdentityShield/assets/100225249/4812b8c4-cbb9-4b5e-8148-cfd79bc04f9b">

          **Signature Verification**: The system verifies the extracted signature.  
          <img width="1343" alt="image" src="https://github.com/Anand-Munjuluri/IdentityShield/assets/100225249/6c518cc5-8f85-4891-bd55-2f688b85285a">


   


## Features
          **Face Matching**: Compares uploaded selfie with ID image for identity verification.  
          **Signature Extraction**: Extracts the signature from an uploaded image.  
          **Signature Verification**: Verifies the extracted signature.  
          **User-friendly Interface**: Provides an intuitive interface for smooth user interaction.  
          **Multi Lingual Support**: Messages are available in over 50 Languages to accomodate wide range of users.  
          **Cross-Origin Resource Sharing (CORS)**: Enables communication between frontend and backend on different domains.  


## Backend Workflow:
          1. Uploading Images:  
                    Users upload their selfie and ID photo through the React frontend.  
                    React sends the images to the Flask backend for processing.  
          2. Preprocessing Images:  
                    Upon receiving the images, the Flask backend preprocesses them using OpenCV.  
                    For face recognition, OpenCV is used to detect faces in both the selfie and ID photo.  
                    For image matching, OpenCV is used to preprocess images for feature extraction.  
          3. Feature Extraction:  
                    In the case of face recognition, facial features are extracted from both the selfie and ID photo using OpenCV.  
                    For image matching, features are extracted from both images using scikit-learn or OpenCV,  
                    depending on the chosen method (e.g., SIFT, SURF, ORB).  
          4. Comparison:  
                    The extracted features are compared between the selfie and ID photo to determine if they match.  
                    For face recognition, the similarity between facial features is calculated.  
                    For image matching, similarity between feature descriptors or keypoints is calculated.  
          5. Verification:  
                    Based on the comparison results, the backend determines whether the selfie matches the ID photo.  
                    If the comparison indicates a match, the backend confirms the user's identity.  
          6. Response to Frontend:  
                    The backend sends the verification result (whether the photos match or not) back to the React frontend.  
                    React displays the result to the user, indicating whether the identity verification was successful or not.  
          7. Error Handling:  
                    The backend handles errors gracefully, such as if no faces are detected in the images or if an error   
                    occurs during feature extraction or comparison.  
                    Error messages are sent back to the frontend to inform the user of any issues encountered during the verification process.  
          8. Integration with React:  
                    Flask provides RESTful APIs that the React frontend interacts with.  
                    React makes HTTP requests to the Flask backend to send images and receive verification results.  
                    The frontend updates the user interface based on the verification results received from the backend.  

## Conclusion
          IdentityShield offers a robust solution for identity verification, leveraging advanced technologies such as facial recognition and signature extraction. Its user-friendly interface and powerful features ensure a secure and seamless verification process, enhancing security and trust in digital transactions.

## Contributors
                    Munjuluri Naga Gopala Jagganadha Surya Anand (RA2111003010143)  
                    Nishaanth Balakrishnan (RA2111003010144)  
                    Sanjayraja Sreeraja (RA2111003010161)  
                    Amritha R (RA2111003010173)  
                    Adiraju Aditya (RA2111003010198)  
                    Meenakshi Sundharam (RA2111003010346)  
                    
