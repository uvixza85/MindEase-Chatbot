import { useState,useRef, useEffect } from 'react'
import './App.css'


const systemPrompt = "You are a compassionate, non-judgmental, and empathetic mental health support bot. Your primary goal is to provide a safe space for users to express their feelings, offer supportive listening, and share general, non-medical advice on coping mechanisms. You must not diagnose conditions or act as a therapist. If a user expresses any thoughts of self-harm or is in a crisis, you must immediately and directly provide a clear message to contact emergency services or a mental health helpline.";

async function getChatbotResponse(userMessage) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
                ],
                "stream":false
            })
        });

        const data = await response.json(); // <--- Parse JSON here
        return data.choices[0].message.content;

    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        if (error.status === 429) {
            return "I'm sorry, I'm currently too busy to respond. Please try again in a moment.";
        }
        return "I'm sorry, something went wrong. Please try again.";
    }
}




function App() {
  const [message, setMessage] = useState([{ text: "I'm here for you. Want to talk about what’s making you feel that way?", sender: "bot" }])
  const[inputmes , setInputmes] =useState("")
  const chatWindowRef = useRef(null);

  async function handleClick() {
    if (!inputmes.trim()) return;
    const newMessage = {
    text:inputmes ,
    sender: "user" 
  };
       setMessage((prevMessages) => [...prevMessages, newMessage]);
    setInputmes(""); // clear input

    try {
        const botreply = await getChatbotResponse(newMessage.text);
        const newMessageb = {
            text: botreply,
            sender: "bot"
        };
        // Add bot’s reply after it's received
        setMessage((prevMessages) => [...prevMessages, newMessageb]);
    } catch (err) {
        console.error(err);
    }
  }

  useEffect(() => {
    if (chatWindowRef.current) {
        chatWindowRef.current.scrollTo({
            top: chatWindowRef.current.scrollHeight,
            behavior: "smooth" // smooth scrolling
        });
    }
}, [message]); // runs every time messages update


  const handleChange = (event) => {
    setInputmes(event.target.value);
  };
  

  return(
     <div className="app">

      <div className="chat-container">

        {/* Header */}
        <div className="chat-header">
          <h2>MindEase Chatbot</h2>
        
         <div className="safety-notice">
          This is a safe space. If you need immediate help, please reach out to a professional.
        </div>
        </div>

        {/* Chat Window */}
        <div className="chat-window" ref={chatWindowRef}>
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
