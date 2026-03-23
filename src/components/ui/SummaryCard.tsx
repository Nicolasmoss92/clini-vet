import Link from 'next/link';

interface SummaryCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  borderColor: string;
  textColor: string;
  href?: string;
}

function CardContent({
  label,
  value,
  subtitle,
  borderColor,
  textColor,
}: Omit<SummaryCardProps, 'href'>) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 border-t-4 ${borderColor} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6`}
    >
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

export default function SummaryCard({
  label,
  value,
  subtitle,
  borderColor,
  textColor,
  href,
}: SummaryCardProps) {
  if (href) {
    return (
      <Link href={href}>
        <CardContent
          label={label}
          value={value}
          subtitle={subtitle}
          borderColor={borderColor}
          textColor={textColor}
        />
      </Link>
    );
  }

  return (
    <CardContent
      label={label}
      value={value}
      subtitle={subtitle}
      borderColor={borderColor}
      textColor={textColor}
    />
  );
}
