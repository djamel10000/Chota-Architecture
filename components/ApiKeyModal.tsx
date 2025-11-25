import React, { useState } from 'react';
import { Key, X, AlertCircle, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (apiKey: string) => void;
    currentKey?: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, currentKey }) => {
    const [apiKey, setApiKey] = useState(currentKey || '');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!apiKey.trim()) {
            setError('API key cannot be empty');
            return;
        }

        // Basic validation for Gemini API key format
        if (!apiKey.startsWith('AIza')) {
            setError('Invalid API key format. Gemini API keys start with "AIza"');
            return;
        }

        if (apiKey.length < 30) {
            setError('API key seems too short. Please check and try again.');
            return;
        }

        setError('');
        onSave(apiKey);
        onClose();
    };

    const handleClear = () => {
        setApiKey('');
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-lg w-full shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <Key className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">API Key Required</h2>
                            <p className="text-sm text-gray-400">Enter your Gemini API key to continue</p>
                        </div>
                    </div>
                    {currentKey && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Info Alert */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-300">
                            <p className="font-medium text-blue-300 mb-1">Why do I need this?</p>
                            <p>This app requires a Gemini API key to function. Your key is stored locally in your browser and never sent to our servers.</p>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                            Gemini API Key
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => {
                                setApiKey(e.target.value);
                                setError('');
                            }}
                            placeholder="AIza..."
                            className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                        {error && (
                            <p className="text-sm text-red-400 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Get API Key Link */}
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Get your free API key from Google AI Studio
                    </a>

                    {/* Security Note */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                        <p className="text-xs text-gray-400">
                            🔒 <span className="font-medium">Privacy:</span> Your API key is stored only in your browser's localStorage and is never transmitted to any server except Google's Gemini API.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-800">
                    {currentKey && (
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                        >
                            Clear
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                    >
                        Save API Key
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;
