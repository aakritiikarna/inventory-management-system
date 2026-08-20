import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="relative w-full md:w-80">

      <FaSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          pl-11
          pr-4
          py-3
          rounded-xl
          border
          border-gray-300
          bg-white
          outline-none
          transition
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
        "
      />

    </div>
  );
};

export default SearchBar;