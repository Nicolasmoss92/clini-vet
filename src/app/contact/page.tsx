"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const clinicWhatsAppNumber = '5591999999999'; // Substitua pelo número da clínica

  const sendWhatsAppMessage = () => {
    const url = `https://wa.me/${clinicWhatsAppNumber}?text=${encodeURIComponent(
      `Nome: ${name}\nTelefone: ${phone}\nMensagem: ${message}`
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Cabeçalho */}
      <Header />

      {/* Corpo principal */}
      <main className="flex-grow flex flex-col justify-center items-center p-4 w-full">
        <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg my-8">
          <h2 className="text-3xl font-bold text-green-600 mb-4 text-center">Contato</h2>
          
          <p className="text-gray-700 mb-6 text-center">
            Para garantir sua segurança e evitar possíveis golpes, entre em contato conosco através desta mensagem. Respondemos rapidamente para atender sua solicitação.
          </p>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Nome
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder="(99) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
              Mensagem
            </label>
            <textarea
              id="message"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              placeholder="Digite sua mensagem"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button
            onClick={sendWhatsAppMessage}
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Enviar via WhatsApp
          </button>
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
