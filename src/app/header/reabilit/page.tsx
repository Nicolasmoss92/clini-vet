import Footer from "@/components/footer";
import Header from "@/components/header";
import { ButtonLearnAbout } from "@/components/layout/reabilit/ButtonLearnMorereabilit";
import SubHeader from "@/components/layout/petSister/HeaderPetSister";

export default function AnimalTherapy() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <Header />
            <main className="flex-grow flex flex-col items-center p-0 w-full">
                <SubHeader />
                <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-2 px-4 md:px-8 bg-white rounded-lg mt-10">
                    {/* Texto à esquerda */}
                    <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
                        <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4 md:mb-6">
                            Terapia Animal e Reabilitação
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            A terapia animal é uma abordagem essencial para a recuperação física e emocional de animais que passaram por traumas ou procedimentos cirúrgicos. A reabilitação ajuda na recuperação muscular e motora, promovendo o bem-estar e uma vida mais saudável para os pets.
                        </p>
                        <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                            Utilizamos técnicas como fisioterapia, hidroterapia e exercícios de fortalecimento, sempre adaptados às necessidades específicas de cada animal. Nossa equipe de profissionais está comprometida em oferecer o melhor tratamento para acelerar a recuperação.
                        </p>
                        <ButtonLearnAbout />
                    </div>

                    {/* Imagem à direita */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img
                            src="/teste.webp" // Substitua pelo caminho correto da imagem
                            alt="Terapia e reabilitação animal"
                            className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-full border-4 border-green-600"
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
