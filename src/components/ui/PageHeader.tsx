interface PageHeaderProps {
  title: string;
  action?: {
    label: string;
    onClick: () => void;
    active?: boolean;
    activeLabel?: string;
  };
}

export default function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-green-600">{title}</h1>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300"
        >
          {action.active && action.activeLabel ? action.activeLabel : action.label}
        </button>
      )}
    </div>
  );
}
