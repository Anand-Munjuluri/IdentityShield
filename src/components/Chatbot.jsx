import { useState, useRef, useEffect } from 'react';
import '../styles/ChatBot.css';

function ChatBot() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Shield AI', text: 'Hello! How can I assist you today?' },
  ]);
  const [showWhatIs, setShowWhatIs] = useState(true);
  const [showGetStarted, setShowGetStarted] = useState(true);
  const [showContactSupport, setShowContactSupport] = useState(true);
  const [showStartKYC, setShowStartKYC] = useState(true);
  const [showUploadDocument, setShowUploadDocument] = useState(false);
  const [selfieFile, setSelfieFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [matchPercentage, setMatchPercentage] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();
  const [streaming, setStreaming] = useState(false);

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
        break;
      case 'Get started with Identity Shield':
        setShowGetStarted(false);
        break;
      case 'Contact support':
        setShowContactSupport(false);
        break;
      case 'Start KYC':
        setShowStartKYC(false);
        setShowUploadDocument(true);
        break;
      default:
        break;
    }

    if (option !== 'Start KYC') {
      generateResponse(option);
    }
  };

  const handleFileChange = (event, stateSetter) => {
    const file = event.target.files[0]; // Access the first selected file
    if (file) {
      stateSetter(file); // Update state only if a file is selected
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
  
      // Append ID image file
      formData.append('id', idFile, idFile.name);
      
      // Append selfie image file
      formData.append('selfie', selfieFile, selfieFile.name);
  
      const response = await fetch('http://localhost:5000/compare', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload images');
      }
  
      const responseData = await response.json(); // Retrieve processed data from Flask
      console.log('Processed data:', responseData);
  
      // Set the processed data to state or handle it as needed
  
    } catch (error) {
      console.error('Error:', error.stack || error.message);
      // Handle error: log error message or display it to the user
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
        response = 'You have started the KYC process. Please upload your Aadhar or PAN soft copy.';
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
          {matchPercentage && <p>Match percentage: {matchPercentage}</p>}
        </div>
      </div>
      <video ref={videoRef} id="video" style={{ display: streaming ? 'block' : 'none' }} />
    </div>
  );
}

export default ChatBot;
