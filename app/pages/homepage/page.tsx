"use client";
import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import { FiUpload, FiMic, FiSend, FiCopy, FiVolume2 } from "react-icons/fi";
import { BsRobot, BsPerson } from "react-icons/bs";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  isOCR?: boolean;
};

export default function OCRChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      addMessage(text, "user", true);
    } catch (error) {
      console.error("OCR error:", error);
      addMessage("Failed to extract text from image.", "ai");
    } finally {
      setOcrLoading(false);
    }
  };

  const addMessage = (content: string, sender: "user" | "ai", isOCR = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      isOCR
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    addMessage(input, "user");
    setInput("");

    // Simulate AI response (replace with actual API call)
    setLoading(true);
    setTimeout(() => {
      addMessage(`I received your ${input.length > 20 ? "long" : "short"} message. This would be connected to the ChatGPT API in production.`, "ai");
      setLoading(false);
    }, 1000);
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      alert("Your browser does not support speech synthesis.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-800">OCR Chat Assistant</h1>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-center max-w-md">
              <BsRobot className="mx-auto text-4xl mb-4 text-indigo-500" />
              <h2 className="text-xl font-medium mb-2">Upload an image or type your question</h2>
              <p className="mb-6">I can extract text from images and answer your questions</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition mx-auto"
              >
                <FiUpload /> Upload Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-3xl rounded-lg p-4 ${message.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-200"
                  }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === "user" ? (
                    <BsPerson className="flex-shrink-0" />
                  ) : (
                    <BsRobot className="flex-shrink-0 text-indigo-500" />
                  )}
                  <span className="font-medium">
                    {message.sender === "user" ? "You" : "Assistant"}
                  </span>
                  {message.isOCR && (
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded ml-2">
                      OCR
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-line">{message.content}</p>
                {message.sender === "ai" && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => speak(message.content)}
                      className={`p-1.5 rounded-full ${isSpeaking ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 transition`}
                      title={isSpeaking ? 'Stop reading' : 'Read aloud'}
                    >
                      <FiVolume2 size={14} />
                    </button>
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                      title="Copy to clipboard"
                    >
                      <FiCopy size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-3xl rounded-lg p-4 bg-white border border-gray-200">
              <div className="flex items-center gap-2">
                <BsRobot className="text-indigo-500" />
                <span className="font-medium">Assistant</span>
              </div>
              <div className="flex space-x-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        {ocrLoading && (
          <div className="flex justify-end">
            <div className="max-w-3xl rounded-lg p-4 bg-indigo-600 text-white">
              <div className="flex items-center gap-2">
                <BsPerson />
                <span className="font-medium">You</span>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded ml-2">
                  OCR Processing
                </span>
              </div>
              <div className="flex space-x-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message or upload an image..."
              className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none max-h-32"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              title="Upload image"
            >
              <FiUpload />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() && !ocrLoading}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
}