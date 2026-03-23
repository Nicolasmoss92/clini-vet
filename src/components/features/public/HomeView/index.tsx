import Footer from '@/components/footer';
import Header from '@/components/header';

export function HomeView() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow flex flex-col items-center p-0 w-full">
        <div className="relative w-full h-[300px] md:h-[500px] bg-gray-100 overflow-hidden mb-0">
          <div className="w-full">
            <img
              src="/teste.webp"
              alt="Logo"
              className="w-full h-auto"
            />
          </div>
        </div>

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
            <img
              src="/teste.webp"
              alt="Veterinária com um pet"
              className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-full border-4 border-green-600"
            />
          </div>
        </div>

        <div className="h-2 bg-green-600 w-full mt-8"></div>

        <div className="w-full bg-gray-50 py-10 px-4 md:px-8">
          <h2 className="text-3xl font-bold text-green-600 text-center mb-10">
            Conheça Nossas Soluções
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <a href="/header/surgery" className="group flex">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-green-600 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-green-600 mb-3">Cirurgias</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  Realizamos cirurgias de alta complexidade com equipe especializada, garantindo o bem-estar do seu animal.
                </p>
                <span className="mt-4 inline-block bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300 text-center">
                  Saiba mais
                </span>
              </div>
            </a>

            <a href="/header/onDuty" className="group flex">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-green-600 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-green-600 mb-3">Plantões</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  Atendimento 24 horas com profissionais de prontidão para emergências e cuidados.
                </p>
                <span className="mt-4 inline-block bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300 text-center">
                  Saiba mais
                </span>
              </div>
            </a>

            <a href="/header/petSister" className="group flex">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-green-600 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-green-600 mb-3">Amo Pet Sister</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  Serviço de cuidados personalizados para pets em recuperação ou com necessidades especiais.
                </p>
                <span className="mt-4 inline-block bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300 text-center">
                  Saiba mais
                </span>
              </div>
            </a>

            <a href="/header/reabilit" className="group flex">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-green-600 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-green-600 mb-3">Reabilitação e Terapia</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  Terapias avançadas para recuperação e bem-estar do seu pet, incluindo fisioterapia e acupuntura.
                </p>
                <span className="mt-4 inline-block bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300 text-center">
                  Saiba mais
                </span>
              </div>
            </a>
          </div>
        </div>

        <div className="h-2 bg-green-600 w-full"></div>

        <div className="w-full max-w-6xl mx-auto py-10 px-4 md:px-8">
          <h2 className="text-3xl font-bold text-green-600 text-center mb-8">
            Nossa Localização
          </h2>
          <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=..."
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              aria-hidden="false"
              tabIndex={0}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
