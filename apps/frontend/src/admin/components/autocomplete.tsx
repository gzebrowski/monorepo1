import React, { useState, useRef, useEffect } from 'react';

export type AutoCompleteOption = {
  label: string;
  value: string;
};
    
type AutoCompleteProps = {
  disabled?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  onInputChange?: (value: string) => void;
  onValueChange?: (value: string, label?: string | null) => void;
  value?: { label?: string | null; value?: string | null } | null;
  options?: AutoCompleteOption[];
  className?: string;
  loading?: boolean;
  maxHeight?: number;
  emitOnSetValue?: boolean;
};

export function AutoComplete(props: AutoCompleteProps) {
  const {
    disabled = false,
    emptyMessage = 'No options found',
    placeholder = 'Type to search...',
    onInputChange,
    onValueChange,
    value,
    options = [],
    className = '',
    loading = false,
    maxHeight = 200,
    emitOnSetValue = false,
  } = props;

  const [inputValue, setInputValue] = useState(value?.label || '');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<AutoCompleteOption[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on input value
  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
    setHighlightedIndex(-1);
  }, [inputValue, options]);

  // Update input value when external value changes
  useEffect(() => {
    if (!value || value.value === undefined || value.value === null) {
      setInputValue('');
      return;
    }
    setInputValue(value?.label || '');
    if (emitOnSetValue && value?.value !== undefined && value?.value !== null) {
      onValueChange?.(value.value, value.label);
    }
  }, [value]);

  // Close dropdown when clicking outside
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    onInputChange?.(newValue);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleOptionSelect = (option: AutoCompleteOption) => {
    setInputValue(option.label);
    setIsOpen(false);
    onValueChange?.(option.value, option.label);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const baseInputClass = `
    w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-colors duration-200
  `;

  const disabledInputClass = disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white';
  const inputClass = `${baseInputClass} ${disabledInputClass} ${className}`;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClass}
          autoComplete="off"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
          </div>
        )}
        
        {/* Dropdown arrow */}
        {!loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg 
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
          style={{ maxHeight: `${maxHeight}px` }}
        >
          <div className="overflow-y-auto max-h-full">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                {emptyMessage}
              </div>
            ) : (
              <ul role="listbox" className="py-1">
                {filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={highlightedIndex === index}
                    className={`
                      px-3 py-2 cursor-pointer text-sm transition-colors duration-150
                      ${highlightedIndex === index 
                        ? 'bg-blue-50 text-blue-900' 
                        : 'text-gray-900 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => handleOptionSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
