import Footer from '@/components/footer';
import Header from '@/components/header';
import SubHeader from '@/components/layout/surgery/SubHeader';

export function SurgeryView() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow flex flex-col items-center p-0 w-full">
        <SubHeader />
        <div className="w-full bg-gray-50 px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <section className="mb-10 text-center">
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                A cirurgia veterinária é uma parte essencial dos cuidados médicos
                para muitos animais. Na CliniVet, contamos com uma equipe especializada
                para garantir que cada procedimento seja realizado com segurança,
                priorizando o bem-estar do seu pet.
              </p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 border-t-4 border-t-green-600 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-[250px]">
                <h2 className="text-xl font-bold text-green-600 mb-3">Cirurgia Ortopédica</h2>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed flex-grow">
                  Focada em fraturas e problemas nos ossos e articulações dos animais,
                  a cirurgia ortopédica pode ser necessária após traumas ou doenças degenerativas.
                </p>
                <a href="/contact" className="inline-block bg-green-600 text-white hover:bg-white hover:text-green-600 border border-green-600 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 text-center">
                  Saiba mais
                </a>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 border-t-4 border-t-green-600 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-[250px]">
                <h2 className="text-xl font-bold text-green-600 mb-3">Cirurgia Oftalmológica</h2>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed flex-grow">
                  Tratamento cirúrgico para doenças oculares como catarata, úlceras de
                  córnea e glaucoma, visando restaurar a visão e o conforto ocular dos pets.
                </p>
                <a href="/contact" className="inline-block bg-green-600 text-white hover:bg-white hover:text-green-600 border border-green-600 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 text-center">
                  Saiba mais
                </a>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 border-t-4 border-t-green-600 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-[250px]">
                <h2 className="text-xl font-bold text-green-600 mb-3">Cirurgia de Tecidos Moles</h2>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed flex-grow">
                  Inclui procedimentos em órgãos internos, como remoção de tumores,
                  cirurgia gastrointestinal, biópsias e outros.
                </p>
                <a href="/contact" className="inline-block bg-green-600 text-white hover:bg-white hover:text-green-600 border border-green-600 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 text-center">
                  Saiba mais
                </a>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 border-t-4 border-t-green-600 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-[250px]">
                <h2 className="text-xl font-bold text-green-600 mb-3">Cirurgia Neurológica</h2>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed flex-grow">
                  Para casos que envolvem problemas no sistema nervoso, como hérnias
                  de disco, epilepsia e outras condições.
                </p>
                <a href="/contact" className="inline-block bg-green-600 text-white hover:bg-white hover:text-green-600 border border-green-600 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 text-center">
                  Saiba mais
                </a>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 border-t-4 border-t-green-600 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-[250px]">
                <h2 className="text-xl font-bold text-green-600 mb-3">Cirurgia Dental</h2>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed flex-grow">
                  Focada na remoção de dentes comprometidos, tratamento de fraturas e
                  infecções orais para manter a saúde bucal dos animais.
                </p>
                <a href="/contact" className="inline-block bg-green-600 text-white hover:bg-white hover:text-green-600 border border-green-600 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 text-center">
                  Saiba mais
                </a>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 border-t-4 border-t-green-600 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-[250px]">
                <h2 className="text-xl font-bold text-green-600 mb-3">Cirurgia de Emergência</h2>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed flex-grow">
                  Procedimentos rápidos e eficazes para tratar condições críticas que
                  exigem intervenção imediata, como traumas e acidentes.
                </p>
                <a href="/contact" className="inline-block bg-green-600 text-white hover:bg-white hover:text-green-600 border border-green-600 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 text-center">
                  Saiba mais
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
