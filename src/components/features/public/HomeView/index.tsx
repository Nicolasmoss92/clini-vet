import Footer from '@/components/footer';
import Header from '@/components/header';
import { VetIllustration } from '@/components/ui/VetIllustration';
import { ServiceCard } from './ServiceCard';
import { BannerCarousel } from './BannerCarousel';

const servicos = [
  { href: '/header/surgery',   title: 'Cirurgias',              description: 'Realizamos cirurgias de alta complexidade com equipe especializada, garantindo o bem-estar do seu animal.' },
  { href: '/header/onDuty',    title: 'Plantões',               description: 'Atendimento 24 horas com profissionais de prontidão para emergências e cuidados.' },
  { href: '/header/petSister', title: 'Amo Pet Sister',         description: 'Serviço de cuidados personalizados para pets em recuperação ou com necessidades especiais.' },
  { href: '/header/reabilit',  title: 'Reabilitação e Terapia', description: 'Terapias avançadas para recuperação e bem-estar do seu pet, incluindo fisioterapia e acupuntura.' },
];

export function HomeView() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow flex flex-col items-center p-0 w-full">
        <BannerCarousel />

        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-8 px-4 md:px-8 bg-white rounded-lg mt-6">
          <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4 md:mb-6">
              Bem-vindo à CliniVet
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
              Em funcionamento desde [Ano de Início], a [Nome da Clínica Veterinária] oferece serviços na área de medicina veterinária com qualidade e competência, atendendo cães e gatos com acompanhamento clínico de todas as idades.
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
              A equipe médica conta com profissionais experientes e prontos a realizar desde consultas e exames até cirurgias mais complexas, tudo com a coordenação e supervisão de [Nome do Veterinário(a)], responsável pela clínica com mais de [X] anos de experiência na saúde animal.
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
              Somos especializados em [Áreas de Especialização], com técnica moderna que diminui os riscos e garante conforto e rápida recuperação ao animal. Atendemos animais de pequeno e grande porte.
            </p>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <VetIllustration src="/home.png" alt="Dra. Luisa" />
          </div>  
        </div>

        <div className="h-2 bg-green-600 w-full mt-8"></div>

        <div className="w-full bg-gray-50 py-10 px-4 md:px-8">
          <h2 className="text-3xl font-bold text-green-600 text-center mb-10">
            Conheça Nossas Soluções
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicos.map((s) => (
              <ServiceCard key={s.href} {...s} />
            ))}
          </div>
        </div>

        <div className="h-2 bg-green-600 w-full"></div>

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
              allowFullScreen={true}
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
