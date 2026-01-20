import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // backend URL

const Dashboard = () => {
  const { state } = useLocation();
  const username = state?.username || "Unknown";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Fetch previous messages from database
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/chat/messages`);
        setMessages(res.data);
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };
    fetchMessages();

    // Listen for new messages
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // cleanup
    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const msgData = { username, message };
    socket.emit("sendMessage", msgData);
    setMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{username}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          [...messages].reverse().map((msg, idx) => (
            <div key={idx} className={`flex ${msg.username === username ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs md:max-w-md ${
                msg.username === username 
                  ? "bg-blue-600 text-white rounded-lg rounded-tr-none" 
                  : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg rounded-tl-none"
              } px-4 py-2`}>
                <p className="text-xs opacity-70 mb-1">{msg.username}</p>
                <p className="text-sm break-words">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2 bg-white dark:bg-gray-900 flex-shrink-0">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
          autoFocus
        />
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:bg-gray-400"
          disabled={!message.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
