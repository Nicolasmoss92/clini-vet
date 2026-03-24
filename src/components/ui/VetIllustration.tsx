interface VetIllustrationProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function VetIllustration({ src = '/teste.webp', alt = 'Veterinária com um pet', className = '' }: VetIllustrationProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-64 h-64 md:w-96 md:h-96 object-cover rounded-full border-4 border-green-600 ${className}`}
    />
  );
}
