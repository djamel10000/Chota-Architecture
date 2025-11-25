import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ModelConfig, Message, Role } from "../types";

interface StreamCallbacks {
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export const sendMessageStream = async (
  apiKey: string,
  history: Message[],
  newMessage: string,
  attachments: { base64: string; mimeType: string }[],
  config: ModelConfig,
  callbacks: StreamCallbacks
) => {
  if (!apiKey) {
    callbacks.onError(new Error("API Key is missing. Please provide your Gemini API key."));
    return;
  }

  // Initialize AI client with the provided API key
  const ai = new GoogleGenAI({ apiKey });

  try {
    // 1. Prepare Configuration
    const generationConfig: any = {
      temperature: config.temperature,
      topK: config.topK,
      topP: config.topP,
      systemInstruction: config.systemInstruction,
    };

    // Tools Configuration
    const tools: any[] = [];
    if (config.useSearch) {
      tools.push({ googleSearch: {} });
    }

    // Thinking Configuration (Only for 2.5 models mostly, but we apply if enabled)
    // Note: Thinking config is usually specific to certain models or modes.
    // Logic: If user specifically enabled thinking, we apply the budget.
    if (config.useThinking) {
      generationConfig.thinkingConfig = {
        thinkingBudget: config.thinkingBudget
      };
    }

    if (tools.length > 0) {
      generationConfig.tools = tools;
    }

    // 2. Prepare History for Chat
    // The SDK Chat helper manages history, but for a stateless functional approach or complex multimodal history,
    // sometimes we rebuild the chat. Here we will use ai.chats.create with previous history.
    // Note: Multimodal history support in `chats` can be tricky depending on SDK version. 
    // We will map our internal Message type to the SDK's Content format.

    const validHistory = history.map(msg => {
      const parts: any[] = [];

      // Add attachments if any (Images)
      if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach(att => {
          // Remove prefix like "data:image/png;base64,"
          const base64Data = att.base64.split(',')[1];
          parts.push({
            inlineData: {
              mimeType: att.mimeType,
              data: base64Data
            }
          });
        });
      }

      // Add text
      if (msg.text) {
        parts.push({ text: msg.text });
      }

      return {
        role: msg.role === Role.USER ? 'user' : 'model',
        parts: parts
      };
    });

    // 3. Create Chat Session
    const chat = ai.chats.create({
      model: config.modelName,
      config: generationConfig,
      history: validHistory,
    });

    // 4. Prepare Current Message
    // If there are attachments for the *current* message, we need to pass them in sendMessageStream.
    // The `sendMessageStream` accepts a `message` which can be string or Part[].

    let messagePayload: string | Array<any> = newMessage;

    if (attachments.length > 0) {
      const parts: any[] = [];
      attachments.forEach(att => {
        const base64Data = att.base64.split(',')[1];
        parts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: base64Data
          }
        });
      });
      if (newMessage) {
        parts.push({ text: newMessage });
      }
      messagePayload = parts;
    }

    // 5. Send Message
    const resultStream = await chat.sendMessageStream({ message: messagePayload });

    for await (const chunk of resultStream) {
      const responseChunk = chunk as GenerateContentResponse;
      const text = responseChunk.text;
      if (text) {
        callbacks.onChunk(text);
      }
      // Check for grounding metadata in chunks if needed, usually in the final response aggregation
      // We are streaming text primarily. Grounding metadata usually comes in the candidates.
    }

    callbacks.onComplete();

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    callbacks.onError(error);
  }
};
