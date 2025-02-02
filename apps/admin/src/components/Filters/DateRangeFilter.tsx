import React from 'react';
import { FiFilter, FiCalendar } from 'react-icons/fi';

interface DateRangeFilterProps {
  dateRange: {
    start: string;
    end: string;
  };
  selectedPeriod: string;
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onPeriodChange: (period: string) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  selectedPeriod,
  onDateRangeChange,
  onPeriodChange,
  filterOpen,
  setFilterOpen,
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
      >
        <FiFilter />
        <span>Filter</span>
      </button>
      {filterOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="space-y-4">
            <div className="space-y-2">
              <button
                onClick={() => onPeriodChange('today')}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  selectedPeriod === 'today' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => onPeriodChange('week')}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  selectedPeriod === 'week' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => onPeriodChange('month')}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  selectedPeriod === 'month' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                This Month
              </button>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Range
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-gray-400" />
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    value={dateRange.start}
                    onChange={(e) =>
                      onDateRangeChange({ ...dateRange, start: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-gray-400" />
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    value={dateRange.end}
                    onChange={(e) =>
                      onDateRangeChange({ ...dateRange, end: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter; 