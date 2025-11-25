import { Type } from "@google/genai";

export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Attachment {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  attachments?: Attachment[];
  timestamp: number;
  isError?: boolean;
  groundingMetadata?: any; // For search results
}

export interface ModelConfig {
  modelName: string;
  temperature: number;
  topK: number;
  topP: number;
  systemInstruction: string;
  useSearch: boolean;
  useThinking: boolean;
  thinkingBudget: number;
}

export const DEFAULT_CONFIG: ModelConfig = {
  modelName: 'gemini-2.5-flash',
  temperature: 1,
  topK: 64,
  topP: 0.95,
  systemInstruction: 'You are a helpful, expert AI assistant. Answer concisely and accurately.',
  useSearch: false,
  useThinking: false,
  thinkingBudget: 1024,
};

export const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro Preview' },
  { id: 'gemini-2.5-flash-thinking', name: 'Gemini 2.5 Flash (Thinking)' }, // Logical grouping for UI, handled via config
];
