"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  ChatMessage,
  ChatState,
  GeminiModelInfo,
} from "@/shared/types/chat.types";
import {
  CONNECTION_STATUS,
  DEFAULT_GEMINI_MODEL,
  GeminiModel,
} from "@/shared/constants/gemini.constants";
import {
  fetchGeminiModels,
  generateContent,
} from "@/shared/services/gemini.service";
import {
  logger,
  logError,
  getFriendlyErrorMessage,
} from "@/shared/utils/logger";

export const useChat = (systemInstruction?: string, userApiKey?: string) => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    inputText: "",
    selectedModel: DEFAULT_GEMINI_MODEL,
    connectionStatus: CONNECTION_STATUS.IDLE,
    isLoading: false,
    error: null,
  });

  const [availableModels, setAvailableModels] = useState<GeminiModelInfo[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const systemInstructionRef = useRef(systemInstruction);
  
  const isInitializing = useRef(false);
  const hasLoadedModels = useRef(false);

  useEffect(() => {
    systemInstructionRef.current = systemInstruction;
  }, [systemInstruction]);

  useEffect(() => {
    if (availableModels.length > 0) {
      const current = chatState.selectedModel;
      const isValid = availableModels.some((m) => m.name === current);
      if (!isValid || current === DEFAULT_GEMINI_MODEL) {
        setChatState((prev) => ({
          ...prev,
          selectedModel: availableModels[0].name as GeminiModel,
        }));
      }
    }
  }, [availableModels.length]);

  const initializeChat = useCallback(
    async (apiKey?: string) => {
      if (!apiKey?.trim()) {
        setChatState((prev) => ({
          ...prev,
          connectionStatus: CONNECTION_STATUS.IDLE,
          messages: prev.messages.length === 0 ? [{
            id: 'welcome',
            text: '👋 Вітаю! Будь ласка, введіть свій Gemini API Key у полі вище, щоб почати роботу з 3D сценою.',
            sender: 'bot',
            timestamp: Date.now()
          }] : prev.messages
        }));
        hasLoadedModels.current = false;
        return;
      }

      if (isInitializing.current || hasLoadedModels.current) return;

      isInitializing.current = true;
      setChatState((prev) => ({
        ...prev,
        connectionStatus: CONNECTION_STATUS.CONNECTING,
        error: null,
      }));

      try {
        const models = await fetchGeminiModels(apiKey);
        setAvailableModels(models);
        setChatState((prev) => ({
          ...prev,
          connectionStatus: CONNECTION_STATUS.CONNECTED,
        }));
        hasLoadedModels.current = true;
        logger.info("Chat initialized successfully");
      } catch (error: any) {
        hasLoadedModels.current = false;
        const msg = getFriendlyErrorMessage(error);
        logError("InitializeChat", error);
        setChatState((prev) => ({
          ...prev,
          connectionStatus: CONNECTION_STATUS.ERROR,
          error: msg,
        }));
      } finally {
        isInitializing.current = false;
      }
    },
    [availableModels.length]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userApiKey && userApiKey.length > 10) {
        initializeChat(userApiKey);
      } else if (!userApiKey) {
        initializeChat("");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [userApiKey, initializeChat]);

  const handleSendMessage = useCallback(
    async (onAgentResponse?: (text: string) => void, apiKey?: string) => {
      if (!chatState.inputText.trim() || chatState.isLoading || !apiKey) return;

      const userText = chatState.inputText;
      const userMessage: ChatMessage = {
        id: Date.now(),
        text: userText,
        sender: "user",
        timestamp: Date.now(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        inputText: "",
        isLoading: true,
        error: null,
      }));

      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      try {
        const history = chatState.messages
          .filter((msg) => !msg.error && msg.id !== "welcome")
          .map((msg) => ({
            role: (msg.sender === "user" ? "user" : "bot") as "user" | "bot",
            text: msg.text,
          }));

        const response = await generateContent(
          userText,
          chatState.selectedModel,
          history,
          systemInstructionRef.current,
          apiKey,
        );
        
        const botMessage: ChatMessage = {
          id: Date.now() + 1,
          text: response.text,
          sender: "bot",
          timestamp: Date.now(),
        };

        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
          isLoading: false,
        }));
        
        if (onAgentResponse) onAgentResponse(response.text);
      } catch (error: any) {
        if (error.name === "AbortError") return;
        const friendlyMsg = getFriendlyErrorMessage(error);
        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          error: friendlyMsg,
          messages: [
            ...prev.messages,
            {
              id: Date.now() + 1,
              text: friendlyMsg,
              sender: "bot",
              timestamp: Date.now(),
              error: true,
            },
          ],
        }));
      }
    },
    [
      chatState.inputText,
      chatState.messages,
      chatState.selectedModel,
      chatState.isLoading,
    ],
  );

  return {
    chatState,
    availableModels,
    handleSendMessage,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setChatState((prev) => ({ ...prev, inputText: e.target.value })),
    handleModelChange: (model: GeminiModel) =>
      setChatState((prev) => ({ ...prev, selectedModel: model })),
    retryConnection: (apiKey?: string) => {
      hasLoadedModels.current = false;
      initializeChat(apiKey);
    },
  };
};