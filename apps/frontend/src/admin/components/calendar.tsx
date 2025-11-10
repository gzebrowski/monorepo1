import React, { useState, useRef, useEffect } from 'react';

export type CalendarProps = {
  date?: Date | null;
  onDateChange: (date: Date | null) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export const Calendar: React.FC<CalendarProps> = (props: CalendarProps) => {
  const { date, onDateChange, disabled = false, placeholder = 'Select date...', className = '' } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return date || new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Months names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days of week
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Format date to ISO string (YYYY-MM-DD)
  const formatDateToISO = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle input click
  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
      setViewMode('days');
    }
  };

  // Handle date selection
  const handleDateSelect = (selectedDate: Date) => {
    onDateChange(selectedDate);
    setIsOpen(false);
  };

  // Handle month selection
  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentDate.getFullYear(), month, 1);
    setCurrentDate(newDate);
    setViewMode('days');
  };

  // Handle year selection
  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, currentDate.getMonth(), 1);
    setCurrentDate(newDate);
    setViewMode('days');
  };

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate years
  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate decade
  const navigateDecade = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setFullYear(newDate.getFullYear() - 10);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 10);
    }
    setCurrentDate(newDate);
  };

  // Get days in month
  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: (Date | null)[] = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  };

  // Get years for year view
  const getYearsForDecade = (date: Date): number[] => {
    const year = date.getFullYear();
    const startYear = Math.floor(year / 10) * 10;
    const years: number[] = [];
    for (let i = startYear; i < startYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (checkDate: Date): boolean => {
    return date ? checkDate.toDateString() === date.toDateString() : false;
  };

  // Check if date is in current month
  const isCurrentMonth = (checkDate: Date): boolean => {
    return checkDate.getMonth() === currentDate.getMonth();
  };

  const inputValue = date ? formatDateToISO(date) : '';
  
  const baseInputClass = `
    w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-colors duration-200 cursor-pointer
  `;
  
  const disabledInputClass = disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white';
  const inputClass = `${baseInputClass} ${disabledInputClass} ${className}`;

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onClick={handleInputClick}
        readOnly
        disabled={disabled}
        className={inputClass}
      />

      {isOpen && !disabled && (
        <div className="absolute z-50 w-80 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => {
                if (viewMode === 'days') navigateMonth('prev');
                else if (viewMode === 'months') navigateYear('prev');
                else navigateDecade('prev');
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center space-x-2">
              {viewMode === 'days' && (
                <>
                  <button
                    type="button"
                    onClick={() => setViewMode('months')}
                    className="px-2 py-1 hover:bg-gray-100 rounded text-sm font-medium"
                  >
                    {monthNames[currentDate.getMonth()]}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('years')}
                    className="px-2 py-1 hover:bg-gray-100 rounded text-sm font-medium"
                  >
                    {currentDate.getFullYear()}
                  </button>
                </>
              )}
              {viewMode === 'months' && (
                <button
                  type="button"
                  onClick={() => setViewMode('years')}
                  className="px-2 py-1 hover:bg-gray-100 rounded text-sm font-medium"
                >
                  {currentDate.getFullYear()}
                </button>
              )}
              {viewMode === 'years' && (
                <span className="px-2 py-1 text-sm font-medium">
                  {Math.floor(currentDate.getFullYear() / 10) * 10} - {Math.floor(currentDate.getFullYear() / 10) * 10 + 9}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (viewMode === 'days') navigateMonth('next');
                else if (viewMode === 'months') navigateYear('next');
                else navigateDecade('next');
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Days view */}
          {viewMode === 'days' && (
            <div>
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => {
                  if (!day) return <div key={index} />;
                  
                  const isSelectedDay = isSelected(day);
                  const isTodayDay = isToday(day);
                  const isCurrentMonthDay = isCurrentMonth(day);
                  
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      className={`
                        p-2 text-sm rounded hover:bg-blue-50 transition-colors
                        ${isSelectedDay ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                        ${!isSelectedDay && isTodayDay ? 'bg-blue-100 text-blue-700' : ''}
                        ${!isCurrentMonthDay ? 'text-gray-400' : 'text-gray-900'}
                      `}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Months view */}
          {viewMode === 'months' && (
            <div className="grid grid-cols-3 gap-2">
              {monthNames.map((month, index) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthSelect(index)}
                  className={`
                    p-3 text-sm rounded hover:bg-blue-50 transition-colors
                    ${currentDate.getMonth() === index ? 'bg-blue-100 text-blue-700' : 'text-gray-900'}
                  `}
                >
                  {month}
                </button>
              ))}
            </div>
          )}

          {/* Years view */}
          {viewMode === 'years' && (
            <div className="grid grid-cols-2 gap-2">
              {getYearsForDecade(currentDate).map(year => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  className={`
                    p-3 text-sm rounded hover:bg-blue-50 transition-colors
                    ${currentDate.getFullYear() === year ? 'bg-blue-100 text-blue-700' : 'text-gray-900'}
                  `}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Today button */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => handleDateSelect(new Date())}
              className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
