import { useState } from 'react'
import './App.css'




function App() {
  const [message, setMessage] = useState([{ text: "I'm here for you. Want to talk about what’s making you feel that way?", sender: "bot" }])
  const[inputmes , setInputmes] =useState("")

  function handleClick() {
    const newMessage = {
    text:inputmes ,
    sender: "user" 
  };
   setMessage([...message, newMessage]);
   setInputmes("")
  }

  const handleChange = (event) => {
    setInputmes(event.target.value);
  };
  

  return(
     <div className="app">
      <div className="chat-container">

        {/* Header */}
        <div className="chat-header">
          <h2>MindEase Chatbot</h2>
        </div>

        {/* Chat Window */}
        <div className="chat-window">
        {message.map((msg, index) => (
        <div key={index} className={`message-bubble ${msg.sender}`}>
          <p>{msg.text}</p>
        </div>
        ))}
        </div>

        {/* Input Bar */}
        <div className="input-bar">
          <input type="text" placeholder="Type your message..."value={inputmes}
        onChange={handleChange}
        onKeyDown={(e) => {
        if (e.key === "Enter") {
         handleClick();  
        }
        }}
        />
        
          <button onClick={handleClick}>Send</button>
        </div>

      </div>
    </div>
  );
}

export default App
