import React from 'react';

interface SearchSectionProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ searchTerm, onSearchTermChange, onSearch }) => {
  return (
    <div className="search-section">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}  // Обновляем searchTerm при вводе текста
        placeholder="Search for characters"
      />
      <button onClick={onSearch}>Search</button>  {/* Вызываем fetchPeople при нажатии на кнопку поиска */}
    </div>
  );
};

export default SearchSection;
