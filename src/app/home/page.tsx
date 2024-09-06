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
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <Header />

      {/* Corpo principal (carrossel e texto) */}
      <main className="flex-grow flex flex-col items-center p-0 w-full">
        {/* Carrossel ajustado */}
        <div className="relative w-full h-[300px] md:h-[500px] bg-gray-100 overflow-hidden mb-0">
          <Carousel>
            <CarouselContent className="w-full h-full">
              <CarouselItem className="w-full h-full flex items-center justify-center">Imagem 1</CarouselItem>
              <CarouselItem className="w-full h-full flex items-center justify-center">Imagem 2</CarouselItem>
              <CarouselItem className="w-full h-full flex items-center justify-center">Imagem 3</CarouselItem>
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
        <div className="w-full max-w-2xl text-center mt-8 px-4">
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