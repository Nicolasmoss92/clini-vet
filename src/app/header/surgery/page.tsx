import Footer from "@/components/footer";
import Header from "@/components/header/index";
import SubHeader from "@/components/layout/surgery/SubHeader";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            {/* Cabeçalho */}
            <Header />

            {/* Corpo principal (carrossel e texto) */}
            <main className="flex-grow flex flex-col items-center p-0 w-full">
                <SubHeader />
                <div className="container mx-auto px-4 py-8">
                    {/* Seção de Introdução */}
                    <section className="mb-12 text-center">
                        <p className="text-lg">
                            A cirurgia veterinária é uma parte essencial dos cuidados médicos
                            para muitos animais. Na Animal, contamos com uma equipe especializada
                            para garantir que cada procedimento seja realizado com segurança,
                            priorizando o bem-estar do seu pet. Oferecemos uma variedade de
                            procedimentos cirúrgicos, adaptados às necessidades de cada paciente.
                        </p>
                    </section>

                    {/* Cards de Tipos de Cirurgias */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 min-h-[250px]">
                            <h2 className="text-xl font-bold mb-4">Cirurgia Ortopédica</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Focada em fraturas e problemas nos ossos e articulações dos animais,
                                a cirurgia ortopédica pode ser necessária após traumas ou doenças
                                degenerativas.
                            </p>
                            <a
                                href="/contact"
                                className="bg-green-500 text-white hover:bg-white hover:text-green-500 border border-green-500 py-2 px-4 rounded shadow transition"
                            >
                                Saiba mais
                            </a>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 min-h-[250px]">
                            <h2 className="text-xl font-bold mb-4">Cirurgia Oftalmológica</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Tratamento cirúrgico para doenças oculares como catarata, úlceras de
                                córnea e glaucoma, visando restaurar a visão e o conforto ocular
                                dos pets.
                            </p>
                            <a
                                href="/contact"
                                className="bg-green-500 text-white hover:bg-white hover:text-green-500 border border-green-500 py-2 px-4 rounded shadow transition"
                            >
                                Saiba mais
                            </a>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 min-h-[250px]">
                            <h2 className="text-xl font-bold mb-4">Cirurgia de Tecidos Moles</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Inclui procedimentos em órgãos internos, como remoção de tumores,
                                cirurgia gastrointestinal, biópsias e outros.
                            </p>
                            <a
                                href="/contact"
                                className="bg-green-500 text-white hover:bg-white hover:text-green-500 border border-green-500 py-2 px-4 rounded shadow transition"
                            >
                                Saiba mais
                            </a>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 min-h-[250px]">
                            <h2 className="text-xl font-bold mb-4">Cirurgia Neurológica</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Para casos que envolvem problemas no sistema nervoso, como hérnias
                                de disco, epilepsia e outras condições.
                            </p>
                            <a
                                href="/contact"
                                className="bg-green-500 text-white hover:bg-white hover:text-green-500 border border-green-500 py-2 px-4 rounded shadow transition"
                            >
                                Saiba mais
                            </a>
                        </div>

                        {/* Card 5 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 min-h-[250px]">
                            <h2 className="text-xl font-bold mb-4">Cirurgia Dental</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Focada na remoção de dentes comprometidos, tratamento de fraturas e
                                infecções orais para manter a saúde bucal dos animais.
                            </p>
                            <a
                                href="/contact"
                                className="bg-green-500 text-white hover:bg-white hover:text-green-500 border border-green-500 py-2 px-4 rounded shadow transition"
                            >
                                Saiba mais
                            </a>
                        </div>

                        {/* Card 6 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 min-h-[250px]">
                            <h2 className="text-xl font-bold mb-4">Cirurgia de Emergência</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Procedimentos rápidos e eficazes para tratar condições críticas que
                                exigem intervenção imediata, como traumas e acidentes.
                            </p>
                            <a
                                href="/contact"
                                className="bg-green-500 text-white hover:bg-white hover:text-green-500 border border-green-500 py-2 px-4 rounded shadow transition"
                            >
                                Saiba mais
                            </a>
                        </div>
                    </section>
                </div>
            </main>

            {/* Rodapé */}
            <Footer />
        </div>
    );
}