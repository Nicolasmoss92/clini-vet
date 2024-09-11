import Footer from "@/components/footer";
import Header from "@/components/header";
import { ButtonLearnAbout } from "@/components/header/ButtonlearnMore";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            {/* Cabeçalho */}
            <Header />

            {/* Corpo principal */}
            <main className="flex-grow flex flex-col items-center p-0 w-full">
                {/* Primeira parte: Texto à esquerda e imagem à direita */}
                <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-16 px-4 md:px-8 bg-white rounded-lg mt-10">
                    {/* Texto à esquerda */}
                    <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
                        <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4 md:mb-6">
                            Um breve resumo sobre a CliniVet...
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            Fundada em [Ano de Fundação], a Clínica Veterinária [Nome] é um ponto de referência no cuidado e bem-estar de cães e gatos. Com uma equipe de veterinários altamente qualificados e apaixonados por animais, oferecemos uma gama completa de serviços para garantir a saúde e a felicidade dos seus pets.
                        </p>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            Nossa missão é proporcionar atendimento de excelência com um toque pessoal. Desde a realização de consultas regulares até procedimentos cirúrgicos complexos, estamos equipados com tecnologia de ponta e técnicas avançadas para atender a todas as necessidades do seu animal de estimação. Em cada etapa, nosso compromisso é com a saúde e o conforto dos nossos pacientes.
                        </p>
                    </div>

                    {/* Imagem à direita */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img
                            src="/diamedico.png" // Substitua pelo caminho correto da imagem
                            alt="Veterinária com um pet"
                            className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-full border-4 border-green-600"
                        />
                    </div>
                </div>

                {/* Segunda parte: Imagem à esquerda e texto à direita */}
                <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-16 px-4 md:px-8 bg-white rounded-lg -mt-16">
                    {/* Imagem à esquerda */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img
                            src="/diamedico.png" // Substitua pelo caminho correto da imagem
                            alt="Veterinária com um pet"
                            className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-full border-4 border-green-600"
                        />
                    </div>

                    {/* Texto à direita */}
                    <div className="w-full md:w-1/2">
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            Em nossa clínica, acreditamos que cada animal merece cuidados personalizados e carinho. Com especialização em áreas como cardiologia, dermatologia e ortopedia, nossa equipe está pronta para oferecer o melhor tratamento possível. Além disso, oferecemos serviços de vacinação, controle de parasitas, e orientações sobre nutrição e bem-estar para garantir uma vida longa e saudável para seu pet.
                        </p>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            A Clínica Veterinária [Nome] é equipada com laboratórios internos para exames rápidos e precisos, além de uma moderna sala de cirurgia e unidade de internação para cuidados intensivos. Nossos profissionais estão constantemente atualizados com as últimas inovações e práticas na medicina veterinária para oferecer o melhor cuidado possível.
                        </p>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            Também entendemos a importância da prevenção e da educação. Por isso, promovemos campanhas de conscientização sobre saúde animal e oferecemos workshops para tutores sobre cuidados preventivos e primeiros socorros para pets.
                        </p>
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
