interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <div className="w-full bg-green-600 py-4 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{title}</h1>
      {subtitle && (
        <p className="text-green-100 text-base md:text-lg max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
