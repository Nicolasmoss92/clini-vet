import Footer from "@/components/footer";
import Header from "@/components/header";
import { ButtonLearnAbout } from "@/components/layout/petSister/ButtonLearnMorePetSister";
import SubHeader from "@/components/layout/petSister/HeaderPetSister";

export default function PetSister() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <Header />
            <main className="flex-grow flex flex-col items-center p-0 w-full">
            <SubHeader />
                <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-4 md:px-8 bg-white rounded-lg mt-10">
                    {/* Texto à esquerda */}
                    <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
                        <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4 md:mb-6">
                            Serviço Pet Sister na CliniVet
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            Nosso serviço de Pet Sister é ideal para cuidar do seu animalzinho no conforto da sua própria casa, enquanto você viaja ou precisa se ausentar. Sabemos o quanto é importante garantir que o seu pet esteja sendo bem cuidado em sua ausência.
                        </p>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            Além de cuidados essenciais como alimentação, passeios e momentos de recreação, oferecemos um serviço de monitoramento integral através de câmeras. Você poderá acompanhar o dia a dia do seu pet, com transmissão ao vivo ou gravações enviadas diretamente para o seu celular, para garantir que seu bichinho está sendo bem tratado e recebendo toda a atenção.
                        </p>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            Nossa equipe é composta por profissionais capacitados, que garantem o bem-estar e a segurança do seu animal. Também mantemos contato constante para que você se sinta tranquilo, sabendo que o seu pet está em boas mãos.
                        </p>
                        <ButtonLearnAbout />
                    </div>

                    {/* Imagem à direita */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img
                            src="/teste.webp" // Substitua pelo caminho correto da imagem
                            alt="Pet Sister cuidando de um animal"
                            className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-full border-4 border-green-600"
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}