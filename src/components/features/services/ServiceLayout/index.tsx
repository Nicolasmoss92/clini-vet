import Footer from '@/components/footer';
import Header from '@/components/header';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { VetIllustration } from '@/components/ui/VetIllustration';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ServiceLayoutProps {
  title: string;
  subtitle: string;
  intro: {
    heading: string;
    paragraphs: string[];
  };
  features: Feature[];
}

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md border-t-4 border-t-green-600 flex flex-col gap-3">
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-green-600" />
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

export function ServiceLayout({ title, subtitle, intro, features }: ServiceLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow flex flex-col items-center p-0 w-full">

        <PageHero title={title} subtitle={subtitle} />

        {/* Intro */}
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 py-12 px-4 md:px-8">
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">
              {intro.heading}
            </h2>
            {intro.paragraphs.map((p, i) => (
              <p key={i} className="text-base text-gray-700 mb-4 leading-relaxed">{p}</p>
            ))}
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <VetIllustration />
          </div>
        </div>

        <div className="h-2 bg-green-600 w-full" />

        {/* Destaques */}
        <div className="w-full bg-gray-50 py-10 px-4 md:px-8">
          <h2 className="text-2xl font-bold text-green-600 text-center mb-8">Por que escolher a CliniVet?</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>

        <div className="h-2 bg-green-600 w-full" />

        {/* CTA */}
        <div className="w-full bg-green-600 py-10 px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Pronto para cuidar do seu pet?</h2>
          <p className="text-green-100 mb-6 max-w-lg mx-auto">Entre em contato e agende uma consulta. Nossa equipe está pronta para atender você.</p>
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
