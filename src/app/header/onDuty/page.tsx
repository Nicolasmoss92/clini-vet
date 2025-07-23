import Footer from "@/components/footer";
import Header from "@/components/header";
import { ButtonLearnAbout } from "@/components/layout/onDuty/ButtonlearnMoreOnDuty";
import SubHeader from "@/components/layout/onDuty/HeaderOnDuty";

export default function OnDuty() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <Header />
            <main className="flex-grow flex flex-col items-center p-0 w-full">
                <SubHeader />

                <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-2 px-4 md:px-8 bg-white rounded-lg mt-10">
                  
                    <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
                        <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4 md:mb-6">
                            Serviço de Plantões na CliniVet
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            Nosso serviço de plantões pet está disponível 24 horas por dia, 7 dias por semana, garantindo que seu animal de estimação receba o cuidado necessário a qualquer hora, incluindo emergências e urgências veterinárias.
                        </p>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            Durante os plantões, nossa equipe de veterinários experientes está preparada para lidar com as situações mais diversas, desde atendimento clínico até cirurgias de emergência. Temos um ambiente completo com todos os equipamentos e suporte necessário para garantir o melhor cuidado para seu pet.
                        </p>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            Entendemos que emergências podem acontecer em qualquer momento, por isso oferecemos a tranquilidade de saber que seu pet sempre terá o suporte adequado, com o conforto e segurança de uma equipe de confiança.
                        </p>
                        <ButtonLearnAbout />
                    </div>


                    <div className="w-full md:w-1/2 flex justify-center">
                        <img
                            src="/teste.webp" // Substitua pelo caminho correto da imagem
                            alt="Veterinária com um pet"
                            className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-full border-4 border-green-600"
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}