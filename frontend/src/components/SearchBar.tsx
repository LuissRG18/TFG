import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface Props {
  defaultValue?: string;
  size?: 'md' | 'lg';
  placeholder?: string;
}

const SearchBar = ({ defaultValue = '', size = 'md', placeholder = 'Buscar artículos, autores, áreas...' }: Props) => {
  const [query, setQuery] = useState(defaultValue);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`search-bar ${size === 'lg' ? 'search-bar-lg' : ''}`}>
      <Search size={size === 'lg' ? 20 : 16} className="search-icon" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      <button type="submit" className={size === 'lg' ? 'btn-primary' : 'btn-primary-sm'}>
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;

