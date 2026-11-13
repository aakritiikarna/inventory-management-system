const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
}) => {
  return (
    <div className="space-y-2">

      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          outline-none
          transition
          bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100
          ${
            error
              ? "border-red-500"
              : "border-gray-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
          }
        `}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

    </div>
  );
};

export default FormInput;