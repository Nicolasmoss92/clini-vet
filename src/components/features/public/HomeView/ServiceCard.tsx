interface ServiceCardProps {
  href: string;
  title: string;
  description: string;
}

export function ServiceCard({ href, title, description }: ServiceCardProps) {
  return (
    <a href={href} className="group flex">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-green-600 flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-green-600 mb-3">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-grow">{description}</p>
        <span className="mt-4 inline-block bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300 text-center">
          Saiba mais
        </span>
      </div>
    </a>
  );
}
