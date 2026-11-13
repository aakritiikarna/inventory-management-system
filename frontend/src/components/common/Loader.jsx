const Loader = ({ text = "Loading...", fullScreen = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "min-h-screen" : "py-12"
      }`}
    >
      <div className="relative">
        <div className="w-14 h-14 border-4 border-blue-100 dark:border-slate-800 rounded-full"></div>
        <div className="absolute inset-0 w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <p className="mt-5 text-gray-600 dark:text-gray-300 font-medium">
        {text}
      </p>
    </div>
  );
};

export default Loader;
