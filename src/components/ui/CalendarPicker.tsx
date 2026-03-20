'use client';

import { useState } from 'react';

interface SingleProps {
  multi?: false;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedDates?: never;
  onSelectDates?: never;
  occupiedDates?: string[];
}

interface MultiProps {
  multi: true;
  selectedDates: string[];
  onSelectDates: (dates: string[]) => void;
  selectedDate?: never;
  onSelectDate?: never;
  occupiedDates?: string[];
}

type CalendarPickerProps = SingleProps | MultiProps;

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function CalendarPicker(props: CalendarPickerProps) {
  const { multi = false, occupiedDates = [] } = props;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString().split('T')[0];

  const initialDate = multi
    ? (props.selectedDates?.[0] ? new Date(props.selectedDates[0] + 'T00:00:00') : new Date())
    : (props.selectedDate ? new Date(props.selectedDate + 'T00:00:00') : new Date());

  const [viewDate, setViewDate] = useState({ year: initialDate.getFullYear(), month: initialDate.getMonth() });

  const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay();
  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();

  const prevMonth = () => setViewDate((v) => {
    const d = new Date(v.year, v.month - 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const nextMonth = () => setViewDate((v) => {
    const d = new Date(v.year, v.month + 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const toISO = (day: number) => {
    const m = String(viewDate.month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewDate.year}-${m}-${d}`;
  };

  const isPast = (day: number) => new Date(viewDate.year, viewDate.month, day) < today;
  const isWeekend = (day: number) => {
    const dow = new Date(viewDate.year, viewDate.month, day).getDay();
    return dow === 0 || dow === 6;
  };

  const handleClick = (iso: string) => {
    if (multi) {
      const current = props.selectedDates ?? [];
      const next = current.includes(iso)
        ? current.filter((d) => d !== iso)
        : [...current, iso].sort();
      props.onSelectDates(next);
    } else if (props.onSelectDate) {
      props.onSelectDate(iso);
    }
  };

  const isSelected = (iso: string) =>
    multi ? (props.selectedDates ?? []).includes(iso) : props.selectedDate === iso;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-md p-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition text-lg leading-none">‹</button>
        <span className="text-sm font-semibold text-gray-700">{MONTHS[viewDate.month]} {viewDate.year}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition text-lg leading-none">›</button>
      </div>

      {/* Cabeçalho dias */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Células */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const iso = toISO(day);
          const disabled = isPast(day) || isWeekend(day);
          const selected = isSelected(iso);
          const isToday = iso === todayISO;
          const hasEvent = occupiedDates.includes(iso);

          return (
            <button
              key={iso}
              disabled={disabled}
              onClick={() => handleClick(iso)}
              className={[
                'relative mx-auto w-8 h-8 rounded-full text-xs font-medium transition duration-150',
                disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer',
                selected ? 'bg-green-600 text-white' : '',
                !selected && isToday ? 'border border-green-600 text-green-600' : '',
                !selected && !isToday && !disabled ? 'text-gray-700 hover:bg-green-50 hover:text-green-600' : '',
              ].join(' ')}
            >
              {day}
              {hasEvent && !selected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Contador multi-select */}
      {multi && (props.selectedDates?.length ?? 0) > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-center">
          <span className="text-xs font-medium text-green-600">
            {props.selectedDates!.length} dia{props.selectedDates!.length > 1 ? 's' : ''} selecionado{props.selectedDates!.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Legenda */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-gray-400">Com agendamento</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border border-green-600" />
          <span className="text-xs text-gray-400">Hoje</span>
        </div>
      </div>
    </div>
  );
}
