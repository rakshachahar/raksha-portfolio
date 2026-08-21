"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

import {
  Sparkles,
  Send,
  Trash2,
  User,
  Bot,
} from "lucide-react";

import { motion } from "framer-motion";

import { useWindowStore } from "@/store/windowStore";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_QUESTIONS = [
  "What projects has Raksha built?",
  "What AI/ML skills does she have?",
  "Where has Raksha interned?",
  "What is her RAG project about?",
  "Show me her resume.",
  "What achievements has she earned?",
];

export default function AskRaksha() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isSubmittingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keeps the latest messages available without causing stale-history issues.
  const messagesRef = useRef<Message[]>([]);

  // Prevents excessive React renders while Gemini streams.
  const streamUpdateRef = useRef<number | null>(null);

  const openApp = useWindowStore((state) => state.openApp);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = useCallback((smooth = false) => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    });
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, [messages, isLoading, scrollToBottom]);

  const updateStreamingMessage = useCallback(
    (content: string) => {
      // If an animation frame is already scheduled, wait for it.
      if (streamUpdateRef.current !== null) {
        return;
      }

      streamUpdateRef.current = requestAnimationFrame(() => {
        streamUpdateRef.current = null;

        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;

          if (
            lastIndex >= 0 &&
            updated[lastIndex].role === "assistant"
          ) {
            updated[lastIndex] = {
              role: "assistant",
              content,
            };
          }

          return updated;
        });

        scrollToBottom(false);
      });
    },
    [scrollToBottom]
  );

  const flushStreamingMessage = useCallback(
    (content: string) => {
      if (streamUpdateRef.current !== null) {
        cancelAnimationFrame(streamUpdateRef.current);
        streamUpdateRef.current = null;
      }

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        if (
          lastIndex >= 0 &&
          updated[lastIndex].role === "assistant"
        ) {
          updated[lastIndex] = {
            role: "assistant",
            content,
          };
        }

        return updated;
      });

      scrollToBottom(false);
    },
    [scrollToBottom]
  );

  const handleSubmit = async (question: string) => {
    const normalizedQuestion = question.trim();

    if (!normalizedQuestion || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    const previousMessages = messagesRef.current.slice(-6);

    const userMessage: Message = {
      role: "user",
      content: normalizedQuestion,
    };

    const assistantMessage: Message = {
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      assistantMessage,
    ]);

    messagesRef.current = [
      ...messagesRef.current,
      userMessage,
      assistantMessage,
    ];

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ask-raksha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: normalizedQuestion,
          history: previousMessages,
        }),
      });

      if (!response.ok || !response.body) {
        let errorMessage =
          "Ask Raksha is temporarily unavailable.";

        try {
          const payload = await response.json();

          if (typeof payload?.error === "string") {
            errorMessage = payload.error;
          }
        } catch {
          // Ignore invalid JSON error responses.
        }

        flushStreamingMessage(errorMessage);
        return;
      }

      const reader = response.body.getReader();

      const decoder = new TextDecoder("utf-8");

      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        if (value) {
          const chunk = decoder.decode(value, {
            stream: true,
          });

          if (chunk) {
            accumulatedText += chunk;

            updateStreamingMessage(accumulatedText);
          }
        }
      }

      // Flush any remaining decoder bytes.
      const finalChunk = decoder.decode();

      if (finalChunk) {
        accumulatedText += finalChunk;
      }

      if (accumulatedText.trim()) {
        flushStreamingMessage(accumulatedText);
      } else {
        flushStreamingMessage(
          "Ask Raksha could not generate a response. Please try again."
        );
      }
    } catch (error) {
      console.error("Ask Raksha client error:", error);

      flushStreamingMessage(
        "Ask Raksha is temporarily unavailable. The rest of the portfolio is still accessible."
      );
    } finally {
      if (streamUpdateRef.current !== null) {
        cancelAnimationFrame(streamUpdateRef.current);
        streamUpdateRef.current = null;
      }

      isSubmittingRef.current = false;
      setIsLoading(false);

      scrollToBottom(false);
    }
  };

  const renderContent = (content: string) => {
    // Remove Markdown formatting that looks ugly in this UI.
    const cleanedContent = content
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/^#{1,6}\s*/gm, "");

    const parts = cleanedContent.split(
      /(\[OPEN_[A-Z_]+\])/g
    );

    const actionApps: Record<
      string,
      { id: string; label: string }
    > = {
      "[OPEN_PROJECTS]": {
        id: "projects",
        label: "Open Projects",
      },

      "[OPEN_EXPERIENCE]": {
        id: "experience",
        label: "Open Experience",
      },

      "[OPEN_SKILLS]": {
        id: "skills",
        label: "Open Skills",
      },

      "[OPEN_ACHIEVEMENTS]": {
        id: "achievements",
        label: "Open Achievements",
      },

      "[OPEN_CERTIFICATIONS]": {
        id: "certifications",
        label: "Open Certifications",
      },

      "[OPEN_COMMUNITY]": {
        id: "community",
        label: "Open Community",
      },

      "[OPEN_RESUME]": {
        id: "resume",
        label: "Open Resume",
      },

      "[OPEN_ABOUT]": {
        id: "about",
        label: "Open About",
      },

      "[OPEN_CONTACT]": {
        id: "contact",
        label: "Open Contact",
      },
    };

    return parts.map((part, index) => {
      const action = actionApps[part];

      if (action) {
        return (
          <button
            key={index}
            onClick={() => openApp(action.id)}
            className="inline-block mt-2 mr-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm hover:bg-blue-500/30 transition-colors"
          >
            {action.label}
          </button>
        );
      }

      return (
        <span key={index}>
          {part}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#1e1e1e] text-gray-200">
      {/* Chat Area */}
      <div className="relative flex-1 min-h-0 overflow-y-auto p-4 pb-28 space-y-6">
        {/* Clear conversation */}
        <button
          onClick={() => {
            setMessages([]);
            messagesRef.current = [];
          }}
          className="absolute top-3 right-3 z-10 p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          title="Clear conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-start pt-8 max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-violet-400" />
              </div>

              <h3 className="text-xl font-medium text-white">
                How can I help you learn about Raksha?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              {STARTER_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSubmit(question)}
                  disabled={isLoading}
                  className="p-3 text-sm text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-violet-400" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white/10 text-gray-200 rounded-tl-sm"
                  }`}
                >
                  {message.content ? (
                    renderContent(message.content)
                  ) : (
                    <div className="flex gap-1 items-center">
                      <motion.div
                        animate={{
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                        }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />

                      <motion.div
                        animate={{
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          delay: 0.2,
                        }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />

                      <motion.div
                        animate={{
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          delay: 0.4,
                        }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-white/10 bg-black/20">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit(input);
          }}
          className="relative max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isLoading}
            placeholder="Ask about projects, skills, experience..."
            className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-12 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all text-white placeholder-gray-500 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-full transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}