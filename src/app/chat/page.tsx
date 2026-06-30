"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface Card {
  type: "reflection" | "insight" | "action";
  content: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  cards?: Card[];
  timestamp: Date;
}

const cardIcons: Record<string, string> = {
  reflection: "✨",
  insight: "🧠",
  action: "🌱",
};

const cardLabels: Record<string, string> = {
  reflection: "Reflection",
  insight: "CBT Insight",
  action: "Small Action",
};

const suggestions = [
  "I'm feeling anxious today",
  "Help me process my thoughts",
  "I need some encouragement",
  "I want to practice gratitude",
];

function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there. I'm here to listen — no judgment, just support. What's on your mind?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [pendingCards, setPendingCards] = useState<Card[]>([]);
  const [showCards, setShowCards] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, isTyping, displayedText, showCards]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    setShowCards(false);
    setDisplayedText("");
    setPendingCards([]);

    try {
      // Build conversation history for context
      const history = [...messages, userMsg]
        .filter((m) => m.id !== "welcome")
        .slice(-10) // last 10 messages for context
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      setIsThinking(false);
      setIsTyping(true);

      // Type out the message character by character
      const fullText: string = data.message || "I'm here for you.";
      const cards: Card[] = data.cards || [];
      setPendingCards(cards);

      // Typing effect
      for (let i = 0; i <= fullText.length; i++) {
        await new Promise((r) => setTimeout(r, 15 + Math.random() * 10));
        setDisplayedText(fullText.slice(0, i));
      }

      // Done typing — add the full message
      setIsTyping(false);
      setDisplayedText("");

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fullText,
        cards: cards.length > 0 ? cards : undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setPendingCards([]);

      // Show cards with delay
      if (cards.length > 0) {
        setTimeout(() => setShowCards(true), 200);
      }
    } catch {
      setIsThinking(false);
      setIsTyping(false);
      setDisplayedText("");

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-40 glass-elevated"
      >
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <span className="text-lg">✨</span>
          </div>
          <div>
            <h1 className="text-title text-[15px] text-[var(--color-text-primary)]">MindEase AI</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
              <p className="text-[12px] text-[var(--color-text-tertiary)]">
                {isThinking ? "Thinking..." : isTyping ? "Typing..." : "Online"}
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 pt-24 pb-48 px-4 md:px-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, msgIndex) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] ${msg.role === "user" ? "order-1" : ""}`}>
                  <div
                    className={`rounded-3xl px-5 py-3.5 ${
                      msg.role === "user"
                        ? "bg-[var(--color-accent)] text-white rounded-br-lg"
                        : "glass rounded-bl-lg"
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Response Cards */}
                  {msg.role === "assistant" && msg.cards && msg.cards.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-3 space-y-2"
                    >
                      {msg.cards.map((card, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1, type: "spring" as const, stiffness: 300, damping: 25 }}
                          className="glass rounded-2xl p-4"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-sm">{cardIcons[card.type] || "💡"}</span>
                            <span className="text-caption text-[11px] uppercase tracking-wider">
                              {cardLabels[card.type] || card.type}
                            </span>
                          </div>
                          <p className="text-body text-[14px] text-[var(--color-text-primary)] leading-relaxed">
                            {card.content}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  <p className={`text-[10px] text-[var(--color-text-tertiary)] mt-1.5 ${
                    msg.role === "user" ? "text-right" : ""
                  }`}>
                    {msg.timestamp.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Live Typing Display */}
          <AnimatePresence>
            {isTyping && displayedText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%]">
                  <div className="glass rounded-3xl rounded-bl-lg px-5 py-3.5">
                    <p className="text-[15px] leading-relaxed">{displayedText}<span className="animate-pulse">|</span></p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thinking Indicator */}
          <AnimatePresence>
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-start"
              >
                <div className="glass rounded-3xl rounded-bl-lg px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-[var(--color-text-secondary)]">Thinking</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-tertiary)] typing-dot" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {messages.length <= 1 && !isThinking && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-44 left-0 right-0 px-4 md:px-6"
          >
            <div className="max-w-2xl mx-auto flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => sendMessage(s)}
                  className="glass px-4 py-2.5 rounded-2xl text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="fixed bottom-24 left-0 right-0 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-elevated rounded-3xl flex items-end gap-3 p-2 pl-5"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              rows={1}
              className="flex-1 bg-transparent text-[15px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] resize-none outline-none py-2.5 max-h-32"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isThinking || isTyping}
              className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                input.trim() && !isThinking && !isTyping
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-black/5 text-[var(--color-text-tertiary)]"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>

      <Navigation />
    </main>
  );
}

export default function ChatPage() {
  const { ready } = useAuthGuard();

  if (!ready) {
    return <div className="min-h-screen" style={{ background: "var(--color-bg)" }} />;
  }

  return <ChatContent />;
}
