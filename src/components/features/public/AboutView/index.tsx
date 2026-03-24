import Footer from '@/components/footer';
import Header from '@/components/header';
import { VetProfile } from './VetProfile';

interface Vet {
  src: string;
  name: string;
  formation: string;
  title: string;
  paragraphs: string[];
  reverse?: boolean;
}

const vets: Vet[] = [
  {
    src: '/teste.webp',
    name: '[Nome do(a) Veterinário(a)]',
    formation: 'CRMV-RS [Número] · Graduado(a) em Medicina Veterinária pela [Universidade] · Especialização em [Área]',
    title: 'Sobre a CliniVet',
    paragraphs: [
      'Fundada em [Ano de Fundação], a CliniVet é referência no cuidado e bem-estar de cães e gatos na região. Com uma equipe de veterinários altamente qualificados e apaixonados por animais, oferecemos uma gama completa de serviços para garantir a saúde e a felicidade dos seus pets.',
      'Nossa missão é proporcionar atendimento de excelência com um toque pessoal — desde consultas regulares até cirurgias complexas, sempre com tecnologia de ponta e compromisso com o bem-estar dos nossos pacientes.',
    ],
  },
  {
    src: '/teste.webp',
    name: '[Nome do(a) Veterinário(a)]',
    formation: 'CRMV-RS [Número] · Graduado(a) em Medicina Veterinária pela [Universidade] · Especialização em [Área]',
    title: 'Nossa Equipe',
    paragraphs: [
      'Em nossa clínica, acreditamos que cada animal merece cuidados personalizados e carinho. Com especialização em áreas como cardiologia, dermatologia e ortopedia, nossa equipe está pronta para oferecer o melhor tratamento possível.',
      'Nossos profissionais estão constantemente atualizados com as últimas inovações e práticas na medicina veterinária, garantindo sempre o melhor cuidado para o seu pet.',
    ],
    reverse: true,
  },
];

export function AboutView() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow flex flex-col items-center p-0 w-full">

        {vets.map((vet, i) => (
          <div key={i} className="w-full">
            <div className={`w-full max-w-6xl mx-auto flex flex-col items-center justify-between py-10 px-4 md:px-8 gap-8 ${vet.reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4 md:mb-6">
                  {vet.title}
                </h2>
                {vet.paragraphs.map((p, j) => (
                  <p key={j} className="text-base md:text-lg text-gray-700 mb-4">
                    {p}
                  </p>
                ))}
              </div>

              <div className="w-full md:w-1/2 flex justify-center">
                <VetProfile src={vet.src} name={vet.name} formation={vet.formation} />
              </div>
            </div>

            {i < vets.length - 1 && <div className="h-2 bg-green-600 w-full" />}
          </div>
        ))}

        <div className="h-2 bg-green-600 w-full" />

        {/* Mapa */}
        <div className="w-full max-w-6xl mx-auto py-10 px-4 md:px-8">
          <h2 className="text-3xl font-bold text-green-600 text-center mb-8">
            Nossa Localização
          </h2>
          <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://maps.google.com/maps?q=R+Gen+Flores+da+Cunha+850+Nova+Prata+RS+Brasil&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
