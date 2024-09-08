import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HeaderSurgery from "@/components/layout/surgery/header";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            {/* Cabeçalho */}
            <Header />

            {/* Corpo principal (carrossel e texto) */}
            <main className="flex-grow flex flex-col items-center p-0 w-full">
                <HeaderSurgery />
            </main>

            {/* Rodapé */}
            <Footer />
        </div>
    );
}