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
  const [showIdentityProofOptions, setShowIdentityProofOptions] = useState(false);
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
        setShowIdentityProofOptions(true);
        break;
      default:
        break;
    }

    if (option !== 'Start KYC') {
      generateResponse(option);
    }
  };

  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      const formData = new FormData();
      formData.append('image1', imageFile);

      try {
        const response = await fetch('/match-faces', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        const data = await response.json();
        generateResponse(data.match_percentage);
      } catch (error) {
        console.error('Error:', error.message);
      }
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
        response = 'You have started the KYC process.';
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

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      })
      .catch((err) => console.error('Error accessing camera:', err));
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg');

    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'captured_photo.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          {showIdentityProofOptions && (
            <div>
              <button onClick={() => document.getElementById('fileInput').click()}>
                Upload Identity Proof
              </button>
              {!streaming && <button onClick={startCamera}>Capture Identity Proof</button>}
              {streaming && <button onClick={capturePhoto}>Capture Photo</button>}
            </div>
          )}
        </div>
      </div>
      <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleImageUpload} />
      <video ref={videoRef} id="video" />
      <canvas ref={canvasRef} id="canvas" style={{ display: 'none' }} />
    </div>
  );
}

export default ChatBot;
