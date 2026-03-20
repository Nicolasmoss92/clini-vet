'use client';

interface TimeSlotPickerProps {
  selectedTime: string;
  onSelectTime: (time: string) => void;
  occupiedTimes: string[]; // HH:mm[]
}

function generateSlots(): string[] {
  const slots: string[] = [];
  for (let h = 8; h <= 17; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  slots.push('18:00');
  return slots;
}

const SLOTS = generateSlots();

export function TimeSlotPicker({ selectedTime, onSelectTime, occupiedTimes }: TimeSlotPickerProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-md p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">Selecione um horário</p>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {SLOTS.map((slot) => {
          const occupied = occupiedTimes.includes(slot);
          const selected = slot === selectedTime;

          return (
            <button
              key={slot}
              disabled={occupied}
              onClick={() => onSelectTime(slot)}
              className={`
                py-2 rounded-lg text-xs font-medium transition duration-150 border
                ${occupied
                  ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                  : selected
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50'
                }
              `}
            >
              {slot}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-600" />
          <span className="text-xs text-gray-400">Selecionado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-50 border border-red-200" />
          <span className="text-xs text-gray-400">Ocupado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white border border-gray-200" />
          <span className="text-xs text-gray-400">Disponível</span>
        </div>
      </div>
    </div>
  );
}
