interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, placeholder = "Tìm kiếm..." }: SearchInputProps) => (
  <input
    className="module-search"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
  />
);

export default SearchInput;
