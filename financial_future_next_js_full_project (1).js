// FinancialFuture.jsx corregido para Next.js y Vercel
import React, { useState, useEffect, useRef } from 'react';

const BRAND = {
  name: 'Financial Future - YOUR_NAME',
  primary: '#0f7a4a',
  accent: '#b6f2c7',
};

export default function FinancialFuture() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Hola 👋 soy el asistente de ${BRAND.name}. ¿En qué te ayudo hoy?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(e) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { from: 'user', text: trimmed };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      setMessages(m => [...m, { from: 'bot', text: data.reply || 'Ups, no hay respuesta' }]);
    } catch (err) {
      console.error(err);
      setMessages(m => [...m, { from: 'bot', text: 'Error en el chat' }]);
    } finally {
      setLoading(false);
    }
  }

  async function handlePayment() {
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'price_monthly_1' }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Error iniciando pago');
    } catch (err) {
      console.error(err);
      alert('Error iniciando pago');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{BRAND.name}</h1>
        <div className="flex gap-2">
          <button onClick={() => setChatOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded">Chat IA</button>
          <button onClick={handlePayment} className="px-4 py-2 bg-green-800 text-white rounded">Suscribirme</button>
        </div>
      </header>

      <main className="text-center">
        <h2 className="text-xl mb-4">Bienvenido a tu tablero financiero</h2>
        <p className="text-gray-600 mb-6">Con herramientas de IA y pagos integrados.</p>
      </main>

      {chatOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-end lg:items-center">
          <div className="bg-white w-full lg:w-2/5 rounded-t-xl lg:rounded-xl shadow-xl p-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold">Asistente IA</h4>
              <button onClick={() => setChatOpen(false)} className="px-3 py-1 rounded border">Cerrar</button>
            </div>
            <div className="flex-1 overflow-auto mb-3 p-2 rounded-md bg-gray-100">
              {messages.map((m, i) => (
                <div key={i} className={`mb-2 ${m.from === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded ${m.from === 'user' ? 'bg-green-100 rounded-br-none' : 'bg-white rounded-bl-none'}`}>{m.text}</span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Escribe tu pregunta..." className="flex-1 px-4 py-2 rounded border" />
              <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? '...' : 'Enviar'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
