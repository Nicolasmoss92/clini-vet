'use client';

import { useState } from 'react';

const WHATSAPP_NUMBER = '5554999999999';

interface FormState {
  name: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  message?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim())    errors.name    = 'Nome é obrigatório.';
  if (!form.phone.trim())   errors.phone   = 'Telefone é obrigatório.';
  if (!form.message.trim()) errors.message = 'Mensagem é obrigatória.';
  return errors;
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSent(false);
  };

  const handleSubmit = () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const text = `Nome: ${form.name}\nTelefone: ${form.phone}\nMensagem: ${form.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    setSent(true);
    setForm({ name: '', phone: '', message: '' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 flex flex-col gap-5">
      <h2 className="text-2xl font-bold text-green-700">Enviar mensagem</h2>

      {sent && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center">
          Mensagem enviada! Entraremos em contato em breve.
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">Nome</label>
        <input
          id="name"
          type="text"
          placeholder="Digite seu nome"
          value={form.name}
          onChange={handleChange('name')}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Telefone</label>
        <input
          id="phone"
          type="tel"
          placeholder="(54) 99999-9999"
          value={form.phone}
          onChange={handleChange('phone')}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium text-gray-700">Mensagem</label>
        <textarea
          id="message"
          placeholder="Como podemos ajudar?"
          rows={4}
          value={form.message}
          onChange={handleChange('message')}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${errors.message ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.message && <p className="text-red-500 text-xs mt-0.5">{errors.message}</p>}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300"
      >
        Enviar via WhatsApp
      </button>
    </div>
  );
}
