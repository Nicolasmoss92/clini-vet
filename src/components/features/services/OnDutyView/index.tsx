import { Clock, ShieldCheck, Stethoscope } from 'lucide-react';
import { ServiceLayout } from '../ServiceLayout';

export function OnDutyView() {
  return (
    <ServiceLayout
      title="Plantões"
      subtitle="Atendimento 24 horas para emergências e urgências veterinárias."
      intro={{
        heading: 'Serviço de Plantões na CliniVet',
        paragraphs: [
          'Nosso serviço de plantões está disponível 24 horas por dia, 7 dias por semana, garantindo que seu animal receba o cuidado necessário a qualquer hora, incluindo emergências e urgências veterinárias.',
          'Nossa equipe de veterinários experientes está preparada para lidar com as situações mais diversas, desde atendimento clínico até cirurgias de emergência, com todo o equipamento e suporte necessário.',
        ],
      }}
      features={[
        {
          icon: Clock,
          title: 'Disponível 24h',
          description: 'Atendimento ininterrupto todos os dias da semana, inclusive feriados.',
        },
        {
          icon: Stethoscope,
          title: 'Equipe especializada',
          description: 'Veterinários experientes prontos para atender desde consultas até cirurgias de emergência.',
        },
        {
          icon: ShieldCheck,
          title: 'Ambiente completo',
          description: 'Estrutura equipada para garantir segurança e conforto ao seu pet em qualquer situação.',
        },
      ]}
    />
  );
}
