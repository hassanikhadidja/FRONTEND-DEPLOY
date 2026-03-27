import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const SYSTEM_PROMPT = `You are Toby 🧸, the friendly customer support assistant for Jeunes Toys — an Algerian toy company based in Bab Ezzouar, Algiers that makes safe, colorful, educational plastic toys for children.

Your personality: warm, playful, helpful, use toy/child-friendly emojis occasionally.

You can help with:
- Product questions (sand sets, balls, bowling sets, toy cars, kitchen sets)
- Prices are in Algerian Dinars (DA). Products range from 800 DA to 3500 DA
- Age recommendations (toys start from age 2+)
- Delivery info (3–7 business days across Algeria)
- Returns (14 days, unused in original packaging)
- Company info (located in Bab Ezzouar industrial zone, Est. 2015)
- Safety (all toys are CE certified)

Keep answers short, friendly and helpful. If unsure, suggest contacting us at contact@jeunestoys.dz or visiting the /contact page. Never make up specific order details.`;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Toby 🧸, your Jeunes Toys assistant! How can I help you today? Ask me about our toys, delivery, or anything else! 😊"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: newMessages.map((m) => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }],
            })),
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            generationConfig: {
              maxOutputTokens: 800,
              temperature: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't respond right now 🧸";

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Gemini API Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Oops! I'm having a little trouble connecting right now 😅 Please try again or email us at contact@jeunestoys.dz",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = [
    "What toys do you have?",
    "How much does delivery cost?",
    "What's your return policy?",
    "Are toys safe for toddlers?",
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        className={`chat-fab ${open ? 'open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <span className="chat-fab-icon">🧸</span>
            <span className="chat-fab-label">Chat</span>
          </>
        )}
        {!open && unread > 0 && <span className="chat-unread">{unread}</span>}
      </button>

      {/* Chat Window */}
      <div className={`chat-window ${open ? 'visible' : ''}`}>
        <div className="chat-header">
          <div className="chat-avatar">🧸</div>
          <div className="chat-header-info">
            <strong>Toby — Jeunes Toys</strong>
            <span className="chat-status">
              <span className="status-dot" /> Online
            </span>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              {msg.role === 'assistant' && <div className="msg-avatar">🧸</div>}
              <div className="msg-bubble">
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < msg.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-msg assistant">
              <div className="msg-avatar">🧸</div>
              <div className="msg-bubble typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="quick-replies">
            {quickReplies.map((q, i) => (
              <button
                key={i}
                className="quick-reply"
                onClick={() => {
                  setInput(q);
                  setTimeout(sendMessage, 100);
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-wrap">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ask about our toys..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            disabled={loading}
          />
          <button
            className={`chat-send ${input.trim() ? 'active' : ''}`}
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>

        <p className="chat-footer-note">Powered by Google Gemini (free) · Jeunes Toys 🇩🇿</p>
      </div>
    </>
  );
}