export interface Person {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    homeworld: string;
    films: string[];
    species: string[];
    vehicles: string[];
    starships: string[];
    created: string;
    edited: string;
    url: string;
  }
  
  export interface AppState {
    searchTerm: string;
    characters: Person[];
    error: string | null;
    loading: boolean;
  }
  
  export interface SearchSectionProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    onSearch: () => void;
  }
  
  export interface ComponentProps {}
  
  export interface ComponentState {
    hasErrorOccurred: boolean;
  }
  
  export interface Props {
    children: React.ReactNode;
  }
  
  export interface State {
    hasError: boolean;
  }
  
  export interface CharacterCardProps {
    character: Person;
  }
  