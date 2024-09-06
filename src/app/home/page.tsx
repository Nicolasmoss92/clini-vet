import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Cabeçalho */}
      <Header />

      {/* Corpo principal (carrossel e texto) */}
      <main className="flex-grow flex flex-col items-center p-0 w-full">
        {/* Carrossel ajustado */}
        <div className="relative w-full h-[300px] md:h-[500px] bg-gray-100 overflow-hidden mb-0">
          <Carousel>
            <CarouselContent className="w-full h-full">
              <CarouselItem className="w-full h-full flex items-center justify-center">
                <img
                  src="/petsister.png"
                  alt="Logo"
                  className="w-full h-full "
                />
              </CarouselItem>
              <CarouselItem className="w-full h-full flex items-center justify-center"><img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full "
              /></CarouselItem>
              <CarouselItem className="w-full h-full">
                <img
                  src="/diamedico.png"
                  alt="Logo"
                  className="w-full h-full"
                />
              </CarouselItem>
            </CarouselContent>

            {/* Botão anterior centralizado verticalmente à esquerda */}
            <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10">
              &lt;
            </CarouselPrevious>

            {/* Botão próximo centralizado verticalmente à direita */}
            <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10">
              &gt;
            </CarouselNext>
          </Carousel>
        </div>

        {/* Texto adicional */}
        <div className="w-full max-w-2xl mx-auto text-center mt-8 px-4">
          <h2 className="text-2xl font-bold mb-4">Bem-vindo à [Nome da Clínica Veterinária]</h2>
          <p className="text-lg mb-8">
            Na [Nome da Clínica Veterinária], entendemos que seu pet é parte da família. É por isso que oferecemos cuidados veterinários de alta qualidade, com uma abordagem personalizada e atenciosa. Nossa equipe de profissionais é apaixonada pelo que faz e está sempre pronta para oferecer o melhor tratamento para garantir a saúde e o bem-estar do seu companheiro.
          </p>
        </div>

        <div className="w-full text-center mt-8 px-4">
          <h2 className="text-2xl font-bold mb-4">Bem-vindo à [Nome da Clínica Veterinária]</h2>
          <p className="text-lg mb-8">
            Na [Nome da Clínica Veterinária], entendemos que seu pet é parte da família. É por isso que oferecemos cuidados veterinários de alta qualidade, com uma abordagem personalizada e atenciosa. Nossa equipe de profissionais é apaixonada pelo que faz e está sempre pronta para oferecer o melhor tratamento para garantir a saúde e o bem-estar do seu companheiro.
          </p>
        </div>

        <div className="w-full px-4 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">Nossos Serviços Incluem:</h3>
              <ul className="list-disc list-inside">
                <li>Consultas e Exames Clínicos: Diagnóstico preciso e atendimento completo para garantir a saúde ideal do seu pet.</li>
                <li>Vacinas e Prevenção: Proteja seu amigo contra doenças com nossos programas de vacinação e prevenção.</li>
                <li>Cirurgias e Procedimentos: Procedimentos realizados com a máxima segurança e cuidado para recuperação rápida.</li>
                <li>Aconselhamento Nutricional: Orientações sobre a dieta ideal para manter seu pet saudável e feliz.</li>
                <li>Cuidados com o Bem-Estar: Serviços de higiene, grooming e cuidados adicionais para o conforto do seu pet.</li>
              </ul>
            </div>
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">Por que Escolher a [Nome da Clínica Veterinária]?</h3>
              <ul className="list-disc list-inside">
                <li>Equipe Especializada: Veterinários experientes e apaixonados pelo cuidado com os animais.</li>
                <li>Tecnologia de Ponta: Equipamentos modernos para diagnósticos precisos e tratamentos eficazes.</li>
                <li>Ambiente Aconchegante: Um espaço acolhedor para que seu pet se sinta confortável e seguro.</li>
                <li>Atendimento Personalizado: Cada visita é adaptada às necessidades específicas do seu pet.</li>
              </ul>
            </div>
          </div>

          <p className="text-lg text-center mt-4">
            <strong>Agende uma Visita Conosco!</strong><br />
            Estamos localizados em [Endereço] e atendemos de [Horário de Funcionamento]. Entre em contato pelo telefone [Número de Telefone] ou pelo e-mail [E-mail] para agendar uma consulta ou obter mais informações.
          </p>
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}