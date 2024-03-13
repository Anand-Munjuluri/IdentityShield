import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatBot.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ChatBot() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Shield AI', text: 'Hello! Please fill your details before starting KYC, Start with a Hi' },
  ]);
  const [showWhatIs, setShowWhatIs] = useState(true);
  const [showGetStarted, setShowGetStarted] = useState(true);
  const [showContactSupport, setShowContactSupport] = useState(true);
  const [showStartKYC, setShowStartKYC] = useState(false);
  const [showUploadDocument, setShowUploadDocument] = useState(false);
  const [showBasicDetails, setShowBasicDetails] = useState(true);
  const [basicDetailsIndex, setBasicDetailsIndex] = useState(0);
  const [basicDetails, setBasicDetails] = useState({
    Name: '',
    birthdate: '',
    Address: '',
    Aadhaar: '',
    incomeRange: '',
    employmentType: '',
  });
  const [selfieFile, setSelfieFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [matchPercentage, setMatchPercentage] = useState(null);

  const videoRef = useRef();
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  const handleOptionClick = (option) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'User',
      text: option,
    };
    setMessages([...messages, newMessage]);
  
    switch (option) {
      case 'What is Identity Shield?':
        setShowWhatIs(false);
        generateResponse(option);
        break;
      case 'Get started with Identity Shield':
        setShowGetStarted(false);
        generateResponse(option);
        break;
      case 'Contact support':
        setShowContactSupport(false);
        generateResponse(option);
        break;
      case 'Give Basic Info':
        setShowWhatIs(false);
        setShowGetStarted(false);
        setShowContactSupport(false);
        setShowStartKYC(false);
        setShowUploadDocument(false);
        setShowBasicDetails(true);
        setBasicDetailsIndex(0);
        generateBasicDetailsResponse();
        break;
      case 'Start KYC':
        setShowStartKYC(false);
        setShowBasicDetails(false);
        setShowUploadDocument(true);
        break;
      default:
        break;
    }
  };
  
  const generateBasicDetailsResponse = () => {
    const basicDetailKeys = Object.keys(basicDetails);
    if (basicDetailsIndex < basicDetailKeys.length) {
      const detail = basicDetailKeys[basicDetailsIndex];
      const newMessage = {
        id: messages.length + 1,
        sender: 'Shield AI',
        text: `Please provide your ${detail}:`,
      };
      setMessages([...messages, newMessage]);
    }
  };

  const handleBasicDetailsSubmit = (event) => {
    event.preventDefault();
    const detail = Object.keys(basicDetails)[basicDetailsIndex];
    const value = event.target.elements.input.value;
  
    // Create a new message for the user's response
    const newUserMessage = {
      id: messages.length + 1,
      sender: 'User',
      text: value,
    };
    // Add the user's message to the messages state
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
  
    // Move the update of basicDetails state after generating AI response
    setTimeout(() => {
      const newBasicDetails = { ...basicDetails };
      newBasicDetails[detail] = value;
      setBasicDetails(newBasicDetails);
  
      const newIndex = basicDetailsIndex + 1;
      setBasicDetailsIndex(newIndex); // Increment the index to move to the next detail
  
      if (newIndex >= Object.keys(basicDetails).length) {
        setShowBasicDetails(false);
        setShowStartKYC(true);
        toast.success('Basic info collected');
  
        setTimeout(() => {
          generateResponse('Start KYC'); // AI response for starting KYC
        }, 2000);
      } else {
        generateBasicDetailsResponse(); // Ask for the next basic detail
      }
    }, 1000);
  };
  


  const handleFileChange = (event, stateSetter) => {
    const file = event.target.files[0];
    if (file) {
      stateSetter(file);
    }
  };

  const handleSelfieUpload = (event) => {
    handleFileChange(event, setSelfieFile);
  };

  const handleIdUpload = (event) => {
    handleFileChange(event, setIdFile);
  };

  const handleUploadImages = async () => {
    try {
      const formData = new FormData();
      formData.append('id', idFile, idFile.name);
      formData.append('selfie', selfieFile, selfieFile.name);

      const response = await fetch('http://localhost:5000/compare', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const responseData = await response.json();
      const matchPercentage = responseData.match_percentage;

      setMatchPercentage(matchPercentage);

      if (matchPercentage > 30) {
        toast.success("Face verification successful");
      } else {
        toast.error("Face verification not successful");
      }

    } catch (error) {
      console.error('Error:', error.stack || error.message);
      toast.error("Failed to upload images");
    }
  };

  const generateResponse = (option) => {
    let response;
    switch (option) {
      case 'What is Identity Shield?':
        response = 'Identity Shield is a comprehensive security solution...';
        break;
      case 'Get started with Identity Shield':
        response = 'To get started with Identity Shield, please follow these steps...';
        break;
      case 'Contact support':
        response = 'You can contact support via email at support@identityshield.com';
        break;
      case 'Start KYC':
        response = 'You have started the K-Y-C process, Click on Start K-Y-C and Please upload your Aadhar/Pan softcopy and then upload your selfie';
        break;
      default:
        response = "Sorry, I didn't understand that.";
        break;
    }

    setTimeout(() => {
      const newMessage = {
        id: messages.length + 1,
        sender: 'Shield AI',
        text: response,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      speakText(response, 'en-IN');
    }, 1000);
  };

  const speakText = (text, lang) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    speech.lang = lang;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="chat-app-container">
      <header className="chat-header">
        <h1>Identity Shield</h1>
      </header>
      <div className="chat-container">
        <div className="messages-wrapper">
          <div className="messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender.toLowerCase() === 'user' ? 'user' : 'ai'}`}
              >
                {message.sender.toLowerCase() === 'user' ? (
                  <span className="sender">You</span>
                ) : (
                  <span className="sender">AI</span>
                )}
                <p className="text">{message.text}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="options-container">
          <h3>Click the options below to continue</h3>
          {showWhatIs && (
            <button onClick={() => handleOptionClick('What is Identity Shield?')}>
              What is Identity Shield?
            </button>
          )}
          {showGetStarted && (
            <button onClick={() => handleOptionClick('Get started with Identity Shield')}>
              Get started with Identity Shield
            </button>
          )}
          {showContactSupport && (
            <button onClick={() => handleOptionClick('Contact support')}>Contact support</button>
          )}
          {showStartKYC && (
            <button onClick={() => handleOptionClick('Start KYC')}>Start KYC</button>
          )}
          {showUploadDocument && (
            <div>
              <input type="file" id="selfieInput" onChange={handleSelfieUpload} />
              <input type="file" id="idInput" onChange={handleIdUpload} />
              <button onClick={handleUploadImages}>Upload Images</button>
            </div>
          )}
          {showBasicDetails && (
  <div className="basic-details-form">
    <form onSubmit={handleBasicDetailsSubmit}>
    <input 
  type="text" 
  id="input" 
  value={basicDetails[Object.keys(basicDetails)[basicDetailsIndex]] || ''}
  onChange={(event) => {
    const detail = Object.keys(basicDetails)[basicDetailsIndex];
    const newValue = event.target.value;
    setBasicDetails((prevState) => ({
      ...prevState,
      [detail]: newValue,
    }));
  }}
/>


      <button type="submit">Send</button>
    </form>
  </div>
)}

          {matchPercentage && <p>Match percentage: {matchPercentage}</p>}
          <ToastContainer />
        </div>
      </div>
      <video ref={videoRef} id="video" />
    </div>
  );
}

export default ChatBot;
