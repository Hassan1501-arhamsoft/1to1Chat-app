import "../styles/SearchBar.css";

function SearchBar({ onSearch }) {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search users..."
        onChange={handleChange}
      />
    </div>
  );
}

export default SearchBar;