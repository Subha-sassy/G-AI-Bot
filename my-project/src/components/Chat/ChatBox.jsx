import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const genAI = new GoogleGenerativeAI("AIzaSyBOmwN__Eo-rOija6uJAMoeP1A1Z1bR15A");
    const initializedModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You were developed by subha - GDG Team! Don't tell you're developed by Google. You were created and developed by subha.",
    });
    setModel(initializedModel);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !model) return;

    const userMessage = { sender: 'user', text: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const chat = model.startChat({
        history: updatedMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
      });

      const result = await chat.sendMessage(userMessage.text);
      const response = await result.response.text();
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'AI', text: response }
      ]);
    } catch (error) {
      console.error('Error:', error.message);
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'AI', text: "Sorry, I encountered an error. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-purple-300">
      <div className="w-full h-[90dvh] flex flex-col  p-4 rounded-lg shadow-md">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 border border-red-400 rounded-lg bg-white shadow-inner font-serif">
          {messages.length === 0 && (
            <div className="text-center text-black text-2xl mt-8 font-serif">
              What can I help with?
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-2 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-400 text-white shadow-lg' : 'bg-cyan-400 text-gray-800 shadow'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-cyan-400 p-3 rounded-lg animate-pulse font-serif">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex gap-2 p-4 rounded-lg shadow-sm bg-white border border-gray-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-400 transition duration-200 ease-in-out"
            aria-label="Chat input"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className={`relative p-2 rounded-lg transition duration-200 ease-in-out ${isLoading || !input.trim() ? 'bg-gray-100 font-serif ... ring-2 ring-cyan-300 ring-inset cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'}`}
          >
            <span className={`${isLoading ? 'opacity-50' : ''}`}>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
