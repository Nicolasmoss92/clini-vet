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
            </main>

            {/* Rodapé */}
            <Footer />
        </div>
    );
}