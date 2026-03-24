import { Camera, Heart, Home } from 'lucide-react';
import { ServiceLayout } from '../ServiceLayout';

export function PetSisterView() {
  return (
    <ServiceLayout
      title="Pet Sister"
      subtitle="Cuidados personalizados para o seu pet no conforto da sua casa."
      intro={{
        heading: 'Serviço Pet Sister na CliniVet',
        paragraphs: [
          'Nosso serviço de Pet Sister é ideal para cuidar do seu pet enquanto você viaja ou precisa se ausentar. Garantimos que seu animal esteja seguro, feliz e bem cuidado em sua ausência.',
          'Além de cuidados essenciais como alimentação, passeios e recreação, oferecemos monitoramento integral com transmissão ao vivo ou gravações enviadas diretamente para o seu celular.',
        ],
      }}
      features={[
        {
          icon: Home,
          title: 'No conforto de casa',
          description: 'Seu pet permanece em seu próprio ambiente, reduzindo o estresse da ausência do tutor.',
        },
        {
          icon: Camera,
          title: 'Monitoramento em tempo real',
          description: 'Acompanhe seu pet com transmissão ao vivo ou gravações enviadas direto para o seu celular.',
        },
        {
          icon: Heart,
          title: 'Cuidado personalizado',
          description: 'Profissionais capacitados e dedicados ao bem-estar e segurança do seu animal.',
        },
      ]}
    />
  );
}
