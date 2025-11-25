import React, { useState, useRef, useEffect } from 'react';
import { Menu, Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import InputArea from './components/InputArea';
import MessageBubble from './components/MessageBubble';
import ApiKeyModal from './components/ApiKeyModal';
import { ModelConfig, DEFAULT_CONFIG, Message, Role, Attachment } from './types';
import { sendMessageStream } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<ModelConfig>(DEFAULT_CONFIG);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      // Check if there's a dev environment key
      const envKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (envKey) {
        setApiKey(envKey);
      } else {
        setShowApiKeyModal(true);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text,
      attachments,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Create placeholder for AI response
    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg: Message = {
      id: aiMsgId,
      role: Role.MODEL,
      text: '',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, aiMsg]);

    await sendMessageStream(
      apiKey,
      messages.concat(userMsg), // History includes the new user message
      text, // Current message text (redundant but handled in service for clarity)
      attachments.map(a => ({ base64: a.base64, mimeType: a.mimeType })),
      config,
      {
        onChunk: (chunkText) => {
          setMessages(prev => prev.map(msg =>
            msg.id === aiMsgId ? { ...msg, text: msg.text + chunkText } : msg
          ));
        },
        onComplete: () => {
          setIsLoading(false);
        },
        onError: (err) => {
          console.error(err);
          setMessages(prev => prev.map(msg =>
            msg.id === aiMsgId ? { ...msg, isError: true, text: "An error occurred." } : msg
          ));
          setIsLoading(false);
        }
      }
    );
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsLoading(false);
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleOpenApiKeyModal = () => {
    setShowApiKeyModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      {/* Sidebar (Config) */}
      <Sidebar
        config={config}
        setConfig={setConfig}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        apiKey={apiKey}
        onOpenApiKeyModal={handleOpenApiKeyModal}
      />

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleSaveApiKey}
        currentKey={apiKey}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <header className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-950/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <h1 className="font-semibold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Chota Architect
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-[10px] text-gray-400 font-mono">
              {config.modelName}
            </span>
          </div>

          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors border border-gray-700"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-gray-900/30">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl mb-6 flex items-center justify-center border border-gray-700">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-200 mb-2">Welcome to Chota Architect</h2>
              <p className="max-w-md text-sm">
                Start by typing a prompt below. Configure system instructions, temperature, and thinking budget in the sidebar.
              </p>
            </div>
          ) : (
            <div className="py-6 space-y-6">
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;