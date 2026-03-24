import Footer from '@/components/footer';
import Header from '@/components/header';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';

const surgeries = [
  {
    title: 'Cirurgia Ortopédica',
    description: 'Focada em fraturas e problemas nos ossos e articulações, pode ser necessária após traumas ou doenças degenerativas.',
  },
  {
    title: 'Cirurgia Oftalmológica',
    description: 'Tratamento cirúrgico para catarata, úlceras de córnea e glaucoma, visando restaurar a visão e o conforto ocular.',
  },
  {
    title: 'Cirurgia de Tecidos Moles',
    description: 'Procedimentos em órgãos internos, como remoção de tumores, cirurgia gastrointestinal e biópsias.',
  },
  {
    title: 'Cirurgia Neurológica',
    description: 'Para casos que envolvem o sistema nervoso, como hérnias de disco, epilepsia e outras condições.',
  },
  {
    title: 'Cirurgia Dental',
    description: 'Remoção de dentes comprometidos, tratamento de fraturas e infecções orais para manter a saúde bucal.',
  },
  {
    title: 'Cirurgia de Emergência',
    description: 'Procedimentos rápidos para tratar condições críticas que exigem intervenção imediata, como traumas e acidentes.',
  },
];

export function SurgeryView() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow flex flex-col items-center p-0 w-full">

        <PageHero
          title="Cirurgias"
          subtitle="Procedimentos realizados com segurança, tecnologia e cuidado para o bem-estar do seu pet."
        />

        {/* Cards */}
        <div className="w-full bg-gray-50 py-10 px-4 md:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {surgeries.map((s) => (
              <div key={s.title} className="bg-white p-6 rounded-xl border border-gray-100 border-t-4 border-t-green-600 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-[220px]">
                <h3 className="text-lg font-bold text-green-600 mb-3">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-grow">{s.description}</p>
                <Link
                  href="/contact"
                  className="mt-4 inline-block bg-green-600 text-white hover:bg-white hover:text-green-600 border border-green-600 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 text-center"
                >
                  Saiba mais
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="h-2 bg-green-600 w-full" />

        {/* CTA */}
        <div className="w-full bg-green-600 py-10 px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Precisa agendar uma cirurgia?</h2>
          <p className="text-green-100 mb-6 max-w-lg mx-auto">Nossa equipe está pronta para avaliar o seu pet e indicar o melhor tratamento.</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-green-700 font-semibold py-3 px-8 rounded-lg hover:bg-green-50 transition duration-300"
          >
            Fale conosco
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
