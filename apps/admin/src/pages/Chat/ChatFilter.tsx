import React from 'react';

interface ChatFilterProps {
  onFilterChange: (filter: string) => void;
}

const ChatFilter = ({ onFilterChange }: ChatFilterProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onFilterChange('all')}
        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-opacity-90"
      >
        All
      </button>
      <button
        onClick={() => onFilterChange('unread')}
        className="px-4 py-2 rounded-lg border border-stroke hover:bg-gray-1 dark:hover:bg-meta-4"
      >
        Unread
      </button>
    </div>
  );
};

export default ChatFilter; 