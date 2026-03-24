interface VetProfileProps {
  src: string;
  name: string;
  formation: string;
}

export function VetProfile({ src, name, formation }: VetProfileProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={src}
        alt={name}
        className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-green-600"
      />
      <div className="text-center">
        <p className="font-semibold text-gray-800 text-lg">{name}</p>
        <p className="text-sm text-gray-500 mt-1 max-w-xs leading-relaxed">{formation}</p>
      </div>
    </div>
  );
}
