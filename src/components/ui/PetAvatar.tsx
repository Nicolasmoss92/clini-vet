interface PetAvatarProps {
  foto?: string | null;
  nome: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-xl',
};

export default function PetAvatar({ foto, nome, size = 'md' }: PetAvatarProps) {
  const sizeClass = sizeMap[size];
  return (
    <div
      className={`${sizeClass} rounded-full overflow-hidden border-2 border-green-200 bg-green-50 flex-shrink-0 flex items-center justify-center`}
    >
      {foto ? (
        <img src={foto} alt={nome} className="w-full h-full object-cover" />
      ) : (
        <span className="text-green-400">🐾</span>
      )}
    </div>
  );
}
