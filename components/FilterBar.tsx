
import React from 'react';

interface FilterBarProps {
  onDateChange: (date: Date | null) => void;
  isFiltering: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ onDateChange, isFiltering }) => {
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const handleDateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    if (dateValue) {
      // The input value is in YYYY-MM-DD format. Appending T00:00:00Z treats it as UTC midnight
      // to avoid timezone-related issues where the date might shift by a day.
      const date = new Date(dateValue + 'T00:00:00Z');
      onDateChange(date);
    } else {
      // If the input is cleared, reset the filter
      onDateChange(null);
    }
  };

  const handleClearFilter = () => {
    if (dateInputRef.current) {
      dateInputRef.current.value = '';
    }
    onDateChange(null);
  };

  // Get today's date in YYYY-MM-DD format for the 'max' attribute of the date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="px-4 py-3 flex items-center justify-between gap-3 bg-black/30 border-b border-[#ff4141]/30 flex-shrink-0">
      <fieldset className="flex-grow border border-[#ff4141]/50">
        <legend className="text-xs text-[#ff4141] px-1 ml-3">
          Filter by Date
        </legend>
        <input
          id="date-picker"
          ref={dateInputRef}
          type="date"
          onChange={handleDateInputChange}
          max={today}
          className="w-full bg-transparent text-white px-3 py-1.5 focus:outline-none appearance-none"
          style={{ colorScheme: 'dark' }}
        />
      </fieldset>
      {isFiltering && (
        <button
          onClick={handleClearFilter}
          className="bg-transparent hover:bg-[#ff4141]/20 border border-[#ff4141] text-[#ff4141] font-semibold py-2 px-4 transition-colors duration-200 text-sm whitespace-nowrap"
          aria-label="Show latest papers"
        >
          Show Latest
        </button>
      )}
    </div>
  );
};

export default FilterBar;
