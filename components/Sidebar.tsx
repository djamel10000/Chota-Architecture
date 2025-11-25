import React from 'react';
import { Settings, Sliders, Cpu, MessageSquare, Search, Zap } from 'lucide-react';
import { ModelConfig, AVAILABLE_MODELS } from '../types';

interface SidebarProps {
  config: ModelConfig;
  setConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, isOpen, toggleSidebar }) => {
  const handleChange = (key: keyof ModelConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-gray-950 border-r border-gray-800 flex flex-col h-full overflow-y-auto shrink-0 transition-all duration-300 ease-in-out">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary-500" />
          Configuration
        </h2>
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white lg:hidden">
          ✕
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Model Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Model
          </label>
          <div className="relative">
            <select
              value={config.modelName}
              onChange={(e) => handleChange('modelName', e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 appearance-none"
            >
              {AVAILABLE_MODELS.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* System Instructions */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> System Instructions
          </label>
          <textarea
            value={config.systemInstruction}
            onChange={(e) => handleChange('systemInstruction', e.target.value)}
            className="w-full h-32 bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 resize-none"
            placeholder="Define how the model should behave..."
          />
        </div>

        {/* Parameters */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4" /> Parameters
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Temperature</span>
              <span>{config.temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Top K</span>
              <span>{config.topK}</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={config.topK}
              onChange={(e) => handleChange('topK', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>

           <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Top P</span>
              <span>{config.topP}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.topP}
              onChange={(e) => handleChange('topP', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>
        </div>

        {/* Tools */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Tools & Capabilities
          </label>
          
          <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800">
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-200">Google Search</span>
                <span className="text-xs text-gray-500">Grounding with web results</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={config.useSearch} 
                onChange={(e) => handleChange('useSearch', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex flex-col p-3 bg-gray-900 rounded-lg border border-gray-800 gap-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-purple-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-200">Thinking</span>
                  <span className="text-xs text-gray-500">Extended reasoning process</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.useThinking} 
                  onChange={(e) => handleChange('useThinking', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            {config.useThinking && (
               <div className="space-y-2 mt-2 pt-2 border-t border-gray-800">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Budget (Tokens)</span>
                  <span>{config.thinkingBudget}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8192" 
                  step="128"
                  value={config.thinkingBudget}
                  onChange={(e) => handleChange('thinkingBudget', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
