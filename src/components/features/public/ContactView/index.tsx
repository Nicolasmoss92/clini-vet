import Footer from '@/components/footer';
import Header from '@/components/header';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { ContactForm } from './ContactForm';

const contactDetails = [
  {
    icon: MapPin,
    label: 'Endereço',
    lines: ['R. Gen. Flores da Cunha, 850', 'Centro — Nova Prata, RS'],
  },
  {
    icon: Phone,
    label: 'Telefone',
    lines: ['(54) 99999-9999'],
  },
  {
    icon: Mail,
    label: 'E-mail',
    lines: ['contato@clinivet.com.br'],
  },
  {
    icon: Clock,
    label: 'Horário de atendimento',
    lines: ['Seg – Sex: 08h às 18h', 'Sáb: 08h às 12h', 'Plantão 24h para emergências'],
  },
];

export function ContactView() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow flex flex-col items-center p-0 w-full">

        <PageHero
          title="Entre em Contato"
          subtitle="Estamos prontos para atender você e seu pet. Fale conosco pelo formulário ou pelos canais abaixo."
        />

        {/* Conteúdo */}
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Informações */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-green-700">Informações</h2>
            {contactDetails.map(({ icon: Icon, label, lines }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{label}</p>
                  {lines.map((line) => (
                    <p key={line} className="text-gray-500 text-sm">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <ContactForm />

        </div>
      </main>

      <Footer />
    </div>
  );
}
