import { Activity, Dumbbell, Waves } from 'lucide-react';
import { ServiceLayout } from '../ServiceLayout';

export function ReabilitView() {
  return (
    <ServiceLayout
      title="Reabilitação e Terapia"
      subtitle="Recuperação física e bem-estar para o seu pet com técnicas avançadas."
      intro={{
        heading: 'Terapia Animal e Reabilitação',
        paragraphs: [
          'A terapia animal é essencial para a recuperação física e emocional de animais que passaram por traumas ou procedimentos cirúrgicos. A reabilitação ajuda na recuperação muscular e motora, promovendo bem-estar e qualidade de vida.',
          'Utilizamos técnicas como fisioterapia, hidroterapia e exercícios de fortalecimento, sempre adaptados às necessidades específicas de cada animal.',
        ],
      }}
      features={[
        {
          icon: Activity,
          title: 'Fisioterapia',
          description: 'Exercícios terapêuticos para recuperação de mobilidade, força muscular e coordenação motora.',
        },
        {
          icon: Waves,
          title: 'Hidroterapia',
          description: 'Reabilitação em meio aquático com baixo impacto nas articulações, ideal para pós-operatório.',
        },
        {
          icon: Dumbbell,
          title: 'Fortalecimento muscular',
          description: 'Protocolos personalizados para reforçar a musculatura e prevenir novas lesões.',
        },
      ]}
    />
  );
}
