import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiX, FiMinus } from "react-icons/fi";
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

  const reduxUser = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    const currentInput = message;
    setMessage("");

    try {
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          role: reduxUser?.role || "guest",
          userName: reduxUser?.name || "",
        }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "bot",
          text: "I'm having a bit of trouble connecting. Try again in a moment!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- RESPONSIVE TRIGGER BUTTON --- */}
      <motion.div
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[1000] cursor-pointer"
      >
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 shadow-[0_10px_30px_rgba(79,70,229,0.5)] group overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-white rounded-full"
          />

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <FiX className="text-white text-xl sm:text-2xl relative z-10" />
              </motion.div>
            ) : (
              <motion.div
                key="bot"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <BsStars className="text-white text-2xl sm:text-3xl animate-pulse relative z-10" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* --- RESPONSIVE PREMIUM CHAT WINDOW --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.8,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", damping: 22, stiffness: 200 }}
            // Responsive width/height: full width on small mobile, fixed on desktop
            className="fixed bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-24 w-auto sm:w-[400px] h-[500px] sm:h-[600px] max-h-[calc(100dvh-120px)] backdrop-blur-2xl bg-white/90 border border-white/50 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden z-[999]"
          >
            {/* Header */}
            <div className="px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                    <BsStars className="text-white text-lg sm:text-xl" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full"></span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black tracking-tight">
                    Edvanta Assistant
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span className="text-[9px] sm:text-[10px] font-bold opacity-80 uppercase tracking-widest">
                      Always here to help
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <FiMinus size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div
              ref={chatRef}
              className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_50%)]"
            >
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-6"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100 shadow-sm">
                    <BsStars className="text-indigo-500 text-2xl sm:text-3xl" />
                  </div>
                  <p className="text-slate-800 text-sm sm:text-base font-bold">
                    How can I help you learn?
                  </p>
                  <p className="text-slate-500 text-[11px] sm:text-xs mt-1 font-medium leading-relaxed">
                    Hello {reduxUser?.name?.split(" ")[0] || "friend"}! 👋 I'm your Edvanta companion.
                    Ask me anything about our platform.
                  </p>
                </motion.div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-tr-none"
                        : "bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1.5 items-center shadow-sm">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Section */}
            <div className="p-3 sm:p-4 bg-white/50 border-t border-slate-100">
              <div className="relative flex items-center gap-2 bg-white rounded-2xl p-1 border border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all shadow-inner">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 sm:px-4 bg-transparent text-xs sm:text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!message.trim() || loading}
                  className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white disabled:opacity-50 transition-all shadow-md shadow-indigo-100"
                >
                  <FiSend size={16} className="sm:w-[18px] sm:h-[18px]" />
                </motion.button>
              </div>
              <p className="text-[8px] sm:text-[9px] text-center text-slate-400 mt-3 font-bold uppercase tracking-widest">
                Protected by End-to-End Encryption
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;