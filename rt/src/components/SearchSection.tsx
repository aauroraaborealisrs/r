import React from "react";

interface SearchSectionProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ searchTerm, onSearchTermChange, onSearch }) => {
  return (
    <div className="search-section">
      <form
        id="search-form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <input
          id="q"
          aria-label="Search people"
          placeholder="Search"
          type="search"
          name="q"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchSection;
