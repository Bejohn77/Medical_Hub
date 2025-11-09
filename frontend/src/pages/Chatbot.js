import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 'm1', role: 'assistant', content: 'Hi! I\'m your AI Health Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);
    try {
      const res = await axios.post('/api/chat/', { message: trimmed });
      const ai = res.data?.reply ?? 'This is an AI response placeholder';
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: ai }]);
    } catch (e) {
      setMessages((prev) => [...prev, { id: `e-${Date.now()}`, role: 'assistant', content: 'Sorry, I could not process that right now.' }]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="rounded-2xl bg-white/70 backdrop-blur border border-gray-100 shadow-sm flex flex-col h-[70vh]">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900">AI Health Chatbot</h1>
          <p className="text-sm text-gray-500">Ask general health questions. This is not medical advice.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={(m.role === 'user'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-900') + ' max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap break-words'}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Type your message..."
              className="flex-1 resize-none rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 p-3 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className={`px-4 py-2 rounded-xl text-white ${sending || !input.trim() ? 'bg-primary-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'} transition-colors`}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;




