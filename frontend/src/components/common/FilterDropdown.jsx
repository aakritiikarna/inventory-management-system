const FilterDropdown = ({
  label = "Filter",
  value,
  onChange,
  options = [],
}) => {
  return (
    <div className="flex items-center gap-3">

      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="
          px-4
          py-2.5
          rounded-xl
          border
          border-gray-300
          bg-white
          text-gray-700
          outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition
        "
      >

        {options.map((option) => (

          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>

        ))}

      </select>

    </div>
  );
};

export default FilterDropdown;