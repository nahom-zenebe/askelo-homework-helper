"use client";
import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import { FiUpload, FiMic, FiSend, FiCopy, FiVolume2, FiMicOff } from "react-icons/fi";
import { BsRobot, BsPerson } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { authClient } from "@/app/lib/auth-client"
type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  isOCR?: boolean;
  isVoice?: boolean;
  timestamp: Date;
};

export default function OCRChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState({

    synthesis: false,
    recognition: false
  });
  const { 
    data: session, 
    isPending, //loading state
    error, //error object
    refetch //refetch the session
} = authClient.useSession() 
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check browser speech support
  useEffect(() => {
    setSpeechSupported({
      synthesis: 'speechSynthesis' in window,
      recognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    });

    if ('webkitSpeechRecognition' in window) {
      // @ts-ignore - webkit prefixed version
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      // @ts-ignore - standard version
      recognitionRef.current = new (window as any).SpeechRecognition();
    }

    if (recognitionRef.current) {
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

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

    // Display the uploaded image
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setOcrLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      addMessage(text, "user", true);
      setUploadedImage(null); // Clear the image after OCR
    } catch (error) {
      console.error("OCR error:", error);
      addMessage("Failed to extract text from image.", "ai");
    } finally {
      setOcrLoading(false);
    }
  };

  const addMessage = (content: string, sender: "user" | "ai", isOCR = false, isVoice = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      isOCR,
      isVoice,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const trimmedInput = input.trim();
    if (!trimmedInput && !uploadedImage) return;
  
    // Add user message to UI
    addMessage(trimmedInput, "user", false, isListening);
    const userInput = trimmedInput;
    setInput("");
    setLoading(true);
  
    try {
      const payload = {
        userId: session?.user.id,
        reason: userInput,        // userInput is now treated as reason (optional)
        extractedText: null       // you can later support extractedText if needed
      };
  
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || "AI request failed");
  
      addMessage(data.task.explanation, "ai");
    } catch (error) {
      console.error("AI error:", error);
      addMessage("Sorry, I encountered an error processing your request.", "ai");
    } finally {
      setLoading(false);
    }
  };
  

  const toggleSpeech = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      setInput(""); // Clear input for new voice input
    }
  };

  const speak = (text: string) => {
    if (!speechSupported.synthesis) {
      alert("Your browser doesn't support text-to-speech");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("SpeechSynthesis error", event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f7f7f8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Askelo </h1>
        
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-center max-w-md">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-80"></div>
                <BsRobot className="absolute inset-0 m-auto text-2xl text-white" />
              </div>
              <h2 className="text-xl font-medium mb-2 text-gray-700">Upload an image or ask a question</h2>
              <p className="mb-6 text-gray-500">I can extract text from images and answer your questions with AI</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition shadow-md"
                >
                  <FiUpload /> Upload Image
                </button>
                {speechSupported.recognition && (
                  <button
                    onClick={toggleSpeech}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition shadow-md ${isListening ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {isListening ? <FiMicOff /> : <FiMic />}
                    {isListening ? 'Stop' : 'Speak'}
                  </button>
                )}
              </div>
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
                className={`max-w-3xl rounded-lg p-4 relative ${message.sender === "user"
                  ? "bg-purple-400 text-white"
                  : "bg-white border border-gray-200"
                  } shadow-sm`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === "user" ? (
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                      <BsPerson className="text-white text-sm" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <BsRobot className="text-white text-sm" />
                    </div>
                  )}
                  <span className="font-medium text-black">
                    {message.sender === "user" ? "You" : "Askelo"}
                  </span>
                  <span className="text-xs opacity-70 ml-2">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.isOCR && (
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded ml-auto">
                      OCR
                    </span>
                  )}
                  {message.isVoice && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded ml-auto">
                      Voice
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-line text-black mt-2">{message.content}</p>
                {message.sender === "ai" && (
                  <div className="flex gap-2 mt-3 justify-end">
                    {speechSupported.synthesis && (
                      <button
                        onClick={() => speak(message.content)}
                        className={`p-1.5 rounded-full ${isSpeaking ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 transition`}
                        title={isSpeaking ? 'Stop reading' : 'Read aloud'}
                      >
                        <FiVolume2 size={14} />
                      </button>
                    )}
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
        {uploadedImage && (
          <div className="flex justify-end">
            <div className="max-w-xs rounded-lg overflow-hidden relative shadow-md">
              <img src={uploadedImage} alt="Uploaded preview" className="w-full h-auto" />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                <button 
                  onClick={clearUploadedImage}
                  className="text-white hover:text-gray-200"
                >
                  <IoMdClose />
                </button>
              </div>
              <div className="bg-indigo-600text-black text-xs p-2 text-center">
                Processing image...
              </div>
            </div>
          </div>
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-3xl rounded-lg p-4 bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <BsRobot className="text-white text-sm" />
                </div>
                <span className="font-medium">Askelo</span>
              </div>
              <div className="flex space-x-2 mt-3">
                <div className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        {ocrLoading && (
          <div className="flex justify-end">
            <div className="max-w-3xl rounded-lg p-4 bg-indigo-200 text-white shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center">
                  <BsPerson className="text-white text-sm" />
                </div>
                <span className="font-medium">{session ? session?.user.name: 
                "Guest" }</span>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded ml-auto">
                  Processing Image
                </span>
              </div>
              <div className="flex space-x-2 mt-3">
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
              placeholder={isListening ? "Listening... Speak now" : "Type your message or upload an image..."}
              className="w-full border text-black border-gray-300 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none max-h-32 bg-white shadow-sm"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isListening}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-10 top-3 text-gray-400 hover:text-gray-600"
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
          {speechSupported.recognition && (
            <button
              type="button"
              onClick={toggleSpeech}
              className={`p-3 rounded-lg flex items-center justify-center ${isListening ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} shadow-sm`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <FiMicOff size={18} /> : <FiMic size={18} />}
            </button>
          )}
          <button
            type="submit"
            disabled={(!input.trim() && !isListening) || loading || ocrLoading}
            className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center"
          >
            <FiSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}