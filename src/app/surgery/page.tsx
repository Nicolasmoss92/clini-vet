import Header from "@/components/header/index";
import Footer from "@/components/layout/Footer";
import SubHeader from "@/components/layout/surgery/Header";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            {/* Cabeçalho */}
            <Header />

            {/* Corpo principal (carrossel e texto) */}
            <main className="flex-grow flex flex-col items-center p-0 w-full">
                <SubHeader />
            </main>

            {/* Rodapé */}
            <Footer />
        </div>
    );
}