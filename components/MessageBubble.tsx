import React from 'react';
import { Role, Message } from '../types';
import { Bot, User, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex gap-4 w-full max-w-4xl mx-auto p-4 ${isUser ? 'bg-transparent' : 'bg-transparent'}`}>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-gray-700' : 'bg-gradient-to-br from-primary-500 to-purple-600'
      }`}>
        {isUser ? <User className="w-5 h-5 text-gray-300" /> : <Bot className="w-5 h-5 text-white" />}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-200">
            {isUser ? 'You' : 'Gemini'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map((att, idx) => (
              <img 
                key={idx}
                src={att.previewUrl} 
                alt="attachment" 
                className="max-h-64 rounded-lg border border-gray-700 object-contain"
              />
            ))}
          </div>
        )}

        <div className={`prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed break-words`}>
           {/* Simple Markdown Rendering since we cannot guarantee complex plugins */}
           {/* We use pre-wrap for streaming text to maintain whitespace until markdown parses it fully */}
           {message.text ? (
             <div className="markdown-body">
                {/* 
                  Using a simple div with whitespace-pre-wrap as a fallback or a basic markdown parser 
                  if available. Since the prompt allows popular libs, we assume standard behavior or basic text.
                  Ideally we'd use 'react-markdown' here.
                */}
                <ReactMarkdown>{message.text}</ReactMarkdown>
             </div>
           ) : (
             <span className="animate-pulse inline-block w-2 h-4 bg-gray-500 rounded"></span>
           )}
        </div>

        {message.isError && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50 mt-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Error processing request. Please check your API key or connection.</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
