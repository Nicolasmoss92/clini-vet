import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <Header />

      {/* Corpo principal (carrossel e texto) */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        {/* Carrossel (você pode usar um componente de carrossel aqui) */}
        <div className="w-full max-w-4xl bg-gray-100 rounded-lg shadow-md mb-8">
          {/* Substitua este div pelo seu componente de carrossel */}
          <p className="p-4 text-center">Aqui ficará o carrossel</p>
        </div>

        {/* Texto adicional */}
        <div className="w-full max-w-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Título Responsivo</h2>
          <p className="text-lg">
            Este é um exemplo de texto que acompanha o carrossel. Você pode adicionar qualquer conteúdo de texto aqui, que será responsivo e adaptável a diferentes tamanhos de tela.
          </p>
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
