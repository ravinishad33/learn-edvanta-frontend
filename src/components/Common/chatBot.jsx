import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { useSelector } from "react-redux";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Safe access to redux state
  const reduxUser = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // FIXED: Used optional chaining to prevent crash when reduxUser is null
        body: JSON.stringify({ 
          message, 
          role: reduxUser?.role || "guest", 
          userName: reduxUser?.name || "" 
        }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: data.reply },
      ]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "bot",
          text: "I'm having trouble connecting. Check your internet or try again!",
        },
      ]);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <>
      <div onClick={toggleChat} className="fixed bottom-6 right-6 z-50 cursor-pointer group">
        <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 shadow-lg transition duration-300 group-hover:scale-110">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <BsStars className="text-indigo-600 text-xs animate-pulse" />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[330px] h-[400px] backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40">
          <div className="px-4 py-3 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <BsStars className="text-indigo-600 text-sm" />
            </div>
            <div>
              <div className="text-sm font-semibold">Edvanta AI</div>
              <div className="text-xs opacity-80">Online • Ready</div>
            </div>
          </div>

          <div ref={chatRef} className="flex-1 p-3 overflow-y-auto space-y-3 bg-gradient-to-b from-white/40 to-white/10">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-16">
                Hi 👋 Ask me about courses, students, or Edvanta features.
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`max-w-[75%] px-3 py-2 text-sm rounded-xl ${msg.sender === "user" ? "ml-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white" : "bg-white shadow text-gray-700"}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bg-white px-3 py-2 rounded-xl w-fit shadow">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white/60 border-t flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              className="flex-1 px-3 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button onClick={sendMessage} className="p-2 rounded-full bg-indigo-600 text-white hover:scale-110 transition">
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;