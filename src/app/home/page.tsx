
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ButtonLearnAbout } from "@/components/header/ButtonlearnMore";
import { ButtonLearnAboutHome } from "@/components/home/ButtonlearnMoreHome";
import { ButtonAsChild } from "@/components/layout/ButtonDefault";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Cabeçalho */}
      <Header />

      {/* Corpo principal (carrossel e texto) */}
      <main className="flex-grow flex flex-col items-center p-0 w-full">
        {/* Carrossel ajustado */}
        <div className="relative w-full h-[300px] md:h-[500px] bg-gray-100 overflow-hidden mb-0">
          <div className="w-full">
            <img
              src="/teste.webp"  // Substitua com a imagem que deseja exibir
              alt="Logo"
              className="w-full h-auto"  // h-auto faz com que a altura seja ajustada proporcionalmente
            />
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-16 px-4 md:px-8 bg-white rounded-lg mt-10">

          {/* Texto à esquerda */}
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
            <ButtonLearnAboutHome />
          </div>

          {/* Imagem à direita */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/teste.webp" // Substitua pelo caminho correto da imagem
              alt="Veterinária com um pet"
              className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-full border-4 border-green-600"
            />
          </div>

        </div>

        <div className="h-2 bg-green-600 w-full mt-16"></div>

        <div className="py-16 px-8">
          <h2 className="text-3xl font-bold text-green-600 text-center mb-8">
            Conheça Nossas Soluções
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Cirurgias */}
            <a href="/header/surgery">
              <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 min-h-[250px]">
                <h3 className="text-xl font-semibold text-green-600 mb-4">Cirurgias</h3>
                <p className="text-gray-700">
                  Realizamos cirurgias de alta complexidade com equipe especializada, garantindo o bem-estar do seu animal.
                </p>
              </div>
            </a>

            {/* Card 2: Plantões */}
            <a href="header/onDuty">
              <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 min-h-[250px]">
                <h3 className="text-xl font-semibold text-green-600 mb-4">Plantões</h3>
                <p className="text-gray-700">
                  Atendimento 24 horas com profissionais de prontidão para emergências e cuidados.
                </p>
              </div>
            </a>

            {/* Card 3: Amo Pet Sister */}
            <a href="header/petSister">
              <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 min-h-[250px]">
                <h3 className="text-xl font-semibold text-green-600 mb-4">Amo Pet Sister</h3>
                <p className="text-gray-700">
                  Serviço de cuidados personalizados para pets em recuperação ou com necessidades especiais.
                </p>
              </div>
            </a>

            {/* Card 4: Reabilitação e Terapia */}
            <a href="header/reabilit">
              <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 min-h-[250px]">
                <h3 className="text-xl font-semibold text-green-600 mb-4">Reabilitação e Terapia</h3>
                <p className="text-gray-700">
                  Terapias avançadas para recuperação e bem-estar do seu pet, incluindo fisioterapia e acupuntura.
                </p>
              </div>
            </a>
          </div>

        </div>

        <div className="py-16 px-8">
          <h2 className="text-3xl font-bold text-green-600 text-center mb-8">
            Nossa Localização
          </h2>
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=..." // Insira o link do embed do Google Maps
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen={true} // Corrigido: passando booleano
              aria-hidden="false"
              tabIndex={0} // Corrigido: passando número
            ></iframe>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}