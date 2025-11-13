import React, { useState, useRef, useEffect } from 'react';

import { Calendar } from './calendar';

type DatetimePickerProps = {
  value?: Date | null;
  onChange: (date: Date | null) => void;
};

export function DatetimePicker({ value, onChange }: DatetimePickerProps) {
  const [date, setDate] = useState<Date | null>(value || null);
  const [hours, setHours] = useState<number>(value ? value.getHours() : 0);
  const [minutes, setMinutes] = useState<number>(value ? value.getMinutes() : 0);
  useEffect(() => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(hours || 0);
      newDate.setMinutes(minutes || 0);
      onChange(newDate);
    } else {
      onChange(null);
    }
  }, [date, hours, minutes, onChange]);
  useEffect(() => {
    if (value) {
      setDate(value);
      setHours(value.getHours());
      setMinutes(value.getMinutes());
    } else {
      setDate(null);
      setHours(0);
      setMinutes(0);
    }
  }, [value]);

  return (
    <div className="space-y-4">
      <Calendar date={date} onDateChange={setDate} />
      
      {date && (
        <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Hour:</label>
            <select
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Min:</label>
            <select
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const now = new Date();
                setHours(now.getHours());
                setMinutes(now.getMinutes());
              }}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Now
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}