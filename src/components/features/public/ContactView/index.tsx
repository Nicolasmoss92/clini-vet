'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { PageTransition } from '@/components/ui/PageTransition';
import { useState } from 'react';

export function ContactView() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({});
  const [sent, setSent] = useState(false);

  const clinicWhatsAppNumber = '5591999999999';

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!phone.trim()) newErrors.phone = 'Telefone é obrigatório.';
    if (!message.trim()) newErrors.message = 'Mensagem é obrigatória.';
    return newErrors;
  };

  const sendWhatsAppMessage = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const url = `https://wa.me/${clinicWhatsAppNumber}?text=${encodeURIComponent(
      `Nome: ${name}\nTelefone: ${phone}\nMensagem: ${message}`
    )}`;
    window.open(url, '_blank');
    setSent(true);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow flex flex-col justify-center items-center p-4 w-full">
        <PageTransition>
        <div className="w-full max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg my-8">
          <h2 className="text-3xl font-bold text-green-600 mb-4 text-center">Contato</h2>

          <p className="text-gray-700 mb-6 text-center">
            Para garantir sua segurança e evitar possíveis golpes, entre em contato conosco através desta mensagem. Respondemos rapidamente para atender sua solicitação.
          </p>

          {sent && (
            <div className="mb-6 p-4 bg-green-50 border border-green-300 text-green-700 rounded-lg text-center">
              Mensagem enviada com sucesso! Entraremos em contato em breve.
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nome</label>
            <input
              type="text"
              id="name"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-600 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => { setName(e.target.value); setSent(false); }}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Telefone</label>
            <input
              type="tel"
              id="phone"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-600 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="(99) 99999-9999"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setSent(false); }}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Mensagem</label>
            <textarea
              id="message"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-600 ${errors.message ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Digite sua mensagem"
              rows={4}
              value={message}
              onChange={(e) => { setMessage(e.target.value); setSent(false); }}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          <button
            onClick={sendWhatsAppMessage}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg border border-green-600 transition duration-300 hover:bg-white hover:text-green-600"
          >
            Enviar via WhatsApp
          </button>
        </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
